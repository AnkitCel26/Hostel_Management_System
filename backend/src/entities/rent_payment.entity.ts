import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Tenant } from './tenant.entity.ts';

export enum PaymentMode {
  CASH = 'cash',
  UPI = 'upi',
  CARD = 'card',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity('rent_payments')
@Unique(['tenantId', 'month', 'year'])
export class RentPayment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'tenant_id',
    type: 'uuid',
    nullable: false,
  })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.rentPayments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  month!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  year!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amount!: number;

  @Column({
    name: 'paid_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false,
  })
  paidAmount!: number;

  @Column({
    name: 'due_date',
    type: 'date',
    nullable: false,
  })
  dueDate!: Date;

  @Column({
    name: 'payment_date',
    type: 'timestamp',
    nullable: true,
  })
  paymentDate!: Date | null;

  @Column({
    name: 'payment_mode',
    type: 'enum',
    enum: PaymentMode,
    nullable: true,
  })
  paymentMode!: PaymentMode | null;

  @Column({
    name: 'receipt_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  receiptUrl!: string | null;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    nullable: false,
  })
  status!: PaymentStatus;

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