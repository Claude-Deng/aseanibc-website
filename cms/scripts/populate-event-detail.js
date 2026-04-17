/**
 * populate-event-detail.js
 * 功能：写入 Event 详情页内容（可重复运行，每次用 PUT 更新指定 ID）
 *
 * 使用方式：
 *   node scripts/populate-event-detail.js <eventId> <jsonData>
 * 示例：
 *   node scripts/populate-event-detail.js 2 event-copenhagen-data.json
 *
 * 数据文件格式（event-detail-data/ 目录下）：
 * {
 *   "background": "...",
 *   "highlights": "...",
 *   "partners": "...",
 *   "boothServices": "...",
 *   "itinerary": "...",
 *   "recommendedFor": "...",
 *   "serviceAdvantage": "...",
 *   "contactInfo": "..."
 * }
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:1337/api';
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

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
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('用法: node populate-event-detail.js <eventId> <jsonFile>');
    console.log('示例: node populate-event-detail.js 2 event-copenhagen-data.json');
    process.exit(1);
  }

  const eventDocId = args[0];
  const jsonFile = path.join(__dirname, 'event-detail-data', args[1]);

  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ 文件不存在: ${jsonFile}`);
    process.exit(1);
  }

  const detailData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

  console.log(`=== 更新 Event documentId=${eventDocId} 详情 ===`);
  console.log(`字段: ${Object.keys(detailData).join(', ')}\n`);

  const res = await apiReq('PUT', `/events/${eventDocId}`, detailData);

  if (res.data) {
    console.log('✅ 更新成功');
  } else {
    console.log('❌ 失败:', JSON.stringify(res.error || res));
  }
}

main().catch(console.error);
