import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createUserDepartmentsTable1625483123812
  implements MigrationInterface
{
  name = 'createUserDepartmentsTable1625483123812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_departments',
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
            name: 'department_id',
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
      'user_departments',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'user_departments',
      new TableForeignKey({
        columnNames: ['department_id'],
        referencedTableName: 'department_settings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_departments');
  }
}
