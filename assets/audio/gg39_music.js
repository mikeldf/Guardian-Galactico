/* FASE 39 — Banda sonora original, 26 pistas MP3 + SFX V2. */
(function(){'use strict';
  if(window.GG39_MUSIC)return;
  const titles=['Arrecife estelar','Forja solar','Cristales del vacío','Roca orbital','Nebulosa viva','Laboratorio tóxico','Máquinas del cosmos','Sombras del abismo','Horizonte cuántico','El núcleo final'];
  const tracks={menu:['menu_principal','nueva_01_ruta_nebular'],hangar:['hangar_estelar','nueva_02_horizonte_azul'],boss:['jefe_1','jefe_2','jefe_3','jefe_4','nueva_05_alerta_estelar','nueva_06_nucleo_final']};
  for(let w=1;w<=10;w++)tracks['mundo'+w]=['mundo_'+String(w).padStart(2,'0')+'_a','mundo_'+String(w).padStart(2,'0')+'_b', ['nueva_01_ruta_nebular','nueva_02_horizonte_azul','nueva_03_tormenta_ionica','nueva_04_pulso_cosmico','nueva_05_alerta_estelar','nueva_06_nucleo_final'][(w-1)%6]];
  const player=new Audio();player.preload='auto';player.loop=false;
  let selected='',lastKey='',index=0,unlocked=false,attempting=false,error='';
  const api={active:true,tracks:32,getState:()=>({active:true,scene:lastKey,track:selected,playing:!player.paused,volume:player.volume,title:display(selected),error})};
  window.GG39_MUSIC=api;
  const bridge=()=>window.GG_BRIDGE?.state?.()||{};
  const config=()=>window.GG_QUALITY_TEST?.getSettings?.()||{music:65,musicEnabled:true};
  const allow=()=>!!window.GG_BRIDGE?.soundOn?.() && config().musicEnabled!==false && Number(config().music)>0;
  function scene(){const st=bridge();if(st.playing&&st.currentScreen==='play'){if(st.paused)return 'pause';return st.boss?'boss':'mundo'+(Math.max(0,Math.min(9,Number(st.world)||0))+1)}return st.currentScreen==='hangar'?'hangar':'menu'}
  function display(id){if(!id)return 'MÚSICA DESACTIVADA';const n={'nueva_01_ruta_nebular':'Ruta nebular','nueva_02_horizonte_azul':'Horizonte azul','nueva_03_tormenta_ionica':'Tormenta iónica','nueva_04_pulso_cosmico':'Pulso cósmico','nueva_05_alerta_estelar':'Alerta estelar','nueva_06_nucleo_final':'Núcleo final'};if(n[id])return n[id]+' · Tema original';if(id==='menu_principal')return 'Estrellas en órbita';if(id==='hangar_estelar')return 'Hangar de pilotos';if(id.startsWith('jefe'))return 'Amenaza superior · Jefe '+id.split('_')[1];const m=/mundo_(\d+)_(a|b)/.exec(id);return m?titles[Math.max(0,Math.min(9,Number(m[1])-1))]+' · Tema '+m[2].toUpperCase():id}
  function refreshLabel(){const label=document.getElementById('gg39NowPlaying');if(label)label.textContent=display(selected);}
  function choose(key,shift=false){
    const list=tracks[key]||tracks.menu;
    if(lastKey!==key){lastKey=key;index=key==='boss'?Math.floor((Number(bridge().world)||0)%4):0;}
    else if(shift)index++;
    const id=list[(index+list.length)%list.length];
    if(selected!==id){selected=id;player.src='assets/music/'+id+'.mp3';player.load();error='';refreshLabel();}
    return id;
  }
  function start(){if(attempting||!unlocked||!allow()||scene()==='pause')return;
    if(!player.paused)return;
    attempting=true;const action=player.play();
    if(action&&typeof action.then==='function')action.then(()=>{error=''}).catch(e=>{error=String(e?.message||e)}).finally(()=>{attempting=false});
    else attempting=false;
  }
  function tick(){const key=scene(),enabled=allow();
    player.volume=Math.min(.78,Math.max(0,Number(config().music)||0)/100*.68);
    if(!enabled||key==='pause'){if(!player.paused)player.pause();return;}
    if(key!==lastKey)choose(key);
    if(unlocked)start();
  }
  function unlock(){unlocked=true;tick();}
  player.addEventListener('ended',()=>{if(!lastKey)return;choose(lastKey,true);start()});
  player.addEventListener('error',()=>{error='No se pudo cargar: '+selected;refreshLabel()});
  document.addEventListener('pointerdown',unlock,{capture:true,passive:true});
  document.addEventListener('keydown',e=>{if(!e.repeat)unlock()},{capture:true,passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)player.pause();else tick()});
  window.addEventListener('pagehide',()=>{player.pause();player.src='';});
  const next=document.getElementById('gg39NextTrack');if(next)next.addEventListener('click',()=>{const key=scene();choose(key==='pause'?'menu':key,true);unlocked=true;start();});
  setInterval(tick,300);tick();api.next=()=>{choose(scene()==='pause'?'menu':scene(),true);if(unlocked)start();};
})();