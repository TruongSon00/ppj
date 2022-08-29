import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createFactoriesTable1625483123807 implements MigrationInterface {
  name = 'createFactoriesTable1625483123807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'factories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'company_id',
            type: 'int',
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
            name: 'description',
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
            name: 'location',
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
    await queryRunner.createForeignKey(
      'factories',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('factories');
  }
}
