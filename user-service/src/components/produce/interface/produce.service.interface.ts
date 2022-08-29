export interface ProduceServiceInterface {
  getFactoryIdsBySaleOrderIds(
    saleOrderIds: number[],
    isSerialize?: boolean,
  ): Promise<any>;
}
