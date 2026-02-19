# CallShot API Changelog - 신규 프로젝트 구현 계획

## Context

### 문제
현재 Redoc/Swagger 기반 API 문서는 최신 버전만 보여주는 정적 페이지. 10개 버전의 OpenAPI 스펙 아카이브가 존재하지만, 버전 간 변경사항(필드 추가/삭제, endpoint 변경, breaking change)을 FE 개발자가 확인할 방법이 없음. 기존 `apidocs` 프로젝트(vanilla HTML + 커스텀 JS diff)는 한계가 있어 완전히 새로 만듦.

### 핵심 목표
**FE 개발자가 "이번 버전에서 뭐가 바뀌었지?"를 3초 안에 파악할 수 있는 인터랙티브 API changelog**

---

## 기술 스택

| 기술 | 용도 | 선택 이유 |
|------|------|-----------|
| **React 19 + Vite 6** | SPA 프레임워크 | 인터랙티브 diff UI, 빠른 빌드 |
| **TypeScript** | 타입 안전성 | 구조화된 diff 데이터에 필수 |
| **Tailwind CSS 4** | 스타일링 | 유틸리티 기반, 빠른 UI 개발 |
| **oasdiff** (Go CLI) | OpenAPI diff 엔진 | 250+ breaking change 체크, 필드 레벨 diff, JSON/YAML 출력 |
| **Redoc React** | API Reference 렌더링 | 검증된 OpenAPI 뷰어 |
| **GitHub Pages** | 호스팅 | 무료, CI/CD 자동화 |

---

## 아키텍처: Build-time Data Pipeline

**핵심 원칙**: 모든 diff 연산은 빌드 타임에 수행. React는 사전 생성된 정적 JSON만 fetch.

```
specs/v0.8.0/apiDocs-api.json ─┐
                                ├─► oasdiff ─► public/data/diffs/v0.8.0_v0.9.0.json
specs/v0.9.0/apiDocs-api.json ─┘              public/data/changelogs/v0.8.0_v0.9.0.json
                                              public/data/breaking/v0.8.0_v0.9.0.json

specs/v0.9.0/apiDocs-api.json ─► spec-parser ─► public/data/versions.json (메타데이터)

                                    ↓
                              React SPA (Vite)
                              fetch('/data/...')
```

---

## 프로젝트 구조

```
callshot-api-changelog/
├── .github/workflows/
│   ├── process-incoming-specs.yml   # 새 스펙 도착 시 diff 생성 + 배포
│   └── deploy.yml                   # 코드 변경 시 재빌드 + 배포
│
├── scripts/                         # Build-time Node.js 스크립트
│   ├── generate-diffs.mjs          # oasdiff 실행, 연속 버전 간 diff JSON 생성
│   ├── generate-version-meta.mjs   # 각 버전 endpoint/schema 수 추출
│   └── generate-versions-index.mjs # versions.json 매니페스트 생성
│
├── specs/                           # 아카이브된 OpenAPI 스펙 (git-tracked)
│   ├── v0.2.1/                     # apiDocs-api.json, apiDocs-internal.json,
│   ├── ...                         # apiDocs-all.yaml, service-metadata.json
│   └── v0.9.0/
│
├── public/data/                     # 빌드 시 생성되는 정적 JSON
│   ├── versions.json               # 버전 매니페스트
│   ├── diffs/                      # 연속 버전 간 diff
│   │   ├── v0.2.1_v0.2.2.json
│   │   └── ...
│   ├── changelogs/                 # oasdiff changelog 출력
│   └── breaking/                   # oasdiff breaking change 출력
│
├── src/                             # React SPA
│   ├── components/
│   │   ├── layout/                 # AppShell, Sidebar, Header
│   │   ├── dashboard/              # Dashboard, VersionTimeline, StatsCards
│   │   ├── changelog/              # ChangelogPage, ChangelogEntry, ChangeFilter
│   │   ├── diff/                   # DiffPage, VersionPicker, EndpointDiffList,
│   │   │                           # EndpointDiffCard, SchemaDiff, BreakingChangeAlert
│   │   ├── reference/              # ApiReferencePage (Redoc 임베드)
│   │   └── shared/                 # MethodBadge, StatusBadge, JsonViewer
│   ├── hooks/                      # useVersions, useDiff, useChangelog
│   ├── types/                      # diff.ts, changelog.ts, version.ts
│   ├── lib/                        # api.ts (data fetching), version-utils.ts
│   └── router.tsx
│
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 핵심 페이지 4개

### 1. Dashboard (`/`)
- 버전 타임라인 (v0.2.1 ~ latest)
- 통계 카드: 총 버전 수, 현재 endpoint 수, breaking change 수
- 최근 변경사항 하이라이트

### 2. Changelog (`/changelog`)
- 전체 버전 변경 이력 (최신순)
- 필터: breaking / new / modified / spec group (api/internal)
- 각 버전 엔트리: 뱃지 + endpoint 변경 목록

### 3. Diff View (`/diff/:from/:to`) — **킬러 피처**
- 버전 A ↔ B 드롭다운 선택
- 요약바: X added, Y removed, Z modified, W breaking
- Tab: API | Internal | All
- Endpoint별 상세:
  - 추가/삭제된 endpoint
  - 수정된 endpoint → request body/response 필드 레벨 diff
  - Breaking change 강조 표시

```
┌──────────────────────────────────────────────────┐
│ [PATCH] /api/photos/{id}           [MODIFIED]    │
│                                                  │
│  Request Body:                                   │
│    + hashtags: string[]     (신규 필드)            │
│    ~ description: required → optional             │
│                                                  │
│  Response 200:                                   │
│    + updatedAt: string      (신규 필드)            │
│    - legacyField: string    (삭제) ⚠️ BREAKING   │
└──────────────────────────────────────────────────┘
```

### 4. API Reference (`/reference/:version`)
- Redoc React 컴포넌트로 특정 버전의 전체 API 문서 렌더링
- 버전 드롭다운으로 과거 버전 문서도 열람 가능

---

## 데이터 구조 (TypeScript)

### versions.json
```typescript
interface VersionManifest {
  serviceName: string;
  versions: {
    version: string;            // "v0.9.0"
    releasedAt: string;
    commitSha: string;
    stats: { endpointCount: number; schemaCount: number; tagCount: number; };
    diff?: {                    // 첫 버전은 null
      previousVersion: string;
      summary: { added: number; removed: number; modified: number; breaking: number; };
    };
  }[];
}
```

### diff JSON (per version pair)
```typescript
interface VersionDiff {
  fromVersion: string;
  toVersion: string;
  groups: {
    api: GroupDiff;
    internal: GroupDiff;
  };
}

interface GroupDiff {
  endpoints: {
    added: EndpointChange[];
    removed: EndpointChange[];
    modified: EndpointModification[];   // 필드 레벨 diff 포함
  };
  breaking: BreakingChange[];
  summary: { added: number; removed: number; modified: number; breaking: number; };
}
```

---

## Build-time 스크립트 상세

### `scripts/generate-diffs.mjs`

각 연속 버전 쌍에 대해 oasdiff 3가지 명령 실행:

```bash
# 1. Full diff (YAML → JSON 변환, endpoints 포함)
oasdiff diff specs/v0.8.0/apiDocs-api.json specs/v0.9.0/apiDocs-api.json -f yaml

# 2. Changelog (구조화된 변경사항)
oasdiff changelog specs/v0.8.0/apiDocs-api.json specs/v0.9.0/apiDocs-api.json -f json

# 3. Breaking changes
oasdiff breaking specs/v0.8.0/apiDocs-api.json specs/v0.9.0/apiDocs-api.json -f json
```

> **참고**: oasdiff `diff` 명령의 JSON 출력은 endpoints 섹션이 누락됨 (YAML map key 제약). YAML로 출력 후 `js-yaml`로 JSON 변환.

### 버전 비교 전략

- **빌드 시**: 연속 버전 간 diff만 생성 (9개 쌍)
- **런타임**: 임의 버전 비교(v0.2.1 vs v0.9.0)는 연속 diff를 클라이언트에서 집계
- 선택적으로 first→latest 등 자주 쓰이는 쌍도 사전 생성 가능

---

## CI/CD 흐름

### 새 스펙 도착 시 (callshot CI → 이 프로젝트)

```
callshot에서 v* 태그 push
  → callshot CI: generateOpenApiDocs → specs를 이 repo의 incoming/에 push
    → 이 repo의 GitHub Action 트리거:
      1. incoming/ → specs/{version}/ 으로 이동
      2. oasdiff로 이전 버전과 diff 생성
      3. versions.json 업데이트
      4. React 앱 빌드
      5. GitHub Pages 배포
```

### callshot CI 워크플로 변경
- 현재 `APIDOCS_REPO: 'kodari-corp/kodari-corp.github.io'`
- 새 repo를 만들 경우 이 값을 새 repo로 변경
- 또는 기존 `kodari-corp.github.io`를 완전히 교체 (기존 URL 유지 장점)

---

## 마이그레이션 (기존 아카이브 활용)

```bash
# 1. 기존 10개 버전 스펙 복사
for v in v0.2.1 v0.2.2 v0.2.3 v0.2.4 v0.3.0 v0.4.0 v0.4.1 v0.5.0 v0.8.0 v0.9.0; do
  mkdir -p specs/$v
  cp /path/to/apidocs/archive/gloview-api/releases/$v/* specs/$v/
done

# 2. oasdiff 설치 + 초기 diff 생성
brew install oasdiff
pnpm install
node scripts/generate-diffs.mjs

# 3. 로컬 확인
pnpm run dev  # http://localhost:5173
```

---

## 구현 단계

### Phase 1: 프로젝트 스캐폴딩 + 데이터 파이프라인
- Vite + React + TypeScript + Tailwind 초기화
- 기존 10개 버전 스펙을 `specs/`로 복사
- `scripts/generate-diffs.mjs`, `generate-version-meta.mjs`, `generate-versions-index.mjs` 구현
- oasdiff 설치, 초기 데이터 생성 검증

### Phase 2: 핵심 UI
- AppShell 레이아웃 (사이드바 + 헤더 + 콘텐츠)
- Dashboard 페이지 (타임라인 + 통계)
- Changelog 페이지 (필터링 가능한 변경 이력)
- React Router 설정

### Phase 3: Diff View (킬러 피처)
- DiffPage + VersionPicker
- EndpointDiffList / EndpointDiffCard
- SchemaDiff (필드 레벨 변경 표시)
- BreakingChangeAlert
- API/Internal 탭 전환

### Phase 4: API Reference + 마무리
- Redoc React 컴포넌트 통합
- 버전 선택 가능한 API Reference 페이지
- 반응형 디자인, 로딩/에러 상태
- GitHub Pages 404.html SPA 라우팅 처리

### Phase 5: CI/CD
- `process-incoming-specs.yml` 워크플로 작성
- `deploy.yml` 워크플로 작성
- callshot CI 워크플로의 `APIDOCS_REPO` 업데이트
- E2E 테스트: 태그 push → 스펙 생성 → diff 계산 → 배포

---

## 검증 방법

1. **데이터 파이프라인**: `node scripts/generate-diffs.mjs` 실행 후 `public/data/diffs/` 내 JSON 검증 (9개 연속 diff 파일)
2. **로컬 개발**: `pnpm run dev`로 React 앱 실행, 각 페이지 동작 확인
3. **Diff 정확성**: v0.8.0→v0.9.0 diff에서 engagement 3개 endpoint 추가 확인 (기존 changes-report와 대조)
4. **빌드**: `pnpm run build` 성공 여부, `dist/` 출력물 확인
5. **GitHub Pages**: `pnpm dlx serve dist`로 프로덕션 빌드 로컬 서빙 테스트

---

## 참고: 기존 리소스 경로

- **아카이브 스펙**: `/Users/jay.axz/IdeaProjects/Jay/apidocs/archive/gloview-api/releases/` (v0.2.1~v0.9.0)
- **현재 빌드 스펙**: `/Users/jay.axz/IdeaProjects/Jay/callshot/api/build/docs/` (v0.9.1)
- **기존 apidocs 프로젝트**: `/Users/jay.axz/IdeaProjects/Jay/apidocs/`
