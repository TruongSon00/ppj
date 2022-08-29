import * as mongoose from 'mongoose';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';
import { ACTIVE_ENUM, DEFAULT_COLLATION } from '@constant/common';
import { UNIT_CONST } from '@components/unit/unit.constant';

const MaintenanceTeamMember = new mongoose.Schema({
  userId: {
    type: Number,
  },
  role: {
    type: Number,
  },
});

export const MaintenanceTeamSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: MAINTENANCE_TEAM_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      maxlength: MAINTENANCE_TEAM_CONST.NAME.MAX_LENGTH,
      required: true,
    },
    description: {
      maxlength: MAINTENANCE_TEAM_CONST.DESCRIPTION.MAX_LENGTH,
      type: String,
    },
    members: {
      type: [MaintenanceTeamMember],
    },
    active: {
      type: Number,
      enum: UNIT_CONST.ACTIVE.ENUM,
      default: ACTIVE_ENUM.ACTIVE,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'maintenanceTeams',
    collation: DEFAULT_COLLATION,
  },
);
