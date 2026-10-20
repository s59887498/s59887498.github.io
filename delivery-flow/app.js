(function () {
  'use strict';
  const M = window.DeliveryModel;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const number = value => Number.isInteger(value) ? String(value) : value.toFixed(1);
  const date = value => new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value));
  const duration = value => `${number(value)}<small> h</small>`;
  const roles = {
    pm: { heading: '少一點追問，多一點交期依據。', pain: '「需求已經說了，為什麼還一直來回確認？」', action: '主卡放好需求、驗收標準與承諾日期；需求待確認時，回到原卡接續處理。', benefit: '看見需求往返與受阻位置。交期受影響時，有依據跟團隊重新排程。', task: 'pm' },
    ux: { heading: '設計在進行，決策等待也看得見。', pain: '「設計早就交了，但確認的時間全部算在我這裡。」', action: '處理設計時標處理中；等 PM 或 RD 決策時，選等待原因與對象。', benefit: '設計處理、等待回覆與修改區段分開。不需要設計的 OP Issue 可以略過。', task: 'ux' },
    rd: { heading: '開發、修 Bug、被插單，各有紀錄。', pain: '「一天被插好幾次單，原本的進度卻像沒有在動。」', action: '開始與完成時更新狀態。被核准插單時標暫停，恢復後沿用原卡。', benefit: '看見開發與修復區段、中斷原因及交期影響；後續建立共同的插單入口。', task: 'rd' },
    qa: { heading: '提早規劃，測試與等待分開看。', pain: '「我在等修復，但報表看起來像一直在測試。」', action: '開發前先做測試計畫與案例 Review；受影響測試等待修復時，保留 QA Owner 與 Bug 關聯。', benefit: '分清前期準備、首次測試、等待及複驗；其他可以執行的測試繼續推進。', task: 'qa' },
    ops: { heading: '交付到 Prod，有完整的時間脈絡。', pain: '「我要拉報表，還得逐張卡追問這段時間在做什麼。」', action: '接手交付後標示待部署、部署與 Prod 驗證；確認驗證完成後結案。', benefit: '用相同口徑看預期與實際交付、跨組等待與待部署時間，找到可改善的流程。', task: 'ops' }
  };
  let role = 'qa', scenarioId = 'bug', index = M.scenarios.bug.events.length - 1, selectedTask = 'qa', timer = null;

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
    $('parent-meta').textContent = `Owner：${scenario.owner} ｜ 驗收：功能符合需求，Prod 驗證通過 ｜ 原承諾：${date(scenario.dueAt)}`;
    $('parent-stage').textContent = snap.current.stage;
    const late = snap.now > scenario.dueAt ? M.workHours(scenario.dueAt, snap.now) : 0;
    $('delivery-variance').textContent = snap.complete ? late > 0 ? `較原承諾晚 ${number(late)} 個工作小時` : '依原承諾完成交付' : late > 0 ? `尚未交付・已超過原承諾 ${number(late)} 個工作小時` : '原承諾日期保留，尚未交付';
    $('delivery-variance').classList.toggle('late', late > 0);
    $('elapsed-label').textContent = snap.complete ? '整體日曆交付時間' : '目前日曆經過';
    $('parent-elapsed').innerHTML = duration(snap.elapsed);
    $('parent-work').innerHTML = duration(snap.work);
    $('op-note').hidden = scenarioId !== 'op';
    $('task-list').innerHTML = snap.tasks.map(t => `<button type="button" class="task-row ${t.role === role ? 'is-related' : ''} ${t.id === selected.id ? 'is-selected' : ''}" data-task="${t.id}" aria-pressed="${t.id === selected.id}" aria-label="查看 ${M.ROLES[t.role]} ${escape(t.name)}，${M.STATUS[t.status]}"><span class="task-name"><span class="role-badge" style="--role-color:var(--${t.role})">${M.ROLES[t.role]}</span><span><strong>${escape(t.name)}</strong><small>${t.reason ? `${escape(t.reason)}${t.target ? ` → ${escape(t.target)}` : ''}` : t.id === 'prep' ? '開發前先準備・獨立子卡' : t.id === 'bug' ? '同一張主卡下的 RD 修復卡' : `Owner：${M.ROLES[t.role]}`}</small></span></span><span class="status-chip ${t.status}">${M.STATUS[t.status]}</span>${['active', 'waiting', 'paused'].map(s => `<span class="task-number ${t.totals[s].work === 0 ? 'is-zero' : ''}">${number(t.totals[s].work)}h</span>`).join('')}</button>`).join('');
    $('detail-role').textContent = `已選取子卡 / ${M.ROLES[selected.role]}`;
    $('detail-title').textContent = selected.name;
    $('detail-owner').textContent = `Owner：${M.ROLES[selected.role]}${selected.id === 'qa' && scenarioId === 'bug' ? '（等待修復時仍保留）' : ''}`;
    $('detail-stats').innerHTML = [['active', '處理區段'], ['waiting', '等待區段'], ['paused', '暫停區段']].map(([state, label]) => `<div class="detail-stat"><span><i class="${state}"></i>${label}</span><strong>${duration(selected.totals[state].work)}</strong><small>日曆 ${number(selected.totals[state].calendar)}h</small></div>`).join('');
    const planned = selected.estimatedSpan === null ? '未預估（新增 Bug）' : `${number(selected.estimatedSpan)}h`;
    const actual = selected.actualSpan === null ? '尚未開始' : `${number(selected.actualSpan)}h`;
    $('span-comparison').innerHTML = `<div><span>預估階段跨度</span><strong>${planned}</strong></div><div><span>${selected.status === 'done' ? '實際' : '目前'}階段跨度</span><strong>${actual}</strong></div><p>工作時段計算，包含區間內等待、暫停與尚未再開工的時段；與投入人時分開。</p>`;
    const intervals = selected.segments.filter(s => s.status !== 'done');
    const max = intervals.reduce((sum, s) => sum + M.elapsedHours(s.at, s.end), 0);
    $('timeline-track').innerHTML = intervals.length ? intervals.map(s => {
      const work = M.workHours(s.at, s.end), calendar = M.elapsedHours(s.at, s.end);
      return `<span class="timeline-segment ${s.status}" style="flex:${calendar}" title="${M.STATUS[s.status]}：工作 ${number(work)}h／日曆 ${number(calendar)}h${s.reason ? `；${escape(s.reason)}` : ''}">${calendar / max > 0.15 ? `${M.STATUS[s.status]} ${number(work)}h` : ''}</span>`;
    }).join('') : '<span class="timeline-empty">目前沒有已經過的時間區段</span>';
    $('timeline-track').setAttribute('aria-label', '選取子卡的區段，寬度依日曆時間比例；文字標示工作小時');
    $('timeline-start').textContent = selected.startedAt ? date(selected.startedAt) : '尚未開始';
    $('timeline-end').textContent = `${date(selected.status === 'done' ? selected.at : snap.now)} ・寬度依日曆比例`;
    $('task-history').innerHTML = selected.transitions.map(c => {
      const segment = selected.segments.find(s => s.at === c.at && s.status === c.status);
      const hours = segment && c.status !== 'done' ? ` ${number(M.workHours(segment.at, segment.end))}h` : '';
      return `<span class="history-chip">${date(c.at)} ${M.STATUS[c.status]}${hours}${c.reason ? `・${escape(c.reason)}` : ''}</span>`;
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
