import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addSomeColumnConfirmedCompanyTable1633316692869
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'status',
        default: 0,
        type: 'int',
      }),
    );
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'approver_id',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'approved_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE companies drop column status`);
    await queryRunner.query(`ALTER TABLE companies drop column approver_id`);
    await queryRunner.query(`ALTER TABLE companies drop column approved_at`);
  }
}
