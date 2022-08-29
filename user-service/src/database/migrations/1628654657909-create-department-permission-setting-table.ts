import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createDepartmentPermissionSettingTable1628654657909
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'department_permission_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'department_id',
            type: 'int',
          },
          {
            name: 'permission_setting_id',
            type: 'int',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('department_permission_settings');
  }
}
