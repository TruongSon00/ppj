import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { I18nService } from 'nestjs-i18n';
import { split } from 'lodash';
import { UserRoleServiceInterface } from './interface/user-role.service.interface';
import { UserRolePermisisonSettingRepositoryInterface } from './interface/user-role-permission-setting.repository.interface';
import { FinalCheckUserPermissionRequestDto } from '@components/auth/dto/request/final-check-user-permission.request.dto';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ErrorMessageEnum } from '@constant/error-message.enum';

@Injectable()
export class UserRoleService implements UserRoleServiceInterface {
  constructor(
    @Inject('UserRolePermissionSettingRepositoryInterface')
    private readonly userRolePermissionSettingRepository: UserRolePermisisonSettingRepositoryInterface,

    private readonly i18n: I18nService,
  ) {}

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
}
