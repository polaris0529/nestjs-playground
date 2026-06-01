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

  findAll() {
    return this.accountRepository.find({
      relations: { roles: { roleCode: true } },
      order: { accountId: 'ASC' },
    });
  }

  findById(accountId: number) {
    return this.accountRepository.findOne({
      where: { accountId },
      relations: { roles: { roleCode: true } },
    });
  }

  countAll() {
    return this.accountRepository.count();
  }

  countActive() {
    return this.accountRepository.count({ where: { useYn: 'Y' } });
  }

  async update(accountId: number, partial: Partial<Account>) {
    await this.accountRepository.update(accountId, partial);
    return this.findById(accountId);
  }

  addRole(accountId: number, roleCodeId: number) {
    const role = this.accountRoleRepository.create({ accountId, roleCodeId });
    return this.accountRoleRepository.save(role);
  }

  // 기존 역할을 모두 제거하고 새 역할로 교체한다.
  async replaceRole(accountId: number, roleCodeId: number) {
    await this.accountRoleRepository.delete({ accountId });
    return this.addRole(accountId, roleCodeId);
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
