import * as mongoose from 'mongoose';
import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import { transformId } from '../../helper/schema.helper';

export enum DeviceAssignStatus {
  AwaitingConfirmation,
  Confirmed,
  Used,
  Pause,
  Scrap,
}

export const SupplyHistory = new mongoose.Schema(
  {
    supplyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    usageTimeToMaintenance: {
      type: Number,
    },
    usageTimeToReplace: {
      type: Number,
    },
    confirmationTime: {
      type: Number,
    },
    repairTime: {
      type: Number,
    },
    maintenanceType: {
      type: Number,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const MaintainRequestHistory = new mongoose.Schema(
  {
    mttrIndex: {
      type: Number,
    },
    mttaIndex: {
      type: Number,
    },
    mtbfIndex: {
      type: Number,
    },
    mttfIndex: {
      type: Number,
    },
    maintainRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintainRequest',
    },
    supplyHistories: {
      type: [SupplyHistory],
    },
  },
  { timestamps: true },
);

export const ProductivityTargetHistory = new mongoose.Schema({
  productivityTarget: {
    type: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export const SupplyIndex = new mongoose.Schema(
  {
    mttrIndex: {
      type: Number,
    },
    mttaIndex: {
      type: Number,
    },
    mtbfIndex: {
      type: Number,
    },
    mttfIndex: {
      type: Number,
    },
    estMaintenceDate: {
      type: Date,
    },
    estReplaceDate: {
      type: Date,
    },
    supplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supply',
    },
  },
  { timestamps: true },
);

export enum AssignTypeEnum {
  USER,
  TEAM,
}

export class Assignment {
  type: AssignTypeEnum;
  id: string;
}

export const OperationTime = new mongoose.Schema({
  workOrderId: { type: Number, required: true },
  shiftId: { type: Number, required: true },
  operationDate: { type: Date, required: true },
  actualOperationTime: { type: Number, required: true },
  actualBreakTime: { type: Number, required: true },
});

export const DeviceAssignmentSchema = new mongoose.Schema(
  {
    workTimeDataSource: {
      type: Number,
      required: false,
    },
    productivityTarget: {
      type: Number,
      required: false,
    },
    userId: {
      type: Number,
      required: false,
    },
    assign: {
      type: {
        type: Number,
      },
      id: {
        type: String,
      },
    },
    // TODO: delete responsibleUserId after demo
    responsibleUserId: {
      type: Number,
      required: false,
    },
    status: {
      type: Number,
      default: DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
    },
    serial: {
      type: String,
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: false,
    },
    factoryId: {
      type: Number,
      required: false,
    },
    workCenterId: {
      type: Number,
      required: false,
    },
    oee: {
      type: Number,
      required: false,
    },
    assignedAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      required: true,
    },
    deviceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceRequestTicket',
      required: true,
    },
    histories: {
      type: [],
    },
    information: {
      type: {},
      required: false,
    },
    mttrIndex: {
      type: Number,
      required: false,
    },
    mttaIndex: {
      type: Number,
      required: false,
    },
    mtbfIndex: {
      type: Number,
      required: false,
    },
    mttfIndex: {
      type: Number,
      required: false,
    },
    supplyIndex: {
      type: [SupplyIndex],
      required: false,
    },
    maintainRequestHistories: {
      type: [MaintainRequestHistory],
      required: false,
    },
    productivityTargetHistories: {
      type: [ProductivityTargetHistory],
      required: false,
    },
    operationTime: {
      type: [OperationTime],
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { collection: 'deviceAssignments' },
);
DeviceAssignmentSchema.set('timestamps', true);
transformId(DeviceAssignmentSchema);
