import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonCodeGroup } from './entities/common-code-group.entity';
import { CommonCode } from './entities/common-code.entity';
import { CreateCommonCodeGroupDto } from './dto/create-common-code-group.dto';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeGroupDto } from './dto/update-common-code-group.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';

// Infrastructure 계층: 공통코드 그룹/코드의 TypeORM 접근을 캡슐화한다.
@Injectable()
export class CommonCodeRepository {
  constructor(
    @InjectRepository(CommonCodeGroup)
    private readonly groupRepository: Repository<CommonCodeGroup>,
    @InjectRepository(CommonCode)
    private readonly codeRepository: Repository<CommonCode>,
  ) {}

  // ── 그룹 ──────────────────────────────────────────────
  createGroup(dto: CreateCommonCodeGroupDto) {
    const group = this.groupRepository.create(dto);
    return this.groupRepository.save(group);
  }

  findAllGroups() {
    return this.groupRepository.find({ order: { groupCode: 'ASC' } });
  }

  findGroupById(codeGroupId: number) {
    return this.groupRepository.findOneBy({ codeGroupId });
  }

  async updateGroup(codeGroupId: number, dto: UpdateCommonCodeGroupDto) {
    await this.groupRepository.update(codeGroupId, dto);
    return this.findGroupById(codeGroupId);
  }

  removeGroup(codeGroupId: number) {
    return this.groupRepository.delete(codeGroupId);
  }

  // ── 코드 ──────────────────────────────────────────────
  createCode(dto: CreateCommonCodeDto) {
    const code = this.codeRepository.create(dto);
    return this.codeRepository.save(code);
  }

  // 전체 코드 (그룹 정보 포함) — 관리 목록용
  findAllCodes() {
    return this.codeRepository.find({
      relations: { codeGroup: true },
      order: { codeGroupId: 'ASC', sortOrder: 'ASC' },
    });
  }

  // 그룹코드(MENU_TYPE 등) 기준으로 사용중(Y)인 코드를 정렬 조회 — SELECTBOX 용
  findCodesByGroupCode(groupCode: string) {
    return this.codeRepository.find({
      where: { codeGroup: { groupCode }, useYn: 'Y' },
      order: { sortOrder: 'ASC' },
    });
  }

  findCodeById(codeId: number) {
    return this.codeRepository.findOneBy({ codeId });
  }

  async updateCode(codeId: number, dto: UpdateCommonCodeDto) {
    await this.codeRepository.update(codeId, dto);
    return this.findCodeById(codeId);
  }

  removeCode(codeId: number) {
    return this.codeRepository.delete(codeId);
  }
}
