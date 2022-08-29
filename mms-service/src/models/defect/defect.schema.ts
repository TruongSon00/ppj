import * as mongoose from 'mongoose';
import {
  DEFECT_CONST,
  DefectPriorityConstant,
} from '@components/defect/defect.constant';
import { DEFAULT_COLLATION } from '@constant/common';

export const DefectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: DEFECT_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: DEFECT_CONST.NAME.MAX_LENGTH,
    },
    description: {
      type: String,
      maxlength: DEFECT_CONST.DESCRIPTION.MAX_LENGTH,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Device',
    },
    priority: {
      type: Number,
      required: true,
      enum: DefectPriorityConstant,
    },
    histories: {
      type: [],
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'defects',
    collation: DEFAULT_COLLATION,
  },
);
