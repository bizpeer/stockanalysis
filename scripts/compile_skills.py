import os
import json
import sys

# Define path relative to repository structure
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

# Path to the cloned ai-berkshire repository containing the skills
skills_dir = os.path.abspath(os.path.join(project_root, "..", "..", "my_app", "aiberkshir", "skills"))
if not os.path.exists(skills_dir):
    # Fallback to local check
    skills_dir = os.path.abspath(os.path.join(project_root, "skills"))

output_file = os.path.join(project_root, "src", "lib", "skillsData.ts")

if not os.path.exists(skills_dir):
    print(f"Error: Skills directory not found at {skills_dir}")
    sys.exit(1)

# Korean Translation Mapping for UI display
KOREAN_TRANSLATIONS = {
    "bottleneck-hunter": {
        "title": "공급망 병목 헌터: AI 기반 글로벌 산업망 병목 차익 거래",
        "description": "트렌드에 대한 공급망 병목 스캔 및 차익 거래 기회 발굴 프레임워크."
    },
    "deep-company-series": {
        "title": "심층 기업 시리즈: 8편의 장편 글로 분석하는 기업",
        "description": "특정 기업에 대해 8편의 심층 분석 리포트를 시리즈 형식으로 작성합니다."
    },
    "dyp-ask": {
        "title": "단융평 질문답변: 그의 방식대로 생각하기",
        "description": "가치투자 대가 단융평(步步高 창업자)의 사고방식과 투자 철학을 바탕으로 질문에 답변합니다."
    },
    "earnings-review": {
        "title": "실적 정독: 1차 자료 심층 해석",
        "description": "재무 제표 및 실적 발표 원본 자료(10-K/10-Q 등)를 직접 분석합니다."
    },
    "earnings-team": {
        "title": "실적 분석 팀: 4대 대가 병렬 해석 및 콘텐츠 작성",
        "description": "실적 보고서를 4가지 투자 대가의 시각으로 병렬 분석하고 콘텐츠화합니다."
    },
    "financial-data": {
        "title": "재무 데이터 크로스 검증 규격",
        "description": "재무 데이터 취득 및 수치 신뢰성을 위한 크로스 밸리데이션 표준 검증 가이드라인."
    },
    "industry-funnel": {
        "title": "산업 깔때기 스크리닝: 전체 시장에서 3개 기업을 선정하는 가치투자 프로세스",
        "description": "산업 전반에서 기업들을 필터링하여 최적의 가치투자 대상 3곳을 압축하는 프로세스."
    },
    "industry-research": {
        "title": "산업 투자 연구: 산업망 전경 스캔 및 4대 대가 개별주 분석",
        "description": "산업 공급망 전체의 밸류체인 스캔 및 주요 개별 종목 분석 프레임워크."
    },
    "investment-checklist": {
        "title": "워렌 버핏 가치투자 매수 전 체크리스트",
        "description": "주식 매수 판단을 내리기 전에 필수적으로 거쳐야 할 가치투자 핵심 검증 리스트."
    },
    "investment-research": {
        "title": "투자 연구: 버핏-멍거-단융평-리루 4대 대가 종합 분석 프레임워크",
        "description": "가치투자 4대 거장의 프레임워크를 기반으로 기업의 질적, 양적 가치를 분석합니다."
    },
    "investment-team": {
        "title": "투연 팀: 4가지 역할 병렬 분석 프레임워크",
        "description": "다중 에이전트 협업을 통해 기업 분석 리서치를 정교하게 수행합니다."
    },
    "management-deep-dive": {
        "title": "경영진 심층 연구: 주식을 사는 것은 사람을 사는 것",
        "description": "기업을 이끄는 경영진의 자질, 본분, 역사적 자본 배치 이력을 스캔합니다."
    },
    "news-pulse": {
        "title": "기업 뉴스 펄스: 주가 급등락 시 신속한 원인 규명",
        "description": "주가 변동 시 10분 내에 공시, 뉴스, 시장 심리 등을 다각도로 스캔하여 원인을 규명합니다."
    },
    "portfolio-review": {
        "title": "포트폴리오 관리: 기업 연구에서 포트폴리오 관리로",
        "description": "개별 기업 분석을 넘어 리스크 대비 최적의 자산 배분 및 관리를 집행합니다."
    },
    "private-company-research": {
        "title": "비상장 기업 연구: 다중 에이전트 병렬 심층 연구 프레임워크",
        "description": "공시가 제한적인 비상장 기업 및 스타트업에 대한 다각도 정보 탐색 및 분석."
    },
    "quality-screen": {
        "title": "부적격 스크리닝: 일류가 아닌 기업을 빠르게 배제하는 7대 지표",
        "description": "투자 부적격 기업을 빠르게 걸러내기 위한 7가지 핵심 제외 기준."
    },
    "thesis-tracker": {
        "title": "투자 아이디어 추적: 매수 후 규율 시스템",
        "description": "매수 후 기업의 펀더멘털 변화 및 투자 핵심 아이디어의 유효성을 지속 검증합니다."
    },
    "wechat-article": {
        "title": "콘텐츠 발행 협업: 저자-편집자-독자 3인 에이전트 협업",
        "description": "작성된 리서치 보고서를 대중 친화적이면서도 정교한 콘텐츠로 윤색하고 배포 준비를 합니다."
    }
}

skills = []

for filename in os.listdir(skills_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(skills_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        lines = content.splitlines()
        skill_id = filename[:-3]
        title = skill_id # fallback
        description = ""
        
        # Parse first heading as title
        for line in lines:
            if line.startswith("# "):
                title = line[2:].strip()
                break
        
        # Parse first few lines as description
        desc_lines = []
        started = False
        for line in lines:
            if line.startswith("# "):
                started = True
                continue
            if started:
                cleaned = line.strip()
                if cleaned:
                    desc_lines.append(cleaned)
                    if len(desc_lines) >= 3:
                        break
        description = " ".join(desc_lines)[:150] + "..." if desc_lines else "AI Berkshire investment research skill."
        
        # Override with Korean translations for UI
        if skill_id in KOREAN_TRANSLATIONS:
            title = KOREAN_TRANSLATIONS[skill_id]["title"]
            description = KOREAN_TRANSLATIONS[skill_id]["description"]

        skills.append({
            "id": skill_id,
            "title": title,
            "description": description,
            "prompt": content
        })

# Write TypeScript file
ts_content = f"""// This file is auto-generated by compile_skills.py. Do not edit manually.
export interface ResearchSkill {{
  id: string;
  title: string;
  description: string;
  prompt: string;
}}

export const RESEARCH_SKILLS: ResearchSkill[] = {json.dumps(skills, indent=2, ensure_ascii=False)};
"""

os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(output_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully compiled {len(skills)} skills into {output_file}")
