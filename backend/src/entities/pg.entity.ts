import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Room } from "./room.entity.ts";
import { Announcement } from "./announcement.entity.ts";
import { Complaint } from "./complaint.entity.ts";
import { Tenant } from "./tenant.entity.ts";

@Entity("pgs")
export class Pg {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  address!: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  city!: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  state!: string;

  @Column({
    type: "varchar",
    length: 6,
    nullable: false,
  })
  pincode!: string;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
  })
  description!: string | null;

  @Column({
    name: "contact_no",
    type: "varchar",
    length: 10,
    nullable: false,
  })
  contactNo!: string;

  @Column({
    name: "is_active",
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

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
  @OneToMany(() => Room, (room) => room.pg)
  rooms!: Room[];

  @OneToMany(() => Announcement, (announcement) => announcement.pg)
  announcements!: Announcement[];

  @OneToMany(() => Complaint, (complaint) => complaint.pg)
  complaints!: Complaint[];

  @OneToMany(() => Tenant, (tenant) => tenant.pg)
  tenants!: Tenant[];
}
