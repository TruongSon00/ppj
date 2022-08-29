import { SUPER_ADMIN } from './../constant/common';
import { escapeCharForSearch } from './../utils/common';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user/user.entity';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { UserWarehouse } from '@entities/user-warehouse/user-warehouse.entity';
import { UserDepartment } from '@entities/user-department/user-department.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { UserFactory } from '@entities/user-factory/user-factory.entity';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcryptjs';
import { isDateString } from 'class-validator';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  /**
   * Validate user by password
   * @param username
   * @param password
   * @returns
   */
  public async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id AS id', 'u.password as password'])
      .where('username = :username', { username: username })
      .getRawOne();
    if (!user) return false;
    const isValidPassword = await bcrypt.compareSync(password, user.password);
    if (!isValidPassword) return false;

    return user;
  }

  /**
   * Create User Entity
   * @param userDto
   * @returns
   */
  public createEntity(userDto: CreateUserRequestDto): User {
    const user = new User();

    user.email = userDto.email;
    user.username = userDto.username;
    user.fullName = userDto.fullName;
    user.password = userDto.password;
    user.companyId = userDto.companyId;
    user.dateOfBirth = userDto.dateOfBirth;
    user.code = userDto.code;
    user.phone = userDto.phone;
    user.createdBy = userDto.userId;

    return user;
  }
  public createUserRoleEntity(
    userId: number,
    departmentId: number,
    userRoleId: number,
  ): UserRole {
    const userRole = new UserRole();

    (userRole.userId = userId),
      (userRole.userRoleId = userRoleId),
      (userRole.departmentId = departmentId);

    return userRole;
  }

  public createUserDepartmentEntity(
    userId: number,
    departmentId: number,
  ): UserDepartment {
    const userDepartment = new UserDepartment();

    (userDepartment.userId = userId),
      (userDepartment.departmentId = departmentId);

    return userDepartment;
  }

  public createUserFactoryEntity(
    userId: number,
    factoryId: number,
  ): UserFactory {
    const userFactory = new UserFactory();

    (userFactory.userId = userId), (userFactory.factoryId = factoryId);

    return userFactory;
  }

  public createUserWarehouseEntity(
    userId: number,
    warehouseId: number,
  ): UserWarehouse {
    const userWarehouse = new UserWarehouse();

    userWarehouse.warehouseId = warehouseId;
    userWarehouse.userId = userId;

    return userWarehouse;
  }

  public async checkUniqueUser(condition: any): Promise<any> {
    return await this.usersRepository.find({
      where: condition,
      select: ['id'],
    });
  }

  /**
   * Get use detail
   * @param id number
   * @returns
   */
  public async getDetail(
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    withoutExtraInfo?: boolean,
  ): Promise<any> {
    const relations = !withoutExtraInfo
      ? [
          'departmentSettings',
          'userRoleSettings',
          'factories',
          'factories.company',
          'userWarehouses',
          'userRoles',
        ]
      : ['departmentSettings', 'userRoleSettings', 'factories'];
    const user = await this.usersRepository.findOne({
      relations: relations,
      where: { id: id },
    });

    return user;
  }

  /**
   * Get user List
   * @param request
   * @returns
   */
  public async getListUser(payload, arrWarehouseIdFilter?): Promise<any> {
    const { skip, take, keyword, sort, filter, isGetAll } = payload;
    let query = this.usersRepository
      .createQueryBuilder('u')
      .select([
        'u.id AS id',
        'u.full_name AS "fullName"',
        'u.code AS "code"',
        'u.email AS "email"',
        'u.username AS "username"',
        'u.company_id AS "companyId"',
        'u.date_of_birth AS "dateOfBirth"',
        'u.phone AS "phone"',
        'u.status AS "status"',
        'u.created_by AS "createdBy"',
        'u.createdAt AS "createdAt"',
        'u.updatedAt AS "updatedAt"',
        `CASE WHEN COUNT(uw) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', uw.warehouseId)) END AS "userWarehouses"`,
        `CASE WHEN COUNT(f) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', f.id, 'name', f.name)) END AS "factories"`,
        `CASE WHEN COUNT(urs) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', urs.id, 'name', urs.name, 'code', urs.code)) END AS "userRoleSettings"`,
        `CASE WHEN COUNT(ur) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', ur.id, 'userRoleId', ur.user_role_id, 'departmentId', ur.department_id)) END AS "userRoles"`,
        `CASE WHEN COUNT(ds) = 0 THEN '[]' ELSE JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT('id', ds.id, 'name', ds.name)) END AS "departmentSettings"`,
      ])
      .leftJoin('u.userRoleSettings', 'urs')
      .leftJoin('u.departmentSettings', 'ds')
      .leftJoin('u.userWarehouses', 'uw')
      .leftJoin('u.factories', 'f')
      .leftJoin('u.userRoles', 'ur');

    if (!isEmpty(keyword)) {
      query
        .orWhere(`lower("u"."username") like lower(:pkeyWord) escape '\\'`, {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        })
        .orWhere('lower("u"."full_name") like lower(:pkeyWord)', {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        })
        .orWhere('lower("u"."code") like lower(:pkeyWord)', {
          pkeyWord: `%${escapeCharForSearch(keyword)}%`,
        });
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'username':
            query.andWhere(
              `lower("u"."username") like lower(:username) escape '\\'`,
              {
                username: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'fullName':
            query.andWhere(
              `lower("u"."full_name") like lower(:fullName) escape '\\'`,
              {
                fullName: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'status':
            query.andWhere(`"u"."status" = :status`, {
              status: item.text,
            });
            break;
          case 'createdAt':
            query.andWhere(
              `"u"."created_at"::DATE >= :createdAtFrom::DATE AND "u"."created_at"::DATE <= :createdAtTo::DATE`,
              {
                createdAtFrom: isDateString(item.text.split('|')[0])
                  ? item.text.split('|')[0]
                  : new Date(),
                createdAtTo: isDateString(item.text.split('|')[1])
                  ? item.text.split('|')[1]
                  : new Date(),
              },
            );
            break;
          case 'departmentName':
            query.andWhere(
              `lower("ds"."name") like lower(:departmentSetting) escape '\\'`,
              {
                departmentSetting: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'roleName':
            query.andWhere(
              `lower("urs"."name") like lower(:userRoleSetting) escape '\\'`,
              {
                userRoleSetting: `%${escapeCharForSearch(item.text)}%`,
              },
            );
            break;
          case 'userId':
            query.andWhere(`u.id = :userId`, {
              userId: item.text,
            });
            break;
          case 'code':
            query.andWhere(`lower("u"."code") like lower(:code) escape '\\'`, {
              code: `%${escapeCharForSearch(item.text)}%`,
            });
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(arrWarehouseIdFilter)) {
      query.andWhere((q) => {
        const subQuery = q
          .subQuery()
          .select('uw.userId')
          .distinct()
          .from(UserWarehouse, 'uw')
          .where('uw.warehouseId IN (:...arrWarehouseIdFilter)', {
            arrWarehouseIdFilter: arrWarehouseIdFilter,
          });
        return `u.id IN ${subQuery.getQuery()}`;
      });
    }
    if (payload.ids) {
      query.andWhere(`"u"."id" IN (:...ids)`, {
        ids: payload.ids.split(','),
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'username':
            query = query.orderBy('"u"."username"', item.order);
            break;
          case 'fullName':
            query = query.orderBy('"u"."full_name"', item.order);
            break;
          case 'code':
            query = query.orderBy('"u"."code"', item.order);
            break;
          default:
            break;
        }
      });
    } else {
      query.orderBy('u.id', 'DESC');
    }

    query.groupBy('u.id');

    const data = parseInt(isGetAll)
      ? await query.getRawMany()
      : await query.offset(skip).limit(take).getRawMany();
    const count = await query.getCount();

    return {
      data: data,
      count: count,
    };
  }

  public async delete(id: number): Promise<any> {
    return await this.usersRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id: id })
      .execute();
  }

  public isSuperAdmin(code: string): boolean {
    return code === SUPER_ADMIN.code;
  }

  //Todo Can Query them Department
  public async getUserNotInRoleCodes(roleCodes: string[]): Promise<any> {
    const query = await this.usersRepository
      .createQueryBuilder('u')
      .select([`u.id as "userId"`])
      .leftJoin(UserRole, 'ur', 'ur.user_id = u.id')
      .leftJoin(UserRoleSetting, 'urs', 'urs.id = ur.user_role_id');
    if (roleCodes) {
      query.where(`urs.code NOT IN (:roleCodes)`, { roleCodes });
    }
    return query.getRawMany();
  }

  async getCount(): Promise<any> {
    return await this.usersRepository
      .createQueryBuilder('c')
      .select([`COUNT("c"."id") AS "cnt"`])
      .getRawOne();
  }

  getUsersByCondition(condition: string): Promise<any[]> {
    return this.usersRepository.createQueryBuilder().where(condition).getMany();
  }
}
