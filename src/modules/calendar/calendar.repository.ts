import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarDay } from './entities/calendar-day.entity';

@Injectable()
export class CalendarRepository {
  constructor(
    @InjectRepository(CalendarDay)
    private readonly repository: Repository<CalendarDay>,
  ) {}

  findByDate(calendarDate: string) {
    return this.repository.findOneBy({ calendarDate });
  }

  findByRange(startDate: string, endDate: string) {
    return this.repository
      .createQueryBuilder('calendar')
      .where('calendar.calendar_date >= :startDate', { startDate })
      .andWhere('calendar.calendar_date < :endDate', { endDate })
      .orderBy('calendar.calendar_date', 'ASC')
      .getMany();
  }

  saveMany(days: Partial<CalendarDay>[]) {
    return this.repository.save(days);
  }

  async update(calendarDate: string, partial: Partial<CalendarDay>) {
    await this.repository.update(calendarDate, partial);
    return this.findByDate(calendarDate);
  }
}
