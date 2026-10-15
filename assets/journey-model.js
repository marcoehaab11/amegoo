(function(root){
 'use strict';
 const key='coptic:journeys:v1';
 const today=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const ordinal=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return NaN;const d=new Date(s+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s?Math.floor(+d/86400000):NaN;};
 function clean(input){
  const x=input||{},r=x.reading||{},p=x.prayer||{};
  const completed=[];if(Array.isArray(r.completed))for(const entry of r.completed.slice(0,365)){if(entry?.day!==completed.length+1||!Number.isFinite(ordinal(entry.date))||(completed.length&&entry.date<=completed.at(-1).date))break;completed.push({day:entry.day,date:entry.date});}
  const dates=Array.isArray(p.dates)?[...new Set(p.dates.filter(d=>Number.isFinite(ordinal(d))))].sort().slice(-10000):[];
  return {version:1,reading:{plan:['nt','full'].includes(r.plan)?r.plan:null,start:Number.isFinite(ordinal(r.start))?r.start:today(),completed,scroll:Math.max(0,Math.min(1,Number(r.scroll)||0))},prayer:{hour:['prime','terce','sext','none','vespers','compline','midnight','veil'].includes(p.hour)?p.hour:'prime',dates,scroll:Math.max(0,Math.min(1,Number(p.scroll)||0))}};
 }
 function stats(dates,date=today()){
  const list=[...new Set(dates)].filter(d=>Number.isFinite(ordinal(d))&&d<=date).sort();let best=0,run=0,prev;
  for(const d of list){run=prev!==undefined&&ordinal(d)-prev===1?run+1:1;best=Math.max(best,run);prev=ordinal(d);}
  const latest=list.at(-1),current=latest&&ordinal(date)-ordinal(latest)<=1?run:0;
  return {current,best,total:list.length,today:list.includes(date)};
 }
 function complete(state,kind,date=today()){
  const s=clean(state);if(!Number.isFinite(ordinal(date)))throw Error('التاريخ غير صحيح.');
  const dates=kind==='reading'?s.reading.completed.map(x=>x.date):s.prayer.dates;
  if(dates.includes(date))return {state:s,added:false};
  if(dates.length&&date<dates.at(-1))throw Error('تاريخ الجهاز أقدم من آخر يوم مكتمل. راجع التاريخ قبل المتابعة.');
  if(kind==='reading'){
   if(!s.reading.plan||date<s.reading.start)throw Error('الخطة لم تبدأ بعد.');
   if(s.reading.completed.length>=365)return {state:s,added:false};
   s.reading.completed.push({day:s.reading.completed.length+1,date});s.reading.scroll=0;
  }else{s.prayer.dates.push(date);s.prayer.scroll=0;}
  return {state:s,added:true};
 }
 const api={key,today,ordinal,clean,stats,complete};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.JourneyModel=api;
})(typeof window!=='undefined'?window:globalThis);
