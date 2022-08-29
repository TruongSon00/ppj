import { SuccessResponse } from '@utils/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompanyResponseDto } from '@components/company/dto/response/company.response.dto';

export class CompanyDataResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
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
  })
  @Expose()
  data: CompanyResponseDto;
}
