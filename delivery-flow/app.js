(function () {
  'use strict';
  const M = window.DeliveryModel;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const number = value => Number.isInteger(value) ? String(value) : value.toFixed(1);
  const date = value => new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value));
  const duration = value => `${number(value)}<small> h</small>`;
  const roles = {
    pm: { heading: '把需求交清楚，下一位就接得住。', pain: '「我交出去之後，現在輪到誰？」', action: '收到先確認；開始釐清切處理中。需求與驗收標準備妥後，完成自己的卡，確認設計、RD 或 QA 下一張卡已指定接手人。', benefit: '看見目前輪到誰、哪次交接在等待；承諾日期和實際交付可以用同一套日曆比較。', task: 'pm' },
    ux: { heading: '設計在進行，決策等待也看得見。', pain: '「設計早就交了，但確認的時間全部算在我這裡。」', action: '處理設計時標處理中；等 PM 或 RD 決策時，選等待原因與對象。', benefit: '設計處理、等待回覆與修改區段分開。不需要設計的 OP Issue 可以略過。', task: 'ux' },
    rd: { heading: '開始切狀態，交付就交棒。', pain: '「我修好了，接下來誰要驗？」', action: '開發開始切處理中；開發交付就完成原卡、確認 QA 接手。Bug 修好則在同一張 Bug 卡改成待 QA 複驗，並指派 QA。', benefit: '修復投入按原記錄歸 RD；Bug 交給 QA 後，不會因目前負責人改變就把先前工時算給 QA。被插單才另外標暫停。', task: 'rd' },
    qa: { heading: '接手開測，有 Bug 就在主單下追。', pain: '「一個功能很多張 Bug，要怎麼維持關聯？」', action: '開始測試切處理中；Bug 開在本次 QA 主單下，各自指派 RD。收到待複驗 Bug 後驗證，通過才標已驗證；QA 主單的 Owner 保留 QA。', benefit: '測試、報告與各張 Bug 保持同一個交付包；QA 的投入與 RD 修復投入分開，等待修復也不等於等待 QA 開測。', task: 'qa' },
    ops: { heading: '交付到 Prod，有完整的時間脈絡。', pain: '「我要拉報表，還得逐張卡追問這段時間在做什麼。」', action: '接手交付後標示待部署、部署與 Prod 驗證；確認驗證完成後結案。', benefit: '用相同口徑看預期與實際交付、跨組等待與待部署時間，找到可改善的流程。', task: 'ops' }
  };
  let role = 'pm', scenarioId = 'normal', index = 0, selectedTask = 'pm', timer = null;
  const statusLabel = (t, status = t.status) => t.parentId && status === 'done' ? '已驗證' : t.parentId && status === 'active' ? '修復中' : t.parentId && status === 'waiting' ? '待修復' : M.STATUS[status];

  $('role-tabs').innerHTML = Object.entries(M.ROLES).map(([key, label], i) => `<button type="button" class="role-tab" role="tab" id="role-${key}" data-role="${key}" aria-controls="role-panel" aria-selected="${key === role}" tabindex="${key === role ? 0 : -1}"><span class="role-number">0${i + 1}</span>${label}</button>`).join('');
  $('scenario-tabs').innerHTML = Object.entries(M.scenarios).map(([key, s]) => `<button type="button" class="scenario-tab" role="tab" id="scenario-${key}" data-scenario="${key}" aria-controls="scenario-content" aria-selected="${key === scenarioId}" tabindex="${key === scenarioId ? 0 : -1}"><span>${s.short}</span>${s.label}</button>`).join('');
  document.querySelector('.demo-workspace').id = 'scenario-content';
  document.querySelector('.demo-workspace').setAttribute('role', 'tabpanel');
  function updateTabs(container, attribute, value) {
    for (const button of container.querySelectorAll('[role=tab]')) {
      const selected = button.dataset[attribute] === value;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
  }
  function selectRole(nextRole) {
    role = nextRole;
    const info = roles[role];
    const exists = M.scenarios[scenarioId].tasks.some(t => t.id === info.task);
    if (exists) selectedTask = info.task;
    $('role-panel').innerHTML = `<div><span class="role-chip">${M.ROLES[role]}</span><h3>${info.heading}</h3><p class="role-quote">${info.pain}</p></div><div class="role-detail"><div><strong>你最少需要做</strong><p>${info.action}</p></div><div><strong>你可以得到</strong><p>${info.benefit}</p></div></div>`;
    $('role-panel').setAttribute('aria-labelledby', `role-${role}`);
    updateTabs($('role-tabs'), 'role', role);
    render();
  }
  function stop() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    $('play').setAttribute('aria-pressed', 'false');
    $('play').textContent = '▶ 自動播放';
  }
  function changeScenario(id) {
    stop();
    scenarioId = id;
    index = 0;
    const preferred = roles[role].task;
    selectedTask = M.scenarios[id].tasks.some(t => t.id === preferred) ? preferred : 'qa';
    updateTabs($('scenario-tabs'), 'scenario', id);
    render();
  }
  function render() {
    const scenario = M.scenarios[scenarioId];
    const snap = M.snapshot(scenario, index);
    const selected = snap.tasks.find(t => t.id === selectedTask) || snap.tasks.find(t => t.role === role) || snap.tasks[0];
    selectedTask = selected.id;
    $('scenario-content').setAttribute('aria-labelledby', `scenario-${scenarioId}`);
    $('parent-type').textContent = `${scenario.type.toUpperCase()} · ${scenarioId === 'op' ? 'OP-042' : 'STORY-024'}`;
    $('parent-title').textContent = scenario.title;
    $('parent-meta').textContent = `需求／收單 Owner：${scenario.owner} ｜ 驗收：功能符合需求，Prod 驗證通過 ｜ 原承諾：${date(scenario.dueAt)}`;
    $('parent-stage').textContent = snap.current.stage;
    const late = snap.now > scenario.dueAt ? M.workHours(scenario.dueAt, snap.now) : 0;
    $('delivery-variance').textContent = snap.complete ? late > 0 ? `較原承諾晚 ${number(late)} 個工作小時` : '依原承諾完成交付' : late > 0 ? `尚未交付・已超過原承諾 ${number(late)} 個工作小時` : '原承諾日期保留，尚未交付';
    $('delivery-variance').classList.toggle('late', late > 0);
    $('elapsed-label').textContent = snap.complete ? '整體日曆交付時間' : '目前日曆經過';
    $('parent-elapsed').innerHTML = duration(snap.elapsed);
    $('parent-work').innerHTML = duration(snap.work);
    $('op-note').hidden = scenarioId !== 'op';
    const ordered = [];
    function addChildren(parentId, depth) {
      for (const t of snap.tasks.filter(t => t.parentId === parentId)) { ordered.push({ ...t, depth }); addChildren(t.id, depth + 1); }
    }
    addChildren(null, 0);
    $('task-list').innerHTML = ordered.map(t => {
      const children = snap.tasks.filter(c => c.parentId === t.id).length;
      return `<button type="button" class="task-row ${t.depth ? 'is-nested' : ''} ${t.role === role ? 'is-related' : ''} ${t.id === selected.id ? 'is-selected' : ''}" data-task="${t.id}" data-parent="${t.parentId || ''}" aria-pressed="${t.id === selected.id}" aria-label="查看 ${t.parentId ? 'QA 主單下的 Bug：' : ''}${escape(t.name)}，${statusLabel(t)}，目前負責人 ${escape(t.assignee)}"><span class="task-name"><span class="role-badge" style="--role-color:var(--${t.role})">${t.parentId ? '↳ Bug' : M.ROLES[t.role]}</span><span><strong>${escape(t.name)}${children ? `<span class="child-count">${children} 張 Bug</span>` : ''}</strong><small>${t.parentId ? `QA 主單下・目前：${escape(t.assignee)}` : t.id === 'qa' ? `QA 主單・目前：${escape(t.assignee)}` : `目前：${escape(t.assignee)}`}${t.reason ? `<br>${escape(t.reason)}` : ''}</small></span></span><span class="status-chip ${t.status}">${statusLabel(t)}</span>${['active', 'waiting', 'paused'].map(s => `<span class="task-number ${t.totals[s].work === 0 ? 'is-zero' : ''}">${number(t.totals[s].work)}h</span>`).join('')}</button>`;
    }).join('');
    $('detail-role').textContent = selected.parentId ? 'QA 主單下的 Bug / 修復職能 RD' : `已選取工作卡 / ${M.ROLES[selected.role]}`;
    $('detail-title').textContent = selected.name;
    $('detail-owner').textContent = `目前負責人：${selected.assignee}${selected.parentId ? '｜修復投入依原 RD 記錄分類' : selected.id === 'qa' ? '（QA 主單 Owner 保留）' : ''}`;
    $('detail-stats').innerHTML = [['active', '處理區段'], ['waiting', '等待區段'], ['paused', '暫停區段']].map(([state, label]) => `<div class="detail-stat"><span><i class="${state}"></i>${label}</span><strong>${duration(selected.totals[state].work)}</strong><small>日曆 ${number(selected.totals[state].calendar)}h</small></div>`).join('');
    const planned = selected.estimatedSpan === null ? '未預估（新增 Bug）' : `${number(selected.estimatedSpan)}h`;
    const actual = selected.actualSpan === null ? '尚未開始' : `${number(selected.actualSpan)}h`;
    $('span-comparison').innerHTML = `<div><span>預估階段跨度</span><strong>${planned}</strong></div><div><span>${selected.status === 'done' ? '實際' : '目前'}階段跨度</span><strong>${actual}</strong></div><p>工作時段計算，包含區間內等待、暫停與尚未再開工的時段；與投入人時分開。</p>`;
    $('reported-task-hours').textContent = selected.reportedHours === null ? '未回報' : `${number(selected.reportedHours)} 人時`;
    $('reported-task-note').textContent = selected.reportedHours === null ? '本卡沒有投入紀錄；不以處理中時間代替，也不當成零。' : '僅此卡自身的補登明細；與左側狀態區段分開。此為模擬人時。';
    $('effort-panel').hidden = scenarioId !== 'bug';
    if (scenarioId === 'bug') {
      const pack = M.reportedPackage(snap, 'qa');
      const reported = value => value === undefined || value === null ? '未回報' : `${number(value)}<small> 人時</small>`;
      $('qa-reported').innerHTML = reported(pack.byRole.qa);
      $('rd-reported').innerHTML = reported(pack.byRole.rd);
      $('package-reported').innerHTML = reported(pack.total);
      $('effort-entries').innerHTML = pack.entries.length ? `<table><caption>已補登的投入明細（模擬資料）</caption><thead><tr><th>記錄在哪張卡</th><th>投入者／職能</th><th>回報投入</th></tr></thead><tbody>${pack.entries.map(e => `<tr><td>${escape(snap.tasks.find(t => t.id === e.taskId).name)}<small>${escape(e.activity)}</small></td><td>${escape(e.person)} / ${M.ROLES[e.role]}</td><td>${number(e.hours)} 人時</td></tr>`).join('')}</tbody></table>` : '<p class="effort-empty">目前尚未補登投入。按下一步查看交付時如何補登，未回報不代表零。</p>';
    }
    const intervals = selected.segments.filter(s => s.status !== 'done');
    const max = intervals.reduce((sum, s) => sum + M.elapsedHours(s.at, s.end), 0);
    $('timeline-track').innerHTML = intervals.length ? intervals.map(s => {
      const work = M.workHours(s.at, s.end), calendar = M.elapsedHours(s.at, s.end);
      return `<span class="timeline-segment ${s.status === 'review' || s.status === 'pending' && s.ready ? 'waiting' : s.status}" style="flex:${calendar}" title="${statusLabel(selected, s.status)}：工作 ${number(work)}h／日曆 ${number(calendar)}h${s.reason ? `；${escape(s.reason)}` : ''}">${calendar / max > 0.15 ? `${statusLabel(selected, s.status)} ${number(work)}h` : ''}</span>`;
    }).join('') : '<span class="timeline-empty">目前沒有已經過的時間區段</span>';
    $('timeline-track').setAttribute('aria-label', '選取子卡的區段，寬度依日曆時間比例；文字標示工作小時');
    $('timeline-start').textContent = selected.startedAt ? date(selected.startedAt) : '尚未開始';
    $('timeline-end').textContent = `${date(selected.status === 'done' ? selected.at : snap.now)} ・寬度依日曆比例`;
    $('task-history').innerHTML = selected.transitions.map(c => {
      const segment = selected.segments.find(s => s.at === c.at && s.status === c.status);
      const hours = segment && c.status !== 'done' ? ` ${number(M.workHours(segment.at, segment.end))}h` : '';
      return `<span class="history-chip">${date(c.at)} ${statusLabel(selected, c.status)}${hours}${c.assignee ? ` → ${escape(c.assignee)}` : ''}${c.reason ? `・${escape(c.reason)}` : ''}</span>`;
    }).join('');
    $('step-count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(scenario.events.length).padStart(2, '0')}`;
    $('event-time').textContent = `${date(snap.now)} · Asia/Taipei`;
    $('event-title').textContent = snap.current.title;
    $('event-description').textContent = snap.current.description;
    $('step-dots').innerHTML = scenario.events.map((e, i) => `<button type="button" class="step-dot ${i < index ? 'past' : ''} ${i === index ? 'current' : ''}" data-step="${i}" aria-label="第 ${i + 1} 步：${escape(e.title)}" ${i === index ? 'aria-current="step"' : ''}></button>`).join('');
    $('previous').disabled = index === 0;
    $('next').disabled = snap.complete;
    $('scenario-insight').textContent = scenario.insight;
    if (snap.complete && timer !== null) stop();
  }
  function tabKeyboard(container, attribute, callback) {
    container.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...container.querySelectorAll('[role=tab]')];
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      callback(tabs[next].dataset[attribute]);
      tabs[next].focus({ preventScroll: true });
    });
  }
  $('role-tabs').addEventListener('click', e => { const b = e.target.closest('[data-role]'); if (b) selectRole(b.dataset.role); });
  $('scenario-tabs').addEventListener('click', e => { const b = e.target.closest('[data-scenario]'); if (b) changeScenario(b.dataset.scenario); });
  tabKeyboard($('role-tabs'), 'role', selectRole);
  tabKeyboard($('scenario-tabs'), 'scenario', changeScenario);
  $('task-list').addEventListener('click', e => {
    const b = e.target.closest('[data-task]');
    if (b) { selectedTask = b.dataset.task; render(); $('task-list').querySelector(`[data-task="${selectedTask}"]`).focus({ preventScroll: true }); }
  });
  $('step-dots').addEventListener('click', e => { const b = e.target.closest('[data-step]'); if (b) { stop(); index = Number(b.dataset.step); render(); $('step-dots').querySelector(`[data-step="${index}"]`).focus({ preventScroll: true }); } });
  $('previous').addEventListener('click', () => { stop(); index = Math.max(0, index - 1); render(); });
  $('next').addEventListener('click', () => { stop(); index = Math.min(M.scenarios[scenarioId].events.length - 1, index + 1); render(); });
  $('reset').addEventListener('click', () => { stop(); index = 0; render(); });
  $('finish').addEventListener('click', () => { stop(); index = M.scenarios[scenarioId].events.length - 1; render(); });
  $('play').addEventListener('click', () => {
    if (timer !== null) { stop(); return; }
    if (index === M.scenarios[scenarioId].events.length - 1) index = 0;
    render();
    $('play').setAttribute('aria-pressed', 'true');
    $('play').textContent = 'Ⅱ 暫停播放';
    timer = window.setInterval(() => { index = Math.min(M.scenarios[scenarioId].events.length - 1, index + 1); render(); }, 5500);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  $('print').addEventListener('click', () => { stop(); window.print(); });
  const weekend = ['2026-10-16T17:00:00+08:00', '2026-10-19T10:00:00+08:00'];
  $('weekend-calendar').innerHTML = `${number(M.elapsedHours(...weekend))}<span> h</span>`;
  $('weekend-work').innerHTML = `${number(M.workHours(...weekend))}<span> h</span>`;
  selectRole(role);
})();
