# Frontend Assets Rule

This rule defines scoped CSS and static asset placement for the Vue frontend.

## Component Styles

- Component-only styles must stay inside the Vue SFC using `<style scoped>`.
- Use `<style scoped>` for domain view styles and component-specific styles.

## Bundled Assets

- Prefer imported assets under `frontend/src/` when Vite can bundle them.

## Public Assets

- Use `frontend/public/` only for assets that require a stable root URL, such as favicon, manifest files, robots files, or externally referenced static files.
- Do not place domain-specific images, icons, or JSON files in public unless a fixed URL is required.

---

# 프론트엔드 자원 규칙

이 규칙은 Vue 프론트엔드의 scoped CSS와 정적 자원 위치 기준을 정의한다.

## 컴포넌트 스타일

- 컴포넌트 전용 스타일은 Vue SFC 내부의 `<style scoped>`에 둔다.
- 도메인 view 스타일과 컴포넌트 전용 스타일에는 `<style scoped>`를 사용한다.

## 번들링 자원

- Vite가 번들링할 수 있는 자원은 기본적으로 `frontend/src/` 아래에서 import해서 사용한다.

## Public 자원

- `frontend/public/`은 favicon, manifest 파일, robots 파일, 외부에서 참조하는 정적 파일처럼 안정적인 root URL이 필요한 자원에만 사용한다.
- 고정 URL이 필요한 경우가 아니라면 도메인 전용 이미지, 아이콘, JSON 파일은 public에 두지 않는다.
