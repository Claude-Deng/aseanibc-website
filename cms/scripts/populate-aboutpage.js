/**
 * AboutPage 内容写入脚本
 *
 * 【重要】本脚本内容全部对照 about.html 原文逐字录入
 * 不允许猜测、不允许省略、不允许省略任何字段
 *
 * HTML 原文来源：about.html lines 36-84
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const payload = {
  data: {
    content: `<h2>公司簡介｜埃森國際商務諮詢有限公司</h2>
<p>埃森國際商務諮詢有限公司是一家面向東南亞市場的跨境商務諮詢與項目落地顧問機構，專注於協助中國企業在進入東南亞過程中，建立清晰判斷、穩健結構與可持續的本地協同能力。</p>
<p>隨著中國企業出海從探索期走向深水區，企業所面臨的挑戰已不再僅限於單一國家的設立或代辦問題，而是涉及區域市場選擇、商業模式適配、法商結構設計及長期運營風險控制等複合性議題。埃森國際以區域化視角切入，避免單點決策帶來的結構性風險，協助企業在複雜的東南亞市場環境中做出更為理性的進入與發展判斷。</p>
<p>公司服務涵蓋出海可行性判斷、落地路徑設計、本地資源協同、法商結構支持以及長期顧問服務等核心環節。我們不以事務代辦為主要價值，而是以判斷與協同為核心，協助客戶在不同發展階段做出更合適的決策，並在關鍵節點引入相應的專業資源與執行力量。</p>
<p>埃森國際的服務覆蓋東南亞多個國家與地區，包括泰國、越南、馬來西亞、新加坡、印尼等主要市場。具體進入國家與路徑，將依據客戶所處行業、發展階段與風險承受能力進行綜合評估與定制化設計。</p>
<p>我們致力於成為企業值得信賴的長期在地顧問夥伴，陪伴客戶從進入市場，到穩定運營，並逐步完成區域化布局與能力沉澱。</p>

<h2>工作定位</h2>
<p>埃森國際商務諮詢有限公司定位於面向東南亞市場的跨境商務判斷與落地協同顧問。我們的核心角色並非執行代辦者，而是站在企業決策層視角，協助客戶在進入與布局東南亞市場的關鍵節點，做出更理性、可持續的判斷與選擇。</p>
<p>在複雜且高度差異化的東南亞市場環境中，企業所面臨的風險往往並非來自單一操作失誤，而源於早期判斷偏差與結構設計不當。埃森國際以區域化視角切入，協助客戶從整體層面理解市場、結構與節奏，避免短期決策對長期發展造成限制。</p>

<h2>工作方法</h2>
<p>埃森國際採取以<strong>判斷先行、結構導向、協同推進</strong>為核心的工作方法。</p>
<p>在項目啟動初期，我們首先聚焦於市場進入的可行性與適配性判斷，包括目標國家選擇、商業模式匹配、合規與法商結構風險等關鍵問題，協助客戶在執行前建立清晰認知。</p>
<p>在確認進入路徑後，我們並不替代執行，而是作為協同中樞，協助客戶對接並整合當地所需的專業資源與執行力量，確保項目在推進過程中保持節奏可控、風險可見。</p>
<p>在企業已進入市場或進行區域擴展階段，我們提供持續的顧問支持，定期協助客戶進行策略與結構層面的複盤與調整，應對市場變化與新風險，支持企業建立穩定、可複製的區域化運營能力。</p>

<h2>核心原則</h2>
<ul>
  <li>判斷先於執行</li>
  <li>結構重於速度</li>
  <li>法商並行，風險可控</li>
  <li>以長期協同替代一次性交付</li>
</ul>
<p>埃森國際致力於成為企業在東南亞市場中，可信賴、理性且長期的在地顧問夥伴。</p>`,
    regionsTitle: '覆蓋區域（東南亞）',
    regions: [
      { country: '泰國（區域核心首選）', cities: null },
      { country: '越南', cities: null },
      { country: '馬來西亞', cities: null },
      { country: '新加坡', cities: null },
      { country: '柬埔寨與老撾', cities: null }
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
  console.log('=== AboutPage 内容写入 ===\n');
  console.log('【逐字对照 HTML 原文：about.html lines 36-84】\n');

  // 显示 content 关键段落
  const c = payload.data.content;
  const chapters = [
    '公司簡介｜埃森國際商務諮詢有限公司',
    '工作定位',
    '工作方法',
    '核心原則'
  ];
  chapters.forEach(t => {
    const idx = c.indexOf(t);
    if (idx >= 0) console.log('  含章节：' + t);
  });

  console.log('  regionsTitle:', payload.data.regionsTitle);
  console.log('  regions:', payload.data.regions.length + '个国家');
  payload.data.regions.forEach((r, i) => console.log('    [' + (i + 1) + '] ' + r.country));
  console.log('');

  const res = await apiRequest('PUT', '/api/about-page', payload);

  if (res.status === 200 || res.status === 201) {
    console.log('✅ 写入成功！');
    console.log('  content 长度:', res.body.data.content?.length ?? 0, '字符');
    console.log('  regionsTitle:', res.body.data.regionsTitle);
    console.log('  regions 条数:', res.body.data.regions?.length ?? 0);
  } else {
    console.log('❌ 失败:', res.status, JSON.stringify(res.body, null, 2));
  }
}

main().catch(console.error);
