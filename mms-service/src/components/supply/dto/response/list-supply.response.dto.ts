import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class BaseResponse {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class ListSupplyResponseDto extends BaseResponseDto {
  @ApiProperty({
    type: String,
  })
  @Expose()
  code: string;

  @ApiProperty({
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
  })
  @Expose()
  description: string;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  type: number;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  status: number;

  @ApiProperty({
    type: Number,
  })
  @Expose()
  price: number;

  @ApiProperty({
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    type: BaseResponse,
  })
  @Type(() => BaseResponse)
  @Expose()
  vendor: BaseResponse;

  @ApiProperty({
    type: BaseResponse,
  })
  @Type(() => BaseResponse)
  @Expose()
  supplyGroup: BaseResponse;
}
