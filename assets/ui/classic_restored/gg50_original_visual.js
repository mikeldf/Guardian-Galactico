/* Guardián Galáctico · Recuperación fiel de los menús aprobados anteriores.
   Motor de 200 niveles intacto: solo presentación, navegación y recursos gráficos originales. */
(()=>{
 'use strict';
 const bridge=window.GG_EXACT_BRIDGE;
 if(!bridge)return;
 const names=['AURIX','VOLTAR','ZENTHAR','CRYON','DRAKON','NEBULIS','ORION','KAELIX','VORTEX','ELYSIUM'];
 const pos=[[585,243],[839,186],[1086,217],[1369,242],[1406,481],[1353,706],[1080,756],[821,773],[554,745],[471,485]];
 const menuRects=[[23,205,278,91],[23,302,282,92],[24,400,282,91],[23,492,283,93],[23,589,283,95]];
 const mapArt='assets/ui/refs/mapa-estelar-guardian.png';
 const levelArt='assets/ui/refs/selector-cosmico.jpg';
 const root=document.createElement('div');root.id='gg50Classic';root.setAttribute('aria-label','Pantallas clásicas recuperadas de Guardián Galáctico');
 root.innerHTML='<div class="gg50-ambient"></div><main class="gg50-stage"></main>';document.body.append(root);
 const stage=root.querySelector('.gg50-stage'), ambient=root.querySelector('.gg50-ambient');
 let active=null, world=0, selectedLevel=1;
 const add=(cls,x,y,w,h)=>{const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});stage.append(e);return e;};
 const button=(cls,label,x,y,w,h,cb)=>{const b=document.createElement('button');b.className=cls;b.type='button';b.setAttribute('aria-label',label);Object.assign(b.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});b.addEventListener('click',cb);stage.append(b);return b;};
 const snap=()=>bridge.snapshot();
 function fit(){if(!active)return;const w=active==='levels'?1672:1680,h=active==='levels'?941:944;stage.style.width=w+'px';stage.style.height=h+'px';const scale=Math.min(window.innerWidth/w,window.innerHeight/h);stage.style.transform=`translate(-50%,-50%) scale(${scale})`;}
 window.addEventListener('resize',fit);
 function hide(){active=null;root.classList.remove('active');}
 function drawMap(){
  const {save}=snap();
  const background=add('gg58-map-art',0,0,1680,944);background.style.backgroundImage=`url("${mapArt}")`;background.setAttribute('aria-hidden','true');
  const title=add('gg58-map-title',570,115,540,34);title.textContent='MAPA ESTELAR';
  const coins=add('gg58-map-coins',1360,24,250,50);coins.textContent=Number(save.coins||0).toLocaleString('es-ES');coins.setAttribute('aria-label','Piezas disponibles: '+Number(save.coins||0));
  const activeWorld=Math.max(0,Math.min(9,snap().currentWorld||0));
  const activeDone=Math.max(0,Math.min(20,save.lastUnlocked-activeWorld*20-1));
  const worldInfo=add('gg58-map-current',570,150,540,27);
  worldInfo.textContent=`${names[activeWorld]} · ${activeDone}/20 SUPERADOS`;
  const back=button('gg58-map-back','Volver al menú',22,839,258,80,()=>bridge.screen('home'));back.textContent='VOLVER';
  const planets=[
   {x:472,y:260,lx:463,ly:358},{x:729,y:258,lx:726,ly:359},{x:990,y:257,lx:990,ly:358},{x:1260,y:260,lx:1260,ly:359},
   {x:1417,y:443,lx:1417,ly:543},{x:1236,y:635,lx:1242,ly:737},{x:971,y:660,lx:973,ly:758},{x:699,y:660,lx:700,ly:758},
   {x:437,y:634,lx:422,ly:739},{x:265,y:443,lx:264,ly:543}
  ];
  planets.forEach(({x,y,lx,ly},i)=>{
   const completed=Math.max(0,Math.min(20,save.lastUnlocked-i*20-1));const unlocked=save.lastUnlocked>i*20;
   const label=add('gg58-map-label'+(unlocked?'':' locked')+(i===activeWorld?' current':''),lx-118,ly-33,236,66);
   const name=document.createElement('b');name.textContent=names[i];label.append(name);
   const sub=document.createElement('small');sub.textContent=`${i*20+1}–${i*20+20}`;label.append(sub);
   const status=document.createElement('strong');status.textContent=unlocked?`${completed}/20 SUPERADOS`:'🔒 BLOQUEADO';label.append(status);
   button('gg58-map-planet','Visitar '+names[i],x-105,y-105,210,210,()=>{
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
   const num=document.createElement('span');num.textContent=String(i);b.append(num);\n   const stars=document.createElement('span');stars.className='gg50-level-stars';stars.textContent='★★★';stars.setAttribute('aria-hidden','true');b.append(stars);
   if(cleared||!open){const stateIcon=document.createElement('img');stateIcon.className='gg50-level-state';stateIcon.src=cleared?'assets/ui/refs/level-check-badge.png?v=20261102-icons2':'assets/ui/refs/level-lock-badge.png?v=20261102-icons2';stateIcon.alt='';stateIcon.setAttribute('aria-hidden','true');b.append(stateIcon)}
   const status=cleared?'Superado':open?'Disponible':'Bloqueado';
   b.title=`Nivel ${i} · ${status}${boss?(i===20?' · Jefe final':' · Subjefe'):''}`;b.setAttribute('aria-label',b.title);b.setAttribute('aria-pressed',String(selectedLevel===global));
   b.addEventListener('click',()=>{selectedLevel=global;bridge.mission(global);show('levels');});grid.append(b);
  }
  const back=button('gg50-back','Volver al mapa galáctico',25,824,263,92,()=>bridge.screen('galaxy'));back.innerHTML='<span>VOLVER</span>';
  const launch=button('gg50-launch','Jugar nivel',526,780,620,150,()=>{if(selectedLevel<=save.lastUnlocked)bridge.start(selectedLevel)});
  launch.innerHTML='';launch.disabled=selectedLevel>save.lastUnlocked;
 }
 function changeWorld(n){world=n;selectedLevel=n*20+1;bridge.world(n);show('levels');}
 function show(id){
  if(id!=='galaxy'&&id!=='levels'){hide();return;}
  active=id;const art=id==='galaxy'?mapArt:levelArt;stage.innerHTML='';stage.style.backgroundImage='none';
  // En la ilustración original del selector había 50 números y textos incrustados.
  // Su composición se conserva sin superponerla detrás de las 20 casillas actuales.
  if(id==='levels'){const bg=add('gg50-level-art',0,0,1672,941);bg.style.backgroundImage=`url("${levelArt}")`;bg.setAttribute('aria-hidden','true');}
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

