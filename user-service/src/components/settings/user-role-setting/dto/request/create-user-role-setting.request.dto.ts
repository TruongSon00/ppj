import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserRoleSettingRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;
}
