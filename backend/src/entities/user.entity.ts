import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Announcement } from "./announcement.entity.ts";
import { Tenant } from "./tenant.entity.ts";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  name!: string;

  @Index({ unique: true })
  @Column({
    type: "varchar",
    length: 150,
    nullable: false,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
  })
  role!: string;

  @Column({
    type: "varchar",
    length: 10,
    nullable: false,
  })
  phone!: string;

  @Column({
    name: "is_active",
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  password!: string;

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

  @OneToMany(() => Announcement, (announcement) => announcement.creator)
  announcements!: Announcement[];

  @OneToOne(() => Tenant, (tenant) => tenant.user)
  tenant!: Tenant;
}
