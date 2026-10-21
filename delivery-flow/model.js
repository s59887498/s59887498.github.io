(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DeliveryModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DAY = 86400000;
  const ROLES = { qa: 'QA', pm: 'PM', ux: 'UIUX', rd: 'RD', ops: '維運' };
  function dateNumber(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw new Error('日期須為 YYYY-MM-DD');
    const n = Date.parse(value + 'T00:00:00Z');
    if (!Number.isFinite(n) || new Date(n).toISOString().slice(0, 10) !== value) throw new Error('無效日期');
    return n;
  }
  const daysBetween = (from, to) => (dateNumber(to) - dateNumber(from)) / DAY;
  const date = value => value ? value.slice(5).replace('-', '/') : '尚未完成';
  function result(task, asOf, basis = 'original') {
    dateNumber(asOf);
    const due = basis === 'current' ? task.currentEnd : task.originalEnd;
    if (!due) return { kind: 'unknown', label: '未排期', delta: null, due: null };
    dateNumber(due);
    if (task.completedAt) {
      const delta = daysBetween(due, task.completedAt);
      return { kind: delta < 0 ? 'early' : delta > 0 ? 'delay' : 'ontime', label: delta < 0 ? `提前 ${-delta} 天` : delta > 0 ? `Delay ${delta} 天` : '準時完成', delta, due };
    }
    if (task.state === '完成' || task.state === '已驗證') return { kind: 'unknown', label: '待補完成日', delta: null, due };
    const delta = daysBetween(due, asOf);
    return { kind: delta > 0 ? 'delay' : 'pending', label: delta > 0 ? `Delay ${delta} 天・逾期待完成` : delta === 0 ? '今日到期・尚未完成' : '尚未到期', delta: Math.max(0, delta), due };
  }
  function task(id, role, name, start, end, work, done, handoff, parentId = null, extra = {}) {
    if ((start && !end) || (!start && end)) throw new Error('需成對設定預估日期');
    if (start && daysBetween(start, end) < 0) throw new Error('結束日不可早於開始日');
    return { id, role, name, originalStart: start, originalEnd: end, work, done, handoff, parentId, owner: ROLES[role] + ' 窗口', assignee: ROLES[role] + ' 窗口', state: '待開始', completedAt: null, ...extra };
  }
  function validateRevision(r) {
    if (!r.reason || !r.reason.trim() || !r.by || !r.at) throw new Error('改期需日期、原因與確認窗口');
    dateNumber(r.at);
    if (daysBetween(r.start, r.end) < 0) throw new Error('改期結束日不可早於開始日');
    return r;
  }
  const change = (id, state, completedAt = null, assignee) => ({ id, state, completedAt, ...(assignee ? { assignee } : {}) });
  const handoff = (taskId, from, to, content, reply, round = 1) => ({ taskId, from, to, content, reply, round });
  const event = (at, title, description, stage, changes = [], handoffs = [], revisions = []) => ({ at, title, description, stage, changes, handoffs, revisions });
  const revision = (taskId, at, start, end, reason, by = 'PM＋相關窗口') => ({ taskId, at, start, end, reason, by });
  function baseTasks(op = false) {
    const all = [
      task('pm', 'pm', '需求與驗收標準', '2026-10-10', '2026-10-12', '確認範圍、驗收標準與決策窗口。', '需求內容及驗收標準已確認，各組可接手。', '交 UIUX／RD／QA，附範圍、驗收與日期。', null, {state:'完成',completedAt:'2026-10-12'}),
      task('ux', 'ux', '通知偏好設計', '2026-10-12', '2026-10-13', '完成畫面、互動及例外狀態。', '設計版本與說明齊備，RD 確認可接手。', '交 RD，附設計版本、互動與決策。', null, {state:'完成',completedAt:'2026-10-13'}),
      task('rd', 'rd', '開發、自測與 Review', '2026-10-12', '2026-10-14', '依驗收與設計開發，完成自測及 Review。', '可測版本、環境、自測結果已交付 QA。', '交 QA，附版本、環境、變更與已知問題。', null, {state:'完成',completedAt:'2026-10-14'}),
      task('prep', 'qa', '測試規劃與案例 Review', '2026-10-12', '2026-10-13', '提前整理風險、案例及測試資料。', '必要案例與交付條件已確認。', '交 QA 測試接手，連回同一需求。', null, {state:'完成',completedAt:'2026-10-13'}),
      task('qa', 'qa', 'QA 測試、複驗與報告', '2026-10-10', '2026-10-16', '依驗收測試、追蹤 Bug、複驗並整理報告。', '必要測試完成、阻斷已處置，報告與版本已交付維運。', '交維運，附結論、版本、限制，請回覆收到。'),
      task('ops', 'ops', '部署與 Prod 驗證', '2026-10-16', '2026-10-20', '確認上版窗口，部署並驗證 Prod。', 'Prod 驗證通過，版本與結果已交需求 Owner。', '回主卡由需求／收單 Owner 確認結案。')
    ];
    return op ? all.filter(t => ['rd','qa','ops'].includes(t.id)) : all;
  }
  function entrance() { return [
    event('2026-10-14', '入口：收到可測版本，先看完成條件與交期', 'RD 在 QA 主單交 v1.0、環境、自測及驗收內容。QA 確認這張卡要完成測試、必要複驗與報告，原訂 10/16 交付。', 'Ready for QA', [], [handoff('qa','RD 窗口','QA 窗口','v1.0／環境／自測／驗收／原訂 10/16','請回覆資料是否齊備及能否依期交付')]),
    event('2026-10-14', '接手：確認工作內容，更新進行中', 'QA 回覆可接手，沿用少量進度。臨時開會或切換工作照常進行；需要協調交期時才補說明。', 'In Testing', [change('qa','進行中')], [handoff('qa','QA 窗口','RD 窗口','收到 v1.0，依原訂 10/16 完成必要測試與報告','缺件或交期有變，回同一張卡協調')])
  ]; }
  function finish(qaDate, prodDate) { return [
    event(qaDate, '出口：完成 QA 工作，留下實際完成日', '必要測試、複驗與報告交付完成，才記 QA 實際完成日。QA 卡完成不代表功能已上線；維運卡繼續追蹤部署。', 'QA Sign-off', [change('qa','完成',qaDate),change('ops','進行中')], [handoff('qa','QA 窗口','維運窗口','報告／驗證版本／已知限制／實際完成日','請回覆收到與部署安排')]),
    event(prodDate, 'Prod 驗證通過，需求 Owner 確認結案', '維運留上線版本與 Prod 結果，需求 Owner 確認必要交付齊備後，記主卡實際完成日。各組日程不相加。', 'Done', [change('ops','完成',prodDate)], [handoff('ops','維運窗口','需求 Owner','Prod 版本與通過結果，必要交付已完成','請確認主卡結案')])
  ]; }
  const scenario = (label, tasks, events, extra = {}) => ({ label, type:'Story', title:'通知偏好設定', owner:'PM 窗口', originalStart:'2026-10-10',originalEnd:'2026-10-20',tasks,events,...extra });
  const scenarios = {
    early: scenario('提前完成',baseTasks(),[...entrance(),...finish('2026-10-14','2026-10-16')]),
    ontime: scenario('準時完成',baseTasks(),[...entrance(),...finish('2026-10-16','2026-10-20')]),
    delay: scenario('Delay／逾期未完',baseTasks(),[...entrance(),event('2026-10-17','到期後還沒完成，顯示逾期待完成','原訂 10/16 尚未交付，先看阻礙與下一步；實際完成日維持空白，不填成預估日期。','In Testing'),...finish('2026-10-19','2026-10-21')]),
    change: scenario('改期保留原訂',baseTasks(),[...entrance(),
      event('2026-10-16','協調改期，保留原訂交期與原因','需求新增通知權限情境，PM 與各組確認 QA 改至 10/20、整體交付改至 10/22。原訂 QA 10/16 與主卡 10/20 仍保留。','In Testing',[],[],[
        revision('qa','2026-10-16','2026-10-10','2026-10-20','新增通知權限驗收情境，需補測與更新報告'),
        revision('root','2026-10-16','2026-10-10','2026-10-22','QA 範圍調整後，重新確認部署與 Prod 驗證窗口')]),...finish('2026-10-19','2026-10-21')]),
    bug: scenario('多 Bug／複驗退回', [...baseTasks(),
      task('bug1','rd','BUG-01 通知開關未儲存','2026-10-14','2026-10-15','重現、修復、自測並交 QA 複驗。','修復版本經 QA 驗證通過；RD 交付修復只是里程碑。','同 Bug 交 QA；未過沿原單退回。','qa',{owner:'RD-A',assignee:'RD-A',createdAt:'2026-10-14'}),
      task('bug2','rd','BUG-02 提示訊息錯誤','2026-10-14','2026-10-16','修正提示並附自測結果。','QA 驗證通過，結果留同一張 Bug。','交 QA 複驗，保留版本。','qa',{owner:'RD-B',assignee:'RD-B',createdAt:'2026-10-14'})], [
      ...entrance(),event('2026-10-14','QA 主單下兩張 Bug，各自約定交期','QA 主單維持 QA Owner。兩張 Bug 各自有工作、完成條件、負責人與原訂日期；不受影響的測試繼續。','Bug Backlog',[],[handoff('bug1','QA 窗口','RD-A','BUG-01／v1.0／重現與預期結果','原訂 10/15 完成驗證，請確認修復安排'),handoff('bug2','QA 窗口','RD-B','BUG-02／v1.0／重現與預期結果','原訂 10/16 完成驗證，請確認修復安排')]),
      event('2026-10-15','RD 交 v1.1，Bug 尚待 QA 複驗','修復版本與自測交 QA，保留本輪日期。待複驗尚未符合 Bug 完成條件，實際完成日仍空白。','Retesting',[change('bug1','待複驗',null,'QA 窗口'),change('bug2','待複驗',null,'QA 窗口')],[handoff('bug1','RD-A','QA 窗口','第 1 輪／v1.1／修復與自測','請回覆複驗結果'),handoff('bug2','RD-B','QA 窗口','第 1 輪／v1.1／修復與自測','請回覆複驗結果')]),
      event('2026-10-16','BUG-01 未過，原卡退回並協調日期','BUG-02 已驗證，完成日 10/16。BUG-01 v1.1 未過交回 RD-A；原訂 10/15 保留，新增原因與確認後的新日期。QA 主單也重新確認交期。','Bug Fixing',[change('bug1','需再修',null,'RD-A'),change('bug2','已驗證','2026-10-16','QA 窗口')],[handoff('bug1','QA 窗口','RD-A','第 1 輪 v1.1 未過／最新重現與 evidence','沿原單修復，重新確認版本及交期')],[revision('bug1','2026-10-16','2026-10-14','2026-10-19','v1.1 複驗未過，需再修與安排複驗','QA＋RD-A'),revision('qa','2026-10-16','2026-10-10','2026-10-20','BUG-01 再修，需完成複驗與報告交付')]),
      event('2026-10-19','同一張 Bug v1.2 通過，保留前輪結果','BUG-01 實際完成日 10/19：相較原訂 10/15 是 Delay 4 天，相較新交期 10/19 是準時。改期不會清除原訂差異。','Retesting',[change('bug1','已驗證','2026-10-19','QA 窗口')],[handoff('bug1','RD-A','QA 窗口','第 2 輪／v1.2／自測已附','QA 確認 v1.2 複驗通過，結果留原單',2)]),...finish('2026-10-20','2026-10-21')]),
    op: scenario('OP 略過設計',baseTasks(true),[...entrance(),...finish('2026-10-16','2026-10-16')],{type:'OP Issue',title:'既有報表匯出異常修復',owner:'維運窗口',originalEnd:'2026-10-16'})
  };
  function snapshot(s, index) {
    if (!Number.isInteger(index) || index < 0 || index >= s.events.length) throw new Error('無效步驟');
    const events = s.events.slice(0,index+1), now = events.at(-1).at;
    let previousDate=null;
    for(const e of events){dateNumber(e.at);if(previousDate&&e.at<previousDate)throw new Error('事件日期需依序');previousDate=e.at;for(const c of e.changes){if(c.completedAt){dateNumber(c.completedAt);if(c.completedAt>e.at)throw new Error('完成日不可在事件日期之後');}}}
    const handoffs = events.flatMap(e => e.handoffs.map(h => ({...h,at:e.at})));
    const revisions = events.flatMap(e => e.revisions.map(validateRevision));
    function materialize(t) {
      const changes = events.flatMap(e => e.changes.filter(c => c.id===t.id));
      const safeChanges = changes.map(c => ({state:c.state,completedAt:c.completedAt, ...(c.assignee ? {assignee:c.assignee} : {})}));
      const ownRevisions = revisions.filter(r => r.taskId===t.id);
      const latest = ownRevisions.at(-1);
      const card = {...t,...Object.assign({},...safeChanges),currentStart:latest?latest.start:t.originalStart,currentEnd:latest?latest.end:t.originalEnd,revisions:ownRevisions,handoffs:handoffs.filter(h=>h.taskId===t.id)};
      card.completionHistory=events.flatMap(e=>e.changes.filter(c=>c.id===t.id&&c.completedAt).map(c=>({at:e.at,completedAt:c.completedAt})));
      card.result=result(card,now);card.currentResult=result(card,now,'current');
      return card;
    }
    const root = materialize({id:'root',originalStart:s.originalStart,originalEnd:s.originalEnd,state:events.at(-1).stage==='Done'?'完成':'進行中',completedAt:events.at(-1).stage==='Done'?now:null});
    return {now,current:events.at(-1),events,handoffs,revisions,root,tasks:s.tasks.filter(t=>!t.createdAt||t.createdAt<=now).map(materialize),complete:index===s.events.length-1};
  }
  return {ROLES,dateNumber,daysBetween,date,result,task,change,handoff,event,revision,validateRevision,baseTasks,scenarios,snapshot};
});
