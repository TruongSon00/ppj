import { Expose } from 'class-transformer';

export class ImportResultBaseDto {
  @Expose()
  action: string;

  @Expose()
  isSuccess: boolean;

  @Expose()
  reason: string;
}
