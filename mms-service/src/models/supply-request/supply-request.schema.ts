import * as mongoose from 'mongoose';
import { DEFAULT_COLLATION } from '@constant/common';
import { SUPPLY_REQUEST_STATUS_ENUM } from '@components/supply-request/supply-request.constant';
import { HistoryActionEnum } from '@components/history/history.constant';

const requestedBySchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: false,
  },
  userId: {
    type: Number,
  },
});

const supplyRequestDetailSchema = new mongoose.Schema({
  supplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supply',
  },
  quantity: {
    type: Number,
  },
  stockQuantity: {
    type: Number,
  },
  planQuantity: {
    type: Number,
  },
  buyQuantity: {
    type: Number,
  },
  isManufacture: {
    type: Boolean,
  },
  actualImportQuantity: {
    type: Number,
    default: 0,
  },
});

const history = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  action: {
    type: Number,
    enum: HistoryActionEnum,
    default: HistoryActionEnum.CREATE,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  status: {
    type: Number,
    enum: SUPPLY_REQUEST_STATUS_ENUM,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

export const SupplyRequestSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: 12,
      unique: true,
    },
    name: {
      type: String,
      required: false,
      maxlength: 50,
    },
    status: {
      type: Number,
      required: true,
      default: SUPPLY_REQUEST_STATUS_ENUM.WAITING_CONFIRM,
    },
    type: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      maxlength: 255,
      required: false,
    },
    receiveExpectedDate: {
      type: Date,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: false,
    },
    deviceAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceAssignment',
      required: false,
    },
    requestedBy: {
      type: requestedBySchema,
    },
    supplies: {
      type: [supplyRequestDetailSchema],
    },
    histories: {
      type: [history],
      default: [],
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'supplyRequest',
    collation: DEFAULT_COLLATION,
  },
);
