/**
 * populate-contact.js
 * 来源：contact.html 第35-101行
 * 内容：联系我们标题 + 联系方式 + 合作伙伴标签
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = 'localhost';
const PORT = 1337;

const data = {
  data: {
    introTitle: '聯繫我們',                              // HTML第36行
    introText: '無論您身處出海的哪一階段，我們皆以專業判斷與協同能力，為企業提供穩健而長期的顧問支持。',  // HTML第37行
    contactEmail: 'contact@nanyuhengdao.com',           // HTML第46行
    contactPhone: '+8613423849513',                     // HTML第50行（只取电话本号）
    contactWechat: '5311667',                           // HTML第50行（微信：5311667）
    contactAddressCN: '深圳市南山區科技園',             // HTML第54行
    contactAddressTH: '泰國曼谷隆披尼區',              // HTML第58行
    partnersTitle: '合作夥伴',                           // HTML第65行
    metaTitle: '聯繫我們 - 埃森国际商务咨询有限公司',  // HTML第6行
    metaDescription: '聯繫埃森國際商務諮詢，了解出海東南亞的專業顧問支持服務。'
  }
};

function put(path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = http.request({ hostname: HOST, port: PORT, path, method: 'PUT',
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
  console.log('写入 contact-page...');
  const result = await put('/api/contact-page', data);
  if (result.status === 200 || result.status === 201) {
    console.log('✅ contact-page 写入成功！');
  } else {
    console.log('❌ 失败:', result.status, JSON.stringify(result.body));
  }
}

main();
