# 部落格系統 - NestJS + Angular + SQLite3

這是一個使用 TypeScript、NestJS、Angular 和 SQLite3 建構的部落格系統，支援標籤功能和搜尋。

## 功能特色

- 📝 文章管理 (CRUD)
- 🏷️ 標籤系統
- 🔍 標籤搜尋功能
- 📱 響應式設計
- 🎯 熱門標籤顯示

## 技術棧

### 後端
- **NestJS** - Node.js 框架
- **TypeORM** - ORM 資料庫操作
- **SQLite3** - 輕量級資料庫
- **TypeScript** - 型別安全

### 前端
- **Angular 17** - 前端框架
- **Bootstrap 5** - UI 框架
- **RxJS** - 反應式程式設計

## 快速開始

### 安裝依賴

#### 後端
```bash
npm install
```

#### 前端
```bash
cd client
npm install
```

### 啟動應用

#### 啟動後端服務器 (port 3000)
```bash
npm run start:dev
```

#### 啟動前端應用 (port 4200)
```bash
cd client
ng serve
```

## API 端點

### 文章 API
- `GET /posts` - 獲取所有文章
- `GET /posts/:id` - 獲取單一文章
- `POST /posts` - 建立新文章
- `PATCH /posts/:id` - 更新文章
- `DELETE /posts/:id` - 刪除文章
- `GET /posts?tags=tag1,tag2` - 依標籤篩選文章

### 標籤 API
- `GET /tags` - 獲取所有標籤
- `GET /tags/:id` - 獲取單一標籤
- `POST /tags` - 建立新標籤
- `PATCH /tags/:id` - 更新標籤
- `DELETE /tags/:id` - 刪除標籤
- `GET /tags?search=keyword` - 搜尋標籤
- `GET /tags/popular?limit=10` - 獲取熱門標籤

## 資料模型

### Post (文章)
```typescript
{
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
}
```

### Tag (標籤)
```typescript
{
  id: number;
  name: string;
  color: string;
  posts: Post[];
}
```

## 專案結構

```
tag_server/
├── src/                    # 後端源碼
│   ├── posts/             # 文章模組
│   ├── tags/              # 標籤模組
│   ├── app.module.ts      # 主應用模組
│   └── main.ts            # 應用入口點
├── client/                # 前端源碼
│   └── src/
│       ├── app/
│       │   ├── components/  # Angular 組件
│       │   ├── services/    # 服務層
│       │   └── models/      # 資料模型
│       └── assets/         # 靜態資源
└── blog.db                # SQLite 資料庫檔案
```

## 開發

### 建立新文章
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "這是文章內容...",
    "tagNames": ["技術", "程式設計"]
  }'
```

### 搜尋標籤
```bash
curl "http://localhost:3000/tags?search=技術"
```

## 生產部署

1. 建構後端
```bash
npm run build
```

2. 建構前端
```bash
cd client
ng build --prod
```

3. 啟動生產服務器
```bash
npm run start:prod
```

## 貢獻

歡迎提交 Pull Request 來改善這個專案！