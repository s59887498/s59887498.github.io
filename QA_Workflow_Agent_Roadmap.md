# AI QA Operating System：Evaluation Framework Roadmap

版本：v1.1  
目前定位：Contract-driven AI QA Operating System Foundation  
下一個目標：Evaluation Framework  
長期目標：Evaluation-driven Quality Loop

---

## 1. 願景與定位

這套架構的核心，不是再增加一個會回答問題的 Agent，而是建立讓 QA Agent 能穩定運作的環境。

Agent 需要依賴明確的知識、方法、能力、執行規則、歷史與品質標準，才能在不同專案與不同交付物之間保持一致。

目前已完成 QA Domain Package、Knowledge Contract、Skill Contract、Workflow Runtime、Output Contract 與第一代 validator foundation。這些已構成 AI QA Operating System 的底層。

下一個關鍵不是增加 MCP 數量，也不是直接做無限制的 Loop Agent，而是建立 QA Evaluation Framework。先定義「什麼是好的 QA 產出」，才能讓後續的 feedback、retry、memory 與 CI 有可靠依據。

---

## 2. AI QA Operating System 的六層

| Layer | 作用 | 目前狀態 |
| --- | --- | --- |
| Knowledge | QA 理論、需求來源、規格優先順序、範例與模板 | 已建立 QA Domain Package 的分層與 dependency direction |
| Skills | 產出 Test Plan、Test Case、Report、validation、automation handoff 的可執行能力 | 已有 8 個 QA 專用 Skills，可被 discover 與 routing |
| Methodology | Test Design Map、測試技法選擇、review gate、交付流程 | 已從 Prompt 中抽出為可重複使用的方法 |
| Runtime | Mode、Gate、Skill routing、repo routing、safe stop、Output Contract | 已有 5 Mode 與 PASS / PARTIAL / BLOCK 控制面 |
| Memory | run state、artifact history、failure history、review decision | 目前有交付物與來源的保存，尚未形成 persistent execution memory |
| Evaluation | contract check、quality rubric、golden data、judge、score、feedback | 已有 validator、fixtures、rubric 基礎；完整 framework 是下一階段 |

這個分層代表 Agent 本身只是執行節點；長期品質穩定性來自它背後的 Operating System。

---

## 3. 已完成與持續推進的 Framework 成果

此處只記錄 QA framework 已落地的能力，不以單一公司專案或一次性交付作為成熟度證明。

### 3.1 QA Domain Package 與 Knowledge Contract

- Requirements、Theory、Methodology、Examples、Templates、Skills、Outputs 各自有明確責任。
- canonical content 只維護一份，其餘 layer 以引用或 stable ID 使用，避免內容漂移。
- Theory 不承載專案規格；Examples 不被視為正式需求；Templates 不決定測試技法。
- authoritative source、scope、phase、evidence 與 safety stop rule 已成為交付前的判斷依據。

### 3.2 Methodology Contract

- Test Case 生成先建立 Test Design Map：
  Requirement / Source → Test Condition → Visibility → Theory ID → Coverage Item → Source / Gap。
- 技法選擇依條件載入，而不是一次把所有測試理論塞進 context。
- 等價分割、邊界值、決策表、狀態轉換等 technique tag 必須能回溯到實際 coverage item。
- 規格缺漏會被標示為 gap 或 confirmation need，不會被寫成確定的 expected result。

### 3.3 Skill Contract

- Test Plan、Test Case、Test Report、validation、automation handoff、Markdown 整理與專案守則已拆成 8 個 QA 專用 Skills。
- 每個 Skill 負責一項可驗證的能力，按需讀取 Methodology、Theory、Examples 與 Template。
- Skill 不維護第二份共用理論，以減少 duplicate knowledge 與 maintenance drift。

### 3.4 Workflow Runtime 與 Delivery Contract

- 以 Test Plan、Test Case、Automation、Test Report、Full E2E 五種 Mode 進行 routing。
- Gate 使用 PASS / PARTIAL / BLOCK，區分可以完成、可局部完成與必須停止的工作。
- Prompt Template → Gate → Skill / Repo Routing → Execution → Output Contract 已成為外層 workflow。
- QA 文件與交付物保留在 QA repo；可執行 API、UI、OCPP automation 由 Automation repo 的既有框架承接。
- 建立 Plan → Case → Automation → Result → Report 的 traceability 方向。

### 3.5 Evaluation 與 Defect Contract 的第一代基礎

- Test Case 有 deterministic validator，檢查固定 CSV header、必要欄位、ID、steps 與 output contract。
- framework validator 可檢查 knowledge graph、Methodology wiring 與 Test Design Map 的必要結構。
- Test Case Skill 已有 fixtures、expected output 與 Yes / No rubric，涵蓋 password boundary、decision table、OCPP state transition、缺規格與 PRD / Figma visibility。
- Bug JSON 已定義 title、bug type、environment、severity、priority、module、reproduce steps、actual result、expected result 等必要欄位，並能轉為一致的 Asana description。

這些不是完整 Evaluation Framework，但已是品質閉環最重要的 deterministic foundation。

---

## 4. 目前成熟度與缺口

| Level | 定義 | 狀態 |
| --- | --- | --- |
| L1 Prompt Template | 固定輸入與輸出格式 | 已完成 |
| L2 QA Domain Package | 把 QA 知識與方法外部化 | 已完成 |
| L3 Contract-driven OS Foundation | Skill、Methodology、Runtime、Gate、repo boundary、Output Contract 可協同運作 | 目前位置 |
| L4 Evaluation Framework | 品質模型、golden data、score、judge、feedback、eval regression | 下一階段 |
| L5 Evaluation-driven Quality Loop | 有限次重試、run state、quality history、CI gate 與 human approval | 長期目標 |

目前尚未形成完整 Loop Agent，原因不是缺少生成能力，而是缺少下列可被系統化驗證的環節：

- 跨產物一致的品質維度與分數標準。
- 覆蓋不同情境的 golden dataset 與 regression baseline。
- 經校準的 LLM judge，而不是自由形式的自我審查。
- 結構化 failure taxonomy、feedback packet、retry budget 與 run manifest。
- 可保存的 run state、review decision 與品質趨勢。

---

## 5. QA Evaluation Framework 要評估什麼

Evaluation 的目標是建立品質標準，不是讓產出者自行宣稱結果良好。

### 5.1 Deterministic Contract Eval

適合完全可以程式驗證的項目：

- 檔案、欄位、header、ID、輸出路徑與命名。
- Step 與 Expected Result 的存在性與對應關係。
- Source reference、traceability link、required evidence。
- Bug Draft 的必要欄位、severity / priority 格式與 evidence presence。
- Automation handoff 是否保留 Test Case mapping。

### 5.2 Content Quality Eval

適合由 QA rubric 與 judge 共同判斷的項目：

| 維度 | 問題 |
| --- | --- |
| Source Grounding | 是否只使用可追溯來源，沒有自行補造規格？ |
| Coverage | 是否覆蓋功能、角色、狀態、資料、例外與關鍵流程？ |
| Boundary / Negative | 該測邊界與負向情境時，是否真正有測到？ |
| Business Rule | 是否遵守需求中的條件、決策規則與限制？ |
| Risk | 是否辨識高風險流程、資料與權限？ |
| Traceability | 是否可回溯到 source、condition、case、evidence 與 defect？ |
| Duplicate | 是否存在重複或意義相同的案例？ |
| Readability | Step、expected result、Bug description 是否可執行且可理解？ |

### 5.3 Golden Data 與 Judge Calibration

每個 Eval 都需要 fixture、預期行為與反例：

1. 正常規格：確認方法與 coverage 正確。
2. 邊界規格：確認 Boundary Value Analysis 是否被正確選用。
3. 缺規格：確認 Agent 會產出 gap，而不是猜測。
4. 不可用方法：確認 Grey-box / White-box evidence 不足時會被排除。
5. 失敗樣本：確認 evaluator 能找出少 case、錯 rule、重複與不可追溯內容。

LLM judge 必須以這些資料校準，輸出具體分數、evidence 與 failure code；不能只問 AI 覺得自己做得好不好。

---

## 6. 從 Eval 到受控 Quality Loop

Generate
  ↓
Deterministic Contract Eval
  ↓
Quality Rubric + Calibrated Judge
  ↓
Score / Failure Code / Feedback Packet
  ↓
Threshold met?
  ├── Yes → Output + Eval History
  └── No
        ├── Recoverable → bounded retry
        └── Missing source / conflict / high risk → human owner review

Loop 必須被設計成受控機制：

- 每次 retry 有明確 failure code、限定修正範圍與最大次數。
- retry 只修復可以從既有 evidence 判斷的問題。
- 需求矛盾、資料不足、release decision、風險接受與 destructive action 不進入自動重試。
- 保存產物版本、score、diff、review decision 與 run state，才會形成可用的 Memory。

---

## 7. Evaluation-first Roadmap

### P1：品質模型與 Failure Taxonomy

定義 Test Plan、Test Case、automation handoff、Bug Draft 的共通品質維度、scoring schema、pass threshold、severity rule 與 failure code。

產物：

- Eval schema
- Quality rubric
- Scorecard
- Failure taxonomy

### P2：Golden Dataset 與 Deterministic Regression

擴充 fixtures，加入正例、反例、規格缺漏與多來源衝突情境。將格式、traceability、coverage mapping 與 output contract 的檢查程式化。

產物：

- Golden fixtures
- Expected scores
- Validator regression suite
- Contract check report

### P3：LLM Judge Calibration

讓 judge 依 rubric 對每個品質維度給分、列出 evidence 與 failure code，並與人工 QA review 樣本比對一致性。

產物：

- Judge prompt contract
- Calibration set
- Human / judge agreement report
- Judge drift review process

### P4：Evaluation Orchestrator 與 Bounded Retry

將 Eval result 轉為 feedback packet。只有可修復且未超出 retry budget 的 failure 才允許再生成；其餘回到 owner review。

產物：

- Eval orchestrator
- Run manifest
- Feedback packet
- Bounded retry policy

### P5：Memory、CI 與 Quality Trend

保存 run history、score trend、failure type、人工決策與後續結果；在 Skill、Theory、Methodology 或 Template 變更時執行 Eval regression。

產物：

- Quality history
- Evaluation CI gate
- Score trend dashboard
- Knowledge / Skill change impact report

---

## 8. 不可跨越的治理邊界

1. 沒有 authoritative source 時，輸出 gap，不能自行補規格。
2. Evaluator 必須根據 rubric、fixture 與 evidence，不依自由印象判定。
3. Retry 必須有限次，且每次都可回溯到 failure code 與修正範圍。
4. 正式開單、release、風險接受、權限變更、付款或任何 destructive action 仍由人類 owner 核准。
5. 沒有 execution evidence 時，不能宣稱已完成驗證或已通過。

---

## 9. 總結

目前正在建立的不是單純 QA Workflow，也不只是多個 Agent 串接，而是具有 QA 專業知識、方法、技能契約、執行控制與交付規範的 AI QA Operating System。

下一階段的核心是 Evaluation Framework：

先把「好 QA 產出」變成可驗證、可量化、可回饋的標準，再讓 Agent 根據這些可信訊號有限度地修正與演進。當 score、failure taxonomy、feedback、run state 與 CI regression 都形成閉環時，才會真正走向可信的 Evaluation-driven Quality Loop。
