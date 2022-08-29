import { Expose } from 'class-transformer';

export class ImportBaseDto {
  @Expose()
  action: string;
}
