# HDRE QA 工作流程

> 版本：2026.09.07（workspace 現況快照）

適用 HDRE 的正式 QA 與 API／UI／OCPP 協作。此檔沿用舊檔名以保留既有正文網址，內容已由 EOMC 單一示範更新為跨專案導覽；真正執行仍以外層 Skill 與專案規則為準。

## 1. 先選本次入口，不必每次重跑全流程

| 你要完成的事 | 入口 | 主要交付 |
| --- | --- | --- |
| 規劃測試範圍、風險與時程 | Test Plan | Word 計劃書 |
| 設計或 Review 案例 | Test Case | BrowserStack CSV、Readable Excel |
| 依案例執行並留證據 | Test Execution | Execution evidence、失敗項清單 |
| 實作／執行自動化 | Automation | Automation_HDRE 的可執行測試與結果 |
| 彙整真實測試結果 | Test Report | Word 報告與風險建議 |
| 多個連續階段 | Full E2E | 本次選定產物與 E2E summary |
| 單獨開 Bug 或收斂冗長 Bug | write-bug | 驗證過的 Bug Draft／依授權開單 |

Test Plan／Case 不需要先具備未來的 execution evidence。正式 Test Report 則不能把預定執行項目寫成已完成結果。

## 2. 完整 QA Cycle 的現在順序

| 階段 | 主要負責 | 要留下什麼 |
| --- | --- | --- |
| 需求交接 | PM → QA Leader | 商業目標、scope、來源、acceptance criteria、Source Gap |
| Test Plan | QA Leader | 策略、風險、環境與資料需求、entry／exit criteria |
| QA 估點 | QA Leader | 設計、測試、複驗、回歸、自動化與報告成本及假設 |
| Sprint Planning／Alignment | PM 決定排程，QA 確認 | 依賴、owner、環境、資料與版本，不代替 PM 承諾日期 |
| Test Case Design | Manual QA；Automation QA 做 mapping | 來源對應、逐步操作與預期、Evidence Lane、automation decision |
| Test Case Review | QA Leader | 覆蓋率、來源一致性、可執行性及 Reviewed 狀態 |
| Testing | Manual／Automation 各自通過 Gate 後執行 | 每個案例的實際結果、evidence、資源使用與 cleanup |
| Bug／Retest | Manual QA 與 RD | QA 主單下 Bug、修復 build、原失敗步驟及必要回歸 |
| Test Report／結案 | QA Leader Review，根 Agent 整合 | 已測／未測、缺陷、限制、風險與 Release 建議 |

完整 Cycle 的角色協作依 qa-cycle-team.md；單一交付物可直接走對應 Skill。同一份檔案、task 或充電資源同時間只有一個 writer。

## 3. Gate 與等待狀態分開

PASS／PARTIAL／BLOCK 表示本階段能否可靠前進。PARTIAL 時完成不受缺口影響的工作；BLOCK 只阻擋依賴該缺口的範圍。

WAITING_PM、WAITING_RD、BLOCKED_ENV、BLOCKED_ACCESS 是流程等待原因，不替代 Gate。來源缺漏、明確衝突與版本不一致須分別記錄；不能自己補造 Expected Result。

## 4. 測試前確認六件事

1. 本次 Reviewed Test Cases、project／Sprint／Phase 與 scope。
2. target profile、build、access、角色帳號的安全 reference 與功能入口。
3. 測資、fixture、可重複條件與 cleanup owner。
4. 逐步 evidence 與下游可觀察結果；Case Index 導覽後，依 Readable View 的全部 step rows 執行。
5. Bug 所屬 QA 主單；缺主單只阻擋正式開單，不阻擋安全測試及本機 Draft。
6. 充電案例的 runner、pile／connector、共用 occupancy lock 與專案起充／結算規則；實體測試另交 owner。

## 5. 選正確證據，不只看綠燈

| 情況 | 證據方式 |
| --- | --- |
| API contract | request／response／schema／error，不能宣稱 persistence 已驗證 |
| API E2E | operation 加 read-back、event、report、計費或其他下游結果 |
| UI 一般互動或視覺 | UI state、DOM／layout、必要的 screenshot 或 baseline |
| 金額、RBAC、狀態轉換等高風險 UI | UI action、API response 與下游結果交叉核對 |
| OCPP／MQTT／延遲副作用 | protocol trace 加 business outcome，不只看 acknowledgement |

明列 PASS、FAIL、BLOCK、NOT IMPLEMENTED 及原因；遇到 skipped／not_run 也要說明。Dashboard 的簡化狀態映射另依 data/README.md，不回寫正式案例 schema。

## 6. Bug：先讓 RD 看懂問題

- 採 A 版標題：[功能原名] 具體問題，名稱貼齊本次 UI 或 Test Case。
- 開頭 summary 單段且不超過 50 字；再列環境、前置條件、重現步驟、實際與預期。
- name_source、相關 Case ID 與 evidence 可追溯；完整測試紀錄用連結引用。
- Cycle Bug 建在指定 QA 主單下。星舟雲端依本次主單；LCMS 同時套用 Defect／Development。
- 複驗先確認修復 build、環境及資料，執行原 failed step 加合理回歸。外部留言、改狀態或關單仍依本次授權。

## 7. 什麼時候轉成自動化

依序處理每版回歸、未覆蓋 P0／P1，以及人工已重複兩次的 flow。第 2 次人工執行後建立 Automation QA handoff；缺條件用 AUTOMATE_LATER 記錄 blocker、owner 與解除方式。

自動化實作放 Automation_HDRE，延用 fixture、client、locator、runner；QA repo-local tests 只有明確要求時使用。API case 的 ID、白話標題、步驟與預期透過 report_case metadata 分開呈現。

## 8. 結果放哪裡

| 產物 | 位置（相對 HDRE） |
| --- | --- |
| PRD／RA／Figma／API／OCPP canonical sources | qa_ai_workflow/docs/ |
| Test Case CSV／Readable Excel | qa_ai_workflow/outputs/testcases/ |
| Plan／Execution／Report／Bug Draft | qa_ai_workflow/outputs/reports/ 下的專案／功能目錄 |
| 可執行 API／UI／OCPP 與結果 | Automation_HDRE/ 的既有框架位置 |
| 優化研究與執行結果 | qa_optimization/reports/ |
| 採用決策與 Codex 交接 | qa_optimization/data/decisions.json、qa_optimization/handoffs/ |

正式交付路徑與格式仍依 Mode／專案 Output Contract。來源、Case ID、結果、缺陷與風險需串得回去。

## 9. 與 QA 優化工作台的關係

產品測試流程與內部優化清單分開追蹤。Claude 研究新知及現有框架，更新候選；使用者在工作台選取後，Codex 依交接執行。候選效能問題要先量測，不能直接算作已發現缺陷。

新人培訓已獨立放在工作台主層。此工作流程不再內嵌培訓頁；舊 T1–T8 與 v0.5 示範作為歷史參考，不當作今日 CI／監控已啟用的證明。

## 10. 本次核對來源

- AGENTS.md
- .agents/skills/hdre-qa-workflow/SKILL.md
- .agents/skills/hdre-qa-workflow/references/qa-cycle-team.md
- .agents/skills/hdre-qa-workflow/references/source-gate.md
- .agents/skills/hdre-qa-workflow/references/execution-and-routing.md
- .agents/skills/hdre-qa-workflow/references/output-contract.md
- qa_ai_workflow/AGENTS.md
- qa_ai_workflow/methodology/test-execution-routing.md
- qa_ai_workflow/.codex/skills/write-bug/SKILL.md
- Automation_HDRE/Automation_API_UI-main/AGENTS.md

此頁是本機來源的人工核對快照，不自動同步；不新增或覆寫正式 QA 規則。
