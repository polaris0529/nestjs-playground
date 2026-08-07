import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { CommonTaskController } from './common-task.controller';
import { PersonalTaskController } from './personal-task.controller';
import { CalendarRepository } from './calendar.repository';
import { CommonTaskRepository } from './common-task.repository';
import { PersonalTaskRepository } from './personal-task.repository';
import { CalendarService } from './calendar.service';
import { CommonTaskService } from './common-task.service';
import { PersonalTaskService } from './personal-task.service';
import { CalendarDay } from './entities/calendar-day.entity';
import { CommonTask } from './entities/common-task.entity';
import { PersonalTask } from './entities/personal-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarDay, CommonTask, PersonalTask])],
  controllers: [
    CalendarController,
    CommonTaskController,
    PersonalTaskController,
  ],
  providers: [
    CalendarRepository,
    CommonTaskRepository,
    PersonalTaskRepository,
    CalendarService,
    CommonTaskService,
    PersonalTaskService,
  ],
})
export class CalendarModule {}
