import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class HttpErrorFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
