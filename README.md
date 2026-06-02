# Screensho.to — 截图即代码

截图任意 UI，AI 秒生成 HTML / Tailwind / React / Vue 代码。

## 快速开始

```bash
npm install
cp .env.example .env.local   # 填入 OPENAI_API_KEY
npm run dev                   # → http://localhost:3000
```

## 功能一览

| 层级 | 功能 | 状态 |
|------|------|------|
| **P0** | 截图上传 (拖拽/粘贴/文件选择) | ✅ |
| | AI 生成代码 (GPT-4o Vision) | ✅ |
| | 4 种框架输出 (HTML/Tailwind/React/Vue) | ✅ |
| | iframe 实时预览 | ✅ |
| | 一键复制 / 下载代码文件 | ✅ |
| | 免费额度管理 (20次/月) | ✅ |
| | 历史记录 (localStorage) | ✅ |
| | 深色模式 + 响应式布局 | ✅ |
| **P1** | Monaco 编辑器 + 预览实时联动 | ✅ |
| **P2** | 🔗 分享链接（永久链接 + 公开分享页） | ✅ |
| | 👁️ 代码对比 Diff（并排对比原图 vs 生成代码） | ✅ |
| | ✨ AI 相似度评分 | ✅ |
| | 📦 批量转换（多图上传 + 队列处理） | ✅ |
| | 🧩 公开 REST API + API 文档页 | ✅ |
| | 🤖 AI 代码审查 + 一键修复建议 | ✅ |

## 部署到 Cloudflare Pages

1. 推送代码到 GitHub 仓库
2. Cloudflare Dashboard → Pages → Connect to Git
3. 选仓库 → Build: `npx @cloudflare/next-on-pages` | 输出: `.vercel/output/static`
4. 添加环境变量 `OPENAI_API_KEY`
5. Deploy ✅

## 项目结构

```
src/
├── app/
│   ├── page.tsx                     # Landing 首页
│   ├── app/page.tsx                 # 主应用
│   ├── docs/page.tsx                # API 文档
│   ├── s/[id]/page.tsx              # 分享页
│   └── api/
│       ├── generate/route.ts        # AI 代码生成
│       ├── share/route.ts           # 创建分享
│       ├── share/[id]/route.ts      # 获取分享
│       ├── score/route.ts           # AI 相似度评分
│       ├── fix/route.ts             # AI 代码审查
│       └── v1/generate/route.ts     # 公开 REST API
├── components/
│   ├── ImageUploader.tsx            # 截图上传
│   ├── FrameworkSelector.tsx        # 框架选择
│   ├── CodePreview.tsx              # iframe 预览
│   ├── CodeOutput.tsx               # Monaco 编辑器
│   ├── CompareView.tsx              # 对比视图
│   ├── BatchUploader.tsx            # 批量上传
│   └── CodeFixSuggestions.tsx       # AI 修复建议
├── lib/
│   ├── ai.ts                        # AI 调用
│   ├── store.ts                     # 分享存储
│   └── utils.ts                     # 工具函数
└── types/                           # 类型定义
```

## License

MIT
