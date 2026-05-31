# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Docker Compose Create Rule

## Core Goal
Generate safe, production-ready docker-compose.yml based on given services and server context.

## Global Defaults
- Always set container_name
- Use pinned stable image versions (never use latest)
- Use .env file for all secrets and credentials (no hardcoding)
- restart policy: unless-stopped
- expose only required ports (prefer internal networking)
- define explicit networks when multiple services exist

## Resource Awareness
Adjust configuration based on server capacity:
- small  (CPU ≤ 2core, RAM ≤ 4GB)  → limits: cpu=0.3, mem=256M
- medium (CPU ≤ 4core, RAM ≤ 8GB)  → limits: cpu=0.5, mem=512M
- large  (CPU > 4core, RAM > 8GB)  → limits: cpu=1.0, mem=1G

## Logging Policy
Use json-file logging driver with rotation:
- worker: max-size=10m, max-file=3
- api:    max-size=50m, max-file=5
- nginx:  max-size=100m, max-file=5
- db:     max-size=20m, max-file=3

If service type is unknown, default to api rules.

## Service Design Rules
- services must be isolated and minimal
- use depends_on with condition: service_healthy when service readiness matters (e.g. app → db)
- prefer internal DNS over localhost communication
- use volumes only for persistent data (db, uploads, logs)
- name volumes as {project}-{service}-data (e.g. myproject-db-data)

## Security Rules
- no exposed database ports unless explicitly requested
- no public exposure of internal services
- sensitive values must be in .env only
- prefer internal network communication

## Output Requirements
- valid docker-compose.yml (omit version field — Compose V2 standard)

## Claude-Cli rules 
- The answer to the question is displayed in Korean.

---

## 앱별 규칙 (개별 관리 · 자동 참조)

위는 전체(공통) 룰이다. 앱 고유 규칙(코딩 규칙 / UI 디자인 / 서비스 구성)은 아래 파일에서 개별 관리하며, 다음 import 로 자동 참조한다.

@.claude/rules/coding.md
@.claude/rules/ui-design.md
@.claude/rules/service.md
