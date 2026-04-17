const http = require('http');
const t = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c12f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function get(path) {
  return new Promise(function(resolve, reject) {
    var r = http.request({ hostname: 'localhost', port: 1337, path: path, method: 'GET', headers: { 'Authorization': 'Bearer ' + t } }, function(res) {
      var d = '';
      res.on('data', function(c) { d += c; });
      res.on('end', function() { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    r.on('error', function(e) { resolve(null); });
    r.end();
  });
}

function put(path, body) {
  return new Promise(function(resolve, reject) {
    var data = JSON.stringify(body);
    var r = http.request({ hostname: 'localhost', port: 1337, path: path, method: 'PUT', headers: { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, function(res) {
      var d = '';
      res.on('data', function(c) { d += c; });
      res.on('end', function() { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    r.on('error', function(e) { resolve(null); });
    r.write(data);
    r.end();
  });
}

function wait(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

(function run() {
  // Step 1: get files
  get('/api/upload/files').then(function(files) {
    if (!files || !files.length) { console.log('无文件列表'); return; }
    var avatars = {};
    files.forEach(function(f) {
      if (f.name && f.name.indexOf('avatar') !== -1) {
        avatars[f.name] = f.id;
      }
    });
    console.log('头像文件:', Object.keys(avatars).length, '张');
    // Step 2: get team members
    return get('/api/team-members?pagination[pageSize]=100&fields[0]=name&fields[0]=documentId');
  }).then(function(resp) {
    if (!resp) { console.log('无法获取成员'); return; }
    var list = resp.data || [];
    console.log('成员:', list.length, '人');
    // Step 3: 逐个关联
    var delay = 150;
    list.forEach(function(m, idx) {
      setTimeout(function() {
        var name = m.name || '';
        var docId = m.documentId;
        // 尝试精确匹配或模糊匹配
        var fileId = null;
        if (avatars && avatars[name + '-avatar.png']) {
          fileId = avatars[name + '-avatar.png'];
        } else if (avatars) {
          // 模糊匹配
          for (var fname in avatars) {
            var clean1 = (fname.replace(/-avatar\.png/g, '')).replace(/-/g, '');
            var clean2 = (name).replace(/[^\w]/g, '');
            if (clean1.indexOf(clean2) !== -1 || clean2.indexOf(clean1) !== -1) {
              fileId = avatars[fname];
              break;
            }
          }
        }
        if (docId && fileId) {
          put('/api/team-members/' + docId, { data: { avatar: fileId } }).then(function(result) {
            if (result && result.data) {
              console.log('✅ ' + name + ' → 头像ID:' + fileId);
            } else {
              console.log('❌ ' + name + (result && result.error ? ' ' + result.error.message : ''));
            }
          });
        } else {
          console.log('⚠️  未匹配: ' + name + ' (fileId=' + fileId + ')');
        }
      }, idx * delay);
    });
    setTimeout(function() {
      console.log('\n全部完成，请刷新后台验证');
    }, list.length * delay + 500);
  });
})();

