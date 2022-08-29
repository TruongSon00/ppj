import { keyBy, has } from 'lodash';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CheckListTemplateServiceInterface } from '@components/checklist-template/interface/checklist-template.service.interface';
import { CheckListTemplateRepositoryInterface } from '@components/checklist-template/interface/checklist-template.repository.interface';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { PagingResponse } from '@utils/paging.response';
import { CreateCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/create-checklist-template.request.dto';
import { GetListCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/get-list-checklist-template.request.dto';
import { DetailCheckListTemplateResponseDto } from '@components/checklist-template/dto/response/detail-checklist-template.response.dto';
import { UpdateCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/update-checklist-template.request.dto';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { GetAllConstant } from '@components/supply/supply.constant';
import { GetListCheckListTemplateResponseDto } from '@components/checklist-template/dto/response/get-all-checklist-template.response.dto';
import { ExportCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/export-checklist-template.request.dto';
import { CsvWriter } from '@core/csv/csv.writer';
import {
  CheckTypeImport,
  CHECK_LIST_TEMPLATE_DETAIL_HEADER,
  CHECK_LIST_TEMPLATE_HEADER,
  CHECK_LIST_TEMPLATE_NAME,
} from '@components/checklist-template/checklist-template.constant';
import { DeleteCheclistTemplateRequestDto } from './dto/request/delete-checklist-template.request.dto';
import { DetailCheclistTemplateRequestDto } from './dto/request/detail-checklist-template.request.dto';
import { HistoryActionEnum } from '@components/history/history.constant';

@Injectable()
export class CheckListTemplateService
  implements CheckListTemplateServiceInterface
{
  constructor(
    @Inject('CheckListTemplateRepositoryInterface')
    private readonly checklistTemplateRepository: CheckListTemplateRepositoryInterface,

    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: CreateCheckListTemplateRequestDto): Promise<any> {
    try {
      const { code } = request;
      const isCodeExisted =
        await this.checklistTemplateRepository.findOneByCondition({ code });
      if (isCodeExisted) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate(
              'error.CHECKLIST_TEMPLATE_CODE_IS_EXISTED',
            ),
          )
          .build();
      }
      const checklistTemplate =
        this.checklistTemplateRepository.createEntity(request);
      await this.checklistTemplateRepository.create(checklistTemplate);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }

  async getList(request: GetListCheckListTemplateRequestDto): Promise<any> {
    if (parseInt(request.isGetAll) === GetAllConstant.YES) {
      const data = await this.checklistTemplateRepository.findAll();
      if (!data) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.CHECK_LIST_TEMPLATE_NOT_FOUND'),
          )
          .build();
      }
      const result = plainToInstance(
        GetListCheckListTemplateResponseDto,
        data,
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } else {
      const { result, count } = await this.checklistTemplateRepository.getList(
        request,
      );
      const response = plainToInstance(
        GetListCheckListTemplateResponseDto,
        result,
        { excludeExtraneousValues: true },
      );

      return new ResponseBuilder<PagingResponse>({
        items: response,
        meta: { total: count, page: request.page },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    }
  }

  async findOneByCode(code: string): Promise<any> {
    const response = await this.checklistTemplateRepository.findOneByCondition({
      code,
    });
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const result = plainToInstance(
      DetailCheckListTemplateResponseDto,
      response,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async delete(request: DeleteCheclistTemplateRequestDto) {
    const { id } = request;
    const checklistTemplate =
      await this.checklistTemplateRepository.findOneById(id);
    if (!checklistTemplate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const isChecklistHasAssignDevice =
      await this.deviceRepository.findOneByCondition({
        checkListTemplateId: id,
        deletedAt: null,
      });
    if (isChecklistHasAssignDevice) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate(
            'error.CHECKLIST_TEMPLATE_HAS_ASSIGN_DEVICE',
          ),
        )
        .build();
    }
    await this.checklistTemplateRepository.softDelete(id);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async detail(request: DetailCheclistTemplateRequestDto): Promise<any> {
    const { id } = request;
    const response = await this.checklistTemplateRepository.detail(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_NOT_FOUND'))
        .build();
    }
    await this.historyService.mapUserHistory(response.histories);
    await this.historyService.sortHistoryDesc(response.histories);
    const result = plainToInstance(
      DetailCheckListTemplateResponseDto,
      response,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async update(request: UpdateCheckListTemplateRequestDto): Promise<any> {
    const { id } = request;
    let checkListTemplate = await this.checklistTemplateRepository.findOneById(
      id,
    );
    if (!checkListTemplate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const isChecklistHasAssignDevice =
      await this.deviceRepository.findOneByCondition({
        checkListTemplateId: id,
        deletedAt: null,
      });
    if (isChecklistHasAssignDevice) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate(
            'error.CHECKLIST_TEMPLATE_HAS_ASSIGN_DEVICE',
          ),
        )
        .build();
    }
    try {
      checkListTemplate = this.checklistTemplateRepository.updateEntity(
        checkListTemplate,
        request,
      );
      await this.checklistTemplateRepository.findByIdAndUpdate(
        id,
        checkListTemplate,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async exportCheckListTemplate(
    request: ExportCheckListTemplateRequestDto,
  ): Promise<any> {
    const checkListTemplates =
      await this.checklistTemplateRepository.getListCheckListTemplateByIds(
        request._ids,
      );
    if (!checkListTemplates) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const responseDetail = checkListTemplates.reduce((x, y) => {
      for (const e of y.details) {
        x.push({
          code: y.code ? y.code : '',
          title: e.title ? e.title : '',
          description: e.description ? e.description : 0,
          obligatory: e.obligatory ? e.obligatory : 0,
        });
      }
      return x;
    }, []);
    const responseRef = checkListTemplates.reduce((x, y) => {
      x.push({
        _id: y._id ? y._id.toString() : '',
        code: y.code ? y.code : '',
        name: y.name ? y.name : '',
        description: y.description ? y.description : '',
        checkType: y.checkType ? y.checkType : '',
        createdAt: y.createdAt
          ? y.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
          : new Date(),
        updatedAt: y.updatedAt
          ? y.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
          : new Date(),
      });
      return x;
    }, []);

    const csvWriter = new CsvWriter();
    csvWriter.name = CHECK_LIST_TEMPLATE_NAME;
    csvWriter.mapHeader = CHECK_LIST_TEMPLATE_HEADER;
    csvWriter.i18n = this.i18n;

    const csvDetailWriter = new CsvWriter();
    csvDetailWriter.name = CHECK_LIST_TEMPLATE_NAME;
    csvDetailWriter.mapHeader = CHECK_LIST_TEMPLATE_DETAIL_HEADER;
    csvDetailWriter.i18n = this.i18n;
    let index = 0;
    const dataCsv = responseRef.map((i) => {
      index++;
      return {
        i: index,
        _id: i._id,
        code: i.code,
        name: i.name,
        description: i.description,
        checkType: i.checkType,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        responsibleUser: i.responsibleUser,
      };
    });
    const dataDetailCsv = responseDetail.map((i) => {
      index++;
      return {
        i: index,
        code: i.code,
        title: i.title,
        description: i.description,
        obligatory: i.obligatory,
      };
    });

    return new ResponseBuilder<any>({
      file: await csvWriter.writeCsv(dataCsv),
      fileDetail: await csvDetailWriter.writeCsv(dataDetailCsv),
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async createMany(
    data: any,
    userId: number,
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

    const checkListTemplateCodeInsertExists =
      await this.checklistTemplateRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const checkListTemplateCodeUpdateExists =
      await this.checklistTemplateRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const checkListTemplateInsertMap = keyBy(
      checkListTemplateCodeInsertExists,
      'code',
    );
    const checkListTemplateUpdateMap = keyBy(
      checkListTemplateCodeUpdateExists,
      'code',
    );

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(checkListTemplateInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(checkListTemplateUpdateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const checkListTemplateDocuments = dataInsert.map((item) => {
      const checkListTemplate = this.checklistTemplateRepository.createEntity({
        code: item.code,
        name: item.name,
        description: item.description,
        checkType: CheckTypeImport[item.checkType],
        details: item.details,
      });
      checkListTemplate.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });
      return checkListTemplate;
    });
    const dataSuccess = await this.checklistTemplateRepository.createMany(
      checkListTemplateDocuments,
    );
    const dataUpdateMap = keyBy(dataUpdate, 'code');

    checkListTemplateCodeUpdateExists.map((checkListTemplate) => {
      checkListTemplate.name = dataUpdateMap[checkListTemplate.code]?.name;
      checkListTemplate.description =
        dataUpdateMap[checkListTemplate.code]?.description;
      checkListTemplate.checkType =
        CheckTypeImport[dataUpdateMap[checkListTemplate.code].checkType];
      checkListTemplate.details = dataUpdateMap[checkListTemplate.code].details;

      checkListTemplate.histories.push({
        userId: userId,
        action: HistoryActionEnum.UPDATE,
        createdAt: new Date(),
      });
      return checkListTemplate.save();
    });

    return {
      dataError,
      dataSuccess: [...dataSuccess, ...checkListTemplateCodeUpdateExists],
    };
  }
}
