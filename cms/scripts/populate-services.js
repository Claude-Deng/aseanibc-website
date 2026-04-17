/**
 * Service 内容写入脚本
 *
 * 【重要】本脚本内容全部对照 services.html 原文逐字录入
 * 不允许猜测、不允许省略、不允许省略任何字段
 *
 * HTML 原文来源：services.html lines 42-183
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

// 3个服务的完整内容（逐字照抄 HTML 原文）
const services = [
  {
    name: '出海判斷',
    slug: 'chu-hai-pan-duan',
    subtitle: '避免方向性錯誤',
    highlight: '在企業正式投入資源進入東南亞市場前，我們提供系統化的前行性判斷支持，核心是幫企業看清楚、找準定位，減少錯誤成本，避免方向性錯誤',
    detailItems: [
      {
        title: '市場進入適配性分析',
        content: '含競爭態勢及政策、規章制度、商業模式、消費需求'
      },
      {
        title: '商業模式與風險配套評估',
        content: '評估現有模式在目標國的可行性與風險程度方向'
      },
      {
        title: '合規與結構初步評估',
        content: '股權架構、資金流路徑設置、稅務規劃的初步建議'
      },
      {
        title: '落地路徑與成本測算',
        content: '設準企業落地地點與管理比，精準測算初期投入與運營成本'
      }
    ],
    advantagesTitle: '服務優勢',
    advantagesSubtitle: '區別於傳統代辦機構，我們的服務更具專業性、系統性和適應性',
    advantages: [
      {
        icon: null,
        title: '一個主體負責到底',
        description: '無需跨接，專屬項目團隊全程跟進，所有問題一個入口解決'
      },
      {
        icon: null,
        title: '中國視角+本地洞察',
        description: '熟悉中國企業決策邏輯，更懂當地合規與運營，真正雙向理解'
      },
      {
        icon: null,
        title: '按需定製服務',
        description: '不強推固定服務包，根據企業實際需求定製專屬服務方案'
      }
    ]
  },
  {
    name: '落地推進',
    slug: 'luo-di-tui-jin',
    subtitle: '高效合規落地',
    highlight: '在確認科學的出海路徑後，我們作為「協同中樞」，統籌協調所有落地資源，即控項目推進節奏與關鍵節點，確保企業高效、合規完成本地落地，結構多國對接',
    detailItems: [
      {
        title: '企業註冊統籌',
        content: '本地公司註冊、外資審案、牌照申請等核心流程全流程協調'
      },
      {
        title: '本地價質資源對接',
        content: '財稅、法務、銀行、物流、倉儲、報關等第三方專業機構'
      },
      {
        title: '產業資源匹配',
        content: '目標國合作企業、產業園區、供應鏈上下游資源精準對接'
      },
      {
        title: '全流程節點把控',
        content: '幫德勒估落地計劃表，實時同步進度，解決突發問題'
      }
    ],
    advantagesTitle: '服務優勢',
    advantagesSubtitle: '區別於傳統代辦機構，我們的服務更具專業性、系統性和適應性',
    advantages: [
      {
        icon: null,
        title: '一個主體負責到底',
        description: '無需跨接，專屬項目團隊全程跟進，所有問題一個入口解決'
      },
      {
        icon: null,
        title: '中國視角+本地洞察',
        description: '熟悉中國企業決策邏輯，更懂當地合規與運營，真正雙向理解'
      },
      {
        icon: null,
        title: '按需定製服務',
        description: '不強推固定服務包，根據企業實際需求定製專屬服務方案'
      }
    ]
  },
  {
    name: '法商支持',
    slug: 'fa-shang-zhi-chi',
    subtitle: '把控潛在風險',
    highlight: '東南亞市場的出海風險，往往並非來自顯性問題，而是隱藏在商業結構與合規操作中。我們將法商融合，在商業性質的同時，嚴控準把控每一步的合規與法律風險',
    detailItems: [
      {
        title: '本地政策深度解讀',
        content: '法律法規、稅務政策、外資限制、行業監管要求實時更新'
      },
      {
        title: '跨境結構設計',
        content: '定製最優的商業與法律架構，合規性架構、跨境資金合規方案'
      },
      {
        title: '知識產權保護',
        content: '商標、專利、著作權的本地註冊與跨境保護策略'
      },
      {
        title: '合規爭議處理',
        content: '協調本地法律資源，處理勞資糾紛、合規投訴等突發問題'
      }
    ],
    advantagesTitle: '服務優勢',
    advantagesSubtitle: '區別於傳統代辦機構，我們的服務更具專業性、系統性和適應性',
    advantages: [
      {
        icon: null,
        title: '一個主體負責到底',
        description: '無需跨接，專屬項目團隊全程跟進，所有問題一個入口解決'
      },
      {
        icon: null,
        title: '中國視角+本地洞察',
        description: '熟悉中國企業決策邏輯，更懂當地合規與運營，真正雙向理解'
      },
      {
        icon: null,
        title: '按需定製服務',
        description: '不強推固定服務包，根據企業實際需求定製專屬服務方案'
      }
    ]
  }
];

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
  console.log('=== Service 内容写入 ===\n');
  console.log('【逐字对照 HTML 原文：services.html lines 42-183】\n');
  console.log(`共 ${services.length} 个服务：\n`);

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    console.log(`[${i + 1}] ${s.name}`);
    console.log(`    subtitle: ${s.subtitle}`);
    console.log(`    highlight: ${s.highlight.substring(0, 30)}...`);
    console.log(`    detailItems: ${s.detailItems.length}个`);
    s.detailItems.forEach(d => console.log(`      - ${d.title}`));
    console.log(`    advantages: ${s.advantages.length}个`);
    s.advantages.forEach(a => console.log(`      - ${a.title}`));
    console.log('');
  }

  console.log('--- 开始写入 ---\n');

  // 先删除已有数据
  const listRes = await apiRequest('GET', '/api/services?pagination[pageSize]=100');
  if (listRes.body?.data && listRes.body.data.length > 0) {
    console.log(`发现 ${listRes.body.data.length} 条旧数据，先删除...`);
    for (const item of listRes.body.data) {
      await apiRequest('DELETE', `/api/services/${item.id}`);
    }
    console.log('删除完成\n');
  }

  // 逐个创建
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    const payload = { data: s };
    const res = await apiRequest('POST', '/api/services', payload);

    if (res.status === 200 || res.status === 201) {
      console.log(`✅ [${i + 1}] ${s.name} 写入成功 (id=${res.body.data?.id})`);
    } else {
      console.log(`❌ [${i + 1}] ${s.name} 失败: ${res.status}`);
      console.log(JSON.stringify(res.body, null, 2));
    }
  }
}

main().catch(console.error);
