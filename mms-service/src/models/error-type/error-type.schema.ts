import {
  ERROR_TYPE_CONST,
  ERROR_TYPE_PRIORITY_ENUM,
} from '@components/error-type/error-type.constant';
import { DEFAULT_COLLATION } from '@constant/common';
import { Schema } from 'mongoose';

export const ErrorTypeSchema = new Schema(
  {
    code: {
      type: String,
      minlength: ERROR_TYPE_CONST.CODE.MIN_LENGTH,
      maxlength: ERROR_TYPE_CONST.CODE.MAX_LENGTH,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      minlength: ERROR_TYPE_CONST.CODE.MIN_LENGTH,
      maxlength: ERROR_TYPE_CONST.NAME.MAX_LENGTH,
      required: true,
    },
    description: {
      type: String,
      maxlength: ERROR_TYPE_CONST.DESCRIPTION.MAX_LENGTH,
    },
    priority: {
      type: Number,
      required: true,
      enum: ERROR_TYPE_PRIORITY_ENUM,
      default: ERROR_TYPE_PRIORITY_ENUM.MEDIUM,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'errorTypes',
    collation: DEFAULT_COLLATION,
  },
);
