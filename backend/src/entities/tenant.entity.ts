import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import { User } from "./user.entity.ts";
import { Pg } from "./pg.entity.ts";
import { Room } from "./room.entity.ts";
import { TenantDocument } from "./tenant_docs.entity.ts";
import { RentPayment } from "./rent_payment.entity.ts";
import { Complaint } from "./complaint.entity.ts";

export enum TenantStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "user_id",
    type: "uuid",
    unique: true,
    nullable: false,
  })
  userId!: string;

  @OneToOne(() => User, (user) => user.tenant, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({
    name: "pg_id",
    type: "uuid",
    nullable: false,
  })
  pgId!: string;

  @ManyToOne(() => Pg, (pg) => pg.tenants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "pg_id" })
  pg!: Pg;

  @Column({
    name: "room_id",
    type: "uuid",
    nullable: true,
  })
  roomId!: string | null;

  @ManyToOne(() => Room, (room) => room.tenants, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "room_id" })
  room!: Room | null;

  @Column({
    name: "joining_date",
    type: "date",
    nullable: false,
  })
  joiningDate!: Date;

  @Column({
    type: "enum",
    enum: TenantStatus,
    default: TenantStatus.ACTIVE,
    nullable: false,
  })
  status!: TenantStatus;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
  })
  updatedAt!: Date;

  @OneToMany(() => TenantDocument, (document) => document.tenant)
  documents!: TenantDocument[];

  @OneToMany(() => RentPayment, (payment) => payment.tenant)
  rentPayments!: RentPayment[];

  @OneToMany(() => Complaint, (complaint) => complaint.tenant)
  complaints!: Complaint[];
}
