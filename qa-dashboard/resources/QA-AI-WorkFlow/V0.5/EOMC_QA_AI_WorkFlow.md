# QA AI WorkFlow 規劃

> 版本：v0.5  
> 專案示範：企業營運管理中心  
> 首頁用途：用 T1-T8 品質生命週期，讓團隊快速理解 QA 如何維護軟體品質。  
> 正文用途：保留完整規範、分工追蹤與後續 AGENT / SKILL 建置方向。

---

## 0. Executive Summary

v0.5 的主問題是：**在 T1-T8 的品質生命週期中，維護軟體品質需要什麼？**

答案不是先列工具，而是先建立品質維護模型：

1. **A. 測試設計 PDCA**：定義要測什麼、測到什麼程度、品質指標怎麼量。
2. **B. 自動化驗證**：把可重複、可判斷、可交接的驗證轉成 API/UI/Data/RBAC automation。
3. **C. 監控與放行**：用 Jenkins、Gate、Report、Teams、Sandbox 支撐 release 與維運。

**D. 治理底座**不是第四個主管答案，而是支撐 A/B/C 的追蹤機制：Source of Truth、DoD、Owner/RACI、Risk acceptance。

v0.5 的執行順序固定為：**A 先落地，B & C 並行**。第一階段先跑一個區塊功能，不求量，先證明流程可追溯、可交接、可跑 report。

---

## 1. 品質維護金字塔

| 問題層級 | 問題 | 答案 | 主管視角 | 落地產出 |
| --- | --- | --- | --- | --- |
| Big Question | 在 T1-T8 的品質生命週期中，維護軟體品質需要什麼？ | 需要測試設計 PDCA、自動化驗證、監控與放行，並由治理底座支撐 | 先看品質維護模型，再看每個 T 要跑什麼 | QA AI WorkFlow v0.5 |
| Q1 | 如何知道要測什麼、測到什麼程度、品質怎麼量？ | A. 測試設計 PDCA | 讓需求、測試、部署、維運都有清楚輸入、輸出、品質指標 | Test Plan、Test Case、Test Report、Coverage / Traceability |
| Q2 | 如何讓驗證可重複、可交接、可降低人工成本？ | B. 自動化驗證 | 將穩定且可判斷的檢查轉成 API/UI/Data/RBAC automation | API automation、UI automation、Data/RBAC automation、Automation handoff |
| Q3 | 如何知道能不能放行、上線後是否健康？ | C. 監控與放行 | 用 CI、Gate、Report、通知與 sandbox 建立放行與維運證據 | Jenkins CI、QA Gate Checklist、Teams Report、Sandbox |
| Foundation | 如何讓以上三件事可信、可追蹤、可分工？ | D. 治理底座 | 不讓規範散落在個人經驗或一次性文件裡 | Source of Truth、DoD、Owner/RACI、Risk acceptance |

---

## 2. T1-T8 品質生命週期

| T | 時機 | 品質目的 | Owner | 輸入 | 輸出 | 對應能力 | 詳細規劃 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Pre-commit | 最早攔截低成本錯誤，避免明顯格式、型別、基本邏輯錯誤進 PR | RD | local branch、lint/type/unit rule | local check result | A / B / D | QA 定義最低品質門檻，RD 在本機先跑；適合 M1、M2。 |
| T2 | PR CI | 每次變更都有最小自動證據，阻擋紅燈 PR | RD + CI Bot | PR、changed files、source mapping | PR CI result、artifact link | B / C / D | 快速跑 lint、unit、contract quick check、smoke candidate、security quick。 |
| T3 | Merge to DEV | 抓 PR 合併後才會出現的整合風險 | CI Bot / DevOps | merged dev branch、DEV env | merge gate report | B / C | 驗 API/UI/data integration、error mapping、visual snapshot、RBAC full check。 |
| T4 | Nightly | 不阻塞白天開發，夜間抓 regression、資料、權限、趨勢 | Jenkins / QA Review | DEV latest 或 STAGE RC、automation suite | nightly report、trend input | B / C / D | 可分 DEV Nightly 與 STAGE Nightly；DEV 抓 merge regression，STAGE 驗 near-prod baseline。 |
| T5 | Release Gate | 在 Go/No-go 前提供可追溯測報與放行證據 | CI / QA | RC build、Test Report、Gate Checklist | release report、Go/Conditional Go/No-go input | A / C / D | 彙整 Test Plan、Test Case、Test Report、automation result、bug、risk acceptance。 |
| T6 | Pre-PROD | 團隊根據 QA 證據做正式放行決策 | PM / TL / Team | release report、risk acceptance | Go / Conditional Go / No-go decision | C / D | QA 提供建議，不取代放行權；Conditional Go 必須有 owner、due date、影響範圍。 |
| T7 | Post-PROD Smoke | 部署後 5-10 分鐘確認正式環境核心 read-only 路徑 | DevOps / SRE | PROD deploy result、read-only smoke | post-prod smoke result、rollback input | C | 只跑 read-only；登入、首頁、核心 dashboard、report entry、critical API health。 |
| T8 | Synthetic / PROD 常駐監控 | 24/7 監測正式環境核心路徑，補足 release gate 後仍可能逃逸的問題 | DevOps / SRE + QA | PROD synthetic jobs、monitor rule | synthetic result、alert、incident input | C / D | 建議每 5-10 分鐘跑 read-only synthetic；fail 進 rollback assessment 或 incident triage。 |

---

## 3. A 測試設計 PDCA

| 能力 | 子項 | 目的 | DoD | 主要證據 |
| --- | --- | --- | --- | --- |
| A. 測試設計 PDCA | A1 Test Plan | 規劃與設計測試策略，定義 scope、risk、ready、schedule | 測試範圍、風險、前置準備、環境、時程、出口條件清楚；需求完整性與可測試性已 review | `outputs/reports/<Name>_測試計劃書_v0.1.docx`、requirement review notes |
| A. 測試設計 PDCA | A2 Test Case | 將需求轉成可執行、可匯入、可追溯案例 | 每個功能至少含 Happy path、Negative、Boundary、UI copy/layout；依功能補 API、RBAC、Data、Report/Download、Upload Logic | BrowserStack CSV、Readable Excel、validation log |
| A. 測試設計 PDCA | A3 Test Report | 回報測試範圍、環境、結果、品質狀態與追蹤建議 | 已測/未測、Passed/Failed/Skipped、pass rate、bug count、test time、建議與 follow-up 清楚 | `outputs/reports/<Name>_軟體測試報告_v0.1.docx`、release summary |
| A. 測試設計 PDCA | A4 Coverage / Traceability | 確保每個需求能追溯來源、案例、執行結果、缺陷與風險接受 | PRD/Figma/RA/OpenAPI/RBAC 到 Test Case、Result、Bug、Risk acceptance 可查 | source mapping、coverage report、traceability matrix |
| B. 自動化驗證 | B1 API automation | 找出可先轉成 API automation 的 API Test | contract、schema、data、RBAC enforcement 有 assertion；report 有 overview、pass rate、history | pytest/API report、schema diff、history trend |
| B. 自動化驗證 | B2 UI automation | 驗證可被穩定自動化的 UI 流程與畫面狀態 | selector、test data、env、assertion、screenshot/trace 清楚；人工視覺判斷不硬標 automation | Playwright report、Allure-like report、screenshot、trace |
| B. 自動化驗證 | B3 Data / RBAC automation | 驗證 EOMC 決策資料與權限安全 | critical KPI/formula/role x page/action/API 預設 100% pass；非 critical 需 risk acceptance | data diff、RBAC matrix result、401/403 evidence |
| B. 自動化驗證 | B4 Automation handoff | 讓 AI 產出的自動化，人工也能介入維護 | 每條 candidate 有 source mapping、selector、test data、env、owner、blockers、maintenance notes | Automation Test Case MD、handoff checklist |
| C. 監控與放行 | C1 Jenkins CI | 支撐排程、上版觸發、手動觸發與 report artifact | T4/T5/T7/T8 job 可跑，artifact 可追溯，失敗原因可讀 | Jenkins build、HTML report、JUnit、Allure |
| C. 監控與放行 | C2 QA Gate Checklist | 把放行標準變成可逐項確認的燈號清單 | 效能、效率、可用性、穩定性、安全性皆有綠黃紅條件 | QA Gate Checklist、release decision |
| C. 監控與放行 | C3 Report / Teams 通知 | 讓測試結果即時回傳團隊 | Jenkins 完成後回傳 summary、failed list、report link、owner | Teams QA CI Report、notification log |
| C. 監控與放行 | C4 Sandbox / Reset / Seed / Chaos | 讓 QA 環境可重複、安全、可模擬異常 | QA 可 reset、seed、cleanup；STAGE/PROD 禁 destructive；有 audit | reset API、seed fixtures、chaos toggle、audit log |
| D. 治理底座 | Source of Truth | 避免需求來源散落或前後矛盾 | PRD、Figma、RA、OpenAPI、RBAC 優先順序清楚 | AGENTS.md、source mapping |
| D. 治理底座 | DoD | 每件事知道完成標準 | 每個產出物有輸入、輸出、完成條件、證據、紅燈條件 | DoD checklist |
| D. 治理底座 | Owner / RACI | 知道誰負責、誰協作、誰接受風險 | QA、Frontend Team、Backend Team、Develop Team、PM/TL 責任清楚 | RACI table、review notes |
| D. 治理底座 | Risk acceptance | 讓 Conditional Go 有制度，不靠口頭承諾 | owner、due date、影響範圍、接受人明確 | risk acceptance list、release summary |

---

## 4. Quality Metrics 品質指標與品質度量

| 指標 | 定義 | 用途 | 對應能力 | 建議門檻 | 證據 |
| --- | --- | --- | --- | --- | --- |
| Requirement Change Rate | 本次 scope 需求變更比例 | 判斷 Test Plan 是否需要重估範圍與時程 | A1 / D | 變更影響 critical scope 時需更新 Test Plan | change log、PRD version |
| Requirement Defect Rate | 需求不清、矛盾、不可測項目數 | 判斷需求完整性與可測試性 | A1 / A4 | critical requirement 不可未釐清 | Notes、source conflict list |
| Coverage Rate | 需求、頁面、API、RBAC 被 case 覆蓋比例 | 判斷 Test Case 是否足夠 | A2 / A4 | critical scope 100% covered | coverage matrix |
| Pass Rate | Passed / Executed | 判斷本次測試結果是否可放行 | A3 / C2 | release gate 依 severity 與 critical scope 判斷 | Test Report、Jenkins result |
| Automation Rate | 可自動化案例中已實作比例 | 判斷人工成本下降程度 | B / C | 先以 smoke/API/data/RBAC critical scope 為主 | automation backlog |
| Flaky Rate | 非產品問題造成不穩定失敗比例 | 判斷 automation report 是否可信 | B / C | critical gate 不可依賴高 flaky case | retry history、flake log |
| Escape Defect | 上線後才發現的缺陷 | 衡量 T1-T7 gate 是否漏攔 | C / D | L0/L1 escape 需做 RCA | incident report |
| MTTR | 從問題發現到恢復的時間 | 衡量 T7/T8 與 rollback/incident 效率 | C | 越短越好，需建立趨勢 | alert log、incident timeline |

---

## 5. D 治理與分工追蹤

這張清單是 v0.5 的落地管理核心。每一項都要能追蹤 Source of Truth、DoD、Owner / RACI、Risk acceptance，避免跨團隊任務只有口頭共識。

| Workstream | Deliverable | Source of Truth | DoD | Owner | RACI | Risk acceptance | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A. 測試設計 | A1 Test Plan AGENT & SKILL | PRD、Figma、RA、OpenAPI、RBAC、AGENTS.md | AI 可依需求產出符合模板的 Test Plan，且 scope/risk/ready/schedule 清楚 | QA Team | R: QA / A: QA Lead / C: PM, RD / I: Team | 缺核心來源不可自行補需求 | 待建置 | Test Plan sample、prompt run log |
| A. 測試設計 | A2 Test Case AGENT & SKILL | AGENTS.md、generate-testcases、templates | AI 可產出 BrowserStack CSV、Readable Excel，並通過 validate-testcases | QA Team | R: QA / A: QA Lead / C: PM, RD / I: Team | CSV ERROR 不可進入 handoff | 待建置 | CSV、Excel、validation log |
| A. 測試設計 | A3 Test Report AGENT & SKILL | Test Case、Jenkins result、bug list、report template | AI 可依模板產出 Test Report，含 pass rate、bug count、建議與追蹤 | QA Team | R: QA / A: QA Lead / C: PM, RD / I: Team | 缺測試結果不可宣稱通過 | 待建置 | Test Report sample |
| A. 測試設計 | A4 Coverage / Traceability | PRD/Figma/API/RBAC 到 case/result/bug | 每個 critical scope 可追溯來源、案例、結果與風險接受 | QA Team | R: QA / A: QA Lead / C: PM, RD / I: Team | critical scope 未覆蓋需 Conditional Go | 待建置 | coverage matrix |
| B. 自動化驗證 | B1 API automation code + AGENT & SKILL | A2 Test Case、OpenAPI、RBAC matrix | 可由 Test Case 產出 API test code，驗 contract/schema/data/RBAC | Frontend Team | R: FE / A: FE Lead / C: QA, BE / I: Team | critical API 500 或 schema drift 不可放行 | 待建置 | API test repo、pytest report |
| B. 自動化驗證 | B2 UI automation code + AGENT & SKILL | A2 Test Case、Figma、selector contract | 可由 Test Case 產出 UI automation，含 selector/test data/env/blockers | Frontend Team | R: FE / A: FE Lead / C: QA / I: Team | 缺 selector 或 test data 不可標 Ready | 待建置 | Playwright report、trace |
| B. 自動化驗證 | B3 Data / RBAC automation | A2 Test Case、RBAC matrix、data rules | critical KPI/formula/role x page/action/API 100% pass | Backend Team | R: BE / A: BE Lead / C: QA, FE / I: Team | 非 critical 例外需 risk acceptance | 待建置 | data diff、RBAC result |
| B. 自動化驗證 | B4 Automation handoff | Manual Case、automation candidate、blockers | QA 能交付 RD 可接手的 Automation Test Case MD | QA Team | R: QA / A: QA Lead / C: FE, BE / I: Team | 不可把人工判斷硬標 automation | 待建置 | Automation Test Case MD |
| C. 監控與放行 | C1 Jenkins CI | automation code、env vars、credentials | 支援排程、上版觸發、手動觸發，並保留 artifact/report | Develop Team | R: DevOps / A: Develop Lead / C: QA, FE, BE / I: Team | Jenkins 無 report 不可當 gate 證據 | 待建置 | Jenkins job、build artifacts |
| C. 監控與放行 | C2 QA Gate Checklist | Test Report、Jenkins、defects、risk acceptance | 放行前每項有綠黃紅、證據、owner | QA Team | R: QA / A: QA Lead / C: PM, RD / I: Team | L0/L1 未解不可 Go | 待建置 | Gate checklist |
| C. 監控與放行 | C3 Report / Teams 通知 | Jenkins result、report link、Teams webhook | Jenkins 完成後回傳 summary、failed list、report link | Develop Team | R: DevOps / A: Develop Lead / C: QA / I: Team | 通知失敗需保留 Jenkins artifact link | 待建置 | Teams message sample |
| C. 監控與放行 | C4 Sandbox / Reset / Seed / Chaos | QA env、seed fixtures、destructive guard | QA 可 reset/seed/cleanup，STAGE/PROD 禁 destructive | Develop Team | R: DevOps/RD / A: Develop Lead / C: QA / I: Team | destructive 可誤跑 PROD 為紅燈 | 待建置 | reset API、audit log |

---

## 6. QA Gate Checklist

| Gate | Check Item | 綠燈條件 | 黃燈條件 | 紅燈條件 | 必須證據 | Status | Owner | 對應 T |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Severity | L0 blocker | L0 = 0 | 不適用 | L0 >= 1 | defect list、impact scope | 待確認 | QA / Team | T5-T6 |
| Severity | L1 critical | L1 unresolved = 0 | L1 已修但待 regression | L1 unresolved >= 1 | defect list、regression result | 待確認 | QA / RD | T5-T6 |
| Requirement | 需求完整性 | critical source 完整且衝突已記錄 | 有缺來源但不影響本次 scope | 核心需求缺失或互相衝突未釐清 | source mapping、Notes | 待確認 | QA / PM / SA | T1-T5 |
| Test Design | Test Plan / Case / Report | 三份 QA 產物皆符合 DoD | 部分 WARN 已 review | 缺任一核心交付物 | Test Plan、CSV、Excel、Report | 待確認 | QA | T5-T6 |
| Coverage | Critical coverage | critical requirement/page/API/RBAC 100% mapped | 非 critical gap 有 risk acceptance | critical scope 無 case 或無 result | coverage matrix | 待確認 | QA | T5 |
| Jenkins | CI 可執行 | job pass 且 artifact 可查 | 非核心 flaky 已追蹤 | Jenkins 無法跑或核心 smoke fail | Jenkins build、HTML/JUnit report | 待確認 | Develop Team | T4-T8 |
| API | API 不得 500 | critical API 0 個 500，schema pass | 非核心 endpoint retry 後通過 | critical API 500 或 schema drift | pytest report、schema diff | 待確認 | QA / FE / BE | T4-T5 |
| Data | 核心資料正確 | KPI/formula/front-back sync 100% pass | 非核心差異已列 Notes | 決策資料錯、公式錯、時間規則錯 | data diff、expected/actual | 待確認 | QA / BE | T4-T5 |
| RBAC | 不得越權 | role x page/action/API 100% pass | 低風險文案待修 | denied role 可進頁、可操作或 API 成功 | RBAC matrix result、401/403 evidence | 待確認 | QA / BE / FE | T4-T5 |
| UI | Critical UI 可用 | 核心頁無遮擋、斷字、流程中斷 | 非核心 RWD/copy 小問題 | 重要資訊被遮擋或主要操作不可用 | screenshot、trace、UI findings | 待確認 | QA / FE | T4-T5 |
| Sandbox | Destructive guard | QA 可 reset/seed，PROD 禁 destructive | guard 待補但未跑 destructive | destructive 可誤跑 PROD 或無 audit | ENABLE_DESTRUCTIVE、audit log | 待確認 | Develop Team | T4-T8 |
| Release | Go/No-go 證據 | Test Report 完整且建議清楚 | Conditional Go 有 owner/due date | 無 Test Report 或風險無 owner | release summary、risk acceptance | 待確認 | QA / Team | T5-T6 |
| PROD | Post deploy health | T7 smoke pass，T8 synthetic 正常 | 非核心 monitor warning | PROD smoke fail 或 synthetic 持續 fail | smoke result、alert log | 待確認 | DevOps / SRE | T7-T8 |

---

## 7. Roadmap

| Phase | 目標 | 產出 | Owner |
| --- | --- | --- | --- |
| P0 | 對齊 v0.5 金字塔語言 | T1-T8 品質生命週期、A/B/C/D 分工與治理清單 | QA |
| P1 | A 測試設計先落地 | Test Plan、Test Case、Test Report、Coverage/Traceability 的 AGENT & SKILL | QA Team |
| P2 | 先跑一個區塊功能 | 一個功能從需求到 Test Case、Automation handoff、Report 可追溯 | QA Team |
| P3 | B 自動化驗證並行 | API/UI/Data/RBAC automation candidate 與可維護 code 產出流程 | Frontend Team / Backend Team / QA Team |
| P4 | C Jenkins 與 Report 並行 | Jenkins job、report artifact、Teams summary、manual trigger/schedule | Develop Team |
| P5 | C QA Gate 固定 | QA Gate Checklist 與 Go/Conditional Go/No-go 範例 | QA Team |
| P6 | C Sandbox 能力 | reset、seed、cleanup、chaos、audit、destructive guard | Develop Team |
| P7 | 正式治理 | Weekly QA Governance、coverage trend、flaky trend、escape defect、risk review | QA / Team |

### 7.1 第一階段最小可行落地

| 順序 | 先做什麼 | 對應能力 | 預估時間 | 成本 | 為什麼先做 |
| --- | --- | --- | --- | --- | --- |
| 1 | 固定 v0.5 金字塔與 T1-T8 語言 | A/B/C/D | 0.5 天 | 低 | 先讓團隊抓到主論點 |
| 2 | 做 A1-A4 的 DoD 與 AI 輸出格式 | A / D | 1-2 天 | 中 | 先讓 QA 產物變可信 |
| 3 | 選一個功能區塊跑完整流程 | A / D | 1-2 天 | 中 | 不求量，先證明流程順 |
| 4 | 產 Automation Test Case MD | B4 | 1 天 | 中 | 讓 Frontend/Backend Team 可接手 |
| 5 | 接 API/UI/Data/RBAC automation MVP | B | 3-5 天 | 中 | 把可重複驗證轉成 code |
| 6 | 接 Jenkins + Report + Teams | C | 2-3 天 | 中 | 讓 T4/T5/T7/T8 有可查證據 |
| 7 | 補 Sandbox reset/seed/chaos | C / D | 3-7 天 | 高 | 讓測試環境可重複、可清理、可模擬異常 |

---

## 8. Appendices

### 8.1 Test Case 測試類型定義

| 測試類型 | 定義 | 常見驗證 | 產出重點 | 來源規範 |
| --- | --- | --- | --- | --- |
| Happy path | 使用者主要成功流程，確認功能在正確條件下可以完成 | 登入成功、查詢成功、資料顯示成功、下載成功、後台上傳成功 | 每個頁面/功能至少 1 條，Expected Result 要確認畫面與系統狀態 | `generate-testcases` |
| Negative | 錯誤輸入、無權限、異常狀態，確認系統會正確拒絕 | 必填欄位留空、格式錯誤、RBAC denied、double click、上傳錯檔 | 需驗錯誤訊息、按鈕不可送出、資料不送出、API 401/403、不得建立重複資料 | `generate-testcases` |
| Boundary | 長度、數值、日期、分頁、特殊字元等邊界值 | 0/1/max/max+1、min-1/min/max/max+1、start=end、start>end、page=0、emoji、SQL/HTML injection | 有輸入限制就要測；若 spec 沒寫限制，Notes 標示需確認規格 | `generate-testcases` |
| UI copy/layout | Figma 文案、欄位、表頭、狀態與 RWD 可用性 | page title、button text、table header、form label、placeholder、empty/loading/error、tooltip、RWD 遮擋 | 每個頁面至少 1 條；以是否明顯跑版、重疊、截斷、文案錯誤為主 | `generate-testcases` |
| RBAC | 角色、頁面、操作與 API 權限驗證 | menu visibility、page access、View/Create/Edit/Delete/Export/Download/Import/Publish、API 401/403 | 每個 role + page 一條；UI 隱藏不等於安全，backend enforcement 必須驗 | `AGENTS.md` |
| API Contract | API status、envelope、schema、結構一致性 | HTTP status、code/data/message、strict JSON Schema、structure signature consistency | 保留 API path/query key 原文；錯誤訊息要可讀 | `generate-api-tests` |
| Report/Download | 匯出內容、欄位、筆數、status mapping | 檔名、MIME、非空檔、欄位、筆數、金額/數量、列表/詳情/下載狀態一致 | 有下載/匯出就要測；不得外露 DB Status 原碼 | `generate-testcases` |
| Upload Logic | 後台上傳或設定後，前台資料是否依規則計算與同步 | 後台上傳 A/B 值，前台計算 C 值；檔案格式錯誤；重複上傳；發布後回讀 | 要驗前後台一致、公式/轉換邏輯、資料覆蓋安全、錯誤提示 | `AGENTS.md`、`generate-testcases` |
