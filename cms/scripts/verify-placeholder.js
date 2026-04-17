const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function get(path) {
  return new Promise((resolve, reject) => {
    const r = http.request({ hostname: 'localhost', port: 1337, path, headers: { 'Authorization': 'Bearer ' + token } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(d); } });
    });
    r.on('error', reject); r.end();
  });
}

(async () => {
  // 1. 检查成员照片
  const j1 = await get('/api/team-members?pagination[pageSize]=3&populate=*');
  if (j1.data && j1.data[0]) {
    const a = j1.data[0].attributes || j1.data[0];
    const photo = a.photo && a.photo.data;
    console.log('成员:', a.name || a.Name);
    console.log('照片URL:', photo ? photo.attributes.url : 'null');
  } else {
    console.log('成员数据:', JSON.stringify(j1).substring(0, 300));
  }

  // 2. 检查案例封面
  const j2 = await get('/api/cases?pagination[pageSize]=2&populate=*');
  if (j2.data && j2.data[0]) {
    const a = j2.data[0].attributes || j2.data[0];
    const cover = a.coverImage && a.coverImage.data;
    const icon = a.categoryIcon && a.categoryIcon.data;
    console.log('案例:', a.title || a.Title);
    console.log('封面URL:', cover ? cover.attributes.url : 'null');
    console.log('图标URL:', icon ? icon.attributes.url : 'null');
  } else {
    console.log('案例数据:', JSON.stringify(j2).substring(0, 300));
  }
})();
