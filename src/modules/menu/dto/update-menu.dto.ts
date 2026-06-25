import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// 메뉴 수정 DTO — menuCode 는 변경 불가. parentMenuId 는 0(최상위) 또는 양수(하위 이동) 허용.
export class UpdateMenuDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  parentMenuId?: number;

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
