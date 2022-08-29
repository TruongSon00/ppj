import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class changeColumnGroupPermissionSettingTable1634184823324
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE group_permission_settings drop column id`,
    );
    await queryRunner.query(
      `ALTER TABLE group_permission_settings drop column code`,
    );

    await queryRunner.addColumn(
      'group_permission_settings',
      new TableColumn({
        name: 'id',
        type: 'int',
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );

    await queryRunner.addColumn(
      'group_permission_settings',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '255',
        isPrimary: true,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'group_permission_settings',
      new TableColumn({
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );

    await queryRunner.addColumn(
      'group_permission_settings',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '255',
        isUnique: true,
      }),
    );
  }
}
