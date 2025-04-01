import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { OrderItem } from "./order-item.entity";

@Entity()
@Index(['dermofarmId'])
@Index(['name'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dermofarmId: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column("float")
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  lastSync: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
