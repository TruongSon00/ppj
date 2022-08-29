import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FactoryResponseDto } from './factory.response.dto';

export class FactoryDataResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      id: 1,
      companyId: 2,
      name: 'factory 1',
      code: 'ABCD',
      location: 'address',
      phone: 'phone',
      description: 'description',
      createdAt: '2021-07-14T02:48:36.864Z',
      updatedAt: '2021-07-14T02:48:36.864Z',
    },
  })
  @Expose()
  data: FactoryResponseDto;
}
