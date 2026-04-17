const http = require('http');

const endpoints = [
  {name: 'Homepage',         path: '/api/home-page'},
  {name: 'About',            path: '/api/about-page'},
  {name: 'Services',        path: '/api/services-page'},
  {name: 'Events (listing)',path: '/api/events?pagination[pageSize]=1'},
  {name: 'Event Detail',    path: '/api/event-detail'},
  {name: 'Cases',           path: '/api/cases?pagination[pageSize]=1'},
  {name: 'Cases Page',      path: '/api/cases-page'},
];

const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

let done = 0;
endpoints.forEach(e => {
  const req = http.request({
    hostname: 'localhost',
    port: 1337,
    path: e.path,
    headers: {'Authorization': 'Bearer ' + token}
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      let info = '';
      try {
        const j = JSON.parse(d);
        if (j.data) {
          const count = Array.isArray(j.data) ? j.data.length : '单条';
          info = ` ✅ 200（${count} 条）`;
        } else {
          info = ' ❌ 无 data 字段';
        }
      } catch(err) {
        info = ` ❌ 解析失败 (${res.statusCode})`;
      }
      console.log(e.name.padEnd(18) + info);
      done++;
      if (done === endpoints.length) console.log('\n--- 全部检查完毕');
    });
  });
  req.end();
});
