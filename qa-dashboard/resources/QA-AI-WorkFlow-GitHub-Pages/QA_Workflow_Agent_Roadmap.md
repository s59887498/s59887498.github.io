# HDRE QA 架構與演進

> 版本：2026.09.07（workspace 現況快照）

此頁依 2026-09-07 本機 checkout 的規則與程式整理，包含尚未提交的修改。正式規則仍以根目錄 AGENTS.md、外層 hdre-qa-workflow 與各 repo 的 AGENTS.md／Skill 為準；此頁是導覽摘要。檔案存在不代表所有產品或環境已通過測試。

## 1. 三個工作區，各自負責一件事

| 位置 | 目前責任 | 邊界 |
| --- | --- | --- |
| qa_ai_workflow | 需求來源、QA 知識、模板、12 個專用 Skills、Test Plan／Case／Execution／Report 與 Bug Draft | 正式產品規格主檔在 docs；文件輸出依專案與輪次分流 |
| Automation_HDRE | pytest API／Selenium UI、OCPP runner、fixture、locator、設定與測試結果 | 延用既有框架；不能因為產生腳本就宣稱已驗證 |
| qa_optimization | 本機 Dashboard、研究建議、使用者決策、Codex 交接、優化結果與新人培訓入口 | Claude 研究、使用者選取、Codex 執行；不取代正式 QA 文件 |

## 2. 外層協調：六種 Mode 與分階段 Gate

- Test Plan：先確認需求、scope、風險與策略。
- Test Case：依來源設計或 Review 案例，驗證 CSV／Readable Excel。
- Test Execution：只執行 Reviewed Test Cases，逐步保存 evidence。
- Automation：將合格案例接到既有 API／UI／OCPP 框架。
- Test Report：依真實結果產出 Draft／Interim／Final，不補造證據。
- Full E2E：跨階段協調；只交付本次指定的產物，已有合格文件優先重用。

Gate 使用 PASS／PARTIAL／BLOCK。Source、Automation、Execution／Report 各自判斷；缺少測試環境不會阻擋來源足夠的 Test Plan／Case 設計。

來源需區分 Source Gap、Conflict、Version Mismatch；PRD、RA、Figma、API／OCPP、RBAC 各自負責不同證據面，不能用單一排序強行消除衝突。

## 3. QA 專用 Skills：目前 12 個

| 用途 | Skill |
| --- | --- |
| 計劃書 | generate-test-plan |
| 案例設計 | generate-testcases |
| 案例驗證 | validate-testcases |
| Markdown 案例樹 | organize-testcase-markdown |
| 手動執行與 evidence | execute-testcases |
| 測試報告 | generate-test-report |
| Bug 單 | write-bug |
| QA repo-local API tests（明確要求時） | generate-api-tests |
| UI automation handoff／repo-local scaffold | generate-ui-automation |
| 企業營運管理中心 | eomc-qa |
| LCMS／地端充電 | lcms-qa |
| 星舟雲端充電 | cloud-charging-qa |

這 12 個位於 qa_ai_workflow/.codex/skills；外層 hdre-qa-workflow 是另外一個跨 repo 協調 Skill，不計入 12 個。

## 4. QA Team 已有分工與交接規則

| 角色 | 責任 |
| --- | --- |
| 根 Agent | 分派、處理依賴、整合結論、管理本次授權範圍 |
| qa_leader | Source／Readiness、Test Plan、QA 估點、案例 Review、風險與報告建議 |
| manual_qa | 前置條件、案例設計／執行、evidence、Bug 與修復複驗 |
| automation_qa | automation mapping、API／UI／OCPP 實作、回歸與 evidence |

要求完整 QA Cycle／Team，或符合根目錄定義的跨階段工作時，先由 QA Leader 確認範圍與 Gate；可獨立切分後才並行兩條測試 lane。單一文件或局部修正不強制啟動整隊。

交接需包含 Gate、scope、來源、outputs、evidence、資源鎖、defects、blockers、cleanup、next owner 與 next action。同一檔案、外部 task 或充電資產不能同時被多位 writer 操作。

## 5. 執行以證據通道與共用資源為核心

Test Design、Evidence Lane 與 Automation Decision 分開記錄。Evidence Lane 包含 MANUAL_EXPLORATORY、API_CONTRACT、API_E2E、UI、UI_API_CROSS_LAYER、PROTOCOL_EVENT；可自動化程度則用 AUTOMATE_NOW、AUTOMATE_LATER、MANUAL_ONLY、SCHEDULED。

- 高風險 UI 寫入需連同 API 與下游結果驗證；HTTP 成功不代表完整 E2E 已通過。
- Readable View 才是逐步操作來源；Case Index 只用來選範圍，不得跳過 step rows。
- OCPP／simulator 連線前需取得 pile-level occupancy lock，忙碌時只阻擋依賴該資產的案例。
- Manual QA 可使用既有 harness；新增或改動可重複 runner／message sequence 由 Automation QA 負責。
- LCMS 與星舟雲端分別使用專案 routing、起充路徑與結算驗收，不能混用 endpoint 或預期結果。實車／實體要求不能用 simulator 冒充通過。
- 新增或修改 API case 需有 report_case metadata，報表標題與 ID 分欄，步驟／預期留在明細。

## 6. Bug 與人工轉自動化已更具體

Bug 採 A 版：標題白話、功能名對齊頁面或 Test Case；開頭 summary 單段且不超過 50 字，再列環境、前置、步驟、實際與預期。名稱來源要可追溯，execution evidence 以引用代替整段貼入。

Cycle Bug 建於指定 QA 主單下。星舟雲端沒有固定 Bug project／column；LCMS 另套用 Defect／Development。缺 QA 主單保留 Draft，不猜歸屬。

Automation 優先序是每版回歸、未覆蓋 P0／P1、同一人工 flow 已執行兩次。缺 fixture／selector／access／cleanup 時記錄 AUTOMATE_LATER、owner 與解除條件。

## 7. QA 改善流程已接上本機工作台

1. Claude 根據當次官方新知與目前程式研究；效能未實測時標 hypothesis。
2. 經 validate／merge 更新 optimizations.json，保留 ID 與使用者決策。
3. 使用者在 Dashboard 採用或暫緩；採用後產生 Markdown 交接。
4. Codex 接到交接才執行，保存結果文件並回填狀態。
5. 研究建議改版後須重新確認，不能以舊版交接當作新版授權。

Dashboard 也可讀取專案進度快照；來源日期不等於今日狀態。Claude 排程交接指令已準備，尚無本次已在 Claude 建立排程的證據。

## 8. 後續演進：有局部基礎，仍需驗證

| 方向 | 目前可確認 | 下一步 |
| --- | --- | --- |
| 交付物品質檢查 | Bug contract／validator eval、Test Case eval fixtures 與 rubric 已存在 | 建立跨交付物的共同 baseline 與結果追蹤，先確認誤判率 |
| 框架效能 | 已有候選清單、量測基準與驗收方式 | 同硬體／版本／suite 重跑量測後再決定是否改造 |
| OCPP 覆蓋 | 有 runner 與專案 routing | 依實際支援版本建立需求到案例的 coverage matrix |
| 進度與週期研究 | 有本機資料契約與 Claude 任務 | 首次實際同步及排程試跑，留下結果再認定已運作 |
| CI／趨勢與通知 | repo 有 pytest／報表設定；舊展示站描述了長期構想 | Jenkins job、發布 Gate、Teams 通知與常駐監控需各自取得實際執行證據，不能由文件推定啟用 |

## 9. 本次核對來源

- AGENTS.md
- .agents/skills/hdre-qa-workflow/SKILL.md
- .agents/skills/hdre-qa-workflow/references/source-gate.md
- .agents/skills/hdre-qa-workflow/references/qa-cycle-team.md
- .agents/skills/hdre-qa-workflow/references/execution-and-routing.md
- qa_ai_workflow/AGENTS.md
- qa_ai_workflow/methodology/test-execution-routing.md
- qa_ai_workflow/.codex/skills/write-bug/SKILL.md
- qa_ai_workflow/.codex/skills/generate-testcases/evals/rubric.md
- Automation_HDRE/Automation_API_UI-main/AGENTS.md
- Automation_HDRE/SC_QA_Charge_Stress_Test/modules/resource_lock.py
- qa_optimization/README.md
- qa_optimization/data/README.md

此頁不自動追蹤 repo 變更；下一次同步需重新讀取來源。舊展示版本保存於 qa_optimization/reports/reference-history/2026-09-07/。
