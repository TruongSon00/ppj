import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { ReportType } from '@constant/common';
import { Transform } from 'class-transformer';

export class DashboardWarningRequestDto extends BaseDto {
  @IsEnum(ReportType)
  @Transform((data) => Number(data.value))
  @IsNotEmpty()
  reportType: ReportType;

  @ApiProperty({
    description: 'Ngày bắt đầu',
  })
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'Ngày kết thúc',
  })
  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  user: UserInforRequestDto;
}
