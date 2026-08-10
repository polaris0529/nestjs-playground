import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonCodeService } from './common-code.service';

@ApiTags('공통코드 조회')
@Controller('common-code')
export class CommonCodeReferenceController {
  constructor(private readonly commonCodeService: CommonCodeService) {}

  @Get('reference-codes')
  findByGroupCode(@Query('groupCode') groupCode?: string) {
    if (!groupCode) return [];
    return this.commonCodeService.findCodesByGroupCode(groupCode);
  }
}
