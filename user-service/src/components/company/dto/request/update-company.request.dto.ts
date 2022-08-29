import { ApiProperty } from '@nestjs/swagger';
import { CompanyRequestDto } from '@components/company/dto/request/company.request.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCompanyBodyRequestDto extends CompanyRequestDto {}
export class UpdateCompanyRequestDto extends UpdateCompanyBodyRequestDto {
  @ApiProperty({ example: 1, description: '' })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
