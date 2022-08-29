import { TypeEnum } from '@components/export/export.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class File {
  filename: string;
  data: ArrayBuffer;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

export class ImportExcelRequest extends BaseDto {
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
