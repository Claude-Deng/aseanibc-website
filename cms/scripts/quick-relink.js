const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

// 直接用 http.request，避免 Promise 解析问题
function syncGet(path, callback) {
  const r = http.request({ hostname: 'localhost', port: 1337, path, method: 'GET', headers: { 'Authorization': 'Bearer ' + token } }, res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => {
      try { callback(JSON.parse(d)); } catch (e) { callback(null, e.message); }
    });
  });
  r.on('error', e => callback(null, e.message)); r.end();
}

function syncPut(path, body, callback) {
  const data = JSON.stringify(body);
  const r = http.request({ hostname: 'localhost', port: 1337, path, method: 'PUT', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => {
      try { callback(JSON.parse(d)); } catch (e) { callback(null, e.message); }
    });
  });
  r.on('error', e => callback(null, e.message)); r.write(data); r.end();
}

// 1. 获取头像文件列表
syncGet('/api/upload/files', (files, err) => {
  if (err) { console.log('files err:', err); return; }
  console.log('files count:', files.length);
  const avatarMap = {};
  files.forEach(f => {
    if (f.name && f.name.includes('avatar')) avatarMap[f.name] = f.id;
  });
  console.log('avatar files:', Object.keys(avatarMap).length);
  console.log(Object.keys(avatarMap).slice(0, 3).map(k => k + '→' + avatarMap[k]).join(', '));

  // 2. 获取 team members
  syncGet('/api/team-members?pagination[pageSize]=100&fields[0]=name&fields[0]=documentId', (resp, err2) => {
    if (err2) { console.log('members err:', err2); return; }
    const list = resp.data || [];
    console.log('members count:', list.length);

    let done = 0, ok = 0;
    list.forEach((m, idx) => {
      const name = m.name || '';
      const docId = m.documentId;
      const fileId = avatarMap[`${name}-avatar.png`];

      if (fileId) {
        syncPut(`/api/team-members/${docId}`, { data: { avatar: fileId } }, (result, err3) => {
          if (result && result.data) {
            console.log('✅', name, '→ 头像ID:', fileId);
            ok++;
          } else {
            console.log('❌', name, ':', result ? result.error : err3);
          }
          done++;
          if (done === list.length) console.log('\n完成: 成功', ok, '/', list.length);
        });
      } else {
        console.log('⚠️ 未找到头像:', name);
        done++;
        if (done === list.length) console.log('\n完成: 成功', ok, '/', list.length);
      }
    });
  });
});
