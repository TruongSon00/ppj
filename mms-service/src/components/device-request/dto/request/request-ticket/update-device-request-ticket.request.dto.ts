import {
  CreateDeviceRequestTicketBody,
  CreateDeviceRequestTicketRequestDto,
} from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
export class UpdateDeviceRequestTicketBody extends CreateDeviceRequestTicketBody {}
export class UpdateDeviceRequestTicketRequestDto extends CreateDeviceRequestTicketRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
