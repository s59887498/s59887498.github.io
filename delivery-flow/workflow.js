(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const stages={
  "intake": {
    "owner": "01 / 建卡：PM｜主卡指派：PM",
    "title": "Product Backlog",
    "card": "PM 建立 Story 並指派自己。",
    "status": "PM 的需求筆記區，收集可能或尚未成案的需求。",
    "action": "PM 建卡並指派自己；需求進入確認時，由 PM 移至 Refinement。",
    "handoff": "保留需求來源及待釐清事項，邀請相關人員討論。",
    "time": "確認可排 Sprint 時，再安排主卡與子任務日期。"
  },
  "refinement": {
    "owner": "02 / 移卡：PM｜主卡指派：PM",
    "title": "Refinement",
    "card": "PM 將 Story 從 Product Backlog 移入，指派仍為 PM。",
    "status": "PM 與 RD 溝通，並依需要和外部確認需求。",
    "action": "需求確認且下個 Sprint 要開發時，由 PM 移至 Sprint Backlog。",
    "handoff": "釐清範圍、驗收、依賴及風險；各職能可提前提供意見。",
    "time": "保留需求及排程決策。"
  },
  "sprint": {
    "owner": "03 / 移卡：PM｜主卡指派：PM",
    "title": "Sprint Backlog",
    "card": "PM 將 Story 移入，主卡仍指派 PM。",
    "status": "需求已確認，安排下一個 Sprint 的工作。",
    "action": "PM 設定 Story 的 Start Date／End Date；依討論拆 BE、FE、UIUX、QA、DevOps 子任務、指派各職能負責人，並設定每張子任務的開始與結束日。各職能可再自行開卡拆分自己的工作。",
    "handoff": "交各職能工作範圍、驗收、負責人與日期；不需要的職能不必建空白卡。",
    "time": "原訂與改期原因保留；Sprint 開始後由 PM 移至 Development。"
  },
  "development": {
    "owner": "04 / 移卡：PM｜主卡指派：PM",
    "title": "Development",
    "card": "Sprint 開始時 PM 移卡；Story 仍指派 PM。",
    "status": "RD 從 My Tasks 接收職能子任務並開發。",
    "action": "RD 完成開發、自測與 Review 後，自行勾選自己被指派的子任務完成；子卡完成不會自動移動或完成 Story。",
    "handoff": "PM 與 RD 確認都已開發完成、可以進 QA 後，PM 移至 Ready to RT Test 並指派 QA。Daily 可同步，不需等待會議。",
    "time": "留各卡實際完成日，開發或上版問題即時回報 PM。"
  },
  "readyRT": {
    "owner": "05 / 首次移卡：PM；退回：QA｜主卡指派：QA",
    "title": "Ready to RT Test",
    "card": "PM 與 RD 確認開發完成可交 QA 後，PM 首次移入並指派 QA。",
    "status": "等待 RT 部署與開測；RT 測試遇 Bug 等待 RD 修復時，也由 QA 退回此處，主卡仍指派 QA。",
    "action": "RT 已部署且 QA 開始測試或複驗時，由 QA 移至 RT Testing。",
    "handoff": "交接版本、環境、自測、已知限制、Bug 與接手人。Bug 子任務指派 RD，與 Story 指派分開。",
    "time": "保留修復、部署、複驗與必要改期紀錄。"
  },
  "rtTesting": {
    "owner": "06 / 移卡：QA｜主卡指派：QA",
    "title": "RT Testing",
    "card": "RT 已上版、QA 可以進行測試時由 QA 移入。",
    "status": "執行 RT 測試；QA 主單下建立 Bug 子任務，交 RD 修復。",
    "action": "RT Bug 等待修復時，QA 將 Story 退回 Ready to RT Test；修復部署後 QA 開始複驗，再移回 RT Testing。",
    "handoff": "RT 測試完成後，由 QA 移至 Ready to Stage Test，主卡仍指派 QA。",
    "time": "記測試結果、版本與每輪 Bug 複驗；不受影響的測試可繼續。"
  },
  "readyStage": {
    "owner": "07 / 移卡：QA｜主卡指派：QA",
    "title": "Ready to Stage Test",
    "card": "QA 完成 RT 後移入；Stage Bug 等待修復時也退回此處。",
    "status": "主卡維持指派 QA。維運準備 PreProd，RD 核對本次應上內容後通知 QA。",
    "action": "Stage 已部署且 QA 開始測試或複驗時，由 QA 移至 Stage Testing。",
    "handoff": "維運備 PreProd → RD 核對有無漏上並附版本 → RD 通知 QA。",
    "time": "記版本與交接；異常即時回報 PM。"
  },
  "stageTesting": {
    "owner": "08 / 移卡：QA｜主卡指派：QA",
    "title": "Stage Testing",
    "card": "Stage 已上版、QA 可以測試時由 QA 移入；PreProd 為此階段環境。",
    "status": "QA 確認本次功能涵蓋並執行必要回歸，記錄版本與結果。",
    "action": "Stage Bug 等待修復時，QA 將 Story 退回 Ready to Stage Test；修復部署後開始複驗再移回 Stage Testing。",
    "handoff": "QA 測試完成後移至 Pending UAT，將 Story 指派 PM，並交測試結果／報告。",
    "time": "未通過或漏上即時回報 PM，保留 Bug 與複驗紀錄。"
  },
  "uat": {
    "owner": "09 / 移卡：QA｜主卡指派：PM",
    "title": "Pending UAT",
    "card": "QA 測試完成後移卡並將 Story 指派 PM。",
    "status": "QA 交付功能涵蓋、回歸結果、版本、報告與限制，等待 PM UAT。",
    "action": "PM 完成 UAT 驗收後，移至 Ready To Release 並指派 DevOps。",
    "handoff": "交驗收結果、版本及發版資訊給 DevOps。",
    "time": "保留 QA 完成日與驗收結果；問題及時回報。"
  },
  "release": {
    "owner": "10 / 移卡：PM｜主卡指派：DevOps",
    "title": "Ready To Release",
    "card": "PM 完成 UAT 後移卡並將 Story 指派 DevOps。",
    "status": "維運／DevOps 準備正式上線。",
    "action": "DevOps 依既有程序上 Prod；上線後由 DevOps 移至 Done 並勾選 Story 完成。",
    "handoff": "回報發布版本、結果及既有上線驗證資訊；問題即時通知 PM。",
    "time": "保留發布結果、日期與改期原因。"
  },
  "done": {
    "owner": "11 / 移卡與完成：DevOps｜主卡指派：DevOps",
    "title": "Done",
    "card": "正式上線後由 DevOps 移卡至 Done，並在 Story 按完成。",
    "status": "主卡已結案；QA、RD 子任務與 Bug 各自保留工作和結果。",
    "action": "DevOps 留下正式版本與上線結果，移至 Done 並勾選完成；不把 QA 測完或 RD 子卡完成當成 Story 結案。",
    "handoff": "同步交付結果給相關窗口，後續問題保留關聯。",
    "time": "Story 完成日與各子卡日期分別比較原訂，不把各卡 Delay 相加。"
  }
};
  const dialog=$('stage-dialog');let trigger=null,mode='story';
  function showStage(id,button){const s=stages[id];if(!s)return;trigger=button;for(const field of ['owner','title','card','status','action','handoff','time'])$('stage-'+field).textContent=s[field];if(mode==='op'&&id==='sprint')$('stage-action').textContent='本例 OP 不需設計；PM 依需要建立職能子任務並設定日期，各職能可繼續拆自己的工作。OP 收單及各測試門檻依團隊約定。';dialog.showModal();}
  document.querySelectorAll('[data-stage]').forEach(button=>{button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','stage-dialog');button.addEventListener('click',()=>showStage(button.dataset.stage,button));});
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));$('mode-note').textContent=mode==='story'?'PM 建 Story，於 Sprint Backlog 設定主子卡日期並指派職能子任務；各職能可再拆自己的工作。':'本例 OP 不需設計，因此不拆設計 SubStory。11 個泳道清單不變；RT／Stage／UAT 的適用門檻與 OP 收單窗口沿團隊約定，不自動略過。';}));
  $('stage-done').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{if(trigger)trigger.focus({preventScroll:true});});
})();
