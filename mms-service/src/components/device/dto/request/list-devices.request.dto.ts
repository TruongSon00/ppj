import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQuery, Sort, Filter } from '@utils/pagination.query';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';

export class GetListDevicesRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ example: 'Máy dập M3', description: '' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: [{ column: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  @ApiPropertyOptional({
    example: [{ column: 'name', order: 'DESC' }],
    description: '',
  })
  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  sort?: Sort[];

  @IsOptional()
  user: UserInforRequestDto;

  @IsOptional()
  @IsEnum(['0', '1'])
  isGetAll: string;
}
