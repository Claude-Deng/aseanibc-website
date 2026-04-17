/**
 * HomePage 内容写入脚本 v2
 *
 * 【重要】本脚本内容全部对照 index.html 原文逐字录入
 * 不允许猜测、不允许省略、不允许省略任何字段
 *
 * HTML 原文来源：index.html lines 39-74
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const payload = {
  data: {
    slogan: '以判斷立身，以協同致遠',
    sloganSubtitle: 'Clarity in Decision. Strength in Collaboration',
    servicesTitle: '服務內容',
    servicesSubtitle: 'SERVICES',
    bannerImage: null,
    coreValuesImage: null,
    coreValues: [
      {
        icon: null,
        title: '區域化組構',
        description: '從區域整體出發，建立可複製且可擴展的商業結'
      },
      {
        icon: null,
        title: '精準驅動',
        description: '以精進決策為起點，確保每一步落地皆有依'
      },
      {
        icon: null,
        title: '法商結合',
        description: '讓法律與商業並行，確保速度不會犧牲安全性'
      },
      {
        icon: null,
        title: '在地顧問',
        description: '贴近在地實務運作，成為企業值得信赖的合作夥伴'
      }
    ]
  }
};

function apiRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    if (bodyStr) options.headers['Content-Length'] = Buffer.byteLength(bodyStr);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  console.log('=== HomePage 内容写入 v2 ===\n');
  console.log('【逐字对照 HTML 原文】\n');

  console.log('slogan:', payload.data.slogan);
  console.log('sloganSubtitle:', payload.data.sloganSubtitle);
  console.log('servicesTitle:', payload.data.servicesTitle);
  console.log('servicesSubtitle:', payload.data.servicesSubtitle);
  console.log('coreValues[4]:');
  payload.data.coreValues.forEach((v, i) => {
    console.log(`  [${i + 1}] title: ${v.title}`);
    console.log(`      description: ${v.description}`);
  });
  console.log('');
  console.log('bannerImage:', payload.data.bannerImage, '← 需手动上传');
  console.log('coreValuesImage:', payload.data.coreValuesImage, '← 需手动上传');
  console.log('');

  const res = await apiRequest('PUT', '/api/home-page', payload);

  if (res.status === 200 || res.status === 201) {
    console.log('✅ 写入成功！');
    console.log('  slogan:', res.body.data.slogan);
    console.log('  sloganSubtitle:', res.body.data.sloganSubtitle);
    console.log('  servicesTitle:', res.body.data.servicesTitle);
    console.log('  servicesSubtitle:', res.body.data.servicesSubtitle);
  } else {
    console.log('❌ 失败:', res.status, JSON.stringify(res.body, null, 2));
  }
}

main().catch(console.error);
