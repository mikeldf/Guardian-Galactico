/* GUARDIÁN GALÁCTICO — Audio V2
   Música y efectos originales generados localmente con Web Audio.
   No usa pistas ni samples de Star Defender 4 ni de terceros.
   Empieza en la primera interacción del jugador por la política de reproducción del navegador.
*/
(function(){'use strict';
  if(window.GG_AUDIO_V2)return;
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  const api={ready:false,events:{},started:false,version:'2.1'};
  window.GG_AUDIO_V2=api;
  if(!AudioCtx)return;
  let ac=null, master=null, musicBus=null, fxBus=null, noise=null, next=0, beat=0, lastScene='', lastWorld=-1, timeout=null, lastFx={};
  const modes=[[0,2,3,7,10],[0,3,5,7,10],[0,2,5,7,9],[0,3,5,8,10],[0,2,3,7,9],[0,2,5,7,10],[0,3,5,7,9],[0,1,5,7,8],[0,2,4,7,11],[0,3,6,8,11]];
  const roots=[130.81,146.83,123.47,138.59,116.54,155.56,110,164.81,174.61,98];
  const progressions=[[0,5,3,4],[0,3,5,4],[0,4,6,3],[0,5,2,4],[0,3,4,5],[0,5,3,4],[0,6,3,4],[0,3,1,4],[0,4,3,6],[0,6,4,3]];
  const motifs=[
    [0,2,4,7,4,2,0,-1, 3,4,7,9,7,4,2,-1],
    [0,-1,3,5,7,5,3,-1, 2,5,7,10,7,5,3,-1],
    [0,2,-1,4,7,4,-1,2, 0,5,7,-1,9,7,5,-1],
    [0,-1,5,3,1,-1,7,5, 4,-1,2,0,3,-1,7,5],
    [0,3,5,-1,7,5,3,0, 2,5,9,-1,7,5,2,0],
    [0,2,5,7,-1,7,5,2, 3,5,7,10,-1,7,5,3],
    [0,-1,2,5,7,-1,5,2, 0,-1,5,7,9,-1,7,5],
    [0,1,4,7,-1,4,1,-1, 3,5,8,7,-1,5,3,-1],
    [0,4,7,-1,11,7,4,2, 0,7,9,-1,7,4,2,-1],
    [0,3,6,8,6,3,0,-1, 3,6,8,12,8,6,3,-1]
  ];
  const scale=(root,semi)=>root*Math.pow(2,semi/12);
  const settings=()=>window.GG_QUALITY_TEST?.getSettings?.()||{musicEnabled:true,music:65,sfx:80};
  const soundOn=()=>window.GG_BRIDGE?.soundOn?.()!==false;
  function init(){
    if(ac)return true;
    try{
      ac=new AudioCtx();master=ac.createGain();master.gain.value=.82;master.connect(ac.destination);
      musicBus=ac.createGain();musicBus.gain.value=.42;musicBus.connect(master);
      fxBus=ac.createGain();fxBus.gain.value=.82;fxBus.connect(master);
      noise=ac.createBuffer(1,Math.round(ac.sampleRate),ac.sampleRate);
      const samples=noise.getChannelData(0);let seed=0x42676;
      for(let i=0;i<samples.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;samples[i]=((seed>>>0)/2147483648)-1;}
      api.ready=true;return true;
    }catch(e){return false;}
  }
  function resume(){if(!init())return;ac.resume().catch(()=>{});if(!timeout){next=ac.currentTime+.06;timeout=setInterval(schedule,75)}api.started=true;}
  function gainEnvelope(dest,t,vol,dur,attack=.006){
    const g=ac.createGain();g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+Math.max(.002,attack));
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(dest);return g;
  }
  function synth(freq,t,dur,vol,kind='triangle',bus=musicBus,cut=0){
    if(!ac||ac.state!=='running'||!Number.isFinite(freq))return;
    const g=gainEnvelope(bus,t,vol,dur,Math.min(.06,dur*.2)),o=ac.createOscillator();
    o.type=kind;o.frequency.setValueAtTime(Math.max(25,freq),t);
    if(cut){const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(cut,t);o.connect(f);f.connect(g)} else o.connect(g);
    o.start(t);o.stop(t+dur+.03);
  }
  function noiseHit(t,dur,vol,hp,lp){
    if(!noise||ac.state!=='running')return;
    const n=ac.createBufferSource(),f=ac.createBiquadFilter(),g=gainEnvelope(musicBus,t,vol,dur,.002);
    n.buffer=noise;f.type=hp?'highpass':'lowpass';f.frequency.value=lp||4500;
    n.connect(f);f.connect(g);n.start(t);n.stop(t+dur+.02);
  }
  function kick(t,vol){
    const g=gainEnvelope(musicBus,t,vol,.20,.003),o=ac.createOscillator();o.type='sine';o.frequency.setValueAtTime(135,t);o.frequency.exponentialRampToValueAtTime(45,t+.13);o.connect(g);o.start(t);o.stop(t+.22);
  }
  function getScene(){
    const s=window.GG_BRIDGE?.state?.()||{};
    if(s.paused)return 'pause';
    if(s.playing&&s.currentScreen==='play')return s.boss?'boss':'combat';
    return s.currentScreen==='home'?'menu':s.currentScreen==='hangar'?'hangar':s.currentScreen==='settings'?'settings':'galaxy';
  }
  function schedule(){
    if(!ac||ac.state!=='running')return;
    if(window.GG39_MUSIC?.active){next=ac.currentTime+.09;return;}
    const cfg=settings();if(!soundOn()||!cfg.musicEnabled||Number(cfg.music)<=0){next=ac.currentTime+.08;return;}
    const scene=getScene(),state=window.GG_BRIDGE?.state?.()||{},w=Math.max(0,Math.min(9,Number(state.world)||0));
    if(scene!==lastScene||w!==lastWorld){lastScene=scene;lastWorld=w;beat=0;next=ac.currentTime+.055;}
    if(scene==='pause'){next=ac.currentTime+.09;return;}
    const bpm=scene==='boss'?152:scene==='combat'?126+(w%4)*5:scene==='hangar'?100:scene==='menu'?112:94;
    const stepDur=60/bpm/4,volume=Math.max(0,Math.min(100,Number(cfg.music)||65))/100;
    while(next<ac.currentTime+.16){
      const st=beat%16,bar=Math.floor(beat/16),t=next,root=roots[w],mode=modes[w],base=scale(root,progressions[w][bar%4]);
      const accent=scene==='boss'?1.22:scene==='combat'?1:.62;
      if(st%4===0){kick(t,.28*volume*accent); if(st===4||st===12)noiseHit(t,.12,.09*volume*accent,true,1800);}
      if(st%2===0)noiseHit(t,.055,(scene==='boss'?.058:.031)*volume,true,7300);
      if(st%4===0){const rootFreq=base/2*(st===8?1.12:1);synth(rootFreq,t,stepDur*3.0,.15*volume*accent,'sawtooth',musicBus,620);}
      if(st===0||st===8){const chord=[0,mode[2],mode[4]];for(const d of chord){synth(scale(base/2,d),t,stepDur*7.8,.040*volume,'sine',musicBus,1200);}}
      let note=motifs[w][(st+(scene==='boss'?4:0))%16];
      if(scene==='menu')note=st%4===0?motifs[0][st]:-1;
      if(scene==='hangar')note=st%2===0?motifs[6][st]:-1;
      if(scene==='galaxy'||scene==='settings')note=st%4===0?motifs[8][st]:-1;
      if(note>=0){synth(scale(base, note),t,stepDur*(scene==='boss'?1.7:2.8),.10*volume*accent,'triangle',musicBus,2800);}
      if(scene==='boss'&&st%2===1)synth(scale(base,mode[3]+12),t,stepDur*.8,.042*volume,'sawtooth',musicBus,1900);
      next+=stepDur;beat++;
    }
  }
  function fxTone(freq,dur,vol,type='triangle',glide=1){
    if(!ac||ac.state!=='running'||!soundOn())return;
    const t=ac.currentTime+.004,g=gainEnvelope(fxBus,t,vol,dur,.004),o=ac.createOscillator();
    o.type=type;o.frequency.setValueAtTime(Math.max(40,freq),t);
    o.frequency.exponentialRampToValueAtTime(Math.max(35,freq*glide),t+dur);
    o.connect(g);o.start(t);o.stop(t+dur+.025);
  }
  function fxNoise(dur,vol,frequency=1800){
    if(!ac||ac.state!=='running'||!soundOn())return;
    const t=ac.currentTime+.003,n=ac.createBufferSource(),f=ac.createBiquadFilter();
    f.type='lowpass';f.frequency.value=frequency;n.buffer=noise;
    n.connect(f);f.connect(gainEnvelope(fxBus,t,vol,dur,.005));n.start(t);n.stop(t+dur+.02);
  }
  const defaults={primary:55,explosion:65,enemy:160,click:100,missile:100,homing:120,pickup:180,pickup_weapon:160,pickup_missile:170,pickup_homing:170,pickup_laser:180,pickup_plasma:200,pickup_salvo:170,pickup_electric:180,pickup_shield:180,pickup_health:180,pickup_energy:180,pickup_coin:170,electric:160};
  api.sfx=function(type){
    if(!soundOn())return;
    const cfg=settings(),amount=Math.max(0,Math.min(100,Number(cfg.sfx)||0))/100;
    if(amount<=0)return;
    const now=performance.now(),min=defaults[type]||80;
    if((now-(lastFx[type]||0))<min)return;lastFx[type]=now;
    if(!init()||ac.state!=='running')return;
    const v=amount;
    switch(type){
      case 'primary': fxTone(710,.075,.095*v,'square',.48);break;
      case 'missile': fxTone(180,.27,.16*v,'sawtooth',.34);fxNoise(.14,.07*v,900);break;
      case 'homing':fxTone(280,.32,.14*v,'triangle',1.9);fxTone(580,.15,.06*v,'sine',.67);break;
      case 'laser':fxTone(960,.28,.15*v,'sawtooth',.62);break;
      case 'plasma':fxTone(175,.38,.16*v,'sine',3.3);fxNoise(.18,.09*v,2300);break;
      case 'salvo':fxTone(260,.17,.14*v,'square',.66);break;
      case 'electric':fxTone(530,.27,.13*v,'sawtooth',1.7);fxNoise(.15,.08*v,4500);break;
      case 'enemy':fxTone(310,.10,.065*v,'triangle',.78);break;
      case 'explosion':fxTone(110,.24,.15*v,'sawtooth',.36);fxNoise(.24,.13*v,750);break;
      case 'hurt':fxTone(210,.37,.22*v,'sawtooth',.31);fxNoise(.22,.09*v,1100);break;
      case 'pickup':fxTone(480,.14,.12*v,'sine',1.8);fxTone(720,.11,.085*v,'triangle',1.36);break;
      case 'pickup_weapon':fxTone(440,.11,.14*v,'triangle',1.36);fxTone(659,.24,.11*v,'sine',1.55);fxTone(1047,.29,.07*v,'sine',1.03);break;
      case 'pickup_missile':fxTone(210,.17,.13*v,'sawtooth',1.55);fxTone(470,.18,.09*v,'triangle',1.40);break;
      case 'pickup_homing':fxTone(320,.27,.11*v,'sine',2.7);fxTone(710,.12,.065*v,'triangle',.85);break;
      case 'pickup_laser':fxTone(810,.24,.105*v,'sawtooth',1.34);fxTone(1150,.16,.06*v,'sine',1.16);break;
      case 'pickup_plasma':fxTone(230,.30,.11*v,'sine',2.22);fxTone(470,.26,.06*v,'triangle',.77);break;
      case 'pickup_salvo':fxTone(360,.08,.11*v,'square',1.10);fxTone(510,.18,.09*v,'triangle',1.55);break;
      case 'pickup_electric':fxTone(610,.19,.10*v,'sawtooth',1.95);fxNoise(.12,.04*v,3300);break;
      case 'pickup_shield':fxTone(330,.35,.12*v,'sine',1.36);fxTone(495,.29,.06*v,'sine',1.18);break;
      case 'pickup_health':fxTone(392,.19,.10*v,'triangle',1.24);fxTone(587,.29,.08*v,'sine',1.2);break;
      case 'pickup_energy':fxTone(505,.14,.11*v,'square',1.9);fxTone(880,.27,.075*v,'sine',1.42);break;
      case 'pickup_coin':fxTone(1250,.11,.06*v,'sine',1.28);fxTone(1570,.19,.055*v,'sine',1.12);break;
      case 'boss':fxTone(100,.85,.20*v,'sawtooth',.52);fxNoise(.48,.08*v,800);break;
      case 'turret':fxTone(230,.22,.11*v,'square',.5);fxNoise(.16,.075*v,1400);break;
      case 'wave':fxTone(460,.24,.10*v,'sine',1.36);break;
      case 'start':fxTone(360,.20,.11*v,'triangle',1.7);break;
      case 'victory':fxTone(523,.32,.15*v,'triangle',1.42);setTimeout(()=>fxTone(784,.42,.14*v,'triangle',1.28),150);break;
      case 'defeat':fxTone(350,.52,.12*v,'sawtooth',.46);break;
      case 'click':fxTone(550,.055,.065*v,'sine',1.14);break;
      default: fxTone(520,.065,.07*v);break;
    }
    api.events[type]=(api.events[type]||0)+1;
  };
  // Sin interacción no es posible comenzar audio en la mayoría de navegadores.
  function userGesture(e){
    if(!soundOn())return;
    resume();
    if(e?.target?.closest?.('button,[role="button"],.level-node,.shipCard,.world-pin'))api.sfx('click');
  }
  document.addEventListener('pointerdown',userGesture,{capture:true,passive:true});
  document.addEventListener('keydown',e=>{if(!e.repeat&&['Enter','Space','ArrowLeft','ArrowRight'].includes(e.code))userGesture(e)},{capture:true,passive:true});
  document.addEventListener('visibilitychange',()=>{if(ac&&document.hidden)ac.suspend().catch(()=>{});else if(api.started&&soundOn())ac?.resume().catch(()=>{})});
  window.addEventListener('pagehide',()=>{clearInterval(timeout);timeout=null;ac?.close().catch(()=>{});ac=null});
  api.diagnostics=()=>({ready:api.ready,started:api.started,state:ac?.state||'not-initialized',scene:getScene(),world:window.GG_BRIDGE?.state?.().world??0,events:{...api.events},musicEnabled:settings().musicEnabled,soundEnabled:soundOn()});
})();
