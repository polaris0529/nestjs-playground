import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Account } from './entities/account.entity';
import { rethrowDbError } from '../shared/exceptions/db-error.util';

const SALT_ROUNDS = 10;

// 비밀번호 해시를 제외한 계정 응답 형태로 변환
function toView(account: Account) {
  return {
    accountId: account.accountId,
    loginId: account.loginId,
    accountName: account.accountName,
    useYn: account.useYn,
    lastLoginAt: account.lastLoginAt,
    roles: (account.roles ?? []).map((r) => r.roleCode?.code).filter(Boolean),
  };
}

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

  async findAll() {
    const accounts = await this.accountRepository.findAll();
    return accounts.map(toView);
  }

  // 대시보드 통계: 전체/활성 계정 수
  async getStats() {
    const [total, active] = await Promise.all([
      this.accountRepository.countAll(),
      this.accountRepository.countActive(),
    ]);
    return { total, active };
  }

  async findOne(id: number) {
    const account = await this.accountRepository.findById(id);
    if (!account) throw new NotFoundException('존재하지 않는 계정입니다.');
    return toView(account);
  }

  async update(id: number, dto: UpdateAccountDto) {
    const account = await this.accountRepository.findById(id);
    if (!account) throw new NotFoundException('존재하지 않는 계정입니다.');
    const updated = await this.accountRepository.update(id, dto);
    return toView(updated!);
  }

  // 계정 비활성화 (소프트 삭제: useYn = 'N')
  async deactivate(id: number) {
    const account = await this.accountRepository.findById(id);
    if (!account) throw new NotFoundException('존재하지 않는 계정입니다.');
    await this.accountRepository.update(id, { useYn: 'N' });
    return { accountId: id, useYn: 'N' };
  }

  // 비밀번호 변경 (셀프): 현재 비밀번호 검증 후 새 비밀번호 해싱
  async changePassword(accountId: number, dto: ChangePasswordDto) {
    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new NotFoundException('존재하지 않는 계정입니다.');
    const matched = await bcrypt.compare(dto.currentPassword, account.password);
    if (!matched) {
      throw new UnauthorizedException('현재 비밀번호가 올바르지 않습니다.');
    }
    const hashed = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.accountRepository.update(accountId, { password: hashed });
    return { accountId, changed: true };
  }
}
