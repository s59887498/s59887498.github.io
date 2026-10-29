(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DeliveryModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DAY = 86400000;
  const ROLES = { qa: 'QA', pm: 'PM', ux: 'UIUX', rd: 'RD', ops: '維運' };
  const LANES = ['Product Backlog','Refinement','Sprint Backlog','Development','Ready to RT Test','RT Testing','Ready to Stage Test','Stage Testing','Pending UAT','Ready To Release','Done'];
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
    return { id, role, name, originalStart: start, originalEnd: end, work, done, handoff, parentId, owner: ROLES[role] + ' 窗口', assignee: ROLES[role] + ' 窗口', state: '待開始', completedAt: null, createdBy:'PM', ...extra };
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
      task('rd', 'rd', '開發、自測與 Review', '2026-10-12', '2026-10-14', '依 PM 建立及排期的 SubStory 開發，完成自測及 Review。', 'RD 在 My Tasks 勾選自己的 SubStory 完成，留完成日；功能交棒另在 Daily 確認。', 'Daily 說明版本、環境、自測及限制，確認 QA 接手與 Story 泳道。', null, {state:'完成',completedAt:'2026-10-14'}),
      task('prep', 'qa', '測試規劃與案例 Review', '2026-10-12', '2026-10-13', '提前整理風險、案例及測試資料。', '必要案例與交付條件已確認。', '交 QA 測試接手，連回同一需求。', null, {state:'完成',completedAt:'2026-10-13'}),
      task('qa', 'qa', 'QA 測試、複驗與報告', '2026-10-10', '2026-10-16', '執行 RT 測試；RD 核對並通知後，在 PreProd（Stage Testing）確認本次功能有包含、回歸 Passed，追蹤 Bug 及整理報告。', 'PreProd 功能涵蓋確認與回歸 Passed，必要複驗完成，報告與風險交 PM，Story 進 Pending UAT。', '交 PM／指定 UAT 窗口，附報告、版本及限制；待驗收結果確認後再準備發版。'),
      task('ops', 'ops', '部署與 Prod 驗證', '2026-10-16', '2026-10-20', 'RT 後準備 PreProd 交 RD 核對；QA 功能涵蓋與回歸 Passed、放行條件確認後，準備 Prod 並依既有程序發布與驗證。', '必要交付、UAT 結果及上線驗證確認後，由 PM 確認 Story Done。', 'PreProd 先交 RD 核對；Prod 發布後回 Story 附版本及結果，請 PM 確認 Done。')
    ];
    return op ? all.filter(t => ['rd','qa','ops'].includes(t.id)) : all;
  }
  function entrance() { return [
    event('2026-10-14', 'PM 已建 Story／SubStory，RD 從 My Tasks 接工作', 'Story、SubStory 與預估開始／結束日由 PM 建立。RD 查看 My Tasks 中自己的 SubStory，依工作內容與完成條件開發；Story 目前在 Development。', 'Development', [change('rd','進行中')]),
    event('2026-10-14', 'RD 在 My Tasks 勾 SubStory 完成，Story 仍在 Development', 'RD 完成開發、自測與 Review，勾自己的 SubStory 完成，記實際完成日。這筆工作已完成；功能尚未在 Daily 交棒，Story 不自動切到 Ready to RT Test。', 'Development', [change('rd','完成','2026-10-14')]),
    event('2026-10-14', 'Daily 確認功能交棒，進 Ready to RT Test', 'Daily 說明版本、環境、自測、已知限制與接手人。確認可交棒後，由約定窗口更新 Story 泳道；實際移卡窗口由團隊確認。QA 原訂 10/16 完成 RT／Stage 測試及報告。', 'Ready to RT Test', [], [handoff('qa','RD 窗口（Daily）','QA 窗口','Daily 交棒：v1.0／環境／自測／驗收／原訂 10/16','確認接手、缺件與 RT 開測安排')]),
    event('2026-10-14', 'QA 接手，進 RT Testing', 'QA 確認資料可測後進入 RT Testing。RT 的環境、測試範圍與通過門檻沿用團隊約定；臨時開會不用逐活動切暫停。', 'RT Testing', [change('qa','進行中')], [handoff('qa','QA 窗口','RD／PM','Daily 已接到 v1.0，開始 RT 測試','上版或開發問題即時回報 PM，不等 Daily；日期變動保留原訂與原因')])
  ]; }
  function finish(qaDate, prodDate) { return [
    event(qaDate, 'RT 完成，維運接手 PreProd 準備', 'RT 必要測試完成，交本次應上功能／修復範圍與版本。PreProd 就是 Stage Testing 的環境；先由維運準備，還未進 QA 回歸。', 'Ready to Stage Test', [], [handoff('qa','QA（RT）','維運窗口','RT 結果／本次應上範圍／版本','準備 PreProd，備好後交 RD 核對')]),
    event(qaDate, '維運備好 PreProd，先交 RD 核對', '維運提供 PreProd 版本與準備結果，先交 RD 確認。此時 QA 尚未開始 PreProd 回歸，不能把維運備好當成已可往 Prod。', 'Ready to Stage Test', [change('ops','進行中')], [handoff('ops','維運窗口','RD 窗口','PreProd 已備好／版本／準備結果','RD 先核對本次應上內容有無漏上')]),
    event(qaDate, 'RD 確認沒有漏上，完成後通知 QA', 'RD 對照本次應上功能／修復與 PreProd 版本，確認內容齊全，再主動通知 QA。若漏上立即回報 PM，由 RD／維運處理後重新核對。', 'Ready to Stage Test', [], [handoff('rd','RD 窗口','QA 窗口','PreProd 範圍與版本已核對，確認本次功能／修復沒有漏上','通知 QA 開始功能涵蓋確認與回歸')]),
    event(qaDate, 'Stage Testing：QA 在 PreProd 確認功能及回歸', 'QA 收到 RD 核對與通知後，在 PreProd 確認本次功能是否有包含，並執行必要回歸。兩項結果都要明確記錄，未過先回報 PM，不往 Prod。', 'Stage Testing'),
    event(qaDate, 'QA 功能有包含、回歸 Passed，交報告進 Pending UAT', '本例 QA 確認本次功能確實包含、回歸 Passed，必要複驗與報告完成，記 QA SubStory 實際完成日。結果接既有 UAT／放行確認；QA Passed 不直接代表 Story Done。', 'Pending UAT', [change('qa','完成',qaDate)], [handoff('qa','QA 窗口','PM／指定 UAT 窗口','PreProd 版本／本次功能有包含／回歸 Passed／報告與限制','確認既有驗收與放行條件，交維運準備 Prod')]),
    event(prodDate, '放行條件確認，維運在 Ready To Release 準備 Prod', 'PreProd 功能涵蓋與回歸 Passed，PM 確認既有 UAT 結果及放行條件後，維運準備 Prod 與上版窗口；不是只說測完就直接上版。', 'Ready To Release', [change('ops','進行中')], [handoff('ops','PM／放行窗口','維運窗口','QA 雙項確認通過／UAT 結果／版本／上版資訊','維運準備 Prod，依既有核准及發布流程執行')]),
    event(prodDate, '維運上 Prod，回報版本與上版結果', '依既有核准與上版程序發布 Prod，回報版本與結果並接既有上線驗證。上版或開發遇到問題要即時回報 PM，不等下一次 Daily。', 'Ready To Release', [], [handoff('ops','維運窗口','PM／相關窗口','Prod 發布版本／上版結果','沿用既有上線驗證及結案確認，異常即時回報 PM')]),
    event(prodDate, '必要交付及上線驗證確認，Story 進 Done', '維運留版本與 Prod 結果，PM 沿既有結案條件確認，記 Story 實際完成日；各卡日期與原訂保留，不把發布動作本身視為自動結案。', 'Done', [change('ops','完成',prodDate)], [handoff('ops','維運窗口','PM','發布版本與既有驗證通過結果','PM 確認 Story Done')])
  ]; }
  const scenario = (label, tasks, events, extra = {}) => ({ label, type:'Story', title:'通知偏好設定', owner:'PM 窗口', originalStart:'2026-10-10',originalEnd:'2026-10-20',tasks,events,...extra });
  const scenarios = {
    early: scenario('提前完成',baseTasks(),[...entrance(),...finish('2026-10-14','2026-10-16')]),
    ontime: scenario('準時完成',baseTasks(),[...entrance(),...finish('2026-10-16','2026-10-20')]),
    delay: scenario('Delay／逾期未完',baseTasks(),[...entrance(),event('2026-10-17','到期後還沒完成，顯示逾期待完成','原訂 10/16 尚未交付，先看阻礙與下一步；實際完成日維持空白，不填成預估日期。','RT Testing'),...finish('2026-10-19','2026-10-21')]),
    change: scenario('改期保留原訂',baseTasks(),[...entrance(),
      event('2026-10-16','協調改期，保留原訂交期與原因','需求新增通知權限情境，PM 與各組確認 QA 改至 10/20、整體交付改至 10/22。原訂 QA 10/16 與主卡 10/20 仍保留。','RT Testing',[],[],[
        revision('qa','2026-10-16','2026-10-10','2026-10-20','新增通知權限驗收情境，需補測與更新報告'),
        revision('root','2026-10-16','2026-10-10','2026-10-22','QA 範圍調整後，重新確認部署與 Prod 驗證窗口')]),...finish('2026-10-19','2026-10-21')]),
    bug: scenario('多 Bug／複驗退回', [...baseTasks(),
      task('bug1','rd','BUG-01 通知開關未儲存','2026-10-14','2026-10-15','重現、修復、自測並交 QA 複驗。','修復版本經 QA 驗證通過；RD 交付修復只是里程碑。','同 Bug 交 QA；未過沿原單退回。','qa',{createdBy:'QA',owner:'RD-A',assignee:'RD-A',createdAt:'2026-10-14'}),
      task('bug2','rd','BUG-02 提示訊息錯誤','2026-10-14','2026-10-16','修正提示並附自測結果。','QA 驗證通過，結果留同一張 Bug。','交 QA 複驗，保留版本。','qa',{createdBy:'QA',owner:'RD-B',assignee:'RD-B',createdAt:'2026-10-14'})], [
      ...entrance(),event('2026-10-14','QA 主單下兩張 Bug，各自約定交期','QA 主單維持 QA Owner。兩張 Bug 各自有工作、完成條件、負責人與原訂日期；不受影響的測試繼續。','RT Testing',[],[handoff('bug1','QA 窗口','RD-A','BUG-01／v1.0／重現與預期結果','原訂 10/15 完成驗證，請確認修復安排'),handoff('bug2','QA 窗口','RD-B','BUG-02／v1.0／重現與預期結果','原訂 10/16 完成驗證，請確認修復安排')]),
      event('2026-10-15','RD 交 v1.1，Bug 尚待 QA 複驗','修復版本與自測交 QA，保留本輪日期。待複驗尚未符合 Bug 完成條件，實際完成日仍空白。','RT Testing',[change('bug1','待複驗',null,'QA 窗口'),change('bug2','待複驗',null,'QA 窗口')],[handoff('bug1','RD-A','QA 窗口','第 1 輪／v1.1／修復與自測','請回覆複驗結果'),handoff('bug2','RD-B','QA 窗口','第 1 輪／v1.1／修復與自測','請回覆複驗結果')]),
      event('2026-10-16','BUG-01 未過，原卡退回並協調日期','BUG-02 已驗證，完成日 10/16。BUG-01 v1.1 未過交回 RD-A；原訂 10/15 保留，新增原因與確認後的新日期。QA 主單也重新確認交期。','RT Testing',[change('bug1','需再修',null,'RD-A'),change('bug2','已驗證','2026-10-16','QA 窗口')],[handoff('bug1','QA 窗口','RD-A','第 1 輪 v1.1 未過／最新重現與 evidence','沿原單修復，重新確認版本及交期')],[revision('bug1','2026-10-16','2026-10-14','2026-10-19','v1.1 複驗未過，需再修與安排複驗','QA＋RD-A'),revision('qa','2026-10-16','2026-10-10','2026-10-20','BUG-01 再修，需完成複驗與報告交付')]),
      event('2026-10-19','同一張 Bug v1.2 通過，保留前輪結果','BUG-01 實際完成日 10/19：相較原訂 10/15 是 Delay 4 天，相較新交期 10/19 是準時。改期不會清除原訂差異。','RT Testing',[change('bug1','已驗證','2026-10-19','QA 窗口')],[handoff('bug1','RD-A','QA 窗口','第 2 輪／v1.2／自測已附','QA 確認 v1.2 複驗通過，結果留原單',2)]),...finish('2026-10-20','2026-10-21')]),
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
  return {ROLES,LANES,dateNumber,daysBetween,date,result,task,change,handoff,event,revision,validateRevision,baseTasks,scenarios,snapshot};
});
