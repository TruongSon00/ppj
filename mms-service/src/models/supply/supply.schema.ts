import * as mongoose from 'mongoose';
import {
  SupplyStatusConstant,
  SupplyTypeConstant,
} from '@components/supply/supply.constant';
import { DEFAULT_COLLATION } from '@constant/common';
import { JobSchema } from '../job/job.schema';

export const SupplySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: 20,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    type: {
      type: Number,
      enum: SupplyTypeConstant,
      required: true,
    },
    groupSupplyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    responsibleUserIds: {
      type: Number,
    },
    responsibleMaintenanceTeam: {
      type: mongoose.Schema.Types.ObjectId,
    },
    itemUnitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UnitModel',
      required: true,
    },
    description: {
      type: String,
    },
    receivedDate: {
      type: Date,
    },
    vendorId: {
      type: Number,
    },
    status: {
      type: Number,
      enum: SupplyStatusConstant,
      required: true,
    },
    histories: {
      type: [],
    },
  },
  {
    timestamps: true,
    collection: 'supplies',
    collation: DEFAULT_COLLATION,
  },
);
