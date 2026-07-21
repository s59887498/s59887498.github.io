# QA Workflow Agent GitHub Pages

這個資料夾是 QA Workflow Agent 的 GitHub Pages 靜態展示版本，用來說明目前已建立的 QA 能力、實際成果、成熟度定位，以及往 Loop Agent 升級的 Roadmap。

## 發佈方式

將資料夾內容放到 GitHub public repository 根目錄，在 GitHub Pages 設定中選擇 Deploy from a branch，並指定 main branch 的 root。發佈後首頁會開啟 QA Workflow Agent 的現況成果與 Loop Agent Roadmap。

## 頁面分工

- index.html：QA Workflow Agent 的現況成果、能力邊界、成熟度與 Loop Agent Roadmap。
- agent-document.html：完整 Roadmap 正文，內容來源為 QA_Workflow_Agent_Roadmap.md。
- document.html：v0.5 品質生命週期與治理架構參考。
- execution.html：v0.5 架構導入的執行 Task 參考。
- qa_3_month_competency_charts.html：新人三個月培訓計畫。

## 主要檔案

- QA_Workflow_Agent_Roadmap.md：首頁與 Roadmap 正文的內容來源。
- EOMC_QA_AI_WorkFlow.md：原始品質架構與 T1-T8 生命週期參考。
- QA_AI_WorkFlow_Execution_Task_Roadmap.md：原始架構導入任務參考。
- app.js：Markdown 正文、執行計畫與互動卡片的渲染邏輯。
- styles.css：全站共用樣式與響應式版面。

這是純靜態網站。GitHub Pages 發佈後會直接載入；本機預覽 Markdown 正文時需以靜態網站伺服器開啟，讓瀏覽器可以讀取 Markdown 檔案。
