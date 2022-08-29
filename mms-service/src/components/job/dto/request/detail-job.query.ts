import { BaseDto } from '@core/dto/base.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class DetailJobQuery extends BaseDto {
  @IsEnum(['0', '1'])
  @IsOptional()
  isDraft: string;
}
