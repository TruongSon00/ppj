import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnUserTable1627285377957 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'otp_code',
        type: 'varchar',
        length: '6',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'expire',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users drop column deleted_at`);
    await queryRunner.query(`ALTER TABLE users drop column opt_code`);
    await queryRunner.query(`ALTER TABLE users drop column expire`);
  }
}
