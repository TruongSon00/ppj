import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addStatusNotificationUserTable1651202490837
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'status_notification',
        type: 'boolean',
        isNullable: true,
        default: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'status_notification',
        type: 'boolean',
        isNullable: true,
        default: true,
      }),
    ]);
  }
}
