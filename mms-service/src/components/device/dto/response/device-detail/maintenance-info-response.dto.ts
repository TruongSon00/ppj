export class MaintenanceInfoResponseDto {
  planInfo: MaintenancePlanInfoDto;
  actualInfo: MaintenanceActualInfoDto;
}

export class MaintenancePlanInfoDto {
  deviceMaintenance: MaintenanceDeviceInfoDto;
  accessoriesMaintenance: MaintenanceAccessoryInfoDto[];
}

export class MaintenanceActualInfoDto {
  expectedNextMaintenanceAt: string;
  recentFailureAt: string;
  mttr: number;
  expectedNextFailureAfter: number;
  expectedNextFailureAt: string;
}

export class MaintenanceInfoDto {
  maintenanceFrequency: number;
  maintenanceTime: number;
  expectedNextFailureAfter: number;
}

export class MaintenanceDeviceInfoDto extends MaintenanceInfoDto {
  device: DeviceDto;
}

export class MaintenanceAccessoryInfoDto extends MaintenanceInfoDto {
  accessory: AccessoryDto;
}

export class DeviceDto {
  id: string;
  code: string;
  name: string;
}

export class AccessoryDto {
  id: string;
  code: string;
  name: string;
}
