import { DEFAULT_COLLATION } from '@constant/common';
import * as mongoose from 'mongoose';
import { DEVICE_STATUS_ENUM } from '../../components/device-status/device-status.constant';

export const Attributes = new mongoose.Schema({
  key: { type: String },
  value: { type: String },
});

export const DeviceStatusSchema = new mongoose.Schema(
  {
    deviceAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'DeviceAssignment',
    },
    startDate: { type: Date, required: true }, // Ngày giờ bắt đầu
    endDate: { type: Date, required: true }, // Ngày giờ kết thúc
    attributes: {
      type: [Attributes],
      ref: 'AttributeType',
    },
    status: {
      type: Number,
      enum: DEVICE_STATUS_ENUM,
      default: DEVICE_STATUS_ENUM.ACTIVE,
      required: true,
    },
    moId: {
      type: Number,
      required: false,
    },
    passQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
    actualQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'deviceStatuses',
    collation: DEFAULT_COLLATION,
  },
);
