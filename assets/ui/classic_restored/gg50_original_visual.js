/* Guardián Galáctico · Recuperación fiel de los menús aprobados anteriores.
   Motor de 200 niveles intacto: solo presentación, navegación y recursos gráficos originales. */
(()=>{
 'use strict';
 const bridge=window.GG_EXACT_BRIDGE;
 if(!bridge)return;
 const names=['AURIX','VOLTAR','ZENTHAR','CRYON','DRAKON','NEBULIS','ORION','KAELIX','VORTEX','ELYSIUM'];
 const pos=[[585,243],[839,186],[1086,217],[1369,242],[1406,481],[1353,706],[1080,756],[821,773],[554,745],[471,485]];
 const menuRects=[[23,205,278,91],[23,302,282,92],[24,400,282,91],[23,492,283,93],[23,589,283,95]];
 const mapArt='assets/ui/classic_restored/mapa_original_sin_textos.webp';
 const levelArt='assets/ui/classic_restored/niveles_original.png';
 const root=document.createElement('div');root.id='gg50Classic';root.setAttribute('aria-label','Pantallas clásicas recuperadas de Guardián Galáctico');
 root.innerHTML='<div class="gg50-ambient"></div><main class="gg50-stage"></main>';document.body.append(root);
 const stage=root.querySelector('.gg50-stage'), ambient=root.querySelector('.gg50-ambient');
 let active=null, world=0, selectedLevel=1;
 const add=(cls,x,y,w,h)=>{const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});stage.append(e);return e;};
 const button=(cls,label,x,y,w,h,cb)=>{const b=document.createElement('button');b.className=cls;b.type='button';b.setAttribute('aria-label',label);Object.assign(b.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});b.addEventListener('click',cb);stage.append(b);return b;};
 const snap=()=>bridge.snapshot();
 function fit(){if(!active)return;const s=Math.min(window.innerWidth/1536,window.innerHeight/1024);stage.style.transform=`translate(-50%,-50%) scale(${s})`;}
 window.addEventListener('resize',fit);
 function hide(){active=null;root.classList.remove('active');}
 function drawMap(){
  const {save,PLANET_ART}=snap();
  // Decoración de mapa por capas: se reutilizan las naves, planetas y galaxia
  // originales, pero no el bloque rasterizado que contenía cajas oscuras.
  add('gg51-map-core',570,290,720,390).setAttribute('aria-hidden','true');
  add('gg51-map-orbit',434,144,1034,648).setAttribute('aria-hidden','true');
  add('gg51-map-sidebar',0,0,388,1024).setAttribute('aria-hidden','true');
  const h=add('gg51-map-title',705,17,720,93);h.innerHTML='<b>MAPA GALÁCTICO</b><small>SELECCIONA UN PLANETA</small>';
  pos.forEach(([x,y],i)=>{
   const orb=add('gg51-map-orb',x-97,y-97,194,194);
   const img=document.createElement('img');img.src=PLANET_ART[i];img.alt='';img.decoding='async';orb.append(img);
  });
  menuRects.forEach(([x,y,w,h],i)=>button('gg50-menu-hit',['Jugar','Mapa galáctico','Hangar','Opciones','Salir'][i],x,y,w,h,()=>{
   if(i===0)bridge.openCurrentLevels(); else if(i===1)show('galaxy'); else if(i===2)bridge.screen('hangar'); else if(i===3)bridge.screen('settings'); else document.getElementById('exitBtn')?.click();
  }));
  pos.forEach(([x,y],i)=>{
   const completed=Math.max(0,Math.min(20,save.lastUnlocked-i*20-1));const unlocked=save.lastUnlocked>i*20;
   const label=add('gg50-map-label'+(unlocked?'':' locked'),x-108,y+61,216,108);
   const b=document.createElement('b');b.textContent=(i+1)+'. '+names[i];label.append(b);
   const sub=document.createElement('small');sub.textContent=`Niveles ${i*20+1}–${i*20+20}`;label.append(sub);
   const status=document.createElement('strong');status.textContent=unlocked?`${completed}/20 COMPLETADOS`:'BLOQUEADO';label.append(status);
   button('gg50-map-planet','Visitar '+names[i],x-90,y-85,180,170,()=>{
    bridge.planet(i);
    window.GG_P28_ENTRY_RECT={x:innerWidth/2,y:innerHeight/2,size:110};
    bridge.enter();
   });
  });
 }
 function drawLevels(){
  const state=snap(),save=state.save;
  world=Math.max(0,Math.min(9,Number(state.currentWorld)||0));
  const start=world*20,localCurrent=Math.max(1,Math.min(20,save.lastUnlocked-start));
  if(!(selectedLevel>start&&selectedLevel<=start+20))selectedLevel=start+localCurrent;
  const name=names[world];
  const head=add('gg50-level-head',687,27,706,106);head.innerHTML=`<small>PLANETA ${world+1} · MUNDO ${world+1}/10</small><b>${name}</b>`;
  const prev=button('gg50-world-arrow','Planeta anterior',615,43,63,72,()=>changeWorld((world+9)%10));prev.textContent='❮';
  const next=button('gg50-world-arrow','Planeta siguiente',1404,43,63,72,()=>changeWorld((world+1)%10));next.textContent='❯';
  const planet=add('gg50-planet-well',10,157,535,353);const img=document.createElement('img');img.src=state.PLANET_ART[world];img.alt='Planeta '+name;planet.append(img);
  const details=add('gg50-world-details',51,520,468,311);
  const title=document.createElement('h3');title.textContent=name;details.append(title);
  const desc=document.createElement('p');desc.textContent=state.WORLD_DESC[world]||'Explora y protege este mundo.';details.append(desc);
  const stats=[['✦ Niveles','1–20'],['🚀 Enemigos','7 tipos'],['☠ Encuentros','Subjefe 10 · Jefe 20']];
  stats.forEach(([l,r])=>{const line=document.createElement('div');line.className='gg50-detail-line';const a=document.createElement('span');a.textContent=l;const b=document.createElement('strong');b.textContent=r;line.append(a,b);details.append(line)});
  const panel=add('gg50-level-panel',570,167,929,641);
  const heading=document.createElement('div');heading.className='gg50-level-heading';heading.textContent=`NIVELES ${start+1}–${start+20}`;panel.append(heading);
  const grid=document.createElement('div');grid.className='gg50-level-grid';panel.append(grid);
  for(let i=1;i<=20;i++){
   const global=start+i,cleared=global<save.lastUnlocked,open=global===save.lastUnlocked, boss=i===10||i===20;
   const b=document.createElement('button');b.type='button';b.className='gg50-level-card'+(cleared?' cleared':!open?' locked':'')+(boss?' boss':'')+(selectedLevel===global?' selected':'');
   const num=document.createElement('span');num.textContent=String(i);b.append(num);
   const info=document.createElement('small');info.textContent=i===20?'JEFE FINAL':i===10?'SUBJEFE':cleared?'✓ SUPERADO':open?'DISPONIBLE':'BLOQUEADO';b.append(info);
   b.title=`Nivel ${i} · ${cleared?'Superado':open?'Disponible':'Bloqueado'}`;b.setAttribute('aria-label',b.title);
   b.addEventListener('click',()=>{selectedLevel=global;bridge.mission(global);show('levels');});grid.append(b);
  }
  const summary=document.createElement('div');summary.className='gg50-level-summary';panel.append(summary);
  const sumText=document.createElement('div');const sTitle=document.createElement('strong');sTitle.textContent=selectedLevel===start+20?'JEFE FINAL':selectedLevel===start+10?'SUBJEFE':'MISIÓN '+String(selectedLevel-start).padStart(2,'0');
  const sInfo=document.createElement('span');sInfo.textContent=`${name} · Misión ${selectedLevel-start} de 20 · ${selectedLevel<save.lastUnlocked?'SUPERADA':selectedLevel===save.lastUnlocked?'DISPONIBLE':'BLOQUEADA'}`;sumText.append(sTitle,sInfo);summary.append(sumText);
  const missionHint=document.createElement('div');missionHint.style.cssText='font-size:15px;color:#88dbff;font-weight:700;text-align:right';missionHint.textContent='20 MISIONES · PROGRESO GUARDADO';summary.append(missionHint);
  const back=button('gg50-back','Volver al mapa',34,867,333,109,()=>bridge.screen('galaxy'));back.innerHTML='❮　VOLVER<small>Mapa galáctico</small>';
  const launch=button('gg50-launch','Jugar nivel seleccionado',1055,863,444,114,()=>{if(selectedLevel<=save.lastUnlocked)bridge.start(selectedLevel)});
  launch.textContent=selectedLevel<=save.lastUnlocked?'▶  JUGAR NIVEL '+(selectedLevel-start):'🔒 NIVEL BLOQUEADO';launch.disabled=selectedLevel>save.lastUnlocked;
 }
 function changeWorld(n){world=n;selectedLevel=n*20+1;bridge.world(n);show('levels');}
 function show(id){
  if(id!=='galaxy'&&id!=='levels'){hide();return;}
  active=id;const art=id==='galaxy'?mapArt:levelArt;stage.innerHTML='';
  // En la ilustración original del selector había 50 números y textos incrustados.
  // Su composición se conserva sin superponerla detrás de las 20 casillas actuales.
  stage.style.backgroundImage='none';
  ambient.style.backgroundImage=`url("${art}")`;root.classList.add('active');
  if(id==='levels'){
   const fragment=add('gg51-original-logo-planet',0,0,560,170);
   fragment.setAttribute('aria-hidden','true');
   const deck=add('gg52-bottom-deck',0,789,1536,235);
   deck.setAttribute('aria-hidden','true');
  }
  if(id==='galaxy')drawMap();else drawLevels();fit();
 }
 bridge.hook(show);
 document.addEventListener('keydown',e=>{
  if(!active||e.key!=='Escape')return;
  e.preventDefault();if(active==='levels')bridge.screen('galaxy');else bridge.screen('home');
 });
 show(snap().currentScreen);
 window.GG50_VISUAL={screen:show,hide,version:'Restauracion grafica aprobada · 200 niveles',diagnostics:()=>({active,world,selectedLevel,mapArt,levelArt,gridCount:root.querySelectorAll('.gg50-level-card').length})};
})();
