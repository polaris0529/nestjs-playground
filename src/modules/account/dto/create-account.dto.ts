import { IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';

// 계정 생성 요청 DTO — 모든 필드 검증 강제
export class CreateAccountDto {
  // 로그인 ID: 영문/숫자/_ 3~30자
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,30}$/, {
    message: 'loginId 는 영문/숫자/_ 3~30자여야 합니다.',
  })
  loginId: string;

  // 비밀번호: 8~72자 (bcrypt 입력 한계 72바이트)
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsString()
  @MaxLength(30)
  accountName: string;

  // 역할: SELECTBOX (ROLE_TYPE 공통코드) — 관리자/일반유저
  @IsIn(['ADMIN', 'USER'])
  roleCode: string;

  @IsIn(['Y', 'N'])
  useYn: string;
}
