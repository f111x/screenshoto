# Screensho.to — 截图即代码

截图任意 UI，AI 秒生成 HTML / Tailwind / React / Vue 代码。

## 快速开始

```bash
# 安装依赖
npm install

# 配置 API Key
cp .env.example .env.local
# 编辑 .env.local，填入你的 OpenAI API Key

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000

## 配置

在 `.env.local` 中设置：

```env
OPENAI_API_KEY=sk-your-api-key-here
```

从 [OpenAI Platform](https://platform.openai.com/api-keys) 获取 API Key。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS v4
- **AI**: OpenAI GPT-4o Vision
- **上传**: react-dropzone

## 功能

- [x] 拖拽/粘贴上传截图
- [x] AI 生成 HTML / Tailwind / React / Vue 代码
- [x] 实时预览
- [x] 一键复制代码
- [x] 下载代码文件
- [x] 免费额度管理 (20次/月)
- [x] 在线代码编辑 (Monaco Editor)
- [ ] 分享链接
- [ ] Docker 自部署

## 部署到 Cloudflare Pages

### 方式一：GitHub + Cloudflare Dashboard（推荐）

1. 推送代码到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages
3. 点击 **Create** → **Pages** → **Connect to Git**
4. 选择你的 `screenshoto` 仓库
5. 填写构建设置：

| 配置项 | 值 |
|--------|-----|
| **Framework preset** | Next.js (static export) → 改为手动 |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | `/` |

6. 添加环境变量：

| 变量名 | 值 |
|--------|-----|
| `OPENAI_API_KEY` | 你的 OpenAI API Key |

7. 点击 **Save and Deploy**

### 方式二：Wrangler CLI

```bash
# 登录 Cloudflare
npx wrangler login

# 构建 + 部署
npm run pages:build
npm run pages:deploy
```

### 本地预览 Cloudflare 构建结果

```bash
npm run pages:build
npm run pages:dev
```

## License

MIT
