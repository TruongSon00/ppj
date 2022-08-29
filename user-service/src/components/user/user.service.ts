import { DepartmentSettingRepositoryInterface } from '../settings/department-setting/interface/department-setting.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@components/user/interface/user.repository.interface';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { ApiError } from '@utils/api.error';
import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { GetListUserRequestDto } from '@components/user/dto/request/get-list-user.request.dto';
import { UpdateUserRequestDto } from '@components/user/dto/request/update-user.request.dto';
import { GetListUserRoleSettingResponseDto } from '@components/settings/user-role-setting/dto/response/get-list-user-role-setting.response.dto';
import { GetListDepartmentSettingResponseDto } from '@components/settings/department-setting/dto/response/get-list-department-setting.response.dto';
import { GetListWarehouseByConditionsResponseDto } from '@components/warehouse/dto/response/get-list-warehouse-by-conditions.response.dto';
import { UserResponseDto } from '@components/user/dto/response/user.response.dto';
import { GetListUserResponseDto } from '@components/user/dto/response/get-list-user.response.dto';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { ResponsePayload } from '@utils/response-payload';
import { InjectDataSource } from '@nestjs/typeorm';
import { PagingResponse } from '@utils/paging.response';
import { DataSource, In, Not } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from '@entities/company/company.entity';
import { first, flatMap, isEmpty, map, maxBy, uniq } from 'lodash';
import { UserRoleSettingRepository } from '@repositories/user-role-setting.repository';
import { CompanyRepositoryInterface } from '@components/company/interface/company.repository.interface';
import { FactoryRepositoryInterface } from '@components/factory/interface/factory.repository.interface';
import { MailService } from '@components/mail/mail.service';
import { User } from '@entities/user/user.entity';
import { UserFactory } from '@entities/user-factory/user-factory.entity';
import { UserDepartment } from '@entities/user-department/user-department.entity';
import { UserWarehouse } from '@entities/user-warehouse/user-warehouse.entity';
import { UserRole } from '@entities/user-role/user-role.entity';
import { UserRoleResponseDto } from '@components/user-role/dto/response/user-role.response.dto';
import { CompanyResponseDto } from '@components/company/dto/response/company.response.dto';
import { FactoryResponseDto } from '@components/factory/dto/response/factory.response.dto';
import { GetListFactoryByCompanyIdResponseDto } from '@components/factory/dto/response/get-list-factory-by-id.response.dto';
import { GetUsersRequestDto } from './dto/request/get-users-request.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { UserSyncResponseDto } from './dto/response/user-sync.response.dto';
import { ForgotPasswordGenerateRequestDto } from '@components/user/dto/request/forgot-password-generate.request.dto';
import { ForgotPasswordCheckOtpRequestDto } from '@components/user/dto/request/forgot-password-check-otp.request.dto';
import { ForgotPasswordResetPasswordRequestDto } from '@components/user/dto/request/forgot-password-reset-password.request.dto';
import { ForgotPasswordResponseDto } from '@components/user/dto/response/forgot-password.response.dto';
import { SendMailRequestDto } from '@components/mail/dto/request/send-mail.request.dto';
import { ConfigService } from '@config/config.service';
import * as bcrypt from 'bcryptjs';
import {
  DATA_NOT_CHANGE,
  DEPARMENT_SUPER_ADMIN,
  ROLE_SUPER_ADMIN,
  SUPER_ADMIN,
} from '@constant/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DepartmentSetting } from '@entities/department-setting/department-setting.entity';
import { UserWarehouseRepositoryInterface } from '@components/user-warehouse/interface/user-warehouse.interface';
import { GetWarehouseByUserRequest } from '@components/user-warehouse/dto/request/get-warehouse-by-user.request.dto';
import { GetWarehouseByUserResponseDto } from '@components/user-warehouse/dto/response/get-warehouse-by-user.response.dto';
import { GetEnvRequest } from '@components/user-warehouse/dto/request/get-env.request.dto';
import { UserRoleSettingService } from '@components/settings/user-role-setting/user-role-setting.service';
import { GroupPermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/group-permission-setting.repository.interface';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto';
import { ChangePasswordResponseDto } from './dto/response/change-password.response.dto';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-permission-setting.repository.interface';
import { UserRoleSetting } from '@entities/user-role-setting/user-role-setting.entity';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { stringFormat } from '@utils/object.util';
import { GetUsersByRoleCodesRequestDto } from './dto/request/get-users-by-roles.request.dto';
import { ChangeStatusNotificationRequestDto } from './dto/request/change-status-notification.request.dto';

const defaultMMSPermissions = [
  {
    name: 'Danh sách yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_LIST',
  },
  {
    name: 'Tạo yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_CREATE',
  },
  {
    name: 'Sửa yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_EDIT',
  },
  {
    name: 'Xoá yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_DELETE',
  },
  {
    name: 'Chi tiêt yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_DETAIL',
  },
  {
    name: 'Xác nhận yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_CONFIRM_1',
  },
  {
    name: 'Xác nhận yêu cầu bảo trì_quyền QL IT',
    code: 'MMS_MAINTAINCE_REQUEST_CONFIRM_2',
  },
  {
    name: 'Từ chối yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_REJECT',
  },
  {
    name: 'Xác nhận hoàn thành yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_APPROVED',
  },
  {
    name: 'Yêu cầu làm lại yêu cầu bảo trì',
    code: 'MMS_MAINTAINCE_REQUEST_REWORK',
  },
  {
    name: 'Danh sách công việc',
    code: 'MMS_MAINTAINCE_REQUEST_LIST',
  },
  {
    name: 'Phân công công việc',
    code: 'MMS_JOB_ASSIGN',
  },
  {
    name: 'Xác nhận công việc',
    code: 'MMS_JOB_CONFIRM',
  },
  {
    name: 'Từ chối công việc',
    code: 'MMS_JOB_REJECT',
  },
  {
    name: 'Thực hiện công việc',
    code: 'MMS_JOB_TODO',
  },
  {
    name: 'Cập nhật kết quả',
    code: 'MMS_JOB_COMPLETE',
  },
  {
    name: 'Xác nhận hoàn thành công việc',
    code: 'MMS_JOB_ APPROVED',
  },
  {
    name: 'Yêu cầu làm lại công việc',
    code: 'MMS_JOB_REWORK',
  },
  {
    name: 'Danh sách yêu cầu vật tư phụ tùng',
    code: 'MMS_SUPPLY_REQUEST_LIST',
  },
  {
    name: 'Tạo yêu cầu vật tư phụ tùng',
    code: 'MMS_SUPPLY_REQUEST_CREATE',
  },
  {
    name: 'Xóa yêu cầu vật tư phụ tùng',
    code: 'MMS_SUPPLY_REQUEST_DELETE',
  },
  {
    name: 'Sửa yêu cầu vật tư phụ tùng',
    code: 'MMS_SUPPLY_REQUEST_EDIT',
  },
  {
    name: 'Xác nhận yêu cầu vật tư phụ tùng',
    code: 'MMS_SUPPLY_REQUEST_CONFIRM',
  },
  {
    name: 'Từ chối yêu cầu vật tư phụ tùng',
    code: 'MMS_SUPPLY_REQUEST_REJECT',
  },
];

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('DepartmentSettingRepositoryInterface')
    private readonly departmentSettingRepository: DepartmentSettingRepositoryInterface,

    @Inject('UserRoleSettingRepositoryInterface')
    private readonly userRoleSettingRepository: UserRoleSettingRepository,

    @Inject('CompanyRepositoryInterface')
    private readonly companyRepository: CompanyRepositoryInterface,

    @Inject('FactoryRepositoryInterface')
    private readonly factoryRepository: FactoryRepositoryInterface,

    @Inject('DepartmentSettingRepositoryInterface')
    private readonly departmentRepository: DepartmentSettingRepositoryInterface,

    @Inject('UserWarehouseRepositoryInterface')
    private readonly userWarehouseRepository: UserWarehouseRepositoryInterface,

    @Inject('GroupPermissionSettingRepositoryInterface')
    private readonly groupPermissionSettingRepository: GroupPermissionSettingRepositoryInterface,

    @Inject('UserRolePermisisonSettingRepositoryInterface')
    private readonly userRolePermissionSettingRepository: UserRolePermisisonSettingRepositoryInterface,

    @Inject('WarehouseServiceInterface')
    private readonly warehouseService: WarehouseService,

    @Inject('UserRoleSettingServiceInterface')
    private readonly userRoleSettingService: UserRoleSettingService,

    @Inject('MailServiceInterface')
    private readonly mailService: MailService,

    private readonly i18n: I18nRequestScopeService,

    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  async getListByRelations(relation: any): Promise<ResponsePayload<any>> {
    const users = await this.userRepository.findWithRelations(relation);
    return new ResponseBuilder(users)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  /**
   * generate opt
   * @param request
   * @returns
   */
  public async generateOpt(
    request: ForgotPasswordGenerateRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto | any>> {
    const { email } = request;
    const d = new Date();
    const user = await this.userRepository.findOneByCondition({ email: email });

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const response = {
      email: email,
    };

    const optCode = await this.randomNumber(
      new ConfigService().get('otpMinNumber') || 100000,
      new ConfigService().get('otpMaxNumber') || 999999,
    );

    const timeout = new ConfigService().get('otpTimeout');
    const expire = new Date(
      new Date().setTime(d.getTime() + parseInt(timeout) * 1000),
    );

    console.log({ expire });

    user.otpCode = optCode;
    user.expire = expire;

    await this.userRepository.update(user);

    const body = {
      subject: 'OTP CODE',
      template: './forgot-password-generate',
      context: {
        code: optCode,
        timeout: timeout / 60,
      },
    };

    const requestMail = new SendMailRequestDto();
    requestMail.email = email;
    requestMail.body = body;

    const sendMail = await this.mailService.sendMail(requestMail);

    if (sendMail.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        await this.i18n.translate('error.SEND_MAIL_FAIL'),
      ).toResponse();
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .withMessage(await this.i18n.translate('message.success'))
      .build();
  }

  /**
   * check opt user
   * @param request
   * @returns
   */
  public async checkOtp(
    request: ForgotPasswordCheckOtpRequestDto,
  ): Promise<ResponsePayload<ForgotPasswordResponseDto> | any> {
    const { email, code } = request;
    const d = new Date();
    const user = await this.userRepository.findOneByCondition({ email: email });

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    if (code !== user.otpCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.OTP_CODE_NOT_CORRECT'),
      ).toResponse();
    }
    if (user.expire < new Date(d.getTime())) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.OTP_CODE_EXPIRED'),
      ).toResponse();
    }

    return new ResponseBuilder({
      email: email,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.success'))
      .build();
  }

  /**
   * reset password user
   * @param request
   * @returns
   */
  public async forgotPasswordResetPassword(
    request: ForgotPasswordResetPasswordRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { email, password, code } = request;
    const user = await this.userRepository.findOneByCondition({
      email: email,
    });

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const checkOtp = new ForgotPasswordCheckOtpRequestDto();
    checkOtp.email = email;
    checkOtp.code = code;

    try {
      const otpValid = await this.checkOtp(checkOtp);
      if (otpValid.statusCode !== ResponseCodeEnum.SUCCESS) {
        return otpValid;
      }
      const saltOrRounds = new ConfigService().get('saltOrRounds');
      user.password = await bcrypt.hashSync(password, saltOrRounds);

      await this.userRepository.update(user);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.success'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(error?.message || error)
        .build();
    }
  }

  public async changePassword(
    request: ChangePasswordRequestDto,
  ): Promise<ResponsePayload<ChangePasswordResponseDto | any>> {
    const { email, password, oldPassword, userCode, departmentSettings } =
      request;
    const users = await this.userRepository.findWithRelations({
      where: { email: email },
      select: ['id', 'code', 'password'],
      relations: ['departmentSettings'],
    });

    if (users.length === 0) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const userRequestIsSuperAdmin = await this.userRepository.isSuperAdmin(
      userCode,
    );

    const user = first(users);
    const userChangeIsSuperAdmin = await this.userRepository.isSuperAdmin(
      user.code,
    );
    if (
      userChangeIsSuperAdmin &&
      userChangeIsSuperAdmin != userRequestIsSuperAdmin
    ) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_CHANGE_SUPER_ADMIN'),
      ).toResponse();
    }

    const isValidOldPassword = await bcrypt.compareSync(
      oldPassword,
      user.password,
    );
    if (!isValidOldPassword) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.OLD_PASSWORD_IS_INCORRECT'),
      ).toResponse();
    }

    const userDepartmentIds = map(user.departmentSettings, 'id');
    const userRequestDepartmentIds = map(departmentSettings, 'id');

    const sameDepartmentIds = userDepartmentIds.filter((x) =>
      userRequestDepartmentIds.includes(x),
    );
    if (sameDepartmentIds.length === 0 && !userRequestIsSuperAdmin) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_IN_YOUR_DEPARTMENT'),
      ).toResponse();
    }
    try {
      const saltOrRounds = new ConfigService().get('saltOrRounds');
      user.password = await bcrypt.hashSync(password, saltOrRounds);

      await this.userRepository.update({
        id: user.id,
        password: user.password,
      });

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(error?.message || error)
        .build();
    }
  }

  private async randomNumber(min: number, max: number): Promise<any> {
    return Math.floor(Math.random() * (max - min)) + Math.floor(min);
  }

  async runSeeders(): Promise<any> {
    const codes = DATA_NOT_CHANGE.DEFAULT_USERS.map((item) => item.code);

    const canRunSeeder = await this.userRepository.findByCondition({
      code: In(codes),
    });
    if (canRunSeeder.length > 0) {
      return;
    }
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.startTransaction();

    try {
      const companyEnity = new Company();

      const companyEnities = [];
      for (let i = 0; i < DATA_NOT_CHANGE.DEFAULT_COMPANIES.length; i++) {
        companyEnity.name = DATA_NOT_CHANGE.DEFAULT_COMPANIES[i].name;
        companyEnity.code = DATA_NOT_CHANGE.DEFAULT_COMPANIES[i].code;

        companyEnities[i] = companyEnity;
      }

      const deparmentEnities = [];
      for (let i = 0; i < DATA_NOT_CHANGE.DEFAULT_DEPARMENTS.length; i++) {
        const deparmentEntity = new DepartmentSetting();
        deparmentEntity.name = DATA_NOT_CHANGE.DEFAULT_DEPARMENTS[i].name;

        deparmentEnities.push(deparmentEntity);
      }

      const roleEntities = [];
      for (let i = 0; i < DATA_NOT_CHANGE.DEFAULT_ROLES.length; i++) {
        const roleEntity = new UserRoleSetting();
        roleEntity.name = DATA_NOT_CHANGE.DEFAULT_ROLES[i].name;
        roleEntity.code = DATA_NOT_CHANGE.DEFAULT_ROLES[i].code;

        roleEntities.push(roleEntity);
      }

      const company = await queryRunner.manager.save(Company, companyEnities);
      const departments = await queryRunner.manager.save(
        DepartmentSetting,
        deparmentEnities,
      );
      const roles = await queryRunner.manager.save(
        UserRoleSetting,
        roleEntities,
      );

      const userEnity = new User();

      const userEnities = [];
      for (let i = 0; i < DATA_NOT_CHANGE.DEFAULT_USERS.length; i++) {
        userEnity.username = DATA_NOT_CHANGE.DEFAULT_USERS[i].username;
        userEnity.code = DATA_NOT_CHANGE.DEFAULT_USERS[i].code;
        userEnity.companyId = company[0].id;
        userEnity.password = DATA_NOT_CHANGE.DEFAULT_USERS[i].password;
        userEnity.email = DATA_NOT_CHANGE.DEFAULT_USERS[i].email;
        userEnity.fullName = DATA_NOT_CHANGE.DEFAULT_USERS[i].fullName;

        userEnities[i] = userEnity;
      }

      const users = await queryRunner.manager.save(User, userEnities);
      const superAdmin = users.filter(
        (record) => record.code === SUPER_ADMIN.code,
      );
      const roleSuperAdmin = roles.filter(
        (record) => record.code === ROLE_SUPER_ADMIN.code,
      );
      const departmentSuperAdmin = departments.filter(
        (record) => record.name === DEPARMENT_SUPER_ADMIN.name,
      );
      const userRoleSuperAdmin = new UserRole();
      userRoleSuperAdmin.userId = first(superAdmin)['id'];
      userRoleSuperAdmin.userRoleId = first(roleSuperAdmin)['id'];
      userRoleSuperAdmin.departmentId = first(departmentSuperAdmin)['id'];

      await queryRunner.manager.save(UserRole, userRoleSuperAdmin);
      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Create new user
   * @param payload
   * @returns
   */
  public async create(
    payload: CreateUserRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const { code, email, username } = payload;

    const usernameCondition = { username: username };
    const checkUniqueUsername = await this.checkUniqueUser(usernameCondition);

    if (checkUniqueUsername) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USERNAME_ALREADY_EXISTS'),
      ).toResponse();
    }

    const codeCondition = { code: code };
    const checkUniqueCode = await this.checkUniqueUser(codeCondition);

    if (checkUniqueCode) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
      ).toResponse();
    }

    const emailCondition = { email: email };
    const checkUniqueEmail = await this.checkUniqueUser(emailCondition);

    if (checkUniqueEmail) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.EMAIL_ALREADY_EXISTS'),
      ).toResponse();
    }

    const userEntity = this.userRepository.createEntity(payload);

    return await this.save(
      userEntity,
      payload,
      'message.defineUser.createSuccess',
    );
  }

  private async save(
    userEntity: User,
    payload: any,
    message?: string,
  ): Promise<ResponsePayload<UserResponseDto> | any> {
    const {
      departmentSettings,
      companyId,
      factories,
      userWarehouses,
      userRoleSettings,
    } = payload;

    const isUpdate = userEntity.id !== null;
    let departmentIds = [];
    let roleIds = [];
    let factoryIds = [];
    let warehouseIds = [];

    const company = await this.companyRepository.findOneById(companyId);
    if (isEmpty(company)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.COMPANY_NOT_FOUND'),
      ).toResponse();
    }

    if (!isEmpty(userRoleSettings)) {
      roleIds = uniq(userRoleSettings.map((item) => item.id));

      const roleEntities = await this.userRoleSettingRepository.findByCondition(
        {
          id: In(roleIds),
        },
      );

      if (isEmpty(roleEntities) || roleEntities.length !== roleIds.length) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.USER_ROLE_NOT_FOUND'),
        ).toResponse();
      }
    }

    if (!isEmpty(departmentSettings)) {
      departmentIds = uniq(departmentSettings.map((item) => item.id));

      const departmentEntities =
        await this.departmentSettingRepository.findByCondition({
          id: In(departmentIds),
        });

      if (
        isEmpty(departmentEntities) ||
        departmentEntities.length !== departmentIds.length
      ) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.DEPARTMENT_NOT_FOUND'),
        ).toResponse();
      }
    }

    if (!isEmpty(factories)) {
      factoryIds = uniq(factories.map((factory) => factory.id));
      const factoryEntities = await this.factoryRepository.findByCondition({
        id: In(factoryIds),
      });
      if (
        isEmpty(factoryEntities) ||
        factoryEntities.length !== factoryIds.length
      ) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.FACTORY_NOT_FOUND'),
        ).toResponse();
      }
    }

    if (!isEmpty(userWarehouses)) {
      warehouseIds = uniq(userWarehouses.map((warehouse) => warehouse.id));
      const warehouseEntities = await this.warehouseService.getListByIDs(
        warehouseIds,
      );
      if (
        isEmpty(warehouseEntities) ||
        warehouseEntities.length !== warehouseIds.length
      ) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.WAREHOUSE_NOT_FOUND'),
        ).toResponse();
      }
    }

    const queryRunner = this.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.save(userEntity);

      if (!isEmpty(factoryIds)) {
        const userFactoryEntities = factories.map((factory) =>
          this.userRepository.createUserFactoryEntity(user.id, factory.id),
        );
        if (isUpdate) {
          await queryRunner.manager.delete(UserFactory, {
            userId: user.id,
          });
        }
        user.factories = await queryRunner.manager.save(userFactoryEntities);
      }

      if (!isEmpty(departmentIds)) {
        const userDepartmentEntities = departmentSettings.map((department) =>
          this.userRepository.createUserDepartmentEntity(
            user.id,
            department.id,
          ),
        );
        if (isUpdate) {
          await queryRunner.manager.delete(UserDepartment, {
            userId: user.id,
          });
        }
        user.departmentSettings = await queryRunner.manager.save(
          userDepartmentEntities,
        );
      }

      if (!isEmpty(roleIds)) {
        const userRoleEntities = departmentSettings.map((department) =>
          this.userRepository.createUserRoleEntity(
            user.id,
            department.id,
            userRoleSettings[0].id,
          ),
        );
        if (isUpdate) {
          await queryRunner.manager.delete(UserRole, {
            userId: user.id,
          });
        }
        user.userRoleSettings = await queryRunner.manager.save(
          userRoleEntities,
        );
      }

      if (!isEmpty(warehouseIds)) {
        const userWarehouseEntities = userWarehouses.map((warehouse) =>
          this.userRepository.createUserWarehouseEntity(user.id, warehouse.id),
        );
        if (isUpdate) {
          await queryRunner.manager.delete(UserWarehouse, {
            userId: user.id,
          });
        }
        user.userWarehouses = await queryRunner.manager.save(
          userWarehouseEntities,
        );
      }

      await queryRunner.commitTransaction();

      user.userRoleSettings = userRoleSettings;
      user.factories = factories;
      user.departmentSettings = departmentSettings;
      user.userWarehouses = userWarehouses;

      const response = plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate(message || 'message.success'))
        .withData(response)
        .build();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update User
   */
  public async update(
    payload: UpdateUserRequestDto,
  ): Promise<ResponsePayload<UserRoleResponseDto | any>> {
    const {
      id,
      fullName,
      dateOfBirth,
      phone,
      email,
      companyId,
      username,
      code,
      status,
    } = payload;
    const userEntity = await this.userRepository.findOneById(id);
    if (isEmpty(userEntity)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    if (username) {
      const usernameCondition = { username: username, id: Not(id) };
      const checkUniqueUsername = await this.checkUniqueUser(usernameCondition);

      if (checkUniqueUsername) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.USERNAME_ALREADY_EXISTS'),
        ).toResponse();
      }
    }

    if (code) {
      const codeCondition = { code: code, id: Not(id) };
      const checkUniqueCode = await this.checkUniqueUser(codeCondition);

      if (checkUniqueCode) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
        ).toResponse();
      }
    }

    const emailCondition = { email: email, id: Not(id) };
    const checkUniqueEmail = await this.checkUniqueUser(emailCondition);

    if (checkUniqueEmail) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.EMAIL_ALREADY_EXISTS'),
      ).toResponse();
    }

    userEntity.fullName = fullName;
    userEntity.phone = phone || userEntity.phone;
    userEntity.email = email;
    userEntity.dateOfBirth = dateOfBirth || userEntity.dateOfBirth;
    userEntity.companyId = companyId || userEntity.companyId;
    userEntity.status = status || userEntity.status;
    return await this.save(
      userEntity,
      payload,
      'message.defineUser.updateSuccess',
    );
  }

  public async remove(
    id: number,
  ): Promise<ResponsePayload<SuccessResponse | any>> {
    const user = await this.userRepository.findOneById(id);
    if (isEmpty(user)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    const checkUniqueDataDefault = DATA_NOT_CHANGE.DEFAULT_USERS.filter(
      (item) => item.code === user.code,
    );

    if (checkUniqueDataDefault.length > 0) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_DELETE'),
      ).toResponse();
    }

    const queryRunner = this.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete('user_factories', { userId: id });

      await queryRunner.manager.delete('user_departments', { userId: id });

      await queryRunner.manager.delete(UserRole, { userId: id });

      await queryRunner.manager.delete(UserWarehouse, { userId: id });

      await queryRunner.manager.delete(User, { id: id });

      await queryRunner.commitTransaction();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(
          await this.i18n.translate('message.defineUser.deleteSuccess'),
        )
        .build();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteMultiple(
    request: DeleteMultipleDto,
  ): Promise<ResponsePayload<any>> {
    const failIdsList = [];
    const ids = request.ids.split(',').map((id) => parseInt(id));

    const users = await this.userRepository.findByCondition({
      id: In(ids),
    });
    const userIds = users.map((user) => user.id);
    if (users.length !== ids.length) {
      ids.forEach((id) => {
        if (!userIds.includes(id)) failIdsList.push(id);
      });
    }

    const checkUniqueDataDefault = users.filter((user) =>
      DATA_NOT_CHANGE.DEFAULT_USERS.find((item) => item.code === user.code),
    );
    if (checkUniqueDataDefault.length > 0) {
      checkUniqueDataDefault.forEach((user) => {
        failIdsList.push(user.id);
      });
    }

    const validIds = users
      .filter((user) => !failIdsList.includes(user.id))
      .map((user) => user.id);

    try {
      if (!isEmpty(validIds)) {
        await this.userRepository.multipleRemove(validIds);
      }
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
        .build();
    }

    if (isEmpty(failIdsList))
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(
        stringFormat(
          await this.i18n.t('error.DELETE_MULTIPLE_FAIL'),
          validIds.length,
          ids.length,
        ),
      )
      .build();
  }

  /**
   * Get user list
   * @param request
   * @returns
   */
  public async getList(
    payload: GetListUserRequestDto,
  ): Promise<ResponsePayload<GetListUserResponseDto | any>> {
    const filterWarehouse = payload.filter?.find(
      (item) => item.column === 'warehouseName',
    );

    let filterByWarehouseIds = [];

    if (!isEmpty(filterWarehouse)) {
      filterByWarehouseIds = await this.warehouseService.getWarehousesByName(
        filterWarehouse,
        true,
      );
      if (isEmpty(filterByWarehouseIds)) {
        return new ResponseBuilder<PagingResponse>({
          items: [],
          meta: { total: 0, page: payload.page },
        })
          .withCode(ResponseCodeEnum.SUCCESS)
          .build();
      }
    }

    const { data, count } = await this.userRepository.getListUser(
      payload,
      filterByWarehouseIds,
    );

    let result;

    if (!isEmpty(data) && count !== 0) {
      const warehouseIds = uniq(map(flatMap(data, 'userWarehouses'), 'id'));

      const warehouses = await this.warehouseService.getListByIDs(warehouseIds);
      const normalizeWarehouses = {};
      warehouses.forEach((warehouse) => {
        normalizeWarehouses[warehouse.id] = warehouse;
      });

      const users = data.map((user) => ({
        ...user,
        userWarehouses: user.userWarehouses.map((warehouse) => ({
          ...normalizeWarehouses[warehouse.id],
        })),
      }));

      result = plainToClass(UserResponseDto, users, {
        excludeExtraneousValues: true,
      });
    }

    return new ResponseBuilder<PagingResponse>({
      items: !isEmpty(result) ? result : [],
      meta: { total: count, page: payload.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getListSync(): Promise<
    ResponsePayload<GetListUserResponseDto | any>
  > {
    const data = await this.userRepository.findWithRelations({
      relations: ['userWarehouses'],
      select: ['password', 'id', 'username', 'fullName'],
    });
    const dataReturn = plainToClass(UserSyncResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getDetail(
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    withoutExtraInfo: boolean = true,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const dataUser = await this.userRepository.getDetail(id, withoutExtraInfo);
    if (!dataUser) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }
    if (dataUser.createdBy) {
      const responseUserService = await this.userRepository.findOneById(
        dataUser.createdBy,
      );
      dataUser.createdBy = responseUserService;
    }
    // if (!withoutExtraInfo) {
    //   let warehouseIds,
    //     warehouses,
    //     normalizeWarehouses = [];
    //   if (this.userRepository.isSuperAdmin(dataUser?.code)) {
    //     normalizeWarehouses =
    //       await this.warehouseService.getWarehouseListByConditions({});

    //     dataUser.userWarehouses = normalizeWarehouses.map((warehouse) => ({
    //       warehouseId: warehouse.id,
    //       ...warehouse,
    //     }));
    //   } else {
    //     warehouseIds = uniq(map(dataUser.userWarehouses, 'warehouseId'));
    //     if (!isEmpty(warehouseIds)) {
    //       warehouses = await this.warehouseService.getListByIDs(warehouseIds);
    //       warehouses.forEach((warehouse) => {
    //         normalizeWarehouses[warehouse.id] = warehouse;
    //       });
    //     } else {
    //       warehouses = {};
    //     }

    //     dataUser.userWarehouses = dataUser.userWarehouses.map((warehouse) => ({
    //       warehouseId: warehouse.warehouseId,
    //       ...normalizeWarehouses[warehouse.warehouseId],
    //     }));
    //   }
    //   const userPermissions =
    //     await this.userRoleSettingService.getPermissionByUser(
    //       map(dataUser.userRoleSettings, 'id'),
    //       map(dataUser.departmentSettings, 'id'),
    //     );
    //   const maxPermissionId: any = maxBy(userPermissions, 'id');
    //   let maxId = maxPermissionId?.id;
    //   defaultMMSPermissions.forEach((defaultMMSPermission) => {
    //     userPermissions.push({
    //       ...defaultMMSPermission,
    //       id: maxId + 1,
    //     });
    //     maxId++;
    //   });
    //   dataUser.userPermissions = userPermissions;
    // }

    const dataReturn = plainToClass(UserResponseDto, dataUser, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(dataReturn)
      .build();
  }

  public async getFactoryListByCompanyId(
    companyId: number,
  ): Promise<ResponsePayload<GetListFactoryByCompanyIdResponseDto | any>> {
    const result = await this.factoryRepository.findWithRelations({
      where: {
        companyId: companyId,
      },
    });

    const response = plainToClass(
      GetListFactoryByCompanyIdResponseDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getWarehouseListByConditions(
    request,
  ): Promise<ResponsePayload<GetListWarehouseByConditionsResponseDto | any>> {
    const result = await this.warehouseService.getWarehouseListByConditions(
      request,
    );

    const response = plainToClass(
      GetListWarehouseByConditionsResponseDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getUserRoleSettingList(): Promise<
    ResponsePayload<GetListUserRoleSettingResponseDto | any>
  > {
    const result = await this.userRoleSettingRepository.findAll();

    const response = plainToClass(GetListUserRoleSettingResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getDepartmentSettingList(): Promise<
    ResponsePayload<GetListDepartmentSettingResponseDto | any>
  > {
    const result = await this.departmentRepository.findAll();

    const response = plainToClass(GetListDepartmentSettingResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  private async checkUniqueUser(condition: any): Promise<boolean> {
    const user = await this.userRepository.checkUniqueUser(condition);

    return user.length > 0;
  }

  private async validateUser(payload: CreateUserRequestDto): Promise<boolean> {
    const {
      departmentSettings,
      companyId,
      factories,
      userWarehouses,
      userRoleSettings,
    } = payload;

    const company = await this.companyRepository.findOneById(companyId);
    if (isEmpty(company)) {
      throw new Error(await this.i18n.translate('error.COMPANY_NOT_FOUND'));
    }

    if (!isEmpty(departmentSettings)) {
      const departmentIds = uniq(departmentSettings.map((item) => item.id));

      const departmentEntities =
        await this.departmentSettingRepository.findByCondition({
          id: In(departmentIds),
        });

      if (
        isEmpty(departmentEntities) ||
        departmentEntities.length !== departmentIds.length
      ) {
        throw new Error(
          await this.i18n.translate('error.DEPARTMENT_NOT_FOUND'),
        );
      }

      const roleIds = uniq(userRoleSettings.map((item) => item.id));

      const roleEntities = await this.userRoleSettingRepository.findByCondition(
        {
          id: In(roleIds),
        },
      );

      if (isEmpty(roleEntities) || roleEntities.length !== roleIds.length) {
        throw new Error(await this.i18n.translate('error.USER_ROLE_NOT_FOUND'));
      }
    }

    if (!isEmpty(factories)) {
      const factoryIds = uniq(factories.map((factory) => factory.id));
      const factoryEntities = await this.factoryRepository.findByCondition({
        id: In(factoryIds),
      });

      if (
        isEmpty(factoryEntities) ||
        factoryEntities.length !== factoryIds.length
      ) {
        throw new Error(await this.i18n.translate('error.FACTORY_NOT_FOUND'));
      }
    }

    if (!isEmpty(userWarehouses)) {
      const warehouseIds = uniq(
        userWarehouses.map((warehouse) => warehouse.id),
      );
      const warehouseEntities = await this.warehouseService.getListByIDs(
        warehouseIds,
      );

      if (
        isEmpty(warehouseEntities) ||
        warehouseEntities.length !== warehouseIds.length
      ) {
        throw new Error(await this.i18n.translate('error.WAREHOUSE_NOT_FOUND'));
      }
    }

    return false;
  }

  public async getFactoriesByCondition(condition): Promise<any> {
    const result = await this.factoryRepository.findByCondition(condition);

    const response = plainToClass(FactoryResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getFactoriesByIds(ids): Promise<any> {
    const result = await this.factoryRepository.findByCondition({
      id: In(ids),
    });

    if (!result) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const response = plainToClass(FactoryResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getCompaniesByIds(ids: number[]): Promise<any> {
    const result = await this.companyRepository.findByCondition({
      id: In(ids),
    });

    const response = plainToClass(CompanyResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getCompaniesByCondition(condition): Promise<any> {
    const result = await this.companyRepository.findByCondition(condition);

    const response = plainToClass(CompanyResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  public async getEnv(payload: GetEnvRequest): Promise<any> {
    const { userCode, userId, userRoleIds, userDepartmentIds } = payload;
    const isSuperAdmin = userCode === DATA_NOT_CHANGE.DEFAULT_USERS[0].code;

    const [
      companies,
      factories,
      roles,
      deparments,
      userPermisions,
      groupPermisions,
    ] = isSuperAdmin
      ? await Promise.all([
          this.companyRepository.findAll(),
          this.factoryRepository.findAll(),
          this.userRoleSettingRepository.findAll(),
          this.departmentRepository.getRoleAndDepartment(),
          this.userRoleSettingService.getPermissionByUser(
            userRoleIds,
            userDepartmentIds,
          ),
          this.groupPermissionSettingRepository.findWithRelations({
            relations: ['permissionSetting'],
          }),
        ])
      : await Promise.all([
          this.companyRepository.getUserCompanies(userId),
          this.factoryRepository.getUserFactories(userId),
          this.userRoleSettingRepository.findAll(),
          this.departmentRepository.getRoleAndDepartment(),
          this.userRoleSettingService.getPermissionByUser(
            userRoleIds,
            userDepartmentIds,
          ),
          this.groupPermissionSettingRepository.findWithRelations({
            relations: ['permissionSetting'],
          }),
        ]);

    // TO DO: implement MMS permissions

    const maxPermissionId: any = maxBy(userPermisions, 'id');
    let maxId = maxPermissionId?.id;
    defaultMMSPermissions.forEach((defaultMMSPermission) => {
      userPermisions.push({
        ...defaultMMSPermission,
        id: maxId + 1,
      });
      maxId++;
    });

    return new ResponseBuilder({
      companies: companies,
      factories: factories,
      roles: roles,
      deparments: deparments,
      userPermisions: userPermisions,
      groupPermisions: groupPermisions,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  /**
   * Get list from other services
   * @param payload
   * @returns
   */
  public async getListByIds(
    payload: GetUsersRequestDto | any,
  ): Promise<User[] | ResponsePayload<any>> {
    const data = await this.userRepository.findWithRelations({
      where: {
        id: In(payload.userIds),
      },
      relations: [
        'userRoles',
        'userWarehouses',
        'userDepartments',
        'factories',
        'company',
      ],
    });

    if (!data.length) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND).build();
    }

    return new ResponseBuilder(data).withCode(ResponseCodeEnum.SUCCESS).build();
  }

  public async deleteRecordUserWarehouses(
    condition: any,
  ): Promise<ResponsePayload<any>> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.manager.delete(UserWarehouse, condition);
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  async getListByCondition(condition: any): Promise<ResponsePayload<any>> {
    let users = [];
    if (typeof condition === 'string')
      users = await this.userRepository.getUsersByCondition(condition);
    else users = await this.userRepository.findByCondition(condition);
    return new ResponseBuilder(users)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async getWarehouseListByUser(
    request: GetWarehouseByUserRequest,
  ): Promise<ResponsePayload<any>> {
    const { userId } = request;
    let warehouses = [],
      userWarehouses = [],
      count;
    const user = await this.userRepository.findOneById(userId);

    const isSuperAdmin = user.code === DATA_NOT_CHANGE.DEFAULT_USERS[0].code;
    if (!isSuperAdmin) {
      [userWarehouses, count] =
        await this.userWarehouseRepository.getWarehousesByUserId(request);
      const warehouseIds: any = uniq(userWarehouses.map((e) => e.warehouseId));
      warehouses = await this.warehouseService.getListByIDs(warehouseIds, [
        'warehouseTypeSettings',
      ]);
    } else {
      userWarehouses = await this.warehouseService.getWarehouseListByConditions(
        {},
      );

      const warehouseIds: any = uniq(userWarehouses.map((e) => e.id));
      warehouses = await this.warehouseService.getListByIDs(warehouseIds, [
        'warehouseTypeSettings',
      ]);
    }
    const factoryIds = warehouses.map((e) => e.factoryId);

    const factories = await this.factoryRepository.findByCondition({
      id: In(factoryIds),
    });
    userWarehouses = userWarehouses.map((e) => {
      const currentWarehouseTypes = warehouses.find((warehouse) => {
        if (isSuperAdmin) {
          return warehouse.id === e.id;
        }
        return warehouse.id === e.warehouseId;
      });
      const currentFactory = factories.find(
        (factory) => factory.id === currentWarehouseTypes?.factoryId,
      );
      return {
        id: isSuperAdmin ? e.id : e.warehouseId,
        name: currentWarehouseTypes?.name,
        code: currentWarehouseTypes?.code,
        warehouseTypes: currentWarehouseTypes?.warehouseTypeSettings,
        factory: currentFactory,
      };
    });

    const dataReturn = plainToClass(
      GetWarehouseByUserResponseDto,
      userWarehouses,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder<PagingResponse>({
      items: dataReturn,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  public async getUsersByRoleCodes(
    request: GetUsersByRoleCodesRequestDto | any,
  ): Promise<User[] | ResponsePayload<any>> {
    const data = await this.userRepository.getUserNotInRoleCodes(
      request.roleCodes,
    );

    if (isEmpty(data)) {
      return new ResponseBuilder().withCode(ResponseCodeEnum.NOT_FOUND).build();
    }

    return new ResponseBuilder(data).withCode(ResponseCodeEnum.SUCCESS).build();
  }

  public async getGroupPermissions(): Promise<any> {
    const groupPermisions =
      await this.groupPermissionSettingRepository.findWithRelations({
        relations: ['permissionSetting'],
      });

    return new ResponseBuilder(groupPermisions)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async getDepartments(): Promise<any> {
    const departments = await this.departmentRepository.getRoleAndDepartment();

    return new ResponseBuilder(departments)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  public async changeStatusUserNotification(
    payload: ChangeStatusNotificationRequestDto,
  ): Promise<any> {
    const { userId, statusNotification } = payload;
    const userEntity = await this.userRepository.findOneById(userId);
    if (isEmpty(userEntity)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }

    userEntity.statusNotification = statusNotification;
    return await this.save(userEntity, payload);
  }
}
