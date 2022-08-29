import { JOB_TYPE_MAINTENANCE_ENUM } from '@components/job/job.constant';
import {
  MAINTAIN_REQUEST_STATUS_ENUM,
  MAINTAIN_REQUEST_TYPE_ENUM,
} from '@components/maintain-request/maintain-request.constant';
import * as mongoose from 'mongoose';

const supplySchema = new mongoose.Schema({
  supplyId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: {
    type: Number,
  },
  description: {
    type: String,
    required: false,
    maxlength: 255,
  },
  maintenanceType: {
    type: Number,
    enum: JOB_TYPE_MAINTENANCE_ENUM,
    required: false,
    default: 1,
  },
});

const requestHistorySchema = new mongoose.Schema(
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
    status: {
      type: Number,
    },
    reason: {
      type: String,
      required: false,
      maxlength: 255,
    },
  },
  { timestamps: true },
);
export const MaintainRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    deviceAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'DeviceAssignment',
    },
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    code: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      default: MAINTAIN_REQUEST_STATUS_ENUM.CREATED,
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
    completeExpectedDate: {
      type: Date,
      required: true,
    },
    type: {
      type: Number,
      default: MAINTAIN_REQUEST_TYPE_ENUM.USER_REQUEST,
    },
    priority: {
      type: Number,
      required: true,
    },
    // executionDate: {
    //   type: Date,
    //   required: false,
    // },
    // reason: {
    //   type: String,
    //   required: false,
    //   maxlength: 255,
    // },
    supplies: {
      type: [supplySchema],
    },
    // actualSupplies: {
    //   type: [supplySchema],
    //   required: false,
    // },
    histories: {
      type: [requestHistorySchema],
      required: false,
    },
    expectedMaintainTime: { type: Number, default: 0, required: true },
  },
  {
    collection: 'maintainRequests',
    timestamps: true,
  },
);
