export function getRequiredStringEnv(key: string): string {
  const rawValue = process.env[key];
  if (rawValue === undefined || rawValue.trim() === '') {
    throw new Error(`${key} is required`);
  }

  return rawValue;
}

export function getOptionalStringEnv(
  key: string,
  defaultValue: string,
): string {
  const rawValue = process.env[key];
  if (rawValue === undefined) {
    return defaultValue;
  }

  if (rawValue.trim() === '') {
    throw new Error(`${key} must not be empty`);
  }

  return rawValue;
}

export function getRequiredNumberEnv(key: string): number {
  return parseNumberEnv(key, getRequiredStringEnv(key));
}

export function getOptionalNumberEnv(
  key: string,
  defaultValue: number,
): number {
  const rawValue = process.env[key];
  if (rawValue === undefined) {
    return defaultValue;
  }

  if (rawValue.trim() === '') {
    throw new Error(`${key} must not be empty`);
  }

  return parseNumberEnv(key, rawValue);
}

export function getOptionalEnumEnv<T extends string>(
  key: string,
  allowedValues: readonly T[],
  defaultValue: T,
): T {
  const rawValue = getOptionalStringEnv(key, defaultValue);
  if (!allowedValues.includes(rawValue as T)) {
    throw new Error(`${key} must be one of: ${allowedValues.join(', ')}`);
  }

  return rawValue as T;
}

function parseNumberEnv(key: string, rawValue: string): number {
  const parsedValue = Number(rawValue);
  if (!Number.isFinite(parsedValue)) {
    throw new Error(`${key} must be a number`);
  }

  return parsedValue;
}
