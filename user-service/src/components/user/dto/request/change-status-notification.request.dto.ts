import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ChangeStatusNotificationRequestDto extends BaseDto {
  @ApiProperty({
    example: 'Bật thông báo: 0',
    description: 'status notification',
  })
  @IsNotEmpty()
  statusNotification: boolean;

  @ApiProperty({ example: 1, description: 'userId' })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
