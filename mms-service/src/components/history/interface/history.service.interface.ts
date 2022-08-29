import { History } from '../../../models/history/history.model';

export interface HistoryServiceInterface {
  mapUserHistory(rawHistories: History[]): Promise<void>;
  sortHistoryDesc(rawHistories: History[]): Promise<any>;
}
