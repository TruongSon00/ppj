import { Injectable } from '@nestjs/common';
import { DataSource, getConnection } from 'typeorm';
import { InitDataRepositoryInterface } from '@components/init-data/interface/init-data.repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { InsertDataRequestDto } from '@components/init-data/dto/request/insert-data.request.dto';

@Injectable()
export class InitDataRepository implements InitDataRepositoryInterface {
  constructor(
    @InjectDataSource()
    private readonly connection: DataSource,
  ) {}

  async insertData(
    payload: InsertDataRequestDto,
    queryRunner: any,
  ): Promise<any> {
    const entityMetadata = getConnection().entityMetadatas.find(
      (metadata) => metadata.tableName === payload.table,
    );
    if (entityMetadata) {
      await queryRunner.query(
        'TRUNCATE TABLE ' + payload.table + ' RESTART IDENTITY CASCADE',
      );
      const keys = payload.data.key.split(',');
      const values = payload.data.values.split('|');

      let query = `INSERT INTO "${payload.table}" (`;
      // set field
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i == keys.length - 1) {
          query += `"${key}"`;
          break;
        }
        query += `"${key}",`;
      }
      query += `) VALUES (`;

      // set value
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (i == values.length - 1 && value) {
          query += `'${value}'`;
          break;
        } else if (i == values.length - 1 && !value) {
          query += `NULL`;
          break;
        } else if (!value) {
          query += `NULL,`;
          continue;
        }
        query += `'${value}',`;
      }
      query += `)`;

      await queryRunner.query(query);
    } else {
      return {
        table: payload.table,
        error: true,
      };
    }
  }
}
