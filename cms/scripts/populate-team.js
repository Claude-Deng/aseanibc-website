/**
 * populate-team.js
 * 来源：team.html 第86-561行
 * 共17位团队成员，4个分组
 * 注意：照片需在后台手动上传
 */

const http = require('http');

const TOKEN = '4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const HOST = 'localhost';
const PORT = 1337;

const members = [
  // ===== 核心管理团队 (china-hk) =====
  {
    name: '盛敏琥',
    slug: 'sheng-minhu',
    title: '中國法律顧問',
    teamGroup: 'china-hk',
    shortDescription: '精通中國企業出海法律架構、合規與爭議解決，具備豐富的跨境投資與併購經驗。',
    fullDescription: '盛敏琥先生精通中國企業出海法律架構、合規與爭議解決，具備豐富的跨境投資與併購經驗。他長期為中資企業提供法律支持，涵蓋公司設立、股權架構設計、合同談判與風險防控等領域，能夠幫助企業在複雜的國際環境中穩健前行。',
    order: 1,
  },
  {
    name: '孟晗',
    slug: 'meng-han',
    title: '跨境與公司法律顧問',
    teamGroup: 'china-hk',
    shortDescription: '專注跨境投融資、知識產權與公司治理，為企業全球化布局提供全方位法律保障。',
    fullDescription: '孟晗先生專注跨境投融資、知識產權與公司治理，為企業全球化布局提供全方位法律保障。他在跨國併購、技術轉讓、品牌保護等領域擁有深厚專業知識，能夠協助企業在國際市場中建立穩固的法律基礎，規避潛在風險。',
    order: 2,
  },
  {
    name: '鄧葆禎',
    slug: 'deng-bao-zhen',
    title: '戰略與資源協同顧問',
    teamGroup: 'china-hk',
    shortDescription: '擅長產業生態構建、創新資產架構與品牌戰略，助力企業實現可持續增長。',
    fullDescription: '鄧葆禎先生擅長產業生態構建、創新資產架構與品牌戰略，助力企業實現可持續增長。他在企業戰略規劃、資源整合與價值創造方面具有獨到見解，能夠為企業量身定制發展路徑，實現從戰略到執行的無縫銜接。',
    order: 3,
  },

  // ===== 香港团队 (hk) =====
  {
    name: '陳志遠',
    slug: 'chen-zhi-yuan',
    title: '跨境商務高級顧問',
    teamGroup: 'hk',
    shortDescription: '香港資深商業顧問，20年跨境投資與企業架構經驗，專精中港兩地商務整合。',
    fullDescription: '陳志遠先生是香港資深商業顧問，擁有20年跨境投資與企業架構經驗，專精中港兩地商務整合。他長期為中資企業提供香港及國際市場的戰略諮詢服務，涵蓋公司設立、稅務籌劃、資金運作與合規管理，是企業走向國際化的可靠夥伴。',
    order: 4,
  },
  {
    name: '李明輝',
    slug: 'li-ming-hui',
    title: '東南亞商務顧問',
    teamGroup: 'sea',
    shortDescription: '泰籍華人，15年東南亞市場開拓經驗，精通泰語、中文與英文，熟悉東盟各國商業環境。',
    fullDescription: '李明輝先生是泰籍華人，擁有15年東南亞市場開拓經驗，精通泰語、中文與英文，熟悉東盟各國商業環境。他在泰國、越南、馬來西亞等國擁有廣泛的政府與商業資源，能夠為企業提供從市場進入到本地運營的全流程支持。',
    order: 5,
  },

  // ===== 美國團隊 (usa) =====
  {
    name: '張志遠',
    slug: 'zhang-zhi-yuan',
    title: '跨境法務顧問',
    teamGroup: 'usa',
    shortDescription: '留美法學碩士，12年跨境法律服務經驗，專精國際貿易、投資合規與爭議解決。',
    fullDescription: '張志遠先生是留美法學碩士，擁有12年跨境法律服務經驗，專精國際貿易、投資合規與爭議解決。他熟悉中美兩國法律體系，能夠為企業提供跨境交易、知識產權保護、勞動合規等全方位的法律支持，確保企業在全球化進程中合規運營。',
    order: 6,
  },
  {
    name: '王建國',
    slug: 'wang-jian-guo',
    title: '法商合規顧問',
    teamGroup: 'usa',
    shortDescription: '美國法學碩士，10年法商合規經驗，專注企業合規體系建設與風險管理。',
    fullDescription: '王建國先生是美國法學碩士，擁有10年法商合規經驗，專注企業合規體系建設與風險管理。他在跨國企業合規、反洗錢、數據保護等領域具有豐富實踐經驗，能夠幫助企業建立完善的合規框架，應對日益嚴格的國際監管要求。',
    order: 7,
  },
  {
    name: '邁克爾·布朗',
    slug: 'michael-brown',
    title: '東南亞市場高級顧問',
    teamGroup: 'usa',
    shortDescription: '美國資深商務顧問，18年東南亞市場研究與拓展經驗，擅長市場進入策略與渠道建設。',
    fullDescription: '布朗先生是美國資深商務顧問，擁有18年東南亞市場研究與拓展經驗，擅長市場進入策略與渠道建設。他對東南亞各國的消費市場、分銷網絡與商業文化有深入理解，能夠為企業制定切實可行的市場拓展方案，加速業務落地。',
    order: 8,
  },

  // ===== 東南亞本地顧問團隊 (sea) =====
  {
    name: '頌猜·提拉薩庫爾',
    slug: 'songchai-tirasakul',
    title: '泰國商務顧問',
    teamGroup: 'sea',
    shortDescription: '精通泰國工商、稅務、外資政策，15年本地商務經驗，擁有廣泛的政府與商業資源。',
    fullDescription: '颂猜·提拉萨库尔先生精通泰國工商、稅務、外資政策，擁有15年本地商務經驗。他在泰國投資促進委員會（BOI）、稅務部門與工商界建立了深厚的人脈關係，能夠為外資企業提供從公司註冊、稅務籌劃到政府關係維護的一站式服務。',
    order: 9,
  },
  {
    name: '阮氏玄',
    slug: 'nguyen-thi-huyen',
    title: '越南商務顧問',
    teamGroup: 'sea',
    shortDescription: '熟悉越南製造業政策，對接越南工業區管理局與核心資源，12年本地商務經驗。',
    fullDescription: '阮氏玄女士熟悉越南製造業政策，對接越南工業區管理局與核心資源，擁有12年本地商務經驗。她在越南工業地產、製造業投資與供應鏈整合方面具有豐富經驗，能夠幫助製造型企業在越南找到最優的生產基地與合作夥伴。',
    order: 10,
  },
  {
    name: '陳嘉怡',
    slug: 'chen-jia-yi',
    title: '新加坡金融與離岸架構顧問',
    teamGroup: 'sea',
    shortDescription: '精通新加坡金融、離岸架構，對接新加坡金融管理局資源，10年跨境金融服務經驗。',
    fullDescription: '陈嘉怡女士精通新加坡金融、離岸架構，對接新加坡金融管理局資源網絡。她在跨境金融、離岸公司架構設計和財富管理領域有豐富經驗，能夠為中資企業提供專業的新加坡落地解決方案。她與新加坡多家銀行、律師事務所和會計師事務所建立了緊密合作關係，能夠為客戶提供一站式的專業服務。',
    order: 11,
  },
  {
    name: '安德里亞·蘇善托',
    slug: 'andrea-susanto',
    title: '印尼商務顧問',
    teamGroup: 'sea',
    shortDescription: '熟悉印尼產業市場，對接本地製造與資源鏈下游鏈，14年本地商務經驗。',
    fullDescription: '安德里亚·苏善托先生熟悉印尼產業市場，對接本地製造與資源鏈下游鏈，擁有14年本地商務經驗。他在印尼的製造業、礦業與農業領域擁有廣泛的資源網絡，能夠幫助企業在這個充滿機遇的市場中找到合適的合作夥伴與投資機會。',
    order: 12,
  },
  {
    name: '凱真泰·頌汶',
    slug: 'kaojentaisombun',
    title: '泰國金融與離岸架構顧問',
    teamGroup: 'sea',
    shortDescription: '精通泰國金融、離岸架構，對接泰國金融管理局資源，13年跨境金融服務經驗。',
    fullDescription: '凱真泰·颂汶先生精通泰國金融、離岸架構，對接泰國金融管理局資源，擁有13年跨境金融服務經驗。他在泰國的銀行業、證券業與保險業擁有深厚的人脈關係，能夠為企業提供融資、外匯管理與財富規劃等專業服務。',
    order: 13,
  },

  // ===== 歐洲團隊 (europe) =====
  {
    name: '彼得·德恩巴赫',
    slug: 'peter-deernbach',
    title: '知識產權與品牌顧問',
    teamGroup: 'europe',
    shortDescription: '台灣執業律師，20年知識產權法律經驗，專精品牌保護與專利策略。',
    fullDescription: '彼得·德恩巴赫先生是台灣執業律師，擁有20年知識產權法律經驗，專精品牌保護與專利策略。他在商標註冊、專利申請、版權保護與知識產權爭議解決方面具有豐富經驗，能夠幫助企業在全球範圍內保護其創新成果與品牌價值。',
    order: 14,
  },
  {
    name: '威廉·克萊門茨',
    slug: 'william-clements',
    title: '英國房地產與投資顧問',
    teamGroup: 'europe',
    shortDescription: '倫敦執業房地產顧問，16年英國與歐洲房地產投資經驗，專精商業地產與住宅開發。',
    fullDescription: '威廉·克莱门茨先生是倫敦執業房地產顧問，擁有16年英國與歐洲房地產投資經驗，專精商業地產與住宅開發。他在倫敦、曼徹斯特等英國主要城市的房地產市場擁有深厚的人脈與專業知識，能夠為投資者提供從項目篩選、盡職調查到交易完成的全程服務。',
    order: 15,
  },
  {
    name: '米歇爾·龐薩爾',
    slug: 'michel-ponsalle',
    title: '競爭與分銷法律顧問',
    teamGroup: 'europe',
    shortDescription: '巴黎執業律師，18年歐盟競爭法與分銷法律經驗，專精反壟斷與分銷協議。',
    fullDescription: '米歇尔·庞萨尔先生是巴黎執業律師，擁有18年歐盟競爭法與分銷法律經驗，專精反壟斷與分銷協議。他在歐盟的反壟斷調查、併購審查與分銷網絡合規方面具有豐富經驗，能夠幫助企業在複雜的歐盟監管環境中合規運營。',
    order: 16,
  },
  {
    name: '克里斯·哈特',
    slug: 'chris-hart',
    title: '蘇格蘭房地產與商務顧問',
    teamGroup: 'europe',
    shortDescription: '愛丁堡資深房地產顧問，15年蘇格蘭商業地產經驗，專精工業地產與物流設施。',
    fullDescription: '克里斯·哈特先生是愛丁堡資深房地產顧問，擁有15年蘇格蘭商業地產經驗，專精工業地產與物流設施。他在蘇格蘭的工業地產市場擁有廣泛的資源網絡，能夠為製造與物流企業提供從選址、租賃到購置的專業服務。',
    order: 17,
  },
  {
    name: '麥克·帕蒂森',
    slug: 'mike-patison',
    title: '國際併購與房地產顧問',
    teamGroup: 'europe',
    shortDescription: '倫敦資深併購顧問，22年國際併購與房地產投資經驗，專精跨國併購與資產重組。',
    fullDescription: '麦克·帕蒂森先生是倫敦資深併購顧問，擁有22年國際併購與房地產投資經驗，專精跨國併購與資產重組。他在歐洲、中東與亞太地區的跨境併購交易方面具有豐富經驗，能夠為企業提供從戰略規劃、目標篩選到交易執行的全程顧問服務。',
    order: 18,
  },
  {
    name: '艾麗西亞·湯普森',
    slug: 'alicia-thompson',
    title: '歐盟合規與數據保護顧問',
    teamGroup: 'europe',
    shortDescription: '阿姆斯特丹執業合規顧問，14年歐盟合規與數據保護經驗，專精GDPR與數字合規。',
    fullDescription: '艾丽西亚·汤普森女士是阿姆斯特丹執業合規顧問，擁有14年歐盟合規與數據保護經驗，專精GDPR與數字合規。她在數據保護影響評估、隱私政策設計與跨境數據傳輸合規方面具有豐富經驗，能夠幫助企業在歐盟市場中合規處理個人數據。',
    order: 19,
  },
];

function post(path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = http.request({ hostname: HOST, port: PORT, path, method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch (e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function main() {
  console.log(`开始写入 ${members.length} 位团队成员...\n`);
  let success = 0, fail = 0;
  for (const m of members) {
    const result = await post('/api/team-members', { data: m });
    if (result.status === 200 || result.status === 201) {
      console.log(`✅ [${m.teamGroup}] ${m.name}`);
      success++;
    } else {
      console.log(`❌ [${m.teamGroup}] ${m.name}: ${result.status}`);
      fail++;
    }
  }
  console.log(`\n完成：${success}成功，${fail}失败`);
}

main();
