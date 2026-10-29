/* Role examples share the same date comparison rules as the proposal Demo. */
(() => {
  'use strict';
  const M=window.DeliveryModel,$=id=>document.getElementById(id),c=M.change,h=M.handoff,e=M.event,r=M.revision;
  const base=M.scenarios.bug.tasks.map(t=>({...t,state:'待開始',completedAt:null}));
  const example=(name,taskId,entry,exit,notify,steps)=>({name,taskId,entry,exit,notify,steps,tasks:base,originalStart:'2026-10-10',originalEnd:'2026-10-20'});
  const roles={
    pm:example('PM','pm','需求提出者交目標、驗收期望與來源，Story 由 PM 建立。','PM 拆 SubStory、預估開始／結束、指定負責人；Daily 確認下一棒。','Daily 當下明確決議能否完成；上版或開發問題即時回報 PM，不等開會才說。',[
      e('2026-10-10','PM 建 Story，收進 Product Backlog','PM 建立需求主卡，先確認範圍、驗收及期望日期。','Product Backlog',[],[h('pm','需求提出者','PM','通知偏好需求／來源／驗收期望','PM 建 Story 並安排釐清')]),
      e('2026-10-12','Refinement：PM 開 SubStory 並預估日期','相關職能提出工作與風險，PM 拆 SubStory、填完成條件與預估開始／結束日，指定負責人。','Refinement',[c('pm','進行中')]),
      e('2026-10-12','Sprint Backlog：確認本輪安排','PM 確認要做的 Story／SubStory 與日期。需求確認工作已完成，留 PM 工作卡完成日；Story 還要繼續開發、測試與交付。','Sprint Backlog',[c('pm','完成','2026-10-12')]),
      e('2026-10-14','RD 勾子卡完成，PM 不把 Story 直接標 Done','RD 在 My Tasks 勾自己的 SubStory 完成。Story 仍在 Development，等 Daily 檢視版本及功能交棒。','Development',[],[h('pm','RD','PM','RD SubStory 已完成，功能待 Daily 交棒','保留 RD 完成日，不代替 Story 完成日')]),
      e('2026-10-15','Daily 確認功能交棒，進 Ready to RT Test','Daily 對齊交棒，當下明確回答能否完成／交付；不能就列 Bug、阻斷原因、處理人與預計完成時間。開發或上版問題即時回報 PM。','Ready to RT Test',[],[h('pm','RD／PM（Daily）','QA','功能可測資料與接手人已確認','確認 RT 開測安排及日期影響')])]),
    ux:example('UIUX','ux','PM 提供設計 SubStory、需求、完成條件及預估日期。','設計版本及說明交 RD／PM；QA 可提前準備測試。','回 PM 建立的工作子卡留版本與結果；設計不另新增 Story 泳道。',[
      e('2026-10-12','從 PM 的設計 SubStory 接工作','需要設計才由 PM 拆對應子卡，本例預估 10/12～10/13；不需設計的 OP 不建空白設計卡。','Refinement',[],[h('ux','PM','UIUX','需求／設計 SubStory／預估日期','確認範圍與決策窗口')]),
      e('2026-10-12','確認互動與例外情境','在釐清時與 PM／RD 對齊限制，QA 可提早確認驗收情境；日期有風險回 PM。','Refinement',[c('ux','進行中')]),
      e('2026-10-13','交付設計，記自己的工作完成日','設計 v1.0、互動與例外狀態齊備，達到設計子卡完成條件，完成日 10/13 對原訂準時。','Sprint Backlog',[c('ux','完成','2026-10-13')]),
      e('2026-10-13','設計版本交 RD 開發','同一版本交 RD／PM，QA 使用共同驗收依據；這是設計工作交付，不另外新增 In Design 泳道。','Development',[],[h('ux','UIUX','RD／PM／QA','設計 v1.0／互動與例外狀態','RD 可依設計實作')]),
      e('2026-10-13','後續修改回原子卡與 PM 確認','保留新版本與決策，影響日期時回 PM 協調，原訂不覆蓋。功能開發交棒仍由 RD 在 Daily 說明。','Development',[],[h('ux','RD','UIUX／PM','設計收到，限制與後續變更沿原卡','交期影響由 PM 統一確認')])]),
    rd:example('RD','rd','PM 建 SubStory、預估日期並指派；RD 從 My Tasks 看自己的工作。','RD 在 My Tasks 勾子卡完成；功能在 Daily 交 QA，進 Ready to RT Test。','開發或上版問題即時回 PM。PreProd 備好後，RD 先核對應上內容齊全，再通知 QA 回歸。',[
      e('2026-10-12','My Tasks：接 PM 指派的 SubStory','確認工作、完成條件與原訂 10/12～10/14，依排程開發、自測與 Review。','Development',[c('rd','進行中')],[h('rd','PM','RD','已建 SubStory／內容／原訂 10/14','從 My Tasks 接工作，缺件回 PM')]),
      e('2026-10-14','My Tasks：RD 自己勾 SubStory 完成','開發、自測與 Review 已完成，RD 勾自己的卡並留實際完成日 10/14。Story 仍是 Development，尚未功能交棒。','Development',[c('rd','完成','2026-10-14')]),
      e('2026-10-15','Daily：功能交棒，Story 才進待 RT 測試','Daily 說明版本、環境、自測與限制，確認 QA 接手；RD 工作完成日仍是 10/14，功能交棒日期是 10/15。','Ready to RT Test',[],[h('rd','RD（Daily）','QA','v1.0／環境／自測／限制／接手人','Daily 確認交棒，由約定窗口更新 Story')]),
      e('2026-10-15','RT Testing：從 QA 收 Bug 子任務','這裡切到 QA 主單下 BUG-01。Bug 子任務方式已確認，原訂 10/15，完成條件是 QA 已驗證。','RT Testing',[c('bug1','進行中',null,'RD-A')],[h('bug1','QA','RD-A','BUG-01／v1.0／重現與預期結果','依 Bug 約定確認修復與複驗安排')]),
      e('2026-10-16','Bug 修好交 QA，先保留待複驗','交 v1.1、自測與影響說明。修復交付不是 Bug 已驗證，實際完成日維持空白；不新增 Bug 泳道。','RT Testing',[c('bug1','待複驗',null,'QA 窗口')],[h('bug1','RD-A','QA','第 1 輪／v1.1／自測','請依 Bug 流程回覆複驗結果')]),
      e('2026-10-16','複驗未過，原 Bug 再修並協調日期','原訂 10/15 保留，RD／QA 與 PM 確認新交期 10/19，留再修原因。Bug 往返不自動套成每次都等 Daily。','RT Testing',[c('bug1','需再修',null,'RD-A')],[h('bug1','QA','RD-A','v1.1 未過／最新重現與 evidence','原單再修，日期影響回 PM')],[r('bug1','2026-10-16','2026-10-14','2026-10-19','v1.1 複驗未過，需再修及安排複驗','PM＋QA＋RD-A')]),
      e('2026-10-19','v1.2 通過，原訂與新交期並列','完成日 10/19，對原訂 10/15 Delay 4 天，對新交期準時；前輪版本與日期保留，Story 由 QA 確認後續測試階段。','RT Testing',[c('bug1','已驗證','2026-10-19','QA 窗口')],[h('bug1','RD-A','QA','第 2 輪／v1.2／自測與複驗通過','同 Bug 留已驗證與完成日',2)]),
      {...e('2026-10-20','PreProd：RD 核對沒有漏上，主動通知 QA','維運備好 PreProd 後，RD 對照此次應上功能／修復與版本，確認齊全再通知 QA。這是後續交接紀錄，不改寫原先開發卡的 10/14 完成日；漏上要立即回報 PM。','Ready to Stage Test',[],[h('rd','維運','RD','PreProd 版本與準備結果','RD 核對本次應上內容'),h('rd','RD','QA','本次功能／修復已核對，確認沒有漏上／版本已附','通知 QA 確認功能涵蓋與回歸 Passed')]),focusTask:'rd'}]),
    qa:example('QA','qa','PM 拆測試工作及預估日期；Daily 從 RD 接版本、環境、自測與限制。','PreProd 功能涵蓋與回歸 Passed 結果交 PM／UAT 窗口，再接維運 Prod 準備；Bug 維持子任務。','功能入口在 Daily 確認；PreProd 要等 RD 核對後通知。回歸未過或漏上立即回報 PM。',[
      e('2026-10-12','Refinement：提早看驗收與測試風險','PM 建 QA 工作卡與預估日期，QA 提早準備 RT／Stage 所需案例與資料，準備工作不另外新增泳道。','Refinement'),
      e('2026-10-15','Daily：確認 Ready to RT Test 的交棒內容','接 RD 的 v1.0、環境、自測、限制與驗收，回覆可接手或缺件；待測不代表已開始測試。','Ready to RT Test',[],[h('qa','RD（Daily）','QA','v1.0／環境／自測／驗收','QA 確認 RT 接手與缺件')]),
      e('2026-10-15','RT Testing：開始測試，Bug 用子任務','QA 開始 RT 測試，在 QA 主單下分別開 BUG-01／BUG-02，交 RD 修復；不受影響測試繼續。','RT Testing',[c('qa','進行中')],[h('bug1','QA','RD-A','BUG-01／重現／驗收條件','確認修復及複驗安排'),h('bug2','QA','RD-B','BUG-02／重現／驗收條件','確認修復及複驗安排')]),
      e('2026-10-16','Bug 未過，原單退回並回 PM 協調日期','BUG-01 v1.1 未過，沿原子任務退回；必要複驗影響交期，QA 原訂 10/16 保留，PM 確認新交期 10/20。','RT Testing',[],[h('bug1','QA','RD-A','第 1 輪 v1.1 未過／evidence','原 Bug 再修')],[r('qa','2026-10-16','2026-10-10','2026-10-20','BUG-01 需再修，安排 RT／Stage 與報告','PM＋QA＋RD')]),
      e('2026-10-19','Ready to Stage Test：RT 完成，交維運備 PreProd','本例 Bug 驗證通過、RT 必要條件達成，交本次應上範圍與版本給維運準備 PreProd；此時還未開始 QA 回歸。','Ready to Stage Test',[],[h('qa','QA（RT）','維運','RT 結果／應上範圍／版本','維運準備 PreProd，先交 RD 核對')]),
      e('2026-10-20','RD 核對 PreProd 齊全並通知 QA','維運備好 PreProd 後先交 RD。RD 確認此次應上功能／修復沒有漏上，附版本與範圍後主動通知 QA，才進 Stage Testing。','Ready to Stage Test',[],[h('qa','RD','QA','PreProd 版本已核對，本次應上內容齊全','請 QA 確認功能涵蓋及回歸結果')]),
      e('2026-10-20','Stage Testing：PreProd 功能有包含嗎？回歸 Passed 嗎？','QA 收到 RD 通知後，在 PreProd 同時確認本次功能確實包含、回歸測試 Passed；記版本、範圍與結果。任一未過即時回報 PM，不往 Prod。','Stage Testing'),
      e('2026-10-20','Pending UAT：QA 交結果，還不是 Story Done','PreProd 功能涵蓋確認及回歸 Passed，必要複驗與報告完成，記 QA 實際完成日 10/20。結果接 PM／既有 UAT 放行確認，才交維運準備 Prod。','Pending UAT',[c('qa','完成','2026-10-20')],[h('qa','QA','PM／UAT 窗口','PreProd 版本／功能有包含／回歸 Passed／報告／QA 完成日','PM 安排 UAT，QA 完成不等於 Story Done')])]),
    ops:example('維運','ops','RT 完成先接 PreProd 準備；QA 雙項通過與既有放行確認後，再接 Prod。','發布與驗證結果回 PM，PM 確認 Story Done。','PreProd 備好先交 RD；Prod 依既有核准。上版問題立即通知 PM，日期調整保留原訂與原因。',[
      e('2026-10-19','RT 完成：維運準備 PreProd','RT 結果與本次應上範圍已交，維運準備 PreProd。PreProd 就是 Stage Testing 環境，準備好先交 RD，不直接跳到 QA 已回歸。','Ready to Stage Test',[c('ops','進行中')],[h('ops','QA（RT）','維運','RT 結果／本次應上範圍／版本','準備 PreProd')]),
      e('2026-10-20','PreProd 備好：RD 先核對，再通知 QA','維運交 PreProd 版本與準備結果，RD 確認有無漏上後通知 QA。QA 要確認功能有包含及回歸 Passed，才接後續 Prod 準備。','Ready to Stage Test',[],[h('ops','維運','RD','PreProd 已備好／版本／準備結果','RD 核對範圍，齊全後通知 QA')]),
      e('2026-10-20','Pending UAT：先確認驗收與發版依賴','QA 已交 PreProd 功能有包含與回歸 Passed 結果；接既有 UAT／放行確認，不只用測完兩字判斷可否發版。','Pending UAT',[],[h('ops','PM','維運','QA 結果已到，UAT 結果待確認','先確認窗口與發版依賴')]),
      e('2026-10-20','Ready To Release：UAT 結果確認，安排窗口','QA PreProd 雙項通過、PM 確認既有驗收與放行條件後，維運準備 Prod。窗口調整到 10/21，維運卡與 Story 分別保留原訂及原因。','Ready To Release',[c('ops','進行中')],[h('ops','PM／UAT 窗口','維運','驗收結果／版本／發版資訊','安排 10/21 發版與驗證')],[r('ops','2026-10-20','2026-10-16','2026-10-21','驗收與發版窗口確認後改至 10/21','PM＋維運'),r('root','2026-10-20','2026-10-10','2026-10-21','同步確認驗收、發布與結案日期','PM＋維運')]),
      e('2026-10-21','依既有程序部署及驗證','Ready To Release 期間依核准與上版流程執行，先留部署版本與結果，再完成必要 Prod 驗證。','Ready To Release',[],[h('ops','維運','相關窗口','v1.2 已部署／版本與結果','確認必要上線驗證')]),
      e('2026-10-21','維運工作完成，結果回 PM','維運卡完成日 10/21，對原訂 10/20 Delay 1 天、對新交期準時；Story 仍等 PM 確認整體結案。','Ready To Release',[c('ops','完成','2026-10-21')],[h('ops','維運','PM','發布版本／驗證通過／交付結果','請確認 Story Done')]),
      e('2026-10-21','Done：PM 確認 Story 整體完成','PM 確認必要交付、驗收及上線結果，Story 才進 Done 並留完成日；不把各 SubStory 日期差相加。','Done',[],[h('ops','PM','各組','Story 必要交付及驗證確認，結案','兩週後回顧交期與交棒資料')])])
  };
  let role='pm',index=0;const tabs=[...document.querySelectorAll('[data-walk-role]')];
  const set=(id,text)=>{$(id).textContent=text;};
  const list=(id,items,empty)=>{$(id).replaceChildren();for(const text of items.length?items:[empty]){const li=document.createElement('li');li.textContent=text;$(id).append(li);}};
  function render(announce=true){
    const data=roles[role],current=data.steps[index],snap=M.snapshot({...data,events:data.steps},index);
    const selectedId=current.focusTask||(role==='rd'&&index>=3?'bug1':data.taskId),card=snap.tasks.find(t=>t.id===selectedId);
    for(const key of ['entry','exit','notify'])set('walk-'+key,data[key]);
    set('walk-card-path',card.parentId?'FLOW-101 → QA 主單 → BUG-01':'FLOW-101 → PM 建立的 '+data.name+' SubStory');set('walk-card-title',card.name);set('walk-owner',`${card.parentId?'Bug 子任務':'PM 建立／預估'}｜負責人：${card.owner}｜接手：${card.assignee}`);set('walk-stage',current.stage);set('walk-status',card.state);
    for(const [key,value]of Object.entries({start:card.originalStart,end:card.originalEnd,currentStart:card.currentStart,currentEnd:card.currentEnd,completed:card.completedAt}))set('walk-'+key,M.date(value));
    set('walk-result',card.result.label);$('walk-result').className='schedule-chip '+card.result.kind;
    set('walk-current-result',card.revisions.length?'對目前交期：'+card.currentResult.label:'尚無改期，原訂時程保持不變。');set('walk-work',card.work);set('walk-done',card.done);
    set('walk-counter',`${String(index+1).padStart(2,'0')} / ${String(data.steps.length).padStart(2,'0')}`);set('walk-date','示意日期 '+M.date(current.at));set('walk-step-title',current.title);set('walk-action',current.description);
    set('walk-operation',current.title.startsWith('PreProd：RD')?'先核對本次應上內容齊全，再主動通知 QA；核對與通知日期另留，原開發完成日不變。':current.title.startsWith('My Tasks：RD')?'RD 在 My Tasks 勾自己的 SubStory 完成；Story 泳道仍是 Development。':current.title.startsWith('Daily')?'Daily 確認版本、環境、自測及接手人，再由約定窗口更新 Story。':current.revisions.length?'保留原訂，記新日期、原因與確認窗口。':current.changes.some(c=>c.completedAt)?'確認完成條件，留下實際完成日，交下一位。':current.handoffs.length?'交付內容留同卡，指定接手人，請回覆收到與下一步。':'沿用既有少量進度；需要交接或日期調整時更新。');
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
