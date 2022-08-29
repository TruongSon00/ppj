import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ItemService } from '@components/item/item.service';
import { ItemController } from '@components/item/item.controller';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [
    'ITEM_SERVICE_CLIENT',
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'ITEM_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const itemServiceOptions = configService.get('itemService');
        return ClientProxyFactory.create(itemServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
  ],
  controllers: [ItemController],
})
export class ItemModule {}
