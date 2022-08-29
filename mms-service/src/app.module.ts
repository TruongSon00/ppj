import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import DatabaseConfigService from '@config/database.config';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceGroupModule } from '@components/device-group/device-group.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@core/pipe/validator.pipe';
import { WarningModule } from '@components/warning/warning.module';
import { DefectModule } from '@components/defect/defect.module';
import { UserModule } from '@components/user/user.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { SupplyModule } from '@components/supply/supply.module';
import { ItemModule } from '@components/item/item.module';
import { JobModule } from '@components/job/job.module';
import { SupplyGroupModule } from '@components/supply-group/supply-group.module';
import { MaintenanceAttributeModule } from '@components/maintenance-attribute/maintenance-attribute.module';
import { DeviceModule } from '@components/device/device.module';
import { CheckListTemplateModule } from '@components/checklist-template/checklist-template.module';
import { DashboardModule } from '@components/dashboard/dashboard.module';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { ProduceModule } from '@components/produce/produce.module';
import { GeneralMaintenanceParameterModule } from '@components/general-maintenance-parameter/general-maintenance-parameter.module';
import { MaintenancePeriodWarningModule } from '@components/maintenance-period-warning/maintenance-period-warning.module';
import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { ReportModule } from '@components/report/report.module';
import { ReportDeviceStatusModule } from '@components/report-device-status/report-device-status.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AttributeTypeModule } from '@components/attribute-type/attribute-type.module';
import { PlanModule } from '@components/plan/plan.module';
import { InstallationTemplateModule } from '@components/installation-template/installation-template.module';
import { SupplyRequestModule } from '@components/supply-request/supply-request.module';
import { SaleModule } from '@components/sale/sale.module';
import { DeviceStatusModule } from '@components/device-status/device-status.module';
import { QueryResolver } from './i18n/query-resolver';
import { BootModule } from '@nestcloud/boot';
import { resolve } from 'path';
import { BOOT, CONSUL } from '@nestcloud/common';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { HttpClientModule } from '@core/components/http-client/http-client.module';
import { KongGatewayModule } from '@core/components/kong-gateway/kong-gateway.module';
import { CoreModule } from '@core/core.module';
import { AuthModule } from '@components/auth/auth.module';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import { CronService } from './cron/cron.service';
import { ExportModule } from '@components/export/export.module';
import { ImportExcelModule } from '@components/import-excel/import-excel.module';
import { UnitModule } from '@components/unit/unit.module';
import { InterRegionModule } from '@components/inter-region/inter-region.module';
import { RegionModule } from '@components/region/region.module';
import { AreaModule } from '@components/area/area.module';
import { ErrorTypeModule } from '@components/error-type/error-type.module';
import { VendorModule } from '@components/vendor/vendor.module';
import { AccreditationController } from './components/accreditation/accreditation.controller';
import { AccreditationService } from './components/accreditation/accreditation.service';
import { AccreditationModule } from './components/accreditation/accreditation.module';

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
    MongooseModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    ScheduleModule.forRoot(),
    BootModule.forRoot({
      filePath: resolve(__dirname, '../config.yaml'),
    }),
    ConsulModule.forRootAsync({ inject: [BOOT] }),
    ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
    HttpClientModule,
    KongGatewayModule.forRootAsync(),
    JobModule,
    MaintainRequestModule,
    DeviceAssignmentModule,
    DefectModule,
    UserModule,
    MaintenanceTeamModule,
    DeviceGroupModule,
    MaintenanceAttributeModule,
    SupplyGroupModule,
    SupplyModule,
    ItemModule,
    AuthModule,
    DeviceModule,
    CheckListTemplateModule,
    DashboardModule,
    DeviceRequestModule,
    ProduceModule,
    GeneralMaintenanceParameterModule,
    MaintenancePeriodWarningModule,
    ReportModule,
    ReportDeviceStatusModule,
    CronModule,
    AttributeTypeModule,
    PlanModule,
    InstallationTemplateModule,
    SupplyRequestModule,
    SaleModule,
    DeviceStatusModule,
    CoreModule,
    ExportModule,
    ImportExcelModule,
    UnitModule,
    InterRegionModule,
    WarningModule,
    RegionModule,
    AreaModule,
    ErrorTypeModule,
    VendorModule,
    AccreditationModule,
  ],
  controllers: [AppController, AccreditationController],
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
    CronService,
    AccreditationService,
  ],
})
export class AppModule {}
