import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonCode } from './common-code.entity';

@Entity('common_code_group')
export class CommonCodeGroup {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'code_group_id' })
  codeGroupId: number;

  @Column({ name: 'group_code', length: 30, unique: true })
  groupCode: string;

  @Column({ name: 'group_name', length: 50 })
  groupName: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  @Column({ name: 'use_yn', type: 'char', length: 1, default: 'Y' })
  useYn: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CommonCode, (code) => code.codeGroup)
  codes: CommonCode[];
}
