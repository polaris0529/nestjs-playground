import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { CalendarDay } from './calendar-day.entity';
import type { TaskPriority, TaskStatus } from '../calendar.constants';

@Entity('personal_task')
@Index('idx_personal_task_date_user', ['calendarDate', 'userId'])
export class PersonalTask {
  @PrimaryGeneratedColumn('uuid', { name: 'personal_task_id' })
  personalTaskId: string;

  @Column({ name: 'calendar_date', type: 'date' })
  calendarDate: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 20, default: 'TODO' })
  status: TaskStatus;

  @Column({ type: 'varchar', length: 10, nullable: true, default: 'NORMAL' })
  priority: TaskPriority | null;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string | null;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string | null;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CalendarDay, (calendarDay) => calendarDay.personalTasks)
  @JoinColumn({ name: 'calendar_date', referencedColumnName: 'calendarDate' })
  calendarDay: CalendarDay;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'user_id' })
  user: Account;
}
