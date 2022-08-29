import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createUserFactoriesTable1625483123813
  implements MigrationInterface
{
  name = 'createUserFactoriesTable1625483123813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_factories',
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
            name: 'factory_id',
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
      'user_factories',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'user_factories',
      new TableForeignKey({
        columnNames: ['factory_id'],
        referencedTableName: 'factories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_factories');
  }
}
