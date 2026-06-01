import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCodeGroup } from './entities/common-code-group.entity';
import { CommonCode } from './entities/common-code.entity';
import { CommonCodeService } from './common-code.service';
import { CommonCodeRepository } from './common-code.repository';
import { CommonCodeGroupController } from './common-code-group.controller';
import { CommonCodeController } from './common-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommonCodeGroup, CommonCode])],
  controllers: [CommonCodeGroupController, CommonCodeController],
  providers: [CommonCodeService, CommonCodeRepository],
})
export class CommonCodeModule {}
