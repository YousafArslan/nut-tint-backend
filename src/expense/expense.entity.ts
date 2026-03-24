import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';
import { User } from 'src/user/user.entity';

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
  createdAt: Date;

  // Using datetime type for update as well
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships for user tracking
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User; // The user who created the expense

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: User; // The user who last updated the expense
}
