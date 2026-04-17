/**
 * populate-case-listing.js
 * 写入 Case Listing（项目经验列表页）
 * HTML原文：cases.html
 *
 * 【重要】testimonials 已改为独立集合类型，可在后台单独管理
 * 本脚本只写入初始数据，后续新增/编辑/删除在 Strapi 后台操作
 */

const http = require('http');

const API = 'http://localhost:1337/api';
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

// 3条初始客户评价数据（cases.html 第158-201行）
const initialTestimonials = [
  {
    reviewerName: '張總',
    reviewerTitle: '某跨境企業 創始人',
    reviewContent: '「最初我們自己嘗試落地泰國，走了很多彎路，對接了多個本地機構都不順利。後來找到埃森，他們團隊真的很專業，不僅幫我們找到理想的工公司地址，還協調稅務優化了稅務結構，節省了不少成本，專業又省心。」'
  },
  {
    reviewerName: '李總',
    reviewerTitle: '某家居系統企業 總經理',
    reviewContent: '「作為傳統製造型企業，我們剛開始對海外落地很陌生，幫我們避開了很多坑，對接了本地優質的物流和稅務資源，設計了合規的稅務金融框架，解決了我們的後顧之憂。」'
  },
  {
    reviewerName: '王總',
    reviewerTitle: '某消費品牌 創始人',
    reviewContent: '「我們要創品牌，剛進出海東南亞，一開始很迷茫，不知道怎麼進入哪個國家、向哪個渠道進攻。埃森幫我們做了詳細的計劃分析，建議我們先從泰國落地，還幫我們對接了渠道資源，甚至幫助出海後的營運對接。」'
  }
];

function apiRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve(data); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('📋 写入 Case Listing\n');

  // Step 1: 写入 testimonials（独立条目）
  console.log('--- Step 1: 写入 testimonials ---');

  // 先删除旧 testimonial 条目
  const oldList = await apiRequest('GET', '/api/testimonials?pagination[pageSize]=100&fields[0]=id');
  if (oldList.data && oldList.data.length > 0) {
    console.log(`删除 ${oldList.data.length} 条旧评价...`);
    for (const t of oldList.data) {
      await apiRequest('DELETE', `/api/testimonials/${t.id}`);
    }
  }

  // 创建新条目
  const testimonialIds = [];
  for (let i = 0; i < initialTestimonials.length; i++) {
    const t = initialTestimonials[i];
    const res = await apiRequest('POST', '/api/testimonials', { data: t });
    if (res.data) {
      testimonialIds.push(res.data.id);
      console.log(`  ✅ [${i + 1}] ${t.reviewerName} (id=${res.data.id})`);
    } else {
      console.log(`  ❌ [${i + 1}] ${t.reviewerName} 失败:`, res.error);
    }
  }

  // Step 2: 写入 cases-page（关联 testimonials）
  console.log('\n--- Step 2: 写入 cases-page ---');

  const payload = {
    data: {
      // 板块1 - 项目类型标题（cases.html 第36-38行）
      introTitle: '我們的項目類型',
      introText: '覆蓋東南亞出海全場景，從單一落地到全域佈局，均有成熟實踐經驗',

      // 板块1 - 6张项目类型卡片（cases.html 第43-95行）
      caseTypes: [
        {
          icon: null,
          title: '企業市場進入與落地',
          slogan: '以清晰判斷為起點，協助企業穩健完成市場落地',
          linkSlug: 'case-market-entry'
        },
        {
          icon: null,
          title: '跨境投資與工廠設立',
          slogan: '從選址到投產，全流程推進可控的產能出海布局',
          linkSlug: 'case-investment'
        },
        {
          icon: null,
          title: '區域運營與業務擴展',
          slogan: '由單點落地升級為可持續的區域運營體系',
          linkSlug: 'case-regional-operation'
        },
        {
          icon: null,
          title: '合規與結構調整',
          slogan: '以合規為基礎，重構支撐企業長期發展的結構',
          linkSlug: 'case-compliance'
        },
        {
          icon: null,
          title: '品牌與知識產權出海',
          slogan: '為品牌建立可延展、可防護的跨境保護體系',
          linkSlug: 'case-brand-ip'
        },
        {
          icon: null,
          title: '跨境資金與資產優化',
          slogan: '設計清晰合規的資金路徑，降低跨境資產風險',
          linkSlug: 'case-asset-optimization'
        }
      ],

      // 板块2 - 行业经验标题（cases.html 第100-102行）
      industryTitle: '深耕多行業，定製化解決方案',
      industrySubtitle: '不同行業的出海痛點與路徑差異顯著，我們結合行業特性與當地市場為您服務',

      // 板块2 - 5个行业卡片（cases.html 第105-143行）
      industries: [
        { icon: null, industry: '跨境貿易', description: '供應商' },
        { icon: null, industry: '製造業', description: '海外建廠' },
        { icon: null, industry: '服務業', description: '跨境拓展' },
        { icon: null, industry: '消費品牌', description: '本地化運營' },
        { icon: null, industry: '數字化業務', description: '跨境落地' }
      ],

      // 板块2 - 行业举例说明（cases.html 第146-149行）
      industryExample: '不同行業在產業鏈運作模式、政策約束條件與供應鏈組織方式上，均存在明顯的在地差異。我們不採取標準化或「一體適用」的服務方式，而是依據企業所屬行業特性，配置具備相應行業深度經驗的顧問團隊，結合目標國家的產業政策方向與市場實際情況，為企業設計具差異化的出海與落地路徑，確保整體方案在合規性與可執行性上的平衡。例如：製造型企業在出海過程中，核心關注產業園區選擇、供應鏈配套成熟度及當地用工與勞動政策；消費品牌企業更關注品牌佈局、銷售渠道資源與本地化行銷推廣能力；跨境貿易企業則主要關注報關與物流效率、稅務籌劃安排以及跨境資金結算結構。我們針對上述不同場景，提供對應的顧問支持，協助企業實現穩健且可持續的海外發展。',

      // 板块3 - 关联到刚才创建的 testimonials
      testimonials: testimonialIds
    }
  };

  const result = await apiRequest('PUT', '/api/cases-page', payload);

  if (result.data) {
    console.log(`✅ cases-page 写入成功！`);
    console.log(`   caseTypes: 6 个`);
    console.log(`   industries: 5 个`);
    console.log(`   testimonials: ${testimonialIds.length} 条（已关联）`);
    console.log('\n📌 后续在后台操作：');
    console.log('   - 新增客户评价：Strapi后台 → Testimonial → 新建条目');
    console.log('   - 编辑/删除：Strapi后台 → Testimonial → 选择对应条目');
    console.log('   - icon/avatar：需手动上传媒体文件');
  } else {
    console.error('❌ cases-page 写入失败：', result.error);
  }
}

main().catch(console.error);
