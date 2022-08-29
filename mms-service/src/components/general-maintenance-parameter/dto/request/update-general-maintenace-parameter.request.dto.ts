import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { IsNoSqlId } from '../../../../validator/is-nosql-id.validator';

export class UpdateGeneralMaintenaceParameterBodyDto extends BaseDto {}
export class UpdateGeneralMaintenaceParameterRequestDto extends UpdateGeneralMaintenaceParameterBodyDto {
  @ApiProperty({
    example: '61a8974b4711d21f394d57ff',
    description: 'Mã của thuộc tính bảo trì chung',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsNoSqlId()
  _id: string;

  @ApiProperty({ example: 10, description: 'Thời gian' })
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  time: number;
}
