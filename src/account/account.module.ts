import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountRole } from './entities/account-role.entity';
import { CommonCode } from '../common-code/entities/common-code.entity';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountRole, CommonCode])],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
