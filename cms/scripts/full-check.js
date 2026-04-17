const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const endpoints = [
  ['HomePage(单例)', '/api/home-page', false],
  ['AboutPage(单例)', '/api/about-page', false],
  ['CasesPage(单例)', '/api/cases-page', false],
  ['ContactPage(单例)', '/api/contact-page', false],
  ['Services(集合)', '/api/services', true],
  ['Events(集合)', '/api/events', true],
  ['Partners(集合)', '/api/partners', true],
  ['TeamMembers(集合)', '/api/team-members', true],
  ['Testimonials(集合)', '/api/testimonials', true],
  ['MediaSources(集合)', '/api/media-sources', true],
  ['CaseStudies(集合)', '/api/cases', true],
  ['UploadedFiles', '/api/upload/files', false],
];

let done = 0;
console.log('=== ASEAN IBC CMS 全量内容清点 ===\n');

endpoints.forEach(([name, path, isArr]) => {
  const r = http.request({ hostname: 'localhost', port: 1337, path, headers: { 'Authorization': 'Bearer ' + token } }, res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => {
      try {
        const j = JSON.parse(d);
        if (j.error) {
          console.log('❌ ' + name + ' - 错误:' + j.error.status);
        } else if (Array.isArray(j)) {
          console.log('✅ ' + name + ' - ' + j.length + ' 条');
        } else if (isArr) {
          const total = (j.meta && j.meta.pagination && j.meta.pagination.total) || (j.data ? j.data.length : 0);
          console.log('✅ ' + name + ' - ' + total + ' 条');
        } else {
          console.log('✅ ' + name + ' - 已填充');
        }
      } catch (e) {
        console.log('❌ ' + name + ' - 解析失败');
      }
      done++;
      if (done === endpoints.length) console.log('\n=== 检查完成 ===');
    });
  });
  r.on('error', () => { console.log('❌ ' + name + ' - 连接失败'); done++; if (done === endpoints.length) console.log('\n=== 检查完成 ==='); });
  r.end();
});
