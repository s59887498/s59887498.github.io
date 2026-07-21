# QA Workflow Agent：現況成果與 Loop Agent Roadmap

> 版本：v1.0  
> 更新時間：2026-07  
> 目前定位：L3 Guardrailed QA Workflow Agent  
> 目標：將 QA 方法、交付物、automation 與品質證據串成可治理的工作流，下一階段再升級為可控的 Quality Loop。

---

## 0. 一句話摘要

目前已完成的不是單一 Prompt，而是一套具備 Mode、Gate、Skill routing、repo boundary、Output Contract、traceability 與 safety stop rule 的 QA Workflow Agent。

它已能協助完成或治理 Test Plan、Test Case、Test Report、automation handoff 與跨 repo automation 任務；但仍需要真實需求、環境、測資與權限作為輸入，尚未具備持久狀態與有限自修重跑的 loop。

---

## 1. Agent 目前擁有什麼

| 能力層 | Agent 擁有的能力 | 已落地機制 | 對品質工作的價值 |
| --- | --- | --- | --- |
| Workflow orchestration | 依任務選擇 Test Plan、Test Case、Automation、Test Report 或 Full E2E Mode | hdre-qa-workflow、Mode-specific references | 不讓不同階段共用錯誤 checklist，讓任務能按可用資料前進 |
| Readiness & Gate | 在建立交付物或執行前判斷 PASS、PARTIAL、BLOCK | Readiness Checklist、Missing/Not Required/Blocked、Mode Gate | 缺資料時不補造規格，也不把可做工作一起停掉 |
| QA knowledge system | 依來源與需求選用測試技法、coverage rule 與專案守則 | AGENTS、Methodology、Theory、Examples、Templates、Skills | 將 QA 思維從個人經驗沉澱為可重複的方法 |
| Deliverable control | 產出或 Review Test Plan、Test Case、Test Report、Automation handoff | 專用 Skills、Word/Excel/CSV/Markdown templates | 文件格式、語言、路徑與可追溯性一致 |
| Cross-repo routing | QA 文件與正式 executable automation 正確分流 | codex_qa_repo_skeleton 與 Automation_HDRE 邊界 | 不把規格、文件、測試程式與執行設定混在一起 |
| Evidence & safety | 驗證、證據、secrets、destructive test 與 release boundary 有明確規則 | CSV validator、Output Contract、env-var rule、stop rules | Agent 可以前進，也能明確知道何時必須停止並交給人 |

---

## 2. 已完成與持續推進的成果

| 推進主題 | 已完成內容 | 已驗證或可量化成果 | 持續推進方向 |
| --- | --- | --- | --- |
| QA AI Workflow | 建立 AGENT、SKILLS、五種 Mode、Gate、repo routing 與 Output Contract | Test Plan、Test Case、Test Report 可依固定規則產出或 Review；已有 8 個 QA 專用 Skills | 擴充 traceability、review 與 execution evidence |
| 星舟快充 API E2E | 將回歸測試轉為 API E2E，並持續將子功能轉為 API automation | 原本約一天的人工作業縮短為約 30 分鐘腳本執行，約節省 94% 執行時間 | 擴大可信 regression 範圍與 CI 執行 |
| 壓力與峰值測試 | 完成星舟快充事業的壓力峰值測試腳本 | 建立效能驗證能力與後續基線的起點 | 納入排程、結果趨勢與容量風險判讀 |
| QA Ownership | 承接星舟雲、地端充電、EOMC 三個專案品質交付 | 從測試執行擴大為 scope、risk、交付與跨團隊品質溝通 | 建立更穩定的專案品質指標與 review 節奏 |
| 新人培訓 | 建立三個月培訓計畫與進度追蹤 | 已協助完成 EOMC 三個 Sprint 測試交付 | 將測試方法、review checklist 與產出範例轉為可複製教材 |
| QA Governance | 推進 Bug Flow、交付流程、進度控管與 QA Review | 已建立流程優化方向與落地節奏 | 收斂成可追蹤狀態、evidence 與週期性品質回顧 |

---

## 3. 成熟度定位

| Level | 定義 | 目前狀態 | 判斷依據 |
| --- | --- | --- | --- |
| L1 Prompt Template | 有一致的輸入格式與產出要求 | 已完成 | 可用結構化 Prompt 指定 feature、source、scope 與 Expected Output |
| L2 Task Skills | 針對單一交付物有可重複執行的專用能力 | 已完成 | Test Plan、Test Case、Test Report、API/UI handoff、validator、EOMC guardrail 等 Skills 已建立 |
| L3 Guardrailed Workflow Agent | 任務可被路由、Gate 管理、分流、驗證並留下 evidence | 目前位置 | 五種 Mode、PASS/PARTIAL/BLOCK、跨 repo routing、Output Contract 與安全停止條件已落地 |
| L4 Stateful Quality Loop | 可保存 run state、分類結果，在允許範圍修正並有限次重跑 | 下一階段 | 尚缺 Run Manifest、failure taxonomy、retry budget 與 controlled repair policy |
| L5 Event-driven QA Ops | 由 PR、Nightly、Release、monitor event 觸發可信的品質運作 | 長期方向 | 需建立 CI trigger、可信 automation suite、report trend、issue draft 與治理節奏 |

---

## 4. Prompt 還需要嗎？

需要，但 Prompt 已從詳細指令變成結構化任務單。

| 使用者或系統必須提供 | Agent 可自行判斷與處理 |
| --- | --- |
| Feature、project、Sprint/Phase、scope、Expected Output | Mode、Gate、下一個可執行動作 |
| PRD、RA、Figma、API Spec、RBAC、既有 Test Case 或 automation | 子 Skill、測試設計方法、coverage 與交付格式 |
| Environment、Base URL、測資、credential 的環境變數名稱、cleanup、destructive permission | repo routing、產物路徑、validation、traceability、risks、blockers |
| 真實產品決策、release decision、risk acceptance | 不補造需求，保留差異與 evidence，交由 owner 決策 |

---

## 5. 從 Workflow 升級為 Loop Agent 還缺什麼

| Loop 元件 | 現況 | 下一步補強 | 結束或升級條件 |
| --- | --- | --- | --- |
| Run State | Gate 與產物可追溯，但沒有每次 run 的持久狀態 | 建立 Run Manifest，記錄來源版本、scope、case、環境、允許操作、結果與 cleanup | 任一任務可中斷、續跑、回查且不遺失上下文 |
| Execute & Collect | 可執行 automation 並回報結果 | 將 command、result、log、trace、screenshot、report 以 run 為單位保存 | 每個 PASS、FAIL、BLOCK 都有 evidence link |
| Failure Taxonomy | 已能標示 blocker，但尚未形成執行層的失敗分類 | 分為 Product、Test Code、Environment、Test Data、Credential、Spec Gap、Flaky | 不再把所有失敗都視為可以 retry |
| Controlled Repair | 可由人修正測試與設定 | 定義可自修範圍，例如 selector、等待條件、test data setup；產品行為不可自行掩蓋 | 只有明確允許的變更才能進入 retry |
| Retry Budget | 沒有統一的重試策略 | 設定有限次數、退避與終止條件 | 達上限或碰到 Product/Spec/Permission 問題時結束為 FAIL 或 BLOCK |
| Human Approval | QA review 與 release decision 由人進行 | 將 bug draft、risk acceptance、release recommendation 設為 human approval point | Agent 提供 evidence 與建議，人保留決策權 |
| Event Trigger | 已有 Jenkins、Nightly、Release 的規劃 | 從單一可信 API regression 開始串接 CI event | PR、Nightly、Release 可觸發對應 suite 並回收 trend |

---

## 6. 下一階段 Roadmap

| Phase | 目標 | 交付物 | 完成條件 | 安全邊界 |
| --- | --- | --- | --- | --- |
| P1 Run Manifest | 建立跨 workflow 與 automation 的狀態模型 | run manifest schema、run directory、state transition、evidence index | 每個 automation run 都可回查輸入、狀態、結果與 cleanup | 不保存 secret value，只保存 env var name 與 access status |
| P2 Safe Execute-Classify-Retry | 建立單一 staging 或 QA API regression loop | result parser、failure taxonomy、retry policy、summary report | 只針對允許問題有限次重跑，所有結果有明確分類 | 禁止 production destructive action；產品 bug 與規格缺口不得自修 |
| P3 Review & Change Guard | 建立 automation-ready 與人可接手的審查鏈 | Ready-for-Automation checklist、selector contract、test data contract、review record | AI 產物能被 QA/RD review、維護與追溯 | 變更測試預期或 release recommendation 需 human approval |
| P4 CI & Quality Governance | 用 event 驅動可信 automation 與品質趨勢 | Jenkins integration、Nightly/Release trigger、report history、bug draft、weekly trend | 不靠人工追問即可查到 coverage、pass rate、flaky 與未處理風險 | 未達可信度的 suite 不得作為 release gate 唯一依據 |

---

## 7. Loop Agent 的核心流程

1. 讀取任務、來源與 Run Manifest。
2. 確認 Gate、允許操作與要執行的 case。
3. 執行 automation，收集結果與 evidence。
4. 分類失敗原因。
5. 只有在 policy 允許時修正測試設定或測資，並在 retry budget 內重跑。
6. 產出 PASS、FAIL、BLOCK 或 NOT IMPLEMENTED 結果與下一步。
7. 需要產品決策、正式開 Bug、release decision 或 risk acceptance 時交給人。

---

## 8. 不可跨越的安全邊界

- 不自行新增或變更產品需求、Expected Result、API path、permission key 或 status mapping。
- 不將帳密、JWT、API Token、OTP、付款資料寫入程式、文件或 Prompt。
- 不對 production 執行未經當次允許的寫入、刪除、退款、批次異動或資料清除。
- 不以無限 retry 掩蓋產品缺陷、環境問題或規格缺口。
- 不把未執行結果寫成 PASS，也不把 Draft 文件寫成已完成驗證。

---

## 9. 結論

目前已完成 QA Agent 從知識、方法、格式到 workflow governance 的底座，並已有 automation 效益、專案品質交付與人才培訓的實際成果。

下一階段的重點不是增加更多 Prompt 或更多 Agent，而是補齊 run state、execution feedback、failure classification、controlled retry 與 human approval，讓既有的 QA Workflow Agent 升級成可信的 Quality Loop。
