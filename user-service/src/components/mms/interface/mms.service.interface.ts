export interface MmsServiceInterface {
  detailRegion(id: string): Promise<any>;
  listRegion(condition?: any): Promise<any>;
}
