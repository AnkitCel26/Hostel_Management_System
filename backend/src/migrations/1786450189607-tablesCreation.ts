import type{ MigrationInterface, QueryRunner } from "typeorm";

export class TablesCreation1786450189607 implements MigrationInterface {
    name = 'TablesCreation1786450189607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tenants_docs_document_type_enum" AS ENUM('aadhaar', 'pan')`);
        await queryRunner.query(`CREATE TABLE "tenants_docs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "document_type" "public"."tenants_docs_document_type_enum" NOT NULL, "file_url" character varying(500) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a2a81c1a1c0d7d1d8481b6c40c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."rent_payments_payment_mode_enum" AS ENUM('cash', 'upi', 'card')`);
        await queryRunner.query(`CREATE TYPE "public"."rent_payments_status_enum" AS ENUM('pending', 'partial', 'paid', 'overdue')`);
        await queryRunner.query(`CREATE TABLE "rent_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "month" character varying(20) NOT NULL, "year" integer NOT NULL, "amount" numeric(10,2) NOT NULL, "paid_amount" numeric(10,2) NOT NULL DEFAULT '0', "due_date" date NOT NULL, "payment_date" TIMESTAMP, "payment_mode" "public"."rent_payments_payment_mode_enum", "receipt_url" character varying(500), "status" "public"."rent_payments_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b095a12077c0ca1b86f0dacfa29" UNIQUE ("tenant_id", "month", "year"), CONSTRAINT "PK_deca3deaaf83de65c31d5efe8a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."complaints_status_enum" AS ENUM('open', 'in_progress', 'resolved', 'closed')`);
        await queryRunner.query(`CREATE TABLE "complaints" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "pg_id" uuid NOT NULL, "title" character varying(150) NOT NULL, "description" text NOT NULL, "status" "public"."complaints_status_enum" NOT NULL DEFAULT 'open', "document_url" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "resolved_at" TIMESTAMP, CONSTRAINT "PK_4b7566a2a489c2cc7c12ed076ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tenants_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "pg_id" uuid NOT NULL, "room_id" uuid, "joining_date" date NOT NULL, "status" "public"."tenants_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0e2bb90ad27fa92910185792aca" UNIQUE ("user_id"), CONSTRAINT "REL_0e2bb90ad27fa92910185792ac" UNIQUE ("user_id"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."rooms_status_enum" AS ENUM('available', 'full')`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pg_id" uuid NOT NULL, "room_no" integer NOT NULL, "floor" integer, "capacity" integer NOT NULL, "occupied_no" integer NOT NULL DEFAULT '0', "monthly_rent" numeric(10,2) NOT NULL, "status" "public"."rooms_status_enum" NOT NULL DEFAULT 'available', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5db4d40b24d09458cdd087c65a3" UNIQUE ("pg_id", "room_no"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pgs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "address" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "pincode" character varying(6) NOT NULL, "description" character varying(500), "contact_no" character varying(10) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_983113f1d6e9c89830f9ccc3925" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "announcements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pg_id" uuid NOT NULL, "created_by" uuid NOT NULL, "title" character varying(200) NOT NULL, "content" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b3ad760876ff2e19d58e05dc8b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "role" character varying(20) NOT NULL, "phone" character varying(10) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"  ("email") `);
        await queryRunner.query(`ALTER TABLE "tenants_docs" ADD CONSTRAINT "FK_cc0c4ef354d4483e5088f991f78" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent_payments" ADD CONSTRAINT "FK_469a0dcf763aabe035db8c90ed6" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_3898e047e545e9554128c37733d" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_18d62ecae069b9e8e4abecf03e7" FOREIGN KEY ("pg_id") REFERENCES "pgs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "FK_0e2bb90ad27fa92910185792aca" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "FK_f0793a520d155aca332d6e1e599" FOREIGN KEY ("pg_id") REFERENCES "pgs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD CONSTRAINT "FK_88fa02383011b2daa03552941ed" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_fde236ad2b752e94440c5fc3ec1" FOREIGN KEY ("pg_id") REFERENCES "pgs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD CONSTRAINT "FK_6e996d4ba180ea4a318e74413c9" FOREIGN KEY ("pg_id") REFERENCES "pgs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "announcements" ADD CONSTRAINT "FK_40bd4946a00669c5fb7e6d972f0" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "announcements" DROP CONSTRAINT "FK_40bd4946a00669c5fb7e6d972f0"`);
        await queryRunner.query(`ALTER TABLE "announcements" DROP CONSTRAINT "FK_6e996d4ba180ea4a318e74413c9"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_fde236ad2b752e94440c5fc3ec1"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "FK_88fa02383011b2daa03552941ed"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "FK_f0793a520d155aca332d6e1e599"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "FK_0e2bb90ad27fa92910185792aca"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_18d62ecae069b9e8e4abecf03e7"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_3898e047e545e9554128c37733d"`);
        await queryRunner.query(`ALTER TABLE "rent_payments" DROP CONSTRAINT "FK_469a0dcf763aabe035db8c90ed6"`);
        await queryRunner.query(`ALTER TABLE "tenants_docs" DROP CONSTRAINT "FK_cc0c4ef354d4483e5088f991f78"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "announcements"`);
        await queryRunner.query(`DROP TABLE "pgs"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TYPE "public"."tenants_status_enum"`);
        await queryRunner.query(`DROP TABLE "complaints"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_status_enum"`);
        await queryRunner.query(`DROP TABLE "rent_payments"`);
        await queryRunner.query(`DROP TYPE "public"."rent_payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rent_payments_payment_mode_enum"`);
        await queryRunner.query(`DROP TABLE "tenants_docs"`);
        await queryRunner.query(`DROP TYPE "public"."tenants_docs_document_type_enum"`);
    }

}
