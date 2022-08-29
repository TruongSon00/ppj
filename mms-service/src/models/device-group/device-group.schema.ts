import { Schema } from 'mongoose';
import { DEVICE_GROUP_CONST } from '@components/device-group/device-group.constant';
import { transformId } from '../../helper/schema.helper';
import * as mongoose from 'mongoose';
import { ACTIVE_ENUM, DEFAULT_COLLATION } from '@constant/common';
import { UNIT_CONST } from '@components/unit/unit.constant';

const supplySchema = new Schema({
  supplyId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: {
    type: Number,
    min: DEVICE_GROUP_CONST.QUANTITY.MIN,
    max: DEVICE_GROUP_CONST.QUANTITY.MAX,
  },
  estimateUsedTime: {
    type: Number,
  },
});

export const DeviceGroupSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: DEVICE_GROUP_CONST.CODE.MAX_LENGTH,
      minlength: DEVICE_GROUP_CONST.CODE.MIN_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: DEVICE_GROUP_CONST.NAME.MAX_LENGTH,
      minlength: DEVICE_GROUP_CONST.NAME.MIN_LENGTH,
    },
    description: {
      type: String,
      maxlength: DEVICE_GROUP_CONST.DESCRIPTION.MAX_LENGTH,
    },
    supplies: {
      type: [supplySchema],
    },
    active: {
      type: Number,
      enum: UNIT_CONST.ACTIVE.ENUM,
      default: ACTIVE_ENUM.ACTIVE,
      required: true,
    },
  },
  {
    id: true,
    timestamps: true,
    collection: 'deviceGroups',
    collation: DEFAULT_COLLATION,
  },
);

transformId(DeviceGroupSchema);
