import { ValidationPipe } from './core/pipe/validation.pipe';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import connectionOptions from '@config/database.config';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { APP_PIPE } from '@nestjs/core';
import { BootModule } from '@nestcloud/boot';
import { resolve } from 'path';
import { HttpClientModule } from '@core/components/http-client/http-client.module';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { BOOT, CONSUL } from '@nestcloud/common';
import { KongGatewayModule } from '@core/components/kong-gateway/kong-gateway.module';
import { AuthModule } from '@components/auth/auth.module';
import { UserRoleModule } from './components/user-role/user-role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    BootModule.forRoot({
      filePath: resolve(__dirname, '../config.yaml'),
    }),
    ConsulModule.forRootAsync({ inject: [BOOT] }),
    ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
    HttpClientModule,
    KongGatewayModule.forRootAsync(),
    TypeOrmModule.forRoot(connectionOptions.options),
    CoreModule,
    UserRoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
