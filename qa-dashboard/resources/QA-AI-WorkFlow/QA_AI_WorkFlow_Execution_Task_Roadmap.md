# HDRE QA 執行與改善追蹤

> 版本：2026.09.07（workspace 現況快照）

舊版按 Stage 1–4 配固定工期與團隊 owner；本版改為目前可確認的能力及下一步。規則已建立不代表每個專案已執行完成，未經本次 scope 估點不填固定天數。

## 1. 目前已有的執行能力

| 工作 | 現況 | 下一步／驗收 |
| --- | --- | --- |
| Source／Readiness Gate | 六種 Mode 與來源一致性規則已建立 | 每輪留下 scope、來源缺口及 Gate，不混用版本 |
| Test Plan／Case／Report | 專用 Skills、模板與輸出規則已建立 | 依正式來源產出並 Review，未執行不能填 Pass |
| QA Team | Leader／Manual／Automation 的分工與 Handoff Contract 已建立 | 完整 Cycle 依 Gate 分派，收齊 evidence 再結案 |
| Bug 精簡與路由 | A 版文字規則、50 字摘要檢查及 Asana contract 已建立 | 名稱貼齊來源，先驗證 Draft，再依專案與主單開單 |
| 手動轉自動化 | Regression、P0／P1、第二次人工 flow 的優先序已建立 | 維護 mapping、blocker 與解除條件 |
| 充電資源協調 | pile-level lock 與 project-specific routing 已有規則／程式 | 每次執行確認 lock、runner、訂單匹配及 cleanup |
| API 報表可讀性 | report_case metadata 規則已建立 | 修改案例時補齊 ID／title／steps／expected，驗證報表 |
| 優化工作台 | 本機資料、人工決策、Markdown 交接與結果回填已實作 | 依候選證據逐項選取，不把研究清單當已完成工作 |

## 2. 下一批改善如何決定

| 方向 | 目前階段 | 需要的證據 |
| --- | --- | --- |
| 測試／報表成本 | 候選、未量測 | 固定 suite 的耗時、CPU／RSS、輸出量與重跑結果 |
| 並行與資源隔離 | 有程式線索，待盤點 | worker／fixture／pile／session 的隔離及 contention 行為 |
| OCPP 版本覆蓋 | 待建立版本對照 | 目前支援版本、需求、Test Case、runner 與下游結果 mapping |
| 啟動等待與日誌 | 候選、未量測 | 必要協定等待與額外成本的可重現比較 |
| 交付物 Evaluation | 已有局部 validators／evals | 共同樣本、baseline、誤判分析與持續追蹤 |
| Claude 定期研究 | 設定交接指令已準備 | 實際排程狀態、第一次試跑與清單更新結果 |
| 最新專案進度 | 可保存快照，需持續核對 | 同版本／scope 的最新測試來源與統計口徑 |

上述候選的即時決策以工作台「優化清單」為準，本頁不複製 pending／queued／in_progress 狀態。

## 3. 每次交接的最小內容

- Scope、project、feature、版本／Phase 與本次要完成的產物。
- Gate、來源與 evidence，明確區分已知事實、假設與缺口。
- 改動或執行範圍、資源／locks、cleanup 與風險。
- Bug／blockers、下一位 owner 與 next action。
- 驗收方式；沒有 baseline 的效能改善先做量測，不先承諾加速百分比。

## 4. 正式流程與來源

- .agents/skills/hdre-qa-workflow/references/qa-cycle-team.md
- .agents/skills/hdre-qa-workflow/references/execution-and-routing.md
- qa_ai_workflow/methodology/test-execution-routing.md
- qa_ai_workflow/.codex/skills/write-bug/SKILL.md
- Automation_HDRE/Automation_API_UI-main/AGENTS.md
- Automation_HDRE/SC_QA_Charge_Stress_Test/modules/resource_lock.py
- qa_optimization/data/optimizations.json
- qa_optimization/tasks/setup-claude-schedule.md

更新日期為 2026-09-07；本頁是能力與改善方向摘要，不是已授權的實作任務或產品測試完成報告。
