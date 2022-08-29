import { keyBy, has } from 'lodash';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { GetListInstallationTemplateQuery } from './dto/query/get-list-installation-template.query';
import { CreateInstallationTemplateRequest } from './dto/request/create-installation-template.request';
import { DetailInstallationTemplateRequest } from './dto/request/detail-installation-template.request';
import { UpdateInstallationTemplateRequest } from './dto/request/update-installation-template.request';
import { DetailInstallationTemplateResponse } from './dto/response/detail-installation-template.response';
import { InstallationTemplateRepositoryInterface } from './interface/installation-template.repository';
import { InstallationTemplateServiceInterface } from './interface/installation-template.service.interface';

@Injectable()
export class InstallationTemplateService
  implements InstallationTemplateServiceInterface
{
  constructor(
    @Inject('InstallationTemplateRepositoryInterface')
    private readonly installationTemplateRepository: InstallationTemplateRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(
    request: CreateInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      const installationTemplateExists =
        await this.installationTemplateRepository.findOneByCondition({
          code: request.code,
        });

      if (installationTemplateExists) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.CODE_ALREADY_EXISTS'),
        ).toResponse();
      }
      const document =
        this.installationTemplateRepository.createDocument(request);
      await document.save();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async detail(
    request: DetailInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>> {
    const document =
      await this.installationTemplateRepository.findOneByCondition({
        _id: request.id,
        deletedAt: null,
      });

    if (!document) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const dataReturn = plainToInstance(
      DetailInstallationTemplateResponse,
      document,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async delete(
    request: DetailInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      const document = await this.installationTemplateRepository.findOneById(
        request.id,
      );

      if (!document) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      const isInstallationTemplateHasAssignDevice =
        await this.deviceRepository.findOneByCondition({
          installTemplate: request.id,
          deletedAt: null,
        });
      if (isInstallationTemplateHasAssignDevice) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate(
              'error.INSTALLATION_TEMPLATE_HAS_ASSIGN_DEVICE',
            ),
          )
          .build();
      }
      await this.installationTemplateRepository.softDelete(request.id);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async update(
    request: UpdateInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      let installationTemplate =
        await this.installationTemplateRepository.findOneById(request.id);

      if (!installationTemplate) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }
      const isInstallationTemplateHasAssignDevice =
        await this.deviceRepository.findOneByCondition({
          installTemplate: request.id,
          deletedAt: null,
        });
      if (isInstallationTemplateHasAssignDevice) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate(
              'error.INSTALLATION_TEMPLATE_HAS_ASSIGN_DEVICE',
            ),
          )
          .build();
      }
      installationTemplate = this.installationTemplateRepository.updateEntity(
        installationTemplate,
        request,
      );
      await this.installationTemplateRepository.findByIdAndUpdate(
        request.id,
        installationTemplate,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async list(
    request: GetListInstallationTemplateQuery,
  ): Promise<ResponsePayload<any>> {
    const { data, count } = await this.installationTemplateRepository.list(
      request,
    );

    const dataReturn = plainToInstance(
      DetailInstallationTemplateResponse,
      data,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder({
      result: dataReturn,
      meta: { total: count, page: request.page, size: request.limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async createMany(
    data: any,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }> {
    const dataToInsert = [];
    const dataToUpdate = [];
    const codesInsert = [];
    const codesUpdate = [];
    const textAdd = await this.i18n.translate('import.common.add');

    data.forEach((item) => {
      if (item.action === textAdd) {
        dataToInsert.push(item);
        codesInsert.push(item.code);
      } else {
        dataToUpdate.push(item);
        codesUpdate.push(item.code);
      }
    });

    const installationTemplateCodeInsertExists =
      await this.installationTemplateRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const installationTemplateCodeUpdateExists =
      await this.installationTemplateRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const installationTemplateInsertMap = keyBy(
      installationTemplateCodeInsertExists,
      'code',
    );
    const installationTemplateUpdateMap = keyBy(
      installationTemplateCodeUpdateExists,
      'code',
    );

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(installationTemplateInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(installationTemplateUpdateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const installationTemplateDocuments = dataInsert.map((item) => {
      const createRequest = new CreateInstallationTemplateRequest();
      createRequest.code = item.code;
      createRequest.name = item.name;
      createRequest.description = item.description;
      createRequest.details = item.details;

      const installationTemplate =
        this.installationTemplateRepository.createDocument(createRequest);
      return installationTemplate;
    });

    const dataSuccess = await this.installationTemplateRepository.createMany(
      installationTemplateDocuments,
    );
    const dataUpdateMap = keyBy(dataUpdate, 'code');

    installationTemplateCodeUpdateExists.map((installationTemplate) => {
      installationTemplate.name =
        dataUpdateMap[installationTemplate.code]?.name;
      installationTemplate.description =
        dataUpdateMap[installationTemplate.code]?.description;
      installationTemplate.details =
        dataUpdateMap[installationTemplate.code].details;

      return installationTemplate.save();
    });

    return {
      dataError,
      dataSuccess: [...dataSuccess, ...installationTemplateCodeUpdateExists],
    };
  }
}
