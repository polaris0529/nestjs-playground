import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

// 계정 수정 DTO — loginId(식별자)/비밀번호는 변경 불가, 이름·사용여부만 수정
export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  accountName?: string;

  @IsOptional()
  @IsIn(['Y', 'N'])
  useYn?: string;

  // 역할 변경 (선택) — ROLE_TYPE 공통코드
  @IsOptional()
  @IsIn(['ADMIN', 'USER'])
  roleCode?: string;
}
