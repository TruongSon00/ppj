import { Schema } from 'mongoose';
import { SUPPLY_GROUP_CONST } from '@components/supply-group/supply-group.constant';
import { ACTIVE_ENUM, DEFAULT_COLLATION } from '@constant/common';
import { UNIT_CONST } from '@components/unit/unit.constant';

export const SupplyGroupSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: SUPPLY_GROUP_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: SUPPLY_GROUP_CONST.NAME.MAX_LENGTH,
    },
    description: {
      type: String,
      maxlength: SUPPLY_GROUP_CONST.DESCRIPTION.MAX_LENGTH,
    },
    active: {
      type: Number,
      enum: UNIT_CONST.ACTIVE.ENUM,
      default: ACTIVE_ENUM.ACTIVE,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'supplyGroups',
    collation: DEFAULT_COLLATION,
  },
);
