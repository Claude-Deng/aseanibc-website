const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const endpoints = [
  ['Home Page',           '/api/home-page'],
  ['About Page',          '/api/about-page'],
  ['Cases Page',          '/api/cases-page?populate=deep'],
  ['Services',            '/api/services?pagination[pageSize]=100'],
  ['Events',              '/api/events?pagination[pageSize]=100'],
  ['Partners',            '/api/partners?pagination[pageSize]=100'],
  ['Team Members',        '/api/team-members?pagination[pageSize]=100'],
  ['Media Sources',       '/api/media-sources?pagination[pageSize]=100'],
  ['Testimonials',        '/api/testimonials?pagination[pageSize]=100'],
  ['Contact Page',        '/api/contact-page']
];

let done = 0;
endpoints.forEach(([name, path]) => {
  const r = http.request({ hostname: 'localhost', port: 1337, path, headers: { 'Authorization': 'Bearer ' + token } }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const j = JSON.parse(d);
        if (res.statusCode === 200) {
          let cnt = '';
          if (j.data === null) cnt = '空数据';
          else if (Array.isArray(j.data)) cnt = j.data.length + '条';
          else if (typeof j.data === 'object') cnt = Object.keys(j.data).length + '字段';
          console.log('✅ ' + name + ': ' + cnt);
        } else {
          console.log('❌ ' + name + ': HTTP ' + res.statusCode);
        }
      } catch (e) {
        console.log('❌ ' + name + ': 解析失败');
      }
      done++;
      if (done === endpoints.length) console.log('\n--- 全部检查完毕 ---');
    });
  });
  r.end();
});
