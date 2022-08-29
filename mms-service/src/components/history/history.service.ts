import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { History } from '../../models/history/history.model';

@Injectable()
export class HistoryService implements HistoryServiceInterface {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  async mapUserHistory(rawHistories: History[]): Promise<void> {
    const userRaws = {};
    const userIds = [];

    if (!isEmpty(rawHistories)) {
      rawHistories.forEach((item) => {
        if (!userIds.includes(item.userId)) {
          userIds.push(item.userId);
        }
      });

      const userList = await this.userService.getListByIDs(userIds);

      if (!isEmpty(userList)) {
        userList.forEach((item) => {
          userRaws[item.id] = item.username;
        });
        rawHistories.forEach((item) => {
          item.username = userRaws[item.userId];
        });
      }
    }
  }

  async sortHistoryDesc(rawHistories: History[]): Promise<any> {
    if (!isEmpty(rawHistories)) {
      rawHistories.sort((dateBegin, dateAfter) => {
        return (
          new Date(dateAfter.createdAt).getTime() -
          new Date(dateBegin.createdAt).getTime()
        );
      });
      return rawHistories;
    } else return null;
  }
}
