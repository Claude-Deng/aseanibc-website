const axios = require('axios');

const API = 'http://127.0.0.1:1337/api';
const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';

async function main() {
    const res = await axios.get(`${API}/team-members`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const members = Array.isArray(res.data) ? res.data : res.data.data;
    
    const groups = {};
    members.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    members.forEach(m => {
        const g = m.teamGroup || 'other';
        if (!groups[g]) groups[g] = [];
        groups[g].push(`${m.name} (${m.title})`);
    });
    
    console.log('\n团队分组情况：');
    Object.entries(groups).forEach(([g, members]) => {
        console.log(`\n[${g}] 共 ${members.length} 人：`);
        members.forEach(n => console.log(`  - ${n}`));
    });
}

main().catch(console.error);
