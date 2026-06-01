import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// 공통코드 생성 요청 DTO — 모든 필드 검증 강제
export class CreateCommonCodeDto {
  // 소속 그룹: SELECTBOX 로 기존 그룹 id 선택
  @IsInt()
  @IsPositive()
  codeGroupId: number;

  // 코드값: 대문자로 시작, 영대문자/숫자/_ 조합 (식별자)
  @IsString()
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'code 는 대문자로 시작하는 영대문자/숫자/_ 조합이어야 합니다.',
  })
  @MaxLength(30)
  code: string;

  @IsString()
  @MaxLength(50)
  codeName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsInt()
  @Min(0)
  @Max(9999)
  sortOrder: number;

  // 사용여부: SELECTBOX 로 Y/N 만 선택
  @IsIn(['Y', 'N'])
  useYn: string;
}
