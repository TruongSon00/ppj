import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class createAddColumnUserRoleSettingTable1631172665761
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_role_settings',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '2',
        isNullable: false,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'user_role_settings',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '2',
        isNullable: false,
      }),
    );
  }
}
