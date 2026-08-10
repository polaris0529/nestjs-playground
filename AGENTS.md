# AGENTS.md

Global behavioral guidelines for agents working in this repository. Keep this
file focused on cross-cutting behavior; domain-specific rules live in
`.claude/rules/`.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them instead of choosing silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop, name what is confusing, and ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No flexibility or configurability that was not requested.
- No error handling for impossible scenarios.
- If a change is much larger than necessary, simplify before finishing.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own changes.**

- Do not improve adjacent code, comments, or formatting without a direct need.
- Do not refactor things that are not broken.
- Match existing style, even if you would choose a different style elsewhere.
- If unrelated dead code is noticed, mention it instead of deleting it.
- Remove only imports, variables, functions, or files that your change made unused.

Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" -> write tests for invalid inputs, then make them pass.
- "Fix the bug" -> write or identify a reproduction, then make it pass.
- "Refactor X" -> ensure relevant tests pass before and after.

For multi-step tasks, state a brief plan:

```text
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

## Project Rule Files

Load the relevant rule files before work in their scope.

@.claude/rules/coding-design.md
@.claude/rules/safe-coding.md
@.claude/rules/git-deploy.md
@.claude/rules/skill.md
@.claude/rules/vue-skill.md

## Project Reference Files

Use this file only for project libraries and frameworks.

@docs/stack.md
@docs/structure.md
