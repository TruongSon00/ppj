import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  IsArray,
  ArrayUnique,
  ValidateNested,
} from 'class-validator';

class DepartmentSetting {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
export class ChangePasswordRequestDto extends BaseDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '123456789', description: 'password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @ApiProperty({ example: '123123', description: 'old password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  oldPassword: string;

  @ApiProperty({ example: 1, description: 'userId' })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  @ApiProperty({ example: 'example', description: 'code' })
  userCode: string;

  @ApiProperty({ example: [{ id: 1 }], description: 'department id' })
  @IsArray()
  @ArrayUnique((e: DepartmentSetting) => e.id)
  @ValidateNested()
  @Type(() => DepartmentSetting)
  departmentSettings: DepartmentSetting[];
}
