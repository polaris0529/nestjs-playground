# UI 디자인 / 템플릿 규칙 (NestJS + hbs)

전체 공통 룰은 루트 `CLAUDE.md` 참조.

## 템플릿 엔진
- SSR 템플릿 엔진은 **Handlebars(hbs)** 를 사용한다.
- 뷰는 `views/`, 공통 조각(head, scripts 등)은 `views/partials/**` 로 분리하고 `{{> partial}}` 로 포함한다.

## 인라인 JS 금지
- **템플릿(.hbs)에 JS 스크립트를 직접 작성하지 않는다.** 인라인 `<script>...</script>` 블록 금지.
- 모든 클라이언트 JS 는 `public/js/**` 외부 파일로 분리하고, 템플릿에서는 `<script src="...">` 로만 로드한다.
- 데이터 전달이 필요하면 `data-*` 속성이나 별도 JSON API 호출(axios)로 처리하고, 템플릿에 로직을 넣지 않는다.

## 정적 자산
- CSS/JS/이미지는 `public/` 하위에 두고 루트 경로(`/css`, `/js`)로 서빙한다(`useStaticAssets`).
