const http = require('http');
const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const r = http.request({ hostname: 'localhost', port: 1337, path: '/api/contact-page', headers: { 'Authorization': 'Bearer ' + token } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const j = JSON.parse(d);
    console.log('status:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('fields:', Object.keys(j.data || {}).join(', '));
    } else {
      console.log('body:', d.substring(0, 200));
    }
  });
});
r.end();
