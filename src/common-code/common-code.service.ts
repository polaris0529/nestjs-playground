import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonCodeRepository } from './common-code.repository';
import { CreateCommonCodeGroupDto } from './dto/create-common-code-group.dto';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeGroupDto } from './dto/update-common-code-group.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';
import { rethrowDbError } from '../shared/exceptions/db-error.util';

// Application 계층: 공통코드 비즈니스 흐름을 담당하고 영속화는 Repository 에 위임한다.
@Injectable()
export class CommonCodeService {
  constructor(private readonly commonCodeRepository: CommonCodeRepository) {}

  async createGroup(dto: CreateCommonCodeGroupDto) {
    try {
      return await this.commonCodeRepository.createGroup(dto);
    } catch (error) {
      rethrowDbError(error, `이미 존재하는 그룹코드입니다: ${dto.groupCode}`);
    }
  }

  findAllGroups() {
    return this.commonCodeRepository.findAllGroups();
  }

  async findGroup(id: number) {
    const group = await this.commonCodeRepository.findGroupById(id);
    if (!group) throw new NotFoundException('존재하지 않는 그룹입니다.');
    return group;
  }

  async updateGroup(id: number, dto: UpdateCommonCodeGroupDto) {
    await this.findGroup(id);
    return this.commonCodeRepository.updateGroup(id, dto);
  }

  async removeGroup(id: number) {
    await this.findGroup(id);
    try {
      return await this.commonCodeRepository.removeGroup(id);
    } catch (error) {
      rethrowDbError(error, '사용 중인 그룹입니다.');
    }
  }

  async createCode(dto: CreateCommonCodeDto) {
    try {
      return await this.commonCodeRepository.createCode(dto);
    } catch (error) {
      rethrowDbError(
        error,
        `해당 그룹에 이미 존재하는 코드입니다: ${dto.code}`,
      );
    }
  }

  findAllCodes() {
    return this.commonCodeRepository.findAllCodes();
  }

  findCodesByGroupCode(groupCode: string) {
    return this.commonCodeRepository.findCodesByGroupCode(groupCode);
  }

  async findCode(id: number) {
    const code = await this.commonCodeRepository.findCodeById(id);
    if (!code) throw new NotFoundException('존재하지 않는 코드입니다.');
    return code;
  }

  async updateCode(id: number, dto: UpdateCommonCodeDto) {
    await this.findCode(id);
    return this.commonCodeRepository.updateCode(id, dto);
  }

  async removeCode(id: number) {
    await this.findCode(id);
    try {
      return await this.commonCodeRepository.removeCode(id);
    } catch (error) {
      rethrowDbError(error, '사용 중인 코드입니다.');
    }
  }
}
