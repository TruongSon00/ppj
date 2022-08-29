import {
  ASSIGN_TYPE,
  JOB_STATUS_ENUM,
  JOB_TYPE_ENUM,
  JOB_TYPE_MAINTENANCE_ENUM,
  MANDATORY_ENUM,
  RESULT_ENUM,
} from '@components/job/job.constant';
import * as mongoose from 'mongoose';

const supplySchema = new mongoose.Schema({
  supplyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  quantity: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  maintenanceType: {
    type: Number,
    enum: JOB_TYPE_MAINTENANCE_ENUM,
    required: false,
    default: 1,
  },
});

const assignUserSchema = new mongoose.Schema({
  assignId: {
    type: String,
  },
  type: {
    type: Number,
    enum: ASSIGN_TYPE,
  },
});
const historySchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
    },
    action: {
      type: String,
    },
    content: {
      type: String,
    },
    reason: {
      type: String,
    },
    status: {
      type: Number,
    },
  },
  { timestamps: true },
);

const checklistSchema = new mongoose.Schema({
  conclude: {
    type: Number,
    enum: JOB_TYPE_MAINTENANCE_ENUM,
  },
  result: {
    type: Number,
    enum: RESULT_ENUM,
  },
});

const installDetail = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  obligatory: {
    type: Number,
    enum: MANDATORY_ENUM,
  },
  status: {
    type: Number,
    enum: RESULT_ENUM,
  },
});

const resultSchema = new mongoose.Schema({
  maintenanceType: {
    type: Number,
    required: false,
  },
  checklist: {
    type: checklistSchema,
    required: false,
  },
  installResult: {
    type: Number,
    enum: RESULT_ENUM,
    required: false,
  },
  details: {
    type: [installDetail],
    required: false,
  },
});

export const JobSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      default: JOB_STATUS_ENUM.NON_ASSIGN,
    },
    type: {
      type: Number,
      enum: JOB_TYPE_ENUM,
    },
    jobTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Plan',
    },
    priority: {
      type: Number,
      required: false,
      default: 1,
    },
    deviceAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceAssignment',
      required: false,
    },
    actualSupplies: {
      type: [supplySchema],
      required: false,
    },
    supplies: {
      type: [supplySchema],
      required: false,
    },
    assign: {
      type: assignUserSchema,
      required: false,
    },
    planFrom: {
      type: Date,
      required: false,
    },
    planTo: {
      type: Date,
      required: false,
    },
    executionDateFrom: {
      type: Date,
      required: false,
    },
    executionTime: {
      type: Number,
      required: false,
    },
    executionDateTo: {
      type: Date,
      required: false,
    },
    histories: {
      type: [historySchema],
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    result: {
      type: resultSchema,
      required: false,
    },
  },
  { collection: 'jobs', timestamps: true },
);
