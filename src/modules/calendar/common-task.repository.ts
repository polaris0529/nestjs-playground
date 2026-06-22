import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonTask } from './entities/common-task.entity';

@Injectable()
export class CommonTaskRepository {
  constructor(
    @InjectRepository(CommonTask)
    private readonly repository: Repository<CommonTask>,
  ) {}

  findByRange(startDate: string, endDate: string) {
    return this.repository
      .createQueryBuilder('task')
      .where('task.calendar_date >= :startDate', { startDate })
      .andWhere('task.calendar_date < :endDate', { endDate })
      .andWhere('task.is_deleted = false')
      .orderBy('task.calendar_date', 'ASC')
      .addOrderBy('task.start_time', 'ASC')
      .addOrderBy('task.created_at', 'ASC')
      .getMany();
  }

  findById(commonTaskId: string) {
    return this.repository.findOneBy({ commonTaskId, isDeleted: false });
  }

  create(task: Partial<CommonTask>) {
    const entity = this.repository.create(task);
    return this.repository.save(entity);
  }

  async update(commonTaskId: string, partial: Partial<CommonTask>) {
    await this.repository.update(commonTaskId, partial);
    return this.repository.findOneBy({ commonTaskId });
  }

  softRemove(commonTaskId: string) {
    return this.repository.update(commonTaskId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}
