import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addSomeColumnConfirmedFactoryTable1633316708851
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'factories',
      new TableColumn({
        name: 'status',
        default: 0,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'factories',
      new TableColumn({
        name: 'approver_id',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'factories',
      new TableColumn({
        name: 'approved_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE factories drop column status`);
    await queryRunner.query(`ALTER TABLE factories drop column approver_id`);
    await queryRunner.query(`ALTER TABLE factories drop column approved_at`);
  }
}
