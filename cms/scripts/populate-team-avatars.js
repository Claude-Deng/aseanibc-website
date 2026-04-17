/**
 * populate-team-avatars.js
 * 重新关联 Team Members 头像
 */
const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const r = http.request({ hostname: 'localhost', port: 1337, path, method: 'GET', headers: { 'Authorization': 'Bearer ' + token } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(d); } });
    });
    r.on('error', reject); r.end();
  });
}

function apiPut(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const r = http.request({ hostname: 'localhost', port: 1337, path, method: 'PUT', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(d); } });
    });
    r.on('error', reject);
    r.write(data); r.end();
  });
}

(async () => {
  // 1. 获取上传文件列表
  const files = await apiGet('/api/upload/files');
  console.log('files type:', typeof files, Array.isArray(files), Array.isArray(files) ? files.length : 'N/A');
  const avatarMap = {};
  if (Array.isArray(files)) {
    files.forEach(f => {
      if (f.name && f.name.includes('avatar')) {
        avatarMap[f.name] = f.id;
      }
    });
  }
  console.log('头像文件:', Object.keys(avatarMap).length, '张');
  Object.keys(avatarMap).slice(0, 3).forEach(k => console.log(' -', k, '→ ID:', avatarMap[k]));

  // 2. 获取 team members
  const members = await apiGet('/api/team-members?pagination[pageSize]=100&fields[0]=name&fields[0]=documentId');
  const list = Array.isArray(members.data) ? members.data : (Array.isArray(members) ? members : []);
  console.log('\n成员数量:', list.length);
  if (list.length > 0) console.log('第一个成员:', JSON.stringify(list[0]).substring(0, 100));

  // 3. 关联
  let ok = 0, fail = 0;
  for (const m of list) {
    const name = m.name || '';
    const docId = m.documentId;
    if (!docId) { fail++; continue; }

    const fileId = avatarMap[`${name}-avatar.png`] || Object.entries(avatarMap).find(([fname]) => {
      return fname.includes(name.replace(/[^\w]/g, ''));
    })?.[1];

    if (fileId) {
      const result = await apiPut(`/api/team-members/${docId}`, { data: { avatar: fileId } });
      if (result.data) {
        console.log('✅', name, '→ 头像ID:', fileId);
        ok++;
      } else {
        console.log('❌', name, result.error ? result.error.message : '失败');
        fail++;
      }
    } else {
      console.log('⚠️  未找到:', name);
      fail++;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n完成: 成功', ok, '失败', fail, '/', list.length);
})();
