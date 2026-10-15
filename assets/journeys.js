document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const M=window.JourneyModel,D=window.APP_YEAR_PLANS,card=document.getElementById('journeyCard'),content=document.getElementById('journeyContent');
 let state,kind='reading',trackScroll=false,lastDay=M.today(),reader=false,generation=0,scrollTimer;
 try{state=M.clean(JSON.parse(localStorage.getItem(M.key)||'null'));}catch{state=M.clean();}
 const n=x=>Number(x).toLocaleString('ar-EG',{useGrouping:false});
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
 const button=(text,fn,cls='kh-button')=>{const b=el('button',text,cls);b.type='button';b.onclick=fn;return b;};
 function save(next){try{localStorage.setItem(M.key,JSON.stringify(next));state=next;return true;}catch{window.AppSettings?.toast('تعذر حفظ التقدم؛ راجع مساحة الجهاز وصدّر نسخة احتياطية.');return false;}}
 function summary(k){return M.stats(k==='reading'?state.reading.completed.map(x=>x.date):state.prayer.dates);}
 function dashboard(){
  const r=summary('reading'),p=summary('prayer'),count=state.reading.completed.length;
  document.getElementById('readingJourneySummary').textContent=state.reading.plan?`${n(count)} / ٣٦٥ يومًا · ${n(Math.round(count/365*100))}٪`:'ابدأ خطة قراءة تناسبك';
  document.getElementById('readingJourneyStreak').textContent=`${n(r.current)} أيام متتابعة`;
  document.getElementById('prayerJourneySummary').textContent=prayerName()+(p.today?' · أتممتها اليوم ✓':' · هدفك اليومي');
  document.getElementById('prayerJourneyStreak').textContent=`${n(p.current)} أيام متتابعة`;
 }
 function prayerName(){return window.APP_AGPEYA.find(h=>h.id===state.prayer.hour)?.name||({prime:'صلاة باكر',terce:'صلاة الساعة الثالثة',sext:'صلاة الساعة السادسة',none:'صلاة الساعة التاسعة',vespers:'صلاة الغروب',compline:'صلاة النوم',midnight:'صلاة نصف الليل',veil:'صلاة الستار'})[state.prayer.hour];}
 function show(k){clearTimeout(scrollTimer);generation++;kind=k;reader=false;window.AppLibrary.hide();card.classList.remove('hidden');document.getElementById('journeyTitle').textContent=k==='reading'?'رحلتك مع الكتاب':'وقت الصلاة';render();}
 function metrics(){const s=summary(kind),box=el('div',null,'journey-metrics');for(const [value,label]of [[s.current,'الستريك الحالي'],[s.best,'أطول ستريك'],[s.total,'أيام مكتملة']]){const p=el('p');p.append(el('strong',n(value)),el('span',label));box.append(p);}return box;}
 function calendar(){const dates=kind==='reading'?state.reading.completed.map(x=>x.date):state.prayer.dates;const box=el('section',null,'journey-calendar');box.append(el('h3','آخر ٢٨ يومًا'));const grid=el('div',null,'journey-calendar-grid');for(let i=27;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const date=M.today(d),done=dates.includes(date),cell=el('span',n(d.getDate()),done?'is-complete':'');cell.title=date+(done?' · مكتمل':' · بدون تسجيل');cell.setAttribute('aria-label',cell.title);grid.append(cell);}box.append(grid);return box;}
 function reminders(){const box=el('section',null,'journey-reminder');box.append(el('h3','تذكير يومي اختياري'));if(!window.NativeApp?.journeyReminders){box.append(el('p','الإشعارات المحلية متاحة في نسخة أندرويد. الخطة والتقدم يعملان هنا بدون إنترنت.','kh-note'));return box;}
  const label=el('label','تفعيل التذكير '),toggle=el('input');toggle.type='checkbox';toggle.id='journeyReminderEnabled';label.append(toggle);const time=el('input');time.type='time';time.id='journeyReminderTime';time.value=kind==='reading'?'20:00':'07:00';time.setAttribute('aria-label','موعد التذكير');const status=el('p',null,'kh-note');status.setAttribute('role','status');const activeKind=kind;
  box.append(label,time,button('حفظ التذكير',async()=>{const [hour,minute]=time.value.split(':').map(Number);try{await window.NativeApp.journeyReminders.configure({kind:activeKind,enabled:toggle.checked,hour,minute});status.textContent=toggle.checked?'تم حفظ التذكير المحلي. قد يتأخر مع توفير البطارية.':'تم إيقاف التذكير.';}catch(e){status.textContent=e.message||'تعذر حفظ التذكير.';}}),status);
  window.NativeApp.journeyReminders.status({kind:activeKind}).then(s=>{toggle.checked=!!s.enabled;time.value=String(s.hour).padStart(2,'0')+':'+String(s.minute).padStart(2,'0');}).catch(()=>status.textContent='تعذر قراءة إعدادات التذكير.');return box;
 }
 function setup(){
  const form=el('form',null,'journey-setup'),label=el('label','اختار خطة القراءة'),select=el('select');select.id='journeyPlan';for(const [value,text]of [['nt','العهد الجديد في سنة'],['full','الكتاب المقدس كاملًا، مع الأسفار القانونية الثانية']]){const o=el('option',text);o.value=value;select.append(o);}label.append(select);
  const startLabel=el('label','تاريخ البداية'),start=el('input');start.type='date';start.id='journeyStart';start.required=true;start.min='1900-01-01';start.max='2100-12-31';start.value=M.today();startLabel.append(start);
  const submit=el('button','ابدأ الرحلة','kh-button');submit.type='submit';form.append(el('p','٣٦٥ قراءة متتابعة موزعة حسب عدد الكلمات. مدة القراءة تقديرية، ويمكن أن تنتهي القراءة في منتصف إصحاح.'),label,startLabel,submit);form.onsubmit=e=>{e.preventDefault();if(!Number.isFinite(M.ordinal(start.value)))return;const next=M.clean(state);next.reading={plan:select.value,start:start.value,completed:[],scroll:0};if(save(next)){dashboard();render();}};return form;
 }
 function render(){
  content.classList.remove('journey-is-reading');content.replaceChildren();content.scrollTop=0;document.getElementById('journeyFontTools').hidden=true;const s=summary(kind);content.append(metrics());
  if(kind==='reading'){
   const r=state.reading;if(!r.plan){content.append(setup());return;}
   const count=r.completed.length,progress=el('progress');progress.max=365;progress.value=count;progress.setAttribute('aria-label','تقدم خطة السنة');content.append(progress,el('p',`${r.plan==='nt'?'العهد الجديد':'الكتاب المقدس مع الأسفار القانونية الثانية'} · ${n(count)} من ٣٦٥ يومًا`));
   if(count===365)content.append(el('h3','أكملت الرحلة! مبارك إتمام القراءة.'));
   else{const day=D.plans[r.plan][s.today?count-1:count];const title=s.today?'قراءة اليوم مكتملة ✓':`القراءة التالية: اليوم ${n(count+1)}`;content.append(el('h3',title),el('p',`${n(Math.max(1,Math.ceil(day.words/160)))} دقائق تقريبًا · ${refs(day)}`,'journey-day-reference'));
    const future=r.start>M.today();const read=button(s.today?'راجع قراءة اليوم':'افتح القراءة',()=>openReading(s.today?count-1:count,s.today));read.disabled=future;content.append(read);if(future)content.append(el('p','تبدأ الخطة في '+r.start));
    const end=new Date(Math.max(Date.now(),new Date(r.start+'T12:00:00').getTime()));end.setDate(end.getDate()+364-count+(s.today?1:0));content.append(el('p','الانتهاء المتوقع عند الاستمرار يوميًا: '+new Intl.DateTimeFormat('ar-EG',{dateStyle:'long'}).format(end),'kh-note'));
   }
   content.append(button('تغيير الخطة أو إعادة البداية',()=>{if(!confirm('إعادة البداية تمسح تقدم القراءة والستريك الخاص بها فقط. صدّر نسخة احتياطية إن احتجت الاحتفاظ به. هل تريد المتابعة؟'))return;const next=M.clean(state);next.reading={plan:null,start:M.today(),completed:[],scroll:0};if(save(next)){dashboard();render();}}));
   if(count){const history=el('details');history.append(el('summary','القراءات المكتملة'));r.completed.forEach(x=>history.append(button(`اليوم ${n(x.day)} · ${x.date}`,()=>openReading(x.day-1,true))));content.append(history);}
  }else{
   const label=el('label','هدف الصلاة اليومي'),select=el('select');select.id='journeyPrayerHour';for(const [value,text]of [['prime','باكر'],['terce','الثالثة'],['sext','السادسة'],['none','التاسعة'],['vespers','الغروب'],['compline','النوم'],['midnight','نصف الليل'],['veil','الستار']]){const o=el('option',text);o.value=value;select.append(o);}select.value=state.prayer.hour;select.onchange=()=>{const next=M.clean(state);next.prayer.hour=select.value;next.prayer.scroll=0;if(save(next)){dashboard();render();}};label.append(select);content.append(label,el('p','اختر صلاة واحدة كهدف يومي. تغيير الصلاة لا يمسح الأيام المكتملة، وإكمالها مرة واحدة يكفي لليوم.'),button(s.today?'راجع صلاة اليوم ✓':'افتح نص الصلاة',openPrayer));
  }
  const badges=el('p',null,'journey-badges');for(const mark of [7,30,100,365])if(s.total>=mark)badges.append(el('span',`${n(mark)} يومًا ✓`));if(badges.childNodes.length)content.append(badges);
  content.append(calendar(),el('p','فتح التطبيق وحده لا يحتسب يومًا. عند فوات يوم يبدأ الستريك من جديد، والقراءات المكتملة تظل محفوظة.','kh-note'),reminders());
 }
 function refs(day){return day.pieces.map(p=>`${typeof p.book==='number'?D.bookNames[p.book-1]:D.dcNames[+p.book.slice(2)]} ${n(p.ch)}:${n(p.from)}${p.to!==p.from?'–'+n(p.to):''}`).join('، ');}
 function readerStart(){reader=true;content.replaceChildren();document.getElementById('journeyFontTools').hidden=false;content.append(button('العودة لمتابعة التقدم',()=>{flushScroll();reader=false;generation++;render();},'journey-reader-back'));content.classList.add('journey-is-reading');}
 function finishButton(review){const b=button(review?'مكتمل بالفعل ✓':kind==='reading'?'أتممت قراءة اليوم':'أتممت صلاة اليوم',()=>{flushScroll();try{const result=M.complete(state,kind);if(save(result.state)){reader=false;dashboard();content.classList.remove('journey-is-reading');render();window.AppSettings?.toast(result.added?'تم حفظ إنجاز اليوم ✓':'اليوم مسجل بالفعل.');}}catch(e){window.AppSettings?.toast(e.message);}});b.disabled=review;content.append(b);}
 function restoreScroll(){requestAnimationFrame(()=>{content.scrollTop=(content.scrollHeight-content.clientHeight)*(kind==='reading'?state.reading.scroll:state.prayer.scroll);});}
 async function openReading(index,review=false){const id=++generation;readerStart();trackScroll=!review;const day=D.plans[state.reading.plan][index];content.append(el('h3',`اليوم ${n(index+1)} من ٣٦٥`));try{for(const piece of day.pieces){const data=typeof piece.book==='number'?await window.AppLibrary.loadBook(piece.book):window.APP_DC[+piece.book.slice(2)];if(id!==generation)return;const verses=typeof piece.book==='number'?data[piece.ch]:data.chapters[piece.ch-1].verses;const section=el('section',null,'journey-scripture');section.append(el('h4',refs({pieces:[piece]})));for(const verse of verses){const number=verse.verse??verse.n;if(number<piece.from||number>piece.to)continue;const p=el('p');p.append(el('sup',n(number)),document.createTextNode(' '+verse.text));section.append(p);}content.append(section);}if(id!==generation)return;finishButton(review);content.scrollTop=0;if(!review)restoreScroll();}catch{if(id===generation)content.append(el('p','تعذر فتح النص المحلي. أعد المحاولة عند الاتصال بالموقع.'),button('أعد المحاولة',()=>openReading(index,review)));}}
 function openPrayer(){generation++;readerStart();trackScroll=true;const hour=window.APP_AGPEYA.find(h=>h.id===state.prayer.hour);content.append(el('h3',prayerName()));for(const section of hour.sections){const block=el('section',null,'journey-scripture');block.append(el('h4',section.title));for(const p of section.paragraphs)block.append(el('p',p));content.append(block);}finishButton(summary('prayer').today);restoreScroll();}
 function flushScroll(){if(!reader||!trackScroll)return;clearTimeout(scrollTimer);const next=M.clean(state);next[kind==='reading'?'reading':'prayer'].scroll=content.scrollTop/Math.max(1,content.scrollHeight-content.clientHeight);save(next);}
 content.addEventListener('scroll',()=>{if(reader){clearTimeout(scrollTimer);scrollTimer=setTimeout(flushScroll,250);}});
 document.getElementById('journeyBack').onclick=()=>{flushScroll();document.getElementById('navHomeBtn').click();};
 document.getElementById('readingJourneyBtn').onclick=()=>show('reading');document.getElementById('prayerJourneyBtn').onclick=()=>show('prayer');
 document.getElementById('journeyFontDown').onclick=()=>font(-.1);document.getElementById('journeyFontUp').onclick=()=>font(.1);
 function font(delta){const current=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reader-font'))||1.45;window.setAppReaderFont?.(Math.max(1,Math.min(2.2,current+delta)));}
 document.addEventListener('click',e=>{if(e.target.closest('#navHomeBtn,#navFaithBtn,#navSearchBtn,#settingsOpen')){flushScroll();generation++;reader=false;dashboard();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)flushScroll();else{dashboard();if(!reader&&!card.classList.contains('hidden'))render();}});window.addEventListener('pagehide',flushScroll);
 setInterval(()=>{const date=M.today();if(date!==lastDay){lastDay=date;dashboard();if(!reader&&!card.classList.contains('hidden'))render();}},30000);
 window.addEventListener('storage',e=>{if(e.key===M.key){try{state=M.clean(JSON.parse(e.newValue||'null'));generation++;reader=false;dashboard();if(!card.classList.contains('hidden'))render();}catch{}}});window.AppJourney={open:show,export:()=>M.clean(state),validate:data=>M.clean(data)};dashboard();
});
