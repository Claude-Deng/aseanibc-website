const http=require('http');
const token='4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989';
const endpoints=[
  ['Home Page','/api/home-page'],
  ['About Page','/api/about-page'],
  ['Cases Page','/api/cases-page?populate=testimonials'],
  ['Services','/api/services?pagination[pageSize]=100'],
  ['Events','/api/events?pagination[pageSize]=100'],
  ['Partners','/api/partners?pagination[pageSize]=100'],
  ['Team Members','/api/team-members?pagination[pageSize]=100'],
  ['Testimonials','/api/testimonials?pagination[pageSize]=100'],
  ['Contact Page','/api/contact-page']
];
let done=0;
endpoints.forEach(([name,path])=>{
  const r=http.request({hostname:'localhost',port:1337,path,headers:{'Authorization':'Bearer '+token}},res=>{
    let d='';res.on('data',c=>d+=c);
    res.on('end',()=>{
      try{
        const j=JSON.parse(d);
        const isArray=Array.isArray(j.data);
        const isObj=!isArray && j.data && typeof j.data==='object';
        let cnt='0';
        if(isArray) cnt=j.data.length+'条';
        else if(isObj) cnt=Object.keys(j.data).length+'字段';
        const err=j.error?' ERR:'+j.error.status:'';
        console.log((res.statusCode===200?'✅':'❌')+' ['+name+'] '+cnt+err);
        if(isArray && j.data.length>0){
          j.data.forEach(item=>{
            const a=item.attributes||item;
            const label=a.name||a.title||a.slug||'(unnamed)';
            console.log('   -',label);
          });
        } else if(isObj && Object.keys(j.data).length>0){
          console.log('   单例内容已写入');
        }
      }catch(e){console.log('❌ ['+name+'] 解析失败 ('+res.statusCode+'):',e.message);}
      done++;if(done===endpoints.length)console.log('\n=== 全部检查完毕 ===');
    });
  });r.end();
})
