import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// 공통코드 수정 DTO — code/codeGroupId(식별자)는 변경 불가, 나머지만 선택적 수정
export class UpdateCommonCodeDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codeName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  sortOrder?: number;

  @IsOptional()
  @IsIn(['Y', 'N'])
  useYn?: string;
}
