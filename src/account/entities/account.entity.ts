import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountRole } from './account-role.entity';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'account_id' })
  accountId: number;

  @Column({ name: 'login_id', length: 30, unique: true })
  loginId: string;

  @Column({ length: 100 })
  password: string;

  @Column({ name: 'account_name', length: 30 })
  accountName: string;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @Column({ name: 'use_yn', type: 'char', length: 1, default: 'Y' })
  useYn: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AccountRole, (role) => role.account)
  roles: AccountRole[];
}
