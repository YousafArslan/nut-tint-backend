import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

@Entity('orders')  // Name of the table in SQLite
export class Orders {

  @PrimaryGeneratedColumn()  // Auto-incrementing primary key
  @IsNumber()
  id: number;

  @Column()
  @IsString()
  source: string;
  

  @Column()
  @IsString()
  type: string;

  @Column()
  @IsNumber()
  quantity: number;

  @Column({ type: 'boolean' })
  @IsBoolean()
  pickUp: boolean;

  @Column({ type: 'boolean' })
  @IsBoolean()
  delivery: boolean;

  @Column('decimal')
  @IsNumber()
  price: number;

  @Column('decimal')
  @IsNumber()
  cashIn: number;

  @Column('decimal')
  @IsNumber()
  balance: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: string;

  // Using datetime type for update as well
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: string;

  // Using datetime type for update as well
  @UpdateDateColumn({ type: 'datetime' })
  deliveredAt: string;
}
