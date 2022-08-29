import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createUserRolesTable1625483123811 implements MigrationInterface {
  name = 'createUserRolesTable1625483123811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_roles',
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
            name: 'user_role_id',
            isPrimary: true,
            type: 'int',
          },
          {
            name: 'department_id',
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
      'user_roles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['department_id'],
        referencedTableName: 'department_settings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['user_role_id'],
        referencedTableName: 'user_role_settings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles');
  }
}
