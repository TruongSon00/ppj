import * as mongoose from 'mongoose';
import { PLAN_STATUS_ENUM } from '@components/plan/plan.constant';

const jobTypeTotal = new mongoose.Schema({
  warningTotal: {
    type: Number,
  },
  maintainRequestTotal: {
    type: Number,
  },
  maintainPeriodWarningTotal: {
    type: Number,
  },
  checklistTemplateTotal: {
    type: Number,
  },
  installingTotal: {
    type: Number,
  },
});

export const PlanSchema = new mongoose.Schema(
  {
    planFrom: {
      type: Date,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    planTo: {
      type: Date,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    factoryId: {
      type: Number,
      required: false,
    },
    workCenterId: {
      type: Number,
      required: false,
    },
    histories: {
      type: [],
      required: false,
    },
    jobTypeTotal: {
      type: jobTypeTotal,
      required: true,
    },
    status: {
      type: Number,
      required: false,
      default: PLAN_STATUS_ENUM.WAITING_TO_CONFIRMED,
    },
    reason: {
      type: String,
      required: false,
      maxlength: 255,
    },
    createdBy: {
      type: Number,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { collection: 'plans', timestamps: true },
);
