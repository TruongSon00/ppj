import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createGroupPermissionSettingTable1628646585448
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'group_permission_settings',
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
            isUnique: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '255',
            isUnique: true,
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
    await queryRunner.dropTable('group_permission_settings');
  }
}
