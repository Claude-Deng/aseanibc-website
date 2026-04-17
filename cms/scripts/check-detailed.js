const http = require('http');

const token = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function get(path) {
  return new Promise(resolve => {
    const req = http.request({hostname:'localhost',port:1337,path,headers:{'Authorization':'Bearer '+token}}, res => {
      let d = ''; res.on('data',c=>d+=c);
      res.on('end', () => resolve({status: res.statusCode, body: d}));
    });
    req.end();
  });
}

(async () => {
  const [svc, ev] = await Promise.all([
    get('/api/services-page'),
    get('/api/event-detail'),
  ]);

  console.log('=== Services (/api/services-page) ===');
  console.log('Status:', svc.status);
  if (svc.status !== 200) console.log(svc.body.substring(0, 500));
  else {
    const j = JSON.parse(svc.body);
    console.log('data:', JSON.stringify(j.data, null, 2).substring(0, 500));
  }

  console.log('\n=== Event Detail (/api/event-detail) ===');
  console.log('Status:', ev.status);
  if (ev.status !== 200) console.log(ev.body.substring(0, 500));
  else {
    const j = JSON.parse(ev.body);
    console.log('data:', JSON.stringify(j.data, null, 2).substring(0, 500));
  }
})();
