import type{ MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTable1786458246710 implements MigrationInterface {
    name = 'UpdateTable1786458246710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
