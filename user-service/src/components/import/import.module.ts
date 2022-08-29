import { FactoryModule } from '@components/factory/factory.module';
import { FactoryService } from '@components/factory/factory.service';
import { MmsModule } from '@components/mms/mms.module';
import { MmsService } from '@components/mms/mms.service';
import { UserModule } from '@components/user/user.module';
import { UserService } from '@components/user/user.service';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    UserModule,
    FactoryModule,
    MmsModule,
    HttpModule,
  ],
  exports: [
    {
      provide: 'ImportServiceInterface',
      useClass: ImportService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'FactoryServiceInterface',
      useClass: FactoryService,
    },
    {
      provide: 'MmsServiceInterface',
      useClass: MmsService,
    },
  ],
  providers: [
    {
      provide: 'ImportServiceInterface',
      useClass: ImportService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'FactoryServiceInterface',
      useClass: FactoryService,
    },
    {
      provide: 'MmsServiceInterface',
      useClass: MmsService,
    },
  ],
  controllers: [ImportController],
})
export class ImportModule {}
