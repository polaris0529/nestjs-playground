import appConfig from './app.config';

describe('appConfig', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalJwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  const originalAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
  const originalRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalLogLevel = process.env.LOG_LEVEL;

  afterEach(() => {
    restoreEnv('JWT_SECRET', originalJwtSecret);
    restoreEnv('JWT_REFRESH_SECRET', originalJwtRefreshSecret);
    restoreEnv('JWT_ACCESS_EXPIRES_IN', originalAccessExpiresIn);
    restoreEnv('JWT_REFRESH_EXPIRES_IN', originalRefreshExpiresIn);
    restoreEnv('NODE_ENV', originalNodeEnv);
    restoreEnv('LOG_LEVEL', originalLogLevel);
  });

  beforeEach(() => {
    process.env.JWT_SECRET = 'access-secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '1800';
    process.env.JWT_REFRESH_EXPIRES_IN = '604800';
  });

  it('parses configuration values as their intended types', () => {
    process.env.NODE_ENV = 'production';
    process.env.LOG_LEVEL = 'warn';
    const config = appConfig();

    expect(config.env).toBe('production');
    expect(config.logLevel).toBe('warn');
    expect(config.jwt.secret).toBe('access-secret');
    expect(config.jwt.accessExpiresIn).toBe(1800);
    expect(config.jwt.refreshExpiresIn).toBe(604800);
  });

  it('throws when a required string value is missing', () => {
    delete process.env.JWT_SECRET;

    expect(() => appConfig()).toThrow('JWT_SECRET is required');
  });

  it('throws when a required JWT expiration value is missing', () => {
    delete process.env.JWT_ACCESS_EXPIRES_IN;

    expect(() => appConfig()).toThrow('JWT_ACCESS_EXPIRES_IN is required');
  });

  it('throws when a required JWT expiration value is not numeric', () => {
    process.env.JWT_ACCESS_EXPIRES_IN = 'abc';

    expect(() => appConfig()).toThrow('JWT_ACCESS_EXPIRES_IN must be a number');
  });

  it('throws when an enum value is outside the allowed set', () => {
    process.env.LOG_LEVEL = 'trace';

    expect(() => appConfig()).toThrow(
      'LOG_LEVEL must be one of: debug, log, warn, error',
    );
  });
});

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
