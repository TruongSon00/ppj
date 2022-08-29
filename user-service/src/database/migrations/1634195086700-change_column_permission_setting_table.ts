import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class changeColumnPermissionSettingTable1634195086700
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE permission_settings drop column group_permission_setting_id`,
    );
    await queryRunner.addColumn(
      'permission_settings',
      new TableColumn({
        name: 'group_permission_setting_code',
        type: 'varchar',
        length: '255',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE permission_settings drop column group_permission_setting_code`,
    );

    await queryRunner.addColumn(
      'permission_settings',
      new TableColumn({
        name: 'group_permission_setting_id',
        type: 'int',
      }),
    );
  }
}
