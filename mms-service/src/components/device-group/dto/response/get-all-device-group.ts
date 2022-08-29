import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponsibleSubjectType } from '@components/device/device.constant';
import { IsEnum } from 'class-validator';
export class ResponsibleUser {
  @ApiProperty()
  @Expose()
  id: string | number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @IsEnum(ResponsibleSubjectType)
  type: ResponsibleSubjectType;
}

export class GetListDeviceGroup extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}
