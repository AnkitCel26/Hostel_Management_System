import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from "typeorm";

import { Pg } from "./pg.entity.ts";
import { Tenant } from "./tenant.entity.ts";

export enum RoomStatus {
  AVAILABLE = "available",
  FULL = "full",
}

@Entity("rooms")
@Unique(["pgId", "roomNo"])
export class Room {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "pg_id",
    type: "uuid",
    nullable: false,
  })
  pgId!: string;

  @ManyToOne(() => Pg, (pg) => pg.rooms, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "pg_id" })
  pg!: Pg;

  @Column({
    name: "room_no",
    type: "integer",
    nullable: false,
  })
  roomNo!: number;

  @Column({
    type: "integer",
    nullable: true,
  })
  floor!: number | null;

  @Column({
    type: "integer",
    nullable: false,
  })
  capacity!: number;

  @Column({
    name: "occupied_no",
    type: "integer",
    default: 0,
    nullable: false,
  })
  occupiedNo!: number;

  @Column({
    name: "monthly_rent",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  monthlyRent!: number;

  @Column({
    type: "enum",
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
    nullable: false,
  })
  status!: RoomStatus;

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

  @OneToMany(() => Tenant, (tenant) => tenant.room)
  tenants!: Tenant[];
}
