import * as mongoose from 'mongoose';
import { JOB_TYPE_MAINTENANCE_ENUM } from '@components/job/job.constant';
import { CheckTypeEnum } from '@components/checklist-template/checklist-template.constant';
import {
  WARNING_STATUS_ENUM,
  WARNING_TYPE_ENUM,
} from '@components/warning/warning.constant';

const detailSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  obligatory: {
    type: Number,
  },
});

const supplySchema = new mongoose.Schema({
  supplyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  quantity: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  maintenanceType: {
    type: Number,
    enum: JOB_TYPE_MAINTENANCE_ENUM,
    required: false,
    default: 1,
  },
});

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
    },
    userName: {
      type: String,
    },
    action: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true },
);

export const WarningSchema = new mongoose.Schema(
  {
    defectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Defect',
    },
    completeExpectedDate: {
      type: Date,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      default: WARNING_STATUS_ENUM.CREATED,
    },
    executionDate: {
      type: Date,
      required: false,
    },
    type: {
      type: Number,
      default: WARNING_TYPE_ENUM.WARNING,
    },
    deviceAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceAssignment',
    },
    maintanceSupplyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    supplies: {
      type: [supplySchema],
    },
    actualSupplies: {
      type: [supplySchema],
      required: false,
    },
    priority: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    checkType: {
      type: Number,
      enum: CheckTypeEnum,
      required: false,
    },
    maintanceType: {
      type: Number,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    details: {
      type: [detailSchema],
    },
    histories: {
      type: [historySchema],
      required: false,
    },
    reason: {
      type: String,
      required: false,
    },
    scheduleDate: {
      type: Date,
      required: false,
    },
  },
  { collection: 'warnings' },
);
WarningSchema.set('timestamps', true);
