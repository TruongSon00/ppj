import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  IsArray,
  IsOptional,
  ValidateNested,
  ArrayUnique,
  IsEnum,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';

export class UserRequestDtoAbstract extends BaseDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ example: 'example', description: 'username' })
  @IsOptional()
  username: string;

  @ApiProperty({ example: 'example', description: 'full name' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ example: 'example', description: 'code' })
  @IsOptional()
  code: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2021-07-18 17:34:02', description: 'date of birth' })
  dateOfBirth: Date;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @ApiProperty({ example: '0789-789-7890', description: 'phone' })
  phone: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1, description: 'company id' })
  @IsOptional()
  companyId: number;

  @ApiProperty({ example: 1, description: '' })
  @IsEnum(['0', '1'])
  @IsOptional()
  status: number;

  @ApiProperty({ example: true, description: '' })
  statusNotification: boolean;

  @ApiProperty({ example: [{ id: 1 }], description: 'factory id' })
  @IsOptional()
  @IsArray()
  @ArrayUnique((e: Factory) => e.id)
  @ValidateNested()
  @Type(() => Factory)
  factories: Factory[];

  @ApiProperty({ example: [{ id: 1 }], description: 'department id' })
  @IsOptional()
  @IsArray()
  @ArrayUnique((e: DepartmentSetting) => e.id)
  @ValidateNested()
  @Type(() => DepartmentSetting)
  departmentSettings: DepartmentSetting[];

  @ApiProperty({ example: [{ id: 1 }], description: 'department id' })
  @IsOptional()
  @IsArray()
  @ArrayUnique((e: UserRoleSetting) => e.id)
  @ValidateNested()
  @Type(() => UserRoleSetting)
  userRoleSettings: UserRoleSetting[];

  @ApiProperty({ example: [{ id: 1 }], description: 'warehouse id' })
  @IsOptional()
  @IsArray()
  @ArrayUnique((e: UserWarehouse) => e.id)
  @ValidateNested()
  @Type(() => UserWarehouse)
  userWarehouses: UserWarehouse[];
}

class DepartmentSetting {
  @IsInt()
  @IsNotEmpty()
  id: number;
}

class UserRoleSetting {
  @IsInt()
  @IsNotEmpty()
  id: number;
}

class UserWarehouse {
  @IsInt()
  @IsNotEmpty()
  id: number;
}

class Factory {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
