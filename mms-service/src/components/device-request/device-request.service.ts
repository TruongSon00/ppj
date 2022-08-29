import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import {
  DEVICE_REQUEST_ACTION_CONFIRMED,
  DEVICE_REQUEST_ACTION_LEADER_APPROVE,
  DEVICE_REQUEST_ACTION_ME_APPROVE,
  DEVICE_REQUEST_ACTION_REJECTED,
  DEVICE_REQUEST_STATUS_CAN_DELETE,
  DEVICE_REQUEST_STATUS_ENUM,
} from './device-request.constant';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { DeviceRequestServiceInterface } from '@components/device-request/interface/device-request.service.interface';
import { ResponsePayload } from '@utils/response-payload';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { DetailDeviceRequestTicketResponseDto } from '@components/device-request/dto/response/detail-device-request-ticket.response.dto';
import { UpdateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/update-device-request-ticket.request.dto';
import { keyBy, map, isEmpty } from 'lodash';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import { DEVICE_REQUEST_CONST } from '@components/device-request/device-request.constant';
import { Types } from 'mongoose';
import { generateCodeByPreviousCode } from 'src/helper/code.helper';
import { plainToInstance } from 'class-transformer';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { UpdateStatusDeviceRequestRequestDto } from './dto/request/request-ticket/update-status-device-request.request.dto';

@Injectable()
export class DeviceRequestService implements DeviceRequestServiceInterface {
  constructor(
    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('DeviceGroupRepositoryInterface')
    private readonly deviceGroupRepository: DeviceGroupRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async list(request: ListDeviceRequestsRequestDto): Promise<any> {
    const { items, count } = await this.deviceRequestTicketRepository.getList(
      request,
    );
    const factoryIds = map(items, 'factoryId');
    let factories = await this.userService.getFactoryList({ factoryIds });
    factories = keyBy(factories, 'id');
    const res = items.map((item) => ({
      ...item,
      factory: factories[item.factoryId],
    }));
    const response = plainToInstance(
      DetailDeviceRequestTicketResponseDto,
      res,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder({
      items: response,
      meta: { total: count, page: request?.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  async create(request: CreateDeviceRequestTicketRequestDto): Promise<any> {
    const { deviceGroupIds, factoryId, deviceIds } = request;
    try {
      const deviceGroups = await this.deviceGroupRepository.findAllByCondition({
        _id: {
          $in: deviceGroupIds,
        },
      });

      if (deviceGroups.length !== deviceGroupIds.length) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const factory = await this.userService.getFactoryById(factoryId);

      if (!factory) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      if (!isEmpty(deviceIds)) {
        const devices = await this.deviceRepository.findAllByCondition({
          _id: {
            $in: deviceIds,
          },
        });
        if (devices.length !== deviceIds.length) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.NOT_FOUND)
            .withMessage(await this.i18n.translate('error.NOT_FOUND'))
            .build();
        }
      }

      const code = await this.generateTicketCode();

      const deviceRequestTicket =
        await this.deviceRequestTicketRepository.createDocument(request, code);
      await deviceRequestTicket.save();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async detail(id: string): Promise<ResponsePayload<unknown>> {
    const deviceRequestTicket =
      await this.deviceRequestTicketRepository.findOneWithPopulate(
        { _id: new Types.ObjectId(id) },
        [
          {
            path: 'deviceGroups',
            select: '_id name code',
          },
          {
            path: 'devices',
            select: '_id name code serial',
          },
        ],
      );

    if (!deviceRequestTicket) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const factory = await this.userService.getFactoryById(
      deviceRequestTicket.factoryId,
    );

    const res = {
      ...deviceRequestTicket,
      factory: factory || {},
    };

    const response = plainToInstance(
      DetailDeviceRequestTicketResponseDto,
      res,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  async update(request: UpdateDeviceRequestTicketRequestDto): Promise<any> {
    const { id, factoryId, deviceGroupIds } = request;
    // check device request exists in db
    let deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      id,
    );
    if (!deviceRequest) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check device group exists in db
    const deviceGroups = await this.deviceGroupRepository.findAllByCondition({
      _id: {
        $in: deviceGroupIds,
      },
    });
    if (deviceGroups.length !== deviceGroupIds.length) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    // check factory exists in db
    const factory = await this.userService.getFactoryById(factoryId);
    if (!factory) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    try {
      deviceRequest = this.deviceRequestTicketRepository.updateDocument(
        deviceRequest,
        request,
      );
      deviceRequest.save();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('success.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async delete(id: string): Promise<any> {
    const deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      id,
    );
    if (!deviceRequest) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    if (!DEVICE_REQUEST_STATUS_CAN_DELETE.includes(deviceRequest.status)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_REQUEST_STATUS_INVALID'),
        )
        .build();
    }
    try {
      await this.deviceRequestTicketRepository.softDelete(id);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async updateStatus(
    request: UpdateStatusDeviceRequestRequestDto,
  ): Promise<any> {
    const { id, action } = request;
    const status = this.getDeviceStatusByAction(action);
    const deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      id,
    );
    if (!deviceRequest) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const isStatusValid = this.checkStatusValid(deviceRequest.status, status);
    if (!isStatusValid) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_REQUEST_STATUS_INVALID'),
        )
        .build();
    }
    try {
      deviceRequest.status = status;
      deviceRequest.save();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  private getDeviceStatusByAction(action: string): number {
    switch (action) {
      case DEVICE_REQUEST_ACTION_LEADER_APPROVE:
        return DEVICE_REQUEST_STATUS_ENUM.WAITING_ME_APPROVE;
      case DEVICE_REQUEST_ACTION_ME_APPROVE:
        return DEVICE_REQUEST_STATUS_ENUM.WAITING_WAREHOUSE_EXPORT;
      case DEVICE_REQUEST_ACTION_CONFIRMED:
        return DEVICE_REQUEST_STATUS_ENUM.CONFIRMED;
      case DEVICE_REQUEST_ACTION_REJECTED:
        return DEVICE_REQUEST_STATUS_ENUM.REJECTED;
      default:
        return DEVICE_REQUEST_STATUS_ENUM.WAITING_LEADER_APPROVE;
    }
  }

  private checkStatusValid(oldStatus, newStatus) {
    switch (newStatus) {
      case DEVICE_REQUEST_STATUS_ENUM.WAITING_ME_APPROVE:
        return oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_LEADER_APPROVE;
      case DEVICE_REQUEST_STATUS_ENUM.REJECTED:
        return (
          oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_LEADER_APPROVE ||
          oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_ME_APPROVE
        );
      case DEVICE_REQUEST_STATUS_ENUM.WAITING_WAREHOUSE_EXPORT:
        return oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_ME_APPROVE;
      case DEVICE_REQUEST_STATUS_ENUM.WAITING_ASSIGNMENT:
        return (
          oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_WAREHOUSE_EXPORT
        );
      case DEVICE_REQUEST_STATUS_ENUM.WAITING_INSTALLATION:
        return oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_ASSIGNMENT;
      case DEVICE_REQUEST_STATUS_ENUM.INSTALLED:
        return oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_INSTALLATION;
      case DEVICE_REQUEST_STATUS_ENUM.CONFIRMED:
        return oldStatus === DEVICE_REQUEST_STATUS_ENUM.INSTALLED;
      case DEVICE_REQUEST_STATUS_ENUM.WAITING_WAREHOUSE_IMPORT:
        return oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_ME_APPROVE;
      case DEVICE_REQUEST_STATUS_ENUM.COMPLETED:
        return (
          oldStatus === DEVICE_REQUEST_STATUS_ENUM.WAITING_WAREHOUSE_IMPORT
        );
      default:
        return false;
    }
  }

  public async generateTicketCode(): Promise<string> {
    const requestTicket = await this.deviceRequestTicketRepository.getLatest();
    const requestTicketCode = Number.parseInt(requestTicket?.code);
    const deviceRequestConst = DEVICE_REQUEST_CONST.CODE;
    const generateNewRequestCode = (currentCode: number) =>
      generateCodeByPreviousCode(
        currentCode,
        deviceRequestConst.MAX_LENGTH,
        deviceRequestConst.GAP,
        deviceRequestConst.PAD_CHAR,
      );
    return isNaN(requestTicketCode)
      ? generateNewRequestCode(deviceRequestConst.DEFAULT_CODE)
      : generateNewRequestCode(Math.max(requestTicketCode || 0));
  }
}
