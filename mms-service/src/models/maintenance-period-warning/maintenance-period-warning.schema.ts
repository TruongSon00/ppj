import * as mongoose from 'mongoose';
import { PERIOD_WARNING_STATUS_ENUM } from '@components/maintenance-period-warning/maintenance-period-warning.constant';

const supplySchema = new mongoose.Schema({
  supplyId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: {
    type: Number,
  },
  description: {
    type: String,
  },
});
export const MaintenancePeriodWarningSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: false,
    },
    deviceAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    supplyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: false,
    },
    supplies: {
      type: [supplySchema],
    },
    status: {
      type: Number,
      default: PERIOD_WARNING_STATUS_ENUM.CREATED,
    },
    priority: {
      type: Number,
      required: false,
    },
    type: {
      type: Number,
      required: false,
    },
    completeExpectedDate: {
      type: Date,
      required: false,
    },
  },
  { collection: 'maintenancePeriodWarnings' },
);
MaintenancePeriodWarningSchema.set('timestamps', true);
