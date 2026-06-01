import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from '../account/account.service';
import { LoginDto } from './dto/login.dto';

// Application 계층: 자격증명 검증 후 JWT 를 발급한다(별도 auth 테이블 없이 account 기반).
@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  // 로그인: 계정 검증 → lastLogin 갱신 → JWT 발급
  async login(dto: LoginDto) {
    const account = await this.accountService.findByLoginId(dto.loginId);
    if (!account || account.useYn !== 'Y') {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const matched = await bcrypt.compare(dto.password, account.password);
    if (!matched) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const roles = (account.roles ?? []).map((r) => r.roleCode.code);
    await this.accountService.updateLastLogin(account.accountId);

    const payload = {
      sub: account.accountId,
      loginId: account.loginId,
      roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      loginId: account.loginId,
      roles,
    };
  }
}
