import { HttpClientModule } from './core/components/http-client/http-client.module';
import { KongGatewayModule } from './core/components/kong-gateway/kong-gateway.module';
import { BootModule } from '@nestcloud/boot';
import { BOOT, CONSUL } from '@nestcloud/common';
import { ConsulModule } from '@nestcloud/consul';
import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServiceModule } from '@nestcloud/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BootModule.forRoot({
      filePath: resolve(__dirname, '../config.yaml'),
    }),
    HttpClientModule,
    ConsulModule.forRootAsync({ inject: [BOOT] }),
    ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
    KongGatewayModule.forRootAsync(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
