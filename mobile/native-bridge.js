import {Capacitor,SystemBars,SystemBarsStyle} from '@capacitor/core';
import {App} from '@capacitor/app';
import {Share} from '@capacitor/share';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem';
if(Capacitor.isNativePlatform()){
 window.NativeApp={
  async shareBackup(text){const file=await Filesystem.writeFile({path:'amegoo-backup-'+Date.now()+'.json',data:text,directory:Directory.Cache,encoding:Encoding.UTF8});await Share.share({title:'نسخة احتياطية — التطبيق القبطي',files:[file.uri]});},
  async shareApp(){await Share.share({title:'التطبيق القبطي',text:'الكتاب المقدس والأجبية والألحان والشرح في مكان واحد',url:'https://amegoo.vercel.app'});},
  async setTheme(light){await SystemBars.setStyle({style:light?SystemBarsStyle.Light:SystemBarsStyle.Dark});}
 };
 document.addEventListener('DOMContentLoaded',()=>{
  document.documentElement.classList.add('native-app');window.NativeApp.setTheme(document.documentElement.dataset.theme==='light').catch(()=>{});
  document.getElementById('offlineStatus').textContent='الكتب والنصوص محفوظة داخل التطبيق. التسجيلات الخارجية والمساعد والقطمارس تحتاج إنترنت.';
  let backTime=0;App.addListener('backButton',()=>{const dialog=document.querySelector('dialog[open]');if(dialog){if(dialog.id==='faithLoadingDialog')document.getElementById('faithLoadingCancel').click();else dialog.close();return;}
   const card=[...document.querySelectorAll('.selection-card')].find(el=>!el.classList.contains('hidden'));if(card?.id==='dashboardCard'){if(Date.now()-backTime<2000)App.exitApp();else{backTime=Date.now();window.AppSettings?.toast('اضغط رجوع مرة ثانية للخروج');}return;}
   const back=card?.querySelector('.christos-back,.btn-back');if(back)back.click();else document.getElementById('navHomeBtn').click();
  });
  App.addListener('appStateChange',({isActive})=>{if(!isActive)document.querySelectorAll('audio').forEach(a=>a.pause());});
 });
}
