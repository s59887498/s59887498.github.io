(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const stages = {
  "intake": {
    "owner": "01 / PM 或維運收單窗口",
    "card": "功能／OP 主卡。",
    "status": "入口：確認需求從哪裡來、誰是 Owner、如何通知與回覆；沿用既有交接進度。",
    "action": "需求與影響、範圍、整體驗收與原訂開始／結束日放主卡；需要哪些職能才建哪些子卡。完成條件是必要交付與 Prod 驗證通過後，由需求 Owner 確認。",
    "handoff": "出口：把可討論的需求交相關窗口，附主卡連結、要確認的問題與希望回覆日期，請對方確認收到。",
    "time": "主卡保留原訂開始／結束；目前交期另存，實際完成日等整體交付及 Prod 驗證後確認。",
    "title": "Product Backlog"
  },
  "planning": {
    "owner": "02 / PM、UIUX、RD、QA；依工作需要",
    "card": "主卡保存共識；職能卡保存工作、完成條件與日期。",
    "status": "規劃是交付位置，不要求開會前後切暫停或恢復。",
    "action": "各組確認工作、完成條件、預估開始／結束與下一位；範圍、依賴與日期調整回同一主卡協調。",
    "handoff": "出口：確認各組接手人、交付內容及回覆方式，再進入實際需要的設計／開發。可配合既有 Sprint。",
    "time": "各職能卡先留原訂時程；改期另留日期、原因、新時程及確認窗口，不覆蓋原訂。",
    "title": "Backlog Refinement"
  },
  "design": {
    "owner": "03 / UIUX，PM／RD 協助決策",
    "card": "需要設計才有 UIUX 工作卡。",
    "status": "入口：需求、驗收與決策窗口齊備，回覆可接手；工作與交期先確認。",
    "action": "完成設計、互動、例外狀態及決策；設計版本與說明齊備、RD 可接手，才完成 UIUX 卡。",
    "handoff": "出口：設計稿、決策與變更範圍交 RD，指定接手窗口並請回覆收到；退回沿用原卡。",
    "time": "UIUX 卡依自己的完成條件留實際完成日，與原訂結束日比較；修改與改期保留歷史。",
    "title": "In Design"
  },
  "development": {
    "owner": "04 / RD",
    "card": "RD 開發與自測交付卡。",
    "status": "入口：接需求／設計或 Bug，確認範圍、條件與日期。圖上的階段沿用既有進度，沿用少量進度。",
    "action": "完成開發、自測與 Code Review；可測版本、環境、自測與必要交付內容交 QA，作為本提案 RD 開發卡完成點。",
    "handoff": "出口：把可測版本、環境、自測及範圍交指定 QA，在同卡留交接內容，請 QA 回覆收到或缺件。",
    "time": "RD 開發卡留自己的原訂時程與實際完成日。開發完成不等於 Bug 已驗證或功能已上線。",
    "title": "In Development"
  },
  "preparation": {
    "owner": "並行 / QA 提前參與",
    "card": "依風險決定獨立準備卡或在 QA 主單記錄。",
    "status": "入口：QA 提前取得需求、驗收與風險，和設計／開發可並行。",
    "action": "提前整理風險、案例與資料；必要案例及交付條件確認，準備卡才完成。不需獨立卡時可納入 QA 主單。",
    "handoff": "出口：讓案例與交付條件可供後續測試接手；不必等 RD 完成才討論。",
    "time": "依各卡範圍約定預估開始／結束與實際完成日；規劃與開發可並行，不相加成整體工期。",
    "title": "Test Planning"
  },
  "readiness": {
    "owner": "交接檢核 / RD 交付，QA 確認",
    "card": "RD 交付內容＋QA 主單接手紀錄。",
    "status": "入口：明確 QA 接手人與可測資料；回覆收到或缺件。收到回覆不等於實際開測時點。",
    "action": "版本、環境、自測、範圍與驗收齊備；QA 確認可接手，缺件則明確回覆誰補、何時回覆。",
    "handoff": "出口：QA 回覆可接手與預計結果日期；不足就說明缺什麼、誰補、何時回覆，保持同一卡片。",
    "time": "留 RD 交付及 QA 收到的日期，QA 另確認自己的預估時程；收到回覆不代表測試完成。",
    "title": "Ready for QA"
  },
  "testing": {
    "owner": "05 / QA",
    "card": "QA 測試、複驗與報告主單；Owner 保留 QA。",
    "status": "入口：從 RD 收可測版本並回覆接手。執行中不用每次開會或切工作都更改狀態。",
    "action": "依驗收測試與回歸，Bug 在 QA 主單下分別交 RD；必要測試、複驗、阻斷處置與報告交付完成才完成 QA 主單。",
    "handoff": "出口：Bug 附重現、版本及驗證條件交指定 RD；可交付時將報告、版本與限制交維運。",
    "time": "QA 主單留原訂時程及實際完成日；Bug 再修影響日期時，保留原訂、新交期與原因。",
    "title": "In Testing"
  },
  "bugs": {
    "owner": "A / QA 建立，QA 主單 Owner 不變",
    "card": "功能／OP 主卡 → QA 主單 → 多張 Bug。",
    "status": "入口：問題有重現、預期結果、版本與影響，確認要交哪位 RD 或 RD 分派窗口。",
    "action": "每張 Bug 有工作、完成條件、固定 Owner、原訂時程與交付對象。保留各輪版本，Priority 與嚴重程度分開。",
    "handoff": "出口：同卡交指定 RD，約定接手回覆及修復日期。由誰分派、多久回覆、急件渠道留給 QA／RD 討論。",
    "time": "各 Bug 獨立留原訂日期、修復交付日期與最後驗證完成日；不把多 Bug 延期加成整體延期。",
    "title": "Bug Backlog"
  },
  "fix": {
    "owner": "B / 各張 Bug 的 RD 接手人",
    "card": "QA 主單下同一張 Bug 子任務。",
    "status": "入口：RD 確認接手與缺件；修好時轉待複驗、指派 QA。這是交接進度，不是逐活動計時。",
    "action": "重現、修復、自測，附修復版本與影響交 QA；待複驗尚未符合 Bug 完成條件。未過沿原單再修。",
    "handoff": "出口：把版本、自測與複驗條件交 QA，請回覆可複驗安排；修好仍待 QA 驗證。",
    "time": "留各輪修復交付日；Bug 實際完成日先空白。需改期則保留原訂及新日期、原因、確認窗口。",
    "title": "Bug Fixing"
  },
  "retest": {
    "owner": "C / QA 接手複驗",
    "card": "Bug 留各輪結果；QA 主單追蹤整體測試與報告。",
    "status": "入口：QA 收到修復版本，確認可驗資訊及排程；通過標已驗證，未過同單退回指定 RD。",
    "action": "QA 留本輪版本、通過／未過與 evidence；通過標已驗證，未過同單退回指定 RD。",
    "handoff": "出口：未過說明最新重現與期望結果交 RD；通過再確認剩餘測試與整體報告，不能一張 Bug 過就自動結整個 QA 主單。",
    "time": "本提案 Bug 以 QA 已驗證為完成點，通過才留實際完成日。前輪結果與原訂日期都保留。",
    "title": "Retesting"
  },
  "report": {
    "owner": "06 / QA 交付，相關窗口確認",
    "card": "QA 測試、複驗與報告主單。",
    "status": "入口：必要測試完成、阻斷問題已處置，未解問題有共同確認的處置。",
    "action": "必要測試完成、阻斷已處置，提供報告、版本與限制交維運；具體放行門檻由團隊約定。",
    "handoff": "出口：交維運窗口，同卡指派／留言並確認收到、部署安排；QA 交付後不用重複維護維運的工作。",
    "time": "達成 QA 主單交付條件，留 QA 實際完成日；部署與 Prod 驗證由維運卡繼續追蹤。",
    "title": "QA Sign-off"
  },
  "deployment": {
    "owner": "07 / 維運",
    "card": "維運部署與 Prod 驗證卡。",
    "status": "入口：收到 QA 結論、版本、限制與上線條件，回覆收到及預計窗口。",
    "action": "確認上版資訊、核准與窗口，依既有程序部署並接續 Prod 驗證；部署完成不直接等於功能結案。",
    "handoff": "出口：部署後進入 Prod 驗證，準備把線上版本與驗證結果回需求 Owner。",
    "time": "維運卡保留原訂日期；窗口調整留原因、新日期及確認窗口。Prod 驗證與交付結果齊備後留完成日。",
    "title": "Deployment"
  },
  "production": {
    "owner": "08 / 維運協調相關窗口",
    "card": "維運部署與 Prod 驗證卡，結果關聯主卡。",
    "status": "入口：確認實際上線版本與約定驗收條件。",
    "action": "確認線上版本與必要驗收結果；通過交需求 Owner 確認，未過依既有上線處置追蹤，主卡保持未結案。",
    "handoff": "出口：通過把版本與結果回需求／收單 Owner；未過則保留關聯回修復、測試與後續驗證。",
    "time": "Prod 驗證完成並由需求 Owner 確認必要交付後，主卡才記實際完成日。",
    "title": "Production Verification"
  },
  "releaseIssue": {
    "owner": "退回 / 維運協調 PM、RD、QA",
    "card": "保留需求主卡，關聯修復／OP 卡與版本。",
    "status": "入口：收到上線問題及影響，由約定窗口確認處置、Owner 與回覆時間。",
    "action": "保留主卡與版本，依既有上線處置確認修復／OP、驗證窗口及交期；分類與權責由團隊判斷。",
    "handoff": "出口：說清楚哪張工作交 RD 修復、誰負責驗證、怎麼通知；必要時重新確認交期。",
    "time": "原訂日期不覆蓋；新修復或 OP 卡另有時程與完成條件，主卡改期留原因及確認窗口。",
    "title": "Release Follow-up"
  },
  "complete": {
    "owner": "完成 / 需求或收單 Owner",
    "card": "功能／OP 主卡與必要交付、Bug 處置。",
    "status": "入口：必要交付與 Prod 驗證結果可追溯，確認主卡結案。",
    "action": "必要交付、版本、報告與 Prod 通過結果齊備，需求 Owner 確認主卡結案；兩週後回顧日期與交接資料。",
    "handoff": "出口：本次交付結束；後續追蹤保留關聯與 Owner，個人考核用途另議。",
    "time": "主卡實際完成日對原訂結束日判斷提前、準時或 Delay；新交期另比，各卡差異不相加。",
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
      $('stage-status').textContent = '本例不需要設計，不建立空白 UIUX 卡；若 OP 涉及互動／畫面調整，仍可安排設計。';
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
