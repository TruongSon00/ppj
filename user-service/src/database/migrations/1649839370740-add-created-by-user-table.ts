import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCreatedByUserTable1649839370740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'created_by',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [
      new TableColumn({
        name: 'created_by',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }
}
