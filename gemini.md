# Onedays PE 프로젝트 AI 개발 가이드라인 (v2.0)

본 문서는 Onedays PE 프로젝트를 진행할 때 AI 어시스턴트(Antigravity)가 항상 최우선으로 참조해야 하는 규칙입니다. 전역 가이드라인과 함께 이 문서의 내용을 준수하십시오.

---

## 1. 개발 환경 (Environment)
- **Node.js 24 Default**: 프로젝트의 기본 개발 및 빌드 환경은 항상 **Node.js 24**를 표준으로 사용합니다. CI/CD (GitHub Actions 등) 파이프라인 구성 시에도 Node.js 24 버전을 명시하여 구버전 지원 중단으로 인한 오류를 방지합니다.

## 2. 콘텐츠 관리 원칙 (CMS & Admin)
- **Admin 관리자 메뉴 상시 반영**: 웹사이트 내의 모든 콘텐츠(텍스트, 이미지, 메뉴 구성, 포트폴리오, 공지사항 등)는 하드코딩을 지양하고, **Admin(관리자) 메뉴를 통해 동적으로 수정 및 관리가 가능하도록 설계하고 반영**해야 합니다.
- 프론트엔드에 새로운 기능이나 섹션을 추가할 경우, 반드시 해당 데이터를 제어할 수 있는 관리자 페이지(Admin Portal) 기능 연동을 기본 요구사항으로 간주하고 함께 구현합니다.

---

## 3. AI Berkshire 리서치 스튜디오 (AI Berkshire Research Studio)

본 프로젝트는 가치투자 4대 대가(워렌 버핏, 찰리 멍거, 단융평, 리루)의 프레임워크와 정교한 금융 검증 도구를 연계한 AI 투자 리서치 도구를 내장하고 있습니다.

### 3.1 파일 구조 및 경로
- **클라이언트 리서치 스튜디오 페이지**: [page.tsx](file:///d:/Antigravity/aiberkshir/src/app/research/page.tsx) (`/research` 경로)
- **금융 검증 유틸리티 (TypeScript Port)**: [financialRigor.ts](file:///d:/Antigravity/aiberkshir/src/lib/financialRigor.ts)
  - Python으로 구현된 기존 `tools/financial_rigor.py` 검증 도구들을 브라우저 내에서 동일하게 동작하도록 포팅한 핵심 연산 모듈입니다.
  - 제공 기능: 시가총액 검증, 밸류에이션(PE, PB, ROE, FCF, PS) 검증, 다중 소스 데이터 크로스 벨리데이션, 벤포드 법칙 검증, 3시나리오 가치 평가 모델.
- **에이전트 스킬 데이터**: [skillsData.ts](file:///d:/Antigravity/aiberkshir/src/lib/skillsData.ts)
  - 18개의 투자 분석 스킬(투자 연구, 바틀넥 헌터, 실적 정독 등)의 템플릿과 프롬프트가 정의되어 있습니다.

### 3.2 에이전트 스킬 업데이트 워크플로우
에이전트 스킬 파일(`skills/*.md`)이 수정되거나 새로운 스킬이 추가된 경우, 반드시 아래 스크립트를 실행하여 TypeScript 설정 파일로 다시 컴파일해야 합니다.
```bash
# 프로젝트 루트 디렉토리에서 실행
python scripts/compile_skills.py
```
- 컴파일러는 `d:\my_app\aiberkshir\skills\` 디렉토리(또는 프로젝트 내 `skills/` 디렉토리) 내의 마크다운 스킬 파일들을 읽어 `src/lib/skillsData.ts`를 자동으로 갱신합니다.

### 3.3 개발 및 유지보수 규칙
1. **API Key 보안**: 어플리케이션은 서버리스(GitHub Pages) 정적 호스팅이 가능하도록 설계되었습니다. Gemini API Key는 클라이언트 측 `localStorage`(`ai_berkshire_apikey`)에만 보관하고 외부 서버로 전달하지 않아야 합니다.
2. **연산 정확도 유지**: `src/lib/financialRigor.ts` 내부의 금융 검증 공식은 floating-point 오류가 발생하지 않도록 정확하게 유지되어야 하며, 임의로 수식을 완화하거나 단순화해서는 안 됩니다.
3. **인터랙티브 분석 연동**: 스튜디오 화면에서 AI 스트리밍 텍스트 내에 검증용 파이썬 명령어(예: `python3 tools/financial_rigor.py ...`)가 감지되면, 이를 파싱해 화면상에 실행 위젯을 띄워주는 파서 로직([page.tsx](file:///d:/Antigravity/aiberkshir/src/app/research/page.tsx) 내 `scanOutputForCommands`)이 포함되어 있습니다. AI의 출력을 변경하는 경우 이 정규표현식과 파서가 망가지지 않도록 주의해야 합니다.
