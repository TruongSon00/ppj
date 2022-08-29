import { TypeEnum } from '@components/export/export.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class File {
  filename: string;
  data: ArrayBuffer;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

export class ImportBodyRequestDto extends BaseDto {}

export class ImportRequestDto extends ImportBodyRequestDto {
  @ApiProperty()
  @IsEnum(TypeEnum)
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  type: number;

  @ApiProperty()
  @IsNotEmpty()
  files: File[];

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
