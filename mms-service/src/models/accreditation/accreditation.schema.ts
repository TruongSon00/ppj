import { ACCREDITATION_CONST } from '@components/accreditation/accreditation.constant';
import { DETAILACCREDITATION_CONST } from '@components/accreditation/detailAccreditation.constant';
import { Schema } from 'mongoose';

const DetailAccreditationSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    maxlength: DETAILACCREDITATION_CONST.TITLE.MAX_LENGTH,
  },
  describe: {
    type: String,
    required: true,
    maxlength: DETAILACCREDITATION_CONST.DESCRIPTION.MAX_LENGTH,
  },
  periadic: {
    type: Number,
    max: DETAILACCREDITATION_CONST.PERIODIC.MAX,
    min: DETAILACCREDITATION_CONST.PERIODIC.MIN,
    required: true,
  },
  pbligatory: {
    type: Boolean,
    required: true,
  },
});

export const AccreditationSchema = new Schema({
  code: {
    type: String,
    required: true,
    maxlength: ACCREDITATION_CONST.CODE.MAX_LENGTH,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: ACCREDITATION_CONST.NAME.MAX_LENGTH,
  },
  descript: {
    type: String,
    maxlength: ACCREDITATION_CONST.DESCRIPTION.MAX_LENGTH,
    required: true,
  },
  periodic: {
    type: Number,
    max: ACCREDITATION_CONST.PERIODIC.MAX,
    min: ACCREDITATION_CONST.PERIODIC.MIN,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  detail: [DetailAccreditationSchema],
});
