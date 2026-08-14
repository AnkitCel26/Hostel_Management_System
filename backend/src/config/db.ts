import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity.ts";
import { Pg } from "../entities/pg.entity.ts";
import { Room } from "../entities/room.entity.ts";
import { Tenant } from "../entities/tenant.entity.ts";
import { TenantDocument } from "../entities/tenant_docs.entity.ts";
import { RentPayment } from "../entities/rent_payment.entity.ts";
import { Complaint } from "../entities/complaint.entity.ts";
import { Announcement } from "../entities/announcement.entity.ts";

export const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User,Pg,Room,Tenant,TenantDocument,RentPayment,Complaint,Announcement],
  migrations:["src/migrations/**/*.ts"],

  synchronize: false,
  logging: true,
});