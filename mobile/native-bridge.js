import {Capacitor,registerPlugin,SystemBars,SystemBarsStyle} from '@capacitor/core';
import {App} from '@capacitor/app';
import {Share} from '@capacitor/share';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem';
const DailyVerse=registerPlugin('DailyVerse');
if(Capacitor.isNativePlatform()){
 window.NativeApp={
  async shareBackup(text){const file=await Filesystem.writeFile({path:'amegoo-backup-'+Date.now()+'.json',data:text,directory:Directory.Cache,encoding:Encoding.UTF8});await Share.share({title:'نسخة احتياطية — رفيقك القبطي',files:[file.uri]});},
  async shareApp(){await Share.share({title:'رفيقك القبطي',text:'الكتاب المقدس والأجبية والألحان والشرح في مكان واحد',url:'https://amegoo.vercel.app'});},
  async setTheme(light){await SystemBars.setStyle({style:light?SystemBarsStyle.Light:SystemBarsStyle.Dark});}
 };
 document.addEventListener('DOMContentLoaded',()=>{
  document.documentElement.classList.add('native-app');window.NativeApp.setTheme(document.documentElement.dataset.theme==='light').catch(()=>{});
  document.getElementById('offlineStatus').textContent='الكتب والنصوص محفوظة داخل التطبيق. التسجيلات الخارجية والمساعد والقطمارس تحتاج إنترنت.';
  const toggle=document.getElementById('dailyVerseEnabled'),time=document.getElementById('dailyVerseTime'),test=document.getElementById('dailyVerseTest'),read=document.getElementById('dailyVerseRead'),status=document.getElementById('dailyVerseStatus');let today;
  const openVerse=value=>{try{today=typeof value==='string'?JSON.parse(value):value;if(!today?.text||!today.nr)return;document.getElementById('dailyVerseReference').textContent=today.reference;document.getElementById('dailyVerseText').textContent=today.text;const dialog=document.getElementById('dailyVerseDialog');if(!dialog.open)dialog.showModal();}catch{window.AppSettings?.toast('تعذر فتح الآية');}};
  document.getElementById('dailyVerseClose').onclick=()=>document.getElementById('dailyVerseDialog').close();document.getElementById('dailyVerseChapter').onclick=()=>{document.getElementById('dailyVerseDialog').close();window.openDailyVerseChapter?.(today);};
  const render=data=>{toggle.checked=data.enabled;time.value=String(data.hour).padStart(2,'0')+':'+String(data.minute).padStart(2,'0');test.disabled=!data.allowed;today=data.verse;document.getElementById('dailyVersePreview').textContent=today.text+' — '+today.reference;status.textContent=data.enabled?(data.allowed?'مفعّلة · تصل الآية في الوقت المختار تقريبًا.':'الإشعارات محظورة من إعدادات الهاتف.'):'الآية اليومية متوقفة.';};
  const refresh=()=>DailyVerse.status().then(render).catch(()=>status.textContent='تعذر قراءة إعدادات الإشعارات.');
  document.getElementById('dailyVerseInfo').textContent='تعمل بدون إنترنت. قد يؤخر توفير البطارية وصول الإشعار. لو أوقفت التطبيق إجباريًا، افتحه مرة أخرى لاستئناف الإشعارات.';
  toggle.disabled=false;time.disabled=false;read.hidden=false;read.onclick=()=>openVerse(today);
  const configure=async()=>{toggle.disabled=time.disabled=true;try{const [hour,minute]=time.value.split(':').map(Number);render(await DailyVerse.configure({enabled:toggle.checked,hour,minute}));}catch(error){await refresh();status.textContent=error.message||'تعذر حفظ إعدادات الإشعار.';}finally{toggle.disabled=time.disabled=false;}};
  toggle.onchange=configure;time.onchange=configure;test.onclick=async()=>{test.disabled=true;try{await DailyVerse.test();status.textContent='تم إرسال إشعار تجريبي. افتح شريط إشعارات الهاتف.';}catch(error){status.textContent=error.message||'تعذر عرض الإشعار.';}finally{await DailyVerse.status().then(data=>test.disabled=!data.allowed).catch(()=>{});}};
  refresh();DailyVerse.addListener('verseTapped',data=>openVerse(data.verse));DailyVerse.launchVerse().then(data=>{if(data.verse)openVerse(data.verse);}).catch(()=>{});App.addListener('appStateChange',({isActive})=>{if(isActive)refresh();});
  let backTime=0;App.addListener('backButton',()=>{const dialog=document.querySelector('dialog[open]');if(dialog){if(dialog.id==='faithLoadingDialog')document.getElementById('faithLoadingCancel').click();else dialog.close();return;}
   const card=[...document.querySelectorAll('.selection-card')].find(el=>!el.classList.contains('hidden'));if(card?.id==='dashboardCard'){if(Date.now()-backTime<2000)App.exitApp();else{backTime=Date.now();window.AppSettings?.toast('اضغط رجوع مرة ثانية للخروج');}return;}
   const back=card?.querySelector('.christos-back,.btn-back');if(back)back.click();else document.getElementById('navHomeBtn').click();
  });
  App.addListener('appStateChange',({isActive})=>{if(!isActive)document.querySelectorAll('audio').forEach(a=>a.pause());});
 });
}
