(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DeliveryModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const HOUR = 3600000;
  const OFFSET = 8 * HOUR;
  const BASE = Date.parse('2026-10-12T09:00:00+08:00');
  const STATUS = { pending: '待開始', active: '處理中', waiting: '等待', paused: '暫停', review: '待 QA 複驗', done: '完成' };
  const ROLES = { pm: 'PM', ux: 'UIUX', rd: 'RD', qa: 'QA', ops: '維運' };

  function elapsedHours(start, end) {
    return Math.max(0, (new Date(end).getTime() - new Date(start).getTime()) / HOUR);
  }
  function workHours(start, end) {
    const from = new Date(start).getTime(), to = new Date(end).getTime();
    if (!Number.isFinite(from) || !Number.isFinite(to)) throw new Error('Invalid interval');
    if (to <= from) return 0;
    const local = new Date(from + OFFSET);
    let day = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - OFFSET;
    let total = 0;
    while (day < to) {
      const weekday = new Date(day + OFFSET).getUTCDay();
      if (weekday !== 0 && weekday !== 6) {
        for (const [a, b] of [[9, 12], [13, 18]]) total += Math.max(0, Math.min(to, day + b * HOUR) - Math.max(from, day + a * HOUR));
      }
      day += 24 * HOUR;
    }
    return total / HOUR;
  }
  function at(hours) {
    let remaining = hours;
    for (let day = BASE - 9 * HOUR; ; day += 24 * HOUR) {
      const weekday = new Date(day + OFFSET).getUTCDay();
      if (weekday === 0 || weekday === 6) continue;
      for (const [a, b] of [[9, 12], [13, 18]]) {
        if (remaining <= b - a) return new Date(day + (a + remaining) * HOUR).toISOString();
        remaining -= b - a;
      }
    }
  }
  const task = (id, role, name, start, end, created = 0, parentId = null, assignee = ROLES[role] + ' 窗口') => ({ id, role, name, parentId, assignee, planned: start === null ? null : [at(start), at(end)], createdAt: at(created) });
  const change = (id, status, reason = '', target = '', assignee) => ({ id, status, reason, target, ...(assignee ? { assignee } : {}) });
  const step = (hour, title, description, stage, changes) => ({ at: at(hour), title, description, stage, changes });
  function standardTasks() {
    return [task('pm', 'pm', '需求與驗收標準', 0, 3), task('ux', 'ux', '設計與決策確認', 3, 6), task('rd', 'rd', '開發與 Code Review', 6, 14), task('prep', 'qa', '測試計畫與案例 Review', 3, 5), task('qa', 'qa', '測試、複驗與報告', 14, 19), task('ops', 'ops', '部署與 Prod 驗證', 19, 22)];
  }
  function opening() {
    return [
      step(0, 'PM 開始釐清需求', '主卡保存需求、驗收標準與承諾日期；各組不用重複整理同一份內容。', '需求釐清', [change('pm', 'active')]),
      step(3, '設計與 QA 規劃並行', 'UIUX 開始設計；QA 同時準備 Test Plan、案例與 Review，提早提出風險。', '設計與測試準備', [change('pm', 'done'), change('ux', 'active'), change('prep', 'active')]),
      step(5, 'QA 已備妥測試設計', '測試準備有自己的子卡，不必等 RD 完成才開始。', '設計確認', [change('prep', 'done')]),
      step(6, 'RD 接手開發', '設計與驗收標準確認後，RD 開始開發與 Code Review。', '開發與 Review', [change('ux', 'done'), change('rd', 'active')]),
      step(14, '交付 QA 開測', 'RD 提供版本、環境與自測結果；QA 確認交付條件後開始測試。', 'QA 驗證', [change('rd', 'done'), change('qa', 'active')])
    ];
  }
  function closing(qaEnd) {
    return [
      step(qaEnd, 'QA 交付報告，等待部署窗口', 'QA 完成測試與報告；接下來的等待屬於待部署，不繼續記為 QA 處理時間。', '待部署', [change('qa', 'done'), change('ops', 'waiting', '等待部署窗口', '維運')]),
      step(qaEnd + 2, '維運開始部署', '部署與 Prod 驗證放在維運子卡，與上版前等待分開。', '部署與 Prod 驗證', [change('ops', 'active')]),
      step(qaEnd + 3, 'Prod 驗證完成，主卡結案', '必要交付完成、阻斷問題已處置，並確認 Prod 驗證結果後，主卡才結案。', 'Prod 已驗證', [change('ops', 'done')])
    ];
  }
  const scenarios = {
    normal: {
      label: '開始與交棒', short: '01', title: '充電紀錄新增篩選功能', type: 'Story', owner: 'PM', dueAt: at(23),
      insight: '收到卡先確認負責人；開始做切處理中；交付時完成原職能卡，指定下一張卡的接手人。等待 QA 開測的 1h，與 QA 等 RD 修 Bug 是不同區段。',
      tasks: standardTasks().map(t => t.id === 'qa' ? { ...t, planned: [at(14), at(20)] } : t.id === 'ops' ? { ...t, planned: [at(20), at(23)] } : t),
      events: [
        step(0, '收到卡：先確認輪到誰', 'PM 窗口收到需求卡，狀態先保持待開始。拿到卡不等於已經在做。', 'PM 待開始', []),
        ...opening().slice(0, 4),
        step(14, 'RD 交棒：完成開發卡，指定 QA 接手', 'RD 開發卡完成；QA 測試卡指定 QA 窗口、保持待開始。從這次可接手交付到 QA 開始，另外計算交接等待。原開發卡不用改派成 QA 工作。', '等待 QA 開測', [change('rd', 'done'), { ...change('qa', 'pending', '版本已交付，等待 QA 開測', 'QA 窗口'), ready: true }]),
        step(15, 'QA 接手：切換處理中', 'QA 確認版本與環境後開始測試。這次交接等待為 1 個工作小時；之後的測試區段另外累計。', 'QA 驗證', [change('qa', 'active')]),
        ...closing(20)
      ]
    },
    clarification: {
      label: '需求往返', short: '02', title: '充電紀錄新增篩選功能', type: 'Story', owner: 'PM', dueAt: at(22), insight: '需求往返沿用原子卡；共同釐清會議的經過時間，不等於參與者人時。', tasks: standardTasks(),
      events: [
        ...opening().slice(0, 2),
        step(4, '設計遇到規格疑問，回到 PM 確認', 'UIUX 選擇等待原因與對象；PM 在原需求卡重新開始，第一次紀錄仍保留。', '需求再確認', [change('ux', 'waiting', '篩選條件待決策', 'PM'), change('pm', 'active')]),
        step(5, '共同釐清會議開始', 'PM、UIUX、RD 共同釐清一小時。各卡可並行，但主卡只經過同一個小時；參與人時未蒐集。', '跨組釐清', [change('prep', 'done'), change('ux', 'active'), change('rd', 'active')]),
        step(6, '會議結束，等待最終決策', '需求確認的時間留在原卡；UIUX 等 PM 決策，RD 尚未進入正式開發。', '需求決策', [change('ux', 'waiting', '等待最終驗收條件', 'PM'), change('rd', 'pending')]),
        step(7, 'PM 確認，UIUX 繼續', '恢復處理新增一段歷程，不覆寫之前的處理與等待。', '設計確認', [change('pm', 'done'), change('ux', 'active')]),
        step(9, 'RD 開始開發', '重新確認日程影響，原承諾日期仍保留，方便看見往返造成的差異。', '開發與 Review', [change('ux', 'done'), change('rd', 'active')]),
        step(17, '交付 QA', 'QA 使用提前備妥的案例進行測試。', 'QA 驗證', [change('rd', 'done'), change('qa', 'active')]),
        ...closing(22)
      ]
    },
    bug: {
      label: 'QA 下掛多張 Bug', short: '03', title: '充電紀錄新增篩選功能', type: 'Story', owner: 'PM', dueAt: at(22),
      insight: 'QA 主單下有兩張 Bug。修好後改成待 QA 複驗並指派 QA；修復投入仍歸 RD。QA 等修復 8h 依受阻區段計算，不把兩張 Bug 的等待相加。',
      tasks: [...standardTasks(), task('bug', 'rd', 'BUG-01｜篩選結果異常', null, null, 17, 'qa', 'RD-A'), task('bug2', 'rd', 'BUG-02｜日期條件異常', null, null, 17, 'qa', 'RD-B')],
      timeEntries: [
        { id: 'qa-first', taskId: 'qa', role: 'qa', person: 'QA 窗口', hours: 2.5, at: at(17), activity: '首次測試' },
        { id: 'rd-second', taskId: 'bug2', role: 'rd', person: 'RD-B', hours: 2, at: at(23), activity: '修復 BUG-02' },
        { id: 'rd-first', taskId: 'bug', role: 'rd', person: 'RD-A', hours: 3, at: at(25), activity: '修復 BUG-01' },
        { id: 'qa-retest', taskId: 'qa', role: 'qa', person: 'QA 窗口', hours: 1.5, at: at(27), activity: '兩張 Bug 複驗與報告' }
      ],
      events: [
        ...opening(),
        step(17, 'QA 主單下開兩張 Bug，分別指派 RD', 'QA 主單的 Owner 保留 QA；BUG-01 指派 RD-A、BUG-02 指派 RD-B。本例測試須等待共同整合版本，其他不受影響的測試可繼續。另補登 QA 首次測試投入 2.5 人時。', 'Bug 待修復', [change('qa', 'waiting', '等待兩張 Bug 的整合版本', 'RD'), change('bug', 'waiting', '等待 RD-A 接手', 'RD-A'), change('bug2', 'waiting', '等待 RD-B 接手', 'RD-B')]),
        step(19, 'RD-A 開始修 BUG-01', '開始修復，就切「修復中」。修復卡保留在 QA 主單下，這張卡的修復投入依實際記錄歸 RD。', 'Bug 修復', [change('bug', 'active')]),
        step(20, 'RD-B 開始修 BUG-02', '兩張 Bug 可以並行；它們的流程時間不能直接相加成整體交付時間。', '兩張 Bug 並行修復', [change('bug2', 'active')]),
        step(23, 'BUG-02 修好：待複驗，交給 QA', 'BUG-02 狀態轉待 QA 複驗，現在指派 QA 窗口；RD-B 另補登修復投入 2 人時。本例等待 BUG-01 的共同版本後一起複驗。', '等待整合版本', [change('bug2', 'review', '等待共同版本後由 QA 複驗', 'QA 窗口', 'QA 窗口')]),
        step(25, 'BUG-01 交 QA，開始一起複驗', 'BUG-01 轉待 QA 複驗並指派 QA；RD-A 補登 3 人時。QA 主單恢復處理中，等修復共 8 個工作小時，重疊等待不重複加總。', 'QA 複驗', [change('bug', 'review', '等待 QA 複驗結果', 'QA 窗口', 'QA 窗口'), change('qa', 'active')]),
        step(27, '兩張 Bug 已驗證，交付 QA 報告', 'QA 將兩張 Bug 標已驗證，完成 QA 主單。另補登複驗與報告 1.5 人時：QA 回報共 4、RD 修復共 5，交付包合計 9 人時；這與狀態經過時間分開。', '待部署', [change('bug', 'done'), change('bug2', 'done'), change('qa', 'done'), change('ops', 'waiting', '等待部署窗口', '維運')]),
        ...closing(27).slice(1)
      ]
    },
    interrupt: {
      label: '插單中斷', short: '04', title: '充電紀錄新增篩選功能', type: 'Story', owner: 'PM', dueAt: at(22), insight: 'RD 開發仍是 8 個工作小時的處理區段；另外留下被插單中斷的 4 小時與交期影響。', tasks: standardTasks(),
      events: [
        ...opening().slice(0, 4),
        step(9, '核准插單，原工作暫停', 'RD 轉去處理另一張 OP 主卡。本卡選擇「插單中斷」；插單來源與被延後項目保持關聯。', '開發暫停', [change('rd', 'paused', '核准插單：OP-090（另一張主卡）', '維運收單窗口')]),
        step(13, '插單結束，恢復原工作', '保留中斷 4 小時，再接續原本開發；同步提醒 PM 重估承諾日期。', '開發與 Review', [change('rd', 'active')]),
        step(18, 'RD 交付 QA', '開發處理區段合計 8 小時，中斷區段 4 小時分開看；原承諾日不被悄悄覆蓋。', 'QA 驗證', [change('rd', 'done'), change('qa', 'active')]),
        ...closing(23)
      ]
    },
    op: {
      label: 'OP Issue 略過設計', short: '05', title: '既有報表匯出異常修復', type: 'OP Issue', owner: '維運', dueAt: at(8), insight: '依問題性質選需要的職能；本例不需新增設計，也不建立空白 UIUX 子卡。',
      tasks: [task('ops', 'ops', '問題確認、部署與 Prod 驗證', 0, 8), task('rd', 'rd', '問題修復與 Code Review', 1, 4), task('qa', 'qa', '修復驗證與回歸', 4, 6)],
      events: [
        step(0, '維運確認問題與驗收條件', 'OP 主卡由維運收單，確認影響、重現方式與驗收條件；本例不需 PM 需求拆解及 UIUX 設計。', '問題確認', [change('ops', 'active')]),
        step(1, 'RD 接手修復', '只建立需要的職能卡；維運子卡等待修復與驗證。', '問題修復', [change('ops', 'waiting', '等待修復及 QA 驗證', 'RD／QA'), change('rd', 'active')]),
        step(4, 'QA 驗證與回歸', 'RD 提供修復版本，QA 確認問題修復及相關功能。', 'QA 驗證', [change('rd', 'done'), change('qa', 'active')]),
        step(6, '驗證通過，等待上版', 'QA 交付結果；維運等待部署窗口，保留等待原因的變化。', '待部署', [change('qa', 'done'), change('ops', 'waiting', '等待部署窗口', '維運')]),
        step(7, '維運部署與驗證', '恢復同一張維運子卡，保留前段問題確認與等待紀錄。', '部署與 Prod 驗證', [change('ops', 'active')]),
        step(8, 'Prod 驗證完成', 'OP Issue 完成交付，整體時間仍由主卡起訖計算。', 'Prod 已驗證', [change('ops', 'done')])
      ]
    }
  };
  function snapshot(scenario, index) {
    const events = scenario.events.slice(0, index + 1);
    const now = events[events.length - 1].at;
    const tasks = scenario.tasks.filter(t => t.createdAt <= now).map(t => {
      const transitions = events.flatMap(e => e.changes.filter(c => c.id === t.id).map(c => ({ ...c, at: e.at })));
      const segments = transitions.map((c, i) => ({ ...c, end: transitions[i + 1]?.at || now })).filter(s => s.at < s.end);
      const totals = {};
      for (const state of ['active', 'waiting', 'paused']) {
        const intervals = segments.filter(s => (s.status === 'review' || s.status === 'pending' && s.ready ? 'waiting' : s.status) === state);
        totals[state] = { work: intervals.reduce((sum, s) => sum + workHours(s.at, s.end), 0), calendar: intervals.reduce((sum, s) => sum + elapsedHours(s.at, s.end), 0) };
      }
      const current = transitions[transitions.length - 1] || { status: 'pending', reason: '', target: '' };
      const startedAt = transitions.find(c => c.status !== 'pending' || c.ready)?.at;
      const entries = (scenario.timeEntries || []).filter(e => e.taskId === t.id && e.at <= now);
      const assignee = [...transitions].reverse().find(c => c.assignee)?.assignee || t.assignee;
      return { ...t, ...current, assignee, segments, transitions, totals, entries, reportedHours: entries.length ? entries.reduce((sum, e) => sum + e.hours, 0) : null, startedAt, actualSpan: startedAt ? workHours(startedAt, current.status === 'done' ? current.at : now) : null, estimatedSpan: t.planned ? workHours(...t.planned) : null };
    });
    const entries = (scenario.timeEntries || []).filter(e => e.at <= now);
    return { now, events, tasks, entries, current: events[events.length - 1], complete: index === scenario.events.length - 1, elapsed: elapsedHours(scenario.events[0].at, now), work: workHours(scenario.events[0].at, now) };
  }
  function reportedPackage(snap, parentId) {
    const ids = new Set([parentId]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const t of snap.tasks) if (ids.has(t.parentId) && !ids.has(t.id)) { ids.add(t.id); changed = true; }
    }
    const entries = [...new Map(snap.entries.filter(e => ids.has(e.taskId)).map(e => [e.id, e])).values()];
    const byRole = {};
    for (const e of entries) byRole[e.role] = (byRole[e.role] || 0) + e.hours;
    return { entries, byRole, total: entries.length ? entries.reduce((sum, e) => sum + e.hours, 0) : null };
  }
  return { HOUR, BASE, STATUS, ROLES, at, elapsedHours, workHours, scenarios, snapshot, reportedPackage };
});
