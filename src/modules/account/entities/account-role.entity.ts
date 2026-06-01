import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Account } from './account.entity';
import { CommonCode } from '../../common-code/entities/common-code.entity';

@Entity('account_role')
@Unique('uk_account_role', ['accountId', 'roleCodeId'])
export class AccountRole {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'account_role_id' })
  accountRoleId: number;

  @Column({ name: 'account_id', type: 'bigint' })
  accountId: number;

  @Column({ name: 'role_code_id', type: 'bigint' })
  roleCodeId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.roles)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => CommonCode)
  @JoinColumn({ name: 'role_code_id' })
  roleCode: CommonCode;
}
