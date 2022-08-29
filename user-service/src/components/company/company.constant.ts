export enum CompanyStatusEnum {
  CREATED = 0,
  CONFIRMED = 1,
  REJECT = 2,
}

export const CAN_UPDATE_COMPANY_STATUS: number[] = [
  CompanyStatusEnum.CREATED,
  CompanyStatusEnum.REJECT,
];

export const CAN_DELETE_COMPANY_STATUS: number[] = [
  CompanyStatusEnum.CREATED,
  CompanyStatusEnum.REJECT,
];
