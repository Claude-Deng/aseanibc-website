/**
 * populate-media-sources.js
 * 来源：news-sources.html 第306-724行
 *
 * 字段对照：
 * - name: 媒体名称
 * - slug: URL别名
 * - type: domestic | international
 * - region: 地区枚举
 * - category: 类型（用于显示，如"中央級黨報"）
 * - url: 媒体网站链接
 * - displayOrder: 排序
 */

const http = require('http');

const API_TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const mediaSources = [
  // ===================== 国内媒体 =====================
  // 北京市
  { name: '人民日報', slug: 'people-daily', type: 'domestic', region: 'beijing', category: '中央級黨報', url: 'http://paper.people.com.cn/', displayOrder: 1 },
  { name: '北京日報', slug: 'beijing-daily', type: 'domestic', region: 'beijing', category: '地方黨報', url: 'https://www.takefoto.cn/', displayOrder: 2 },
  { name: '新京報', slug: 'bj-news', type: 'domestic', region: 'beijing', category: '綜合日報', url: 'http://epaper.bjnews.com.cn/', displayOrder: 3 },
  { name: '環球時報', slug: 'global-times', type: 'domestic', region: 'beijing', category: '國際新聞', url: 'https://paper.huanqiu.com/', displayOrder: 4 },
  { name: '中國青年報', slug: 'china-youth', type: 'domestic', region: 'beijing', category: '青年媒體', url: 'http://zqb.cyol.com/', displayOrder: 5 },
  { name: '中國日報', slug: 'china-daily', type: 'domestic', region: 'beijing', category: '英文報紙', url: 'http://www.chinadaily.com.cn', displayOrder: 6 },
  { name: '光明日報', slug: 'guangming-daily', type: 'domestic', region: 'beijing', category: '知識分子', url: 'http://epaper.gmw.cn/gmrb/', displayOrder: 7 },

  // 上海市
  { name: '上海日報', slug: 'shanghai-daily', type: 'domestic', region: 'shanghai', category: '英文日報', url: 'https://www.shine.cn/', displayOrder: 10 },
  { name: '新民晚報', slug: 'xinmin-evening', type: 'domestic', region: 'shanghai', category: '綜合晚報', url: 'https://paper.xinmin.cn/', displayOrder: 11 },
  { name: '新聞晨報', slug: 'morning-news', type: 'domestic', region: 'shanghai', category: '都市晨報', url: 'http://ep.shxwcb.com/', displayOrder: 12 },
  { name: '第一財經', slug: 'yicai', type: 'domestic', region: 'shanghai', category: '財經媒體', url: 'https://www.yicai.com/epaper/pc/', displayOrder: 13 },
  { name: '上海證券報', slug: 'shanghai-securities', type: 'domestic', region: 'shanghai', category: '證券財經', url: 'http://paper.cnstock.com/', displayOrder: 14 },
  { name: '青年報', slug: 'qingnianbao', type: 'domestic', region: 'shanghai', category: '青年媒體', url: 'http://www.why.com.cn/', displayOrder: 15 },

  // 广东省
  { name: '南方日報', slug: 'nanfang-daily', type: 'domestic', region: 'guangdong', category: '省級黨報', url: 'http://epaper.southcn.com/', displayOrder: 20 },
  { name: '羊城晚報', slug: 'yangcheng-evening', type: 'domestic', region: 'guangdong', category: '綜合晚報', url: 'http://www.ycwb.com/', displayOrder: 21 },
  { name: '南方都市報', slug: 'nanfang-city', type: 'domestic', region: 'guangdong', category: '都市報', url: 'http://epaper.oeeee.com/', displayOrder: 22 },
  { name: '深圳特區報', slug: 'shenzhen-special', type: 'domestic', region: 'guangdong', category: '地方黨報', url: 'http://www.sznews.com/', displayOrder: 23 },
  { name: '21世紀經濟', slug: '21st-century', type: 'domestic', region: 'guangdong', category: '財經媒體', url: 'http://www.21cbh.com/', displayOrder: 24 },

  // 江苏省
  { name: '新華日報', slug: 'xinhua-daily', type: 'domestic', region: 'other', category: '省級黨報', url: 'http://epaper.jschina.com.cn/', displayOrder: 30 },
  { name: '揚子晚報', slug: 'yangtse-evening', type: 'domestic', region: 'other', category: '綜合晚報', url: 'http://epaper.yangtse.com/', displayOrder: 31 },

  // 浙江省
  { name: '浙江日報', slug: 'zhejiang-daily', type: 'domestic', region: 'other', category: '省級黨報', url: 'http://www.zjnews.com.cn/', displayOrder: 40 },
  { name: '錢江晚報', slug: 'qianjiang-evening', type: 'domestic', region: 'other', category: '綜合晚報', url: 'http://www.qjwb.com.cn/', displayOrder: 41 },
  { name: '杭州日報', slug: 'hangzhou-daily', type: 'domestic', region: 'other', category: '地方黨報', url: 'http://www.hznews.com/', displayOrder: 42 },
  { name: '經濟觀察報', slug: 'economic-observer', type: 'domestic', region: 'other', category: '財經媒體', url: 'http://www.eeo.com.cn/', displayOrder: 43 },

  // 其他省市
  { name: '天津日報', slug: 'tianjin-daily', type: 'domestic', region: 'other', category: '天津', url: 'http://epaper.tianjinwe.com/', displayOrder: 50 },
  { name: '重慶晚報', slug: 'chongqing-evening', type: 'domestic', region: 'other', category: '重慶', url: 'http://epaper.cqwb.com.cn/', displayOrder: 51 },
  { name: '四川日報', slug: 'sichuan-daily', type: 'domestic', region: 'other', category: '四川', url: 'http://epaper.scdaily.cn/', displayOrder: 52 },
  { name: '湖北日報', slug: 'hubei-daily', type: 'domestic', region: 'other', category: '湖北', url: 'http://epaper.hubeidaily.net/', displayOrder: 53 },
  { name: '湖南日報', slug: 'hunan-daily', type: 'domestic', region: 'other', category: '湖南', url: 'http://epaper.voc.com.cn/', displayOrder: 54 },
  { name: '河南日報', slug: 'henan-daily', type: 'domestic', region: 'other', category: '河南', url: 'http://epaper.dahe.cn/', displayOrder: 55 },
  { name: '大眾日報', slug: 'dazhong-daily', type: 'domestic', region: 'other', category: '山東', url: 'http://epaper.sdnews.com/', displayOrder: 56 },
  { name: '山西日報', slug: 'shanxi-daily', type: 'domestic', region: 'other', category: '山西', url: 'http://epaper.sxrb.com/', displayOrder: 57 },
  { name: '福建日報', slug: 'fujian-daily', type: 'domestic', region: 'other', category: '福建', url: 'http://epaper.nfdaily.cn/', displayOrder: 58 },
  { name: '吉林日報', slug: 'jilin-daily', type: 'domestic', region: 'other', category: '吉林', url: 'http://epaper.cnjiwang.com/', displayOrder: 59 },

  // ===================== 国际媒体 =====================
  // 美国
  { name: '紐約時報', slug: 'new-york-times', type: 'international', region: 'usa', category: '綜合日報', url: 'https://www.nytimes.com', displayOrder: 100 },
  { name: '華爾街日報', slug: 'wall-street-journal', type: 'international', region: 'usa', category: '財經日報', url: 'https://www.wsj.com/', displayOrder: 101 },
  { name: '華盛頓郵報', slug: 'washington-post', type: 'international', region: 'usa', category: '綜合日報', url: 'https://www.washingtonpost.com/', displayOrder: 102 },
  { name: 'CNN', slug: 'cnn', type: 'international', region: 'usa', category: '電視新聞', url: 'https://www.cnn.com', displayOrder: 103 },

  // 英国
  { name: 'BBC', slug: 'bbc', type: 'international', region: 'uk', category: '公共廣播', url: 'https://www.bbc.com/', displayOrder: 110 },
  { name: '泰晤士報', slug: 'the-times', type: 'international', region: 'uk', category: '綜合日報', url: 'https://www.thetimes.co.uk/', displayOrder: 111 },
  { name: '衛報', slug: 'the-guardian', type: 'international', region: 'uk', category: '綜合日報', url: 'https://www.theguardian.com/international', displayOrder: 112 },
  { name: '金融時報', slug: 'financial-times', type: 'international', region: 'uk', category: '財經日報', url: 'https://www.ft.com/', displayOrder: 113 },
  { name: '經濟學人', slug: 'the-economist', type: 'international', region: 'uk', category: '週刊', url: 'https://www.economist.com/', displayOrder: 114 },

  // 日本
  { name: '朝日新聞', slug: 'asahi-shimbun', type: 'international', region: 'japan', category: '綜合日報', url: 'https://www.asahi.com/', displayOrder: 120 },
  { name: '讀賣新聞', slug: 'yomiuri-shimbun', type: 'international', region: 'japan', category: '綜合日報', url: 'https://www.yomiuri.co.jp/', displayOrder: 121 },
  { name: '每日新聞', slug: 'mainichi-shimbun', type: 'international', region: 'japan', category: '綜合日報', url: 'http://www.mainichi.co.jp', displayOrder: 122 },
  { name: '日本時報', slug: 'japan-times', type: 'international', region: 'japan', category: '英文日報', url: 'https://www.japantimes.co.jp/', displayOrder: 123 },

  // 东南亚
  { name: '聯合早報', slug: 'zaobao', type: 'international', region: 'sea', category: '中文日報', url: 'https://www.zaobao.com/', displayOrder: 130 },
  { name: '海峽時報', slug: 'strait-times', type: 'international', region: 'sea', category: '英文日報', url: 'https://www.straitstimes.com/', displayOrder: 131 },
  { name: '商業時報', slug: 'business-times-sg', type: 'international', region: 'sea', category: '財經日報', url: 'http://www.businesstimes.com.sg/', displayOrder: 132 },
  { name: '曼谷郵報', slug: 'bangkok-post', type: 'international', region: 'sea', category: '英文日報', url: 'https://www.bangkokpost.com/', displayOrder: 133 },
  { name: '星報', slug: 'star-malaysia', type: 'international', region: 'sea', category: '英文日報', url: 'http://thestar.com.my/', displayOrder: 134 },

  // 欧洲其他国家
  { name: '費加羅報', slug: 'le-figaro', type: 'international', region: 'other', category: '綜合日報', url: 'http://www.lefigaro.fr/', displayOrder: 140 },
  { name: '解放報', slug: 'liberation', type: 'international', region: 'other', category: '綜合日報', url: 'https://www.liberation.fr/', displayOrder: 141 },
  { name: '世界報', slug: 'die-welt', type: 'international', region: 'other', category: '綜合日報', url: 'https://www.welt.de/', displayOrder: 142 },
  { name: '南德日報', slug: 'suddeutsche-zeitung', type: 'international', region: 'other', category: '綜合日報', url: 'https://www.sueddeutsche.de', displayOrder: 143 },
  { name: '莫斯科時報', slug: 'moscow-times', type: 'international', region: 'other', category: '英文日報', url: 'https://www.themoscowtimes.com/', displayOrder: 144 },

  // 澳洲与加拿大
  { name: '悉尼晨鋒報', slug: 'sydney-morning-herald', type: 'international', region: 'other', category: '綜合日報', url: 'http://www.smh.com.au/', displayOrder: 150 },
  { name: '澳洲金融評論', slug: 'afr', type: 'international', region: 'other', category: '財經日報', url: 'http://www.afr.com.au/', displayOrder: 151 },
  { name: '環球郵報', slug: 'globe-and-mail', type: 'international', region: 'other', category: '綜合日報', url: 'https://www.theglobeandmail.com/', displayOrder: 152 },
  { name: '多倫多星報', slug: 'toronto-star', type: 'international', region: 'other', category: '綜合日報', url: 'https://www.thestar.com/', displayOrder: 153 },
];

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const opts = {
      hostname: 'localhost',
      port: 1337,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    if (bodyStr) opts.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  console.log(`开始写入 ${mediaSources.length} 条信息来源...\n`);
  let success = 0, failed = 0;

  for (const item of mediaSources) {
    const res = await apiRequest('POST', '/api/media-sources', { data: item });
    if (res.status === 200 || res.status === 201) {
      console.log(`✅ ${item.type === 'domestic' ? '[国内]' : '[国际]'} ${item.name} (${item.region})`);
      success++;
    } else {
      const msg = res.data?.error?.message || JSON.stringify(res.data).substring(0, 100);
      console.log(`❌ ${item.name}: ${res.status} - ${msg}`);
      failed++;
    }
  }

  console.log(`\n完成：${success}成功，${failed}失败`);
}

main().catch(console.error);
