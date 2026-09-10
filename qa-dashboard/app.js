/* No external libraries or CDN. All research text is rendered as plain text. */
"use strict";
const staticMode = window.QA_STATIC === true;
const labels = {
  stages: {planning:"測試規劃", cases:"案例準備", execution:"測試執行", retest:"缺陷複驗", report:"報告交付"},
  activity: {active:"測試中", blocked:"受阻", awaiting_report:"測試完成・待報告", completed:"已完成", needs_confirmation:"待確認現況"},
  category: {performance:"效能", ocpp:"OCPP 知識", architecture:"架構", qa_workflow:"QA 流程"},
  confidence: {hypothesis:"待驗證假設", evidence:"已有程式證據", measured:"已有量測"},
  decision: {pending:"待評估", queued:"待交接 Codex", in_progress:"進行中", done:"已完成", dismissed:"暫不採用"},
};
const state = {data:null, query:"", filter:"all", category:"all", projectFilter:"all", detail:null, busy:false};
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const badge = (text, type="neutral") => `<span class="badge ${esc(type)}">${esc(text)}</span>`;
const shortDate = value => value ? String(value).slice(0,10).replaceAll("-","/") : "待更新";
const isStale = value => !value || (Date.now()-new Date(value).getTime()) > 7*86400000;
const decision = item => state.data.decisions.items[item.id]?.status || "pending";
const changed = item => {
  const r = state.data.decisions.items[item.id];
  return r?.reviewed_revision && r.reviewed_revision !== state.data.item_revisions[item.id];
};
const pct = project => project.counts && project.total > 0 ? Math.round(100*(project.counts.passed+project.counts.failed)/project.total) : null;

function toast(message) {
  const el = $("#toast"); el.textContent=message; el.hidden=false;
  clearTimeout(toast.timer); toast.timer=setTimeout(()=>{el.hidden=true;},4000);
}
async function api(path, body) {
  if (staticMode) {
    if (body) throw new Error("這是唯讀快照，請在本機工作台操作");
    if (path === "/api/state") path = "./snapshot.json";
    else if (path.startsWith("/api/handoff/")) {
      const prompt = state.data.handoff_prompts[path.split("/").pop()];
      if (!prompt) throw new Error("此快照沒有交接內容");
      return {prompt};
    } else if (path.startsWith("/api/task/")) {
      return {prompt:state.data.task_prompts[path.split("/").pop()]};
    } else throw new Error("唯讀快照不支援此操作");
  }
  const response=await fetch(path, body ? {method:"POST",headers:{"Content-Type":"application/json","X-QA-Token":state.data.token},body:JSON.stringify(body)} : {cache:"no-store"});
  const result=await response.json();
  if (!response.ok) throw new Error(result.error || "操作失敗");
  return result;
}
async function refresh(quiet=false) {
  try {
    const data=await api("/api/state"); state.data=data;
    $("#load-error").hidden=true;
    $("#sync-state").textContent=staticMode ? `唯讀快照 · ${new Date(data.exported_at).toLocaleString("zh-TW")}` : `已讀取 · ${new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}`;
    render();
    if (!quiet) toast("已重新讀取專案與優化清單");
  } catch(error) {
    $("#load-error").hidden=false; $("#load-error").textContent=`無法更新：${error.message}。${staticMode?"請重新整理或確認快照發布結果。":"請確認本機服務及 JSON 格式。"}`;
    $("#sync-state").textContent="連線中斷";
    if (!state.data) $("#content").innerHTML='<div class="empty">尚未取得資料。請修正後按右上角重新整理。</div>';
  }
}
function sourceList(items) {
  return items.map(s => `<li class="source"><span class="source-type">${s.kind==="web"?"WEB":"FILE"}</span><div>${s.kind==="web"?`<a href="${esc(s.ref)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`:`<strong>${esc(s.label)}</strong>`}<small>${esc(s.ref)}</small><small>查閱 ${shortDate(s.checked_at)}${s.published_at?` · 發布 ${shortDate(s.published_at)}`:""}</small></div></li>`).join("");
}
function stat(number,label,note,style="") { return `<div class="stat ${style}"><span>${label}</span><strong>${number}</strong><small>${note}</small></div>`; }
function render() {
  if (!state.data) return;
  const optimization=location.hash.startsWith("#/optimizations");
  $("#nav-projects").classList.toggle("active",!optimization);
  $("#nav-optimizations").classList.toggle("active",optimization);
  $("#nav-projects").setAttribute("aria-current",optimization?"false":"page");
  $("#nav-optimizations").setAttribute("aria-current",optimization?"page":"false");
  $("#crumb").textContent=optimization?"優化清單":"測試專案";
  $("#project-count").textContent=state.data.projects.items.length;
  $("#optimization-count").textContent=state.data.optimizations.items.filter(i=>decision(i)==="pending" && i.research_status!=="withdrawn").length;
  if (optimization) renderOptimizations(); else renderProjects();
}
function renderProjects() {
  const all=state.data.projects.items;
  const unknown=all.filter(p=>p.activity==="needs_confirmation" || isStale(p.activity_confirmed_at)).length;
  const active=all.filter(p=>p.activity==="active" && !isStale(p.activity_confirmed_at)).length;
  const selected=all.filter(p=>state.projectFilter==="all" || p.activity===state.projectFilter);
  $("#content").innerHTML=`<div class="page-heading"><div><div class="eyebrow">TESTING OVERVIEW</div><h1>測試專案</h1><p>掌握每個專案的階段、進度與下一步。</p></div><button class="primary" data-task="progress">同步進度任務 <span>↗</span></button></div>
    <div class="stats">${stat(active,"確認測試中","最近 7 天有現況依據","accent")}${stat(all.filter(p=>p.activity==="blocked"&&!isStale(p.activity_confirmed_at)).length,"目前受阻","依已確認的專案狀態")}${stat(unknown,"等待同步","需補最新進度或確認現況")}${stat(all.length,"追蹤專案","各版本與測試輪次分開管理")}</div>
    ${unknown?`<div class="notice"><span class="notice-icon">i</span><div><strong>先確認最新進度，再做判斷</strong><p>${unknown} 個專案的狀態待同步。下方保留歷史來源與日期；未把舊報告當作目前測試結果。</p></div></div>`:""}
    <div class="section-heading"><h2>專案進度 <span>${selected.length}</span></h2><label class="filter-label">顯示 <select id="project-filter"><option value="all">全部專案</option>${Object.entries(labels.activity).map(([key,value])=>`<option value="${key}" ${state.projectFilter===key?"selected":""}>${value}</option>`).join("")}</select></label></div>
    <div class="project-grid">${selected.map(projectCard).join("") || '<div class="empty">目前沒有符合條件的專案。可請 Claude 執行同步進度任務。</div>'}</div>
    <div class="method-note"><strong>進度如何計算？</strong>已執行率 =（通過＋失敗）÷ 範圍案例數。Blocked、Skipped 與未執行不算已執行；不同輪次的局部複驗不直接加總。</div>`;
  $("#project-filter").onchange=e=>{state.projectFilter=e.target.value;renderProjects();};
}
function projectCard(p) {
  const percent=pct(p), c=p.counts;
  const stale=p.activity==="needs_confirmation" || isStale(p.activity_confirmed_at);
  const stages=Object.entries(labels.stages), index=stages.findIndex(([key])=>key===p.stage);
  return `<article class="project-card"><div class="card-top"><span class="project-product">${esc(p.product)}</span>${badge(stale?"待確認現況":labels.activity[p.activity],stale?"amber":p.activity==="active"?"teal":"neutral")}</div>
    <h3>${esc(p.title)}</h3><p class="project-summary">${esc(p.summary)}</p><div class="project-meta"><span>◉ ${esc(p.owner)}</span><span>${esc(p.environment)}</span></div>
    <div class="stage-caption">最近紀錄階段 <strong>${labels.stages[p.stage]}</strong><span>${shortDate(p.observed_at)}</span></div>
    <ol class="stages">${stages.map(([key,value],i)=>`<li class="${i===index?"current":i<index?"previous":""}"><i>${i===index?"●":i+1}</i><span>${value}</span></li>`).join("")}</ol>
    <div class="progress-head"><span>${c?`案例表快照 · ${shortDate(p.counts_as_of)}`:"案例結果待彙整"}</span><strong>${p.activity==="awaiting_report"?"待報告交付":`${percent===null?"—":percent+"%"}<small> 已執行</small>`}</strong></div>
    ${p.activity==="awaiting_report"?'<p class="method-note">測試完成依人員確認；下方保留案例表狀態，歷史未執行項不視為新缺陷。</p>':`<div class="progress-track" aria-label="${percent===null?"尚無完整結果":`已執行率 ${percent}%`}"><span style="width:${percent??0}%"></span></div>`}
    <div class="case-counts"><span><b>${p.total??"—"}</b>範圍</span><span class="passed"><b>${c?.passed??"—"}</b>通過</span><span class="failed"><b>${c?.failed??"—"}</b>失敗</span><span class="blocked"><b>${c?.blocked??"—"}</b>受阻</span><span><b>${c?.skipped??"—"}</b>跳過</span><span><b>${c?.not_run??"—"}</b>未執行</span></div>
    <div class="next-action"><span>下一步</span><p>${esc(p.next_action)}</p></div><button class="text-button card-bottom" data-project="${esc(p.id)}">查看範圍與來源 <span>→</span></button></article>`;
}
function renderOptimizations() {
  const items=state.data.optimizations.items;
  const pending=items.filter(i=>decision(i)==="pending"&&i.research_status!=="withdrawn").length;
  $("#content").innerHTML=`<div class="page-heading"><div><div class="eyebrow">CONTINUOUS IMPROVEMENT</div><h1>優化清單</h1><p>從研究到落地，先選擇值得做的改善。</p></div><button class="primary" data-task="research">Claude 研究任務 <span>↗</span></button></div>
    <div class="stats">${stat(pending,"等待評估","先看證據與適用範圍","accent")}${stat(items.filter(i=>decision(i)==="queued").length,"待交接 Codex","任務已備妥，尚未啟動")}${stat(items.filter(i=>decision(i)==="in_progress").length,"優化進行中","已手動確認開始執行")}${stat(items.filter(i=>decision(i)==="done").length,"已完成","已提供結果文件")}</div>
    <div class="optimization-layout"><section class="list-panel"><div class="toolbar"><label class="search"><span>⌕</span><input id="search" placeholder="搜尋問題、功能或編號" aria-label="搜尋優化清單" value="${esc(state.query)}"></label><select id="category" aria-label="篩選分類"><option value="all">全部分類</option>${Object.entries(labels.category).map(([k,v])=>`<option value="${k}" ${state.category===k?"selected":""}>${v}</option>`).join("")}</select></div>
    <div class="tabs" role="group" aria-label="決策狀態篩選">${[["all","全部"],...Object.entries(labels.decision)].map(([k,v])=>`<button data-filter="${k}" class="${state.filter===k?"selected":""}" aria-pressed="${state.filter===k}">${v}</button>`).join("")}</div><div id="optimization-list"></div></section>
    <aside class="guide-panel"><div class="guide-kicker">從這裡開始</div><h2>好的建議，<br>先有好的證據。</h2><ol><li><b>01</b><div><strong>Claude 找出機會</strong><p>結合官方新知與現有程式，註明來源及驗證方式。</p></div></li><li><b>02</b><div><strong>你決定優先順序</strong><p>查看收益、成本與風險，採用或暫緩。</p></div></li><li><b>03</b><div><strong>交給 Codex 執行</strong><p>產生任務，複製到 Codex；完成後留下結果。</p></div></li></ol><div class="guide-foot">沒有量測的效能建議<br><strong>會保留為「待驗證假設」</strong></div></aside></div>`;
  $("#search").oninput=e=>{state.query=e.target.value;renderList();};
  $("#category").onchange=e=>{state.category=e.target.value;renderList();};
  renderList();
}
function renderList() {
  const items=state.data.optimizations.items.filter(i=>(state.filter==="all" || decision(i)===state.filter) && (state.category==="all" || i.category===state.category) && `${i.id} ${i.title} ${i.summary}`.toLowerCase().includes(state.query.toLowerCase())).sort((a,b)=>a.priority.localeCompare(b.priority)||a.id.localeCompare(b.id));
  $("#optimization-list").innerHTML=items.map(item=>`<article class="optimization-row"><div class="priority ${item.priority.toLowerCase()}">${item.priority}</div><div class="row-content"><div class="row-meta"><span>${esc(item.id)}</span><span>·</span><span>${labels.category[item.category]}</span>${badge(labels.confidence[item.confidence],item.confidence==="hypothesis"?"amber":"blue")}</div><button class="row-title" data-item="${item.id}">${esc(item.title)}</button><p>${esc(item.summary)}</p><div class="row-foot"><span>查閱 ${shortDate(item.researched_at)}</span>${badge(item.research_status==="withdrawn"?"研究已撤回":labels.decision[decision(item)],decision(item)==="done"?"teal":"neutral")}${changed(item)?badge("建議已更新，需再確認","amber"):""}</div></div><button class="row-open" data-item="${item.id}" aria-label="查看 ${esc(item.title)}">↗</button></article>`).join("") || '<div class="empty">沒有符合條件的建議。<br>可調整篩選，或讓 Claude 執行研究任務。</div>';
}
function openDialog(html) {
  $("#dialog-content").innerHTML=html;
  if (!$("#detail-dialog").open) $("#detail-dialog").showModal();
}
const dialogHead=(label,title)=>`<div class="dialog-head"><div><div class="eyebrow">${esc(label)}</div><h2 id="dialog-title">${esc(title)}</h2></div><button class="icon-button" data-close aria-label="關閉">×</button></div>`;
function openProject(id) {
  const p=state.data.projects.items.find(x=>x.id===id); if(!p)return;
  openDialog(`${dialogHead(p.product,p.title)}<div class="dialog-body"><p class="lead">${esc(p.summary)}</p><h3>本輪範圍</h3><p>${esc(p.scope_note)}</p><h3>待處理事項</h3><ul>${p.blockers.map(s=>`<li>${esc(s)}</li>`).join("")}</ul><h3>可追溯來源</h3><ul class="sources">${sourceList(p.sources)}</ul><p class="muted">本機來源以 HDRE 相對路徑顯示，可在編輯器開啟；工作台不公開原始檔案。</p></div>`);
}
function openItem(id) {
  const item=state.data.optimizations.items.find(x=>x.id===id); if(!item)return;
  state.detail=id; const record=state.data.decisions.items[id]||{}, status=decision(item);
  state.detailRevision=state.data.item_revisions[id];
  state.decisionRevision=state.data.revisions.decisions;
  openDialog(`${dialogHead(`${item.id} · ${labels.category[item.category]}`,item.title)}<div class="dialog-body"><div class="detail-badges">${badge(item.priority,"amber")}${badge(labels.confidence[item.confidence],"blue")}${badge(labels.decision[status])}${changed(item)?badge("建議改版，請重新確認","amber"):""}</div><p class="lead">${esc(item.summary)}</p>
    <div class="detail-columns"><div><h3>目前發現</h3><p>${esc(item.finding)}</p></div><div><h3>建議怎麼做</h3><p>${esc(item.proposal)}</p></div></div>
    <div class="baseline"><strong>量測基準</strong><p>${esc(item.baseline)}</p></div><div class="detail-columns"><div><h3>預期收益</h3><p>${esc(item.benefit)}</p><h3>工作量</h3><p>${esc(item.effort)}</p></div><div><h3>風險與取捨</h3><p>${esc(item.risk)}</p></div></div>
    <h3>修改範圍</h3><ul class="paths">${item.scope.map(s=>`<li>${esc(s)}</li>`).join("")}</ul><h3>驗收方式</h3><ul>${item.acceptance.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
    <h3>研究來源</h3><ul class="sources">${sourceList(item.sources)}</ul><p class="muted">${esc(item.author)} · ${shortDate(item.researched_at)}</p>
    ${staticMode ? `<div class="decision-form"><h3>本機決策快照</h3><p>此頁唯讀。採用、進行中、完成與備註請在本機工作台更新，下次發布後顯示。</p><p>${esc(record.note||"尚無備註")}</p>${record.result_ref?`<p class="path-note">結果：${esc(record.result_ref)}</p>`:""}${record.handoff?`<button class="secondary" data-view-handoff="${id}">查看／複製既有交接</button>`:""}</div>` : `<div class="decision-form"><h3>你的決定</h3><label for="decision-note">備註（選填）</label><textarea id="decision-note" rows="2" placeholder="例如：先量測，不調整測試行為">${esc(record.note||"")}</textarea>${record.handoff?`<label for="result-ref">完成結果文件（標記完成時必填）</label><input id="result-ref" value="${esc(record.result_ref||"")}" placeholder="qa_optimization/reports/optimizations/…md">`:""}<p id="decision-error" role="alert" class="form-error"></p><div class="decision-actions"><button class="primary" data-decision="queued" ${item.research_status==="withdrawn"?"disabled":""}>${changed(item)?"依新版產生交接":"產生 Codex 交接任務"} ↗</button><button class="secondary" data-decision="dismissed">暫不採用</button>${status!=="pending"?'<button class="text-button" data-decision="pending">回到待評估</button>':""}</div>${record.handoff?`<div class="followup-actions"><button class="secondary" data-view-handoff="${id}">查看／複製交接</button><button class="secondary" data-decision="in_progress">標記進行中</button><button class="secondary" data-decision="done">標記已完成</button></div>`:""}<small>產生交接只保存任務，複製到 Codex 後才會開始工作。</small></div>`}</div>`);
}
async function choose(status) {
  if(staticMode) {toast("這是唯讀快照，請在本機工作台操作");return;}
  if(state.busy)return; state.busy=true;
  const buttons=[...$("#detail-dialog").querySelectorAll("button")];buttons.forEach(b=>b.disabled=true);
  try {
    const id=state.detail;
    const result=await api("/api/decision",{id,status,revision:state.decisionRevision,item_revision:state.detailRevision,note:$("#decision-note")?.value||"",result_ref:$("#result-ref")?.value||""});
    await refresh(true);
    if(result.prompt) promptDialog("Codex 交接已備妥",result.prompt,result.record.handoff);
    else {openItem(id);toast("已保存決策");}
  }catch(error){if($("#decision-error"))$("#decision-error").textContent=error.message;else toast(error.message);}
  finally {state.busy=false;buttons.forEach(b=>b.disabled=false);}
}
function promptDialog(title,prompt,path="") {
  openDialog(`${dialogHead("AI HANDOFF",title)}<div class="dialog-body"><p class="lead">${title.startsWith("Codex")?"將下方任務貼到 HDRE 專案的 Codex 對話，即可開始。":"在 HDRE 專案開啟 Claude Code，貼上下方任務即可執行。"}</p>${path?`<p class="path-note">已保存：${esc(path)}</p>`:""}<label class="sr-only" for="prompt-text">交接任務全文</label><textarea id="prompt-text" class="prompt-text" readonly>${esc(prompt)}</textarea><div class="decision-actions"><button class="primary" data-copy-prompt>複製任務全文</button><button class="secondary" data-download-prompt>下載 Markdown</button></div><p class="muted">此按鈕不會自動啟動 AI，也不會傳送資料到外部服務。</p></div>`);
}
document.addEventListener("click",async event=>{
  const target=event.target.closest("button");if(!target)return;
  try {
    if(target.hasAttribute("data-close"))$("#detail-dialog").close();
    if(target.dataset.project)openProject(target.dataset.project);
    if(target.dataset.item)openItem(target.dataset.item);
    if(target.dataset.filter){state.filter=target.dataset.filter;renderOptimizations();}
    if(target.dataset.decision)await choose(target.dataset.decision);
    if(target.dataset.task){const r=await api(`/api/task/${target.dataset.task}`);promptDialog(target.dataset.task==="research"?"Claude 優化研究任務":"Claude 測試進度同步任務",r.prompt);}
    if(target.dataset.viewHandoff){const r=await api(`/api/handoff/${target.dataset.viewHandoff}`);promptDialog("Codex 交接已備妥",r.prompt);}
    if(target.hasAttribute("data-copy-prompt")){
      try {await navigator.clipboard.writeText($("#prompt-text").value);toast("任務已複製，可貼到 AI 對話");}
      catch {$("#prompt-text").focus();$("#prompt-text").select();toast("請按 Ctrl/Cmd+C 複製已選取的任務");}
    }
    if(target.hasAttribute("data-download-prompt")){
      const url=URL.createObjectURL(new Blob([$("#prompt-text").value],{type:"text/markdown;charset=utf-8"}));
      const a=document.createElement("a");a.href=url;a.download="qa-handoff.md";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  }catch(error){toast(error.message);}
});
$("#refresh").onclick=()=>refresh();
window.addEventListener("hashchange",render);
setInterval(()=>{if(!document.hidden&&!$("#detail-dialog").open)refresh(true);},30000);
refresh(true);
