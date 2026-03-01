# Optional Rules

> 프로젝트별 선택적 규칙을 추가하는 디렉토리입니다.

## 사용법

1. 프로젝트에 필요한 기술 규칙 파일을 이 디렉토리에 추가
2. CLAUDE.md에서 `@rules/optional/파일명.md`로 참조

## 현재 제공 규칙

```
rules/optional/
├── README.md           # 이 파일
├── storybook.md        # Storybook 8+ CSF3
├── i18n.md             # 다국어 지원
└── pwa.md              # Progressive Web App
```

## CLAUDE.md 참조 방법

```markdown
# CLAUDE.md

## Required Rules
@rules/frontend/architecture.md
@rules/common/git.md

## Optional Rules (프로젝트에 맞게 uncomment)
<!-- @rules/optional/storybook.md -->
<!-- @rules/optional/i18n.md -->
<!-- @rules/optional/pwa.md -->
```

## 규칙 작성 가이드

각 optional 규칙 파일은 다음 구조를 따릅니다:

```markdown
# [기술명] Integration Patterns

## When to Use
활성화 조건 설명

## Configuration
설정 방법

## Patterns
주요 사용 패턴

## Best Practices
- DO: 권장 패턴
- DON'T: 피해야 할 패턴
```
