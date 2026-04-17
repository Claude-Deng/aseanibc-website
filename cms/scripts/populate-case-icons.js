/**
 * populate-case-icons.js
 * 上传案例分类图标到 Strapi 并关联
 * 图片来源：../casePic/icom_*.png（6张）
 * CMS目标：Case.categoryIcon
 * 匹配方式：用 slug 精确匹配
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = '127.0.0.1';
const PORT = 1337;
const FRONTEND_ROOT = path.join(__dirname, '..', '..');

// slug → categoryIcon 文件名（来自 cases.html 的 img src）
const slugIconMap = {
    'case-market-entry':       'icom_k@2x.png',
    'case-investment':         'icom_z@2x.png',
    'case-regional-operation': 'icom_x@2x.png',
    'case-compliance':         'icom_c@2x.png',
    'case-brand-ip':           'icom_v@2x.png',
    'case-asset-optimization': 'icom_b@2x.png',
};

function api(method, pathStr, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : undefined;
        const opts = {
            hostname: HOST, port: PORT, path: pathStr, method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
            }
        };
        const req = http.request(opts, res => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(d); } });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function uploadFile(filename, buffer) {
    return new Promise((resolve, reject) => {
        const boundary = '----FormBoundary' + Math.random().toString(16).slice(2);
        const ext = path.extname(filename);
        const mimeType = 'image/png';
        const body = Buffer.concat([
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`),
            buffer,
            Buffer.from(`\r\n--${boundary}--\r\n`)
        ]);
        const req = http.request({
            hostname: HOST, port: PORT, path: '/api/upload', method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length
            }
        }, res => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(new Error(d)); } });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function main() {
    console.log('=== Case 分类图标上传 (6张) ===\n');

    const res = await api('GET', '/api/cases');
    const cases = Array.isArray(res) ? res : (res.data || []);
    const caseMap = {};
    cases.forEach(c => { caseMap[c.slug] = c.documentId; });

    console.log(`找到 ${cases.length} 个案例\n`);

    const slugs = Object.keys(slugIconMap);
    let ok = 0, fail = 0;

    for (const slug of slugs) {
        const docId = caseMap[slug];
        const iconFile = slugIconMap[slug];
        const localPath = path.join(FRONTEND_ROOT, 'casePic', iconFile);

        if (!docId) {
            console.log(`⚠️  CMS未找到slug: ${slug}`);
            fail++;
            continue;
        }
        if (!fs.existsSync(localPath)) {
            console.log(`⚠️  本地文件不存在: casePic/${iconFile}`);
            fail++;
            continue;
        }

        try {
            const buffer = fs.readFileSync(localPath);
            const uploadRes = await uploadFile(iconFile, buffer);

            if (uploadRes && uploadRes.length > 0) {
                const fileId = uploadRes[0].id;
                const updateRes = await api('PUT', `/api/cases/${docId}`, { data: { categoryIcon: fileId } });
                if (updateRes.data || (!updateRes.error)) {
                    console.log(`✅ ${iconFile} → ${slug} (id ${fileId})`);
                    ok++;
                } else {
                    console.log(`❌ ${slug}: 关联失败 ${JSON.stringify(updateRes.error)}`);
                    fail++;
                }
            } else {
                console.log(`❌ ${slug}: 上传返回空`);
                fail++;
            }
        } catch (e) {
            console.log(`❌ ${slug}: ${e.message}`);
            fail++;
        }

        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n完成: 成功 ${ok} / 失败 ${fail} / 共 ${slugs.length}`);
}

main().catch(console.error);
