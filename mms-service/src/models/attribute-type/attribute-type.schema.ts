import { Schema } from 'mongoose';
import { DEFAULT_COLLATION } from '@constant/common';
import { ATTRIBUTE_TYPE_CONST } from '@components/attribute-type/attribute-type.constant';

export const AttributeTypeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: ATTRIBUTE_TYPE_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: ATTRIBUTE_TYPE_CONST.NAME.MAX_LENGTH,
    },
    description: {
      type: String,
      maxlength: ATTRIBUTE_TYPE_CONST.DESCRIPTION.MAX_LENGTH,
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: 'UnitModel',
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'attributeTypes',
    collation: DEFAULT_COLLATION,
  },
);
