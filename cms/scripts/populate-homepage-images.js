/**
 * populate-homepage-images.js
 * 上传首页图片到 Strapi 并关联
 * 图片来源：../indexPic/
 * CMS目标：HomePage.bannerImage + HomePage.coreValuesImage
 * Homepage 是单例类型，PUT 路径为 /api/home-page
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = '127.0.0.1';
const PORT = 1337;
const FRONTEND_ROOT = path.join(__dirname, '..', '..');

const images = [
    { field: 'bannerImage',      file: 'banner@2x.png' },
    { field: 'coreValuesImage', file: 'img_p@2x.png'  },
];

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
        const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
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
    console.log('=== Homepage 图片上传 ===\n');

    // Homepage 是单例类型，GET /api/home-page
    const res = await api('GET', '/api/home-page');
    console.log('Homepage 响应:', JSON.stringify(res).substring(0, 200));

    let ok = 0;
    for (const img of images) {
        const localPath = path.join(FRONTEND_ROOT, 'indexPic', img.file);
        if (!fs.existsSync(localPath)) {
            console.log(`⚠️  本地文件不存在: indexPic/${img.file}`);
            continue;
        }

        try {
            const buffer = fs.readFileSync(localPath);
            const uploadRes = await uploadFile(img.file, buffer);
            if (uploadRes && uploadRes.length > 0) {
                const fileId = uploadRes[0].id;
                // 单例类型 PUT 路径不带 ID
                const updateRes = await api('PUT', '/api/home-page', { data: { [img.field]: fileId } });
                if (updateRes.data || (!updateRes.error)) {
                    console.log(`✅ ${img.file} → ${img.field} (id ${fileId})`);
                    ok++;
                } else {
                    console.log(`❌ ${img.field}: 关联失败 ${JSON.stringify(updateRes.error)}`);
                }
            } else {
                console.log(`❌ ${img.field}: 上传返回空`);
            }
        } catch (e) {
            console.log(`❌ ${img.field}: ${e.message}`);
        }

        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n完成: 成功 ${ok} / 共 ${images.length}`);
}

main().catch(console.error);
