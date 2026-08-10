type RequestOptions = RequestInit & {
  retryOnUnauthorized?: boolean;
};

function readCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1] ?? null
  );
}

function withCsrfHeaders(options: RequestOptions): RequestOptions {
  const method = options.method?.toUpperCase() ?? 'GET';
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return options;

  const csrfToken = readCookie('csrf_token');
  if (!csrfToken) return options;
  const headers = new Headers(options.headers);
  headers.set('X-CSRF-Token', decodeURIComponent(csrfToken));

  return {
    ...options,
    headers,
  };
}

async function refreshSession(): Promise<boolean> {
  const response = await fetch(
    '/api/auth/refresh',
    withCsrfHeaders({
      method: 'POST',
      credentials: 'include',
    }),
  );
  return response.ok;
}

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return response.text();
  }

  const payload = (await response.json()) as {
    message?: string | string[];
    error?: string;
  };
  if (Array.isArray(payload.message)) return payload.message.join(', ');
  return payload.message ?? payload.error ?? '';
}

async function request(
  input: RequestInfo | URL,
  options: RequestOptions = {},
): Promise<Response> {
  const response = await fetch(input, {
    credentials: 'include',
    ...withCsrfHeaders(options),
  });

  if (response.status === 401 && options.retryOnUnauthorized !== false) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return request(input, {
        ...options,
        retryOnUnauthorized: false,
      });
    }
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || `HTTP ${response.status}`);
  }

  return response;
}

export async function requestJson<T = unknown>(
  input: RequestInfo | URL,
  options: RequestOptions = {},
): Promise<T> {
  const response = await request(input, options);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function requestVoid(
  input: RequestInfo | URL,
  options: RequestOptions = {},
): Promise<void> {
  await request(input, options);
}
