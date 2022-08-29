import { ValidationPipe } from './core/pipe/validation.pipe';
import { UserModule } from '@components/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './components/auth/auth.module';
import { CoreModule } from './core/core.module';
import { WarehouseService } from './components/warehouse/warehouse.service';
import { WarehouseController } from './components/warehouse/warehouse.controller';
import { WarehouseModule } from './components/warehouse/warehouse.module';
import { CompanyModule } from './components/company/company.module';
import { FactoryModule } from '@components/factory/factory.module';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MailModule } from '@components/mail/mail.module';
import { DepartmentSettingModule } from '@components/settings/department-setting/department-setting.module';
import { UserRoleSettingModule } from '@components/settings/user-role-setting/user-role-setting.module';
import { StaticModule } from '@components/static/static.module';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import { QueryResolver } from './i18n/query-resolver';
import { ExportModule } from '@components/export/export.module';
import { ImportModule } from '@components/import/import.module';
import { ProduceModule } from '@components/produce/produce.module';
import { InitDataModule } from '@components/init-data/init-data.module';
import { BootModule } from '@nestcloud/boot';
import { resolve } from 'path';
import { BOOT, CONSUL } from '@nestcloud/common';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { HttpClientModule } from '@core/components/http-client/http-client.module';
import { KongGatewayModule } from '@core/components/kong-gateway/kong-gateway.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MmsModule } from '@components/mms/mms.module';

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
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      logging: process.env.NODE_ENV === 'development',
      entities: ['dist/entities/**/*.entity.{ts,js}'],
      migrations: ['dist/database/migrations/*.{ts,js}'],
      subscribers: ['dist/observers/subscribers/*.subscriber.{ts,js}'],
      // We are using migrations, synchronize should be set to false.
      synchronize: false,
      // Run migrations automatically,
      // you can disable this if you prefer running migration manually.
      migrationsRun: false,
      extra: {
        max: parseInt(process.env.DATABASE_MAX_POOL) || 20,
      },
      namingStrategy: new SnakeNamingStrategy(),
    }),
    BootModule.forRoot({
      filePath: resolve(__dirname, '../config.yaml'),
    }),
    ConsulModule.forRootAsync({ inject: [BOOT] }),
    ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
    HttpClientModule,
    KongGatewayModule.forRootAsync(),
    CoreModule,
    AuthModule,
    UserModule,
    WarehouseModule,
    CompanyModule,
    FactoryModule,
    MailModule,
    DepartmentSettingModule,
    UserRoleSettingModule,
    StaticModule,
    ExportModule,
    ImportModule,
    ProduceModule,
    InitDataModule,
    MmsModule,
  ],
  controllers: [AppController, WarehouseController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    AppService,
    WarehouseService,
  ],
})
export class AppModule {}
