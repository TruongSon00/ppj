import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createUserRolePermissionSettingsTable1625483123809
  implements MigrationInterface
{
  name = 'createUserRolePermissionSettingsTable1625483123809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_role_permission_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_role_id',
            isPrimary: true,
            type: 'int',
          },
          {
            name: 'permission_id',
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
      'user_role_permission_settings',
      new TableForeignKey({
        columnNames: ['user_role_id'],
        referencedTableName: 'user_role_settings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_role_permission_settings');
  }
}
