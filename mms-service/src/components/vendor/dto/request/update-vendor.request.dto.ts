import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CreateVendorRequestDto } from './create-vendor.request.dto';

export class UpdateVendorRequestDto extends CreateVendorRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
export class UpdateVendorBodyRequestDto extends CreateVendorRequestDto {}
