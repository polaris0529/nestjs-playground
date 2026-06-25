import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'menu_id' })
  menuId: number;

  // 0 = 최상위(루트). FK 제약 없음 — buildTree 가 직접 조립한다.
  @Column({ name: 'parent_menu_id', type: 'bigint', default: 0 })
  parentMenuId: number;

  @Column({ name: 'menu_code', length: 30, unique: true })
  menuCode: string;

  @Column({ name: 'menu_name', length: 50 })
  menuName: string;

  @Column({ type: 'varchar', name: 'menu_url', length: 200, nullable: true })
  menuUrl: string | null;

  @Column({ type: 'varchar', name: 'menu_type', length: 30 })
  menuType: string;

  @Column({ type: 'varchar', name: 'open_type', length: 30, nullable: true })
  openType: string | null;

  @Column({ name: 'menu_level', default: 1 })
  menuLevel: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'use_yn', type: 'char', length: 1, default: 'Y' })
  useYn: string;

  @Column({ name: 'delete_yn', type: 'char', length: 1, default: 'N' })
  deleteYn: string;

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy: number | null;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // 자기참조 관계는 buildTree 가 수동 조립하므로 데코레이터 없이 타입만 선언
  children: Menu[];

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'created_by' })
  creator: Account | null;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'updated_by' })
  updater: Account | null;
}
