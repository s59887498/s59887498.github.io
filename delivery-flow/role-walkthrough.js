/* Role examples share the same date comparison rules as the proposal Demo. */
(() => {
  'use strict';
  const M=window.DeliveryModel,$=id=>document.getElementById(id),c=M.change,h=M.handoff,e=M.event,r=M.revision;
  const base=M.scenarios.bug.tasks.map(t=>({...t,state:'待開始',completedAt:null}));
  const example=(name,taskId,entry,exit,notify,steps)=>({name,taskId,entry,exit,notify,steps,tasks:base,originalStart:'2026-10-10',originalEnd:'2026-10-20'});
  const roles={
    pm:example('PM','pm','需求提出者／維運 → PM；附問題、使用情境與期望日期。','PM → UIUX／RD／QA；附範圍、驗收與各組排程。','同主卡留言、指派職能卡，請各窗口回覆收到。',[
      e('2026-10-10','入口：把需求與期望日期收在主卡','先確認要解決的問題、範圍與需求 Owner；期望日期需經評估才成承諾。','Product Backlog',[],[h('pm','維運','PM','通知開關需求／使用情境／期望交期','請評估範圍與可交付日期')]),
      e('2026-10-12','確認工作、驗收與各組日期','與 UIUX、RD、QA 確認範圍，PM 需求確認卡原訂 10/12 完成。開會照常，不增加暫停操作。','Backlog Refinement',[c('pm','進行中')]),
      e('2026-10-12','需求確認完成，留下實際完成日','範圍與驗收標準確認並交相關窗口，PM 職能卡完成日 10/12，對原訂是準時。功能主卡繼續追蹤上線。','Backlog Refinement',[c('pm','完成','2026-10-12')]),
      e('2026-10-12','出口：把可接手的內容交各組','主卡保存共識，職能卡指定接手人及各自日期；需要哪些職能才建哪些卡。','Backlog Refinement',[],[h('pm','PM','UIUX／RD／QA','範圍／驗收標準／各卡預估日期','請回覆能否接手及缺件')]),
      e('2026-10-12','收到接手回覆，後續變更回原卡','各組維護自己的工作與日期；需求若變更，評估影響，再保留原訂、新交期與原因。','Backlog Refinement',[],[h('pm','UIUX／RD／QA','PM','內容已收到，各組依約定排程','變更或交期風險回主卡協調')])]),
    ux:example('UIUX','ux','PM → UIUX；附需求、驗收與決策窗口。','UIUX → RD，PM／QA 可見；附設計版本與互動說明。','設計連結留原卡，請 RD 回覆是否可接手。',[
      e('2026-10-12','入口：確認需要設計與決策窗口','這次 Story 需要設計，原訂 10/12～10/13；不需設計的 OP 可略過，不建空白設計卡。','In Design',[],[h('ux','PM','UIUX','需求／驗收／決策窗口／原訂 10/13','請確認接手')]),
      e('2026-10-12','開始設計，缺決策就回同卡確認','做畫面、互動與例外狀態，進度更新進行中即可。影響交期才協調日期。','In Design',[c('ux','進行中')]),
      e('2026-10-13','達成完成條件，記實際完成日','設計 v1.0、互動與例外狀態可供實作，RD 確認可接手，完成日 10/13，對原訂準時。','In Design',[c('ux','完成','2026-10-13')]),
      e('2026-10-13','出口：交同一份設計版本給 RD','附設計 v1.0、互動及待追蹤事項，PM／QA 使用同一份依據。','In Development',[],[h('ux','UIUX','RD／PM／QA','設計 v1.0／互動與例外說明','請確認接手，後續修改保留版本')]),
      e('2026-10-13','收到回覆，後續修改留變更','RD 確認可實作；若後續需改版，沿原卡留下新版本與日期，必要時協調新交期。','In Development',[],[h('ux','RD','UIUX','設計 v1.0 已收到且可實作','限制或變更回原卡說明')])]),
    rd:example('RD','rd','PM／UIUX 交需求與設計；QA 交 Bug 重現、環境與日期。','RD → QA；開發附版本／自測，Bug 附修復版本與影響。','開發卡交到 QA 主單；Bug 同單交 QA，請回覆複驗安排。',[
      e('2026-10-12','入口：確認開發內容與原訂交期','RD 開發卡原訂 10/12～10/14，確認需求、設計及驗收，能接手才回覆。','In Development',[c('rd','進行中')],[h('rd','PM／UIUX','RD','需求／設計／驗收／原訂 10/14','請確認可實作及交付安排')]),
      e('2026-10-14','開發完成，交 QA 並留完成日','版本、環境、自測及 Review 齊備，交 QA，RD 開發卡實際完成日 10/14，對原訂準時。','Ready for QA',[c('rd','完成','2026-10-14')],[h('rd','RD','QA','v1.0／環境／自測與已知問題','請確認可測與接手')]),
      e('2026-10-14','收到 Bug，原訂日期與完成條件分開確認','這裡切到 QA 主單下 BUG-01，原訂 10/15，完成條件是 QA 驗證通過。QA 主單 Owner 不換成 RD。','Bug Fixing',[c('bug1','進行中',null,'RD-A')],[h('bug1','QA','RD-A','BUG-01／v1.0／重現與預期結果','請確認修復與驗證安排')]),
      e('2026-10-15','修復交 QA，先標待複驗','交 v1.1 與自測，留修復交付日期；尚未通過驗證，Bug 實際完成日仍空白。','Retesting',[c('bug1','待複驗',null,'QA 窗口')],[h('bug1','RD-A','QA','第 1 輪／v1.1／自測','請回覆複驗結果')]),
      e('2026-10-16','複驗未過，原單退回並協調新日期','BUG-01 原訂 10/15 保留，QA／RD 確認新交期 10/19，留下複驗未過與再修原因。','Bug Fixing',[c('bug1','需再修',null,'RD-A')],[h('bug1','QA','RD-A','v1.1 未過／最新重現與 evidence','沿原 Bug 再修')],[r('bug1','2026-10-16','2026-10-14','2026-10-19','v1.1 複驗未過，需再修並安排複驗','QA＋RD-A')]),
      e('2026-10-19','v1.2 驗證通過，原訂與新交期並列','完成日 10/19，對原訂 10/15 是 Delay 4 天，對新交期 10/19 是準時。前輪版本與結果仍保留。','Retesting',[c('bug1','已驗證','2026-10-19','QA 窗口')],[h('bug1','RD-A','QA','第 2 輪／v1.2／自測與複驗通過結果','同 Bug 留已驗證及完成日',2)])]),
    qa:example('QA','qa','PM 邀規劃；正式測試由 RD 提供版本、環境、自測與驗收。','Bug 交 RD；必要測試、複驗及報告完成後交維運。','主單 Owner 保留 QA；各 Bug 同單交接，報告交維運並請回覆。',[
      e('2026-10-12','規劃：先確認這張 QA 卡的完成範圍','原訂 10/10～10/16，包含測試、必要複驗與報告交付。提早確認風險與驗收，準備可與設計／開發並行。','Test Planning'),
      e('2026-10-14','入口：可測資料齊備，確認接手','RD 提供 v1.0、環境、自測與驗收，QA 回覆可接手並開始測試。','In Testing',[c('qa','進行中')],[h('qa','RD','QA','v1.0／環境／自測／驗收','QA 已收到，可接手')]),
      e('2026-10-14','兩張 Bug，各自交 RD 及約交期','QA 主單下掛 BUG-01／BUG-02，各自有完成條件、Owner、時程；不受影響測試繼續。','Bug Backlog',[],[h('bug1','QA','RD-A','BUG-01／重現與原訂 10/15','請確認修復與複驗安排'),h('bug2','QA','RD-B','BUG-02／重現與原訂 10/16','請確認修復與複驗安排')]),
      e('2026-10-16','Bug 再修，QA 主單也評估交期','BUG-01 v1.1 未過，沿原單退回。必要複驗影響 QA 報告交付，原訂 10/16 保留，確認新交期 10/20。','Retesting',[],[h('bug1','QA','RD-A','第 1 輪 v1.1 未過／evidence','原單再修並回覆新版本')],[r('qa','2026-10-16','2026-10-10','2026-10-20','BUG-01 需再修，安排必要複驗與報告','PM＋QA＋RD')]),
      e('2026-10-19','Bug 通過，還要完成剩餘測試與報告','BUG-01 v1.2、BUG-02 v1.1 已驗證；單一 Bug 通過不自動完成 QA 主單，接著確認整體交付條件。','Retesting',[],[h('bug1','QA','RD-A','第 2 輪 v1.2 通過，結果留原 Bug','QA 主單繼續報告與交付檢核',2)]),
      e('2026-10-20','出口：報告交付，記 QA 實際完成日','必要測試、阻斷處置與報告交付完成，記 10/20。對原訂 10/16 是 Delay 4 天，對新交期 10/20 是準時。','QA Sign-off',[c('qa','完成','2026-10-20')],[h('qa','QA','維運／PM','報告／版本／限制／QA 完成日 10/20','請確認收到及部署窗口')])]),
    ops:example('維運','ops','QA／RD 交報告、版本、已知風險與上版資訊。','維運 → 需求 Owner／相關窗口；附部署與 Prod 驗證結果。','在部署卡／主卡回覆接手、窗口與結果，請需求 Owner 確認結案。',[
      e('2026-10-20','入口：收到報告與版本，確認可部署','維運卡原訂 10/16～10/20，確認 QA 報告、版本及上版資訊齊備，再安排窗口。','Deployment',[c('ops','進行中')],[h('ops','QA／RD','維運','報告／v1.2／上版資訊','維運確認收到與部署安排')]),
      e('2026-10-20','窗口需調整，先保留原訂並確認新日期','QA 在 10/20 交付，部署與驗證需改至 10/21。主卡與維運卡分別留下受影響的日期和原因。','Deployment',[],[h('ops','維運','PM／QA／RD','改安排 10/21 部署與 Prod 驗證','各窗口已確認新安排')],[r('ops','2026-10-20','2026-10-16','2026-10-21','QA 交付後需重新確認部署與 Prod 驗證窗口','PM＋維運'),r('root','2026-10-20','2026-10-10','2026-10-21','同步調整功能的部署與 Prod 驗證日期','PM＋維運')]),
      e('2026-10-21','部署完成，還要驗證 Prod','先留下版本與部署結果，接著做必要驗證；還沒驗證通過，維運卡與主卡不提早填完成日。','Production Verification',[],[h('ops','維運','相關驗證窗口','v1.2 已部署／部署結果','請確認必要 Prod 驗證')]),
      e('2026-10-21','Prod 通過，記維運卡實際完成日','Prod 驗證及交付結果齊備，維運卡完成日 10/21。對原訂 10/20 是 Delay 1 天，對新交期是準時。','Production Verification',[c('ops','完成','2026-10-21')],[h('ops','維運','需求 Owner','Prod v1.2 驗證通過／結果連結','請確認必要交付並結案')]),
      e('2026-10-21','需求 Owner 確認，功能主卡結案','主卡也記 10/21，與維運卡分別比較各自交期，不把其他職能的日期差相加。','Done',[],[h('ops','需求 Owner','各組','必要交付與 Prod 結果確認，主卡結案','兩週後回顧交期與交接資料')])])
  };
  let role='pm',index=0;const tabs=[...document.querySelectorAll('[data-walk-role]')];
  const set=(id,text)=>{$(id).textContent=text;};
  const list=(id,items,empty)=>{$(id).replaceChildren();for(const text of items.length?items:[empty]){const li=document.createElement('li');li.textContent=text;$(id).append(li);}};
  function render(announce=true){
    const data=roles[role],current=data.steps[index],snap=M.snapshot({...data,events:data.steps},index);
    const selectedId=role==='rd'&&index>=2?'bug1':data.taskId,card=snap.tasks.find(t=>t.id===selectedId);
    for(const key of ['entry','exit','notify'])set('walk-'+key,data[key]);
    set('walk-card-path',card.parentId?'FLOW-101 → QA 主單 → BUG-01':'FLOW-101 → '+data.name+' 職能卡');set('walk-card-title',card.name);set('walk-owner',`固定 Owner：${card.owner}｜目前接手：${card.assignee}`);set('walk-stage',current.stage);set('walk-status',card.state);
    for(const [key,value]of Object.entries({start:card.originalStart,end:card.originalEnd,currentStart:card.currentStart,currentEnd:card.currentEnd,completed:card.completedAt}))set('walk-'+key,M.date(value));
    set('walk-result',card.result.label);$('walk-result').className='schedule-chip '+card.result.kind;
    set('walk-current-result',card.revisions.length?'對目前交期：'+card.currentResult.label:'尚無改期，原訂時程保持不變。');set('walk-work',card.work);set('walk-done',card.done);
    set('walk-counter',`${String(index+1).padStart(2,'0')} / ${String(data.steps.length).padStart(2,'0')}`);set('walk-date','示意日期 '+M.date(current.at));set('walk-step-title',current.title);set('walk-action',current.description);
    set('walk-operation',current.revisions.length?'保留原訂，記新日期、原因與確認窗口。':current.changes.some(c=>c.completedAt)?'確認完成條件，留下實際完成日，交下一位。':current.handoffs.length?'交付內容留同卡，指定接手人，請回覆收到與下一步。':'沿用既有少量進度；需要交接或日期調整時更新。');
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
