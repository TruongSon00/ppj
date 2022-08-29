import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';

export class SuppliesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  supplyId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateWarningBody extends BaseDto {
  @ApiProperty({
    example: 1,
    description: 'Id lỗi',
  })
  @IsNotEmpty()
  @IsString()
  defectId: string;

  @ApiProperty({
    description: 'Ngày kì vọng hoàn thành',
  })
  @IsNotEmpty()
  @IsDateString()
  completeExpectedDate: Date;

  @ApiProperty({
    description: 'Mô tả',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    description: '',
  })
  @IsNotEmpty()
  @IsString()
  deviceAssignmentId: string;

  @ApiProperty({ type: [SuppliesDto], required: false })
  @IsOptional()
  supplies: SuppliesDto;

  @ApiProperty({
    description: 'Ngày đến lịch bảo trì',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  maintenanceArrivalDate: Date;
}
export class CreateWarningDto extends CreateWarningBody {
  @IsNotEmpty()
  user: UserInforRequestDto;
}
