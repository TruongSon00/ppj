import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ListJobResponse } from './list-job.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}
export class MetaData {
  @Expose()
  data: ListJobResponse[];

  @Expose()
  meta: Meta;
}
export class ListJobDataResponseDto extends SuccessResponse {
  @ApiProperty({
    type: ListJobResponse,
    isArray: true,
  })
  @Expose()
  data: ListJobResponse[];
}
