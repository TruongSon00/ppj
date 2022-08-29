import { UNIT_CONST } from '@components/unit/unit.constant';
import { ACTIVE_ENUM, DEFAULT_COLLATION } from '@constant/common';
import { Schema } from 'mongoose';

export const UnitSchema = new Schema(
  {
    code: {
      type: String,
      maxlength: UNIT_CONST.CODE.MAX_LENGTH,
      minLength: UNIT_CONST.CODE.MIN_LENGTH,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      maxlength: UNIT_CONST.NAME.MAX_LENGTH,
      minLength: UNIT_CONST.NAME.MIN_LENGTH,
      required: true,
    },
    active: {
      type: Number,
      enum: UNIT_CONST.ACTIVE.ENUM,
      default: ACTIVE_ENUM.ACTIVE,
      required: true,
    },
    description: {
      type: String,
      maxlength: UNIT_CONST.DESCRIPTION.MAX_LENGTH,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'units',
    collation: DEFAULT_COLLATION,
  },
);
