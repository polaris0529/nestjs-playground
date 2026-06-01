import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from '../account/account.service';
import { LoginDto } from './dto/login.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  loginId: string;
  roles: string[];
}

interface TokenPayload {
  sub: number;
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

    await this.accountService.updateLastLogin(account.accountId);
    const roles = (account.roles ?? []).map((r) => r.roleCode.code);
    return this.issueTokens(account.accountId, account.loginId, roles);
  }

  // 리프레시: refresh 토큰 검증 → 계정 재조회(최신 역할) → 토큰 회전
  async refresh(refreshToken: string | undefined): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }
    let payload: TokenPayload;
    try {
      payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const account = await this.accountService.findByLoginId(payload.loginId);
    if (!account || account.useYn !== 'Y') {
      throw new UnauthorizedException('비활성 계정입니다.');
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
    const payload: TokenPayload = { sub, loginId, roles };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('jwt.secret'),
      expiresIn: this.config.get<number>('jwt.accessExpiresIn'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<number>('jwt.refreshExpiresIn'),
    });
    return { accessToken, refreshToken, loginId, roles };
  }
}
