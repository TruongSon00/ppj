import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class ResponsibleUser {
  @ApiProperty()
  @Expose()
  id: number | string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: number;
}

export class GetAllSupplyResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  responsibleUser: ResponsibleUser;
}
