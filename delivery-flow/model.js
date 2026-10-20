(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DeliveryModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const HOUR = 3600000, DAY = 24 * HOUR, OFFSET = 8 * HOUR, WORKDAY_HOURS = 8;
  const ROLES = { qa: 'QA', pm: 'PM', ux: 'UIUX', rd: 'RD', ops: '維運' };
  function on(dayIndex, hour = 9) {
    let day = Date.parse('2026-10-12T00:00:00+08:00'), left = dayIndex;
    while (left > 0) { day += DAY; if (![0, 6].includes(new Date(day + OFFSET).getUTCDay())) left--; }
    return new Date(day + hour * HOUR).toISOString();
  }
  function calendarDays(start, end) { return Math.max(0, (Date.parse(end) - Date.parse(start)) / DAY); }
  function workingDays(start, end) {
    const from = Date.parse(start), to = Date.parse(end);
    if (!Number.isFinite(from) || !Number.isFinite(to)) throw new Error('Invalid interval');
    if (to <= from) return 0;
    const local = new Date(from + OFFSET);
    let day = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - OFFSET, ms = 0;
    while (day < to) {
      if (![0, 6].includes(new Date(day + OFFSET).getUTCDay())) for (const [a, b] of [[9, 12], [13, 18]]) ms += Math.max(0, Math.min(to, day + b * HOUR) - Math.max(from, day + a * HOUR));
      day += DAY;
    }
    return ms / HOUR / WORKDAY_HOURS;
  }
  function formatDays(value, digits = 3) { return value === null || value === undefined ? '未回報' : new Intl.NumberFormat('zh-TW', { maximumFractionDigits: digits }).format(value); }
  const card = (id, role, name, estimateDays, state = '已交付', parentId = null, assignee = ROLES[role] + ' 窗口', createdAt = on(0)) => ({ id, role, name, estimateDays, parentId, owner: parentId ? assignee : ROLES[role] + ' 窗口', assignee, state, createdAt });
  function tasks() { return [card('pm', 'pm', '需求與驗收標準', null), card('ux', 'ux', '設計與決策確認', null), card('rd', 'rd', '開發與自測交付', null), card('prep', 'qa', '測試規劃與案例 Review', null), card('qa', 'qa', 'QA 測試、複驗與報告', 0.75, '待接手'), card('ops', 'ops', '部署與 Prod 驗證', null, '待交付')]; }
  const update = (id, state, assignee) => ({ id, state, ...(assignee ? { assignee } : {}) });
  const entry = (id, taskId, role, person, workDay, days, activity, basis = '收工集中回估') => ({ id, taskId, role, person, workDate: on(workDay).slice(0, 10), days, activity, basis });
  const handoff = (id, taskId, from, to, kind, content, expected, round = 1) => ({ id, taskId, from, to, kind, content, expected, round, channel: '建議同卡指派＋交接留言，請接手人回覆收到（示意）' });
  const event = (at, title, description, stage, changes = [], handoffs = [], entries = []) => ({ at, title, description, stage, changes, handoffs, entries });
  function entrance() { return [
    event(on(2), '入口：RD 把可測版本交給 QA', '沿用同一張 QA 主單，附版本 v1.0、Stage 環境、自測結果與驗收條件，指定 QA 窗口。通知渠道先用團隊約定的方式，並請接手人回覆。', 'Ready for QA', [], [handoff('qa-in', 'qa', 'RD 窗口', 'QA 窗口', '交付', 'v1.0／Stage／自測結果／驗收條件／主卡連結', '請確認是否可接手，並回覆預計交付日期')]),
    event(on(2, 10), 'QA 回覆：已收到，確認交期', 'QA 回覆已收到且資料可測，先約定預計回覆日期。這是接手確認，不代表之後每次開會、切工作都要更改狀態。', 'QA 已接手', [update('qa', '已接手')], [handoff('qa-ack', 'qa', 'QA 窗口', 'RD 窗口', '收到', '已收到 v1.0，可接手；預計 10/15 回報測試結果', '若範圍或交期變動，再於同卡說明')])
  ]; }
  function finishQa(day = 3, prior = []) { return [
    event(on(day, 11), '出口：QA 交付報告，交給維運窗口', '必要測試完成、阻斷問題已處置，QA 在主單附報告與版本連結，交給維運。這次短任務的投入在交付時補登；收工時不再重複加一次。', 'Ready for Deploy', [update('qa', '已交付'), ...prior, update('ops', '待接手')], [handoff('ops-in', 'ops', 'QA 窗口', '維運窗口', '交付', 'QA 結論／驗證版本／已知限制／待部署內容', '請確認窗口與預計部署日期')], [entry('qa-final', 'qa', 'qa', 'QA 窗口', day, 0.25, '複驗與報告', '短任務交付補登')]),
    event(on(day, 13), '維運回覆收到，確認部署窗口', 'QA 的出口接到維運的入口。接手人回覆收到與下一步，不要求 QA 繼續維護維運的工作；等窗口是交付進度，不是 QA 的投入。', '待部署', [update('ops', '已接手')], [handoff('ops-ack', 'ops', '維運窗口', 'QA 窗口', '收到', '已收到交付內容，依約定窗口部署', '部署後回覆 Prod 驗證結果')]),
    event(on(day + 1, 11), 'Prod 驗證完成，回覆需求 Owner', '維運在關聯卡回覆上線版本與驗證結果，需求／收單 Owner 確認主卡結案。此 Demo 未蒐集其他職能投入，不把缺值當成零。', 'Done', [update('ops', '已交付')], [handoff('prod-done', 'ops', '維運窗口', '需求／收單 Owner', '完成', 'Prod 版本／驗證結果／結案確認', '必要交付及 Prod 驗證完成後結案')])
  ]; }
  const scenarios = {
    normal: { label: 'QA 的入口與出口', short: '01', type: 'Story', title: '充電紀錄新增篩選功能', owner: 'PM 窗口', createdAt: on(0), dueAt: on(4, 18), tasks: tasks(), insight: '入口確認誰交、資料是否齊；出口說清楚交給誰、怎麼通知。投入每天收工集中補一次，短任務可交付補；不是每次換工作就操作。', events: [ ...entrance(), event(on(2, 18), '收工：集中補登今天的投入', 'QA 回估今天在這張卡投入 0.75 人日。日期、投入者、職能與卡片保持關聯；同一筆不再登到功能主卡。這是投入回估，不是狀態停留時間。', 'QA 執行中', [], [], [entry('qa-first', 'qa', 'qa', 'QA 窗口', 2, 0.75, '測試與回歸')]), ...finishQa() ] },
    bug: { label: 'Bug 退回再修一次', short: '02', type: 'Story', title: '充電紀錄新增篩選功能', owner: 'PM 窗口', createdAt: on(0), dueAt: on(4, 18), tasks: [...tasks(), card('bug1', 'rd', 'BUG-01｜篩選結果異常', 0.25, '待修復', 'qa', 'RD-A', on(2, 15)), card('bug2', 'rd', 'BUG-02｜日期條件異常', 0.25, '待修復', 'qa', 'RD-B', on(2, 15))], insight: 'Bug 往返保留同一張卡、版本與每次交接；RD 修復、QA 複驗分開補登。誰分派、何時接手、多久回覆、哪些能先驗，留給 QA／RD 一起確認。', events: [
      ...entrance(),
      event(on(2, 15), 'QA 出口：兩張 Bug 分別交給 RD', '在 QA 主單下開 BUG-01、BUG-02，附重現、預期結果與版本，各指定 RD 接手。QA 主單 Owner 保留 QA；其他可測的部分繼續，不逐段計等待。', 'Bug 待修復', [update('bug1', '待修復', 'RD-A'), update('bug2', '待修復', 'RD-B')], [handoff('bug1-out', 'bug1', 'QA 窗口', 'RD-A', '交付', 'BUG-01／v1.0／重現與驗收條件', '請 RD 確認接手及預計修復日期'), handoff('bug2-out', 'bug2', 'QA 窗口', 'RD-B', '交付', 'BUG-02／v1.0／重現與驗收條件', '請 RD 確認接手及預計修復日期')]),
      event(on(2, 18), '收工：先記當天 QA 測試投入', 'QA 集中補登 0.5 人日。Bug 的修復投入由 RD 在各 Bug 卡記；不拿交接間隔當作任何人的投入。', 'Bug 追蹤中', [], [], [entry('qa-first', 'qa', 'qa', 'QA 窗口', 2, 0.5, '首次測試與 Bug 整理')]),
      event(on(3, 16), 'RD 出口：修好後交 QA 複驗', '兩張 Bug 都附修復版本 v1.1，轉待複驗並指派 QA。RD-A、RD-B 各在自己的卡補登 0.25 人日；這兩筆是短任務交付補登，收工不重複填。', 'Ready for Retest', [update('bug1', '待複驗', 'QA 窗口'), update('bug2', '待複驗', 'QA 窗口')], [handoff('bug1-fix1', 'bug1', 'RD-A', 'QA 窗口', '交付複驗', 'v1.1／修復內容／自測結果', '請 QA 確認可複驗時間'), handoff('bug2-fix1', 'bug2', 'RD-B', 'QA 窗口', '交付複驗', 'v1.1／修復內容／自測結果', '請 QA 確認可複驗時間')], [entry('rd-a1', 'bug1', 'rd', 'RD-A', 3, 0.25, '首次修復', '短任務交付補登'), entry('rd-b1', 'bug2', 'rd', 'RD-B', 3, 0.25, '修復 BUG-02', '短任務交付補登')]),
      event(on(4, 11), '複驗未過：BUG-01 沿用原單退回', 'BUG-02 已驗證；BUG-01 在 v1.1 仍可重現。QA 留下這次複驗結果與 evidence，原 Bug 再交 RD-A，不另開重複 Bug。', 'BUG-01 需再修', [update('bug1', '需再修', 'RD-A'), update('bug2', '已驗證', 'QA 窗口')], [handoff('bug1-return', 'bug1', 'QA 窗口', 'RD-A', '複驗退回', '第 1 輪複驗未過／v1.1／最新重現與 evidence', '請確認再次修復日期，並評估交期影響', 1)], [entry('qa-retest1', 'qa', 'qa', 'QA 窗口', 4, 0.25, '第一輪複驗與結果整理', '短任務交付補登')]),
      event(on(4, 16), '再次修好：同一張 Bug 交回 QA', 'RD-A 在 BUG-01 補上 v1.2 及新自測結果，再交 QA。新增修復投入 0.25 人日，保留第一輪，不覆蓋前次投入或交接。', 'Ready for Retest', [update('bug1', '待複驗', 'QA 窗口')], [handoff('bug1-fix2', 'bug1', 'RD-A', 'QA 窗口', '交付複驗', '第 2 輪交付／v1.2／修復與自測結果', '請 QA 確認複驗結果', 2)], [entry('rd-a2', 'bug1', 'rd', 'RD-A', 4, 0.25, '第二輪修復', '短任務交付補登')]),
      ...finishQa(5, [update('bug1', '已驗證', 'QA 窗口')]).map((e, i) => i ? e : ({ ...e, description: 'BUG-01 在 v1.2 第二輪複驗通過，結果保留同卡。' + e.description, handoffs: [{ ...handoff('bug1-verified', 'bug1', 'QA 窗口', 'RD-A', '驗證結果', '第 2 輪／v1.2／複驗通過，已驗證', '此 Bug 結束，整體交付回 QA 主單追蹤', 2), channel: '驗證結果留同卡；通知沿用團隊約定（示意）' }, ...e.handoffs] }))
    ] },
    meeting: { label: '臨時開會，照常做事', short: '03', type: 'Story', title: '充電紀錄新增篩選功能', owner: 'PM 窗口', createdAt: on(0), dueAt: on(4, 18), tasks: tasks(), insight: '臨時開會不新增暫停／恢復操作。能歸屬此需求的會議併入當日投入；跨專案會議另列共用工作。會議造成交期變更時再協調，不靠狀態計時。', events: [ ...entrance(), event(on(2, 14), '臨時被找去開會，直接去就好', '這一步沒有變更卡片進度、沒有按暫停，也沒有新增工時。工作照常進行，收工時再回估當天測試與這個需求相關的會議投入。', 'QA 已接手'), event(on(2, 18), '收工一次補：測試與相關會議', '今天同一張 QA 卡只補一筆 0.75 人日，包含測試與這個需求的會議，不逐項活動另開明細。無法歸屬需求的共用會議，另列共用工作，不硬塞到這張卡。', 'QA 執行中', [], [], [entry('qa-first', 'qa', 'qa', 'QA 窗口', 2, 0.75, '測試與本需求會議（當日合計）')]), ...finishQa() ] },
    op: { label: 'OP 依需要分工', short: '04', type: 'OP Issue', title: '既有報表匯出異常修復', owner: '維運窗口', createdAt: on(0), dueAt: on(4, 18), tasks: tasks().filter(t => ['rd', 'qa', 'ops'].includes(t.id)).map(t => t.id === 'qa' ? { ...t, estimateDays: 0.5 } : t), insight: '本例 OP 不需 PM 需求拆解、UIUX 設計或獨立 QA 準備卡。收單窗口確認影響及驗收，RD 交 QA 驗證，再由維運上線；每組只填自己的投入。', events: [ ...entrance(), event(on(2, 18), '收工補登這次 OP 的驗證投入', 'QA 在自己的驗證卡補登 0.25 人日；工作較小可填小數，不把每張卡都進位成一天。', 'QA 執行中', [], [], [entry('qa-first', 'qa', 'qa', 'QA 窗口', 2, 0.25, 'OP 問題驗證與回歸')]), ...finishQa() ] }
  };
  function snapshot(scenario, index) {
    const events = scenario.events.slice(0, index + 1), now = events[events.length - 1].at;
    const entries = [...new Map(events.flatMap(e => e.entries).map(e => [e.id, e])).values()];
    const handoffs = events.flatMap(e => e.handoffs.map(h => ({ ...h, at: e.at })));
    const tasks = scenario.tasks.filter(t => t.createdAt <= now).map(t => {
      const changes = events.flatMap(e => e.changes.filter(c => c.id === t.id));
      const current = Object.assign({}, ...changes), ownEntries = entries.filter(e => e.taskId === t.id);
      return { ...t, ...current, entries: ownEntries, reportedDays: ownEntries.length ? ownEntries.reduce((sum, e) => sum + e.days, 0) : null, handoffs: handoffs.filter(h => h.taskId === t.id) };
    });
    return { now, events, current: events[events.length - 1], tasks, entries, handoffs, complete: index === scenario.events.length - 1, calendarDays: calendarDays(scenario.createdAt, now), workingDays: workingDays(scenario.createdAt, now), returnedCount: handoffs.filter(h => h.kind === '複驗退回').length };
  }
  function reportedPackage(snap, parentId) {
    const ids = new Set([parentId]); let changed = true;
    while (changed) { changed = false; for (const t of snap.tasks) if (ids.has(t.parentId) && !ids.has(t.id)) { ids.add(t.id); changed = true; } }
    const entries = [...new Map(snap.entries.filter(e => ids.has(e.taskId)).map(e => [e.id, e])).values()], byRole = {};
    for (const e of entries) byRole[e.role] = (byRole[e.role] || 0) + e.days;
    return { entries, byRole, total: entries.length ? entries.reduce((sum, e) => sum + e.days, 0) : null };
  }
  return { WORKDAY_HOURS, ROLES, on, calendarDays, workingDays, formatDays, scenarios, snapshot, reportedPackage };
});
