import { Orders } from 'src/orders/orders.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('customers')
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shopName: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Orders, (order) => order.customer, { cascade: true })
  orders: Orders[];
}
