import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '@entities/company/company.entity';
import { CompanyController } from '@components/company/company.controller';
import { CompanyRepository } from '@repositories/company.repository';
import { CompanyService } from '@components/company/company.service';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { WarehouseModule } from '@components/warehouse/warehouse.module';
import { UserService } from '@components/user/user.service';
import { FactoryRepository } from '@repositories/factory.repository';
import { Factory } from '@entities/factory/factory.entity';
import { UserModule } from '@components/user/user.module';
import { CompanyImport } from './import/company.import.helper';
import { UserRepository } from '@repositories/user.repository';
import { User } from '@entities/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Factory, User]),
    WarehouseModule,
    UserModule,
  ],
  providers: [
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyRepository,
    },
    {
      provide: 'FactoryRepositoryInterface',
      useClass: FactoryRepository,
    },
    {
      provide: 'CompanyServiceInterface',
      useClass: CompanyService,
    },
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'CompanyImport',
      useClass: CompanyImport,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],
  controllers: [CompanyController],
})
export class CompanyModule {}
