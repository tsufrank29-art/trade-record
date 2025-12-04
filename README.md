# trade-record

台股操作專案(測試用)。

## 專案結構
- `docs/`：產品需求與 API 設計文件。
- `backend/`：Laravel 10 REST API scaffold（使用 SQLite、JWT），含模型、遷移、種子、路由、OpenAPI 與 Postman 雛形。
- `frontend/`：Expo + TypeScript 前端 scaffold，涵蓋登入流程與底部分頁結構。

請參考 `backend/README.md` 完成安裝與啟動。

## CI
[![Frontend CI](https://github.com/<your-org>/trade-record/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/<your-org>/trade-record/actions/workflows/ci-frontend.yml)
[![Laravel Tests](https://github.com/<your-org>/trade-record/actions/workflows/ci-backend.yml/badge.svg)](https://github.com/<your-org>/trade-record/actions/workflows/ci-backend.yml)

## Frontend

### 開發啟動
```bash
cd frontend
npm install
npm start # 選擇 iOS/Android/Web 模式
```

### 測試
```bash
cd frontend
npm test
```
