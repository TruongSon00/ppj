import { REGION_CONST } from '@components/region/region.constant';
import { DEFAULT_COLLATION } from '@constant/common';
import { Schema } from 'mongoose';

export const RegionSchema = new Schema(
  {
    code: {
      type: String,
      maxlength: REGION_CONST.CODE.MAX_LENGTH,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      maxlength: REGION_CONST.NAME.MAX_LENGTH,
      required: true,
    },
    description: {
      type: String,
      maxlength: REGION_CONST.DESCRIPTION.MAX_LENGTH,
    },
    interRegionId: {
      type: Schema.Types.ObjectId,
      ref: 'InterRegionModel',
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
    collection: 'regions',
    collation: DEFAULT_COLLATION,
  },
);

RegionSchema.virtual('interRegion', {
  ref: 'InterRegionModel',
  localField: 'interRegionId',
  foreignField: '_id',
  justOne: true,
});
