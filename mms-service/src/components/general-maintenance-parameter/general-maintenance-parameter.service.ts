import { Inject, Injectable } from '@nestjs/common';
import { GeneralMaintenanceParameterServiceInterface } from '@components/general-maintenance-parameter/interface/general-maintenance-parameter.service.interface';
import { GeneralMaintenanceParameterRepositoryInterface } from '@components/general-maintenance-parameter/interface/general-maintenance-parameter.repository.interface';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { plainToInstance } from 'class-transformer';
import { CreateGeneralMaintenanceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/create-general-maintenance-parameter.request.dto';
import { ListGeneralMaintenanceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/list-general-maintenance-parameter.request.dto';
import { UpdateGeneralMaintenaceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/update-general-maintenace-parameter.request.dto';
import { ListGeneralMaintenanceParameterResponseDto } from '@components/general-maintenance-parameter/dto/response/list-general-maintenance-parameter.response.dto';
import { UpdateGeneralMaintenanceParameterResponseDto } from '@components/general-maintenance-parameter/dto/response/update-general-maintenance-parameter.response.dto';
import { isEmpty } from 'lodash';

@Injectable()
export class GeneralMaintenanceParameterService
  implements GeneralMaintenanceParameterServiceInterface
{
  constructor(
    @Inject('GeneralMaintenanceParameterRepositoryInterface')
    private readonly generalMaintenanceParameterRepository: GeneralMaintenanceParameterRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}
  async create(
    request: CreateGeneralMaintenanceParameterRequestDto,
  ): Promise<any> {
    try {
      const existed =
        await this.generalMaintenanceParameterRepository.findAll();
      if (existed.length != 0) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate(
              'error.GENERAL_MAINTENANCE_PARAMETER_EXISTED',
            ),
          )
          .build();
      } else {
        const generalMaintenanceParameterDocument =
          this.generalMaintenanceParameterRepository.createDocument({
            time: 1,
          });
        const generalMaintenanceParameter =
          await this.generalMaintenanceParameterRepository.create(
            generalMaintenanceParameterDocument,
          );
        await generalMaintenanceParameter.save();
        return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
      }
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }

  async getList(
    request: ListGeneralMaintenanceParameterRequestDto,
  ): Promise<any> {
    const response = await this.generalMaintenanceParameterRepository.findAll();
    let result;
    if (isEmpty(Object.keys(response))) {
      const generalMaintenanceParameterDocument =
        this.generalMaintenanceParameterRepository.createDocument({
          time: 1,
        });
      const generalMaintenanceParameter =
        await this.generalMaintenanceParameterRepository.create(
          generalMaintenanceParameterDocument,
        );
      await generalMaintenanceParameter.save();
      const maintenanceParamCreated =
        await this.generalMaintenanceParameterRepository.findAll();
      result = plainToInstance(
        ListGeneralMaintenanceParameterResponseDto,
        maintenanceParamCreated,
        {
          excludeExtraneousValues: true,
        },
      );
    } else {
      result = plainToInstance(
        ListGeneralMaintenanceParameterResponseDto,
        response,
        {
          excludeExtraneousValues: true,
        },
      );
    }
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
  async update(
    request: UpdateGeneralMaintenaceParameterRequestDto,
  ): Promise<any> {
    const { _id } = request;
    const generalMaintenanceTemplate =
      await this.generalMaintenanceParameterRepository.findOneById(_id);
    if (!generalMaintenanceTemplate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    try {
      await this.generalMaintenanceParameterRepository.update({
        ...request,
      });
      const response =
        await this.generalMaintenanceParameterRepository.findOneById(_id);
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }
      const result = plainToInstance(
        UpdateGeneralMaintenanceParameterResponseDto,
        response,
        { excludeExtraneousValues: true },
      );
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }
}
