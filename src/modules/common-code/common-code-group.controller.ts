import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { CreateCommonCodeGroupDto } from './dto/create-common-code-group.dto';
import { UpdateCommonCodeGroupDto } from './dto/update-common-code-group.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles-auth.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

// Presentation 계층: 공통코드 그룹 리소스 REST API (관리자 전용)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('공통코드 그룹')
@Controller('common-code-groups')
export class CommonCodeGroupController {
  constructor(private readonly commonCodeService: CommonCodeService) {}

  // 그룹 목록 조회 (공통코드 생성 화면 SELECTBOX 용)
  @Get()
  findAll() {
    return this.commonCodeService.findAllGroups();
  }

  // 그룹 단건 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonCodeService.findGroup(+id);
  }

  // 그룹 생성
  @Post()
  create(@Body() dto: CreateCommonCodeGroupDto) {
    return this.commonCodeService.createGroup(dto);
  }

  // 그룹 수정
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommonCodeGroupDto) {
    return this.commonCodeService.updateGroup(+id, dto);
  }

  // 그룹 삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonCodeService.removeGroup(+id);
  }
}
