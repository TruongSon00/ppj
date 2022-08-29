import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnFactoryTable1626943577160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'factories',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE factories drop column deleted_at`);
  }
}
