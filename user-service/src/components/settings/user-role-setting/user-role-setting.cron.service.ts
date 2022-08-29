import { Inject, Injectable } from '@nestjs/common';
import { UserRoleSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-setting.repository.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { UserRolePermisisonSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/user-role-permission-setting.repository.interface';
import { DepartmentSettingRepositoryInterface } from '@components/settings/department-setting/interface/department-setting.repository.interface';
import { I18nService } from 'nestjs-i18n';
import { PermissionSettingRepositoryInterface } from '@components/settings/user-role-setting/interface/permission-setting.repository.interface';
import { StatusPermission } from '@utils/constant';
import { isEmpty, map, uniq } from 'lodash';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { GroupPermissionSettingEntity } from '@entities/group-permission-setting/group-permission-setting.entity';
import { PermissionSettingEntity } from '@entities/permission-setting/permission-setting.entity';
import { UserRolePermissionSettingEntity } from '@entities/user-role-permission-setting/user-role-permission-setting.entity';
import { DEPARMENT_SUPER_ADMIN, ROLE_SUPER_ADMIN } from '@constant/common';

@Injectable()
export class UserRoleSettingCronService {
  constructor(
    @Inject('UserRoleSettingRepositoryInterface')
    private readonly userRoleSettingRepository: UserRoleSettingRepositoryInterface,

    @Inject('WarehouseServiceInterface')
    private readonly warehouseService: WarehouseService,

    @Inject('UserRolePermissionSettingRepositoryInterface')
    private readonly userRolePermissionSettingRepository: UserRolePermisisonSettingRepositoryInterface,

    @Inject('DepartmentSettingRepositoryInterface')
    private readonly departmentSettingRepository: DepartmentSettingRepositoryInterface,

    @Inject('PermissionSettingRepositoryInterface')
    private readonly permissionSettingRepository: PermissionSettingRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

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
}
