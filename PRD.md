# MVP 需求文档：Image Background Remover

**版本：** v0.1  
**日期：** 2026-03-28  
**状态：** 草稿

---

## 一、项目概述

### 1.1 产品名称

暂定：**BgRemover.io**（待定，需确认域名）

### 1.2 产品定位

一个轻量、免费、无需注册的在线图片背景去除工具。用户上传图片，AI 自动抠图，即刻下载透明背景图。主打**快速、免费、隐私安全（图片不存储）**。

### 1.3 目标用户

- 电商卖家：处理商品主图，去除背景制作白底图
- 设计师：快速抠图用于设计素材
- 普通用户：处理头像、证件照、个人照片

### 1.4 核心价值主张

> "Upload. Remove. Download. No signup. No storage."

---

## 二、技术架构

### 2.1 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端 | HTML + Tailwind CSS + Vanilla JS | 轻量，无框架依赖，Cloudflare Pages 直接托管 |
| API 层 | Cloudflare Workers (TypeScript) | 无服务器，全球边缘节点 |
| AI 服务 | remove.bg API | 专业抠图，支持人物/商品/动物等 |
| 部署 | Cloudflare Pages + Workers | 一体化部署，零运维 |
| 存储 | 无（内存处理，图片不落盘） | 隐私友好卖点 |

### 2.2 数据流

```
用户选择图片（浏览器端）
    ↓ multipart/form-data POST
Cloudflare Worker（接收图片，内存中转）
    ↓ 调用 remove.bg API
remove.bg（AI 抠图处理）
    ↓ 返回透明背景图（PNG）
Cloudflare Worker（直接流式返回）
    ↓
用户浏览器（预览 + 下载）
```

### 2.3 限制说明

- 单张图片最大：**12MB**（remove.bg 限制）
- 支持格式：JPG、PNG、WebP
- 输出格式：PNG（透明背景）
- Worker 内存：128MB（实际图片中转不会触碰上限）

---

## 三、功能需求（MVP 范围）

### 3.1 核心功能

#### F1：图片上传
- 支持**点击上传**和**拖拽上传**两种方式
- 上传前客户端校验：
  - 文件类型（仅允许 JPG/PNG/WebP）
  - 文件大小（超过 12MB 提示错误）
- 上传中显示进度状态

#### F2：AI 背景去除
- 调用 remove.bg API 处理
- 处理中显示 Loading 动画（预计 2-5 秒）
- 处理失败显示友好错误提示（网络错误 / API 额度不足 / 图片不支持）

#### F3：结果预览
- 处理完成后展示原图与结果图**左右对比**
- 结果图背景使用棋盘格样式，直观展示透明区域

#### F4：图片下载
- 提供「Download PNG」按钮
- 文件名：`[原文件名]-removed-bg.png`
- 直接触发浏览器下载，无需跳转

#### F5：重新上传
- 提供「Try Another Image」按钮，重置页面状态

### 3.2 页面结构

```
[Header]
  - Logo / 产品名
  - 导航（About、API 占位）

[Hero Section]
  - 主标题：Remove Image Background for Free
  - 副标题：AI-powered, instant, no signup required
  - 上传区域（拖拽框 + 点击按钮）

[Result Section]（上传后显示）
  - 原图 vs 结果图对比
  - 下载按钮
  - 重新上传按钮

[Features Section]
  - 卖点：免费 / 不存储 / 秒级处理 / 支持多格式

[Footer]
  - 版权信息
  - Privacy Policy（文案占位）
```

### 3.3 不在 MVP 范围内（后续迭代）

- ❌ 用户注册 / 登录
- ❌ 历史记录
- ❌ 批量处理
- ❌ 付费墙
- ❌ 编辑功能（换背景色/图）
- ❌ API 开放

---

## 四、非功能需求

### 4.1 性能

- 页面首屏加载 < 1.5s（Cloudflare Pages CDN 加速）
- 图片处理响应时间：依赖 remove.bg API，通常 2-5s

### 4.2 兼容性

- 浏览器：Chrome 90+、Firefox 88+、Safari 14+、Edge 90+
- 设备：PC 优先，响应式适配移动端

### 4.3 SEO 基础

- `<title>`：`Image Background Remover - Free AI Tool | BgRemover`
- `<meta description>`：`Remove image backgrounds instantly with AI. Free, no signup required. Perfect for product photos, portraits, and more.`
- `<h1>`：页面唯一，包含核心关键词
- Open Graph 标签（便于社交分享）
- 页面加载速度优化（Core Web Vitals）

### 4.4 隐私

- 页面明确告知：**图片不存储在服务器，处理完即销毁**
- 不埋追踪 Cookie（MVP 阶段）
- Privacy Policy 页面（基础版）

---

## 五、API 设计

### 5.1 Worker 接口

**POST** `/api/remove-bg`

**Request：**
```
Content-Type: multipart/form-data
Body: image_file (文件)
```

**Response（成功）：**
```
Content-Type: image/png
Body: 透明背景图二进制数据
```

**Response（失败）：**
```json
{
  "error": "错误描述",
  "code": "INVALID_FILE | FILE_TOO_LARGE | API_ERROR | RATE_LIMIT"
}
```

### 5.2 remove.bg API 调用

- Endpoint：`https://api.remove.bg/v1.0/removebg`
- 认证：`X-Api-Key: {REMOVE_BG_API_KEY}`（存储于 Worker 环境变量）
- 参数：`size=auto`（自动选择输出分辨率）

---

## 六、部署说明

### 6.1 Cloudflare 配置

```
项目结构：
/
├── frontend/          # 静态前端（部署到 Cloudflare Pages）
│   ├── index.html
│   ├── style.css
│   └── app.js
└── worker/            # API Worker
    ├── src/
    │   └── index.ts
    ├── wrangler.toml
    └── package.json
```

### 6.2 环境变量

Worker 需配置：
```
REMOVE_BG_API_KEY=your_api_key_here
```

通过 Cloudflare Dashboard → Workers → Settings → Variables 配置（不提交到代码仓库）。

### 6.3 域名配置（建议）

- 前端：`yourdomain.com` → Cloudflare Pages
- API：`yourdomain.com/api/*` → 路由到 Worker（Pages Functions 或 Worker 路由）

---

## 七、验收标准（MVP）

| 功能 | 验收条件 |
|------|---------|
| 上传 | 能正常选择/拖拽图片，超限文件正确拦截 |
| 处理 | 调用 remove.bg 成功，Loading 状态正常显示 |
| 预览 | 原图与结果图正确展示，棋盘格背景正常 |
| 下载 | 点击下载能获取正确的透明背景 PNG |
| 错误处理 | API 失败/超限时显示友好提示，不白屏 |
| SEO | Lighthouse SEO 评分 ≥ 90 |
| 移动端 | 手机浏览器可正常使用上传和下载功能 |

---

## 八、里程碑计划

| 阶段 | 内容 | 预估工时 |
|------|------|---------|
| Day 1 | 前端页面开发（HTML/CSS/JS） | 4-6h |
| Day 1-2 | Worker 开发 + remove.bg API 接入 | 2-3h |
| Day 2 | Cloudflare 部署 + 域名配置 | 1-2h |
| Day 2-3 | 测试 + Bug 修复 + SEO 优化 | 2-3h |
| **合计** | **MVP 上线** | **约 2-3 天** |

---

## 九、待确认事项

- [ ] 产品域名确认（是否已有域名？）
- [ ] remove.bg API Key 申请（https://www.remove.bg/api）
- [ ] Cloudflare 账号（是否已有？）
- [ ] 产品名/品牌名最终确认
- [ ] 是否需要 Google Analytics 或其他统计工具？

---

*文档版本 v0.1，待评审确认后进入开发阶段。*
