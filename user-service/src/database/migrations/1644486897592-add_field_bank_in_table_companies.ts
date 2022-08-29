import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldBankInTableCompanies1644486897592
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('companies', [
      new TableColumn({
        name: 'bank_account',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'bank_account_owner',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'bank',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('companies', [
      new TableColumn({
        name: 'bank_account',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'bank_account_owner',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'bank',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    ]);
  }
}
