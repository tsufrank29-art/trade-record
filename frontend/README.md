# 股神俱樂部 – 靜態前端 Demo

此目錄提供以 CDN/Tailwind 打造的純前端展示，對應 PRD 與 API 設計中的「房間總覽（Screen 01）」與「房間訪客頁（Screen 04）」互動。資料來自 `js/mock-data.js`，加入房間與留言會存入瀏覽器的 `localStorage`（重新整理後仍會保留）。

## 功能速覽
- 房間卡片列表，支援按人數排序
- 房間訪客頁：查看操作卡、以 popup 輸入暱稱+留言
- 其餘畫面以 placeholder 呈現，方便後續擴充
- 100vh 修正腳本，避免行動裝置 Safari / Chrome 視窗高度誤差

## 快速啟動
1. 直接開啟 `index.html`（建議使用 VS Code Live Server 或任意靜態伺服器）。
2. 手機預覽：在同一 Wi‑Fi 下以 `http://<你的電腦IP>:<port>/frontend/` 造訪。

### Replit 部署
1. Fork 此 repo 到 Replit。
2. 在 Replit「Shell」執行：
   ```bash
   npx serve frontend -l 3000
   ```
3. 點擊「Open in Browser」或以 `https://<your-repl>.repl.co` 用手機開啟。

## 切換成 Google Sheets 資料（可選）
預設讀取 `js/mock-data.js`。若要改用 Google Sheets（需已發布 API 並有 API Key），可依下列步驟：
1. 在 Google Sheets 內建立工作表 `rooms`，欄位順序：`name, owner, trading_cycle, description, member_count`。
2. 取得 Sheet ID 與 API Key。
3. 在 `js/app.js` 引用範例方法：
   ```js
   import { loadRoomsFromSheet } from './js/app.js';

   loadRoomsFromSheet('<YOUR_SHEET_ID>', '<YOUR_API_KEY>')
     .then((remoteRooms) => {
       console.log('Fetched rooms', remoteRooms);
       // TODO: 以 remoteRooms 取代預設 rooms 陣列後重新 render
     })
     .catch((err) => alert(err.message));
   ```
4. 若使用 Google Apps Script 發布為 Web App，可參考：
   ```javascript
   // apps-script example (Code.gs)
   function doGet() {
     const sheet = SpreadsheetApp.openById('<YOUR_SHEET_ID>').getSheetByName('rooms');
     const rows = sheet.getDataRange().getValues();
     const [, ...data] = rows;
     const rooms = data.map((row, index) => ({
       id: index + 1,
       name: row[0],
       owner: row[1],
       tradingCycle: row[2],
       description: row[3],
       memberCount: Number(row[4]) || 0,
     }));
     return ContentService.createTextOutput(JSON.stringify({ rooms }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
   將 `<YOUR_SHEET_ID>` 改成實際 ID，部署後把回傳的 URL 放進前端 `fetch` 即可。

## 檔案結構
- `index.html`：入口頁，含 Tailwind / Feather Icons / Axios CDN
- `css/styles.css`：額外樣式（卡片、按鈕、placeholder）
- `js/mock-data.js`：假資料與 Trade helper
- `js/app.js`：渲染邏輯、localStorage 留言/加入房間、Google Sheets 範例方法
- `assets/`：靜態資產佔位
