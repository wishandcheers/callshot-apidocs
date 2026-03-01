# Token Optimization Patterns

> **이 문서는 인간 개발자용 설계 가이드입니다.**
>
> - Claude가 자동으로 참고하지 않음 (CLAUDE.md에 포함되지 않음)
> - 새 agent/skill 설계 시 참고용
> - 실제 패턴은 이미 각 agent/skill 파일에 적용됨

---

## Overview

Claude Code에서 토큰 사용을 최적화하는 패턴들입니다.

## Pattern 1: Progressive Disclosure (점진적 공개)

**개념**: 상세 정보는 필요할 때만 로딩

```
SKILL.md (항상 로딩, ~50 lines)
    │
    └── references/ (필요 시에만 로딩)
        ├── patterns.md
        └── examples.md
```

**적용**:
- Skill body는 핵심 워크플로만
- 상세 패턴/예시는 references/로 분리
- Agent도 동일하게 적용 가능

---

## Pattern 2: Subagent Delegation (서브에이전트 위임)

**개념**: 무거운 작업을 별도 컨텍스트에서 처리

```
메인 컨텍스트                    서브에이전트 컨텍스트
┌─────────────┐                 ┌─────────────────┐
│ Skill 실행   │ ──Task tool──▶  │ Agent 실행       │
│             │                 │ (전체 분석)       │
│ 요약만 수신   │ ◀─────────────  │ 상세 로그 처리    │
└─────────────┘                 └─────────────────┘
```

**적용**:
- 테스트 실행/분석
- PR 리뷰
- 코드 분석
- 대용량 diff 처리

---

## Pattern 3: Model Tiering (모델 계층화)

**개념**: 작업 복잡도에 따라 다른 모델 사용

| 작업 유형 | 모델 | 이유 |
|----------|------|------|
| 간단한 분석, 테스트 실행 | `haiku` | 빠르고 저렴 |
| 코드 리뷰, 컴포넌트 분석 | `sonnet` | 균형 |
| 아키텍처 결정, 복잡한 리팩토링 | `opus` | 최고 품질 |

**Agent 설정**:
```yaml
---
name: vitest-runner
model: haiku          # 테스트 실행은 haiku로 충분
---

---
name: ui-component-reviewer
model: sonnet         # 컴포넌트 리뷰는 sonnet
---

---
name: fsd-architect
model: opus           # 아키텍처 검증은 opus
---
```

---

## Pattern 4: Conditional Context (조건부 컨텍스트)

**개념**: 프로젝트 특성에 따라 필요한 규칙만 로딩

```markdown
# CLAUDE.md

## Required Rules
@rules/frontend/architecture.md
@rules/common/git.md

## Conditional Rules (uncomment if used)
<!-- @rules/optional/storybook.md -->
<!-- @rules/optional/i18n.md -->
<!-- @rules/optional/pwa.md -->
```

---

## Pattern 5: Output Filtering (출력 필터링)

**개념**: 명령 출력을 필요한 수준으로 제한

| 상황 | 출력 레벨 |
|------|----------|
| 테스트 성공 | `--reporter=dot` (최소) |
| 테스트 실패 | `--reporter=verbose` (상세) |
| 빌드 | 에러만 |
| 타입체크 | 에러만 |

**예시**:
```bash
# 1차: 최소 출력
npx vitest run --reporter=dot

# 실패 시에만 상세
npx vitest run --reporter=verbose
```

---

## Pattern 6: Smart File Reading (스마트 파일 읽기)

**개념**: 파일 전체 대신 필요한 부분만 읽기

```
# 전체 파일 읽기 (비효율)
Read: src/features/auth/ui/LoginForm.tsx

# 특정 라인만 읽기 (효율)
Read: src/features/auth/ui/LoginForm.tsx (lines 40-60)

# 또는 Grep으로 필요한 부분만
Grep: "export function LoginForm" in src/features/auth/
```

---

## Pattern 7: Proactive Triggers (사전 트리거)

**개념**: 특정 조건에서 자동 실행

| 트리거 | 액션 | Agent/Skill |
|--------|------|-------------|
| 코드 수정 후 | 테스트 실행 | `/test` |
| shared/ui 변경 | 접근성 감사 | `a11y-auditor` |
| 새 feature/page | FSD 검증 | `fsd-architect` |
| 테스트 실패 | 디버깅 | `frontend-debugger` |

---

## Best Practices Summary

| 패턴 | 토큰 절약 | 적용 난이도 |
|------|----------|------------|
| Progressive Disclosure | ⭐⭐⭐ | 낮음 |
| Subagent Delegation | ⭐⭐⭐⭐ | 중간 |
| Model Tiering | ⭐⭐⭐ | 낮음 |
| Conditional Context | ⭐⭐ | 낮음 |
| Output Filtering | ⭐⭐⭐ | 낮음 |
| Smart File Reading | ⭐⭐ | 낮음 |
| Proactive Triggers | ⭐⭐ | 중간 |

## 현재 적용 현황

### Agent Model Tiering

| Agent | Model | 이유 |
|-------|-------|------|
| `fsd-architect` | `opus` | 아키텍처 결정은 최고 품질 필요 |
| `vitest-runner` | `haiku` | 테스트 실행은 단순 작업 |
| 나머지 agents | `sonnet` | 코드 분석/리뷰는 균형 |

### Agent Proactive Triggers

| Agent | Trigger Condition |
|-------|-------------------|
| `fsd-architect` | 새 feature/page 생성, 패키지 구조 변경 시 |
| `ui-component-reviewer` | shared/ui 컴포넌트 생성/수정 시 |
| `a11y-auditor` | UI 컴포넌트 생성/수정 시 |
| `frontend-debugger` | 테스트/빌드 실패, 런타임 에러 시 |
| `typescript-code-reviewer` | PR 생성, 코드 스테이징 시 |
| `frontend-performance-engineer` | 번들 크기 증가, 느린 렌더링 감지 시 |

### Skill Progressive Disclosure

| Skill | Core File | References |
|-------|-----------|------------|
| `/commit` | SKILL.md (~40 lines) | references/conventions.md |
| `/pr-create` | SKILL.md (~35 lines) | references/templates.md |
| `/pr-review` | SKILL.md (~50 lines) | references/checklist.md |
| `/test` | SKILL.md (~80 lines) | references/patterns.md |
