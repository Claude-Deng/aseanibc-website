/**
 * populate-team-images.js
 * 上传团队成员头像到 Strapi 并关联
 * 图片来源：../teamPic/xxx.jpg（37个文件，包含简化/繁体版本）
 * CMS目标：TeamMember.avatar
 * 匹配方式：用 slug 精确匹配
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = '127.0.0.1';
const PORT = 1337;
const FRONTEND_ROOT = path.join(__dirname, '..', '..');

// slug → 本地文件名（手动映射，确保能找到）
const slugFileMap = {
    'sheng-minhu':       '盛敏琥.jpg',
    'meng-han':          '孟晗.jpg',
    'deng-bao-zhen':     '邓葆祯.jpg',
    'chen-zhi-yuan':     '陳志远.jpg',
    'li-ming-hui':       '李明辉.jpg',
    'zhang-zhi-yuan':    '張志远.jpg',
    'wang-jian-guo':     '王建国.jpg',
    'michael-brown':     '迈克尔·布朗.jpg',
    'songchai-tirasakul':'颂猜·提拉萨库尔.jpg',
    'nguyen-thi-huyen':  '阮氏玄.jpg',
    'chen-jia-yi':       '陈嘉怡.jpg',
    'andrea-susanto':    '安德里亚·苏善托.jpg',
    'kaojentaisombun':   '凯真泰·颂汶.jpg',
    'peter-deernbach':   '彼得·德恩巴赫.jpg',
    'william-clements':  '威廉·克莱门茨.jpg',
    'michel-ponsalle':   '米歇尔·庞萨尔.jpg',
    'chris-hart':        '克里斯·哈特.jpg',
    'mike-patison':      '麦克·帕蒂森.jpg',
    'alicia-thompson':   '艾丽西亚·汤普森.jpg',
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
    console.log('=== TeamMember 头像上传 (19张) ===\n');

    // 1. 获取团队成员列表（用 slug 做匹配）
    const res = await api('GET', '/api/team-members');
    const members = Array.isArray(res) ? res : (res.data || []);
    const memberMap = {};
    members.forEach(m => { memberMap[m.slug] = m.documentId; });

    console.log(`成员数量: ${members.length}\n`);

    const slugs = Object.keys(slugFileMap);
    let ok = 0, fail = 0;

    for (const slug of slugs) {
        const docId = memberMap[slug];
        const localFile = slugFileMap[slug];
        const localPath = path.join(FRONTEND_ROOT, 'teamPic', localFile);

        if (!docId) {
            console.log(`⚠️  CMS未找到slug: ${slug}`);
            fail++;
            continue;
        }
        if (!fs.existsSync(localPath)) {
            console.log(`⚠️  本地文件不存在: teamPic/${localFile}`);
            fail++;
            continue;
        }

        try {
            const buffer = fs.readFileSync(localPath);
            const uploadRes = await uploadFile(localFile, buffer);

            if (uploadRes && uploadRes.length > 0) {
                const fileId = uploadRes[0].id;
                // Strapi v5 PUT 格式
                const updateRes = await api('PUT', `/api/team-members/${docId}`, { data: { avatar: fileId } });
                if (updateRes.data || (!updateRes.error)) {
                    console.log(`✅ ${localFile} (${slug})`);
                    ok++;
                } else {
                    console.log(`❌ ${slug}: 更新失败 ${JSON.stringify(updateRes.error)}`);
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
