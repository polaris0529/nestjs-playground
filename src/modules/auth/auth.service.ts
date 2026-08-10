import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from '../account/account.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../shared/types/auth.types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  loginId: string;
  roles: string[];
}

// Application 계층: 자격증명 검증 후 access/refresh JWT 를 발급·회전한다(별도 auth 테이블 없이 account 기반).
@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // 로그인: 자격증명 검증 → lastLogin 갱신 → 토큰 발급
  async login(dto: LoginDto): Promise<AuthTokens> {
    const account = await this.accountService.findByLoginId(dto.loginId);
    if (!account || account.useYn !== 'Y') {
      throw new UnauthorizedException('auth.errors.invalid_credentials');
    }
    const matched = await bcrypt.compare(dto.password, account.password);
    if (!matched) {
      throw new UnauthorizedException('auth.errors.invalid_credentials');
    }

    await this.accountService.updateLastLogin(account.accountId);
    const roles = (account.roles ?? []).map((r) => r.roleCode.code);
    return this.issueTokens(account.accountId, account.loginId, roles);
  }

  // 리프레시: refresh 토큰 검증 → 계정 재조회(최신 역할) → 토큰 회전
  async refresh(refreshToken: string | undefined): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('auth.errors.refresh_missing');
    }
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('auth.errors.refresh_invalid');
    }

    const account = await this.accountService.findByLoginId(payload.loginId);
    if (!account || account.useYn !== 'Y') {
      throw new UnauthorizedException('auth.errors.inactive_account');
    }
    const roles = (account.roles ?? []).map((r) => r.roleCode.code);
    return this.issueTokens(account.accountId, account.loginId, roles);
  }

  // access(단기) + refresh(장기) 토큰 동시 발급
  private async issueTokens(
    sub: number,
    loginId: string,
    roles: string[],
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub, loginId, roles };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.secret'),
      expiresIn: this.config.getOrThrow<number>('jwt.accessExpiresIn'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: this.config.getOrThrow<number>('jwt.refreshExpiresIn'),
    });
    return { accessToken, refreshToken, loginId, roles };
  }
}
