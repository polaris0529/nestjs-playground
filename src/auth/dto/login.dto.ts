import { IsNotEmpty, IsString } from 'class-validator';

// 로그인 요청 DTO
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
