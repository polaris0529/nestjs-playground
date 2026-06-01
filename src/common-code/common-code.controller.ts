import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

// Presentation 계층: 공통코드 리소스 REST API (관리자 전용)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('common-codes')
export class CommonCodeController {
  constructor(private readonly commonCodeService: CommonCodeService) {}

  // 목록 조회: groupCode 가 있으면 해당 그룹의 사용중 코드(SELECTBOX용),
  // 없으면 전체 코드(관리 목록용)를 반환한다.
  @Get()
  findAll(@Query('groupCode') groupCode?: string) {
    return groupCode
      ? this.commonCodeService.findCodesByGroupCode(groupCode)
      : this.commonCodeService.findAllCodes();
  }

  // 코드 단건 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonCodeService.findCode(+id);
  }

  // 코드 생성
  @Post()
  create(@Body() dto: CreateCommonCodeDto) {
    return this.commonCodeService.createCode(dto);
  }

  // 코드 수정
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommonCodeDto) {
    return this.commonCodeService.updateCode(+id, dto);
  }

  // 코드 삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonCodeService.removeCode(+id);
  }
}
