import { Schema } from 'mongoose';
import { ACTIVE_ENUM, DEFAULT_COLLATION } from '@constant/common';
import { UNIT_CONST } from '@components/unit/unit.constant';
import { VENDOR_CONST } from '@components/vendor/vendor.constant';

export const VendorSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      maxlength: VENDOR_CONST.CODE.MAX_LENGTH,
      minLength: VENDOR_CONST.CODE.MIN_LENGTH,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: VENDOR_CONST.NAME.MAX_LENGTH,
      minLength: VENDOR_CONST.NAME.MIN_LENGTH,
    },
    description: {
      type: String,
      maxlength: VENDOR_CONST.DESCRIPTION.MAX_LENGTH,
    },
    address: {
      type: String,
      maxlength: VENDOR_CONST.DESCRIPTION.MAX_LENGTH,
    },
    email: {
      type: String,
      maxlength: VENDOR_CONST.DESCRIPTION.MAX_LENGTH,
    },
    bank: {
      type: String,
      maxlength: VENDOR_CONST.DESCRIPTION.MAX_LENGTH,
    },
    contactUser: {
      type: String,
      maxlength: VENDOR_CONST.DESCRIPTION.MAX_LENGTH,
    },
    phone: {
      type: String,
      maxlength: VENDOR_CONST.PHONE.MAX_LENGTH,
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
    collection: 'vendors',
    collation: DEFAULT_COLLATION,
  },
);
