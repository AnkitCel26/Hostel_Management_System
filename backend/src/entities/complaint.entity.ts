import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Tenant } from './tenant.entity.ts';
import { Pg } from './pg.entity.ts';

export enum ComplaintStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'tenant_id',
    type: 'uuid',
    nullable: false,
  })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @Column({
    name: 'pg_id',
    type: 'uuid',
    nullable: false,
  })
  pgId!: string;

  @ManyToOne(() => Pg, (pg) => pg.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pg_id' })
  pg!: Pg;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description!: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.OPEN,
    nullable: false,
  })
  status!: ComplaintStatus;

  @Column({
    name: 'document_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  documentUrl!: string | null;

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

  @Column({
    name: 'resolved_at',
    type: 'timestamp',
    nullable: true,
  })
  resolvedAt!: Date | null;
}