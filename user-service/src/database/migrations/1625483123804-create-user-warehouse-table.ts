import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createUserWarehousesTable1625483123804
  implements MigrationInterface
{
  name = 'createUserWarehousesTable1625483123804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_warehouses',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            isPrimary: true,
            type: 'int',
          },
          {
            name: 'warehouse_id',
            isPrimary: true,
            type: 'int',
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
      'user_warehouses',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_warehouses');
  }
}
