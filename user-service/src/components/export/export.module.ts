import { UserModule } from '@components/user/user.module';
import { UserService } from '@components/user/user.service';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { Company } from '@entities/company/company.entity';
import { Factory } from '@entities/factory/factory.entity';
import { UserWarehouse } from '@entities/user-warehouse/user-warehouse.entity';
import { User } from '@entities/user/user.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from '@repositories/company.repository';
import { FactoryRepository } from '@repositories/factory.repository';
import { UserRepository } from '@repositories/user.repository';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Factory, User, UserWarehouse]),
    UserModule,
  ],
  exports: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'FactoryRepositoryInterface',
      useClass: FactoryRepository,
    },
  ],
  providers: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
    {
      provide: 'FactoryRepositoryInterface',
      useClass: FactoryRepository,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  controllers: [ExportController],
})
export class ExportModule {}
