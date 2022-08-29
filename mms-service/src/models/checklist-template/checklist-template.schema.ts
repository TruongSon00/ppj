import { Schema } from 'mongoose';
import {
  CHECK_LIST_TEMPLATE_CONST,
  CheckTypeEnum,
  CheckListTemplateObligatoryConstant,
} from '@components/checklist-template/checklist-template.constant';
import { DEFAULT_COLLATION } from '@constant/common';

const Detail = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: CHECK_LIST_TEMPLATE_CONST.TITLE.MAX_LENGTH,
  },
  description: {
    type: String,
    required: true,
    maxlength: CHECK_LIST_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH,
  },
  obligatory: {
    type: Number,
    enum: CheckListTemplateObligatoryConstant,
    default: CheckListTemplateObligatoryConstant.NO,
  },
});

export const ChecklistTemplateSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: CHECK_LIST_TEMPLATE_CONST.CODE.MAX_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: CHECK_LIST_TEMPLATE_CONST.NAME.MAX_LENGTH,
    },
    description: {
      type: String,
      maxlength: CHECK_LIST_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH,
    },
    checkType: {
      type: Number,
      enum: CheckTypeEnum,
      required: true,
    },
    details: {
      type: [Detail],
      required: true,
    },
    histories: {
      type: [],
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'checklistTemplates',
    collation: DEFAULT_COLLATION,
  },
);
