import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { DeviceStatusRepositoryInterface } from '@components/device-status/interface/device-status.repository.interface';
import { DeviceStatusModel } from '../../models/device-status/device-status.model';
import { DEVICE_STATUS_ENUM } from '@components/device-status/device-status.constant';
import { ListDeviceStatusQuery } from '@components/device-status/dto/query/list-device-status.query';
import { DeviceStatusActivityDetailRequestDto } from '@components/device-status/dto/request/create-device-status-activity.request.dto';
import { ListDeviceStatusActivityInfoRequestDto } from '@components/device-status/dto/request/list-device-status-activity-info.request.dto';
const ObjectId = mongoose.Types.ObjectId;
const MILLISECONDS_IN_MINUTE = 60000;
@Injectable()
export class DeviceStatusRepository
  extends BaseAbstractRepository<DeviceStatusModel>
  implements DeviceStatusRepositoryInterface
{
  constructor(
    @InjectModel('DeviceStatus')
    private readonly deviceStatusModel: Model<DeviceStatusModel>,
  ) {
    super(deviceStatusModel);
  }

  async listDeviceStatusActivityInfo(
    payload: ListDeviceStatusActivityInfoRequestDto,
  ): Promise<any> {
    const { deviceAssignmentId } = payload;

    return this.deviceStatusModel.aggregate([
      {
        $match: {
          deviceAssignmentId: new ObjectId(`${deviceAssignmentId}`),
        },
      },
    ]);
  }

  createDeviceStatusActivity(
    body: DeviceStatusActivityDetailRequestDto[],
    deviceAssignmentId: string,
  ): Promise<any> {
    const newData = body.map((val) => {
      return {
        ...val,
        deviceAssignmentId,
      };
    });
    return this.deviceStatusModel.insertMany(newData);
  }

  findByDate(
    startDate: Date,
    endDate: Date,
    deviceAssignmentId: string,
  ): Promise<any> {
    return this.deviceStatusModel
      .findOne({
        $or: [
          {
            startDate: {
              $lte: new Date(startDate),
            },
            endDate: {
              $gte: new Date(startDate),
            },
          },
          {
            startDate: {
              $lte: new Date(endDate),
            },
            endDate: {
              $gte: new Date(endDate),
            },
          },
          {
            startDate: {
              $gte: new Date(startDate),
            },
            endDate: {
              $lte: new Date(endDate),
            },
          },
        ],
        deviceAssignmentId: new Types.ObjectId(deviceAssignmentId),
      })
      .exec();
  }

  async list(request: ListDeviceStatusQuery): Promise<any> {
    const query = await this.deviceStatusModel
      .aggregate([
        {
          $project: {
            deviceAssignmentId: 1,
            endDate: 1,
            startDate: 1,
            status: 1,
            moId: 1,
            passQuantity: 1,
            actualQuantty: 1,
            numOfStop: {
              $cond: [{ $eq: ['$status', DEVICE_STATUS_ENUM.STOP] }, 1, 0],
            },
            timeAction: {
              $cond: [
                { $eq: ['$status', DEVICE_STATUS_ENUM.ACTIVE] },
                {
                  $divide: [
                    { $subtract: ['$endDate', '$startDate'] },
                    MILLISECONDS_IN_MINUTE,
                  ],
                },
                0,
              ],
            },
            timeRest: {
              $cond: [
                { $ne: ['$status', DEVICE_STATUS_ENUM.ACTIVE] },
                {
                  $divide: [
                    { $subtract: ['$endDate', '$startDate'] },
                    MILLISECONDS_IN_MINUTE,
                  ],
                },
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: '$deviceAssignmentId',
            numOfStop: { $sum: '$numOfStop' },
            timeAction: { $sum: '$timeAction' },
            timeRest: { $sum: '$timeRest' },
            date: { $max: '$endDate' },
            status: { $last: '$status' },
            moIds: {
              $addToSet: '$moId',
            },
            passQuantity: { $sum: '$passQuantity' },
            actualQuantty: { $sum: '$actualQuantty' },
          },
        },
        {
          $lookup: {
            from: 'deviceAssignments',
            localField: '_id',
            foreignField: '_id',
            as: 'deviceAssignment',
            pipeline: [
              {
                $lookup: {
                  from: 'devices',
                  localField: 'deviceId',
                  foreignField: '_id',
                  as: 'device',
                },
              },
            ],
          },
        },
        {
          $facet: {
            data: [
              { $skip: (request.page - 1) * request.take },
              { $limit: request.take },
            ],
            count: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ])
      .exec();
    return {
      data: query[0]?.data || [],
      count: query[0]?.count[0]?.count || 0,
    };
  }

  createMany(data: any): Promise<any> {
    return this.deviceStatusModel.insertMany(data);
  }
}
