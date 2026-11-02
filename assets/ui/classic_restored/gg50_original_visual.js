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
 const levelArt='assets/ui/refs/selector-cosmico.jpg';
 const root=document.createElement('div');root.id='gg50Classic';root.setAttribute('aria-label','Pantallas clásicas recuperadas de Guardián Galáctico');
 root.innerHTML='<div class="gg50-ambient"></div><main class="gg50-stage"></main>';document.body.append(root);
 const stage=root.querySelector('.gg50-stage'), ambient=root.querySelector('.gg50-ambient');
 let active=null, world=0, selectedLevel=1;
 const add=(cls,x,y,w,h)=>{const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});stage.append(e);return e;};
 const button=(cls,label,x,y,w,h,cb)=>{const b=document.createElement('button');b.className=cls;b.type='button';b.setAttribute('aria-label',label);Object.assign(b.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});b.addEventListener('click',cb);stage.append(b);return b;};
 const snap=()=>bridge.snapshot();
 function fit(){if(!active)return;const w=active==='levels'?1672:1536,h=active==='levels'?941:1024;stage.style.width=w+'px';stage.style.height=h+'px';if(active==='levels'){const sx=window.innerWidth/w,sy=window.innerHeight/h;stage.style.transform=`translate(-50%,-50%) scale(${sx},${sy})`;return;}const s=Math.min(window.innerWidth/w,window.innerHeight/h);stage.style.transform=`translate(-50%,-50%) scale(${s})`;}
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
  const caption=add('gg50-level-caption',60,69,410,88);caption.innerHTML=`<b>${name}</b><small>NIVELES ${start+1}–${start+20}</small>`;
  const coins=add('gg50-level-coins',1350,72,238,78);coins.textContent=Number(save.coins||0).toLocaleString('es-ES');coins.setAttribute('aria-label','Piezas disponibles: '+Number(save.coins||0));
  button('gg50-world-arrow','Planeta anterior',501,190,132,89,()=>changeWorld((world+9)%10));
  button('gg50-world-arrow','Planeta siguiente',1093,190,132,89,()=>changeWorld((world+1)%10));
  const dots=add('gg50-world-dots',700,221,370,30);dots.setAttribute('aria-label','Seleccionar planeta');
  names.forEach((planetName,i)=>{const dot=document.createElement('button');dot.type='button';dot.className='gg50-planet-dot'+(i===world?' active':'');dot.setAttribute('aria-label','Ir al planeta '+planetName);dot.title=planetName;dot.addEventListener('click',()=>changeWorld(i));dots.append(dot)});
  const planet=add('gg50-planet-well',32,288,394,397);const img=document.createElement('img');img.src=state.PLANET_ART[world];img.alt='Planeta '+name;img.draggable=false;planet.append(img);
  const grid=add('gg50-level-grid',476,314,818,416);
  for(let i=1;i<=20;i++){
   const global=start+i,cleared=global<save.lastUnlocked,open=global===save.lastUnlocked, boss=i===10||i===20;
   const b=document.createElement('button');b.type='button';b.className='gg50-level-card'+(cleared?' cleared':!open?' locked':'')+(boss?' boss':'')+(selectedLevel===global?' selected':'');
   const num=document.createElement('span');num.textContent=String(i);b.append(num);
   if(cleared||!open){const stateIcon=document.createElement('i');stateIcon.className='gg50-level-state';stateIcon.textContent=cleared?'✓':'🔒';stateIcon.setAttribute('aria-hidden','true');b.append(stateIcon)}
   const status=cleared?'Superado':open?'Disponible':'Bloqueado';
   b.title=`Nivel ${i} · ${status}${boss?(i===20?' · Jefe final':' · Subjefe'):''}`;b.setAttribute('aria-label',b.title);b.setAttribute('aria-pressed',String(selectedLevel===global));
   b.addEventListener('click',()=>{selectedLevel=global;bridge.mission(global);show('levels');});grid.append(b);
  }
  const back=button('gg50-back','Volver al mapa galáctico',25,824,263,92,()=>bridge.screen('galaxy'));back.innerHTML='<span>VOLVER</span>';
  const launch=button('gg50-launch','Iniciar nivel '+(selectedLevel-start),555,786,560,124,()=>{if(selectedLevel<=save.lastUnlocked)bridge.start(selectedLevel)});
  launch.innerHTML=`<span>JUGAR NIVEL ${String(selectedLevel-start).padStart(2,'0')}</span>`;launch.disabled=selectedLevel>save.lastUnlocked;
 }
 function changeWorld(n){world=n;selectedLevel=n*20+1;bridge.world(n);show('levels');}
 function show(id){
  if(id!=='galaxy'&&id!=='levels'){hide();return;}
  active=id;const art=id==='galaxy'?mapArt:levelArt;stage.innerHTML='';
  // En la ilustración original del selector había 50 números y textos incrustados.
  // Su composición se conserva sin superponerla detrás de las 20 casillas actuales.
  stage.style.backgroundImage=id==='levels'?`url("${levelArt}")`:'none';stage.style.backgroundSize='100% 100%';stage.style.backgroundPosition='center';stage.style.backgroundRepeat='no-repeat';
  ambient.style.backgroundImage=`url("${art}")`;root.classList.add('active');
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

