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
import { CalendarDay } from './calendar-day.entity';
import type { TaskStatus } from '../calendar.constants';

@Entity('common_task')
@Index('idx_common_task_date', ['calendarDate'])
export class CommonTask {
  @PrimaryGeneratedColumn('uuid', { name: 'common_task_id' })
  commonTaskId: string;

  @Column({ name: 'calendar_date', type: 'date' })
  calendarDate: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string | null;

  @Column({ type: 'varchar', length: 20, default: 'TODO' })
  status: TaskStatus;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string | null;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CalendarDay, (calendarDay) => calendarDay.commonTasks)
  @JoinColumn({ name: 'calendar_date', referencedColumnName: 'calendarDate' })
  calendarDay: CalendarDay;
}
