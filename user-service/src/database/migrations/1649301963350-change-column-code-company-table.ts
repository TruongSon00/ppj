import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeColumnCodeCompanyTable1649301963350
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE companies ALTER COLUMN code type varchar(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE companies ALTER COLUMN code type varchar(9)`,
    );
  }
}
