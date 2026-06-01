import { I18nService } from 'nestjs-i18n';
import { HttpErrorFilter } from './http-error.filter';

describe('HttpErrorFilter', () => {
  it('should be defined', () => {
    const i18n = {
      translate: (key: string) => key,
    } as unknown as I18nService;
    expect(new HttpErrorFilter(i18n)).toBeDefined();
  });
});
