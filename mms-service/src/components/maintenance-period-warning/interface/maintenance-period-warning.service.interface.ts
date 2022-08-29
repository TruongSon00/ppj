export interface MaintenancePeriodWarningServiceInterface {
  createMaintancePeriodDevice(payload: any): Promise<any>;
  createMaintancePeriodSupply(id: string, type: number): Promise<any>;
}
