import { PartialType } from '@nestjs/mapped-types';
import { CreateCommonTaskDto } from './create-common-task.dto';

export class UpdateCommonTaskDto extends PartialType(CreateCommonTaskDto) {}
