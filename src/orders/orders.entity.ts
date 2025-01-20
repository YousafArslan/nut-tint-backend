import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Payments } from 'src/payments/payments.entity';

@Entity('orders') // Name of the table in SQLite
export class Orders {
  @PrimaryGeneratedColumn() // Auto-incrementing primary key
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

  @CreateDateColumn({ type: 'datetime' })
  createdAt: string;

  // Using datetime type for update as well
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: string;

  @Column({ type: 'datetime', nullable: true }) // Nullable for optional updates
  deliveredAt: string;

  // Relationships for user tracking
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User; // The user who created the order

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: User; // The user who last updated the order

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'deliveredBy' })
  deliveredBy: User;

  @OneToMany(() => Payments, (payment) => payment.order, { cascade: true })
  payments: Payments[];
}
