import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { IsSqlId } from '../../../../validator/is-sql-id.validator';
import { IsNoSqlId } from '../../../../validator/is-nosql-id.validator';
export class confirmSupplyParamDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}
export class ConfirmSupplyRequestDto extends BaseDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsSqlId()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  _id: string;
}
