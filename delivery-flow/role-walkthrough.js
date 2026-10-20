/* Fixed, offline proposal examples. Only explicit effort entries contribute person-days. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const step = (date, title, stage, status, action, operation, message, extra = {}) =>
    ({ date, title, stage, status, action, operation, message, ...extra });
  const effort = (id, date, card, days, note) => ({ id, date, card, days, note });
  const roles = {
    pm: {
      name: 'PM', card: 'PM-101 需求確認與驗收標準', path: 'FLOW-101 → PM 職能卡',
      owner: 'PM 窗口',
      entry: '需求提出者／維運 → PM；附問題、使用情境與期望日期。',
      exit: 'PM → UIUX、RD、QA 各組窗口；附範圍、驗收標準及待確認事項。',
      notify: '在主卡留言並指派對應職能卡；各組回覆收到或缺什麼。',
      steps: [
        step('10/12（一）09:00', '先把需求收在同一個入口', 'Product Backlog', '待確認', '維運提出通知設定需求，PM 先確認要解決誰的問題，建立需求主卡。', '建主卡、指定需求 Owner，放需求來源與期望日期。', '維運 → PM：希望使用者可以選擇接收哪些通知；期望 10/19 上線。', { handoff: '收到維運需求；期望日期待評估，尚未承諾。' }),
        step('10/12（一）11:00', '一起確認範圍，不必為會議切暫停', 'Backlog Refinement', '需求確認中', '邀 UIUX、RD、QA 確認範圍與驗收例子。開會、補說明照常進行；缺的決策集中留在原卡。', '補驗收標準與待決事項；真的影響交期時才協調日期。', '共同確認：這次做通知開關；歷史通知查詢不在本次範圍。'),
        step('10/12（一）收工', '需求確認投入，今天集中補一次', 'Backlog Refinement', '範圍已確認', '把今天可歸屬這張需求的確認、會議與整理合併回估。', '在 PM 職能卡補 0.5 人日；不是每次會議各填一筆。', 'PM 補登：需求確認、相關會議及驗收標準整理，共 0.5 人日。', { entries: [effort('pm-101-12', '10/12', 'PM-101', 0.5, '需求確認＋相關會議＋驗收整理')] }),
        step('10/13（二）09:00', '準備好了，交給各組接手', 'Backlog Refinement', '已交付規劃內容', '主卡保留需求與承諾日期；需要的職能卡分別由各組接手，QA 可以提前準備。', '完成本次需求確認卡；指派職能卡、留一則交接。主卡仍保持未結案。', 'PM → UIUX／RD／QA：範圍與驗收標準已附，請回覆能否接手及預計交付日。', { handoff: 'PM 交付範圍與驗收標準，通知 UIUX／RD／QA。' }),
        step('10/13（二）10:00', '確認有人接，不用自己重填別組進度', 'Backlog Refinement', '各組已回覆', '各組回覆接手或缺件，PM 才知道這次交棒有落地；後續需求變更沿用主卡討論。', '缺件就補齊；各組維護自己的工作卡。Prod 驗證完成後再由需求 Owner 確認結案。', 'UIUX／RD／QA → PM：已收到；設計、開發與測試準備各自安排，交期異動再協調。', { handoff: '各組確認收到；主卡等待後續交付與 Prod 驗證。' })
      ]
    },
    ux: {
      name: 'UIUX', card: 'UX-101 通知偏好設計', path: 'FLOW-101 → UIUX 職能卡',
      owner: 'UIUX 窗口',
      entry: 'PM → UIUX；附需求範圍、使用情境、驗收標準與決策窗口。',
      exit: 'UIUX → RD，並讓 PM／QA 看見；附設計版本、互動及例外說明。',
      notify: '設計連結與版本留在原卡；指派／通知 RD，請回覆是否可實作。',
      steps: [
        step('10/13（二）09:00', '先確認需求與決策窗口', 'In Design', '已確認接手', '確認本次確實需要設計，需求與驗收內容可用。若是不需設計的 OP，就不建立空白設計卡。', '在設計卡回覆收到；缺資料時直接說缺什麼、找誰補。', 'PM → UIUX：請依主卡驗收條件設計通知開關，需求問題由 PM 統一確認。', { handoff: 'UIUX 收到範圍與驗收標準，確認接手。' }),
        step('10/13（二）14:00', '設計與討論照常，不逐活動切狀態', 'In Design', '設計中', '畫流程、做稿、跟 RD 對齊限制，或臨時參加相關會議，都放在同一段工作裡。', '只有需要別人決策或影響交期，才補一則阻礙／決策說明。', 'UIUX → PM／RD：無法接收推播時，要不要引導至系統設定？請在原卡確認。'),
        step('10/13（二）收工', '把今天設計與相關討論合併補登', 'In Design', '設計中', '回估今天在這張設計卡上的投入，等待決策的整段日程不直接當人日。', '補 0.75 人日，包含設計與相關討論；不用每次切換活動都操作。', 'UIUX 補登：設計、互動討論與修改，共 0.75 人日。', { entries: [effort('ux-101-13', '10/13', 'UX-101', 0.75, '設計＋互動討論與修改')] }),
        step('10/14（三）09:00', '用同一份版本交給 RD', 'In Design', '設計交付', '交設計 v1.0、互動與例外狀態說明，讓 RD 實作、QA 準備驗證使用同一個版本。', '附版本與連結、完成設計卡，通知 RD 接手；後續改版在原卡留紀錄。', 'UIUX → RD，副知 PM／QA：設計 v1.0 已附，含無權限狀態，請確認可開始實作。', { handoff: 'UIUX 交設計 v1.0 給 RD，PM／QA 可見同一版本。' }),
        step('10/14（三）10:00', '收到 RD 回覆，才算完成交棒', 'In Development', 'RD 已確認收到', 'RD 確認設計可用；若後續需要修改，沿用原卡記錄新版本與補充投入。', '確認接手回覆即可；不替 RD 維護開發狀態。', 'RD → UIUX：設計 v1.0 已收到，例外狀態清楚；若實作發現限制會在原卡確認。', { handoff: 'RD 確認設計 v1.0 可用並接手實作。' })
      ]
    },
    rd: {
      name: 'RD', card: 'DEV-101 通知偏好開發', path: 'FLOW-101 → RD 開發卡',
      owner: 'RD 窗口',
      entry: 'PM／UIUX → RD；附範圍、驗收、設計版本；修 Bug 時由 QA 給重現與環境。',
      exit: 'RD → QA；開發附版本、環境及自測；Bug 附修復版本與影響範圍。',
      notify: '開發完成交到 QA 主單；Bug 修好在同一張 Bug 指派 QA、請回覆收到。',
      steps: [
        step('10/14（三）10:00', '確認拿到可實作的內容', 'In Development', '已接手開發', '驗收標準、設計 v1.0 與環境清楚後接手；不清楚就在原卡問。', '回覆收到，沿用既有開發進度即可。', 'PM／UIUX → RD：需求與設計已備妥；RD 回覆可接手及預計交付日期。', { handoff: 'RD 確認需求與設計 v1.0，接手 DEV-101。' }),
        step('10/14（三）收工', '開發與會議，收工一起補', 'In Development', '開發中', '開發、Review 與相關討論照常做；臨時開會不用先把卡切暫停。', '今天在開發卡補 0.75 人日；插單真的影響交期再留關聯、協調日期。', 'RD 補登：開發與相關討論，共 0.75 人日。', { entries: [effort('rd-dev-14', '10/14', 'DEV-101', 0.75, '開發＋相關討論')] }),
        step('10/15（四）15:00', '交可測版本，補今天的投入', 'Ready for QA', '待 QA 確認接手', '自測與 Review 完成，交 v1.0、環境、變更與已知問題。短任務交付時補過的投入，收工不重複補。', '開發卡補今天 0.5 人日並完成；通知 QA 主單的 QA Owner。', 'RD → QA：v1.0 已部署測試環境，自測結果與變更已附，請確認接手。', { entries: [effort('rd-dev-15', '10/15', 'DEV-101', 0.5, '開發收尾＋自測與 Review（交付補登）')], handoff: 'RD 交 v1.0、環境與自測給 QA，待確認接手。' }),
        step('10/16（五）09:00', '收到 Bug，工作落在原 Bug 上', 'Bug Fixing', 'BUG-21 修復中', 'QA 在 QA-101 下建立 BUG-21／BUG-22，分別給修復窗口。這裡只示範 RD 接手 BUG-21，QA 主單仍由 QA 負責。', '在 BUG-21 確認重現與接手；不用把 QA 主單改派 RD。', 'QA → RD：BUG-21 通知開關未儲存，附 v1.0、重現步驟與畫面；請修復。', { card: 'BUG-21 通知開關未儲存', path: 'FLOW-101 → QA-101 → BUG-21', handoff: 'QA 交 BUG-21 給 RD；QA-101 Owner 不變。' }),
        step('10/16（五）11:00', '修好後交 QA，修復投入保留 RD', 'Retesting', '待 QA 複驗', '修好 v1.1，附影響範圍與自測。修復投入登在 BUG-21，改派 QA 不會把歷史 RD 投入變成 QA。', 'BUG-21 補 0.25 人日，標待複驗、指派 QA；這只是交付，尚未已驗證。', 'RD → QA：BUG-21 已修於 v1.1，修復說明與自測已附，請安排複驗。', { card: 'BUG-21 通知開關未儲存', path: 'FLOW-101 → QA-101 → BUG-21', entries: [effort('rd-bug21-16', '10/16', 'BUG-21', 0.25, 'RD 修復＋自測（交付補登）')], handoff: 'RD 交 BUG-21 v1.1 給 QA 複驗，原始投入仍歸 RD。' }),
        step('10/16（五）13:00', 'QA 收到；若未過，就沿用同單再修', 'Retesting', 'QA 已確認收到', 'QA 回覆收到並排複驗；未過就在同一張 BUG-21 留結果退回。新一輪保留版本與投入，不把舊紀錄清掉。', '確認 QA 接到即可；QA 複驗補在 QA 主單，不登成 RD 修復投入。', 'QA → RD：v1.1 已收到並安排複驗；結果會回到 BUG-21。', { card: 'BUG-21 通知開關未儲存', path: 'FLOW-101 → QA-101 → BUG-21', handoff: 'QA 確認收到 BUG-21 v1.1；收到不等於已通過。' })
      ]
    },
    qa: {
      name: 'QA', card: 'QA-101 測試、複驗與報告', path: 'FLOW-101 → QA 主單（下掛 BUG-21／BUG-22）',
      owner: 'QA 窗口（全程保留）',
      entry: '規劃由 PM 邀 QA；正式測試由 RD 給版本、環境、自測與驗收內容。',
      exit: 'QA → 維運，副知 PM／RD；附報告、版本、未結問題與放行結論。',
      notify: 'Bug 在 QA 主單下分別指派 RD；交付報告時通知維運，請回覆可接手。',
      steps: [
        step('10/12（一）收工', '提早準備，不必等 RD 做完', 'Test Planning', '測試準備中', '在需求確認時先看風險與驗收，準備案例。這例為了減少卡片，準備投入也記在 QA 主單。', '回覆參與規劃；今天準備與相關會議集中補 0.25 人日。', 'PM → QA：一起確認通知開關驗收；QA 補上權限與儲存失敗情境。', { entries: [effort('qa-101-12', '10/12', 'QA-101', 0.25, '測試準備＋需求會議')], handoff: 'QA 提前參與規劃，確認驗收與測試風險。' }),
        step('10/15（四）15:30', '版本齊全，才確認正式接手', 'In Testing', '已接手測試', '確認 RD 的 v1.0、環境、自測與範圍可用；缺件就直接在原卡說明。', 'QA 主單回覆收到、可開始測試；收到通知不自動代表已投入測試。', 'QA → RD：v1.0 與環境可用，已接手；若缺資料會在原卡列出。', { handoff: 'QA 確認 RD v1.0 可測並接手。' }),
        step('10/15（四）收工', '多張 Bug 各自走，QA Owner 不換', 'Bug Backlog', '測試中／部分待修復', '在 QA-101 下開 BUG-21、BUG-22，各自附重現與環境、指派 RD。不受影響的測試繼續。', 'Bug 分別交 RD；今天測試與相關討論在 QA 主單合併補 0.25 人日。', 'QA → RD：兩張 Bug 請分別接手。BUG-21 需修儲存，BUG-22 需修提示；其餘測試繼續。', { entries: [effort('qa-101-15', '10/15', 'QA-101', 0.25, '測試＋Bug 整理與相關討論')], handoff: 'QA 主單下 BUG-21／BUG-22 分別交 RD 修復。' }),
        step('10/16（五）收工', '各張複驗，QA／RD 分開補', 'Retesting', 'Bug 已驗證', '收到各張修復版本後逐張複驗。本例兩張通過；未過會沿用原 Bug 退回 RD，保留每輪版本。', 'Bug 分別留結果、通過標已驗證；QA 複驗共 0.25 人日記在 QA 主單。', 'QA → RD：BUG-21 v1.1、BUG-22 v1.1 複驗通過，結果已回原單。修復投入由各 RD 在 Bug 上補。', { entries: [effort('qa-101-16', '10/16', 'QA-101', 0.25, '兩張 Bug 複驗（只記 QA 主單一次）')], handoff: 'QA 於 BUG-21／BUG-22 留 v1.1 驗證結果，兩張皆通過。' }),
        step('10/19（一）11:00', '交報告給維運，等接手回覆', 'QA Sign-off', 'QA 工作已交付', '必要測試完成、阻斷已處置，整理報告與剩餘風險。QA 完成不等於已上 Prod。', '報告收尾補 0.25 人日並完成 QA 主單；通知維運及相關窗口。', 'QA → 維運，副知 PM／RD：v1.1 測試通過、報告與未結事項已附，請確認部署窗口。', { entries: [effort('qa-101-19', '10/19', 'QA-101', 0.25, '報告與交付整理（交付補登）')], handoff: 'QA 交 v1.1 報告與風險給維運，待回覆部署安排。' }),
        step('10/19（一）11:30', '維運接到，這次 QA 交棒落地', 'Deployment', '維運已確認收到', '維運確認報告與版本可用，安排部署；若 Prod 驗證需要 QA 支援，後續投入仍由 QA 自己補登。', '保留維運接手回覆即可；主卡等 Prod 驗證後再結案。', '維運 → QA：報告與 v1.1 已收到，預計今天部署並驗證，異常沿原需求追蹤。', { handoff: '維運確認 QA 交付內容，接手部署安排。' })
      ]
    },
    ops: {
      name: '維運', card: 'OPS-101 部署與 Prod 驗證', path: 'FLOW-101 → 維運職能卡',
      owner: '維運窗口',
      entry: 'QA／RD → 維運；附可部署版本、報告、已知風險與上版資訊。',
      exit: '維運 → PM／需求 Owner 與相關組；附部署版本、Prod 驗證與異常結果。',
      notify: '在部署卡／主卡回覆接手、窗口與結果；需求 Owner 確認後結案。',
      steps: [
        step('10/19（一）11:30', '收到可部署的交付包', 'Deployment', '已接手待部署', '先看 QA 報告、v1.1、上版資訊與風險。缺資料先請原窗口補，不用自己到處猜。', '回覆收到及是否可安排；缺件就在原卡列出。', 'QA／RD → 維運：v1.1、報告與上版資訊已備妥；維運確認收到。', { handoff: '維運確認收到 QA 報告與 RD 版本 v1.1。' }),
        step('10/19（一）14:00', '確認窗口，待部署不當成投入', 'Deployment', '已確認部署窗口', '安排今天部署窗口。從收到到可上版的日程可以留下，但不能直接視為整段都在操作。', '補預計部署日期與窗口；不用每等一段時間就切狀態。', '維運 → PM／QA／RD：安排今天 15:00 部署 v1.1，相關窗口請配合驗證。', { handoff: '維運公告 10/19 15:00 部署 v1.1 與驗證窗口。' }),
        step('10/19（一）15:30', '依既有流程部署，再做 Prod 驗證', 'Production Verification', '部署完成／待驗證', '部署完成先記版本與結果，接著做必要驗證。若未過，沿既有上線處置追蹤，主卡先不結案。', '留部署結果與版本；需要支援時通知對應窗口。', '維運 → 相關窗口：v1.1 已部署，正在確認通知開關與基本服務。', { handoff: '維運記錄 v1.1 部署完成，Prod 驗證進行中。' }),
        step('10/19（一）16:00', '短任務結束，集中補自己的投入', 'Production Verification', 'Prod 驗證通過', '把部署準備、操作與驗證合併回估一次。這是維運投入，不把前面整段待部署日程填成人日。', 'OPS-101 補 0.25 人日；交付時已補，收工不重複登。', '維運補登：部署準備、操作與 Prod 驗證，共 0.25 人日。', { entries: [effort('ops-101-19', '10/19', 'OPS-101', 0.25, '部署準備＋操作與 Prod 驗證（交付補登）')] }),
        step('10/19（一）17:00', '把驗證結果交回需求 Owner', 'Done', '需求 Owner 已確認結案', '維運交回 v1.1 與 Prod 驗證結果，PM／需求 Owner 確認必要交付齊備後，才完成需求主卡。', '完成維運卡、回覆主卡結果；需求 Owner 確認後結案。', '維運 → PM：Prod 驗證通過，結果已附；PM 回覆確認交付完成，結案 FLOW-101。', { handoff: '維運交 Prod 通過結果；需求 Owner 確認後完成 FLOW-101。' })
      ]
    }
  };
  let role = 'pm', index = 0;
  const tabs = [...document.querySelectorAll('[data-walk-role]')];
  const setText = (id, text) => { $(id).textContent = text; };
  const list = (id, items, empty) => {
    $(id).replaceChildren();
    for (const text of items.length ? items : [empty]) {
      const li = document.createElement('li');
      li.textContent = text;
      $(id).append(li);
    }
  };
  function render(announce = true) {
    const data = roles[role], current = data.steps[index];
    const history = data.steps.slice(0, index + 1);
    const entries = [...new Map(history.flatMap(s => s.entries || []).map(e => [e.id, e])).values()];
    const total = entries.reduce((sum, e) => sum + e.days, 0);
    for (const key of ['entry', 'exit', 'notify']) setText('walk-' + key, data[key]);
    setText('walk-card-path', current.path || data.path);
    setText('walk-card-title', current.card || data.card);
    setText('walk-owner', '固定職能 Owner：' + data.owner);
    setText('walk-stage', current.stage);
    setText('walk-status', current.status);
    setText('walk-total', entries.length ? total + ' 人日' : '未回報');
    setText('walk-total-note', role === 'rd' ? '開發卡＋本例 Bug 修復的 RD 原始回報；不包含 QA，也不代表完整功能總投入。' : '只計這個角色的已回報投入；不包含其他組，也不是交付耗時。');
    setText('walk-counter', String(index + 1).padStart(2, '0') + ' / ' + String(data.steps.length).padStart(2, '0'));
    setText('walk-date', '示意日期 ' + current.date);
    setText('walk-step-title', current.title);
    setText('walk-action', current.action);
    setText('walk-operation', current.operation);
    setText('walk-message-label', current.entries ? '本步的交接／補登示意' : '同卡留言／接手示意');
    setText('walk-message', current.message);
    $('walk-prev').disabled = index === 0;
    $('walk-next').disabled = index === data.steps.length - 1;
    setText('walk-next', index === data.steps.length - 1 ? '本角色已走完 ✓' : '下一步 →');
    $('walk-panel').setAttribute('aria-labelledby', 'walk-tab-' + role);
    tabs.forEach(tab => {
      const selected = tab.dataset.walkRole === role;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    $('walk-progress').replaceChildren();
    data.steps.forEach((s, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = i + 1;
      button.setAttribute('aria-label', `第 ${i + 1} 步：${s.title}`);
      if (i === index) button.setAttribute('aria-current', 'step');
      button.classList.toggle('walk-step-past', i < index);
      button.addEventListener('click', () => {
        index = i;
        render();
        $('walk-progress').children[i].focus({ preventScroll: true });
      });
      $('walk-progress').append(button);
    });
    list('walk-handoffs', history.filter(s => s.handoff).map(s => s.date + '｜' + s.handoff), '這個視角尚未留下交接紀錄。');
    list('walk-ledger', entries.map(e => `${e.date}｜${e.card}｜${data.name} ${e.days} 人日｜${e.note}`), '尚未補登；未回報不當作零。');
    if (announce) setText('walk-announcement', `${data.name}，第 ${index + 1} 步，共 ${data.steps.length} 步。${current.title}。已回報投入：${entries.length ? total + ' 人日' : '未回報'}。`);
  }
  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => { role = tab.dataset.walkRole; index = 0; render(); });
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (tabIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (tabIndex + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      tabs[target].click();
      tabs[target].focus({ preventScroll: true });
    });
  });
  $('walk-prev').addEventListener('click', () => { if (index > 0) { index--; render(); } });
  $('walk-next').addEventListener('click', () => { if (index < roles[role].steps.length - 1) { index++; render(); } });
  $('walk-reset').addEventListener('click', () => { index = 0; render(); });
  render(false);
})();
