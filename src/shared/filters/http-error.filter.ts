import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class HttpErrorFilter<T> implements ExceptionFilter {
  // 예외 필터 미구현(architecture-checklist 2-1). 구현 시 통일 에러 응답을 반환한다.
  catch(_exception: T, _host: ArgumentsHost) {}
}
