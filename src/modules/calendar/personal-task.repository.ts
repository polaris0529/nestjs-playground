import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalTask } from './entities/personal-task.entity';

@Injectable()
export class PersonalTaskRepository {
  constructor(
    @InjectRepository(PersonalTask)
    private readonly repository: Repository<PersonalTask>,
  ) {}

  findByRange(userId: number, startDate: string, endDate: string) {
    return this.repository
      .createQueryBuilder('task')
      .where('task.user_id = :userId', { userId })
      .andWhere('task.calendar_date >= :startDate', { startDate })
      .andWhere('task.calendar_date < :endDate', { endDate })
      .andWhere('task.is_deleted = false')
      .orderBy('task.calendar_date', 'ASC')
      .addOrderBy('task.start_time', 'ASC')
      .addOrderBy('task.created_at', 'ASC')
      .getMany();
  }

  findByIdForUser(personalTaskId: string, userId: number) {
    return this.repository.findOneBy({
      personalTaskId,
      userId,
      isDeleted: false,
    });
  }

  create(task: Partial<PersonalTask>) {
    const entity = this.repository.create(task);
    return this.repository.save(entity);
  }

  async update(personalTaskId: string, partial: Partial<PersonalTask>) {
    await this.repository.update(personalTaskId, partial);
    return this.repository.findOneBy({ personalTaskId });
  }

  softRemove(personalTaskId: string) {
    return this.repository.update(personalTaskId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}
