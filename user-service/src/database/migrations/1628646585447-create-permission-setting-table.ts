import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createPermissionSettingTable1628646585447
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.createTable(
      new Table({
        name: 'permission_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isPrimary: true,
            length: '255',
            isUnique: true,
          },
          {
            name: 'group_permission_setting_id',
            type: 'int',
          },
          {
            name: 'status',
            type: 'int',
            default: 1,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permission_settings');
  }
}
