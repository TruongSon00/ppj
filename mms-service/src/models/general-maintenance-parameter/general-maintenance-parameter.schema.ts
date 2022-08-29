import { Schema } from 'mongoose';

export const GeneralMaintenanceParameterSchema = new Schema(
  {
    time: {
      type: Number,
      required: true,
      maxlength: 10,
    },
  },
  {
    collection: 'generalMaintenanceParameters',
  },
);
