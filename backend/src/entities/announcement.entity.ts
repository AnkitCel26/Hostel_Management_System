import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Pg } from './pg.entity.ts';
import { User } from './user.entity.ts';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'pg_id',
    type: 'uuid',
    nullable: false,
  })
  pgId!: string;

  @ManyToOne(() => Pg, (pg) => pg.announcements, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pg_id' })
  pg!: Pg;

  @Column({
    name: 'created_by',
    type: 'uuid',
    nullable: false,
  })
  createdBy!: string;

  @ManyToOne(() => User, (user) => user.announcements, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  content!: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  isActive!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt!: Date;
}