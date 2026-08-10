import { requestJson } from './api/http';

export interface ReferenceCode {
  codeId: number;
  codeGroupId: number;
  code: string;
  codeName: string;
  description: string | null;
  sortOrder: number;
  useYn: string;
}

export interface ReferenceCodeOption<T extends string = string> {
  value: T;
  label: string;
}

const optionRequests = new Map<string, Promise<ReferenceCodeOption[]>>();

function toOptions<T extends string>(
  codes: ReferenceCode[],
): ReferenceCodeOption<T>[] {
  return codes.map((code) => ({
    value: code.code as T,
    label: code.codeName,
  }));
}

export async function fetchReferenceCodeOptions<T extends string = string>(
  groupCode: string,
): Promise<ReferenceCodeOption<T>[]> {
  if (!optionRequests.has(groupCode)) {
    optionRequests.set(
      groupCode,
      requestJson<ReferenceCode[]>(
        `/api/common-code/reference-codes?groupCode=${encodeURIComponent(
          groupCode,
        )}`,
        { retryOnUnauthorized: false },
      ).then(toOptions),
    );
  }

  return (await optionRequests.get(groupCode)) as ReferenceCodeOption<T>[];
}

export function findReferenceCodeLabel<T extends string>(
  options: ReferenceCodeOption<T>[],
  value: T | string | null | undefined,
  fallback = '',
): string {
  if (!value) return fallback;
  return (
    options.find((option) => option.value === value)?.label ?? fallback ?? value
  );
}
