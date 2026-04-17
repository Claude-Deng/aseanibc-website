/**
 * 调试脚本：测试 HomePage 单例 PUT API
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

// 构造请求体：{ data: {...} }
const requestBody = {
  data: {
    slogan: '以判斷立身，以協同致遠',
    sloganSubtitle: 'Clarity in Decision. Strength in Collaboration',
    servicesTitle: '服務內容',
    servicesSubtitle: 'SERVICES',
    bannerImage: null,
    coreValuesImage: null,
    coreValues: [
      {
        icon: 'bi-lightbulb',
        title: '跨境合規',
        description: '熟悉各國法規，規避風險'
      },
      {
        icon: 'bi-globe-americas',
        title: '本地資源',
        description: '東南亞本地團隊，快速響應'
      },
      {
        icon: 'bi-handshake',
        title: '長期夥伴',
        description: '不只是服務商，是您的合作夥伴'
      },
      {
        icon: 'bi-shield-check',
        title: '合規護航',
        description: '協助您遵守各國監管規定'
      }
    ]
  }
};

const bodyStr = JSON.stringify(requestBody);
console.log('Request body:', bodyStr.substring(0, 200) + '...');

const options = {
  hostname: 'localhost',
  port: 1337,
  path: '/api/home-page',
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(bodyStr)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      console.log('Response:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(bodyStr);
req.end();
