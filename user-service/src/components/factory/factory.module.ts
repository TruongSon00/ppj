import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactoryController } from './factory.controller';
import { Factory } from '@entities/factory/factory.entity';
import { FactoryService } from './factory.service';
import { FactoryRepository } from '@repositories/factory.repository';
import { CompanyRepository } from '@repositories/company.repository';
import { UserService } from '@components/user/user.service';
import { Company } from '@entities/company/company.entity';
import { User } from '@entities/user/user.entity';
import { UserModule } from '@components/user/user.module';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { WarehouseModule } from '@components/warehouse/warehouse.module';
import { UserFactoryRepository } from '@repositories/user-factory.repository';
import { UserFactory } from '@entities/user-factory/user-factory.entity';
import { FactoryImport } from './import/factory.import.helper';
import { UserRepository } from '@repositories/user.repository';
import { ProduceService } from '@components/produce/produce.service';
import { MmsService } from '@components/mms/mms.service';
import { MmsModule } from '@components/mms/mms.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factory, Company, User, UserFactory]),
    UserModule,
    WarehouseModule,
    MmsModule,
    HttpModule,
  ],
  exports: [
    {
      provide: 'FactoryRepositoryInterface',
      useClass: FactoryRepository,
    },
    {
      provide: 'FactoryServiceInterface',
      useClass: FactoryService,
    },
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyRepository,
    },
    {
      provide: 'UserFactoryRepositoryInterface',
      useClass: UserFactoryRepository,
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
      provide: 'FactoryImport',
      useClass: FactoryImport,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'MmsServiceInterface',
      useClass: MmsService,
    },
  ],
  providers: [
    {
      provide: 'FactoryRepositoryInterface',
      useClass: FactoryRepository,
    },
    {
      provide: 'FactoryServiceInterface',
      useClass: FactoryService,
    },
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyRepository,
    },
    {
      provide: 'UserFactoryRepositoryInterface',
      useClass: UserFactoryRepository,
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
      provide: 'FactoryImport',
      useClass: FactoryImport,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
    {
      provide: 'MmsServiceInterface',
      useClass: MmsService,
    },
  ],
  controllers: [FactoryController],
})
export class FactoryModule {}
