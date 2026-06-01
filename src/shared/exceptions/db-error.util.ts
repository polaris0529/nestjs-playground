import { BadRequestException, ConflictException } from '@nestjs/common';

// PostgreSQL 드라이버가 던지는 DB 제약 위반 에러의 최소 형태
interface DbError {
  code?: string;
}

// DB 제약 위반을 사용자 친화적 HTTP 예외로 변환한다.
// 23505: unique 위반(중복), 23503: foreign key 위반(참조 대상 없음)
export function rethrowDbError(
  error: unknown,
  duplicateMessage: string,
): never {
  const code = (error as DbError)?.code;
  if (code === '23505') {
    throw new ConflictException(duplicateMessage);
  }
  if (code === '23503') {
    throw new BadRequestException('참조하는 대상이 존재하지 않습니다.');
  }
  throw error;
}
