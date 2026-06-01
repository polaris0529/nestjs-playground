// 파라미터가 필요한 번역 메시지. 예외를 키+인자로 던질 때 사용한다.
// 예: throw new ConflictException({ key: 'account.errors.login_id_exists', args: { loginId } })
export interface I18nErrorMessage {
  key: string;
  args?: Record<string, unknown>;
}
