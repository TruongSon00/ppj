import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import {
  DeviceType,
  DEVICE_CONST,
  ResponsibleSubjectType,
} from '@components/device/device.constant';
import { BaseDto } from '@core/dto/base.dto';
import { IsSqlOrNoSqlId } from 'src/validator/is-nosql-or-sql-id.validator';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateMaintenanceInfoDto extends BaseDto {
  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  maintenancePeriod: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  mttrIndex: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  mttaIndex: number;

  @Expose()
  @IsInt()
  @IsOptional()
  mttfIndex: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  mtbfIndex: number;
}

export class CreateSupplyDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  supplyId: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  quantity: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  useDate: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  canRepair: boolean;
}

export class CreateAccessoriesMaintenanceInformationDto extends CreateMaintenanceInfoDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  supplyId: string;
}

export class ResponsibleSubjectDto {
  @Expose()
  @IsNotEmpty()
  @IsSqlOrNoSqlId()
  id: string | number;

  @Expose()
  @IsNotEmpty()
  @IsEnum(ResponsibleSubjectType)
  type: ResponsibleSubjectType;
}

export class CreateDeviceRequestDto extends CreateMaintenanceInfoDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(DEVICE_CONST.CODE.MAX_LENGTH)
  @Matches(DEVICE_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(DEVICE_CONST.NAME.MAX_LENGTH)
  @Matches(DEVICE_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(DEVICE_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(DEVICE_CONST.MODEL.MAX_LENGTH)
  model: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  @Type()
  price: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  deviceGroupId: string;

  @Expose()
  @IsEnum(DeviceType)
  @IsNotEmpty()
  type: DeviceType;

  @Expose()
  @IsNotEmpty()
  @Min(1, {
    message: 'Tần xúât không được nhỏ hơn 1',
  })
  @Max(Number.MAX_SAFE_INTEGER)
  frequency: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  maintenanceAttributeId: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1, {
    message: 'Kiểm tra định kỳ không được nhỏ hơn 1',
  })
  @Max(Number.MAX_SAFE_INTEGER)
  periodicInspectionTime: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  userId: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  vendor: number;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(DEVICE_CONST.BRAND.MAX_LENGTH)
  brand: string;

  @Expose()
  @IsDateString()
  @IsOptional()
  productionDate: Date;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  importDate: Date;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  warrantyPeriod: number;

  @Expose()
  @IsNotEmpty()
  @IsArray()
  accessoriesMaintenanceInformation: CreateAccessoriesMaintenanceInformationDto[];

  @Expose()
  @IsNotEmpty()
  @IsArray()
  suppliesAndAccessories: CreateSupplyDto[];

  @Expose()
  @IsNotEmptyObject()
  responsibleSubject: ResponsibleSubjectDto;

  @Expose()
  @IsOptional()
  @IsArray()
  attributeType: string[];

  @Expose()
  @IsMongoId()
  @IsNotEmpty()
  installTemplate: string;

  @IsMongoId()
  @IsNotEmpty()
  checkListTemplateId: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  canRepair: boolean;
}
