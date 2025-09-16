# Portfolio Web App: 프로젝트 개요 및 개발 로그

## 1. 프로젝트 목표

Figma.ai를 통해 생성된 프론트엔드 디자인을 기반으로, 장기적인 개인 브랜딩을 위한 동적 기능을 갖춘 풀스택 포트폴리오 웹 애플리케이션을 개발합니다. 관리자 기능(CMS)을 포함하여 모든 콘텐츠를 직접 관리할 수 있는 확장성 높은 플랫폼 구축을 목표로 합니다.

## 2. 최종 기술 스택 (React + Supabase)

*   **프론트엔드 (Frontend):**
    *   **프레임워크/라이브러리:** React
    *   **빌드 도구:** Vite
    *   **언어:** TypeScript
    *   **주요 UI 라이브러리:** Radix UI, shadcn/ui, Tailwind CSS

*   **백엔드 (Backend):**
    *   **서비스:** **Supabase (BaaS - 서비스형 백엔드)**
    *   **역할:** 데이터베이스, 사용자 인증, 파일 저장소, 자동 생성 API 등 백엔드의 모든 핵심 기능을 제공합니다. 프론트엔드는 `supabase-js` 클라이언트 라이브러리를 통해 Supabase와 직접 통신합니다.

*   **데이터베이스 (Database):**
    *   **소프트웨어:** **PostgreSQL (Supabase에 내장)**
    *   **관리:** Supabase 대시보드를 통해 관리됩니다.

## 3. 개발 진행 상황 및 주요 결정사항

1.  **프론트엔드 분석 (완료):** v1 정적 프론트엔드 프로젝트의 구조, 컴포넌트, 기술 스택을 분석했습니다.
2.  **기술 스택 선정 (완료):** 초기 PERN 스택 논의 후, 개발 속도와 효율성을 극대화하기 위해 **React + Supabase** 아키텍처를 최종 기술 스택으로 확정했습니다.
3.  **백엔드 인프라 구축 (완료):**
    *   온라인으로 Supabase 프로젝트를 생성했습니다.
    *   Supabase 대시보드의 SQL Editor를 사용하여, 설계한 데이터 모델에 따라 모든 테이블을 성공적으로 생성했습니다.
4.  **CMS 핵심 기능 개발 (완료):**
    *   **관리자 인증:** Supabase Auth를 연동하여 안전한 로그인/로그아웃 기능을 구현했습니다.
    *   **콘텐츠 CRUD:** `Profile`, `Project`, `DevLog`, `Highlight`, `Tag`, `Skill`, `SkillCategory` 등 모든 데이터 모델에 대한 생성(Create), 읽기(Read), 수정(Update), 삭제(Delete) 기능을 관리자 페이지에 구현했습니다.
    *   **관계 데이터 연결:** 프로젝트/개발로그 작성 시 관련 스킬과 태그를 연결하는 UI를 구현했습니다.
5.  **명명 규칙 확립 (필수):**
    *   **`snake_case` 사용:** 데이터베이스의 테이블 및 컬럼명, API 요청/응답 객체의 키 값 등 모든 데이터 관련 명칭은 `snake_case` (예: `created_at`)를 사용하도록 통일합니다. 이는 프론트엔드와 백엔드(Supabase) 간의 데이터 불일치로 인한 오류를 원천적으로 방지하기 위함입니다.
6.  **(2025년 9월 9일) v2.1 단기 목표 달성:**
    *   **데이터 통신 방식 리팩토링:** 기존의 Supabase Edge Function 호출 방식에서 `supabase-js` 라이브러리를 사용한 직접적인 DB 통신 방식으로 전체 데이터 서비스 로직을 성공적으로 리팩토링했습니다.
    *   **방문자 페이지 동적 데이터 연동 완료:** `HomePage`, `ProjectsPage`, `DevLogsPage` 및 각 상세 페이지에 CMS의 실제 데이터가 연동되도록 구현했습니다.
    *   **마크다운 렌더링 적용:** `react-markdown` 라이브러리를 도입하여 개발 로그 상세 페이지의 콘텐츠가 올바르게 렌더링되도록 개선했습니다.
    *   **CMS 기능 안정화:** 데이터 수정 시 발생하던 다수의 `400 Bad Request`, `500 Internal Server Error` 오류를 해결하여 CMS의 모든 CRUD 기능이 안정적으로 작동하도록 수정했습니다.
7.  **(2025년 9월 10일) v2.2ユーザビリティ改善 및 DB 스키마 고도화:**
    *   **Highlights 페이지 추가:** 메인 페이지에만 일부 노출되던 '주요 성과(Highlights)'를 모두 모아볼 수 있는 독립 페이지(`/highlights`)를 신설하고, 메인 네비게이션에 메뉴를 추가하여 사용자 접근성을 개선했습니다.
    *   **UI 일관성 강화:** 카드 전체를 클릭하여 상세 페이지로 이동하는 UX를 전면 적용하고, `HomePage`, `ProjectsPage`, `DevLogsPage` 등 여러 페이지에 걸쳐 중복적으로 존재하던 '자세히 보기' 버튼을 모두 제거하여 UI를 더 깔끔하고 직관적으로 개선했습니다.
    *   **DB 스키마 고도화 (Project):** 기존의 단순 텍스트(`period`) 방식에서 벗어나, `start_date`와 `end_date` 컬럼을 도입하여 프로젝트 기간을 체계적으로 관리하도록 스키마를 변경했습니다. 이를 통해 '진행 중' 상태를 동적으로 표현할 수 있게 되었습니다.
    *   **DB 스키마 확장 (DevLog):** `DevLog` 테이블에 `published_at` 컬럼을 추가하여, 글의 생성일(`created_at`)과 실제 발행일을 명확히 분리했습니다.
    *   **DB 자동화 기능 구현:** `Project` 및 `DevLog` 테이블의 내용이 수정될 때마다 `updated_at` 타임스탬프가 자동으로 갱신되도록 데이터베이스 트리거를 설정하여 데이터 정합성을 확보했습니다.
    *   **상세 페이지 리다이렉션 오류 해결:** `DevLog` 상세 페이지 이동 시, 존재하지 않는 `slug` 컬럼을 참조하여 발생하던 `400 Bad Request` 오류를 `id` 기반으로 조회하도록 수정하여 해결했습니다. 또한 `Project` 상세 페이지에서 내용이 없는 필드를 렌더링하려다 발생하던 `TypeError`를 방어 코드로 해결했습니다.
    *   **CMS 기능 개선:** `DevLog` 목록에 '수정일'을 추가하고, `Project` 편집 페이지에 날짜 선택 필드를 도입하는 등 관리자 페이지의 사용성을 개선했습니다.

## 4. 주요 기술적 문제 해결 (v2.1 진행 중)

*   **`react-hook-form` 문제:** 비동기 데이터 로딩 시 폼 유효성 검사가 오작동하는 문제가 지속적으로 발생. **React의 기본 `useState`를 사용한 제어 컴포넌트 방식으로 전환하여 문제를 해결함.** 향후 모든 폼 개발 시 이 방식을 우선적으로 고려할 것.
*   **`App.tsx` `export` 누락 문제:** `write_file` 도구를 사용하여 라우팅을 추가하는 과정에서, 파일의 마지막 줄인 `export default App;`이 반복적으로 누락되는 문제가 발생함. 이는 도구 사용 시 전체 파일 내용을 덮어쓰는 방식의 오류로, 향후 `App.tsx` 수정 시에는 `replace` 도구를 사용하거나 전체 내용을 다시 한번 확인하는 절차를 반드시 거칠 것.
*   **(핵심) 데이터 통신 방식의 근본적 오류:**
    *   **문제점:** 초기 분석 시 코드에 데이터 fetching 로직이 있었음에도 불구하고 실제 데이터가 표시되지 않음.
    *   **원인:** 프로젝트가 `supabase-js` 라이브러리가 아닌, 배포되지 않은 Supabase Edge Function(`make-server-aba34c98`)을 호출하도록 잘못 구성되어 있었음.
    *   **해결책:** `services/` 디렉토리의 모든 API 호출 코드를 `supabase-js` 클라이언트를 사용하도록 전면 리팩토링하여, 데이터베이스와 직접적이고 올바른 통신 채널을 구축함.
*   **(핵심) CMS 수정 기능의 연쇄적 오류 (400 & 500 에러):**
    *   **문제점:** CMS에서 콘텐츠 수정 시 지속적으로 `400 Bad Request` 또는 `500 Internal Server Error`가 발생.
    *   **원인:**
        1.  **DB-코드 간 네이밍 불일치:** 데이터베이스 컬럼은 `snake_case` (`created_at`)로, 클라이언트 코드는 `camelCase` (`createdAt`)로 작성되어 충돌 발생.
        2.  **잘못된 DB 트리거:** `camelCase` 시절에 생성되었거나 잘못 작성된 데이터베이스 트리거가 DB에 남아, 존재하지 않는 컬럼(`updatedat`)을 수정하려다 500 에러 유발.
        3.  **Join 테이블 RLS 정책 누락:** `TagsOnDevLogs` 같은 중간 테이블에 RLS(Row Level Security) 정책이 없어 `DELETE`, `INSERT` 등의 작업이 차단됨.
        4.  **불필요한 데이터 전송:** 수정 요청 시, 폼의 전체 상태 객체(관계 테이블 객체 포함)가 API로 전송되어 `Project` 테이블에 없는 컬럼을 수정하려다 400 에러 유발.
    *   **해결책:**
        1.  **네이밍 컨벤션 통일:** 모든 DB 테이블의 컬럼명을 `snake_case`로 변경하는 SQL 스크립트를 실행하고, 프로젝트의 모든 관련 코드를 `snake_case`로 수정하여 동기화.
        2.  **DB 트리거 재정비:** 문제가 되는 모든 트리거를 `DROP TRIGGER` 명령으로 완전히 삭제하여 예측 불가능한 DB 동작을 제거.
        3.  **RLS 정책 확장:** 모든 Join 테이블에 대해 `FOR ALL` 권한을 부여하는 RLS 정책을 SQL로 추가하여 CMS의 모든 작업 권한을 보장.
        4.  **API 요청 정제:** 모든 `update` 함수를 리팩토링하여, 관계 데이터 등 불필요한 속성을 모두 제거하고 실제 테이블에 존재하는 컬럼만으로 구성된 '깨끗한' 객체를 만들어 API 요청을 보내도록 수정.

## 5. 프론트엔드 v2 디렉토리 구조

v2 프론트엔드는 페이지, 데이터 로직, 재사용 컴포넌트가 명확하게 분리된 체계적인 구조를 가집니다.

*   **`src/`**: 모든 소스 코드의 루트 디렉토리입니다.
    *   **`components/`**: 버튼, 카드, 레이아웃(`AdminLayout`) 등 재사용 가능한 UI 컴포넌트들이 위치합니다.
    *   **`pages/`**: `react-router-dom`에 의해 렌더링되는 각 페이지 컴포넌트들이 위치합니다.
        *   `admin/`: 로그인, 대시보드, 프로필 관리 등 모든 관리자 전용 페이지들이 위치합니다.
    *   **`services/`**: Supabase와의 모든 데이터 통신을 담당하는 함수(API 호출)들이 위치합니다.
    *   **`utils/`**: 특정 도메인에 종속되지 않는 유틸리티 함수들이 위치합니다.
        *   **`supabase/`**: **Supabase 클라이언트 설정(`client.ts`)이 위치하는 유일하고 정확한 경로입니다.**
    *   **`App.tsx`**: 애플리케이션의 최상위 컴포넌트로, 모든 라우팅(URL 경로) 규칙을 정의합니다.

## 5. 최종 데이터베이스 테이블 구조

*실제 데이터베이스의 구조는 Supabase 대시보드에서 관리되며, 아래는 그 구조를 나타내는 설계도입니다.*

```sql
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Admin_email_key" UNIQUE ("email")
);

CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "fullName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "email" TEXT NOT NULL,
    "socialLinks" JSONB,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Highlight" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverUrl" TEXT,
    "displayOrder" INTEGER DEFAULT 0,
    "projectId" INTEGER UNIQUE REFERENCES "Project"("id") ON DELETE SET NULL,
    "devLogId" INTEGER UNIQUE REFERENCES "DevLog"("id") ON DELETE SET NULL
);

CREATE TABLE "Project" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "projectUrl" TEXT,
    "githubUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE "DevLog" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE "TimelineEvent" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6),
    "category" TEXT NOT NULL
);

CREATE TABLE "Tag" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "SkillCategory" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "Skill" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "imageUrl" TEXT,
    "categoryId" INTEGER NOT NULL REFERENCES "SkillCategory"("id") ON DELETE RESTRICT
);

CREATE TABLE "HighlightsOnProjects" (
    "highlightId" INTEGER NOT NULL REFERENCES "Highlight"("id") ON DELETE CASCADE,
    "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    PRIMARY KEY ("highlightId", "projectId")
);

CREATE TABLE "HighlightsOnDevLogs" (
    "highlightId" INTEGER NOT NULL REFERENCES "Highlight"("id") ON DELETE CASCADE,
    "devLogId" INTEGER NOT NULL REFERENCES "DevLog"("id") ON DELETE CASCADE,
    PRIMARY KEY ("highlightId", "devLogId")
);

CREATE TABLE "DevLogOnProject" (
    "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "devLogId" INTEGER NOT NULL REFERENCES "DevLog"("id") ON DELETE CASCADE,
    PRIMARY KEY ("projectId", "devLogId")
);

CREATE TABLE "SkillOnProject" (
    "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "skillId" INTEGER NOT NULL REFERENCES "Skill"("id") ON DELETE CASCADE,
    PRIMARY KEY ("projectId", "skillId")
);

CREATE TABLE "TagsOnProjects" (
    "projectId" INTEGER NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "tagId" INTEGER NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE,
    PRIMARY KEY ("projectId", "tagId")
);

CREATE TABLE "TagsOnDevLogs" (
    "devLogId" INTEGER NOT NULL REFERENCES "DevLog"("id") ON DELETE CASCADE,
    "tagId" INTEGER NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE,
    PRIMARY KEY ("devLogId", "tagId")
);
```

## 6. 개발 로드맵

### 단기 목표 (v2.1)
-   **방문자 페이지 동적 데이터 연동:** 현재 하드코딩되어 있는 공개 페이지들(`/`, `/projects`, `/devlogs` 등)을 Supabase API와 연동하여, CMS에서 관리하는 실제 데이터가 표시되도록 전환합니다.
-   **마크다운 렌더링 적용:** 관리자 페이지에서 Markdown으로 작성된 콘텐츠(프로젝트 설명, 개발로그 본문 등)가 방문자 페이지에 올바른 스타일로 표시되도록 `react-markdown` 라이브러리를 적용합니다.
-   **관계 데이터 표시:** 프로젝트 및 개발로그 상세 페이지에 연결된 스킬과 태그 목록이 표시되도록 구현합니다.

### 중장기 목표 (v2.2+)
-   **이미지 업로드 기능:** 프로필, 프로젝트 이미지 등을 로컬에서 직접 업로드할 수 있도록 **Supabase Storage** 연동.
-   **방문자 분석 도구 도입:** **Vercel Analytics** 또는 **Google Analytics**를 도입하여 방문자 트래픽을 분석하고 포트폴리오 효과를 측정.
-   **검색 엔진 최적화 (SEO) 강화:** 각 페이지에 동적 메타 태그(제목, 설명)를 적용하여 검색 결과 노출을 최적화.
-   **개인 도메인 연결:** `yourname.dev` 와 같은 개인 도메인을 구입하여 Vercel/Netlify 배포판에 연결.
-   **성능 최적화:** Lighthouse 점수를 지속적으로 측정하고 개선하여 최상의 사용자 경험 제공.

---

## 부록: 초기 프로젝트 아이디어

*(기존 내용과 동일)*