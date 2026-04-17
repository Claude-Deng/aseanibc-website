const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 1337,
    path: '/api/team-members',
    method: 'GET'
};

console.log('Connecting to 127.0.0.1:1337...');
const req = http.request(options, res => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Data:', data.slice(0, 300)));
});
req.on('error', e => console.error('Error:', e.message));
req.setTimeout(5000, () => { console.log('timeout'); req.destroy(); });
req.end();
