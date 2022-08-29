import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnCompanyTable1626431025817 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE companies drop column deleted_at`);
  }
}
