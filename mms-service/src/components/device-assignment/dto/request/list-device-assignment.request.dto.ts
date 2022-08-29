import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnumSort } from '@utils/common';
import { PaginationQuery } from '@utils/pagination.query';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
class Sort {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(EnumSort)
  order: any;
}

class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
export class GetListDeviceAssignmentRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ example: 'Error group', description: '' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: [{ columm: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  @ApiPropertyOptional({
    example: [{ columm: 'name', order: 'DESC' }],
    description: '',
  })
  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  sort?: Sort[];

  @IsNotEmpty()
  user: UserInforRequestDto;
}
