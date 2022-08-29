import * as mongoose from 'mongoose';
import { MAINTENANCE_ATTRIBUTE_CONST } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { DEFAULT_COLLATION } from "@constant/common";

export const MaintenanceAttributeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: MAINTENANCE_ATTRIBUTE_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      maxlength: MAINTENANCE_ATTRIBUTE_CONST.NAME.MAX_LENGTH,
      required: true,
    },
    description: {
      maxlength: MAINTENANCE_ATTRIBUTE_CONST.DESCRIPTION.MAX_LENGTH,
      type: String,
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
    collection: 'maintenanceAttributes',
    collation: DEFAULT_COLLATION,
  },
);
