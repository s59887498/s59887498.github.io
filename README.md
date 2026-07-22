# AI QA Operating System GitHub Pages

這個資料夾是 AI QA Operating System 的 GitHub Pages 靜態展示版本。主軸是目前已建立的 QA Domain Package、Knowledge / Skill / Methodology / Runtime Contract，以及以 Evaluation Framework 為核心的下一階段演進。

## 發佈方式

將資料夾內容放到 GitHub public repository 根目錄，在 GitHub Pages 設定中選擇 Deploy from a branch，並指定 main branch 的 root。發佈後首頁會開啟 AI QA Operating System 的現況與 Evaluation Framework Roadmap。

## 頁面分工

- index.html：AI QA Operating System 的現況、OS layer、能力邊界、成熟度與 Evaluation-first Roadmap。
- agent-document.html：完整架構正文，內容來源為 QA_Workflow_Agent_Roadmap.md。
- document.html：v0.5 品質生命週期與治理架構參考。
- execution.html：v0.5 架構導入的執行 Task 參考。
- qa_3_month_competency_charts.html：新人三個月培訓計畫。

## 主要檔案

- QA_Workflow_Agent_Roadmap.md：AI QA OS、Evaluation Framework 與長期 Quality Loop 的完整內容來源。
- EOMC_QA_AI_WorkFlow.md：原始品質架構與 T1-T8 生命週期參考。
- QA_AI_WorkFlow_Execution_Task_Roadmap.md：原始架構導入任務參考。
- app.js：Markdown 正文、執行計畫與互動卡片的渲染邏輯。
- styles.css：全站共用樣式與響應式版面。

這是純靜態網站。GitHub Pages 發佈後會直接載入；本機預覽 Markdown 正文時需以靜態網站伺服器開啟，讓瀏覽器可以讀取 Markdown 檔案。
