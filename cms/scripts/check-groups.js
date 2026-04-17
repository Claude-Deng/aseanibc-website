// 验证 teamGroup 分组实际值
const API = 'http://127.0.0.1:1337/api';
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

const http = require('http');

function fetchJson(url, token) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            headers: { Authorization: `Bearer ${token}` }
        };
        const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch(e) { reject(new Error('JSON parse error: ' + data.slice(0, 200))); }
            });
        });
        req.on('error', reject);
        req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
        req.end();
    });
}

(async () => {
    try {
        const raw = await fetchJson(`${API}/team-members`, TOKEN);
        const members = Array.isArray(raw) ? raw : (raw.data || []);

        const groups = {};
        members.forEach(m => {
            const g = m.teamGroup || '(空)';
            if (!groups[g]) groups[g] = [];
            groups[g].push({ name: m.name, title: m.title, order: m.order });
        });

        console.log(`总人数: ${members.length}\n`);
        Object.entries(groups).forEach(([g, list]) => {
            list.sort((a, b) => (a.order || 999) - (b.order || 999));
            console.log(`【${g}】共 ${list.length} 人：`);
            list.forEach(m => console.log(`  ${m.order}. ${m.name} (${m.title})`));
            console.log('');
        });
    } catch(e) {
        console.error('Error:', e.message);
    }
})();
