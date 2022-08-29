import { DeviceRequestTicketRepository } from 'src/repository/device-request-ticket/device-request-ticket.repository';
import { DefectSchema } from 'src/models/defect/defect.schema';
import { DefectRepository } from 'src/repository/defect/defect.repository';
import { AttributeTypeRepository } from 'src/repository/attribute-type/attribute-type.repository';
import { AttributeTypeSchema } from 'src/models/attribute-type/attribute-type.schema';
import { MaintenanceAttributeRepository } from 'src/repository/maintenance-attribute/maintenance-attribute.repository';
import { MaintenanceAttributeSchema } from 'src/models/maintenance-attribute/maintenance-attribute.schema';
import { SupplyGroupSchema } from 'src/models/supply-group/supply-group.schema';
import { SupplyGroupRepository } from 'src/repository/supply-group/supply-group.repository';
import { SupplySchema } from 'src/models/supply/supply.schema';
import { SupplyRepository } from 'src/repository/supply/supply.repository';
import { UserService } from '@components/user/user.service';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChecklistTemplateSchema } from 'src/models/checklist-template/checklist-template.schema';
import { DeviceGroupSchema } from 'src/models/device-group/device-group.schema';
import { InstallationTemplateSchema } from 'src/models/installation-template/installation-template.schema';
import { DeviceSchema } from 'src/models/device/device.schema';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { CheckListTemplateRepository } from 'src/repository/checklist-template/checklist-template.repository';
import { DeviceGroupRepository } from 'src/repository/device-group/device-group.repository';
import { InstallationTemplateRepository } from 'src/repository/installation-template/installation-template.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitSchema } from 'src/models/unit/unit.schema';
import { InterRegionRepository } from 'src/repository/inter-region/inter-region.repository';
import { InterRegionSchema } from 'src/models/inter-region/inter-region.schema';
import { RegionRepository } from 'src/repository/region/region.repository';
import { RegionSchema } from 'src/models/region/region.schema';
import { DeviceRequestTicketSchema } from 'src/models/device-request-ticket/device-request-ticket.schema';
import { AreaSchema } from 'src/models/area/area.schema';
import { AreaRepository } from 'src/repository/area/area.repository';
import { ErrorTypeSchema } from 'src/models/error-type/error-type.schema';
import { ErrorTypeRepository } from 'src/repository/error-type/error-type.repository';
import { VendorRepository } from 'src/repository/vendor/vendor.repository';
import { VendorSchema } from 'src/models/vendor/vendor.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceGroup', schema: DeviceGroupSchema },
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
      { name: 'Defect', schema: DefectSchema },
      { name: 'CheckListTemplate', schema: ChecklistTemplateSchema },
      { name: 'InstallationTemplate', schema: InstallationTemplateSchema },
      { name: 'AttributeType', schema: AttributeTypeSchema },
      { name: 'MaintenanceAttribute', schema: MaintenanceAttributeSchema },
      { name: 'SupplyGroup', schema: SupplyGroupSchema },
      { name: 'Supply', schema: SupplySchema },
      { name: 'Device', schema: DeviceSchema },
      { name: 'UnitModel', schema: UnitSchema },
      { name: 'InterRegionModel', schema: InterRegionSchema },
      { name: 'RegionModel', schema: RegionSchema },
      { name: 'DeviceRequestTicket', schema: DeviceRequestTicketSchema },
      { name: 'AreaModel', schema: AreaSchema },
      { name: 'ErrorTypeModel', schema: ErrorTypeSchema },
      { name: 'VendorModel', schema: VendorSchema },
    ]),
  ],
  providers: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'DeviceGroupRepositoryInterface',
      useClass: DeviceGroupRepository,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
    {
      provide: 'DefectRepositoryInterface',
      useClass: DefectRepository,
    },
    {
      provide: 'CheckListTemplateRepositoryInterface',
      useClass: CheckListTemplateRepository,
    },
    {
      provide: 'InstallationTemplateRepositoryInterface',
      useClass: InstallationTemplateRepository,
    },
    {
      provide: 'AttributeTypeRepositoryInterface',
      useClass: AttributeTypeRepository,
    },
    {
      provide: 'MaintenanceAttributeRepositoryInterface',
      useClass: MaintenanceAttributeRepository,
    },
    {
      provide: 'SupplyGroupRepositoryInterface',
      useClass: SupplyGroupRepository,
    },
    {
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
    {
      provide: 'InterRegionRepositoryInterface',
      useClass: InterRegionRepository,
    },
    {
      provide: 'RegionRepositoryInterface',
      useClass: RegionRepository,
    },
    {
      provide: 'DeviceRequestTicketRepositoryInterface',
      useClass: DeviceRequestTicketRepository,
    },
    {
      provide: 'AreaRepositoryInterface',
      useClass: AreaRepository,
    },
    {
      provide: 'ErrorTypeRepositoryInterface',
      useClass: ErrorTypeRepository,
    },
    {
      provide: 'VendorRepositoryInterface',
      useClass: VendorRepository,
    },
  ],
  controllers: [ExportController],
  exports: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
})
export class ExportModule {}
