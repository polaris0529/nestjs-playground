핵심 원칙
상태는 예측 가능하게 유지한다: 단일 소스(source of truth)를 두고 나머지는 파생시킨다.
데이터 흐름은 명시적으로 유지한다: 대부분의 경우 Props는 아래로, Event는 위로.
작고 역할이 명확한 컴포넌트를 지향한다: 테스트, 재사용, 유지보수가 쉬워진다.
불필요한 리렌더링을 피한다: computed와 watcher를 적절히 사용한다.
가독성을 중시한다: 명확하고 스스로 설명되는 코드를 작성한다.


1.1 반응성(reactivity) 필독 참고사항
원본 상태(ref/reactive)는 최소한으로 유지하고, 가능한 모든 것은 computed로 파생시킨다.

필요한 경우에만 watcher로 side effect를 처리한다.
템플릿 내에서 비용이 큰 연산을 반복 계산하지 않는다.
SFC 구조와 템플릿 안전성

SFC 섹션 순서는 <script> → <template> → <style> 순으로 유지한다.
SFC의 책임 범위를 명확히 하고, 큰 컴포넌트는 분리한다.
템플릿은 선언적으로 유지하고, 분기/파생 로직은 script로 옮긴다.
Vue 템플릿 안전 규칙을 적용한다 (v-html, 리스트 렌더링, 조건부 렌더링 방식 선택 등).


도메인 기반 아키텍처

1. View는 domain 하위에 위치하며 다른 domain의 View/Component를 직접 참조하지 않는다.
2. domain 간 또는 여러 파일에서 공유되는 데이터 계약은 domain의 types.ts에 정의한다.
3. domain 간 공유 기능은 shared로 승격하며 domain → domain 직접 참조는 금지한다.
4. View는 화면 표현과 이벤트 연결만 담당하고 API·상태 처리·비즈니스 로직은 service/composable에 위임한다.
5. 디렉터리는 기술 계층보다 domain을 최상위 기준으로 구성한다.
6. domain 내부 스타일은 컴포넌트 `<style scoped>`를 기본으로 하며, domain 간 공유 스타일/토큰만 shared/styles로 승격한다.