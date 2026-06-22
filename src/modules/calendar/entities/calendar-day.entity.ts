import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PersonalTask } from './personal-task.entity';
import { CommonTask } from './common-task.entity';
import type { DayOfWeekCode } from '../calendar.constants';

@Entity('calendar')
export class CalendarDay {
  @PrimaryColumn({ name: 'calendar_date', type: 'date' })
  calendarDate: string;

  @Column({ name: 'day_of_week', type: 'varchar', length: 3 })
  dayOfWeek: DayOfWeekCode;

  @Column({ name: 'is_holiday', type: 'boolean', default: false })
  isHoliday: boolean;

  @Column({
    name: 'holiday_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  holidayName: string | null;

  @Column({ name: 'is_weekend', type: 'boolean', default: false })
  isWeekend: boolean;

  @Column({ name: 'is_workday', type: 'boolean', default: true })
  isWorkday: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PersonalTask, (task) => task.calendarDay)
  personalTasks: PersonalTask[];

  @OneToMany(() => CommonTask, (task) => task.calendarDay)
  commonTasks: CommonTask[];
}
