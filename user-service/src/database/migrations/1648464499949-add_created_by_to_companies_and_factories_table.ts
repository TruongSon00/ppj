import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCreatedByToCompaniesAndFactoriesTable1648464499949
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('companies', [
      new TableColumn({
        name: 'created_by',
        type: 'int',
        isNullable: true,
      }),
    ]);
    await queryRunner.addColumns('factories', [
      new TableColumn({
        name: 'created_by',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('companies', [
      new TableColumn({
        name: 'created_by',
        type: 'int',
        isNullable: true,
      }),
    ]);
    await queryRunner.dropColumns('factories', [
      new TableColumn({
        name: 'created_by',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }
}
