/**
 * populate-events.js
 * 来源：events.html（lines 42-108）
 * 功能：写入 events 列表页的4个活动基础信息
 *
 * 字段：title / category / eventDate / location / status / overview / scale / coverImage
 */

const http = require('http');

const API = 'http://localhost:1337/api';
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const events = [
  {
    title: '哥本哈根龍舟文化節暨企業家考察團',
    category: 'business',
    eventDate: '2026年5月29-31日',
    location: '丹麥哥本哈根南港Københavns Sydhavn',
    status: 'upcoming',
    scale: '預計10萬+參與者',
    overview: '央視策劃、政府背書的北歐高端商業對接活動，參與人數近10萬，媒體曝光率1億+，助力企業開拓歐洲市場。'
  },
  {
    title: '美國費城名校夏令營',
    category: 'education',
    eventDate: '每年暑期',
    location: '美國費城、纽约、华盛顿',
    status: 'upcoming',
    scale: '5-10人精品小團',
    overview: '以賓大為核心的藤校資源，8-15歲精英教育體驗，涵蓋AI與STEM科技探索、跨文化交流等課程模塊。貳至陸周。'
  },
  {
    title: '新西蘭光伏+儲能投資+移民項目',
    category: 'investment',
    eventDate: '常年招募',
    location: '新西蘭',
    status: 'ongoing',
    scale: '500萬紐幣起',
    overview: '綠色能源投資+新西蘭永居身份，一步到位。結合當地政策紅利與牌照壁壘，提供投資與身份雙重保障。'
  },
  {
    title: '中歐論壇暨塞納博覽會',
    category: 'forum',
    eventDate: '2025年舉辦',
    location: '法國巴黎',
    status: 'ended',
    scale: '高規格國際交流',
    overview: '以中醫藥出海為核心議題的高規格國際交流平台，匯聚中歐政商醫界資源，推動中醫藥全球化發展。'
  }
];

function apiReq(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify({ data }) : undefined;
    const req = http.request({
      hostname: 'localhost',
      port: 1337,
      path: `/api${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { resolve({ raw: d, status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  console.log('=== 写入 Event 列表（4个活动） ===\n');

  // 先获取现有活动，清理测试数据
  const existing = await apiReq('GET', '/events?pagination[limit]=100');
  if (existing.data && existing.data.length > 0) {
    console.log(`发现 ${existing.data.length} 个已有活动，开始清理...`);
    for (const ev of existing.data) {
      await apiReq('DELETE', `/events/${ev.id}`);
    }
    console.log('清理完成\n');
  }

  // 写入4个活动
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    console.log(`[${i + 1}/4] 写入：${ev.title}`);
    const res = await apiReq('POST', '/events', ev);
    if (res.data) {
      console.log(`  ✅ 成功，ID=${res.data.id}`);
    } else {
      console.log(`  ❌ 失败：`, JSON.stringify(res.error || res));
    }
  }

  console.log('\n=== 完成 ===');
}

main().catch(console.error);
