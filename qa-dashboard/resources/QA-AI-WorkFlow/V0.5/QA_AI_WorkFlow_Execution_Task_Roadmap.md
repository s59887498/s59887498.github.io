# QA AI WorkFlow 執行 Task 表

> 版本：v0.5-task  
> 專案示範：企業營運管理中心  
> 用途：把 A 測試設計、B 自動化驗證、C 監控與放行拆成可執行 task，並定義觸發時機、環境、報告保存、測試資料前置與預估時間。

---

## 0. Executive Summary

這份文件是 v0.5 的執行版 Task Roadmap。  
主目標不是一次把所有功能都自動化，而是先拿 **登入、權限驗證、L4 營運績效** 做 Stage 1 試行，確保這三個模塊每週都能被追溯、可重跑、可看 report。

執行節奏：

1. **Stage 1：Smoke MVP**，先在 QA RT 環境跑登入、權限驗證、L4 營運績效，涵蓋 T4 / T5 / T7。
2. **Stage 2：Coverage 擴充**，加入正向、反向、邊界值、權限、API Contract，並導入 Sandbox / Reset / Seed，涵蓋 T4 / T5 / T7 / T8。
3. **Stage 3：AI-to-Automation 信任鏈**，人工驗證通過 case 後，自動產出可信自動化驗證並部署到監控，加入 Teams 提醒。
4. **Stage 4：延伸治理**，加入自動開 Bug、AI 探索性測試與週期性治理。

整體預估：**8-14 週**。第一階段預估 **1-2 週**，先證明流程可行，再擴大覆蓋量。

---

## 1. Stage Overview

| Stage | Goal | Scope | A 測試設計 | B 自動化驗證 | C 監控與放行 | T 範圍 | 環境 | 預估時間 | 完成條件 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Stage 1 | Smoke MVP，每週可追溯三個核心模塊是否正常 | 登入、權限驗證、L4 營運績效 | 由 PRD MD、UIUX Mock Up MD 自動產出 Smoke Test Plan / Test Case | API status/smoke logic；UI 固定時間區間畫面與設計一致 | Jenkins 可跑 automation，產 Automation Test Report，保留 history | T4、T5、T7 | QA RT | 1-2 週 | 每週可重跑，有 report history，可追溯來源與 case |
| Stage 2 | Coverage 擴充，補足常見品質風險 | Stage 1 三模塊 + positive/negative/boundary/RBAC/API Contract | Test Plan / Case 擴充測試類型與 coverage mapping | API Contract、RBAC、Data、UI positive/negative/boundary automation | 加入 Sandbox / Reset / Seed，支援可重複測試資料 | T4、T5、T7、T8 | QA Sandbox + QA RT | 2-3 週 | critical coverage 可查，測資可 reset/seed，T8 synthetic 起步 |
| Stage 3 | AI-to-Automation 信任鏈，人工驗證通過後可產可信 automation | Stage 2 覆蓋範圍 | 人工 review passed case 後標記 Ready for Automation | 由 approved case 自動產出可使用自動化程式並部署到 Jenkins | Teams 發送 summary、failed list、report link，建立問題追蹤 | T4、T5、T7、T8 | QA Sandbox + QA RT + STAGE candidate | 3-5 週 | automation 可由人維護，CI/Teams/Report 串起來 |
| Stage 4 | 延伸治理與智能化 | 多功能擴充、探索性測試、缺陷治理 | AI 輔助補 coverage gap 與探索性測試 charter | AI exploratory automation candidate、自動 bug draft | 自動開 Bug、weekly governance、flaky/escape defect/MTTR 趨勢 | T4、T5、T7、T8 | QA / STAGE / PROD read-only | 2-4 週 | 自動缺陷草稿、探索性測試報告、治理週報可用 |

---

## 2. Execution Tasks

| Stage | Workstream | Task | Trigger | Environment | Inputs | Output | Evidence Retention | Test Data Prerequisite | Owner | Estimate | DoD | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Stage 1 | A 測試設計 | 建立 Smoke Test Plan 產出流程 | 新增或更新 PRD MD、UIUX Mock Up MD 時 | 本機 / QA repo | PRD MD、UIUX Mock Up MD、AGENTS.md、templates | Smoke Test Plan draft | `outputs/reports/<feature>_Smoke_TestPlan_v0.1.docx` 或 `.md`，commit 保存 | 不需要固定測資，但需列明測試帳號與固定時間區間 | QA Team | 1-2 天 | 可清楚定義 scope、risk、ready、schedule、T4/T5/T7 範圍 | 待建置 |
| Stage 1 | A 測試設計 | 建立 Smoke Test Case 產出流程 | Smoke Test Plan ready 後 | 本機 / QA repo | Smoke Test Plan、PRD MD、UIUX Mock Up MD | Smoke Test Case CSV/Readable | `outputs/testcases/<feature>_Smoke_BrowserStack_UTF8.csv`、`outputs/testcases/<feature>_Smoke_Readable.xlsx` | 需指定登入帳號、權限角色、L4 固定時間區間 | QA Team | 1-2 天 | 登入、權限驗證、L4 營運績效皆有 smoke case，且 validate pass | 待建置 |
| Stage 1 | B API automation | 產出三模塊 API smoke automation | Smoke Test Case ready 且 API endpoint 明確 | QA RT | Smoke Test Case、OpenAPI/API notes、role token | API smoke test code | `tests/api/smoke/<feature>/`、Jenkins artifact、API report history | QA RT 可用帳號/token；L4 固定時間區間資料存在 | Frontend Team | 2-3 天 | 三模塊 API status 正常，smoke logic pass，失敗訊息可讀 | 待建置 |
| Stage 1 | B UI automation | 產出三模塊 UI smoke automation | Smoke Test Case ready 且 selector/test data 明確 | QA RT | Smoke Test Case、UIUX Mock Up MD、selector contract | UI smoke test code | `tests/ui/smoke/<feature>/`、screenshot、trace、UI report history | 登入帳號、驗證碼策略、固定時間區間資料、L4 頁面入口 | Frontend Team | 3-5 天 | 登入頁、驗證碼頁、時間篩選器、L4 營運績效頁 smoke pass | 待建置 |
| Stage 1 | C Jenkins CI | 建立 Stage 1 smoke Jenkins job | Nightly、release gate、post deploy smoke 需要執行時 | QA RT | API/UI smoke test code、env vars、credentials | Jenkins smoke build | Jenkins build history、HTML/JUnit/Allure report、artifact link | Jenkins credential 可取 QA RT 帳號/token；不需 reset/seed | Develop Team | 2-3 天 | 可手動觸發與排程，report 可追溯 history | 待建置 |
| Stage 1 | C Report History | 建立 Automation Test Report 保存規則 | Jenkins job 完成後 | QA RT / Jenkins | Jenkins result、API/UI report | Automation Test Report history | Jenkins artifacts + `outputs/reports/automation-history/<date>/` 或 report server | 不需要額外測資 | Develop Team | 1-2 天 | Report 含 Title、Result Overview、Run Overview、Pass Rate、History、failed list | 待建置 |
| Stage 2 | A 測試設計 | 擴充 Test Case 類型與 coverage mapping | Stage 1 smoke 穩定後 | 本機 / QA repo | Stage 1 cases、PRD/UIUX、RBAC matrix、OpenAPI | positive/negative/boundary/RBAC/API Contract cases | CSV/Readable Excel、coverage matrix | 需定義 invalid input、boundary data、role accounts | QA Team | 2-3 天 | critical scope coverage 可查，缺口有 Notes | 待規劃 |
| Stage 2 | B API automation | 加入 API Contract 與 negative/boundary automation | 擴充 case review 完成後 | QA Sandbox / QA RT | OpenAPI、case、mock/error rules | Contract/API regression tests | API report、schema diff、history | Sandbox 可 reset/seed；固定 API response baseline | Frontend Team | 3-5 天 | contract、schema、status、error mapping、RBAC denied 皆可驗 | 待規劃 |
| Stage 2 | B Data / RBAC automation | 加入 Data / RBAC automation | RBAC matrix 與 data rule ready 後 | QA Sandbox / QA RT | RBAC matrix、data rule、case | Data/RBAC automation | data diff、RBAC result、401/403 evidence | role accounts、L4 fixed period data、seed fixtures | Backend Team | 3-5 天 | critical KPI/formula/role x page/action/API 100% pass | 待規劃 |
| Stage 2 | C Sandbox / Reset / Seed | 建立可重複測試資料能力 | Stage 2 automation 需要穩定測資時 | QA Sandbox | seed fixtures、reset API、cleanup rule | reset/seed/cleanup jobs | Jenkins pre-action/post-action log、audit log | test tenant、固定週別、L4 資料、role accounts | Develop Team | 3-5 天 | QA 可 reset/seed/cleanup，STAGE/PROD 禁 destructive | 待規劃 |
| Stage 2 | C T8 Synthetic MVP | 建立 read-only synthetic 起步 | Stage 2 smoke/regression 穩定後 | PROD read-only / QA RT | Stage 1 smoke path、monitor rule | Synthetic monitor job | synthetic history、alert log | PROD 僅 read-only；不使用 destructive data | Develop Team | 2-3 天 | T8 可定期監控核心路徑，fail 會進 incident input | 待規劃 |
| Stage 3 | A 測試設計 | 建立 Passed Case to Ready-for-Automation 流程 | 人工驗證 case passed 後 | QA repo | Manual execution result、review notes | Ready-for-Automation case set | approved case list、source mapping | case 必須有 stable selector/test data/env | QA Team | 2-3 天 | 只有人工 review passed 的 case 可進 automation generation | 待規劃 |
| Stage 3 | B Automation Generation | 由 approved case 自動產出可維護 automation code | Ready-for-Automation case set 更新後 | QA repo / automation repo | approved cases、selector contract、test data、env config | API/UI/Data automation code draft | PR、code review、test report | selector/test data/env 完整；缺漏需進 blockers | Frontend Team / Backend Team | 1-2 週 | code 可跑、可 review、可維護，不能只有 AI 可讀 | 待規劃 |
| Stage 3 | C Teams Notification | 建立 Teams 通知與問題追蹤 | Jenkins job 完成或 fail 時 | Jenkins / Teams | Jenkins result、report link、failed list | Teams summary message | Teams QA CI Report channel、message history | Teams webhook/API 權限 | Develop Team | 2-3 天 | summary、failed list、report link、owner 可回傳 Teams | 待規劃 |
| Stage 3 | C Monitoring Deployment | 將可信 automation 部署到監控 | automation code review pass 後 | Jenkins / QA RT / STAGE | reviewed automation code、job config | monitored CI jobs | Jenkins history、report trend | env vars、credentials、report plugin ready | Develop Team | 3-5 天 | T4/T5/T7/T8 能依規則執行，history 可查 | 待規劃 |
| Stage 4 | B AI Exploratory Testing | 讓 AI 產探索性測試 charter 與 candidate cases | weekly governance 或 coverage gap 出現時 | QA repo / QA Sandbox | coverage matrix、bug history、PRD/UIUX | exploratory charter、candidate cases | exploratory report、candidate backlog | Sandbox 可重複測試，避免污染資料 | QA Team | 3-5 天 | AI 只提出 candidate，需人工 review 才納入正式 case | 待規劃 |
| Stage 4 | C Auto Bug Draft | 自動產 Bug 草稿 | Jenkins / synthetic / exploratory fail 時 | Jenkins / issue tracker | failed case、screenshot、trace、logs | bug draft | issue draft、evidence links | issue tracker 權限、severity rule | Develop Team / QA Team | 3-5 天 | 可自動產草稿，但正式開單需 owner review | 待規劃 |
| Stage 4 | C Governance Trend | 建立週期性治理報表 | 每週固定時間 | QA repo / Jenkins / Teams | coverage、pass rate、flaky、escape defect、MTTR | weekly QA governance report | `outputs/reports/governance/<week>/`、Teams summary | report history 可回查 | QA Team / Develop Team | 2-4 天 | 每週可回顧趨勢、風險、下一步 action | 待規劃 |

---

## 3. Trigger Matrix

| Stage | T | When | Automation | Report | History |
| --- | --- | --- | --- | --- | --- |
| Stage 1 | T4 Nightly | 每週固定排程，建議先每週 1-2 次，穩定後改每日 | API smoke、UI smoke | Automation Test Report | Jenkins build history + report artifact |
| Stage 1 | T5 Release Gate | RC 或 release candidate 需要檢查時 | API smoke、UI smoke、Smoke Test Report summary | Release smoke summary | Jenkins build history + `outputs/reports/automation-history/` |
| Stage 1 | T7 Post-PROD Smoke | 部署後 5-10 分鐘，僅 read-only | read-only smoke candidate | Post deploy smoke result | Jenkins / monitor history |
| Stage 2 | T4 Nightly | 每日或每週固定排程 | API Contract、RBAC、Data、UI regression subset | Regression report | Jenkins history + trend |
| Stage 2 | T5 Release Gate | release 前 | critical regression、RBAC、data baseline | Release gate report | Jenkins history + risk acceptance |
| Stage 2 | T7 Post-PROD Smoke | 部署後 | read-only smoke | Post deploy smoke result | monitor history |
| Stage 2 | T8 Synthetic | 每 5-10 分鐘或依成本調整 | read-only synthetic | synthetic summary | monitor history + alert log |
| Stage 3 | T4/T5/T7/T8 | approved automation 部署後 | trusted automation suite | Allure-like report + Teams summary | Jenkins + Teams history |
| Stage 4 | T4/T8 | weekly governance 或 fail event | exploratory candidate、auto bug draft | exploratory report、bug draft | governance report history |

---

## 4. Evidence Retention

| Artifact | Saved Location | Retention | Access Owner | Used By |
| --- | --- | --- | --- | --- |
| Smoke Test Plan | `outputs/reports/<feature>_Smoke_TestPlan_v0.1.*` | 隨 repo 保存 | QA Team | QA review、release input |
| Smoke Test Case | `outputs/testcases/<feature>_Smoke_*` | 隨 repo 保存 | QA Team | automation generation、manual review |
| API Automation Report | Jenkins artifact、`outputs/reports/automation-history/<date>/api/` | 至少保留最近 12 週 | Develop Team | QA/RD triage、trend |
| UI Automation Report | Jenkins artifact、`outputs/reports/automation-history/<date>/ui/` | 至少保留最近 12 週 | Develop Team | QA/RD triage、screenshot/trace |
| Data / RBAC Result | Jenkins artifact、`outputs/reports/automation-history/<date>/data-rbac/` | 至少保留最近 12 週 | Backend Team / QA Team | release gate、security review |
| Jenkins Build History | Jenkins job history | 依 Jenkins retention policy，建議至少 30 builds | Develop Team | CI audit、re-run |
| Teams Notification | Teams QA CI Report channel | 依 Teams retention policy | Develop Team | 團隊追蹤、failed list |
| Governance Report | `outputs/reports/governance/<week>/` | 隨 repo 或 report storage 保存 | QA Team | weekly review、roadmap planning |

---

## 5. Stage 1 Scope Detail

Stage 1 先試行三個模塊：

- **登入**：登入頁、驗證碼頁、登入 API、session/token health。
- **權限驗證**：role account 是否能進入允許頁、denied role 是否被阻擋。
- **L4 營運績效**：時間篩選器、L4 營運績效頁面、固定時間區間資料顯示、API status 與 smoke logic。

Stage 1 暫不導入 Sandbox / Reset / Seed。  
但仍需定義固定測試前置資料：

- QA RT 環境 URL。
- QA 測試帳號與 role account。
- 驗證碼策略或測試繞過方案。
- L4 營運績效固定時間區間。
- 該時間區間內應存在可驗證資料。
- Jenkins credentials 與 env vars。

Stage 1 的完成判準：

- A 可由 PRD MD / UIUX Mock Up MD 產 Smoke Test Plan 與 Smoke Test Case。
- B 可跑 API smoke 與 UI smoke。
- C 可在 Jenkins 上執行，產 Automation Test Report。
- Report 有 history，可查每週結果。
- 三個模塊的來源、case、automation、report 可互相追溯。
