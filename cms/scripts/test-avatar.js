// 验证 avatar 字段结构
const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

function fetchJson(path) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL('http://127.0.0.1:1337' + path);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
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
    const raw = await fetchJson('/api/team-members');
    const members = Array.isArray(raw) ? raw : (raw.data || []);

    console.log('前3个成员的 avatar 字段结构：\n');
    members.slice(0, 3).forEach(m => {
        console.log(`【${m.name}】`);
        console.log('  avatar:', JSON.stringify(m.avatar));
        console.log('');
    });
})().catch(console.error);
