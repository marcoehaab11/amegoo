(()=>{
 window.stopHymnAudio=()=>{document.querySelectorAll('audio').forEach(audio=>audio.pause());document.getElementById('hymnAudioPanel')?.remove();};
 window.attachHymnAudio=index=>{
  const data=window.APP_HYMN_AUDIO?.[index],container=document.getElementById('infoCardContent');if(!data||!container)return;
  const existing=document.getElementById('hymnAudioPanel');if(existing?.dataset.hymn===String(index))return;existing?.remove();
  const panel=document.createElement('section');panel.id='hymnAudioPanel';panel.className='hymn-audio';panel.dataset.hymn=index;panel.setAttribute('aria-label','صوت اللحن');
  const heading=document.createElement('h3');heading.textContent='استمع للحن';const status=document.createElement('p');status.className='hymn-audio-status';status.setAttribute('role','status');
  const caption=document.createElement('p');caption.className='hymn-audio-caption';const source=document.createElement('a');source.target='_blank';source.rel='noopener';source.textContent='المصدر';panel.append(heading);
  if(data.tracks){
   let active=0;const audio=document.createElement('audio');audio.id='hymnAudio';audio.controls=true;audio.preload='none';audio.setAttribute('aria-label','تسجيل اللحن');
   const toolbar=document.createElement('div');toolbar.className='hymn-audio-options';const speeds=document.createElement('select');speeds.setAttribute('aria-label','سرعة تشغيل اللحن');[.75,1,1.25,1.5].forEach(rate=>{const option=document.createElement('option');option.value=rate;option.textContent='سرعة '+rate+'×';option.selected=rate===(window.AppSettings?.get().speed||1);speeds.append(option);});speeds.onchange=()=>audio.playbackRate=Number(speeds.value);
   let tracks;if(data.tracks.length>1){tracks=document.createElement('select');tracks.setAttribute('aria-label','اختر تسجيل اللحن');data.tracks.forEach((track,i)=>{const option=document.createElement('option');option.value=i;option.textContent=track.title;tracks.append(option);});toolbar.append(tracks);tracks.onchange=()=>load(Number(tracks.value));}
   function load(i){audio.pause();active=i;const track=data.tracks[i];audio.src=track.src;audio.playbackRate=Number(speeds.value);caption.textContent=track.title+' — '+track.performer+' • ';caption.append(source);source.href=track.source;status.textContent='الصوت يحتاج اتصالًا بالإنترنت.';if(tracks)tracks.value=String(i);}
   audio.addEventListener('play',()=>{document.querySelectorAll('audio').forEach(other=>{if(other!==audio)other.pause();});status.textContent='جارٍ تشغيل اللحن.';});audio.addEventListener('error',()=>status.textContent='تعذر تحميل التسجيل. افتح المصدر أو جرّب بعد شوية.');audio.addEventListener('ended',()=>{if(active+1<data.tracks.length){load(active+1);audio.play().catch(()=>status.textContent='اضغط تشغيل للاستماع للتسجيل التالي.');}});
   toolbar.append(speeds);panel.append(audio,toolbar,caption);load(0);
  }else{
   caption.textContent=data.title+' — '+data.performer+' • ';source.href=data.embed;caption.append(source);const button=document.createElement('button');button.type='button';button.className='kh-button';button.textContent='عرض مشغّل الصوت';button.onclick=()=>{if(!navigator.onLine){status.textContent='تشغيل التسجيل يحتاج إنترنت.';return;}const frame=document.createElement('iframe');frame.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(data.embed)+'&auto_play=false&hide_related=true&show_comments=false&show_reposts=false&visual=false';frame.title=data.title+' — مشغّل SoundCloud';frame.allow='autoplay';frame.height='166';frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';panel.insertBefore(frame,caption);button.hidden=true;status.textContent='اضغط تشغيل داخل المشغّل. لو لم يظهر، افتح المصدر.';};panel.append(button,caption);if(data.note){const note=document.createElement('p');note.className='hymn-audio-status';note.textContent=data.note;panel.append(note);}status.textContent='التسجيل من SoundCloud ويحتاج إنترنت.';
  }
  panel.append(status);container.prepend(panel);
 };
})();
