import { Inject, Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { InitDataServiceInterface } from './interface/init-data.service.interface';
import { InitDataRepositoryInterface } from './interface/init-data.repository.interface';
import { InsertDataRequestDto } from './dto/request/insert-data.request.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class InitDataService implements InitDataServiceInterface {
  constructor(
    @Inject('InitDataRepositoryInterface')
    private readonly initDataRepository: InitDataRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,

    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  public async insertData(request: InsertDataRequestDto[]): Promise<any> {
    const data = Object.keys(request).map((i) => {
      return request[i];
    });

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      data.forEach((payload) =>
        this.initDataRepository.insertData(payload, queryRunner),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }
}
