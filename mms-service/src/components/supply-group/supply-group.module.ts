import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplyGroupSchema } from '../../models/supply-group/supply-group.schema';
import { UserModule } from '@components/user/user.module';
import { SupplyGroupController } from '@components/supply-group/supply-group.controller';
import { SupplyGroupRepository } from '../../repository/supply-group/supply-group.repository';
import { SupplyGroupService } from '@components/supply-group/supply-group.service';
import { HistoryModule } from '@components/history/history.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SupplyGroup', schema: SupplyGroupSchema },
    ]),
    UserModule,
    HistoryModule,
    forwardRef(() => MaintenanceTeamModule),
  ],
  controllers: [SupplyGroupController],
  providers: [
    {
      provide: 'SupplyGroupRepositoryInterface',
      useClass: SupplyGroupRepository,
    },
    {
      provide: 'SupplyGroupServiceInterface',
      useClass: SupplyGroupService,
    },
  ],
  exports: [
    {
      provide: 'SupplyGroupRepositoryInterface',
      useClass: SupplyGroupRepository,
    },
    {
      provide: 'SupplyGroupServiceInterface',
      useClass: SupplyGroupService,
    },
  ],
})
export class SupplyGroupModule {}
