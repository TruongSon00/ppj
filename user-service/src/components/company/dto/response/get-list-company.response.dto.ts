import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompanyResponseDto } from '@components/company/dto/response/company.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}

class MetaData {
  @Expose()
  data: CompanyResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListCompanyResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 1,
          name: 'company 1',
          code: 'ABCD',
          address: 'address',
          phone: 'phone',
          taxNo: 'tax no',
          email: 'email',
          fax: 'fax',
          description: 'description',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
        {
          id: 2,
          name: 'company 2',
          code: 'ABCD',
          address: 'address',
          phone: 'phone',
          taxNo: 'tax no',
          email: 'email',
          fax: 'fax',
          description: 'description',
          createdAt: '2021-07-14T02:48:36.864Z',
          updatedAt: '2021-07-14T02:48:36.864Z',
        },
      ],
      meta: {
        total: 3,
        page: 1,
      },
    },
  })
  @Expose()
  data: MetaData;
}
