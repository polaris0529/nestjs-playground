import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CommonCodeGroup } from './common-code-group.entity';

@Entity('common_code')
@Unique('uk_common_code', ['codeGroupId', 'code'])
export class CommonCode {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'code_id' })
  codeId: number;

  @Column({ name: 'code_group_id', type: 'bigint' })
  codeGroupId: number;

  @Column({ length: 30 })
  code: string;

  @Column({ name: 'code_name', length: 50 })
  codeName: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'use_yn', type: 'char', length: 1, default: 'Y' })
  useYn: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CommonCodeGroup, (group) => group.codes)
  @JoinColumn({ name: 'code_group_id' })
  codeGroup: CommonCodeGroup;
}
