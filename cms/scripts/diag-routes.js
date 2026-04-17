const { Strapi } = require('./node_modules/@strapi/strapi/dist/index.js');

async function diag() {
  const app = await Strapi({ autoFlush: false }).load();
  const routes = app.container.get('routes').routes();
  const contact = routes.filter(r => r.name && r.name.includes('contact'));
  const about = routes.filter(r => r.name && r.name.includes('about'));
  const all = routes.map(r => `${r.method} ${r.path} -> ${r.name}`);

  console.log('=== contact-page 相关路由 ===');
  contact.forEach(r => console.log(`  ${r.method} ${r.path} -> ${r.name}`));
  if (contact.length === 0) console.log('  (无)');

  console.log('\n=== about-page 相关路由 ===');
  about.forEach(r => console.log(`  ${r.method} ${r.path} -> ${r.name}`));

  console.log('\n=== 所有路由 ===');
  all.forEach(r => console.log(' ', r));

  process.exit(0);
}

diag().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
