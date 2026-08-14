import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Tenant } from './tenant.entity.ts';

export enum DocumentType {
  AADHAAR = 'aadhaar',
  PAN = 'pan'
}

@Entity('tenants_docs')
export class TenantDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'tenant_id',
    type: 'uuid',
    nullable: false,
  })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.documents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: DocumentType,
    nullable: false,
  })
  documentType!: DocumentType;

    @Column({
    name: 'file_url',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  fileUrl!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;
}