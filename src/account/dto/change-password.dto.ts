import { IsString, MaxLength, MinLength } from 'class-validator';

// 비밀번호 변경 DTO (셀프 서비스)
export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword: string;
}
