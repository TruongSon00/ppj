import { JOB_STATUS_ENUM, JOB_TYPE_ENUM } from '@components/job/job.constant';
import * as mongoose from 'mongoose';

export const JobDraftSchema = new mongoose.Schema(
  {
    deviceAssignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeviceAssignment',
      required: false,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: false,
    },
    uuid: {
      type: String,
      required: false,
    },
    assignId: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      default: JOB_STATUS_ENUM.NON_ASSIGN,
    },
    assignType: {
      type: String,
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
    type: {
      type: Number,
      enum: JOB_TYPE_ENUM,
    },
  },
  { collection: 'jobDrafts', timestamps: true },
);
