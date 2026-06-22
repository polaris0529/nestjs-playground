import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional } from 'class-validator';
import { CreatePersonalTaskDto } from './create-personal-task.dto';

export class UpdatePersonalTaskDto extends PartialType(CreatePersonalTaskDto) {
  @IsOptional()
  @IsDateString()
  completedAt?: string | null;
}
