import { Expose, Transform } from 'class-transformer';

export class BaseResponseDto {
  @Expose({ name: '_id' })
  @Transform((value) => value.obj._id?.toString())
  id: string;
}
