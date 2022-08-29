export interface ItemServiceInterface {
  getDetailItemUnit(id: number): Promise<any>;
  getItemUnitSettingList(): Promise<any>;
  getItemUnitByIds(ids: number[]): Promise<any>;
  getItemUnitByCodes(codes: string[]): Promise<any>;
  getItemQuantityInWarehouses(code: string): Promise<any>;
  createItem(
    code: string,
    name: string,
    description: string,
    itemUnitId: string,
    itemTypeId: number,
    itemGroupId: number,
    createdByUserId: number,
    price: number,
  ): Promise<any>;
  update(
    id: number,
    code: string,
    name: string,
    description: string,
    itemUnitId: string,
    itemTypeId: number,
    itemGroupId: number,
    createdByUserId: number,
    price: number,
  ): Promise<any>;
  detailItemGroupSetting(code: string): Promise<any>;
  detailItemTypeSetting(code: string): Promise<any>;
  detailItemUnitSetting(code: string): Promise<any>;
  deleteItem(id: number, userId: number): Promise<any>;
  detailItem(code: string): Promise<any>;
  getItemQuantityInWarehouseByCode(codes: string[]): Promise<any>;
}
