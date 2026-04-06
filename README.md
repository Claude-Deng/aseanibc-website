# 埃森国际商务咨询有限公司 - 官方網站

## 項目說明
這是一個靜態網站，包含公司介紹、服務內容、項目經驗、團隊介紹和聯繫方式等頁面。

## 文件結構
```
├── index.html              # 首頁
├── about.html              # 關於我們
├── services.html           # 服務內容
├── cases.html              # 項目經驗
├── team.html               # 團隊介紹（19位成員）
├── contact.html            # 聯繫我們
├── events.html             # 出海活動列表
├── event-copenhagen.html   # 活動詳情：哥本哈根龍舟文化節
├── event-summer-camp.html  # 活動詳情：費城名校夏令營
├── event-nz-investment.html # 活動詳情：新西蘭光伏投資
├── event-tcm-forum.html    # 活動詳情：中歐論壇暨塞納博覽會
├── style.css               # 全局樣式表
├── indexPic/               # 首頁圖片資源
├── servicePic/             # 服務內容圖片資源
├── casePic/                # 項目經驗圖片資源
├── teamPic/                # 團隊介紹圖片資源（19張頭像）
└── eventPic/               # 出海活動圖片資源
    ├── copenhagen-1~4.jpg  # 哥本哈根活動輪播圖
    ├── summer-camp-1~4.jpg # 夏令營活動輪播圖
    ├── nz-1~6.jpg          # 新西蘭投資活動輪播圖
    ├── tcm-1~6.jpg         # 中歐論壇活動輪播圖
    └── thumb-*.jpg         # 活動列表縮略圖
```

## 團隊介紹頁面（team.html）

### 團隊結構（共19人）
- **核心管理團隊**（3人）：戰略與資源協同顧問、跨境與公司法律顧問、中國法律顧問
- **香港團隊**（2人）：跨境商務高級顧問、東南亞商務顧問
- **美國團隊**（3人）：跨境法務顧問、法商合規顧問、東南亞市場高級顧問
- **東南亞本地顧問**（5人）：泰國、越南、新加坡、印尼商務顧問
- **歐洲團隊**（6人）：知識產權、房地產投資、競爭法、國際併購、歐盟合規等領域顧問

### 功能特性
- 響應式卡片佈局（桌面/平板/手機適配）
- 圓形頭像顯示（object-fit: cover）
- 點擊展開/收起詳細介紹
- 滾動進場動畫效果
- 漢堡菜單（移動端）

## 本地預覽

### 方法 1: 使用 Python 內建服務器
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
然後在瀏覽器訪問: http://localhost:8000

### 方法 2: 使用 Node.js (需要先安裝 http-server)
```bash
# 安裝 http-server
npm install -g http-server

# 啟動服務器
http-server -p 8000
```
然後在瀏覽器訪問: http://localhost:8000

### 方法 3: 直接打開
直接雙擊 `index.html` 文件在瀏覽器中打開

## 部署

### 部署到 Netlify
1. 將項目推送到 GitHub
2. 在 Netlify 中連接 GitHub 倉庫
3. 設置構建命令為空（靜態網站無需構建）
4. 設置發布目錄為根目錄 `/`
5. 點擊部署

### 部署到 Vercel
1. 將項目推送到 GitHub
2. 在 Vercel 中導入項目
3. 無需配置，直接部署

### 部署到 GitHub Pages
1. 將項目推送到 GitHub
2. 在倉庫設置中啟用 GitHub Pages
3. 選擇主分支作為源
4. 網站將在 `https://username.github.io/repository-name` 上線

## 技術棧
- HTML5
- CSS3（CSS 變量、Flexbox、Grid、響應式斷點）
- 原生 JavaScript（IntersectionObserver、事件委託）
- 響應式設計（移動優先策略）
- Git 版本控制

## 瀏覽器支持
- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 維護說明
- 所有頁面共用 `style.css` 樣式文件
- 圖片資源按頁面分類存放在不同文件夾
- 導航欄和頁腳在每個頁面中獨立維護
- 團隊成員頭像統一使用 1:1 比例，顯示為圓形（通過 CSS `border-radius: 50%` 實現）

## 更新日誌

### 2026-04-06
- ✅ 重構團隊介紹頁面（team.html），從10人擴展到19人
- ✅ 新增香港團隊（2人）、美國團隊（3人）、歐洲團隊（6人）
- ✅ 添加19張團隊成員頭像到 `teamPic/` 目錄
- ✅ 修復頭像圓形顯示樣式（所有響應式斷點）
- ✅ 優化響應式佈局和交互體驗
