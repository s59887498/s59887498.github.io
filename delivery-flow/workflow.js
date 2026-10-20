(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const stages = {
  "intake": {
    "owner": "01 / PM 或維運收單窗口",
    "card": "功能／OP 主卡。",
    "status": "入口：確認需求從哪裡來、誰是 Owner、如何通知與回覆；沿用既有交接進度。",
    "action": "需求、影響、驗收條件、原承諾日期及關聯放在共同主卡；需要哪些職能才建立哪些子卡。",
    "handoff": "出口：把可討論的需求交相關窗口，附主卡連結、要確認的問題與希望回覆日期，請對方確認收到。",
    "time": "主卡建立作日程起點；投入用人日另行補登，不靠卡片停留時間推算。",
    "title": "Product Backlog"
  },
  "planning": {
    "owner": "02 / PM、UIUX、RD、QA；依工作需要",
    "card": "需求主卡保存共識，各職能卡保存自己的投入。",
    "status": "規劃是交付位置，不要求開會前後切暫停或恢復。",
    "action": "確認範圍、驗收、依賴、交期與入口／出口；預估投入用人日，交付預期用日期。",
    "handoff": "出口：確認各組接手人、交付內容及回覆方式，再進入實際需要的設計／開發。可配合既有 Sprint。",
    "time": "相關會議併入各自職能卡的當日投入；跨專案會議另列共用工作，每筆只記一次。",
    "title": "Backlog Refinement"
  },
  "design": {
    "owner": "03 / UIUX，PM／RD 協助決策",
    "card": "需要設計才有 UIUX 工作卡。",
    "status": "入口：需求、驗收與決策窗口齊備，回覆可接手；不逐活動切換計時狀態。",
    "action": "完成設計、互動、邊界情境及決策整理。缺件、交期或範圍變更，回同卡協調。",
    "handoff": "出口：設計稿、決策與變更範圍交 RD，指定接手窗口並請回覆收到；退回沿用原卡。",
    "time": "每天收工集中補投入人日；短任務交付時補。同卡往返保留投入，不以等待日程替代人日。",
    "title": "In Design"
  },
  "development": {
    "owner": "04 / RD",
    "card": "RD 開發與自測交付卡。",
    "status": "入口：接需求／設計或 Bug，確認範圍、條件與日期。圖上的階段沿用既有進度，不逐次記暫停。",
    "action": "開發、自測、Code Review；臨時開會先去開，若交期受影響再協調原承諾與關聯工作。",
    "handoff": "出口：把可測版本、環境、自測及範圍交指定 QA，在同卡留交接內容，請 QA 回覆收到或缺件。",
    "time": "RD 每天收工補自己的投入；需要獨立 Review KPI 時另確認資料，這版不從狀態時間直接產出比率。",
    "title": "In Development"
  },
  "preparation": {
    "owner": "並行 / QA 提前參與",
    "card": "依風險決定獨立準備卡或在 QA 主單記錄。",
    "status": "入口：QA 提前取得需求、驗收與風險，和設計／開發可並行。",
    "action": "依既有 QA 流程整理範圍、案例、資料及風險，需要決策時回同卡確認。",
    "handoff": "出口：讓案例與交付條件可供後續測試接手；不必等 RD 完成才討論。",
    "time": "準備投入在自己的卡以人日補登，不再登到另一張測試主單；同時段的日程不加成整體交付時間。",
    "title": "Test Planning"
  },
  "readiness": {
    "owner": "交接檢核 / RD 交付，QA 確認",
    "card": "RD 交付內容＋QA 主單接手紀錄。",
    "status": "入口：明確 QA 接手人與可測資料；回覆收到或缺件。收到回覆不等於實際開測時點。",
    "action": "建議附版本、環境、自測結果、範圍、驗收及希望回覆日期；具體交付門檻共同確認。",
    "handoff": "出口：QA 回覆可接手與預計結果日期；不足就說明缺什麼、誰補、何時回覆，保持同一卡片。",
    "time": "保留交付／回覆日期。不只靠這兩個時點推算 QA Active 或完整等待時間。",
    "title": "Ready for QA"
  },
  "testing": {
    "owner": "05 / QA",
    "card": "QA 測試、複驗與報告主單；Owner 保留 QA。",
    "status": "入口：從 RD 收可測版本並回覆接手。執行中不用每次開會或切工作都更改狀態。",
    "action": "依案例測試與回歸；有 Bug 就在 QA 主單下開子任務，各自交 RD，不受影響測試可繼續。",
    "handoff": "出口：Bug 附重現、版本及驗證條件交指定 RD；可交付時將報告、版本與限制交維運。",
    "time": "QA 每天收工集中補測試／複驗／報告投入；短任務可交付補登，收工不再重複填。",
    "title": "In Testing"
  },
  "bugs": {
    "owner": "A / QA 建立，QA 主單 Owner 不變",
    "card": "功能／OP 主卡 → QA 主單 → 多張 Bug。",
    "status": "入口：問題有重現、預期結果、版本與影響，確認要交哪位 RD 或 RD 分派窗口。",
    "action": "每張 Bug 保留各輪版本與結果；不因複驗未過就開重複 Bug。Priority 與嚴重程度分開。",
    "handoff": "出口：同卡交指定 RD，約定接手回覆及修復日期。由誰分派、多久回覆、急件渠道留給 QA／RD 討論。",
    "time": "RD 修復記各 Bug；QA 複驗記 QA 主單。各自補投入人日，不把交接間隔當投入，也不重複加父子彙總。",
    "title": "Bug Backlog"
  },
  "fix": {
    "owner": "B / 各張 Bug 的 RD 接手人",
    "card": "QA 主單下同一張 Bug 子任務。",
    "status": "入口：RD 確認接手與缺件；修好時轉待複驗、指派 QA。這是交接進度，不是逐活動計時。",
    "action": "修復、自測，附修復版本與影響。複驗退回時保留前輪結果，繼續在同一張 Bug 修復。",
    "handoff": "出口：把版本、自測與複驗條件交 QA，請回覆可複驗安排；修好仍待 QA 驗證。",
    "time": "每輪 RD 修復投入以人日累加，保留投入者和職能。短任務交付已補的明細，收工不再重複記。",
    "title": "Bug Fixing"
  },
  "retest": {
    "owner": "C / QA 接手複驗",
    "card": "Bug 記各輪結果，QA 主單記測試／複驗投入。",
    "status": "入口：QA 收到修復版本，確認可驗資訊及排程；通過標已驗證，未過同單退回指定 RD。",
    "action": "附這輪版本、通過／未過與 evidence；不要求驗證中遇到會議先按暫停。",
    "handoff": "出口：未過說明最新重現與期望結果交 RD；通過再確認剩餘測試與整體報告，不能一張 Bug 過就自動結整個 QA 主單。",
    "time": "QA 複驗投入記 QA 主單一次；RD 修復投入保持原歸屬，不因 Bug 改指派 QA 而重分類。",
    "title": "Retesting"
  },
  "report": {
    "owner": "06 / QA 交付，相關窗口確認",
    "card": "QA 測試、複驗與報告主單。",
    "status": "入口：必要測試完成、阻斷問題已處置，未解問題有共同確認的處置。",
    "action": "提供版本、測試結論、已知限制與報告；具體放行權責與門檻由團隊約定。",
    "handoff": "出口：交維運窗口，同卡指派／留言並確認收到、部署安排；QA 交付後不用重複維護維運的工作。",
    "time": "補齊 QA 自己的投入人日；Ready for Deploy 與實際部署日期另看，不自動加成 QA 投入。",
    "title": "QA Sign-off"
  },
  "deployment": {
    "owner": "07 / 維運",
    "card": "維運部署與 Prod 驗證卡。",
    "status": "入口：收到 QA 結論、版本、限制與上線條件，回覆收到及預計窗口。",
    "action": "依既有核准、上版、驗證與回復程序安排，交期變更就在關聯卡協調。",
    "handoff": "出口：部署後進入 Prod 驗證，準備把線上版本與驗證結果回需求 Owner。",
    "time": "維運投入每天集中補登；等部署窗口的日程分開看，不從進度欄推算維運或 QA 的投入。",
    "title": "Deployment"
  },
  "production": {
    "owner": "08 / 維運協調相關窗口",
    "card": "維運部署與 Prod 驗證卡，結果關聯主卡。",
    "status": "入口：確認實際上線版本與約定驗收條件。",
    "action": "驗證必要結果並留紀錄。若未過，依既有上線處置協調相關窗口，主卡保持未結案。",
    "handoff": "出口：通過把版本與結果回需求／收單 Owner；未過則保留關聯回修復、測試與後續驗證。",
    "time": "Prod 驗證完成是本 Demo 主卡日程終點；不把所有職能回報人日相加當作經過天數。",
    "title": "Production Verification"
  },
  "releaseIssue": {
    "owner": "退回 / 維運協調 PM、RD、QA",
    "card": "保留需求主卡，關聯修復／OP 卡與版本。",
    "status": "入口：收到上線問題及影響，由約定窗口確認處置、Owner 與回覆時間。",
    "action": "依既有上線及回復程序處理；是否屬 QA Bug、OP 或事故由團隊判定，不直接套用同一歸屬。",
    "handoff": "出口：說清楚哪張工作交 RD 修復、誰負責驗證、怎麼通知；必要時重新確認交期。",
    "time": "投入補在實際工作卡。原主卡與新 OP 若日程重疊，整體經過天數不重複相加。",
    "title": "Release Follow-up"
  },
  "complete": {
    "owner": "完成 / 需求或收單 Owner",
    "card": "功能／OP 主卡與必要交付、Bug 處置。",
    "status": "入口：必要交付與 Prod 驗證結果可追溯，確認主卡結案。",
    "action": "核對版本、報告、結果及原承諾日期；兩週後一起看資料是否有用、交接是否清楚、操作負擔是否合理。",
    "handoff": "出口：本次交付結束；後續追蹤保留關聯與 Owner，個人考核用途另議。",
    "time": "預估人日與回報人日比，預估交付日期與實際日期比。沒回報保留缺值，回估不宣稱精密計時。",
    "title": "Done"
  }
};
  let mode = 'story', trigger = null;
  const dialog = $('stage-dialog');
  function showStage(id, source) {
    const s = stages[id];
    if (!s) return;
    trigger = source;
    $('stage-owner').textContent = s.owner;
    $('stage-title').textContent = s.title;
    $('stage-card').textContent = s.card;
    for (const field of ['status', 'action', 'handoff', 'time']) $('stage-' + field).textContent = s[field];
    if (id === 'design' && mode === 'op') {
      $('stage-title').textContent = 'Design Skipped';
      $('stage-status').textContent = '本例不需要設計，不建立空白 UIUX 卡，也不回報 UIUX 投入；若 OP 涉及互動／畫面調整，仍可安排設計。';
    }
    if (id === 'planning' && mode === 'op') $('stage-owner').textContent = '規劃 / 維運＋RD＋QA；需要時邀 PM／UIUX';
    if (id === 'preparation' && mode === 'op') $('stage-card').textContent = '依風險簡化測試準備；必要時獨立準備卡，簡單 OP 可在 QA 主單記錄。';
    dialog.showModal();
  }
  document.querySelectorAll('[data-stage]').forEach(button => {
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'stage-dialog');
    button.addEventListener('click', () => showStage(button.dataset.stage, button));
  });
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    $('flow-canvas').classList.toggle('is-op', mode === 'op');
    $('mode-note').textContent = mode === 'op' ? '本例 OP 不需設計，從規劃直接交 RD；QA 依風險準備驗證。不代表所有 OP 都略過設計。' : '本例 Story 需要設計；QA 規劃與設計、開發可並行。';
    document.querySelector('.planning-roles').textContent = mode === 'op' ? '維運＋RD＋QA・依需要' : 'PM＋UIUX＋RD＋QA';
    document.querySelector('.design-caption').textContent = mode === 'op' ? '本例略過・不建立空白卡' : '需要設計才進入';
  }));
  $('stage-done').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (trigger) trigger.focus({ preventScroll: true }); });
})();
