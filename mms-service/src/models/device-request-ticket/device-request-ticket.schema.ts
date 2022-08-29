import { Schema, Types } from 'mongoose';
import {
  DEVICE_REQUEST_CONST,
  DEVICE_REQUEST_STATUS_ENUM,
  DEVICE_REQUEST_TYPE_ENUM,
} from '@components/device-request/device-request.constant';
import { DEFAULT_COLLATION } from '@constant/common';

export enum DeviceRequestTicketStatus {
  AwaitingConfirmation, // Waiting confirm
  AwaitingITConfirmation, // Waiting IT confirm
  AwaitingAssignment, // Waiting assign
  Assigned, // Assigned
  Confirmed, // Confirmed
  Rejected, // Rejected
  WaitingExport,
  Installed,
}

export const DeviceInDeviceRequestSchema = new Schema();

export const DeviceRequestTicketSchema = new Schema(
  {
    code: {
      type: String,
      maxlength: DEVICE_REQUEST_CONST.CODE.MAX_LENGTH,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: DEVICE_REQUEST_CONST.NAME.MAX_LENGTH,
      minlength: DEVICE_REQUEST_CONST.NAME.MIN_LENGTH,
    },
    description: {
      type: String,
      maxlength: DEVICE_REQUEST_CONST.DESCRIPTION.MAX_LENGTH,
      required: false,
    },
    factoryId: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    status: {
      type: Number,
      enum: DEVICE_REQUEST_CONST.STATUS.ENUM,
      default: DEVICE_REQUEST_STATUS_ENUM.WAITING_LEADER_APPROVE,
      required: true,
    },
    deviceGroupIds: {
      type: [Types.ObjectId],
      ref: 'DeviceGroup',
      required: true,
    },
    deviceIds: {
      type: [Types.ObjectId],
      required: true,
      ref: 'Device',
      default: [],
    },
    type: {
      type: Number,
      enum: DEVICE_REQUEST_TYPE_ENUM,
      required: true,
    },
    createdBy: {
      type: Number,
      required: true,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    id: true,
    timestamps: true,
    collection: DEVICE_REQUEST_CONST.REQUEST_TICKET.COLL,
    collation: DEFAULT_COLLATION,
  },
);

DeviceRequestTicketSchema.virtual('deviceGroups', {
  ref: 'DeviceGroup',
  localField: 'deviceGroupIds',
  foreignField: '_id',
  justOne: false,
});

DeviceRequestTicketSchema.virtual('devices', {
  ref: 'Device',
  localField: 'deviceIds',
  foreignField: '_id',
  justOne: false,
});
