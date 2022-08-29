import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUserRoleSettingsTable1625483123808
  implements MigrationInterface
{
  name = 'createUserRoleSettingsTable1625483123808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_role_settings',
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
          },
          {
            name: 'description',
            isNullable: true,
            type: 'varchar',
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
    await queryRunner.dropTable('user_role_settings');
  }
}
