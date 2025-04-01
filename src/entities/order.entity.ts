import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Customer } from "./customer.entity";
import { OrderItem } from "./order-item.entity";

@Entity()
@Index(['dermofarmId'])
@Index(['status'])
@Index(['createdAt'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dermofarmId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column("float")
  total: number;

  @Column({
    default: "pending",
  })
  status: string;

  @Column({ nullable: true })
  lastSync: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
