import { INTER_REGION_CONST } from '@components/inter-region/inter-region.constant';
import { DEFAULT_COLLATION } from '@constant/common';
import { Schema } from 'mongoose';

export const InterRegionSchema = new Schema(
  {
    code: {
      type: String,
      minlength: INTER_REGION_CONST.CODE.MIN_LENGTH,
      maxlength: INTER_REGION_CONST.CODE.MAX_LENGTH,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      minlength: INTER_REGION_CONST.NAME.MIN_LENGTH,
      maxlength: INTER_REGION_CONST.NAME.MAX_LENGTH,
      required: true,
    },
    description: {
      type: String,
      maxlength: INTER_REGION_CONST.DESCRIPTION.MAX_LENGTH,
    },
    company: {
      type: Number,
      default: INTER_REGION_CONST.COMPANY.ID,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'interRegions',
    collation: DEFAULT_COLLATION,
  },
);
