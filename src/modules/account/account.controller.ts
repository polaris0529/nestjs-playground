import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthUser } from '../../shared/types/auth.types';

// Presentation 계층: 계정 리소스 REST API
// 컨트롤러 전체 인증 필수. 계정 관리(목록/생성/수정/삭제)는 ADMIN 전용, 비밀번호 변경은 본인.
@UseGuards(JwtAuthGuard)
@ApiTags('계정')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // 내 비밀번호 변경 (인증된 사용자 누구나)
  @Patch('me/password')
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as AuthUser;
    return this.accountService.changePassword(user.accountId, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountService.update(+id, dto);
  }

  // 비활성화 (소프트 삭제)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.accountService.deactivate(+id);
  }
}
