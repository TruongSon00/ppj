import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsMongoId,
} from 'class-validator';
import {
  SUPPLY_CONST,
  SupplyTypeConstant,
} from '@components/supply/supply.constant';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { IsSqlId } from 'src/validator/is-sql-id.validator';
import { ResponsibleUser } from '@components/supply/dto/request/create-supply.request.dto';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';
export class UpdateSupplyBodyDto extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Tên của vật tư' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(SUPPLY_CONST.NAME.MAX_LENGTH)
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: '1000000', description: 'Giá của vật tư' })
  @Expose()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 1, description: 'Loại vật tư' })
  @Expose()
  @IsNotEmpty()
  @IsEnum(SupplyTypeConstant)
  type: number;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả' })
  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(SUPPLY_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty({ example: 'ABC123', description: 'Mã của đơn vị tính' })
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  itemUnitId: string;

  @ApiProperty({ example: 'ABC123', description: 'Mã của nhà máy' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsNoSqlId()
  groupSupplyId: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @IsSqlId()
  userId: number;

  @IsInt()
  @IsOptional()
  vendorId: number;

  @IsDateString()
  @IsOptional()
  receivedDate: Date;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @Type(() => ResponsibleUser)
  responsibleUser: ResponsibleUser;
}
export class UpdateSupplyRequestDto extends UpdateSupplyBodyDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsNoSqlId()
  _id: string;
}
