import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCodeGroup } from './entities/common-code-group.entity';
import { CommonCode } from './entities/common-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommonCodeGroup, CommonCode])],
})
export class CommonCodeModule {}
