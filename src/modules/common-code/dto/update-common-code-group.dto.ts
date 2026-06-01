import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

// 공통코드 그룹 수정 DTO — groupCode(식별자)는 변경 불가, 나머지만 선택적 수정
export class UpdateCommonCodeGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  groupName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsIn(['Y', 'N'])
  useYn?: string;
}
