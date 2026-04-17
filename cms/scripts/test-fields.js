// 检查 API 返回的所有字段
const http = require('http');
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function fetchJson(path) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL('http://127.0.0.1:1337' + path);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            headers: { Authorization: `Bearer ${TOKEN}` }
        };
        const req = http.request(options, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
        });
        req.on('error', reject);
        req.end();
    });
}

(async () => {
    // 试试 populate
    const raw = await fetchJson('/api/team-members?populate=*');
    const members = Array.isArray(raw) ? raw : (raw.data || []);

    console.log('总字段:', Object.keys(members[0] || {}).join(', '));
    console.log('');
    console.log('第1个成员完整数据：');
    console.log(JSON.stringify(members[0], null, 2));
})().catch(console.error);

// Strapi v5 REST API 默认不返回媒体字段；解决：API URL 加 ?populate=*
// Strapi v5 媒体字段（avatar）返回完整对象 { url, formats: { thumbnail/small/medium/large } }；解决：用 avatar.formats.medium.url 优先
