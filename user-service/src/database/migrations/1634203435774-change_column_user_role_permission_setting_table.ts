import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class changeColumnUserRolePermissionSettingTable1634203435774
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_role_permission_settings drop column permission_id`,
    );
    await queryRunner.renameColumn(
      'user_role_permission_settings',
      'department_setting_id',
      'department_id',
    );
    await queryRunner.addColumn(
      'user_role_permission_settings',
      new TableColumn({
        name: 'permission_setting_code',
        type: 'varchar',
        length: '255',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_role_permission_settings drop column permission_setting_code`,
    );
    await queryRunner.renameColumn(
      'user_role_permission_settings',
      'department_id',
      'department_setting_id',
    );
    await queryRunner.addColumn(
      'user_role_permission_settings',
      new TableColumn({
        name: 'permission_id',
        type: 'int',
      }),
    );
  }
}
