/**
 * populate-event-components.js
 * 写入 Event 的 logistics 和 highlightCards 组件数据
 * 数据来源：
 *   - 哥本哈根：event-copenhagen.html (lines 207-225 高亮卡片, lines 249-268 展台服务)
 *   - 夏令营：event-summer-camp.html (lines 208-225 课程模块, lines 251-276 住宿保障)
 *   - 新西兰：event-nz-investment.html (lines 209-226 项目方背景, lines 269-293 移民政策)
 *   - 中欧论坛：event-tcm-forum.html (lines 217-232 多维合作, lines 259-284 精准商务匹配)
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

// 四个活动的数据，逐字对照 HTML 原文
const eventsData = [
  {
    id: 9,
    documentId: 'h0gp0blztv7x0063boe71gl0',
    name: '哥本哈根龍舟文化節',
    // highlightCards - 媒體傳播矩陣 (event-copenhagen.html lines 207-225)
    highlightCards: [
      {
        title: '中國媒體',
        icon: '📺',
        description: '30+家',
        content: '人民網、新華網、央視網、中國日報網、環球網等30+家'
      },
      {
        title: '歐洲媒體',
        icon: '🌐',
        description: '20+家',
        content: 'Copenhagen Post、Benzinga、Marketwatch等20+家'
      },
      {
        title: '自媒體傳播',
        icon: '📱',
        description: '平台大V傳播',
        content: 'TikTok、YouTube、Instagram、抖音等平台大V傳播'
      },
      {
        title: '現場直播',
        icon: '🎬',
        description: '央視頻和咪咕體育現場直播龍舟賽',
        content: '央視頻和咪咕體育現場直播龍舟賽'
      }
    ],
    // logistics - 展台服務 (event-copenhagen.html lines 249-268)
    logistics: [
      {
        title: '品牌展示',
        content: '在歐洲最大龍舟文化節上展示企業形象，提升品牌國際知名度'
      },
      {
        title: '產品推廣',
        content: '直接向北歐消費者推廣產品，獲取第一手市場反饋'
      },
      {
        title: '現場銷售',
        content: '活動期間可進行產品現場銷售，直接產生商業收益'
      }
    ]
  },
  {
    id: 10,
    documentId: 'nyadlhas7znn7tk9zvn38pfi',
    name: '費城名校夏令營',
    // highlightCards - 多元課程模塊 (event-summer-camp.html lines 208-225)
    highlightCards: [
      {
        title: 'Python人工智能',
        icon: '💻',
        description: '賓大教授親自授課，智能機器人項目實踐',
        content: '賓大教授親自授課，智能機器人項目實踐'
      },
      {
        title: 'STEM課程',
        icon: '🔬',
        description: '科學、技術、工程、數學綜合培養',
        content: '科學、技術、工程、數學綜合培養'
      },
      {
        title: 'Creative Creations',
        icon: '🎨',
        description: '創客課程，培養創新思維和動手能力',
        content: '創客課程，培養創新思維和動手能力'
      },
      {
        title: '名校學習力培訓',
        icon: '📚',
        description: '學習方法、時間管理、批判性思維訓練',
        content: '學習方法、時間管理、批判性思維訓練'
      }
    ],
    // logistics - 住宿與安全保障 (event-summer-camp.html lines 251-276)
    logistics: [
      {
        title: '精選酒店住宿',
        content: '位置優越、服務完善，一人一間，確保學生安全'
      },
      {
        title: '營養餐食安排',
        content: '中西餐結合，滿足學生營養需求'
      },
      {
        title: '全程陪同老師',
        content: '專業老師全程陪同，及時反饋學生情況'
      },
      {
        title: '雙語客服支持',
        content: '家長可隨時了解孩子的學習與生活情況'
      }
    ]
  },
  {
    id: 11,
    documentId: 'os7qfp4e6kjypt1cblul2kjj',
    name: '新西蘭光伏儲能投資',
    // highlightCards - 項目方背景 (event-nz-investment.html lines 209-226)
    highlightCards: [
      {
        title: '全牌照資質',
        icon: '🏆',
        description: '新西蘭電力管理局註冊，具備完整電力產業鏈運營資格',
        content: '新西蘭電力管理局註冊，具備完整電力產業鏈運營資格'
      },
      {
        title: '自有施工團隊',
        icon: '🔧',
        description: '實現成本控制，1兆瓦光伏建設成本低於歐洲市場20%以上',
        content: '實現成本控制，1兆瓦光伏建設成本低於歐洲市場20%以上'
      },
      {
        title: '穩定購電協議',
        icon: '📋',
        description: '黑啟動業務最少7年購電合同，收益穩定且可預期',
        content: '黑啟動業務最少7年購電合同，收益穩定且可預期'
      },
      {
        title: '政府關係',
        icon: '🤝',
        description: '與新西蘭能源部門、地方政府建立良好合作關係',
        content: '與新西蘭能源部門、地方政府建立良好合作關係'
      }
    ],
    // logistics - 新西蘭移民政策 (event-nz-investment.html lines 269-293)
    logistics: [
      {
        title: '永久居留權',
        content: '獲得新西蘭永久居民身份，享受與公民同等的福利待遇'
      },
      {
        title: '優質教育資源',
        content: '子女可享受新西蘭優質的公立教育，升學壓力小'
      },
      {
        title: '宜居環境',
        content: '新西蘭自然環境優美，生活節奏舒適，適合養老'
      },
      {
        title: '護照便利',
        content: '新西蘭護照免簽170+國家和地區，出行便利'
      }
    ]
  },
  {
    id: 12,
    documentId: 'oo61mqkefqac9secy1lglotk',
    name: '中歐論壇暨塞納博覽會',
    // highlightCards - 多維合作機會 (event-tcm-forum.html lines 217-232)
    highlightCards: [
      {
        title: '中藥材及中成藥出口',
        icon: '💊',
        description: '對接歐洲進口商、分銷商，拓展銷售渠道',
        content: '對接歐洲進口商、分銷商，拓展銷售渠道'
      },
      {
        title: '中醫診療服務國際化',
        icon: '🏥',
        description: '中醫診療機構海外布局、人才輸出',
        content: '中醫診療機構海外布局、人才輸出'
      },
      {
        title: '健康產品品牌建設',
        icon: '🌿',
        description: '保健品、護膚品等中醫藥健康產品品牌出海',
        content: '保健品、護膚品等中醫藥健康產品品牌出海'
      },
      {
        title: '中醫教育與文化傳播',
        icon: '📖',
        description: '中醫教育合作、文化交流項目',
        content: '中醫教育合作、文化交流項目'
      }
    ],
    // logistics - 精準商務匹配 (event-tcm-forum.html lines 259-284)
    logistics: [
      {
        title: '提前提交合作意向',
        content: '參會前詳細說明企業需求和合作方向'
      },
      {
        title: '專業配對服務',
        content: '組委會根據企業需求進行精準匹配'
      },
      {
        title: '一對一商務會談',
        content: '安排與目標客戶或合作夥伴的專屬會談時間'
      },
      {
        title: '會後跟進支持',
        content: '協助跟進商務洽談進展，促成合作落地'
      }
    ]
  }
];

function putEvent(event) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      data: {
        logistics: event.logistics,
        highlightCards: event.highlightCards
      }
    });

    const req = http.request({
      hostname: 'localhost',
      port: 1337,
      path: `/api/events/${event.documentId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const j = JSON.parse(d);
          resolve({ id: event.id, documentId: event.documentId, name: event.name, ok: true });
        } else {
          console.error(`[${event.id}/${event.documentId}] Status ${res.statusCode}: ${d}`);
          reject(new Error(`[${event.id}] PUT failed: ${d}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('=== 写入 Event logistics + highlightCards ===\n');

  for (const event of eventsData) {
    try {
      const result = await putEvent(event);
      console.log(`✅ [${result.id}/${result.documentId}] ${result.name}`);
      console.log(`   logistics: ${event.logistics.length}个`);
      console.log(`   highlightCards: ${event.highlightCards.length}个`);
    } catch (e) {
      console.error(`❌ [${event.id}/${event.documentId}] ${event.name}: ${e.message}`);
    }
  }

  console.log('\n=== 完成 ===');
}

main().catch(console.error);
