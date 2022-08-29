import { AREA_CONST } from '@components/area/area.constant';
import { DEFAULT_COLLATION } from '@constant/common';
import { Schema } from 'mongoose';

export const AreaSchema = new Schema(
  {
    code: {
      type: String,
      maxlength: AREA_CONST.CODE.MAX_LENGTH,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      maxlength: AREA_CONST.NAME.MAX_LENGTH,
      required: true,
    },
    description: {
      type: String,
      maxlength: AREA_CONST.DESCRIPTION.MAX_LENGTH,
    },
    factoryId: {
      type: Number,
      require: true,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'areas',
    collation: DEFAULT_COLLATION,
  },
);
