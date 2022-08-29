import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CreateSupplyRequest } from './create-supply-request.request';
export class UpdateSupplyRequestBodyDto extends CreateSupplyRequest {}
export class UpdateSupplyRequest extends UpdateSupplyRequestBodyDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
