/* FASE 39 — Banda sonora original + cinco temas sintetizados para el juego. */
(function(){'use strict';
  if(window.GG39_MUSIC)return;
  const titles=['Arrecife estelar','Forja solar','Cristales del vacío','Roca orbital','Nebulosa viva','Laboratorio tóxico','Máquinas del cosmos','Sombras del abismo','Horizonte cuántico','El núcleo final'];
  const newTracks=['nueva_07_nebula_dorada','nueva_08_motor_orbital','nueva_09_lluvia_ionica','nueva_10_enjambre_metalico','nueva_11_corazon_del_cosmos'];
  const tracks={menu:['menu_principal','nueva_01_ruta_nebular',newTracks[0]],hangar:['hangar_estelar','nueva_02_horizonte_azul',newTracks[1]],boss:['jefe_1','jefe_2','jefe_3','jefe_4','nueva_05_alerta_estelar','nueva_06_nucleo_final',newTracks[3],newTracks[4]]};
  for(let w=1;w<=10;w++)tracks['mundo'+w]=['mundo_'+String(w).padStart(2,'0')+'_a','mundo_'+String(w).padStart(2,'0')+'_b', ['nueva_01_ruta_nebular','nueva_02_horizonte_azul','nueva_03_tormenta_ionica','nueva_04_pulso_cosmico','nueva_05_alerta_estelar','nueva_06_nucleo_final'][(w-1)%6],newTracks[(w-1)%5]];
  const player=new Audio();player.preload='auto';player.loop=false;
  let selected='',lastKey='',index=0,unlocked=false,attempting=false,error='';
  const api={active:true,tracks:37,getState:()=>({active:true,scene:lastKey,track:selected,playing:!player.paused,volume:player.volume,title:display(selected),error})};
  window.GG39_MUSIC=api;
  const bridge=()=>window.GG_BRIDGE?.state?.()||{};
  const config=()=>window.GG_QUALITY_TEST?.getSettings?.()||{music:65,musicEnabled:true};
  const allow=()=>!!window.GG_BRIDGE?.soundOn?.() && config().musicEnabled!==false && Number(config().music)>0;
  function scene(){const st=bridge();if(st.playing&&st.currentScreen==='play'){if(st.paused)return 'pause';return st.boss?'boss':'mundo'+(Math.max(0,Math.min(9,Number(st.world)||0))+1)}return st.currentScreen==='hangar'?'hangar':'menu'}
  function display(id){if(!id)return 'MÚSICA DESACTIVADA';const n={'nueva_01_ruta_nebular':'Ruta nebular','nueva_02_horizonte_azul':'Horizonte azul','nueva_03_tormenta_ionica':'Tormenta iónica','nueva_04_pulso_cosmico':'Pulso cósmico','nueva_05_alerta_estelar':'Alerta estelar','nueva_06_nucleo_final':'Núcleo final','nueva_07_nebula_dorada':'Nebulosa dorada','nueva_08_motor_orbital':'Motor orbital','nueva_09_lluvia_ionica':'Lluvia iónica','nueva_10_enjambre_metalico':'Enjambre metálico','nueva_11_corazon_del_cosmos':'Corazón del cosmos'};if(n[id])return n[id]+' · Tema original';if(id==='menu_principal')return 'Estrellas en órbita';if(id==='hangar_estelar')return 'Hangar de pilotos';if(id.startsWith('jefe'))return 'Amenaza superior · Jefe '+id.split('_')[1];const m=/mundo_(\d+)_(a|b)/.exec(id);return m?titles[Math.max(0,Math.min(9,Number(m[1])-1))]+' · Tema '+m[2].toUpperCase():id}
  const synthSpecs={
    nueva_07_nebula_dorada:{bpm:100,root:50,scale:[0,2,3,5,7,9,10],chords:[0,5,3,4],style:0},
    nueva_08_motor_orbital:{bpm:120,root:45,scale:[0,2,3,5,7,8,10],chords:[0,3,5,4],style:1},
    nueva_09_lluvia_ionica:{bpm:126,root:53,scale:[0,1,3,5,7,8,10],chords:[0,6,3,4],style:2},
    nueva_10_enjambre_metalico:{bpm:136,root:43,scale:[0,2,3,5,7,8,10],chords:[0,5,6,3],style:3},
    nueva_11_corazon_del_cosmos:{bpm:112,root:48,scale:[0,2,3,5,7,8,11],chords:[0,6,3,4],style:4}
  };
  const generatedUrls=new Map();
  const midiHz=n=>440*Math.pow(2,(n-69)/12);
  function generatedTrackUrl(id){
    if(generatedUrls.has(id))return generatedUrls.get(id);
    const spec=synthSpecs[id];if(!spec)return '';
    const sr=22050,beat=60/spec.bpm,seconds=64*beat+1.2,count=Math.ceil(sr*seconds),mix=new Float32Array(count),events=[];
    const add=(t,d,n,type,gain)=>events.push({t,d,n,type,gain});
    for(let bar=0;bar<16;bar++){
      const degree=spec.chords[bar%4],root=spec.root+spec.scale[degree%7];
      const triad=[root,root+spec.scale[(degree+2)%7],root+spec.scale[(degree+4)%7]];
      triad.forEach((note,i)=>add(bar*4*beat,4.15*beat,note+(i===0?0:12),'pad',.075));
      for(let b=0;b<4;b++){
        const bass=spec.root+spec.scale[(degree+(b===2?4:0))%7]-12;
        add((bar*4+b)*beat,.82*beat,bass,'bass',.14);
        if(spec.style!==0||b%2===0)add((bar*4+b+.5)*beat,.30*beat,bass+12,'bass',.065);
      }
      for(let step=0;step<8;step++){
        const seq=[0,2,4,6,4,2,5,3],scaleIndex=(degree+seq[(step+bar*spec.style)%8])%7;
        add((bar*4+step*.5)*beat,.31*beat,spec.root+spec.scale[scaleIndex]+12+(bar%2?12:0),'pluck',spec.style===0?.065:.085);
      }
      const melody=[6,4,2,4,5,4,2,0];
      for(let i=0;i<4;i++)if((bar+i+spec.style)%3!==0){
        const ix=(degree+melody[(i+bar)%8])%7;
        add((bar*4+i)*beat,.72*beat,spec.root+spec.scale[ix]+24,'lead',spec.style===0?.06:.075);
      }
      if(spec.style>0){
        for(let b=0;b<4;b++){
          if(b===0||b===2||spec.style>=3&&b===3)add((bar*4+b)*beat,.20,0,'kick',.19);
          if(b===1||b===3)add((bar*4+b)*beat,.18,0,'snare',.11);
          if(b%2===1||spec.style>=2)add((bar*4+b+.5)*beat,.08,0,'hat',.04);
        }
      }
    }
    let seed=spec.root*7919+spec.bpm;
    for(const e of events){
      const start=Math.max(0,Math.floor(e.t*sr)),end=Math.min(count,Math.floor((e.t+e.d)*sr));
      const hz=e.type==='kick'?0:midiHz(e.n),attack=e.type==='pad'?.18:e.type==='lead'?.035:.008,rel=e.type==='pad'?.42:e.type==='lead'?.12:.07;
      for(let i=start;i<end;i++){
        const local=(i-start)/sr,remain=(end-i)/sr,env=Math.min(1,local/attack,remain/rel);
        let sample=0;
        if(e.type==='kick'){
          const phase=2*Math.PI*(48*local-22*local*local);
          sample=Math.sin(phase)*Math.exp(-local*9);
        }else if(e.type==='snare'||e.type==='hat'){
          seed=(seed*16807)%2147483647;const noise=seed/1073741823.5-1;
          sample=noise*Math.exp(-local*(e.type==='hat'?48:15));
          if(e.type==='snare')sample+=.24*Math.sin(2*Math.PI*180*local)*Math.exp(-local*22);
        }else{
          const phase=2*Math.PI*hz*local;
          const tone=e.type==='pad'?.72*Math.sin(phase)+.20*Math.sin(phase*2.003)+.08*Math.sin(phase*3.01):e.type==='pluck'?.78*Math.sin(phase)+.22*Math.sin(phase*2):e.type==='bass'?.86*Math.sin(phase)+.14*Math.sin(phase*2):.72*Math.sin(phase)+.18*Math.sin(phase*2)+.10*Math.sin(phase*3);
          sample=tone*(e.type==='pluck'?Math.exp(-local*3.7):1);
        }
        mix[i]+=sample*e.gain*env;
      }
    }
    const dataBytes=count*2,buffer=new ArrayBuffer(44+dataBytes),view=new DataView(buffer);
    const str=(offset,s)=>{for(let i=0;i<s.length;i++)view.setUint8(offset+i,s.charCodeAt(i))};
    str(0,'RIFF');view.setUint32(4,36+dataBytes,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sr,true);view.setUint32(28,sr*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,dataBytes,true);
    const fade=Math.floor(sr*.8);let peak=0;for(let i=0;i<count;i++){const f=Math.min(1,i/fade,(count-1-i)/fade);mix[i]*=f;peak=Math.max(peak,Math.abs(mix[i]));}
    const scale=peak>.92?.92/peak:1;for(let i=0;i<count;i++)view.setInt16(44+i*2,Math.max(-32768,Math.min(32767,Math.round(mix[i]*scale*32767))),true);
    const url=URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));generatedUrls.set(id,url);return url;
  }
  function refreshLabel(){const label=document.getElementById('gg39NowPlaying');if(label)label.textContent=display(selected);}
  function choose(key,shift=false){
    const list=tracks[key]||tracks.menu;
    if(lastKey!==key){lastKey=key;index=key==='boss'?Math.floor((Number(bridge().world)||0)%4):0;}
    else if(shift)index++;
    const id=list[(index+list.length)%list.length];
    if(selected!==id){selected=id;player.src=synthSpecs[id]?generatedTrackUrl(id):'assets/music/'+id+'.mp3';player.load();error='';refreshLabel();}
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
  window.addEventListener('pagehide',()=>{player.pause();player.src='';generatedUrls.forEach(url=>URL.revokeObjectURL(url));generatedUrls.clear();});
  const next=document.getElementById('gg39NextTrack');if(next)next.addEventListener('click',()=>{const key=scene();choose(key==='pause'?'menu':key,true);unlocked=true;start();});
  setInterval(tick,300);tick();api.next=()=>{choose(scene()==='pause'?'menu':scene(),true);if(unlocked)start();};
})();

