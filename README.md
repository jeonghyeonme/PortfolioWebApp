# Portfolio Web App

개인 브랜딩을 위한 동적 기능을 갖춘 풀스택 포트폴리오 웹 애플리케이션입니다.

---

## ✨ 주요 기능 (Features)

### 👨‍💻 방문자 페이지 (Visitor Side)
- **프로필 및 기술 스택:** 저의 프로필, 기술 스택, 소셜 링크 등을 동적으로 표시합니다.
- **프로젝트 쇼케이스:** 진행했던 프로젝트 목록과 상세 설명을 확인할 수 있습니다.
- **개발 로그 (블로그):** 기술적인 경험과 지식을 기록한 개발 로그를 열람할 수 있습니다.
- **주요 성과 (Highlights):** 주요 경력 및 성과를 모아볼 수 있는 페이지가 제공됩니다.
- **반응형 디자인:** 데스크톱, 태블릿, 모바일 등 모든 기기에서 최적화된 화면을 제공합니다.

### 🔐 관리자 페이지 (CMS - Content Management System)
- **안전한 인증:** Supabase Auth를 통한 이메일/패스워드 기반의 관리자 로그인 기능을 제공합니다.
- **콘텐츠 통합 관리 (CRUD):**
  - 프로필, 프로젝트, 개발 로그, 주요 성과 등 웹사이트에 표시되는 모든 데이터를 생성(Create), 조회(Read), 수정(Update), 삭제(Delete)할 수 있습니다.
  - 기술 스택, 태그 등도 관리 페이지에서 직접 추가하고 관리할 수 있습니다.
- **마크다운 에디터:** `react-markdown`을 지원하여, 개발 로그 등 서식이 필요한 콘텐츠를 마크다운 문법으로 편리하게 작성할 수 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **프론트엔드 (Frontend):**
  - **Framework/Library:** `React`
  - **Language:** `TypeScript`
  - **Build Tool:** `Vite`
  - **Styling:** `Tailwind CSS`
  - **UI Components:** `shadcn/ui`, `Radix UI`
  - **Routing:** `react-router-dom`
  - **Data Fetching:** `supabase-js`

- **백엔드 & 데이터베이스 (Backend & DB):**
  - **Backend as a Service (BaaS):** `Supabase`
    - **Database:** `PostgreSQL` (Supabase 내장)
    - **Authentication:** `Supabase Auth`
    - **Storage:** `Supabase Storage` (이미지 등 정적 파일 저장)

- **배포 (Deployment):**
  - `Vercel` (권장) 또는 `Netlify`

---

## 🚀 시작하기 (Getting Started)

### 1. 프로젝트 클론
```bash
git clone https://github.com/jeonghyeonme/PortfolioWebApp.git
cd PortfolioWebApp
```

### 2. 의존성 설치
```bash
npm install
```

### 3. Supabase 환경 설정
1.  [Supabase](https://supabase.com/)에 가입하고 새로운 프로젝트를 생성합니다.
2.  프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다.
3.  Supabase 프로젝트 대시보드의 `Settings` > `API` 메뉴에서 **Project URL**과 **anon public Key**를 복사하여 아래와 같이 `.env` 파일에 붙여넣습니다.

    ```env
    VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
4.  `PortfolioWebApp_Overview.md` 파일에 있는 SQL 스키마를 참고하여 Supabase 대시보드의 `SQL Editor`에서 테이블을 생성합니다.

### 4. 로컬 서버 실행
```bash
npm run dev
```
이제 `http://localhost:5173` 에서 프로젝트를 확인할 수 있습니다.

---

## 📂 프로젝트 구조

```
/src
├── /components/      # 재사용 가능한 UI 컴포넌트 (Button, Card, Layout...)
├── /pages/           # 라우팅되는 페이지 컴포넌트
│   ├── /admin/       # 관리자(CMS) 전용 페이지
│   └── ...
├── /services/        # Supabase와의 데이터 통신(API)을 담당하는 함수
├── /utils/           # 유틸리티 함수 (Supabase 클라이언트 설정 포함)
├── App.tsx           # 최상위 컴포넌트 및 라우팅 규칙 정의
└── main.tsx          # 애플리케이션 진입점
```