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
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

const ACCESS_TOKEN_COOKIE = 'access_token';

// Presentation 계층: 인증(로그인/로그아웃/현재 사용자) API
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // 로그인 → JWT 를 httpOnly 쿠키에 저장하고 본문으로도 반환
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    const maxAge = (this.config.get<number>('jwt.expiresIn') ?? 86400) * 1000;
    res.cookie(ACCESS_TOKEN_COOKIE, result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get<string>('env') === 'production',
      maxAge,
    });
    return result;
  }

  // 로그아웃 → 쿠키 제거 후 로그인 페이지로 이동 (헤더 폼 POST)
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.redirect('/login');
  }

  // 현재 토큰의 사용자 정보 (보호 라우트)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }
}
