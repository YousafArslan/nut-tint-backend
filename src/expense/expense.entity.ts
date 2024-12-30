import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';

@Entity('expenses')  // Name of the table in SQLite
export class Expense {

  @PrimaryGeneratedColumn()  // Auto-incrementing primary key
  @IsNumber()
  id: number;

  @Column()
  @IsString()
  description: string;  // Column to store a brief description of the expense

  @Column('decimal')
  @IsNumber()
  amount: number;  // Column to store the amount of the expense

  @CreateDateColumn({ type: 'datetime' })
  createdAt: string;

  // Using datetime type for update as well
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: string;
}
