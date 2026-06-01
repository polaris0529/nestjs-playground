import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// 메뉴 수정 DTO — menuCode/parentMenuId(구조)는 변경 불가, 나머지만 선택적 수정
export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  menuName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  menuUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  menuType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  openType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  sortOrder?: number;

  @IsOptional()
  @IsIn(['Y', 'N'])
  useYn?: string;
}
