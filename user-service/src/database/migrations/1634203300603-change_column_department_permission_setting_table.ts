import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class changeColumnDepartmentPermissionSettingTable1634203300603
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE department_permission_settings drop column permission_setting_id`,
    );
    await queryRunner.addColumn(
      'department_permission_settings',
      new TableColumn({
        name: 'permission_setting_code',
        type: 'varchar',
        length: '255',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE department_permission_settings drop column permission_setting_code`,
    );

    await queryRunner.addColumn(
      'department_permission_settings',
      new TableColumn({
        name: 'permission_setting_id',
        type: 'int',
      }),
    );
  }
}
