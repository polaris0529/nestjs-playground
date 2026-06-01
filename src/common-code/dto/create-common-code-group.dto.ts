import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// 공통코드 그룹 생성 요청 DTO — 모든 필드 검증 강제
export class CreateCommonCodeGroupDto {
  // 그룹코드: 대문자로 시작, 영대문자/숫자/언더스코어만 허용 (식별자)
  @IsString()
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message:
      'groupCode 는 대문자로 시작하는 영대문자/숫자/_ 조합이어야 합니다.',
  })
  @MaxLength(30)
  groupCode: string;

  @IsString()
  @MaxLength(50)
  groupName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  // 사용여부: SELECTBOX 로 Y/N 만 선택
  @IsIn(['Y', 'N'])
  useYn: string;
}
