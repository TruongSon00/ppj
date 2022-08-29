import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createCompaniesTable1625483123801 implements MigrationInterface {
  name = 'createCompaniesTable1625483123801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '9',
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
            length: '255',
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
            length: '20',
          },
          {
            name: 'tax_no',
            type: 'varchar',
            isNullable: true,
            length: '20',
          },
          {
            name: 'mail',
            type: 'varchar',
            isNullable: true,
            length: '255',
          },
          {
            name: 'fax',
            type: 'varchar',
            isNullable: true,
            length: '255',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: true,
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: true,
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('companies');
  }
}
