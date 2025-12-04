# 「股神俱樂部」APP API 設計（MVP）

## 總覽
- Base URL（範例）：`https://api.stock-club.example.com/v1`
- 認證：
  - 採 JWT（Authorization: Bearer <token>），`/auth/register`、`/auth/login` 公開。
  - 後端可使用 Access Token（15~30 分鐘）+ Refresh Token（7~30 天）機制；以下僅示意 Access Token 流程。
- 請求與回應：`application/json`，時區預設 UTC+8；日期時間採 ISO-8601。
- 錯誤格式：`{"error": {"code": "xxx", "message": "..."}}`，常見錯誤碼：`INVALID_INPUT`、`UNAUTHORIZED`、`FORBIDDEN`、`NOT_FOUND`、`CONFLICT`、`RATE_LIMITED`、`SERVER_ERROR`。

## 資源關係概要
- User 1:N Room（creator）
- User M:N Room（membership／joins），加入後可留言。
- Room 1:N TradeRecord（操作記錄）
- TradeRecord 1:N Comment（留言）

## 欄位約定（精簡）
- `id`：UUID 或 Snowflake。
- `email`（string）、`phone`（string）、`nickname`（string）。
- Room：`name`（string, 必填）、`cycle`（enum: short_term | mid_term | long_term | value_inv）、`intro`（string, 選填）。
- TradeRecord：`symbol`（string, 僅數字）、`name`（string）、`shares`（int）、`date`（date）、`action`（enum: buy | add | trim | sell）、`note`（string）。
- Comment：`content`（string）。

## Auth
### POST /auth/register
- 功能：註冊會員（Email/電話/暱稱/密碼/確認密碼，無需驗證）。
- Request Body：`{ "email": "", "phone": "", "nickname": "", "password": "", "passwordConfirm": "" }`
- Responses：
  - 201 `{ "token": "<jwt>", "user": {"id": "...", "email": "...", "phone": "...", "nickname": "..."} }`
  - 400 `INVALID_INPUT`（必填缺漏、密碼不一致）

### POST /auth/login
- 功能：登入並取得 token。
- Request Body：`{ "email": "", "password": "" }`
- Responses：
  - 200 `{ "token": "<jwt>", "user": {"id": "...", "email": "...", "nickname": "..."} }`
  - 401 `UNAUTHORIZED`（帳密不符）

### POST /auth/logout
- 功能：登出、作廢 token（若有 Refresh Token 則列入黑名單）。
- Headers：`Authorization: Bearer <token>`
- Responses：204 無內容

## 房間 Rooms
### GET /rooms
- 功能：房間總覽（Screen 01），列出除自己創建外的房間，可排序人數多→少。
- Query：`?excludeMine=true&sort=members_desc&page=1&limit=20`
- Response：200 `[ { "id": "", "name": "", "creator": {"id": "", "nickname": ""}, "memberCount": 123, "cycle": "short_term", "recentTrades": [ {"symbol": "2330", "name": "台積電", "date": "2024-02-01"}, ... up to 3 ] }, ... ]`

### POST /rooms
- 功能：創建房間（popup）。
- Headers：`Authorization`
- Body：`{ "name": "", "cycle": "short_term", "intro": "optional" }`
- Responses：
  - 201 `{ "id": "...", "name": "...", "cycle": "...", "intro": "...", "memberCount": 1 }`
  - 400 `INVALID_INPUT`（必填缺漏）

### GET /rooms/mine
- 功能：我創建的房間列表（Screen 02 空狀態用）。
- Headers：`Authorization`
- Response：`{ "rooms": [ {"id": "", "name": "", "memberCount": 5, "cycle": "mid_term"} ], "hasRoom": true/false }`

### GET /rooms/joined
- 功能：我加入的房間列表（Screen 03），支援排序人數多→少。
- Headers：`Authorization`
- Query：`?sort=members_desc&page=1&limit=20`
- Response：`[ { "id": "", "name": "", "creator": {"id": "", "nickname": ""}, "memberCount": 88, "cycle": "long_term", "recentTrades": [...] } ]`

### POST /rooms/{roomId}/join
- 功能：加入房間（卡片按鈕「加入房間」）。
- Headers：`Authorization`
- Responses：
  - 200 `{ "status": "joined" }`（用於 toast「加入成功」）
  - 409 `CONFLICT`（已加入）

### POST /rooms/{roomId}/leave
- 功能：退出房間（Screen 04 左下按鈕）。
- Headers：`Authorization`
- Responses：
  - 200 `{ "status": "left" }`
  - 403 `FORBIDDEN`（創建者不可退出自己的房間）

### DELETE /rooms/{roomId}
- 功能：移除房間（創建者才能操作）。
- Headers：`Authorization`
- Responses：
  - 204 無內容（用於「確認移除」後返回空狀態）
  - 403 `FORBIDDEN`（非創建者）
  - 404 `NOT_FOUND`

### GET /rooms/{roomId}
- 功能：房間詳情（訪客或創建者共用，顯示房間人數、紀錄與留言）。
- Headers：`Authorization`
- Response：`{ "id": "", "name": "", "memberCount": 77, "cycle": "value_inv", "intro": "...", "creator": {"id": "", "nickname": ""}, "tradeRecords": [ {"id": "", "symbol": "2330", "name": "台積電", "shares": 10, "date": "2024-02-01", "action": "buy", "note": "...", "comments": [ {"id": "", "author": {"id": "", "nickname": ""}, "content": "...", "createdAt": "..."} ] } ] }`

## 操作記錄 Trade Records（創建者 Screen 02）
### POST /rooms/{roomId}/trades
- 功能：新增操作記錄（popup）。
- Headers：`Authorization`
- Body：`{ "symbol": "2330", "name": "台積電", "shares": 10, "date": "2024-02-01", "action": "buy", "note": "可輸入文字數字" }`
- Responses：
  - 201 `{ "id": "...", "symbol": "2330", "name": "台積電", "shares": 10, "date": "2024-02-01", "action": "buy", "note": "..." }`
  - 403 `FORBIDDEN`（非房間創建者）

### PATCH /rooms/{roomId}/trades/{tradeId}
- 功能：編輯操作記錄（卡片右側按鈕）。
- Headers：`Authorization`
- Body：部分欄位更新。
- Responses：
  - 200 更新後 TradeRecord
  - 403 `FORBIDDEN`
  - 404 `NOT_FOUND`

### DELETE /rooms/{roomId}/trades/{tradeId}
- 功能：刪除操作記錄（popup「確認刪除」）。
- Headers：`Authorization`
- Responses：
  - 204 無內容
  - 403 `FORBIDDEN`
  - 404 `NOT_FOUND`

## 留言 Comments（創建者與訪客）
### POST /rooms/{roomId}/trades/{tradeId}/comments
- 功能：留言（卡片下「我要留言」）。
- Headers：`Authorization`
- Body：`{ "content": "..." }`
- Responses：
  - 201 `{ "id": "...", "content": "...", "author": {"id": "", "nickname": ""}, "createdAt": "..." }`
  - 404 `NOT_FOUND`（房間或紀錄不存在）
  - 403 `FORBIDDEN`（未加入房間者可視需求限制，若限制請回此碼）

### GET /rooms/{roomId}/trades/{tradeId}/comments
- 功能：取得單筆操作記錄的留言列表（載入留言區塊）。
- Headers：`Authorization`
- Query：`?page=1&limit=50`
- Response：`{ "comments": [ {"id": "", "content": "...", "author": {"id": "", "nickname": ""}, "createdAt": "..."} ], "total": 120 }`

## 個人主頁 Profile（Screen 05）
### GET /me
- 功能：取得當前使用者資料（暱稱、已創建／已加入房間）。
- Headers：`Authorization`
- Response：`{ "id": "", "nickname": "", "email": "", "roomsCreated": [ {"id": "", "name": ""} ] | [], "roomsJoined": [ {"id": "", "name": "", "creatorNickname": ""} ] | [] }`

### PATCH /me
- 功能：更新暱稱、電話等基本資料。
- Headers：`Authorization`
- Body：`{ "nickname": "新的暱稱", "phone": "" }`
- Response：200 更新後 User 資料

## 排序與分頁建議
- 房間列表（總覽／已加入）：`sort=members_desc`（房間人數多→少）；預設 `sort=created_desc`（建立時間新→舊）。
- 分頁：`page`（起始 1）、`limit`（預設 20, max 100）。

## 安全與速率限制（建議）
- Rate Limit：登入／註冊／留言可採 5 req/min/user；房間列表 60 req/min/user。
- 權限檢查：
  - 操作記錄 CRUD 僅房間創建者可用。
  - 留言：加入房間的使用者皆可；若允許訪客留言可移除檢查。
  - 移除房間：僅創建者；退出房間不可用於創建者。
- 請在 Response 中回傳「加入成功」等狀態字串，以便前端觸發 toast。

