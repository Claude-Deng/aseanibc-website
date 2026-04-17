/**
 * populate-case-images.js
 * 关联 Case Studies 封面图和分类图标
 * 图片文件 → CMS Upload API 返回 ID → PUT 更新各 case 条目
 *
 * 图片来源：CMS Upload API (/api/upload/files)
 * - case-market-entry-cover.png      → case-market-entry 封面
 * - case-investment-cover.png         → case-investment 封面
 * - case-regional-operation-cover.png → case-regional-operation 封面
 * - case-compliance-cover.png         → case-compliance 封面
 * - case-brand-ip-cover.png          → case-brand-ip 封面
 * - case-asset-optimization-cover.png → case-asset-optimization 封面
 * - case-market-entry-icon.png        → case-market-entry 分类图标
 * - case-investment-icon.png          → case-investment 分类图标
 * - case-regional-operation-icon.png  → case-regional-operation 分类图标
 * - case-compliance-icon.png          → case-compliance 分类图标
 * - case-brand-ip-icon.png            → case-brand-ip 分类图标
 * - case-asset-optimization-icon.png  → case-asset-optimization 分类图标
 */

const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 1337, path, method, headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } };
    const req = http.request(opts, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(d); } });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// 文件名 → slug 映射（封面图 + 图标各自对应）
const imageMap = [
  { slug: 'case-market-entry',       cover: 'case-market-entry-cover.png',       icon: 'case-market-entry-icon.png' },
  { slug: 'case-investment',           cover: 'case-investment-cover.png',          icon: 'case-investment-icon.png' },
  { slug: 'case-regional-operation',  cover: 'case-regional-operation-cover.png',  icon: 'case-regional-operation-icon.png' },
  { slug: 'case-compliance',           cover: 'case-compliance-cover.png',          icon: 'case-compliance-icon.png' },
  { slug: 'case-brand-ip',             cover: 'case-brand-ip-cover.png',             icon: 'case-brand-ip-icon.png' },
  { slug: 'case-asset-optimization',  cover: 'case-asset-optimization-cover.png',   icon: 'case-asset-optimization-icon.png' },
];

(async () => {
  // 1. 获取上传文件列表，拿到 file ID
  const files = await api('GET', '/api/upload/files');
  const fileMap = {};
  files.forEach(f => { fileMap[f.name] = f.id; });

  // 2. 获取所有 case 条目（显式指定 fields 才能拿到 slug/documentId）
  const cases = await api('GET', '/api/cases?pagination[pageSize]=100&fields[0]=slug&fields[1]=title&fields[2]=documentId');
  const caseMap = {};
  cases.data.forEach(c => { caseMap[c.slug] = c.documentId; });

  console.log('=== 图片关联开始 ===\n');

  // 3. 逐条更新
  for (const item of imageMap) {
    const caseId = caseMap[item.slug];
    const coverId = fileMap[item.cover];
    const iconId  = fileMap[item.icon];

    if (!caseId) { console.log('❌ 找不到案例:', item.slug); continue; }
    if (!coverId) { console.log('⚠️ 找不到封面图:', item.cover); }
    if (!iconId)  { console.log('⚠️ 找不到图标:', item.icon); }

    const body = {
      data: {
        coverImage: coverId || null,
        categoryIcon: iconId || null,
      }
    };

    const result = await api('PUT', `/api/cases/${caseId}`, body); // caseId = documentId
    if (result.data) {
      console.log('✅', item.slug, '- 封面:', coverId || '无', '/ 图标:', iconId || '无');
    } else {
      console.log('❌ 更新失败:', item.slug, result.error);
    }
  }

  console.log('\n=== 完成 ===');
})();
