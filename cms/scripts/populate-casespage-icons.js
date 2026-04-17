/**
 * populate-casespage-icons.js
 * 完整处理 CasesPage 组件 + Testimonial 头像
 * 图片来源：../casePic/
 * 1. CasesPage: caseTypes(6个) + industries(5个) 可重复组件含图标
 * 2. Testimonials: 前3条证言的头像
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = '127.0.0.1';
const PORT = 1337;
const FRONTEND_ROOT = path.join(__dirname, '..', '..');

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

async function uploadIcon(filename) {
    const localPath = path.join(FRONTEND_ROOT, 'casePic', filename);
    if (!fs.existsSync(localPath)) {
        console.log(`  ⚠️  文件不存在: casePic/${filename}`);
        return null;
    }
    const buffer = fs.readFileSync(localPath);
    const res = await uploadFile(filename, buffer);
    if (res && res.length > 0) {
        console.log(`  ✅ ${filename} → id ${res[0].id}`);
        return res[0].id;
    } else {
        console.log(`  ❌ 上传失败: ${filename}`);
        return null;
    }
}

// 6个 caseTypes 数据（来自 cases.html）
const caseTypesData = [
    { icon: 'icom_k@2x.png', title: '企業市場進入與落地', slogan: '以清晰判斷為起點，協助企業穩健完成市場落地', linkSlug: 'case-market-entry' },
    { icon: 'icom_z@2x.png', title: '跨境投資與工廠設立', slogan: '從選址到投產，全流程推進可控的產能出海布局', linkSlug: 'case-investment' },
    { icon: 'icom_x@2x.png', title: '區域運營與業務擴展', slogan: '由單點落地升級為可持續的區域運營體系', linkSlug: 'case-regional-operation' },
    { icon: 'icom_c@2x.png', title: '合規與結構調整', slogan: '以合規為基礎，重構支撐企業長期發展的結構', linkSlug: 'case-compliance' },
    { icon: 'icom_v@2x.png', title: '品牌與知識產權出海', slogan: '為品牌建立可延展、可防護的跨境保護體系', linkSlug: 'case-brand-ip' },
    { icon: 'icom_b@2x.png', title: '跨境資金與資產優化', slogan: '設計清晰合規的資金路徑，降低跨境資產風險', linkSlug: 'case-asset-optimization' },
];

// 5个 industries 数据（来自 cases.html）
const industriesData = [
    { icon: 'icom_qw@2x.png', industry: '跨境貿易', description: '供應商' },
    { icon: 'icom_qe@2x.png', industry: '製造業', description: '海外建廠' },
    { icon: 'icom_qr@2x.png', industry: '服務業', description: '跨境拓展' },
    { icon: 'icom_qt@2x.png', industry: '消費品牌', description: '本地化運營' },
    { icon: 'icom_qy@2x.png', industry: '數字化業務', description: '跨境落地' },
];

// 前3个 testimonial（来自 HTML 中使用的）
const testimonialData = [
    { docId: 'krmlb58wjxke27ovn62hqgt8', avatar: 'icom_qa@2x.png' },  // 張總
    { docId: 'b99sghzrzu26j27nq9og871i', avatar: 'icom_qo@2x.png' },  // 李總
    { docId: 'z37gfjvpw24ujzwbhxpgl14i', avatar: 'icom_qp@2x.png' },  // 王總
];

async function main() {
    console.log('=== CasesPage 完整上传 ===\n');

    // ---- 1. 上传 caseTypes 图标 ----
    console.log('📁 caseTypes 图标 (6个):');
    const caseTypeIconIds = [];
    for (const ct of caseTypesData) {
        const id = await uploadIcon(ct.icon);
        caseTypeIconIds.push(id);
        await new Promise(r => setTimeout(r, 200));
    }

    // ---- 2. 上传 industries 图标 ----
    console.log('\n📁 industries 图标 (5个):');
    const industryIconIds = [];
    for (const ind of industriesData) {
        const id = await uploadIcon(ind.icon);
        industryIconIds.push(id);
        await new Promise(r => setTimeout(r, 200));
    }

    // ---- 3. 上传 testimonial 头像 ----
    console.log('\n📁 testimonial 头像 (3个):');
    const testimonialAvatarIds = [];
    for (const t of testimonialData) {
        const id = await uploadIcon(t.avatar);
        testimonialAvatarIds.push({ docId: t.docId, avatarId: id });
        await new Promise(r => setTimeout(r, 200));
    }

    // ---- 4. 组装 CasesPage payload ----
    console.log('\n💾 更新 CasesPage...');
    const caseTypesPayload = caseTypesData.map((ct, i) => ({
        icon: caseTypeIconIds[i],
        title: ct.title,
        slogan: ct.slogan,
        linkSlug: ct.linkSlug,
    }));

    const industriesPayload = industriesData.map((ind, i) => ({
        icon: industryIconIds[i],
        industry: ind.industry,
        description: ind.description,
    }));

    const updateRes = await api('PUT', '/api/cases-page', {
        data: {
            caseTypes: caseTypesPayload,
            industries: industriesPayload,
        }
    });

    if (updateRes.data || (!updateRes.error)) {
        console.log('✅ CasesPage 更新成功！');
    } else {
        console.log('❌ CasesPage 更新失败:', JSON.stringify(updateRes.error));
    }

    // ---- 5. 更新 testimonial 头像 ----
    console.log('\n💾 更新 testimonials 头像...');
    for (const t of testimonialAvatarIds) {
        if (!t.avatarId) continue;
        const res = await api('PUT', `/api/testimonials/${t.docId}`, { data: { reviewerAvatar: t.avatarId } });
        if (res.data || (!res.error)) {
            console.log(`  ✅ testimonial ${t.docId.substring(0,8)}... → avatar id ${t.avatarId}`);
        } else {
            console.log(`  ❌ testimonial 更新失败`);
        }
        await new Promise(r => setTimeout(r, 200));
    }

    console.log('\n🎉 全部完成！');
}

main().catch(console.error);
