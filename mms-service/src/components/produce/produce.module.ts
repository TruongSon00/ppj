import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@config/config.service';
import { ProduceService } from '@components/produce/produce.service';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [
    'PRODUCE_SERVICE_CLIENT',
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'PRODUCE_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const produceServiceOptions = configService.get('produceService');
        return ClientProxyFactory.create(produceServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
  ],
})
export class ProduceModule {}
