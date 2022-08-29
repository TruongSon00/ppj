import { Schema } from 'mongoose';
import { DEFAULT_COLLATION } from '@constant/common';
import { INSTALLATION_TEMPLATE_CONST } from '@components/installation-template/installation-template.constant';

const Detail = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: INSTALLATION_TEMPLATE_CONST.TITLE.MAX_LENGTH,
  },
  description: {
    type: String,
    required: true,
    maxlength: INSTALLATION_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH,
  },
  isRequire: {
    type: Boolean,
    required: true,
  },
});

export const InstallationTemplateSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: 8,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 255,
    },
    details: {
      type: [Detail],
      required: true,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'installationTemplates',
    collation: DEFAULT_COLLATION,
  },
);
