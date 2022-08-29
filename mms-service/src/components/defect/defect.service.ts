import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DefectRepositoryInterface } from './interface/defect.repository.interface';
import { DefectServiceInterface } from './interface/defect.service.interface';
import { CreateDefectRequestDto } from '@components/defect/dto/request/create-defect.request.dto';
import { UserService } from '@components/user/user.service';
import {
  DEFECT_HEADER,
  DEFECT_NAME,
  DefectStatusConstant,
} from '@components/defect/defect.constant';
import { HistoryActionEnum } from '@components/history/history.constant';
import { plainToInstance } from 'class-transformer';
import { GetListDefectRequestDto } from '@components/defect/dto/request/get-list-defect.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { ResponsePayload } from '@utils/response-payload';
import { DetailDefectResponse } from '@components/defect/dto/response/detail-defect.response.dto';
import { UpdateDefectResponseDto } from '@components/defect/dto/response/update-defect.response.dto';
import { UpdateDefectRequestDto } from '@components/defect/dto/request/update-defect.request.dto';
import { isEmpty, keyBy, has, uniq, map } from 'lodash';
import { CreateDefectResponseDto } from '@components/defect/dto/response/create-defect.response.dto';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { GetAllConstant } from '@components/supply/supply.constant';
import { GetAllDefectResponseDto } from '@components/defect/dto/response/get-all-defect.response.dto';
import { ExportDefectRequestDto } from '@components/defect/dto/request/export-defect.request.dto';
import { CsvWriter } from '@core/csv/csv.writer';
import { DetailDefectRequestDto } from './dto/request/detail-defect.request.dto';
import { DeleteDefectRequestDto } from './dto/request/delete-defect.request.dto';

@Injectable()
export class DefectService implements DefectServiceInterface {
  constructor(
    @Inject('DefectRepositoryInterface')
    private readonly defectRepository: DefectRepositoryInterface,
    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,
    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserService,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getDetail(
    request: DetailDefectRequestDto,
  ): Promise<ResponsePayload<DetailDefectResponse | any>> {
    const { id } = request;
    const response = await this.defectRepository.detail(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEFECT_NOT_FOUND'))
        .build();
    }
    const device = await this.deviceRepository.detail(response.deviceId);
    if (!device) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_NOT_FOUND'))
        .build();
    }
    response.devices = device;
    await this.historyService.mapUserHistory(response.histories);
    await this.historyService.sortHistoryDesc(response.histories);
    const result = plainToInstance(DetailDefectResponse, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async create(request: CreateDefectRequestDto): Promise<any> {
    try {
      const { code, name, description, userId, deviceId, priority } = request;
      const codeInput = code ? code.trim() : null;
      const nameInput = name ? name.trim() : null;

      if (isEmpty(codeInput) || isEmpty(nameInput)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.MISSING_REQUIRED_FIELDS'),
          )
          .build();
      }

      const defectDocument = this.defectRepository.createDocument({
        code: code,
        name: name,
        description: description,
        status: DefectStatusConstant.AWAITING,
        deviceId: deviceId,
        priority: priority,
        isDeleted: false,
      });
      const codeExist = await this.defectRepository.checkCodeExist(
        defectDocument?.code,
      );
      if (codeExist) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
          .withMessage(await this.i18n.translate('error.DEFECT_CODE_EXISTED'))
          .build();
      }
      const defect = await this.defectRepository.create(defectDocument);
      defect.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });
      const response = await defect.save();
      const result = plainToInstance(CreateDefectResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async update(request: UpdateDefectRequestDto): Promise<any> {
    const { _id, name, description, userId, deviceId, priority } = request;
    const supply = await this.defectRepository.detail(_id);
    if (!supply) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEFECT_NOT_FOUND'))
        .build();
    }
    try {
      const updateResult = await this.defectRepository.update({
        ...request,
        history: {
          userId: userId,
          action: HistoryActionEnum.UPDATE,
          createdAt: new Date(),
        },
      });
      const response = await this.defectRepository.detail(_id);
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.DEFECT_NOT_FOUND'))
          .build();
      }
      const userRaws = {};
      const userIds = [];
      if (!isEmpty(response.histories)) {
        response.histories.forEach((item) => {
          if (!userIds.includes(item.userId)) {
            userIds.push(item.userId);
          }
        });
        const userList = await this.userService.getListByIDs(userIds);
        if (!isEmpty(userList)) {
          userList.forEach((item) => {
            userRaws[item.id] = item.username;
          });
          response.histories.forEach((item) => {
            item.username = userRaws[item.userId];
          });
        }
      }
      const result = plainToInstance(UpdateDefectResponseDto, response, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder(result)
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

  async getList(request: GetListDefectRequestDto): Promise<any> {
    if (parseInt(request.isGetAll) == GetAllConstant.YES) {
      const response = await this.defectRepository.findAll();
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.DEFECT_NOT_FOUND'))
          .build();
      }
      const result = plainToInstance(GetAllDefectResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } else {
      const { result, count } = await this.defectRepository.getList(request);

      return new ResponseBuilder<PagingResponse>({
        items: result,
        meta: { total: count, page: request.page },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    }
  }
  async delete(request: DeleteDefectRequestDto) {
    const { id } = request;
    const defect = await this.defectRepository.findOneById(id);
    if (!defect) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEFECT_NOT_FOUND'))
        .build();
    }
    const result = await this.defectRepository.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async exportDefect(request: ExportDefectRequestDto): Promise<any> {
    const defects = await this.defectRepository.getListDefectByIds(
      request._ids,
    );
    if (!defects) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.SUPPLY_GROUP_NOT_FOUND'))
        .build();
    }
    for (const e of defects) {
      if (e.deviceId) {
        const device = await this.deviceRepository.detail(e.deviceId);
        e.deviceName = device.name;
      } else e.deviceName = null;
    }
    const responseRef = defects.reduce((x, y) => {
      x.push({
        _id: y._id ? y._id.toString() : '',
        code: y.code ? y.code : '',
        name: y.name ? y.name : '',
        description: y.description ? y.description : '',
        deviceName: y.deviceName ? y.deviceName : '',
        priority: y.priority ? y.priority : 0,
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
    csvWriter.name = DEFECT_NAME;
    csvWriter.mapHeader = DEFECT_HEADER;
    csvWriter.i18n = this.i18n;
    let index = 0;
    const dataCsv = responseRef.map((i) => {
      index++;
      return {
        i: index,
        _id: i._id,
        code: i.code,
        name: i.name,
        description: i.description,
        deviceName: i.deviceName,
        priority: i.priority,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      };
    });

    return new ResponseBuilder<any>({
      file: await csvWriter.writeCsv(dataCsv),
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
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

    const defectCodeInsertExists =
      await this.defectRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const defectCodeUpdateExists =
      await this.defectRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const defectInsertMap = keyBy(defectCodeInsertExists, 'code');
    const defectUpdateMap = keyBy(defectCodeUpdateExists, 'code');
    const deviceCodes = uniq(map(data, 'deviceCode'));
    const devices = await this.deviceRepository.findAllByCondition({
      code: { $in: deviceCodes },
    });
    const deviceMap = keyBy(devices, 'code');
    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(defectInsertMap, item.code) || !has(deviceMap, item.deviceCode)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (
        !has(defectUpdateMap, item.code) ||
        !has(deviceMap, item.deviceCode)
      ) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const defectDocument = dataInsert.map((item) => {
      const defect = this.defectRepository.createEntity({
        code: item.code,
        name: item.name,
        description: item.description,
        priority: item.priority,
        deviceId: deviceMap[item.deviceCode]._id,
        isDeleted: false,
      });
      defect.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });
      return defect;
    });
    const dataSuccess = await this.defectRepository.createMany(defectDocument);
    const dataUpdateMap = keyBy(dataUpdate, 'code');

    await Promise.all(
      defectCodeUpdateExists.map((defect) => {
        defect.name = dataUpdateMap[defect.code]?.name;
        defect.description = dataUpdateMap[defect.code]?.description;
        defect.priority = dataUpdateMap[defect.code]?.priority;
        defect.deviceId = deviceMap[dataUpdateMap[defect.code].deviceCode]._id;
        defect.histories.push({
          userId: userId,
          action: HistoryActionEnum.UPDATE,
          createdAt: new Date(),
        });
        return defect.save();
      }),
    );

    return {
      dataError,
      dataSuccess: [...dataSuccess, ...defectCodeUpdateExists],
    };
  }
}
