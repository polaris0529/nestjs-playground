export function getAdminErrorMessage(
  error: unknown,
  fallback = '요청 처리에 실패했습니다.',
): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
