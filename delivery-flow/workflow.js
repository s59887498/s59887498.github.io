(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const stages = {
    intake: {
      owner: '01 / PM 或維運收單窗口', title: '收單與需求確認', card: '功能／OP 主卡；主卡持續追到 Prod 驗證完成。',
      status: '收到先保持待開始；真正開始釐清才切處理中。主卡的交付進度與職能卡狀態分開。',
      action: '確認類型、需求／問題、Owner、驗收標準、影響及承諾日期。依需要建立職能工作卡，避免空白卡與重複維護。',
      handoff: '內容與驗收條件足夠討論後，邀集所需窗口共同規劃。緊急 OP 的收單與核准方式依團隊約定。',
      time: '主卡建立是本 Demo 的整體交付起點。需求釐清的處理區段可追溯；不由狀態推算 PM 投入人時。'
    },
    planning: {
      owner: '02 / PM＋UIUX＋RD＋QA；依工作需要參與', title: '共同規劃、確認範圍', card: '需求主卡保存共識；各職能卡保存各自的排程。',
      status: '各自真正開始才標處理中；等待規格或決策時，記等待原因與對象。',
      action: '一起對齊範圍、驗收、依賴、設計需求、測試風險與承諾日期。日程估算與投入人時估算分開；需要人時指標才安排補登機制。',
      handoff: '範圍、接手人與交付條件可執行後，進入需要的設計／開發工作；QA 同步準備測試。可搭配既有 Sprint Planning，不另強加會議節奏。',
      time: '需求往返沿用同一張職能卡，新增區段。三人共同開一小時會議只經過一小時；三人時需要參與與投入記錄。'
    },
    design: {
      owner: '03 / UIUX；PM、RD 協助決策', title: '設計與決策確認', card: '需要設計才建立 UIUX 工作卡。',
      status: '待開始 → 處理中 → 完成；等決策用等待，確認後回處理中。',
      action: '確認設計稿、互動、邊界情境與驗收條件。規格退回時沿用原卡，保留前段紀錄。',
      handoff: '設計及關鍵決策備妥，完成設計卡，確認 RD 的開發卡與接手人。',
      time: '設計處理與等待決策分開。這個 OP 範例可略過設計；是否需要設計依工作性質判斷，不把所有 OP 一律略過。'
    },
    development: {
      owner: '04 / RD', title: '開發與 Code Review', card: 'RD 開發工作卡；與 QA 測試卡分開。',
      status: '開始切處理中；可交付時完成自己的卡。若被核准插單中斷，原卡暫停，回來恢復處理中。',
      action: '開發、自測、Code Review，備妥版本、變更範圍及交付資訊。Review 未通過就先補齊，再確認可交付。',
      handoff: '交付條件確認後完成開發卡，指定下一張 QA 卡的接手人；不用把開發卡改派成 QA 工作。',
      time: '開發、插單暫停與恢復保留區段。若要獨立 Code Review KPI，仍需額外標記 Review 起訖，本頁合併卡不能直接產出該比率。'
    },
    preparation: {
      owner: '並行 / QA 提前參與', title: '測試規劃、案例 Review', card: 'QA 測試計畫與案例 Review 工作卡。',
      status: '開始規劃切處理中，準備完成就完成此卡；後面的測試主單尚未開始就保持待開始。',
      action: '依既有 QA 需求交付流程，提前整理測試範圍、案例、資料與風險，和 PM／RD 確認驗收情境。',
      handoff: '測試設計及必要 Review 完成，讓 QA 執行可在版本、環境就緒後接手。這條工作可與設計、開發並行。',
      time: 'QA 準備時間與測試／複驗區段分開；並行不把整體交付時間重複加總。'
    },
    readiness: {
      owner: '交接檢核 / RD 交付，QA 確認', title: '可以接手測試了嗎？', card: 'RD 卡交付內容＋QA 主單的接手紀錄。',
      status: '交付可接手後，QA 尚未開始就待開始；開測才處理中。交付不足先由 RD 補齊，留下受阻原因。',
      action: '建議檢查版本、環境、自測結果、變更範圍、測試資料及驗收條件是否足以開測。門檻在試跑前共同確認。',
      handoff: 'QA 確認接手條件與 Owner，留下可接手交付時點；RD 交付不足回原卡補齊，不覆寫之前的交付歷程。',
      time: '可接手交付 → QA 開測，是等 QA 開始的區段；與已開測後 QA 等 RD 修復分開。Notion 的正式 Cycle 起訖仍待定義。'
    },
    testing: {
      owner: '05 / QA', title: '測試、驗收與回歸', card: 'QA 測試、複驗與報告主單；Owner 保留 QA。',
      status: '真正開測才切處理中。等待修復只影響受阻工作；其他可測的工作繼續。',
      action: '按案例執行驗收與回歸、保存結果。發現 Bug 就在本次 QA 主單下開子任務，各自指派 RD。',
      handoff: '有 Bug 就走下方修復與複驗回圈；必要測試完成、阻斷問題已處置後，進入報告交付檢核。',
      time: '測試與複驗的處理區段累計，等待另計。多 Bug 的重疊等待不相加成 QA 等待；需實際人時就另補登 QA 投入。'
    },
    bugs: {
      owner: 'A / QA 建立；QA 主單 Owner 不變', title: 'QA 主單下開多張 Bug', card: '功能／OP 主卡 → QA 主單 → BUG-01、BUG-02…',
      status: '每張 Bug 待修復，指派對應 RD。QA 主單保留 QA，不把整張主單改派給 RD。',
      action: '每張 Bug 保存重現步驟、預期與實際結果、影響及驗證條件，連結本次版本與 evidence。Priority 與嚴重程度分開。',
      handoff: 'RD 確認問題與修復範圍後，各張可獨立開始；需共同版本才一起複驗。本 Demo 的整合等待只是一種範例。',
      time: 'QA 等修復依受阻區段記錄，RD 修復投入記各 Bug。父卡含子卡的彙總不全歸 QA，也不再加一次原始明細。'
    },
    fix: {
      owner: 'B / 各張 Bug 的 RD 接手人', title: '待修復 → 修復中', card: 'QA 主單下各自的 Bug 子任務。',
      status: 'RD 開始切修復中；修好改待 QA 複驗，並指派 QA。修好仍待驗，暫不標已驗證。',
      action: '修復、自測，補上修復版本、影響範圍及複驗資訊。需要投入人時時，分別在自己的 Bug 卡回報修復投入。',
      handoff: '可複驗版本與資訊就緒後交 QA。複驗失敗沿用同一張 Bug 回待修復，保留修復與退回歷史。',
      time: 'RD 的原始投入依投入者、當時職能及工作內容分類。Bug 改派 QA 不會讓前次 RD 投入變成 QA 投入。'
    },
    retest: {
      owner: 'C / QA 接手複驗', title: '複驗 → 已驗證', card: '同一張 Bug 記驗證結果；QA 主單管理測試與報告。',
      status: '收到待 QA 複驗的 Bug；通過才標已驗證，未過改待修復並指派 RD。QA 主單做複驗時回處理中。',
      action: '依修復版本確認問題、相關回歸與結果。此提案把 QA 複驗投入記在 QA 主單自身；Bug 卡留下結果，不重複登同一筆投入。',
      handoff: '通過後回到剩餘測試與交付檢核，不因任一 Bug 已驗證就自動完成整張 QA 主單。',
      time: '新增複驗區段、保留前次等待。各 Bug 可不同時間完成，不把並行區段加成整體交付時間。'
    },
    report: {
      owner: '06 / QA 交付，相關窗口確認', title: '交付 QA 報告', card: 'QA 測試、複驗與報告主單。',
      status: '必要測試與報告完成，完成 QA 主單；維運卡接手等待部署窗口。',
      action: '建議檢核：必要測試已完成、阻斷問題已處置、未解問題有風險與處置紀錄，並提供版本、測試結論與限制。具體放行權責由跨組確認。',
      handoff: 'QA 交付內容可供維運接手，留下 Ready for Deploy 時點與部署版本；上線核准依團隊既有程序。',
      time: 'QA 完成後不再累加 QA 處理時間；Ready for Deploy 到 Production 的區間另看。必要時另外回報 QA 測試、複驗與報告人時。'
    },
    deployment: {
      owner: '07 / 維運', title: '待部署 → 上版', card: '維運部署與 Prod 驗證卡。',
      status: '等窗口標等待並記原因；開始部署切處理中。QA 卡已完成，不繼續記成 QA 時間。',
      action: '確認交付版本、環境、上線窗口與團隊既有核准、驗證及回復安排，按既有程序上版。',
      handoff: '部署完成後進入 Prod 驗證。QA 完成或部署開始，都還不是整體主卡結案點。',
      time: '保留待部署、部署與驗證區段。Notion Deploy Wait 的起訖需依 Ready for Deploy → Production 定義確認，不只取維運的等待狀態。'
    },
    production: {
      owner: '08 / 維運協調相關驗證窗口', title: 'Prod 驗證', card: '維運部署與 Prod 驗證卡；結果關聯需求主卡。',
      status: '部署與驗證時處理中；確認必要驗證通過後，才完成維運卡。',
      action: '確認實際上線版本與約定驗收結果，留下 Prod 驗證紀錄。發現上線問題時依既有處置程序協調，不先結案。',
      handoff: '通過交需求／收單 Owner 確認主卡結案；未過則繼續關聯修復及驗證。正式完成條件於試跑前對齊。',
      time: '本 Demo 用 Prod 驗證完成作整體交付終點。正式 KPI 的 Production／驗證完成時點是否相同，需另確認。'
    },
    releaseIssue: {
      owner: '退回 / 維運協調 PM、RD、QA', title: '未通過，繼續追蹤', card: '保留需求主卡，關聯對應修復／OP 卡與受影響版本。',
      status: '主卡不結案；依實際工作重開原卡或建立關聯修復工作，開始、等待與交接持續記錄。',
      action: '依既有上線問題與回復程序確認處置、範圍、Owner 及交期；修復後補必要測試，再安排部署與驗證。',
      handoff: '修復回 RD，驗證回 QA／維運。這條退回保留原需求關係；是否屬 QA Bug、OP 或事故依團隊規則判定。',
      time: '重新開始新增區段，保留前次上版與驗證結果。若另開 OP，和原主卡保持關聯，不把兩張重疊時間直接相加。'
    },
    complete: {
      owner: '完成 / 需求或收單 Owner', title: '主卡結案', card: '功能／OP 主卡；必要職能卡與 Bug 處置保持可追溯。',
      status: '必要交付完成、阻斷問題已處置、Prod 驗證完成後，確認主卡完成。',
      action: '核對版本、QA 結論、Prod 結果及原承諾日期。兩週試跑結束一起回顧資料品質、關鍵等待／插單及額外操作負擔。',
      handoff: '本次交付結束；需要後續改善或非阻斷追蹤時，保留關聯及 Owner。',
      time: '整體交付以主卡起訖計算，不加總並行卡。預估日程對實際日程，預估人時對另行回報的人時；缺值不當成零。'
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
      $('stage-title').textContent = '這個 OP 範例略過設計';
      $('stage-status').textContent = '本例不需要設計，不建立空白 UIUX 卡，也不產生 UIUX 處理或等待時間。若 OP 涉及互動／畫面調整，仍可安排設計。';
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
