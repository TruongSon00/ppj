import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FactoryResponseDto } from './factory.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: FactoryResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListFactoryResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 1,
          companyId: 1,
          name: 'factory 1',
          code: 'ABCD',
          address: 'address',
          phone: 'phone',
          description: 'description',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
        {
          id: 2,
          companyId: 1,
          name: 'factory 2',
          code: 'ABCE',
          address: 'address',
          phone: 'phone',
          description: 'description',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
      ],
      meta: {
        total: 2,
        page: 1,
      },
    },
  })
  @Expose()
  data: MetaData;
}
