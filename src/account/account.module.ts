import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountRole } from './entities/account-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountRole])],
})
export class AccountModule {}
