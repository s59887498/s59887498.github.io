# QA AI WorkFlow GitHub Pages Static Build

這個資料夾是 `QA-AI-WorkFlow` 的 GitHub Pages 靜態部署版本。

## 部署方式

把本資料夾內的檔案放到一個乾淨的 GitHub public repo 根目錄，然後到 GitHub repo：

1. Settings
2. Pages
3. Build and deployment
4. Source 選 `Deploy from a branch`
5. Branch 選 `main` / root

GitHub Pages 發佈後，`index.html` 會直接開啟 v0.5 首頁。

## 檔案內容

```text
index.html
document.html
execution.html
execution-document.html
app.js
styles.css
EOMC_QA_AI_WorkFlow.md
QA_AI_WorkFlow_Execution_Task_Roadmap.md
```

這是純靜態網站，不需要 Python server，也不需要開 8088 port。

