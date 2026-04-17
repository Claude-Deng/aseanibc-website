const http = require('http');
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const r = http.request({
  hostname: 'localhost', port: 1337,
  path: '/_api/content-api/routes',
  headers: { 'Authorization': `Bearer ${TOKEN}` }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log(JSON.stringify(j, null, 2));
    } catch (e) { console.log(d.substring(0, 1000)); }
  });
});
r.end();
