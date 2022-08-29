import { Expose } from 'class-transformer';

export class GetLogTimeByMoIdResponse {
  @Expose()
  moId: number;

  @Expose()
  moName: string;

  @Expose()
  day: string;

  @Expose()
  workTime: string;

  @Expose()
  stopTime: string;
}
