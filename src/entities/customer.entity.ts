import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Order } from "./order.entity";

@Entity()
@Index(['dermofarmId'])
@Index(['email'], { unique: true })
@Index(['phone'])
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dermofarmId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @Column({ nullable: true })
  lastSync: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
