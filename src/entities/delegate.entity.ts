import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delegate_profile')
export class DelegateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'sector' })
  sector: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;
}