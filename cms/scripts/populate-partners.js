/**
 * populate-partners.js
 * 来源：contact.html 第68-101行
 * 合作伙伴标签墙，共32个
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = 'localhost';
const PORT = 1337;

const partners = [
  // media (媒体)
  { name: '人民日報', category: 'media' },
  { name: '央視頻', category: 'media' },
  { name: '新華社', category: 'media' },
  { name: 'CNN', category: 'media' },
  { name: '丹麥哥本哈根郵報', category: 'media' },
  { name: 'Youtube', category: 'media' },
  { name: 'TikTok', category: 'media' },
  { name: '咪咕體育', category: 'media' },
  { name: '龍域網', category: 'media' },
  { name: '北歐時報', category: 'media' },
  { name: '河南衛視', category: 'media' },
  // chamber (商会)
  { name: '丹麥華商總會', category: 'chamber' },
  { name: '丹中茶文化協會', category: 'chamber' },
  { name: '丹麥華人藝術總會', category: 'chamber' },
  { name: '丹麥旅遊文化交流協會', category: 'chamber' },
  { name: '北歐養生旅遊協會', category: 'chamber' },
  { name: '丹中餐飲業總會', category: 'chamber' },
  { name: '丹中運動文化協會', category: 'chamber' },
  { name: '中醫藥文化大會委員會', category: 'chamber' },
  { name: '中國民族醫藥學會溫泉醫養分會', category: 'chamber' },
  { name: '丹麥中華工商聯合協會', category: 'chamber' },
  { name: '丹麥中國文化交流協會', category: 'chamber' },
  { name: '丹麥傳統文化協會', category: 'chamber' },
  { name: '丹麥旗袍協會', category: 'chamber' },
  // government (政府/组织)
  { name: '哥本哈根龍舟節組委會', category: 'government' },
  { name: '北歐未來浪潮創作者聯盟', category: 'government' },
  // enterprise (企业)
  { name: '絲路集團', category: 'enterprise' },
  { name: '山海圖', category: 'enterprise' },
  { name: '華陽集團', category: 'enterprise' },
  { name: '千鈞體育', category: 'enterprise' },
  { name: '武林風賽事組委會', category: 'enterprise' },
  { name: '中醫藥發展基金', category: 'enterprise' },
  { name: '中國生物醫藥園區', category: 'enterprise' },
];

function post(path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = http.request({ hostname: HOST, port: PORT, path, method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function main() {
  let success = 0, fail = 0;
  for (const p of partners) {
    const result = await post('/api/partners', { data: p });
    if (result.status === 200 || result.status === 201) {
      console.log(`✅ ${p.name}`);
      success++;
    } else {
      console.log(`❌ ${p.name}: ${result.status}`);
      fail++;
    }
  }
  console.log(`\n完成：${success}成功，${fail}失败`);
}

main();
