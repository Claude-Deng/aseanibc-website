const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const r = http.request({ hostname: 'localhost', port: 1337, path, headers: { 'Authorization': 'Bearer ' + token } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(d); } });
    });
    r.on('error', reject); r.end();
  });
}

(async () => {
  // 1. 直接查 cases 不带 populate
  const cases1 = await apiGet('/api/cases');
  console.log('cases (无populate) count:', cases1.data ? cases1.data.length : cases1.meta ? cases1.meta.pagination.total : 'err');
  if (cases1.data && cases1.data[0]) {
    console.log('第一条结构:', JSON.stringify(cases1.data[0]).substring(0, 200));
  }

  // 2. 带 populate=coverImage
  const cases2 = await apiGet('/api/cases?populate=coverImage');
  console.log('\ncases (populate=coverImage) count:', cases2.data ? cases2.data.length : 'N/A');
  if (cases2.data && cases2.data[0]) {
    const item = cases2.data[0];
    const cover = item.coverImage || (item.attributes && item.attributes.coverImage);
    console.log('coverImage字段:', JSON.stringify(cover).substring(0, 200));
  } else {
    console.log('cases2 data:', JSON.stringify(cases2).substring(0, 200));
  }

  // 3. 检查 services
  const svc = await apiGet('/api/services');
  console.log('\nservices count:', svc.data ? svc.data.length : svc.meta ? svc.meta.pagination.total : 'err');
  if (svc.data && svc.data[0]) {
    console.log('service sample:', JSON.stringify(svc.data[0]).substring(0, 200));
  }

  // 4. 检查 uploads
  const up = await apiGet('/api/upload/files');
  console.log('\nuploads count:', up.length);
})();
