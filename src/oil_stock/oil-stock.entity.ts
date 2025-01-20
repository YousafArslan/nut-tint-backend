import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { OilType } from './oil-stock.dto';

@Entity('oil_stocks') // Table name in the database
export class OilStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 0 }) // Example: 12345678.90
  oilPurchased: number; // Total amount of oil purchased

  @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 })
  oilUsed: number; // Amount of oil used

  @Column({ type: 'decimal', precision: 10, scale: 0 }) // Price per unit of oil
  purchasePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  remainingOil: number; // Remaining amount of oil after usage

  @Column({ type: 'text', enum: OilType, default: OilType.BLACK }) // Use enum type for roles
  type: OilType;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relation to User who created the stock entry
  @ManyToOne(() => User, (user) => user.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' }) // Foreign key column
  createdBy: User;
}
