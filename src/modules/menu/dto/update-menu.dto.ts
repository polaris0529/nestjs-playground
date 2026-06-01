import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

// 메뉴 수정 DTO — menuCode 는 변경 불가. parentMenuId 는 number(이동) 또는 null(최상위) 허용.
export class UpdateMenuDto {
  @IsOptional()
  @ValidateIf((o: UpdateMenuDto) => o.parentMenuId !== null)
  @IsInt()
  @IsPositive()
  parentMenuId?: number | null;

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
