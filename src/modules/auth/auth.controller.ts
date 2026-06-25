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
import { Request, Response } from 'express';
import { AuthService, AuthTokens } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  private readonly accessCookieName: string;
  private readonly refreshCookieName: string;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.accessCookieName =
      config.get<string>('cookie.accessName') ?? 'access_token';
    this.refreshCookieName =
      config.get<string>('cookie.refreshName') ?? 'refresh_token';
  }

  // access/refresh 토큰을 httpOnly 쿠키로 저장
  private setAuthCookies(res: Response, tokens: AuthTokens): void {
    const secure = this.config.get<string>('env') === 'production';
    res.cookie(this.accessCookieName, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      maxAge: (this.config.get<number>('jwt.accessExpiresIn') ?? 1800) * 1000,
    });
    res.cookie(this.refreshCookieName, tokens.refreshToken, {
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
      req.cookies?.[this.refreshCookieName] as string | undefined,
    );
    this.setAuthCookies(res, tokens);
    return { loginId: tokens.loginId, roles: tokens.roles };
  }

  // 로그아웃 → 쿠키 제거 후 로그인 페이지로 이동 (헤더 폼 POST)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie(this.accessCookieName);
    res.clearCookie(this.refreshCookieName);
    res.redirect('/login');
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
