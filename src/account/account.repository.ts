import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { AccountRole } from './entities/account-role.entity';
import { CommonCode } from '../common-code/entities/common-code.entity';

// Infrastructure 계층: 계정/계정권한/역할코드 조회의 TypeORM 접근을 캡슐화한다.
@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(AccountRole)
    private readonly accountRoleRepository: Repository<AccountRole>,
    @InjectRepository(CommonCode)
    private readonly codeRepository: Repository<CommonCode>,
  ) {}

  create(account: Partial<Account>) {
    const entity = this.accountRepository.create(account);
    return this.accountRepository.save(entity);
  }

  // 로그인/중복확인용: 역할 코드까지 함께 로드
  findByLoginId(loginId: string) {
    return this.accountRepository.findOne({
      where: { loginId },
      relations: { roles: { roleCode: true } },
    });
  }

  addRole(accountId: number, roleCodeId: number) {
    const role = this.accountRoleRepository.create({ accountId, roleCodeId });
    return this.accountRoleRepository.save(role);
  }

  // ROLE_TYPE 그룹의 코드값(ADMIN/USER)으로 common_code id 를 해석한다.
  async findRoleCodeId(code: string): Promise<number | null> {
    const found = await this.codeRepository.findOne({
      where: { code, codeGroup: { groupCode: 'ROLE_TYPE' } },
    });
    return found ? Number(found.codeId) : null;
  }

  updateLastLogin(accountId: number) {
    return this.accountRepository.update(accountId, {
      lastLoginAt: new Date(),
    });
  }
}
