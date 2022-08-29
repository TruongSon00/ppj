import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailUnitRequest extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Id của đơn vị' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
