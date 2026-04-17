const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const endpoints = [
  ['Home Page',         '/api/home-page?populate=*'],
  ['About Page',        '/api/about-page?populate=*'],
  ['Cases Page',       '/api/cases-page?populate=*'],
  ['Services',         '/api/services?pagination[pageSize]=100&populate=*'],
  ['Events',           '/api/events?pagination[pageSize]=100&populate=*'],
  ['Partners',         '/api/partners?pagination[pageSize]=100&populate=*'],
  ['Team Members',     '/api/team-members?pagination[pageSize]=100&populate=*'],
  ['Media Sources',    '/api/media-sources?pagination[pageSize]=100&populate=*'],
  ['Testimonials',     '/api/testimonials?pagination[pageSize]=100&populate=*'],
  ['Contact Page',     '/api/contact-page?populate=*']
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
          if (Array.isArray(j.data)) {
            console.log('✅ ' + name + ': ' + j.data.length + '条');
            if (j.data.length > 0 && j.data[0].title) console.log('   首条: ' + j.data[0].title);
          } else if (j.data) {
            const keys = Object.keys(j.data).filter(k => !['id','documentId','createdAt','updatedAt','publishedAt'].includes(k));
            console.log('✅ ' + name + ': ' + keys.length + '个内容字段');
            keys.forEach(k => {
              const v = j.data[k];
              if (Array.isArray(v)) console.log('   ' + k + ': ' + v.length + '条');
              else if (typeof v === 'string') console.log('   ' + k + ': "' + v.substring(0, 30) + '"');
            });
          }
        } else {
          console.log('❌ ' + name + ': HTTP ' + res.statusCode);
        }
      } catch (e) {
        console.log('❌ ' + name + ': ' + e.message);
      }
      done++;
      if (done === endpoints.length) console.log('\n--- 全部检查完毕 ---');
    });
  });
  r.end();
});
