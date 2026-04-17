const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

// Try different populate approaches
const paths = [
  '/api/cases-page?fields[0]=*',
  '/api/cases-page?populate=*',
  '/api/cases-page?populate[caseTypes]=true',
  '/api/cases-page?populate[industries]=true'
];

let done = 0;
paths.forEach(p => {
  const r = http.request({ hostname: 'localhost', port: 1337, path: p, headers: { 'Authorization': 'Bearer ' + token } }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const j = JSON.parse(d);
        if (res.statusCode === 200) {
          const data = j.data || {};
          const keys = Object.keys(data);
          console.log('✅ ' + p);
          console.log('   字段: ' + keys.join(', '));
          if (data.caseTypes) console.log('   caseTypes: ' + JSON.stringify(data.caseTypes).substring(0, 100));
          if (data.industries) console.log('   industries: ' + JSON.stringify(data.industries).substring(0, 100));
          if (data.testimonials) console.log('   testimonials: ' + JSON.stringify(data.testimonials).substring(0, 100));
        } else {
          console.log('❌ ' + p + ' -> ' + res.statusCode + ' ' + d.substring(0, 100));
        }
      } catch(e) {
        console.log('❌ ' + p + ': ' + e.message);
      }
      done++;
      if (done === paths.length) console.log('\n--- Done ---');
    });
  });
  r.end();
});
