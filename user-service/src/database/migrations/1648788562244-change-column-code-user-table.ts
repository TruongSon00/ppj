import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeColumnCodeUserTable1648788562244
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users ALTER COLUMN code type varchar(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users ALTER COLUMN code type varchar(9)`,
    );
  }
}
