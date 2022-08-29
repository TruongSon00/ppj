import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameMailColumn1626431025816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.renameColumn('companies', 'mail', 'email');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.renameColumn('companies', 'email', 'mail');
  }
}
