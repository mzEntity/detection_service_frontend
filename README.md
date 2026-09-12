# AI-Generated Content Detector (Frontend)

基于 Next.js 构建的 AI 生成内容检测服务前端，支持文本、图像、视频三种模态的 AI 生成内容检测。

## 技术栈

- **Next.js 16** + **React 19**
- **TypeScript**
- **Tailwind CSS 4**

## 功能

- **Text Detection** — 输入文本，检测是否由 AI 生成
- **Image Detection** — 上传图片，检测是否由 AI 生成
- **Video Detection** — 上传视频，异步任务追踪检测结果

## 快速上手

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，设置后端 API 地址

# 启动开发服务器
npm run dev
```

然后访问 http://localhost:3000。

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | 后端 API 地址 | `http://localhost:8000` |
| `NEXT_PUBLIC_ENABLE_MOCKS` | 启用 Mock 数据 | `false` |

## 可用脚本

```bash
npm run dev      # 开发模式
npm run build    # 构建
npm run start    # 生产模式启动
npm run lint     # 代码检查
```
