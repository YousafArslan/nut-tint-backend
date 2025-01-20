import { Expense } from 'src/expense/expense.entity';
import { Orders } from 'src/orders/orders.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

@Entity('users') // Explicitly specify the table name
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', enum: UserRole, default: UserRole.EMPLOYEE }) // Use enum type for roles
  role: UserRole;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Orders, (order) => order.createdBy, { cascade: true })
  createdOrders: Orders[];

  @OneToMany(() => Orders, (order) => order.updatedBy, { cascade: true })
  updatedOrders: Orders[];

  @OneToMany(() => Orders, (order) => order.deliveredBy, { cascade: true })
  deliveredOrders: Orders[];

  // Relations with Expenses
  @OneToMany(() => Expense, (expense) => expense.createdBy, { cascade: true })
  createdExpenses: Expense[];

  @OneToMany(() => Expense, (expense) => expense.updatedBy, { cascade: true })
  updatedExpenses: Expense[];
}
