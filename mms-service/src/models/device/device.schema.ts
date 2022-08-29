import { Schema, Types } from 'mongoose';
import {
  DeviceStatus,
  DeviceType,
  DEVICE_CONST,
} from '@components/device/device.constant';
import { transformId } from '../../helper/schema.helper';
import { DEFAULT_COLLATION } from '@constant/common';

export const Supply = new Schema({
  supplyId: {
    type: Types.ObjectId,
    ref: 'Supply',
    require: true,
  },
  quantity: {
    type: Number,
    default: 0,
    require: true,
  },
  useDate: {
    type: Number,
    require: false,
  },
  canRepair: {
    type: Boolean,
    require: false,
  },
  maintenancePeriod: {
    type: Number,
    require: false,
  },
  mttrIndex: {
    type: Number,
    require: false,
  },
  mttaIndex: {
    type: Number,
    require: false,
  },
  mttfIndex: {
    type: Number,
    require: false,
  },
  mtbfIndex: {
    type: Number,
    require: false,
  },
});

export const Information = new Schema({
  vendor: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: false,
  },
  importDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  productionDate: {
    type: Date,
    required: false,
  },
  warrantyPeriod: {
    type: Number,
    required: true,
  },
  maintenanceAttributeId: {
    type: Types.ObjectId,
    required: true,
    ref: 'MaintenanceAttribute',
  },
  mttaIndex: {
    type: Number,
    default: 0,
    required: true,
  },
  mttfIndex: {
    type: Number,
    required: false,
  },
  mtbfIndex: {
    type: Number,
    default: 0,
    required: true,
  },
  mttrIndex: {
    type: Number,
    default: 0,
    required: true,
  },
  maintenancePeriod: {
    type: Number,
    default: 0,
    required: true,
  },
  supplies: {
    type: [Supply],
    required: true,
  },
});

export const DeviceSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: DEVICE_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: DEVICE_CONST.NAME.MAX_LENGTH,
    },
    attributeType: {
      type: [Types.ObjectId],
      ref: 'AttributeType',
      required: false,
    },
    installTemplate: {
      type: Types.ObjectId,
      ref: 'InstallationTemplate',
      required: false,
    },
    checkListTemplateId: {
      type: Types.ObjectId,
      ref: 'CheckListTemplate',
      required: false,
    },
    frequency: {
      type: Number,
      required: true,
    },
    responsibleUserId: {
      type: Number,
      required: false,
      default: null,
    },
    responsibleMaintenanceTeamId: {
      type: String,
      required: false,
      ref: 'MaintenanceTeam',
      default: null,
    },
    model: {
      type: String,
      maxlength: DEVICE_CONST.MODEL.MAX_LENGTH,
    },
    histories: {
      type: [],
    },
    price: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      maxlength: DEVICE_CONST.DESCRIPTION.MAX_LENGTH,
    },
    type: {
      type: Number,
      enum: DeviceType,
      required: true,
    },
    status: {
      type: Number,
      enum: DeviceStatus,
      default: DeviceStatus.AwaitingConfirmation,
      required: true,
    },
    periodicInspectionTime: {
      type: Number,
      required: true,
    },
    deviceGroup: {
      type: Types.ObjectId,
      ref: 'DeviceGroup',
      required: true,
    },
    information: {
      type: Information,
      required: false,
    },
    canRepair: {
      type: Boolean,
      required: true,
    },
  },
  {
    id: true,
    timestamps: true,
    collection: 'devices',
    collation: DEFAULT_COLLATION,
  },
);

transformId(DeviceSchema);
