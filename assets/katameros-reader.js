/* Text reader for katameros.app's Arabic Van Dyck lectionary. */
window.KatamerosReader = (() => {
  const key='coptic:katameros:v1', memory=new Map();
  let controller, serial=0;
  const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!=null)el.textContent=text;if(cls)el.className=cls;return el;};
  function valid(data,date){return data?.date===date&&Array.isArray(data.sections)&&data.sections.some(s=>s.subSections?.some(sub=>sub.readings?.length));}
  function readCache(date){
    if(memory.has(date))return memory.get(date);
    try{const entries=JSON.parse(localStorage.getItem(key)||'[]');const entry=Array.isArray(entries)&&entries.find(x=>valid(x,date));if(entry){memory.set(date,entry);return entry;}}catch{}return null;
  }
  function saveCache(data){
    memory.set(data.date,data);if(memory.size>20)memory.delete(memory.keys().next().value);
    try{let entries=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(entries))entries=[];entries=entries.filter(x=>x?.date!==data.date);entries.push(data);localStorage.setItem(key,JSON.stringify(entries.slice(-20)));return true;}catch{return false;}
  }
  function paragraphs(html,parent){
    // Parse in an inert document and copy text only. No upstream markup, URLs or scripts enter the reader.
    const doc=new DOMParser().parseFromString(String(html||''),'text/html');
    doc.querySelectorAll('script,style,iframe,object,embed,template').forEach(el=>el.remove());
    doc.querySelectorAll('br').forEach(el=>el.replaceWith(doc.createTextNode('\n')));
    doc.querySelectorAll('p,div,h1,h2,h3,h4,li').forEach(el=>el.append(doc.createTextNode('\n\n')));
    for(const text of (doc.body.textContent||'').split(/\n\s*\n/)){if(text.trim())parent.append(node('p',text.trim()));}
  }
  function render(host,data,offline,saved){
    const fragment=document.createDocumentFragment();
    const hero=node('header',null,'kat-day-heading');
    const date=new Date(data.date+'T12:00:00');
    hero.append(node('p',new Intl.DateTimeFormat('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date),'kat-gregorian'));
    const parts=String(data.copticDate||'').split('/');
    const months=['توت','بابه','هاتور','كيهك','طوبه','أمشير','برمهات','برموده','بشنس','بؤونه','أبيب','مسرى','النسيء'];
    if(parts.length===3&&months[Number(parts[1])-1])hero.append(node('h3',`${Number(parts[0]).toLocaleString('ar-EG')} ${months[Number(parts[1])-1]} ${Number(parts[2]).toLocaleString('ar-EG',{useGrouping:false})} للشهداء`));
    else {try{const formatter=new Intl.DateTimeFormat('ar-EG-u-ca-coptic',{day:'numeric',month:'long',year:'numeric'});if(formatter.resolvedOptions().calendar==='coptic')hero.append(node('h3',formatter.formatToParts(date).filter(p=>p.type!=='era').map(p=>p.value).join('').trim()+' للشهداء'));}catch{}}
    if(typeof data.title==='string'&&data.title.trim())hero.append(node('p',data.title,'kat-occasion'));
    // Period metadata is optional; do not invent a feast if the upstream has no title.
    if(typeof data.periodInfo==='string'&&data.periodInfo.trim())hero.append(node('p',data.periodInfo,'kat-occasion'));
    const status=node('p',offline?'قراءات محفوظة على جهازك — تعمل بدون إنترنت.':saved?'تم حفظ هذا اليوم على جهازك للقراءة بدون إنترنت.':'القراءات متاحة الآن؛ تعذر حفظ نسخة على الجهاز.','kat-cache-status');status.setAttribute('role','status');hero.append(status);fragment.append(hero);
    const tools=node('div',null,'kat-font-tools');
    for(const [label,delta] of [['تصغير الخط',-.1],['تكبير الخط',.1]]){const button=node('button',delta>0?'أ+':'أ−','kh-button');button.type='button';button.setAttribute('aria-label',label);button.addEventListener('click',()=>{const size=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reader-font'))||1.45;const next=Math.max(1,Math.min(2.2,Math.round((size+delta)*100)/100));document.documentElement.style.setProperty('--reader-font',next+'rem');window.setAppReaderFont?.(next);});tools.append(button);}hero.append(tools);
    const nav=node('nav',null,'kat-section-nav');nav.setAttribute('aria-label','أقسام قراءات اليوم');
    const sections=node('div',null,'kat-sections');
    (data.sections||[]).forEach((section,i)=>{
      const id='kat-section-'+i;const link=node('a',section.title||'قراءات','kat-section-link');link.href='#'+id;nav.append(link);
      const article=node('section',null,'kat-service');article.id=id;article.append(node('h3',section.title||'قراءات'));
      (section.subSections||[]).forEach(sub=>{
        const block=node('section',null,'kat-reading-group');block.append(node('h4',sub.title||'القراءة'));
        if(sub.introduction)block.append(node('p',sub.introduction,'kat-liturgical'));
        (sub.readings||[]).forEach(reading=>{
          const item=node('article',null,'kat-reading');
          if(reading.title)item.append(node('h5',reading.title));
          if(reading.introduction)item.append(node('p',reading.introduction,'kat-liturgical'));
          (reading.passages||[]).forEach(passage=>{
            item.append(node('h5',[passage.bookTranslation,passage.ref||passage.chapter].filter(Boolean).join(' '),'kat-reference'));
            const verses=node('div',null,'kat-verses');
            (passage.verses||[]).forEach(verse=>{const p=node('p',null,'kat-verse');const number=node('sup',verse.number,'kat-verse-number');p.append(number,document.createTextNode(' '+String(verse.text||'').trim()));verses.append(p);});item.append(verses);
          });
          if(reading.html)paragraphs(reading.html,item);
          if(reading.conclusion)item.append(node('p',reading.conclusion,'kat-liturgical'));
          block.append(item);
        });article.append(block);
      });sections.append(article);
    });
    fragment.append(nav,sections);
    const source=node('footer',null,'kat-source');source.append(document.createTextNode('المصدر: '));const link=node('a','katameros.app');link.href='https://katameros.app/ar/?date='+data.date.split('-').reverse().join('-');link.target='_blank';link.rel='noopener noreferrer';source.append(link,document.createTextNode(' · النص الكتابي: فان دايك · ترتيب القراءات كما ورد بالمصدر.'));fragment.append(source);
    host.replaceChildren(fragment);
  }
  async function load(date,host){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){host.replaceChildren(node('p','اختر تاريخًا صحيحًا.'));return;}
    controller?.abort();const current=++serial;controller=new AbortController();const activeController=controller;
    host.classList.remove('kat-embed');host.classList.add('kat-text-reader');host.setAttribute('aria-busy','true');
    const cached=readCache(date);
    if(cached){render(host,cached,true,true);host.removeAttribute('aria-busy');}
    else host.replaceChildren(node('p','جارٍ تحميل قراءات اليوم…','kat-loading'));
    const timer=setTimeout(()=>activeController.abort(),25000);
    try{
      const response=await fetch((window.APP_RUNTIME?.apiBaseUrl||'')+'/api/katameros?date='+encodeURIComponent(date),{signal:activeController.signal});
      const data=await response.json();if(!response.ok||!valid(data,date))throw Error('invalid');
      if(current!==serial)return;const saved=saveCache(data);render(host,data,false,saved);
    }catch(e){
      if(current!==serial)return;
      if(cached)render(host,cached,true,true);
      else{const box=node('div',null,'kat-empty');box.setAttribute('role','status');box.append(node('h3','القراءات غير متاحة حاليًا'),node('p','اتصل بالإنترنت لفتح هذا اليوم أول مرة. الأيام التي فتحتها سابقًا تظل محفوظة على جهازك.'));const retry=node('button','حاول مرة أخرى','kh-button');retry.type='button';retry.addEventListener('click',()=>load(date,host));box.append(retry);host.replaceChildren(box);}
    }finally{clearTimeout(timer);if(current===serial)host.removeAttribute('aria-busy');}
  }
  return {load};
})();
