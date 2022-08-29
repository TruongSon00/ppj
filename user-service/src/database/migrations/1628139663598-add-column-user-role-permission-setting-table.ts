import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addColumnUserRolePermissionSettingTable1628139663598
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_role_permission_settings',
      new TableColumn({
        name: 'department_setting_id',
        type: 'int',
        isNullable: false,
        default: 1,
      }),
    );

    await queryRunner.createForeignKey(
      'user_role_permission_settings',
      new TableForeignKey({
        columnNames: ['department_setting_id'],
        referencedTableName: 'department_settings',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_role_permission_settings drop column department_setting_id`,
    );
  }
}
