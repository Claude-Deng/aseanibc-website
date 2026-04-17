/**
 * populate-event-images.js
 * 上传活动封面图和轮播图到 Strapi 并关联
 * 图片来源：../eventPic/
 * CMS目标：Event.coverImage + Event.gallery
 * 匹配方式：用 title 精确匹配
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = '127.0.0.1';
const PORT = 1337;
const FRONTEND_ROOT = path.join(__dirname, '..', '..');

// title → 本地文件配置
const eventConfig = [
    {
        title: '哥本哈根龍舟文化節暨企業家考察團',
        thumb: 'thumb-copenhagen.jpg',
        gallery: ['copenhagen-1.jpg', 'copenhagen-2.jpg', 'copenhagen-3.jpg', 'copenhagen-4.jpg']
    },
    {
        title: '美國費城名校夏令營',
        thumb: 'thumb-summercamp.jpg',
        gallery: ['summer-camp-1.jpg', 'summer-camp-2.jpg', 'summer-camp-3.jpg', 'summer-camp-4.jpg']
    },
    {
        title: '新西蘭光伏+儲能投資+移民項目',
        thumb: 'thumb-nz.jpg',
        gallery: ['nz-1.jpg', 'nz-2.jpg', 'nz-3.jpg', 'nz-4.jpg', 'nz-5.jpg', 'nz-6.jpg']
    },
    {
        title: '中歐論壇暨塞納博覽會',
        thumb: 'thumb-tcm.jpg',
        gallery: ['tcm-1.jpg', 'tcm-2.jpg', 'tcm-3.jpg', 'tcm-4.jpg', 'tcm-5.jpg', 'tcm-6.jpg']
    }
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

async function uploadAndAssociate(docId, fieldName, files) {
    const fileIds = [];
    for (const f of files) {
        const buffer = fs.readFileSync(f.path);
        const res = await uploadFile(f.name, buffer);
        if (res && res.length > 0) {
            fileIds.push(res[0].id);
            console.log(`   📷 上传成功: ${f.name} → id ${res[0].id}`);
        } else {
            console.log(`   ❌ 上传失败: ${f.name}`);
        }
        await new Promise(r => setTimeout(r, 300));
    }
    if (fileIds.length === 0) return false;

    // 关联到条目
    const fieldPayload = fileIds.length === 1 ? fileIds[0] : fileIds;
    const updateRes = await api('PUT', `/api/events/${docId}`, { data: { [fieldName]: fieldPayload } });
    if (updateRes.data || (!updateRes.error && !updateRes.error)) {
        return true;
    } else {
        console.log(`   ❌ 关联失败: ${JSON.stringify(updateRes.error)}`);
        return false;
    }
}

async function main() {
    console.log('=== Event 图片上传 (4个活动) ===\n');

    // 1. 获取活动列表
    const res = await api('GET', '/api/events');
    const events = Array.isArray(res) ? res : (res.data || []);
    const eventMap = {};
    events.forEach(e => { eventMap[e.title] = e.documentId; });

    console.log(`找到 ${events.length} 个活动\n`);

    let ok = 0, fail = 0;
    for (const cfg of eventConfig) {
        const docId = eventMap[cfg.title];
        if (!docId) {
            console.log(`⚠️  CMS未找到: ${cfg.title}`);
            fail++;
            continue;
        }

        console.log(`\n📌 ${cfg.title}`);
        let eventOk = true;

        // 上传播放图
        if (fs.existsSync(path.join(FRONTEND_ROOT, 'eventPic', cfg.thumb))) {
            const thumbResult = await uploadAndAssociate(docId, 'coverImage', [
                { name: cfg.thumb, path: path.join(FRONTEND_ROOT, 'eventPic', cfg.thumb) }
            ]);
            if (!thumbResult) eventOk = false;
        } else {
            console.log(`   ⚠️  缩略图不存在: eventPic/${cfg.thumb}`);
        }

        // 上传轮播图集
        const galleryFiles = cfg.gallery.map(g => ({ name: g, path: path.join(FRONTEND_ROOT, 'eventPic', g) }));
        const missingGallery = galleryFiles.filter(f => !fs.existsSync(f.path));
        if (missingGallery.length > 0) {
            missingGallery.forEach(f => console.log(`   ⚠️  轮播图缺失: eventPic/${f.name}`));
        }
        const galleryResult = await uploadAndAssociate(docId, 'gallery', galleryFiles);
        if (!galleryResult) eventOk = false;

        if (eventOk) { ok++; console.log(`✅ ${cfg.title} 完成`); }
        else { fail++; }

        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n完成: 成功 ${ok} / 失败 ${fail} / 共 ${eventConfig.length}`);
}

main().catch(console.error);
