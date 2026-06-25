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
import { RolesGuard } from '../../shared/guards/roles-auth.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthUser } from '../../shared/types/auth.types';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('계정')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // 내 비밀번호 변경 (인증된 사용자 누구나 — @Roles 없으므로 RolesGuard 통과)
  @Patch('me/password')
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as AuthUser;
    return this.accountService.changePassword(user.accountId, dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountService.update(+id, dto);
  }

  // 비활성화 (소프트 삭제)
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.accountService.deactivate(+id);
  }
}
