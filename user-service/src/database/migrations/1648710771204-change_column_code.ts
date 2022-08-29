import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeColumnCode1648710771204 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE factories ALTER COLUMN code type varchar(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE factories ALTER COLUMN code type varchar(9)`,
    );
  }
}
