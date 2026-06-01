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

// 메뉴 생성 요청 DTO — 모든 필드 검증 강제
// menuLevel 은 클라이언트 입력을 신뢰하지 않고 서버에서 상위 메뉴 기준으로 계산한다.
export class CreateMenuDto {
  // 상위 메뉴: SELECTBOX 로 선택, 최상위면 미지정(null)
  @IsOptional()
  @IsInt()
  @IsPositive()
  parentMenuId?: number;

  // 메뉴코드: 대문자로 시작, 영대문자/숫자/_ 조합 (식별자)
  @IsString()
  @Matches(/^[A-Z][A-Z0-9_]*$/, {
    message: 'menuCode 는 대문자로 시작하는 영대문자/숫자/_ 조합이어야 합니다.',
  })
  @MaxLength(30)
  menuCode: string;

  @IsString()
  @MaxLength(50)
  menuName: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  menuUrl?: string;

  // 메뉴유형: SELECTBOX (MENU_TYPE 공통코드)
  @IsString()
  @MaxLength(30)
  menuType: string;

  // 열기방식: SELECTBOX (OPEN_TYPE 공통코드), 폴더 등은 미지정 가능
  @IsOptional()
  @IsString()
  @MaxLength(30)
  openType?: string;

  @IsInt()
  @Min(0)
  @Max(9999)
  sortOrder: number;

  // 사용여부: SELECTBOX 로 Y/N 만 선택
  @IsIn(['Y', 'N'])
  useYn: string;
}
