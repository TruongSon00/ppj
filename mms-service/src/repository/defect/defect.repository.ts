import { Injectable } from '@nestjs/common';
import { Defect } from 'src/models/defect/defect.model';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DefectRepositoryInterface } from '@components/defect/interface/defect.repository.interface';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { DEFECT_CONST } from '@components/defect/defect.constant';
import { DEVICE_CONST } from '@components/device/device.constant';
import { FieldVisibility } from '@constant/database.constant';

@Injectable()
export class DefectRepository
  extends BaseAbstractRepository<Defect>
  implements DefectRepositoryInterface
{
  constructor(
    @InjectModel('Defect')
    private readonly defectModel: Model<Defect>,
  ) {
    super(defectModel);
  }
  createDocument(param: any): Defect {
    param.code = param.code
      ? param.code.padStart(
          DEFECT_CONST.CODE.MAX_LENGTH,
          DEFECT_CONST.CODE.PAD_CHAR,
        )
      : null;

    const document = new this.defectModel();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    document.status = param.status;
    document.priority = param.priority;
    document.deviceId = param.deviceId;
    document.isDeleted = param.isDeleted;
    return document;
  }

  createEntity(param: any): Defect {
    const document = new this.defectModel();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    document.status = param.status;
    document.priority = param.priority;
    document.deviceId = param.deviceId;
    document.isDeleted = param.isDeleted;
    return document;
  }

  async checkCodeExist(code: string): Promise<any> {
    const result = await this.defectModel.findOne({ code: code });
    return result;
  }

  async detail(id: string): Promise<any> {
    const result = await this.defectModel.findById(id).populate('histories');
    return result;
  }

  async getList(request: any): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;
    let filterObj = {};
    let sortObj = {};
    const andArray = [];
    if (!isEmpty(keyword)) {
      filterObj = {
        $or: [
          { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          { name: { $regex: '.*' + keyword + '.*', $options: 'i' } },
        ],
      };
    }
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const value = item ? item.text : null;
        switch (item.column) {
          case 'code':
            andArray.push({
              code: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            });
            break;
          case 'name':
            andArray.push({
              name: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            });
            break;
          case 'priority':
            andArray.push({
              priority: parseInt(value),
            });
            break;
          case 'deviceName':
            andArray.push({
              'deviceId.name': {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            });
            break;
          default:
            break;
        }
      });
    }
    if (andArray.length > 0) filterObj['$and'] = andArray;
    const deletedObj = { isDeleted: false };
    const deviceColumn = DEFECT_CONST.DEVICE.COLUMN;

    const query = this.defectModel
      .aggregate()
      .lookup({
        from: DEVICE_CONST.COLL,
        localField: deviceColumn,
        foreignField: DEVICE_CONST.ID.COLUMN,
        as: deviceColumn,
      })
      .unwind({
        path: `$${deviceColumn}`,
        preserveNullAndEmptyArrays: true,
      })
      .match(deletedObj)
      .match(filterObj);

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const order = item.order?.toSortOrder();
        switch (item.column) {
          case 'code':
            sortObj = { code: order };
            break;
          case 'name':
            sortObj = { name: order };
            break;
          case 'deviceName':
            sortObj = { 'device.name': order };
            break;
          case 'priority':
            sortObj = { priority: order };
            break;
          case 'createdAt':
            sortObj = { createdAt: order };
            break;
          case 'updatedAt':
            sortObj = { updatedAt: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }
    const queryResult = (
      await query
        .project({
          id: '$_id',
          _id: FieldVisibility.Hidden,
          code: FieldVisibility.Visible,
          name: FieldVisibility.Visible,
          priority: FieldVisibility.Visible,
          description: FieldVisibility.Visible,
          status: FieldVisibility.Visible,
          createdAt: FieldVisibility.Visible,
          updatedAt: FieldVisibility.Visible,
          device: {
            id: '$deviceId._id',
            code: '$deviceId.code',
            name: '$deviceId.name',
          },
        })
        .buildPaginationQuery(skip, take, sortObj)
        .exec()
    )[0];

    return { result: queryResult.data, count: queryResult.total };
  }

  async update(param: any): Promise<any> {
    const result = await this.defectModel
      .findByIdAndUpdate(param._id, {
        name: param.name,
        description: param.description,
        priority: param.priority,
        deviceId: param.deviceId,
      })
      .populate('histories');
    result.histories.push(param.history);
    return await result.save();
  }
  async delete(id: string): Promise<any> {
    const result = await this.defectModel.findByIdAndDelete(id);
    return result;
  }

  async getListDefectByIds(ids: string[]): Promise<any> {
    return await this.defectModel.find({ _id: { $in: ids } });
  }
}
