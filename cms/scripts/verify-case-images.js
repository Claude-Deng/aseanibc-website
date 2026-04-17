const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const r = http.request({ hostname: 'localhost', port: 1337, path: '/api/cases?fields[0]=slug&populate[coverImage][fields][0]=url&populate[categoryIcon][fields][0]=url', headers: { 'Authorization': 'Bearer ' + token } }, res => {
  let d = ''; res.on('data', c => d += c); res.on('end', () => {
    const j = JSON.parse(d);
    console.log('=== 案例图片验证 ===');
    j.data.forEach(c => {
      const cover = c.coverImage && c.coverImage.data ? c.coverImage.data.attributes.url : '空';
      const icon  = c.categoryIcon && c.categoryIcon.data ? c.categoryIcon.data.attributes.url : '空';
      console.log(c.slug + ': 封面 ' + cover + ' | 图标 ' + icon);
    });
  });
});
r.end();
