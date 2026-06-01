import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { rethrowDbError } from '../shared/exceptions/db-error.util';

const SALT_ROUNDS = 10;

// Application 계층: 계정 비즈니스 흐름(비밀번호 해싱·역할 부여)을 담당한다.
@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  // 계정 생성: 비밀번호를 bcrypt 로 해싱해 저장하고 역할을 부여한다.
  async create(dto: CreateAccountDto) {
    const roleCodeId = await this.accountRepository.findRoleCodeId(
      dto.roleCode,
    );
    if (!roleCodeId) {
      throw new BadRequestException(
        `존재하지 않는 역할입니다: ${dto.roleCode}`,
      );
    }

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);

    let account: Account;
    try {
      account = await this.accountRepository.create({
        loginId: dto.loginId,
        password: hashed,
        accountName: dto.accountName,
        useYn: dto.useYn,
      });
    } catch (error) {
      rethrowDbError(error, `이미 존재하는 로그인 ID 입니다: ${dto.loginId}`);
    }

    await this.accountRepository.addRole(account.accountId, roleCodeId);

    // 응답에서 비밀번호 해시는 제외한다.
    return {
      accountId: account.accountId,
      loginId: account.loginId,
      accountName: account.accountName,
      useYn: account.useYn,
      roleCode: dto.roleCode,
    };
  }

  // 인증용: 로그인 ID 로 역할 포함 계정 조회
  findByLoginId(loginId: string) {
    return this.accountRepository.findByLoginId(loginId);
  }

  updateLastLogin(accountId: number) {
    return this.accountRepository.updateLastLogin(accountId);
  }
}
