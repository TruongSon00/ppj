import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnCompanyTable1626431025818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
        length: '255',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE companies drop column description`);
  }
}
