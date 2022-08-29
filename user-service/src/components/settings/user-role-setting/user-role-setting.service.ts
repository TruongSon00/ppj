import { Inject, Injectable } from '@nestjs/common';
import { UserRoleSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-setting.repository.interface';
import { CreateUserRoleSettingRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-role-setting.request.dto';
import { ApiError } from '@utils/api.error';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ErrorMessageEnum } from '@constant/error-message.enum';
import { plainToClass } from 'class-transformer';
import { CreateUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-role-setting.response.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { UserRoleSettingServiceInterface } from '@components/settings/user-role-setting/interface/user-role-setting.service.interface';
import { CreateUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/create-user-permission.request.dto';
import { CreateUserPermissionResponseDto } from '@components/settings/user-role-setting/dto/response/create-user-permission.response.dto';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-permission-setting.repository.interface';
import { GetDepartmentIdsRequestDto } from '@components/settings/user-role-setting/dto/request/get-department-ids.request.dto';
import { GetUserRoleDepartmentRequestDto } from '@components/settings/user-role-setting/dto/request/get-user-role-department.request.dto';
import { DepartmentSettingRepositoryInterface } from '@components/settings/department-setting/interface/department-setting.repository.interface';
import { UserDepartmentRepositoryInterface } from '@components/settings/user-role-setting/interface/user-department.repository.interface';
import { UserRoleRepositoryInterface } from '@components/user-role/interface/user-role.repository.interface';
import { IdResponseDto } from '@components/settings/user-role-setting/dto/response/id-response.dto';
import { FinalCheckUserPermissionRequestDto } from '@components/settings/user-role-setting/dto/request/final-check-user-permission.request.dto';
import { PermissionForListRequestDto } from '@components/settings/user-role-setting/dto/request/permission-for-list.request.dto';
import { CheckPermissionDepartmentRequestDto } from '@components/settings/user-role-setting/dto/request/check-permission-department.request.dto';
import { CheckPermissionDepartmentResponseDto } from '@components/settings/user-role-setting/dto/response/check-permission-department.response.dto';
import { I18nService } from 'nestjs-i18n';
import { DeleteRequestDto } from '@components/settings/user-role-setting/dto/request/delete.request.dto';
import { DeleteSuccessfullyResponseDto } from '@components/settings/user-role-setting/dto/response/delete-successfully.response.dto';
import { GroupPermission } from '@components/settings/user-role-setting/dto/response/get-full-permisison-response.dto';
import { GetPermissionIdRequestDto } from '@components/settings/user-role-setting/dto/request/get-permission-id.request.dto';
import { GetPermissionIdResponseDto } from '@components/settings/user-role-setting/dto/response/get-permission-id.response.dto';
import { GetDepartmentIdResponseDto } from '@components/settings/user-role-setting/dto/response/get-department-id.response.dto';
import { PermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/permission-setting.repository.interface';
import { DepartmentPermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/department-permission-setting.repository.interface';
import { GroupPermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/group-permission-setting.repository.interface';
import { StatusPermission } from '@utils/constant';
import { flatMap, isEmpty, map, split, uniq } from 'lodash';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { DEPARMENT_SUPER_ADMIN, ROLE_SUPER_ADMIN } from '@constant/common';
import { GetPermissionByConditionRequestDto } from './dto/request/get-permission-by-condition.request.dto';
import {
  GetPermissionsByConditionResponseDto,
  PermissionSettingResponseDto,
} from './dto/response/get-permissions-by-condition.response.dto';

@Injectable()
export class UserRoleSettingService implements UserRoleSettingServiceInterface {
  constructor(
    @Inject('UserRoleSettingRepositoryInterface')
    private readonly userRoleSettingRepository: UserRoleSettingRepositoryInterface,

    @Inject('UserRolePermissionSettingRepositoryInterface')
    private readonly userRolePermissionSettingRepository: UserRolePermisisonSettingRepositoryInterface,

    @Inject('DepartmentSettingRepositoryInterface')
    private readonly departmentSettingRepository: DepartmentSettingRepositoryInterface,

    @Inject('UserDepartmentRepositoryInterface')
    private readonly userDepartmentRepository: UserDepartmentRepositoryInterface,

    @Inject('UserRoleRepositoryInterface')
    private readonly userRoleRepository: UserRoleRepositoryInterface,

    @Inject('PermissionSettingRepositoryInterface')
    private readonly permissionSettingRepository: PermissionSettingRepositoryInterface,

    @Inject('DepartmentPermissionSettingRepositoryInterface')
    private readonly departmentPermissionSettingRepository: DepartmentPermissionSettingRepositoryInterface,

    @Inject('GroupPermissionSettingRepositoryInterface')
    private readonly groupPermissionSettingRepository: GroupPermissionSettingRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  public async createUserRole(
    request: CreateUserRoleSettingRequestDto,
  ): Promise<ResponsePayload<CreateUserRoleSettingResponseDto | any>> {
    const condition = { name: request.name };
    const userRole = await this.userRoleSettingRepository.findOneByCondition(
      condition,
    );

    if (userRole) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        ErrorMessageEnum.NAME_ALREADY_EXISTS,
      ).toResponse();
    }

    const data = await this.userRoleSettingRepository.create(request);
    const response = plainToClass(CreateUserRoleSettingResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(ErrorMessageEnum.SUCCESS)
      .build();
  }

  async getAllUserRole(request?: any): Promise<any> {
    const data = await this.userRoleSettingRepository.findAll();
    return new ResponseBuilder(data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(ErrorMessageEnum.SUCCESS)
      .build();
  }

  public async setUserPermission(
    request: CreateUserPermissionRequestDto,
  ): Promise<ResponsePayload<CreateUserPermissionResponseDto | any>> {
    const permissionSettings = Object.assign({}, request.permissionSettings);
    for (const index of Object.keys(permissionSettings)) {
      const permission = permissionSettings[index];
      const condition = new CheckPermissionDepartmentRequestDto();
      condition.departmentId = permission.departmentId;
      condition.code = permission.code;

      const userPermission = {
        permissionSettingCode: permission.code,
        departmentId: permission.departmentId,
        userRoleId: permission.userRoleId,
      };
      if (permission.status) {
        const getUserPermission =
          await this.userRolePermissionSettingRepository.findOneByCondition(
            userPermission,
          );

        if (getUserPermission) continue;
        if (!getUserPermission) {
          await this.userRolePermissionSettingRepository.create(userPermission);
        }
      } else {
        const getUserPermission =
          await this.userRolePermissionSettingRepository.findOneByCondition(
            userPermission,
          );
        if (!getUserPermission) continue;
        if (getUserPermission) {
          await this.userRolePermissionSettingRepository.remove(
            getUserPermission.id,
          );
        }
      }
    }

    return new ResponseBuilder(request)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(ErrorMessageEnum.SUCCESS)
      .build();
  }

  async getDepartmentIds(
    request: GetDepartmentIdsRequestDto,
  ): Promise<ResponsePayload<IdResponseDto[] | any>> {
    const userRolePermissionSetting =
      await this.userRolePermissionSettingRepository.findOneByCondition({
        permissionSettingCode: request.permissionCode,
      });
    if (!userRolePermissionSetting) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
    const condition = {
      userId: request.userId,
      departmentId: userRolePermissionSetting.departmentId,
    };
    const data = await this.userDepartmentRepository.findOneByCondition(
      condition,
    );

    const response = plainToClass(
      IdResponseDto,
      { id: data.departmentId },
      { excludeExtraneousValues: true },
    );
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(ErrorMessageEnum.SUCCESS)
      .build();
  }

  async getUserRoleDepartment(
    request: GetUserRoleDepartmentRequestDto,
  ): Promise<ResponsePayload<IdResponseDto | any>> {
    const data = await this.userRoleRepository.findOneByCondition(request);
    const response = plainToClass(
      IdResponseDto,
      { id: data.userRoleId },
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(ErrorMessageEnum.SUCCESS)
      .build();
  }

  async checkUserPermission(request: any): Promise<ResponsePayload<any>> {
    const data =
      await this.userRolePermissionSettingRepository.checkUserPermission(
        request,
      );

    if (data.length > 0) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(ErrorMessageEnum.SUCCESS)
        .build();
    } else {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async checkUserPermissionForList(
    request: PermissionForListRequestDto,
  ): Promise<any> {
    const data =
      await this.userRolePermissionSettingRepository.findOneByCondition(
        request,
      );
    return new ResponseBuilder(data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(ErrorMessageEnum.SUCCESS)
      .build();
  }

  async finalCheckUserPermission(
    request: FinalCheckUserPermissionRequestDto,
  ): Promise<ResponsePayload<any>> {
    const arrPermissionCode = split(request.permissionCode, '|');
    const condition = {
      userId: request.userId,
      permissionCodes: arrPermissionCode,
    };

    const response = await this.checkUserPermission(condition);

    if (response.statusCode === ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(ErrorMessageEnum.SUCCESS)
        .build();
    } else {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async checkPermissionDepartment(
    request: CheckPermissionDepartmentRequestDto,
  ): Promise<CheckPermissionDepartmentResponseDto | any> {
    const code = request.code;
    const permissionId =
      await this.permissionSettingRepository.findOneByCondition({ code: code });
    if (!permissionId) {
      return false;
    }
    const condition = {
      permissionSettingCode: code,
      departmentId: request.departmentId,
    };

    const permissionDepartment =
      await this.departmentPermissionSettingRepository.findOneByCondition(
        condition,
      );

    if (!permissionDepartment) {
      return false;
    }
    return plainToClass(
      CheckPermissionDepartmentResponseDto,
      permissionDepartment,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async deletePermission(
    request: DeleteRequestDto,
  ): Promise<ResponsePayload<DeleteSuccessfullyResponseDto | any>> {
    try {
      const permission = await this.permissionSettingRepository.findOneById(
        request.id,
      );
      if (!permission) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      await this.permissionSettingRepository.remove(request.id);
      const response = plainToClass(
        DeleteSuccessfullyResponseDto,
        { id: request.id },
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }
  }
  //List Permission
  async getAllGroupPermission(request: any): Promise<ResponsePayload<any>> {
    const groupPermission =
      await this.groupPermissionSettingRepository.findAll();
    const fullyPermission = [];
    const userRole = await this.userRoleSettingRepository.findAll();
    for (const group of groupPermission) {
      const groupPermission = new GroupPermission();
      groupPermission.id = group.id;
      groupPermission.name = group.name;
      groupPermission.code = group.code;
      const groupPermissionId = group.id;
      const Permissions =
        await this.permissionSettingRepository.getPermissionsByIds(
          groupPermissionId,
        );
      const ModifiedPermissions = [];
      for (const individualPermission of Permissions) {
        const Roles = [];
        const ModifiedIndividualPermission = {
          id: individualPermission.id,
          name: individualPermission.name,
          code: individualPermission.code,
          roles: [],
        };
        for (const role of userRole) {
          const condition = {
            userRoleId: role.id,
            permissionId: individualPermission.id,
          };
          const rawValue =
            await this.userRolePermissionSettingRepository.findOneByCondition(
              condition,
            );
          let value = true;
          if (!rawValue) {
            value = false;
          }
          const individualRole = { name: role.name, value: value };
          await Roles.push(individualRole);
        }
        ModifiedIndividualPermission.roles = Roles;
        await ModifiedPermissions.push(ModifiedIndividualPermission);
      }
      groupPermission.permission = ModifiedPermissions;
      await fullyPermission.push(groupPermission);
    }
    return new ResponseBuilder(fullyPermission)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  //For Validate Authorization Function
  async getPermissionIdByCode(
    condition: GetPermissionIdRequestDto,
  ): Promise<ResponsePayload<GetPermissionIdResponseDto | any>> {
    const data = await this.permissionSettingRepository.findOneByCondition(
      condition,
    );
    const response = plainToClass(GetPermissionIdResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  async getDepartmentIdByPermission(
    condition: any,
  ): Promise<ResponsePayload<GetDepartmentIdResponseDto | any>> {
    const data =
      await this.departmentPermissionSettingRepository.findOneByCondition(
        condition,
      );
    const response = plainToClass(GetDepartmentIdResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  public async getPermissionCodeByName(
    request: string,
  ): Promise<ResponsePayload<any>> {
    const condition = { name: request };
    const data = await this.permissionSettingRepository.findOneByCondition(
      condition,
    );
    return new ResponseBuilder(data.code)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  public async getPermissionByUser(
    userRoleIds: number[],
    userDepartmentIds: number[],
  ): Promise<any> {
    const userRolePermissionSettings =
      await this.userRolePermissionSettingRepository.findByCondition({
        userRoleId: In(userRoleIds),
        departmentId: In(userDepartmentIds),
      });

    const permissionCodes = uniq(
      map(flatMap(userRolePermissionSettings), 'permissionSettingCode'),
    );

    return await this.permissionSettingRepository.findWithRelations({
      select: ['code'],
      where: {
        code: In(permissionCodes),
        status: StatusPermission.ACTIVE,
      },
    });
  }

  public async insertPermission(request): Promise<any> {
    const roleSuperAdmin =
      await this.userRoleSettingRepository.findOneByCondition({
        code: ROLE_SUPER_ADMIN.code,
      });

    const departmentSuperAdmin =
      await this.departmentSettingRepository.findOneByCondition({
        name: DEPARMENT_SUPER_ADMIN.name,
      });

    const dataRoleAndDepartment =
      roleSuperAdmin && departmentSuperAdmin
        ? [
            {
              departmentId: departmentSuperAdmin.id,
              userRoleId: roleSuperAdmin.id,
            },
          ]
        : [];

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(
        GroupPermissionSettingEntity,
        request.groupPermission,
      );
      await queryRunner.manager.save(
        PermissionSettingEntity,
        request.permission,
      );

      //auto set permission super-admin
      if (dataRoleAndDepartment.length > 0) {
        const permissionCodes = map(request.permission, 'code');
        const userRolePermissionSettingsExist =
          await this.userRolePermissionSettingRepository.findByCondition({
            permissionSettingCode: In(permissionCodes),
            userRoleId: roleSuperAdmin.id,
            departmentId: departmentSuperAdmin.id,
          });
        if (!isEmpty(userRolePermissionSettingsExist)) {
          await queryRunner.manager.delete(
            UserRolePermissionSettingEntity,
            userRolePermissionSettingsExist,
          );
        }

        const dataUserRolePermissionSettings =
          await this.setDataUserRolePermissionSetting(
            dataRoleAndDepartment,
            request.permission,
          );
        await queryRunner.manager.save(
          UserRolePermissionSettingEntity,
          dataUserRolePermissionSettings,
        );
      }

      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async deletePermissionNotActive(): Promise<any> {
    const permissionNotActive =
      await this.permissionSettingRepository.findByCondition({
        status: StatusPermission.INACTIVE,
      });

    if (isEmpty(permissionNotActive)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    }
    const permissionCodes = uniq(map(permissionNotActive, 'code'));

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(
        PermissionSettingEntity,
        permissionNotActive,
      );

      if (!isEmpty(permissionCodes)) {
        const userRolePermissionSettings =
          await this.userRolePermissionSettingRepository.findByCondition({
            permissionSettingCode: In(permissionCodes),
          });
        if (userRolePermissionSettings.length > 0) {
          await queryRunner.manager.delete(
            UserRolePermissionSettingEntity,
            userRolePermissionSettings,
          );
        }
      }
      await queryRunner.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  public async getPermissionsByCondition(
    request: GetPermissionByConditionRequestDto,
  ): Promise<ResponsePayload<GetPermissionsByConditionResponseDto | any>> {
    const result =
      await this.userRolePermissionSettingRepository.getPermisionsByCondition(
        request,
      );
    const response = plainToClass(PermissionSettingResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  private async setDataUserRolePermissionSetting(
    dataRoleAndDepartment: any[],
    permissions: any[],
  ): Promise<any> {
    const DataUserRolePermissionSetting = [];
    dataRoleAndDepartment.forEach((item) => {
      DataUserRolePermissionSetting.push(
        ...permissions.map((record) => ({
          permissionSettingCode: record.code,
          departmentId: item.departmentId,
          userRoleId: item.userRoleId,
        })),
      );
    });
    return DataUserRolePermissionSetting;
  }
}
