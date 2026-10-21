/* Role examples share the same date comparison rules as the proposal Demo. */
(() => {
  'use strict';
  const M=window.DeliveryModel,$=id=>document.getElementById(id),c=M.change,h=M.handoff,e=M.event,r=M.revision;
  const base=M.scenarios.bug.tasks.map(t=>({...t,state:'待開始',completedAt:null}));
  const example=(name,taskId,entry,exit,notify,steps)=>({name,taskId,entry,exit,notify,steps,tasks:base,originalStart:'2026-10-10',originalEnd:'2026-10-20'});
  const roles={
    pm:example('PM','pm','需求提出者交目標、驗收期望與來源，Story 由 PM 建立。','PM 拆 SubStory、預估開始／結束、指定負責人；Daily 確認下一棒。','SubStory 指派 RD；Story 移卡窗口與接手安排在 Daily 對齊。',[
      e('2026-10-10','PM 建 Story，收進 Product Backlog','PM 建立需求主卡，先確認範圍、驗收及期望日期。','Product Backlog',[],[h('pm','需求提出者','PM','通知偏好需求／來源／驗收期望','PM 建 Story 並安排釐清')]),
      e('2026-10-12','Refinement：PM 開 SubStory 並預估日期','相關職能提出工作與風險，PM 拆 SubStory、填完成條件與預估開始／結束日，指定負責人。','Refinement',[c('pm','進行中')]),
      e('2026-10-12','Sprint Backlog：確認本輪安排','PM 確認要做的 Story／SubStory 與日期。需求確認工作已完成，留 PM 工作卡完成日；Story 還要繼續開發、測試與交付。','Sprint Backlog',[c('pm','完成','2026-10-12')]),
      e('2026-10-14','RD 勾子卡完成，PM 不把 Story 直接標 Done','RD 在 My Tasks 勾自己的 SubStory 完成。Story 仍在 Development，等 Daily 檢視版本及功能交棒。','Development',[],[h('pm','RD','PM','RD SubStory 已完成，功能待 Daily 交棒','保留 RD 完成日，不代替 Story 完成日')]),
      e('2026-10-15','Daily 確認功能交棒，進 Ready to RT Test','Daily 對齊版本、環境、自測、限制與 QA 接手，由約定窗口更新 Story；誰實際移卡由團隊確認。','Ready to RT Test',[],[h('pm','RD／PM（Daily）','QA','功能可測資料與接手人已確認','確認 RT 開測安排及日期影響')])]),
    ux:example('UIUX','ux','PM 提供設計 SubStory、需求、完成條件及預估日期。','設計版本及說明交 RD／PM；QA 可提前準備測試。','回 PM 建立的工作子卡留版本與結果；設計不另新增 Story 泳道。',[
      e('2026-10-12','從 PM 的設計 SubStory 接工作','需要設計才由 PM 拆對應子卡，本例預估 10/12～10/13；不需設計的 OP 不建空白設計卡。','Refinement',[],[h('ux','PM','UIUX','需求／設計 SubStory／預估日期','確認範圍與決策窗口')]),
      e('2026-10-12','確認互動與例外情境','在釐清時與 PM／RD 對齊限制，QA 可提早確認驗收情境；日期有風險回 PM。','Refinement',[c('ux','進行中')]),
      e('2026-10-13','交付設計，記自己的工作完成日','設計 v1.0、互動與例外狀態齊備，達到設計子卡完成條件，完成日 10/13 對原訂準時。','Sprint Backlog',[c('ux','完成','2026-10-13')]),
      e('2026-10-13','設計版本交 RD 開發','同一版本交 RD／PM，QA 使用共同驗收依據；這是設計工作交付，不另外新增 In Design 泳道。','Development',[],[h('ux','UIUX','RD／PM／QA','設計 v1.0／互動與例外狀態','RD 可依設計實作')]),
      e('2026-10-13','後續修改回原子卡與 PM 確認','保留新版本與決策，影響日期時回 PM 協調，原訂不覆蓋。功能開發交棒仍由 RD 在 Daily 說明。','Development',[],[h('ux','RD','UIUX／PM','設計收到，限制與後續變更沿原卡','交期影響由 PM 統一確認')])]),
    rd:example('RD','rd','PM 建 SubStory、預估日期並指派；RD 從 My Tasks 看自己的工作。','RD 在 My Tasks 勾子卡完成；功能在 Daily 交 QA，進 Ready to RT Test。','完成勾選與 Daily 交棒分開留紀錄；Bug 保留原子任務修復／複驗。',[
      e('2026-10-12','My Tasks：接 PM 指派的 SubStory','確認工作、完成條件與原訂 10/12～10/14，依排程開發、自測與 Review。','Development',[c('rd','進行中')],[h('rd','PM','RD','已建 SubStory／內容／原訂 10/14','從 My Tasks 接工作，缺件回 PM')]),
      e('2026-10-14','My Tasks：RD 自己勾 SubStory 完成','開發、自測與 Review 已完成，RD 勾自己的卡並留實際完成日 10/14。Story 仍是 Development，尚未功能交棒。','Development',[c('rd','完成','2026-10-14')]),
      e('2026-10-15','Daily：功能交棒，Story 才進待 RT 測試','Daily 說明版本、環境、自測與限制，確認 QA 接手；RD 工作完成日仍是 10/14，功能交棒日期是 10/15。','Ready to RT Test',[],[h('rd','RD（Daily）','QA','v1.0／環境／自測／限制／接手人','Daily 確認交棒，由約定窗口更新 Story')]),
      e('2026-10-15','RT Testing：從 QA 收 Bug 子任務','這裡切到 QA 主單下 BUG-01。Bug 子任務方式已確認，原訂 10/15，完成條件是 QA 已驗證。','RT Testing',[c('bug1','進行中',null,'RD-A')],[h('bug1','QA','RD-A','BUG-01／v1.0／重現與預期結果','依 Bug 約定確認修復與複驗安排')]),
      e('2026-10-16','Bug 修好交 QA，先保留待複驗','交 v1.1、自測與影響說明。修復交付不是 Bug 已驗證，實際完成日維持空白；不新增 Bug 泳道。','RT Testing',[c('bug1','待複驗',null,'QA 窗口')],[h('bug1','RD-A','QA','第 1 輪／v1.1／自測','請依 Bug 流程回覆複驗結果')]),
      e('2026-10-16','複驗未過，原 Bug 再修並協調日期','原訂 10/15 保留，RD／QA 與 PM 確認新交期 10/19，留再修原因。Bug 往返不自動套成每次都等 Daily。','RT Testing',[c('bug1','需再修',null,'RD-A')],[h('bug1','QA','RD-A','v1.1 未過／最新重現與 evidence','原單再修，日期影響回 PM')],[r('bug1','2026-10-16','2026-10-14','2026-10-19','v1.1 複驗未過，需再修及安排複驗','PM＋QA＋RD-A')]),
      e('2026-10-19','v1.2 通過，原訂與新交期並列','完成日 10/19，對原訂 10/15 Delay 4 天，對新交期準時；前輪版本與日期保留，Story 由 QA 確認後續測試階段。','RT Testing',[c('bug1','已驗證','2026-10-19','QA 窗口')],[h('bug1','RD-A','QA','第 2 輪／v1.2／自測與複驗通過','同 Bug 留已驗證與完成日',2)])]),
    qa:example('QA','qa','PM 拆測試工作及預估日期；Daily 從 RD 接版本、環境、自測與限制。','RT／Stage 結果、報告及風險交 PM／UAT 窗口；Bug 用 QA 主單下子任務。','功能交棒在 Daily 確認；UAT 驗收人與實際移卡窗口由團隊對齊。',[
      e('2026-10-12','Refinement：提早看驗收與測試風險','PM 建 QA 工作卡與預估日期，QA 提早準備 RT／Stage 所需案例與資料，準備工作不另外新增泳道。','Refinement'),
      e('2026-10-15','Daily：確認 Ready to RT Test 的交棒內容','接 RD 的 v1.0、環境、自測、限制與驗收，回覆可接手或缺件；待測不代表已開始測試。','Ready to RT Test',[],[h('qa','RD（Daily）','QA','v1.0／環境／自測／驗收','QA 確認 RT 接手與缺件')]),
      e('2026-10-15','RT Testing：開始測試，Bug 用子任務','QA 開始 RT 測試，在 QA 主單下分別開 BUG-01／BUG-02，交 RD 修復；不受影響測試繼續。','RT Testing',[c('qa','進行中')],[h('bug1','QA','RD-A','BUG-01／重現／驗收條件','確認修復及複驗安排'),h('bug2','QA','RD-B','BUG-02／重現／驗收條件','確認修復及複驗安排')]),
      e('2026-10-16','Bug 未過，原單退回並回 PM 協調日期','BUG-01 v1.1 未過，沿原子任務退回；必要複驗影響交期，QA 原訂 10/16 保留，PM 確認新交期 10/20。','RT Testing',[],[h('bug1','QA','RD-A','第 1 輪 v1.1 未過／evidence','原 Bug 再修')],[r('qa','2026-10-16','2026-10-10','2026-10-20','BUG-01 需再修，安排 RT／Stage 與報告','PM＋QA＋RD')]),
      e('2026-10-19','Ready to Stage Test：RT 結果與準備齊備','本例 Bug 驗證通過、RT 必要條件達成，交 Stage 版本、環境與測試安排；還未開始 Stage 測試。','Ready to Stage Test',[],[h('qa','QA（RT）','Stage 測試窗口','RT 結果／版本／Stage 準備','確認 Stage 開測安排')]),
      e('2026-10-20','Stage Testing：執行必要驗證與回歸','QA 開始 Stage 測試，確認必要結果、Bug 處置與報告；門檻及範圍沿團隊約定。','Stage Testing'),
      e('2026-10-20','Pending UAT：QA 交結果，還不是 Story Done','RT／Stage 測試及報告交付完成，記 QA 實際完成日 10/20。結果交 PM／指定 UAT 窗口，Story 繼續等待驗收及發版。','Pending UAT',[c('qa','完成','2026-10-20')],[h('qa','QA','PM／UAT 窗口','報告／版本／限制／QA 完成日','PM 安排 UAT，QA 完成不等於 Story Done')])]),
    ops:example('維運','ops','PM／UAT 窗口確認驗收及發版條件，才交維運安排。','發布與驗證結果回 PM，PM 確認 Story Done。','沿既有發版核准；預估及改期回 PM，保留原訂與原因。',[
      e('2026-10-20','Pending UAT：先確認驗收與發版依賴','QA 報告已提供，但 Story 尚待 UAT 結果；不把 QA 測完直接當成可發版。','Pending UAT',[],[h('ops','PM','維運','QA 結果已到，UAT 結果待確認','先確認窗口與發版依賴')]),
      e('2026-10-20','Ready To Release：UAT 結果確認，安排窗口','PM 確認本例 UAT 結果及發版條件後交維運。窗口調整到 10/21，維運卡與 Story 分別保留原訂及原因。','Ready To Release',[c('ops','進行中')],[h('ops','PM／UAT 窗口','維運','驗收結果／版本／發版資訊','安排 10/21 發版與驗證')],[r('ops','2026-10-20','2026-10-16','2026-10-21','驗收與發版窗口確認後改至 10/21','PM＋維運'),r('root','2026-10-20','2026-10-10','2026-10-21','同步確認驗收、發布與結案日期','PM＋維運')]),
      e('2026-10-21','依既有程序部署及驗證','Ready To Release 期間依核准與上版流程執行，先留部署版本與結果，再完成必要 Prod 驗證。','Ready To Release',[],[h('ops','維運','相關窗口','v1.2 已部署／版本與結果','確認必要上線驗證')]),
      e('2026-10-21','維運工作完成，結果回 PM','維運卡完成日 10/21，對原訂 10/20 Delay 1 天、對新交期準時；Story 仍等 PM 確認整體結案。','Ready To Release',[c('ops','完成','2026-10-21')],[h('ops','維運','PM','發布版本／驗證通過／交付結果','請確認 Story Done')]),
      e('2026-10-21','Done：PM 確認 Story 整體完成','PM 確認必要交付、驗收及上線結果，Story 才進 Done 並留完成日；不把各 SubStory 日期差相加。','Done',[],[h('ops','PM','各組','Story 必要交付及驗證確認，結案','兩週後回顧交期與交棒資料')])])
  };
  let role='pm',index=0;const tabs=[...document.querySelectorAll('[data-walk-role]')];
  const set=(id,text)=>{$(id).textContent=text;};
  const list=(id,items,empty)=>{$(id).replaceChildren();for(const text of items.length?items:[empty]){const li=document.createElement('li');li.textContent=text;$(id).append(li);}};
  function render(announce=true){
    const data=roles[role],current=data.steps[index],snap=M.snapshot({...data,events:data.steps},index);
    const selectedId=role==='rd'&&index>=3?'bug1':data.taskId,card=snap.tasks.find(t=>t.id===selectedId);
    for(const key of ['entry','exit','notify'])set('walk-'+key,data[key]);
    set('walk-card-path',card.parentId?'FLOW-101 → QA 主單 → BUG-01':'FLOW-101 → PM 建立的 '+data.name+' SubStory');set('walk-card-title',card.name);set('walk-owner',`${card.parentId?'Bug 子任務':'PM 建立／預估'}｜負責人：${card.owner}｜接手：${card.assignee}`);set('walk-stage',current.stage);set('walk-status',card.state);
    for(const [key,value]of Object.entries({start:card.originalStart,end:card.originalEnd,currentStart:card.currentStart,currentEnd:card.currentEnd,completed:card.completedAt}))set('walk-'+key,M.date(value));
    set('walk-result',card.result.label);$('walk-result').className='schedule-chip '+card.result.kind;
    set('walk-current-result',card.revisions.length?'對目前交期：'+card.currentResult.label:'尚無改期，原訂時程保持不變。');set('walk-work',card.work);set('walk-done',card.done);
    set('walk-counter',`${String(index+1).padStart(2,'0')} / ${String(data.steps.length).padStart(2,'0')}`);set('walk-date','示意日期 '+M.date(current.at));set('walk-step-title',current.title);set('walk-action',current.description);
    set('walk-operation',current.title.startsWith('My Tasks：RD')?'RD 在 My Tasks 勾自己的 SubStory 完成；Story 泳道仍是 Development。':current.title.startsWith('Daily')?'Daily 確認版本、環境、自測及接手人，再由約定窗口更新 Story。':current.revisions.length?'保留原訂，記新日期、原因與確認窗口。':current.changes.some(c=>c.completedAt)?'確認完成條件，留下實際完成日，交下一位。':current.handoffs.length?'交付內容留同卡，指定接手人，請回覆收到與下一步。':'沿用既有少量進度；需要交接或日期調整時更新。');
    set('walk-message-label','本步的交接／日期示意');set('walk-message',current.handoffs.map(h=>`${h.from} → ${h.to}：${h.content}；${h.reply}`).join('。')||`原訂 ${M.date(card.originalStart)}–${M.date(card.originalEnd)}；目前交期 ${M.date(card.currentEnd)}；實際完成 ${M.date(card.completedAt)}。`);
    $('walk-prev').disabled=index===0;$('walk-next').disabled=index===data.steps.length-1;set('walk-next',index===data.steps.length-1?'本角色已走完 ✓':'下一步 →');$('walk-panel').setAttribute('aria-labelledby','walk-tab-'+role);
    tabs.forEach(tab=>{const selected=tab.dataset.walkRole===role;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
    $('walk-progress').replaceChildren();data.steps.forEach((s,i)=>{const button=document.createElement('button');button.type='button';button.textContent=i+1;button.setAttribute('aria-label',`第 ${i+1} 步：${s.title}`);if(i===index)button.setAttribute('aria-current','step');button.classList.toggle('walk-step-past',i<index);button.addEventListener('click',()=>{index=i;render();$('walk-progress').children[i].focus({preventScroll:true});});$('walk-progress').append(button);});
    list('walk-handoffs',snap.handoffs.map(h=>`${M.date(h.at)}｜第 ${h.round} 輪｜${h.from} → ${h.to}｜${h.content}；${h.reply}`),'尚未新增交接紀錄。');
    list('walk-revisions',snap.revisions.map(r=>`${M.date(r.at)}｜${r.taskId==='root'?'功能主卡':data.tasks.find(t=>t.id===r.taskId).name}｜新時程 ${M.date(r.start)}–${M.date(r.end)}｜原因：${r.reason}｜確認：${r.by}`),'尚無改期；原訂日期保留。');
    if(announce)set('walk-announcement',`${data.name}，第 ${index+1} 步。${current.title}。對原訂交期：${card.result.label}`);
  }
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{role=tab.dataset.walkRole;index=0;render();});tab.addEventListener('keydown',event=>{let n;if(event.key==='ArrowRight')n=(i+1)%tabs.length;if(event.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(event.key==='Home')n=0;if(event.key==='End')n=tabs.length-1;if(n===undefined)return;event.preventDefault();tabs[n].click();tabs[n].focus({preventScroll:true});});});
  $('walk-prev').addEventListener('click',()=>{if(index>0){index--;render();}});$('walk-next').addEventListener('click',()=>{if(index<roles[role].steps.length-1){index++;render();}});$('walk-reset').addEventListener('click',()=>{index=0;render();});render(false);
})();
