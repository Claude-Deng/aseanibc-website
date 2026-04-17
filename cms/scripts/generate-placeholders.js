/**
 * 为 Team Members 和 Case Studies 生成占位图并写入 Strapi
 * 策略：从 placehold.co 下载纯色+文字占位图 → 上传到 Strapi → 关联记录
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const PORT = 1337;
const API_BASE = `http://localhost:${PORT}`;
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ========== 工具函数 ==========
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 10000 }, res => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('超时')); });
  });
}

function api(path, method, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const opts = {
      hostname: 'localhost',
      port: PORT,
      path,
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { reject(new Error(d)); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function uploadFile(filename, buffer) {
  return new Promise((resolve, reject) => {
    const boundary = '----FormBoundary' + Math.random().toString(16).slice(2);
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { reject(new Error(d)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ========== 主流程 ==========
async function main() {
  console.log('🚀 开始生成占位图...\n');

  // 1. 获取 Team Members
  console.log('📋 获取 Team Members...');
  const teamRes = await api('/api/team-members?pagination[pageSize]=100');
  if (teamRes.error) throw new Error(`获取成员失败: ${JSON.stringify(teamRes.error)}`);
  const members = teamRes.data;
  console.log(`   共 ${members.length} 人\n`);

  // 2. 获取 Case Studies
  console.log('📋 获取 Case Studies...');
  const caseRes = await api('/api/cases?pagination[pageSize]=100');
  if (caseRes.error) throw new Error(`获取案例失败: ${JSON.stringify(caseRes.error)}`);
  const cases = caseRes.data;
  console.log(`   共 ${cases.length} 个案例\n`);

  // 3. 上传 Team Member 头像 (400x400 蓝色)
  console.log('========== 上传 Team Member 头像 (400x400) ==========');
  for (const member of members) {
    const attrs = member.attributes || member;
    const name = attrs.name || attrs.Name || 'TM';
    // 生成姓名缩写（最多2字）
    const initials = name.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '').substring(0, 2) || 'TM';
    const id = member.id;

    try {
      const imgUrl = `https://placehold.co/400x400/2563EB/FFFFFF?text=${encodeURIComponent(initials)}&font=montserrat`;
      const buffer = await httpGet(imgUrl);

      const uploadRes = await uploadFile(`${name.replace(/[^\w\u4e00-\u9fa5]/g, '-')}-avatar.png`, buffer);

      if (uploadRes && uploadRes.length > 0) {
        const fileId = uploadRes[0].id;
        await api(`/api/team-members/${id}`, 'PUT', { data: { avatar: fileId } });
        console.log(`  ✅ ${name} (ID:${id}) → 头像已关联`);
      } else {
        console.log(`  ⚠️  ${name}: 上传返回空`);
      }
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // 4. 上传 Case Study 封面图 (800x450 深蓝)
  console.log('\n========== 上传 Case Study 封面图 (800x450) ==========');
  for (const c of cases) {
    const attrs = c.attributes || c;
    const title = attrs.title || attrs.Title || 'Case';
    const slug = attrs.slug || attrs.Slug || 'case';
    const id = c.id;

    try {
      const imgUrl = `https://placehold.co/800x450/1D4ED8/FFFFFF?text=${encodeURIComponent(title.substring(0, 15))}`;
      const buffer = await httpGet(imgUrl);

      const uploadRes = await uploadFile(`${slug}-cover.png`, buffer);
      if (uploadRes && uploadRes.length > 0) {
        const fileId = uploadRes[0].id;
        await api(`/api/cases/${id}`, 'PUT', { data: { coverImage: fileId } });
        console.log(`  ✅ ${title} (ID:${id}) → 封面图已关联`);
      } else {
        console.log(`  ⚠️  ${title}: 上传返回空`);
      }
    } catch (e) {
      console.log(`  ❌ ${title}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  // 5. 上传 Case Study 分类图标 (120x120 绿色)
  console.log('\n========== 上传 Case Study 分类图标 (120x120) ==========');
  for (const c of cases) {
    const attrs = c.attributes || c;
    const category = attrs.category || attrs.Category || 'general';
    const slug = attrs.slug || attrs.Slug || 'case';
    const id = c.id;

    try {
      const imgUrl = `https://placehold.co/120x120/059669/FFFFFF?text=${encodeURIComponent(category.substring(0, 4))}`;
      const buffer = await httpGet(imgUrl);

      const uploadRes = await uploadFile(`${slug}-icon.png`, buffer);
      if (uploadRes && uploadRes.length > 0) {
        const fileId = uploadRes[0].id;
        await api(`/api/cases/${id}`, 'PUT', { data: { categoryIcon: fileId } });
        console.log(`  ✅ ${slug} → 分类图标已关联`);
      } else {
        console.log(`  ⚠️  ${slug} icon: 上传返回空`);
      }
    } catch (e) {
      console.log(`  ❌ ${slug} icon: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n🎉 全部完成！去后台刷新查看占位图。');
  console.log('💡 提示：上线前在后台逐个替换真实图片即可。');
}

main().catch(console.error);
