import { Document } from 'mongoose';

export class BaseModel extends Document {
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
