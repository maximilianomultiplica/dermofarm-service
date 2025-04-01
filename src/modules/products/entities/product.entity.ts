import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderItem } from "../../orders/entities/order-item.entity";

@Entity()
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