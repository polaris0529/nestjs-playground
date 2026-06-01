import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService, AuthTokens } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

// Presentation 계층: 인증(로그인/리프레시/로그아웃/현재 사용자) API
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // access/refresh 토큰을 httpOnly 쿠키로 저장
  private setAuthCookies(res: Response, tokens: AuthTokens): void {
    const secure = this.config.get<string>('env') === 'production';
    res.cookie(ACCESS_COOKIE, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      maxAge: (this.config.get<number>('jwt.accessExpiresIn') ?? 1800) * 1000,
    });
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      maxAge:
        (this.config.get<number>('jwt.refreshExpiresIn') ?? 604800) * 1000,
    });
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.setAuthCookies(res, tokens);
    return { loginId: tokens.loginId, roles: tokens.roles };
  }

  // 토큰 회전 (access 만료 시 클라이언트가 호출)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refresh(
      req.cookies?.refresh_token as string | undefined,
    );
    this.setAuthCookies(res, tokens);
    return { loginId: tokens.loginId, roles: tokens.roles };
  }

  // 로그아웃 → 쿠키 제거 후 로그인 페이지로 이동 (헤더 폼 POST)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie(ACCESS_COOKIE);
    res.clearCookie(REFRESH_COOKIE);
    res.redirect('/login');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
