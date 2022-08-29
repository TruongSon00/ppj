import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentSetting } from '@entities/department-setting/department-setting.entity';
import { DepartmentSettingRepository } from '@repositories/deparment.repository';
import { DepartmentSettingService } from '@components/settings/department-setting/department-setting.service';
import { DepartmentSettingController } from '@components/settings/department-setting/department-setting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentSetting])],
  providers: [
    {
      provide: 'DepartmentRepositoryInterface',
      useClass: DepartmentSettingRepository,
    },
    {
      provide: 'DepartmentSettingServiceInterface',
      useClass: DepartmentSettingService,
    },
  ],
  controllers: [DepartmentSettingController],
})
export class DepartmentSettingModule {}
