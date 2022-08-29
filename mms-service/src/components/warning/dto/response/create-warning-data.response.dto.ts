import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WarningResponse } from './create-warning.response.dto';

export class CreateWarningDataResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      id: 'string',
      defect: 'string',
      completeExpectedDate: '2021-11-30T11:32:36.041Z',
      description: 'string',
      status: 0,
      executionDate: '2021-11-30T11:32:36.041Z',
      type: 0,
      deviceAssignment: 'string',
      createdAt: '2021-11-30T11:32:36.041Z',
      updatedAt: '2021-11-30T11:32:36.041Z',
    },
  })
  @Expose()
  data: WarningResponse;
}
