import { Controller, Inject } from '@nestjs/common';
import { SaleServiceInterface } from './interface/sale.service.interface';

@Controller('sale')
export class SaleController {
  constructor(
    @Inject('SaleServiceInterface')
    private readonly saleService: SaleServiceInterface,
  ) {}
}
