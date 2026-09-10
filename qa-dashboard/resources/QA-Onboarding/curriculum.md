# 星舟快充｜前三個月 QA 培訓

更新：2026-09-07。以下是培訓目標，依 mentor Review、實際版本與 Reviewed Cases 調整，不代表已執行完成。

## 第 1 個月：看懂星舟快充，完成受指導的回歸

熟悉會員端 LIFF、管理後台、充電站／樁／槍與訂單的關係；跟著資深 QA 執行 Reviewed Test Cases，記錄真實結果。

### 要學會

- 從本次 PRD／RA／Figma、API／OCPP 規格找功能名稱與預期，不能自行補需求。
- 辨識會員端與後台的操作角色；了解 LIFF 掃碼起充、隨插即充、後台遠端命令是不同路徑。
- 認識可用／充電中／離線等樁槍狀態；實際文字與狀態 mapping 以本輪規格為準。
- 依 Readable View 全部步驟執行，記錄 PASS／FAIL／BLOCK 與未執行原因。
- 以 Case ID、時間、樁／槍及訂單 ID 串起畫面、API 與 OCPP evidence，不取任意最新訂單。
- Bug 採白話功能名、50 字內摘要與可重現步驟，證據引用原紀錄。
- 區分 Stage／RT／正式環境；帳密只用安全 reference，與 mentor 確認專用測試資產。

### 適合任務

- 在 mentor 帶領下完成一輪星舟快充 Stage smoke／指定回歸，範圍由當次 Reviewed Cases 決定。
- 跟跑 LIFF 掃碼起停充：觀察起充、MeterValues、停止、後台訂單及適用的付款／發票狀態。
- 使用 Automation QA 交接的既有 runner，不自行修改訊息序列；連線前確認 pile-level lock。
- 整理一次失敗案例為 Bug Draft；正式開單放到本次指定 QA 主單下。

### DoD／驗收

- 選定案例的所有步驟有結果與 evidence；受阻案例有原因及下一位 owner。
- 能說明「WebSocket 已連線」「停止訊息已送出」與「訂單結算完成」的差別。
- Bug 名稱對齊本次 UI／Test Case；摘要不超過 50 字且包含環境、步驟、實際／預期。
- 同一樁／槍、會員與付款 fixture 不與他人搶用，測試後關閉 runner 並記錄 cleanup。

## 第 2 個月：參與星舟快充 Test Plan 與案例設計

在資深 QA Review 下，把一個有明確來源的星舟功能拆成可執行案例，涵蓋例外、權限、時間邊界與下游訂單結果。

### 要學會

- 比對同一版本／Phase 的 PRD、RA、Figma、API 與 RBAC；將缺漏、衝突、版本不符分開記錄。
- 從費率、優惠／折抵、訂單或遠端命令擇一練習；來源未定義的情境先列問題，不寫成正式預期。
- 區分 API_CONTRACT、API_E2E、UI_API_CROSS_LAYER 與 PROTOCOL_EVENT，不能只憑 HTTP 200 判定成功。
- 設計角色允許／拒絕、重複操作、斷線、非 Accepted 回覆與跨費率時段等適用情境。
- 使用 transaction／busId／order ID 與樁、槍、會員、時間範圍做訂單匹配。
- 依確認的單位換算與 rounding 核對電量、費率、優惠與金額；不自訂容許誤差。
- 標示 AUTOMATE_NOW／AUTOMATE_LATER 及 fixture、access、cleanup 的缺口。

### 適合任務

- 選本輪有完整來源的一項功能，例如充電費率、優惠折抵或後台遠端起停充，協助 Test Plan 與 Test Case 初稿。
- 設計一組 UI／API／OCPP 與訂單結果的證據對照，與 Automation QA 確認 runner 能力。
- 以當次 QA 主單追蹤 Bug，確認修復 build 後複驗原失敗步驟與必要回歸。
- 分享 AI 如何協助設計與整理；Review AI 產出，不把缺漏自動補成產品規則。

### DoD／驗收

- 案例有來源、前置、逐步 Expected Result、資料與 cleanup，通過 QA Leader Review 後才進執行。
- 至少一組所選功能的正常、例外／邊界及權限情境有合理 coverage 說明。
- 涉及充電的案例能交代起充路徑、協定 trace、訂單匹配及結算終態；沒有下游證據就列缺口。
- 報告統計與案例結果一致；局部 Bug 複驗不與全量回歸直接加總。
- 實車／實體案例交給對應 owner，不能使用 simulator 冒充驗證。

## 第 3 個月：承接星舟快充功能的 QA Cycle

在資深 QA 協助風險判斷下，推進一個明確範圍的星舟功能，從需求對齊、案例 Review、測試及 Bug 複驗到 UAT／Release 建議。

### 要學會

- 與 PM／RD 對齊 scope、版本、驗收條件、依賴與 QA 估點；Sprint 排程由 PM 決定。
- 安排手動與自動化 lane，交接包含 Gate、outputs、evidence、資源鎖、blockers、cleanup 與 next action。
- 辨識連線、協定、平台 API、UI、計費及非同步副作用的證據差異，不憑猜測指定 root cause。
- 依已確認需求驗證訂單完成與適用的付款／發票終態；真實付款、退款、儲值或發票異動另交授權 owner。
- 整理同一人工 flow 的執行次數與既有 coverage；第二次執行後建立 automation handoff。
- 說明已測、未測、缺陷與殘餘風險，提供 Release 建議，不代替 PM／團隊做正式放行。

### 適合任務

- 負責一個星舟功能或版本內明確 scope 的完整 QA Cycle，不預設獨立承接整個平台。
- 協調一組需 API／UI／OCPP 與訂單證據的回歸，依可用資產安排，避免並行互相污染。
- 將重複人工 flow 交接 Automation QA；缺條件保留 owner 與解除條件。
- 更新工作台專案進度及結果來源，將框架改善機會放入優化候選，等待使用者選取。

### DoD／驗收

- Plan、Reviewed Cases、execution evidence、Bug／retest 與報告之間可透過 ID 與來源追溯。
- 每個 scope 案例有明確執行狀態；未解 Bug、環境缺口與資料限制透明，不虛報完成。
- 可提供 UAT／Release 建議與必要補測範圍；重大風險由資深 QA／PM／RD 一起確認。
- 資源鎖已釋放、runner／背景工作已關閉，cleanup 完成或留下具體 blocker。
- 提出至少一項有依據的 automation handoff 或可重現改善問題；沒有證據不宣稱效能提升。

## 來源與操作邊界

以 cloud-charging-qa 的 charging-e2e／source-map／defect-routing、qa-cycle-team 及 write-bug 為準。限本次允許的 QA／Stage 範圍，不新增正式環境或真實付款等操作授權。
