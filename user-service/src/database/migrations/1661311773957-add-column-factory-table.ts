import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnFactoryTable1661311773957 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'factories',
      new TableColumn({
        name: 'region_id',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE factories drop column region_id`);
  }
}
