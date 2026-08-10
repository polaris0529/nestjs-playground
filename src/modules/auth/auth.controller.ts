import { ApiTags } from '@nestjs/swagger';
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
import { CookieOptions, Request, Response } from 'express';
import { AuthService, AuthTokens } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  private readonly accessCookieName: string;
  private readonly refreshCookieName: string;
  private readonly accessCookieMaxAgeMs: number;
  private readonly refreshCookieMaxAgeMs: number;
  private readonly secureCookie: boolean;

  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    this.accessCookieName = config.getOrThrow<string>('cookie.accessName');
    this.refreshCookieName = config.getOrThrow<string>('cookie.refreshName');
    this.accessCookieMaxAgeMs =
      config.getOrThrow<number>('jwt.accessExpiresIn') * 1000;
    this.refreshCookieMaxAgeMs =
      config.getOrThrow<number>('jwt.refreshExpiresIn') * 1000;
    this.secureCookie = config.getOrThrow<string>('env') === 'production';
  }

  // access/refresh 토큰을 httpOnly 쿠키로 저장
  private setAuthCookies(res: Response, tokens: AuthTokens): void {
    res.cookie(this.accessCookieName, tokens.accessToken, {
      ...this.authCookieOptions(),
      maxAge: this.accessCookieMaxAgeMs,
    });
    res.cookie(this.refreshCookieName, tokens.refreshToken, {
      ...this.authCookieOptions(),
      maxAge: this.refreshCookieMaxAgeMs,
    });
  }

  private authCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.secureCookie,
      path: '/',
    };
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
      req.cookies?.[this.refreshCookieName] as string | undefined,
    );
    this.setAuthCookies(res, tokens);
    return { loginId: tokens.loginId, roles: tokens.roles };
  }

  // 로그아웃 → 쿠키 제거 후 Vue 로그인 라우트로 이동
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie(this.accessCookieName, this.authCookieOptions());
    res.clearCookie(this.refreshCookieName, this.authCookieOptions());
    res.redirect('/login');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
