const http = require('http');
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function req(path) {
    return new Promise((res, rej) => {
        const r = http.request({ host: '127.0.0.1', port: 1337, path, headers: { Authorization: 'Bearer ' + TOKEN } }, (x) => {
            let d = '';
            x.on('data', c => d += c);
            x.on('end', () => { try { res(JSON.parse(d)); } catch(e) { rej(e); } });
        });
        r.on('error', rej);
        r.end();
    });
}

(async () => {
    console.log('=== Case Studies ===');
    const cases = await req('/api/case-studies?populate=*');
    const arr = Array.isArray(cases) ? cases : (cases.data || []);
    arr.forEach(c => {
        const industries = c.industries ? (Array.isArray(c.industries) ? c.industries.map(i => i.title).join(',') : JSON.stringify(c.industries)) : '';
        console.log(c.slug, '|', c.title, '|', industries);
    });

    console.log('\n=== Testimonials ===');
    const testis = await req('/api/testimonials?populate=*');
    const tArr = Array.isArray(testis) ? testis : (testis.data || []);
    tArr.forEach(t => console.log(t.name, '|', t.title));

    console.log('\n=== CasesPage (industries) ===');
    const cp = await req('/api/cases-page?populate=*');
    console.log('industries:', cp.industries);
})().catch(console.error);
