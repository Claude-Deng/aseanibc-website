# 埃森国际商务咨询有限公司 - 官方网站

## 项目说明

企业展示网站，后端采用 **Strapi 5 CMS** 管理内容，前端为静态 HTML 页面通过 REST API 动态渲染。

## 文件结构

```
├── index.html              # 首页
├── about.html              # 关于我们
├── services.html           # 服务内容
├── cases.html              # 项目经验（动态）
├── case-detail.html        # 项目详情（动态模板，?type=slug 区分）
├── team.html               # 团队介绍（动态）
├── contact.html            # 联系我们（动态）
├── events.html             # 出海活动列表（动态）
├── event-detail.html       # 活动详情（动态模板，?type=xxx 区分）
├── news-sources.html       # 媒体报道来源
│
├── style.css               # 全局样式表（响应式 575/768/992px）
│
├── indexPic/               # 首页图片（banner + coreValues）
├── servicePic/             # 服务内容图片
├── casePic/                # 项目经验图片（分类图标）
├── teamPic/                # 团队头像（19张）
└── eventPic/               # 活动图片（封面 + 轮播图）
    └── cms/                 # Strapi 5 CMS 项目
        ├── src/api/          # Content Types（Cases/Events/Services等）
        ├── src/components/   # 可复用组件（industries/partners等）
        └── cms/scripts/       # 内容填充脚本（populate-*.js）
```

## 技术架构

### 后端（Strapi 5 CMS）
- **数据库**：SQLite（开发）/ PostgreSQL（生产）
- **端口**：1337
- **内容类型**：
  - `Cases`（案例集合，6条）
  - `Events`（活动集合，4条）
  - `Services`（服务集合，3条）
  - `Partners`（合作伙伴，33条）
  - `TeamMembers`（团队成员，19人）
  - `Testimonials`（客户评价，6条）
  - `MediaSources`（媒体来源，61条）
  - 单例类型：HomePage / AboutPage / CasesPage / ContactPage
- **组件**：industries / caseHighlightCards / eventSection 等

### 前端（静态 HTML）
- **API 调用**：`GET /api/{collection}?populate=*`
- **模式**：静态 HTML + Fetch API，页面无刷新
- **数据绑定**：首页/案例/活动/团队/联系页面全部动态渲染
- **响应式**：移动优先，575/768/992px 三档断点

## 部署说明

### 前端部署
1. VPS 上 clone 仓库
2. 配置 Nginx 静态文件服务（`/` → `public/`）
3. 配置反向代理（`/cms` → `localhost:1337`）

### CMS 部署
```bash
cd cms
npm install
# 配置 .env（PostgreSQL 连接信息）
npm run build
pm2 start npm --name "aseanibc-cms" -- start
```

### .env.production 必填项
```
DATABASE_CLIENT=postgres
DATABASE_HOST=<VPS_IP>
DATABASE_PORT=5432
DATABASE_NAME=aseanibc_cms
DATABASE_USERNAME=<用户>
DATABASE_PASSWORD=<密码>

APP_KEYS=<重新生成>
API_TOKEN_SALT=<重新生成>
ADMIN_JWT_SECRET=<重新生成>
TRANSFER_TOKEN_SALT=<重新生成>
JWT_SECRET=<重新生成>

STRAPI_URL=https://cms.aseanibc.com
```

## 本地开发

### 前提
```bash
# 启动 Strapi CMS（端口 1337）
cd cms && npm run develop

# 启动前端（任意静态服务器，端口 8000）
python3 -m http.server 8000
```

### CMS 数据填充
```bash
node cms/scripts/populate-homepage.js
node cms/scripts/populate-about-page.js
node cms/scripts/populate-cases-page.js
node cms/scripts/populate-cases.js
node cms/scripts/populate-events.js
# ... 其他 populate 脚本
```

### 前端本地预览
```bash
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000
```

## 更新日志

### 2026-04-17
- ✅ M7 完成：前端页面全部接入 Strapi CMS API，动态渲染
- ✅ 案例详情页统一改为动态模板 `case-detail.html?type=slug`
- ✅ 活动详情页统一改为动态模板 `event-detail.html?type=xxx`
- ✅ 6个案例跳转页 + 4个活动跳转页改为 `<meta refresh>`
- ✅ news-sources.html 新增页面
- ✅ 修复 Bug：cases.html industries 字段名（title→industry）
- ✅ 修复 Bug：case-detail.html 行业标签字段名
- ✅ 修复 Bug：event-detail.html contactInfo 重复渲染
- ✅ Strapi CMS 项目纳入版本管理

### 2026-04-16
- ✅ CMS 图片上传全部完成（65张图片）

### 2026-04-06
- ✅ 团队介绍页从10人扩展到19人
- ✅ 新增香港/美国/欧洲团队
- ✅ 全部响应式改造完成
