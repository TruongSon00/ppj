import { Controller, Inject } from '@nestjs/common';
import { MmsServiceInterface } from './interface/mms.service.interface';

@Controller('mms')
export class MmsController {
  constructor(
    @Inject('MmsServiceInterface')
    private readonly mmsService: MmsServiceInterface,
  ) {}
}
