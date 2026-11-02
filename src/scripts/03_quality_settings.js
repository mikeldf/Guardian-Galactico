
(()=>{
  'use strict';
  const root=document.getElementById('settings');
  const panel=root?.querySelector('.panel');
  if(!panel)return;
  const container=document.createElement('section');container.id='ggqSettings';
  container.innerHTML=`<h3>SONIDO, MÚSICA Y PROGRESO</h3>
  <label>Volumen de efectos <input type="range" id="ggqSfxVol" min="0" max="100" step="5" aria-label="Volumen de efectos"></label>
  <label>Música original de combate <input type="checkbox" id="ggqMusic" aria-label="Activar música de combate"></label>
  <label>Volumen de música <input type="range" id="ggqMusicVol" min="0" max="100" step="5" aria-label="Volumen de música"></label>
  <label>Reducir destellos y movimiento <input type="checkbox" id="ggqReduceMotion" aria-label="Reducir destellos"></label>
  <label>Intensidad de ambiente del planeta <input type="range" id="ggqBackground" min="0" max="100" step="10" aria-label="Intensidad del fondo"></label>
  <label>Tecla secundaria alternativa <select id="ggqAltSecondary"><option value="KeyC">C</option><option value="KeyV">V</option><option value="KeyB">B</option></select></label>
  <label>Tecla habilidad alternativa <select id="ggqAltSpecial"><option value="KeyQ">Q</option><option value="KeyE">E</option><option value="KeyF">F</option></select></label>
  <div class="actionrow"><button type="button" id="ggqExport">⬇ GUARDAR COPIA</button><button type="button" id="ggqImport">⬆ RESTAURAR COPIA</button><button type="button" id="ggqSummary">VER MI PROGRESO</button></div>
  <input type="file" accept=".json,application/json" id="ggqImportFile" hidden>
  <div id="ggqStatus" role="status" aria-live="polite"></div>
  <div class="smallprint">Los datos se guardan en tu navegador. El archivo JSON te permite recuperar las monedas, naves y niveles en otro ordenador. Las copias no incluyen información personal.</div>`;
  const reset=root.querySelector('#resetBtn');reset?.before(container);
  const el=id=>document.getElementById(id);
  function clampN(v,min,max,fallback){let n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback}
  function getConfig(){try{return JSON.parse(localStorage.getItem('GG_QUALITY_SETTINGS')||'null')||{}}catch{return {}}}
  const cfg={sfx:70,music:35,musicEnabled:true,reduceMotion:false,background:70,altSecondary:'KeyC',altSpecial:'KeyQ',...getConfig()};
  // Migración a audio activo: solo la primera vez en esta versión.
  // Las decisiones del usuario posteriores permanecen guardadas.
  try {if(localStorage.getItem('GG_AUDIO_V2_INITIALIZED')!=='1'){
    cfg.musicEnabled=true;cfg.sfx=80;cfg.music=65;
    localStorage.setItem('GG_AUDIO_V2_INITIALIZED','1');
    localStorage.setItem('GG_QUALITY_SETTINGS',JSON.stringify(cfg));
  }} catch(e){cfg.musicEnabled=true;cfg.sfx=80;cfg.music=65;}
  cfg.sfx=clampN(cfg.sfx,0,100,80);cfg.music=clampN(cfg.music,0,100,65);cfg.background=clampN(cfg.background,0,100,70);
  if(!['KeyC','KeyV','KeyB'].includes(cfg.altSecondary))cfg.altSecondary='KeyC';
  if(!['KeyQ','KeyE','KeyF'].includes(cfg.altSpecial))cfg.altSpecial='KeyQ';
  window.GG_P3_REDUCED_MOTION=!!cfg.reduceMotion;window.GG_P3_BACKGROUND_DETAIL=cfg.background;
  window.GG_P3_KEYS={secondary:cfg.altSecondary,special:cfg.altSpecial};
  function keep(){try{localStorage.setItem('GG_QUALITY_SETTINGS',JSON.stringify(cfg))}catch{}}
  el('ggqSfxVol').value=cfg.sfx;el('ggqMusicVol').value=cfg.music;el('ggqMusic').checked=!!cfg.musicEnabled;el('ggqReduceMotion').checked=!!cfg.reduceMotion;el('ggqBackground').value=cfg.background;el('ggqAltSecondary').value=cfg.altSecondary;el('ggqAltSpecial').value=cfg.altSpecial;
  const status=t=>{el('ggqStatus').textContent=t};
  el('ggqSfxVol').addEventListener('input',e=>{cfg.sfx=clampN(e.target.value,0,100,70);keep()});
  el('ggqMusicVol').addEventListener('input',e=>{cfg.music=clampN(e.target.value,0,100,35);keep()});
  el('ggqMusic').addEventListener('change',e=>{cfg.musicEnabled=e.target.checked;keep();if(cfg.musicEnabled)musicReady()});
  el('ggqReduceMotion').addEventListener('change',e=>{cfg.reduceMotion=e.target.checked;window.GG_P3_REDUCED_MOTION=cfg.reduceMotion;keep();document.documentElement.classList.toggle('ggq-reduced',cfg.reduceMotion)});
  el('ggqBackground').addEventListener('input',e=>{cfg.background=clampN(e.target.value,0,100,70);window.GG_P3_BACKGROUND_DETAIL=cfg.background;keep()});
  el('ggqAltSecondary').addEventListener('change',e=>{cfg.altSecondary=e.target.value;window.GG_P3_KEYS.secondary=cfg.altSecondary;keep()});
  el('ggqAltSpecial').addEventListener('change',e=>{cfg.altSpecial=e.target.value;window.GG_P3_KEYS.special=cfg.altSpecial;keep()});
  document.documentElement.classList.toggle('ggq-reduced',cfg.reduceMotion);
  const styles=document.createElement('style'); styles.textContent=`.ggq-reduced .world-pin img,.ggq-reduced .shipCard img,.ggq-reduced .level-node{animation:none!important;transition:none!important}.ggq-reduced .screen{scroll-behavior:auto!important}`;document.head.append(styles);
  // Efectos originales sencillos, controlados por el volumen propio.
  let ggqAudio=null;
  window.GG_BRIDGE.setTone(function(freq=500,dur=.06){if(true)return;if(!window.GG_BRIDGE.soundOn()||cfg.sfx<1)return;try{ggqAudio||=new (window.AudioContext||window.webkitAudioContext)();if(ggqAudio.state==='suspended')ggqAudio.resume();const osc=ggqAudio.createOscillator(),gain=ggqAudio.createGain();osc.type='triangle';osc.frequency.value=freq;gain.gain.setValueAtTime(.026*(cfg.sfx/100),ggqAudio.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,ggqAudio.currentTime+Math.max(.035,dur));osc.connect(gain);gain.connect(ggqAudio.destination);osc.start();osc.stop(ggqAudio.currentTime+Math.max(.035,dur)+.03)}catch{}});
  // Música procedural ORIGINAL: patrones diferentes por planeta, sin samples ni melodías ajenas.
  const modalScale=[0,2,3,5,7,10,12,14],roots=[110,98,123,82,104,92,116,87,130,73],worldRhythms=[[1,0,1,0,1,0,0,1],[1,1,0,1,1,0,1,0],[1,0,0,1,1,0,0,1],[1,0,1,1,0,1,0,0],[1,1,0,0,1,0,1,0],[1,0,1,0,0,1,1,0],[1,0,0,1,0,1,0,1],[1,0,0,0,1,0,1,0],[1,1,0,1,0,1,0,1],[1,1,1,0,1,1,0,1]];
  let step=0,musicContext=null,musicTimer=null,lastWorld=-1;
  function musicReady(){if(musicContext)return;try{musicContext=new (window.AudioContext||window.webkitAudioContext)()}catch{}}
  function isCombat(){const x=window.GG_BRIDGE.state();return x.playing&&!x.paused&&x.currentScreen==='play'}
  function playNote(freq,duration,volume,type='sine'){
    if(!musicContext||musicContext.state!=='running')return;
    const osc=musicContext.createOscillator(),g=musicContext.createGain();
    const t=musicContext.currentTime;osc.type=type;osc.frequency.setValueAtTime(freq,t);
    const v=Math.max(.0001,Math.min(.025,volume*cfg.music/100));
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);
    g.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(g);g.connect(musicContext.destination);osc.start(t);osc.stop(t+duration+.03);
  }
  function musicBeat(){
    if(!cfg.musicEnabled||cfg.music<1||!isCombat()||!window.GG_BRIDGE.soundOn())return;
    musicReady();if(!musicContext)return;
    if(musicContext.state==='suspended'){musicContext.resume().catch(()=>{});return}
    const world=window.GG_BRIDGE.state().world; if(world!==lastWorld){step=0;lastWorld=world}
    const bossActive=window.GG_BRIDGE.state().boss,seq=step++;
    const root=roots[world],degree=modalScale[(seq*(world%3+1)+Math.floor(seq/4))%modalScale.length];
    const pitch=root*Math.pow(2,degree/12);const strength=bossActive?.36:.27;
    if(seq%2===0)playNote(root/2,.45,strength,'triangle');
    if(seq%4!==3)playNote(pitch,.17+world*.006,bossActive?.24:.16,'sine');
    if(seq%8===7||bossActive&&seq%4===3)playNote(root*2,.2,.14,'sawtooth');
    if(worldRhythms[world]?.[seq%8])playNote(bossActive?65:52,.055,bossActive?.10:.07,'triangle');
  }
  musicTimer=null; // Reemplazado por GG_AUDIO_V2
  // Audio V2 gestiona el gesto del usuario.
  window.addEventListener('pagehide',()=>{if(musicTimer)clearInterval(musicTimer);musicContext?.close().catch(()=>{})});
  // Copias con validación estricta de tipo, límites y estructura.
  function validated(x){
    if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Archivo de progreso no válido');
    if(x.format!=='GUARDIAN_GALACTICO_SAVE_V1'||!x.save||typeof x.save!=='object')throw Error('La copia no pertenece a Guardián Galáctico');
    const raw=x.save;
    const ships=Array.isArray(raw.ships)?[...new Set(raw.ships.map(Number).filter(v=>Number.isInteger(v)&&v>=0&&v<60))]:[0,1,2,3,4];
    for(let i=0;i<5;i++)if(!ships.includes(i))ships.push(i);
    const upgrades={};if(raw.upgrades&&typeof raw.upgrades==='object')for(let k of Object.keys(raw.upgrades).slice(0,60)){
      const id=Number(k);if(!Number.isInteger(id)||id<0||id>=60)continue;
      const u=raw.upgrades[k];if(!u||typeof u!=='object')continue;
      upgrades[id]={attack:clampN(u.attack,0,5,0),armor:clampN(u.armor,0,5,0),energy:clampN(u.energy,0,5,0)};
    }
    const selected=clampN(raw.selected,0,59,0);
    return {campaignSchema:200,worldWeaponLevels:Array.from({length:10},(_,i)=>Math.trunc(clampN(raw.worldWeaponLevels?.[i],1,50,1))),lastUnlocked:Math.trunc(clampN(raw.campaignSchema===200?raw.lastUnlocked:Math.floor((Math.max(1,Math.min(501,Number(raw.lastUnlocked)||1))-1)/50)*20+Math.floor(((Math.max(1,Math.min(501,Number(raw.lastUnlocked)||1))-1)%50)*20/50)+1,1,201,1)),lastPlayed:Math.trunc(clampN(raw.lastPlayed??raw.lastUnlocked,1,200,1)),coins:Math.trunc(clampN(raw.coins,0,100000000,250)),selected:ships.includes(selected)?selected:0,ships,upgrades,wins:Math.trunc(clampN(raw.wins,0,100000,0)),bossWins:Math.trunc(clampN(raw.bossWins,0,100000,0)),highestScore:Math.trunc(clampN(raw.highestScore,0,1e12,0)),perfect:Math.trunc(clampN(raw.perfect,0,100000,0)),difficulty:['facil','normal','dificil','experto'].includes(raw.difficulty)?raw.difficulty:'normal'};
  }
  function makeBackup(){return {format:'GUARDIAN_GALACTICO_SAVE_V1',version:1,exported:new Date().toISOString(),save:window.GG_BRIDGE.getSave()};}
  el('ggqExport').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(makeBackup(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='Guardián_Galáctico_progreso.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);status('Copia creada. Guárdala en un lugar seguro.');
  });
  el('ggqImport').addEventListener('click',()=>el('ggqImportFile').click());
  el('ggqImportFile').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{
      if(f.size>1048576)throw Error('El archivo es demasiado grande');
      const restored=validated(JSON.parse(await f.text()));
      if(!confirm('¿Restaurar esta copia y sustituir el progreso actual?'))return;
      window.GG_BRIDGE.setSave(restored);status(`Copia restaurada: ${Math.min(200,restored.lastUnlocked-1)} niveles, ${restored.ships.length} naves.`);
    }catch(err){status('No se restauró: '+(err.message||'archivo incorrecto'))}finally{e.target.value=''}
  });
  el('ggqSummary').addEventListener('click',()=>{const saved=window.GG_BRIDGE.getSave();status(`Niveles: ${Math.min(200,saved.lastUnlocked-1)}/200 · Naves: ${saved.ships.length}/60 · Monedas: ${saved.coins} · Jefes derrotados: ${saved.bossWins}`)});
  window.GG_PRIORITY_3_AUDIT={worlds:10,atmosphere:"10 atmósferas por mundo",shipRule:(i)=>window.GG_BRIDGE.unlockRule(i),
    settings:()=>({...cfg}),backupFormat:'GUARDIAN_GALACTICO_SAVE_V1'};
  window.GG_QUALITY_TEST={getSettings:()=>({...cfg}),setMusicEnabled:v=>{cfg.musicEnabled=!!v;keep()},roundtrip:()=>validated(makeBackup()),getMusicWorld:()=>window.GG_BRIDGE.state().world,restoreValidation:x=>validated(x),soundState:()=>window.GG_BRIDGE.soundOn()};
})();
