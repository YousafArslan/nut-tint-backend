import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Orders } from 'src/orders/orders.entity';

@Entity('payments') // Name of the table in SQLite
export class Payments {
  @PrimaryGeneratedColumn() // Auto-incrementing primary key
  @IsNumber()
  id: number;

  @Column('decimal')
  @IsNumber()
  cashIn: number;

  @Column('decimal')
  @IsNumber()
  remainingAmount: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: string;

  // Relationships for user tracking
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: User;

  // Relationship with Orders
  @ManyToOne(() => Orders, (order) => order.payments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' }) // Foreign key column
  order: Orders;
}
