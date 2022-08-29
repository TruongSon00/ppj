export interface CronServiceInterface {
  createWarningChecklist(): void;
  createWarningChecklistEveryDay(): void;
  warningMaintancePeriodDeviceError(): void;
  warningMaintancePeriodDevice(): void;
  warningMaintancePeriodAccessoriesError(): void;
  warningMaintancePeriodAccessories(): void;
  warningMaintancePeriodReplaceSupply(): void;
  resolveJobCompleted(): void;
  updateJobToOutOfDate(): void;
}
