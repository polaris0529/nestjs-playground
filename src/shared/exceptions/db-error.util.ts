import { BadRequestException, ConflictException } from '@nestjs/common';
import { I18nErrorMessage } from '../types/i18n-message';

// PostgreSQL 드라이버가 던지는 DB 제약 위반 에러의 최소 형태
interface DbError {
  code?: string;
}

// DB 제약 위반을 사용자 친화적 HTTP 예외로 변환한다.
// duplicate 는 i18n 키 문자열 또는 { key, args } (HttpErrorFilter 가 번역).
// 23505: unique 위반(중복), 23503: foreign key 위반(참조 대상 없음)
export function rethrowDbError(
  error: unknown,
  duplicate: string | I18nErrorMessage,
): never {
  const code = (error as DbError)?.code;
  if (code === '23505') {
    throw new ConflictException(duplicate);
  }
  if (code === '23503') {
    throw new BadRequestException('common.errors.bad_reference');
  }
  throw error;
}
