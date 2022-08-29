export enum FactoryStatusEnum {
  CREATED = 0,
  CONFIRMED = 1,
  REJECT = 2,
}

export const CAN_UPDATE_FACTORY_STATUS: number[] = [
  FactoryStatusEnum.CREATED,
  FactoryStatusEnum.REJECT,
];

export const CAN_DELETE_FACTORY_STATUS: number[] = [
  FactoryStatusEnum.CREATED,
  FactoryStatusEnum.REJECT,
];
