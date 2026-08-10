import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService, AuthTokens } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  const tokens: AuthTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    loginId: 'admin',
    roles: ['ADMIN'],
  };

  let controller: AuthController;
  let authService: { login: jest.Mock; refresh: jest.Mock };

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue(tokens),
      refresh: jest.fn().mockResolvedValue(tokens),
    };

    const configValues = new Map<string, string | number>([
      ['cookie.accessName', 'access_token'],
      ['cookie.refreshName', 'refresh_token'],
      ['jwt.accessExpiresIn', 1800],
      ['jwt.refreshExpiresIn', 604800],
      ['env', 'production'],
    ]);

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              const value = configValues.get(key);
              if (value === undefined) {
                throw new Error(`${key} is required`);
              }
              return value;
            }),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
  });

  it('sets secure httpOnly auth cookies on login', async () => {
    const dto: LoginDto = { loginId: 'admin', password: 'password' };
    const { response, cookie } = createResponseMock();

    await controller.login(dto, response);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(cookie).toHaveBeenNthCalledWith(1, 'access_token', 'access-token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 1800000,
    });
    expect(cookie).toHaveBeenNthCalledWith(
      2,
      'refresh_token',
      'refresh-token',
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 604800000,
      },
    );
  });

  it('clears auth cookies with the same cookie scope on logout', () => {
    const { response, clearCookie, redirect } = createResponseMock();

    controller.logout(response);

    expect(clearCookie).toHaveBeenNthCalledWith(1, 'access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });
    expect(clearCookie).toHaveBeenNthCalledWith(2, 'refresh_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});

function createResponseMock(): {
  response: Response;
  cookie: jest.Mock;
  clearCookie: jest.Mock;
  redirect: jest.Mock;
} {
  const cookie = jest.fn();
  const clearCookie = jest.fn();
  const redirect = jest.fn();

  return {
    response: {
      cookie,
      clearCookie,
      redirect,
    } as unknown as Response,
    cookie,
    clearCookie,
    redirect,
  };
}
