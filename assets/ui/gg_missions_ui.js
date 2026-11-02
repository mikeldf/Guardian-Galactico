/* Missions screen built over the supplied artwork; every campaign row maps to MISSION_SCRIPTS. */
(()=>{'use strict';
 const bridge=window.GG_EXACT_BRIDGE;if(!bridge)return;
 const root=document.createElement('section');root.id='ggMissions';root.setAttribute('role','dialog');root.setAttribute('aria-label','Misiones');root.setAttribute('aria-modal','true');
 root.innerHTML='<div class="ggm-stage"><div class="ggm-coins" aria-live="polite"></div><nav class="ggm-tabs" aria-label="Secciones"><button class="ggm-tab" data-tab="campaign" aria-selected="true">CAMPAÑA</button><button class="ggm-tab" data-tab="progress">PROGRESO</button><button class="ggm-tab" data-tab="achievements">LOGROS</button><button class="ggm-tab" data-tab="ranking">RANKING</button></nav><main class="ggm-content"></main><button class="ggm-return" type="button">VOLVER</button></div>';
 document.body.append(root);
 const stage=root.querySelector('.ggm-stage'),content=root.querySelector('.ggm-content');let active=false,tab='campaign',selected=1;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function resize(){if(active){const sx=innerWidth/1672,sy=innerHeight/941;stage.style.transform=`translate(-50%,-50%) scale(${sx},${sy})`}}
 function profile(){return bridge.profile?.()||{}}
 function save(){return bridge.snapshot?.().save||{}}
 function mission(n){return bridge.campaignMission?.(n)||null}
 function status(m){const last=Number(save().lastUnlocked||1);return m.nivel<last?'SUPERADA':m.nivel<=last?'DISPONIBLE':'BLOQUEADA'}
 function setTab(next){tab=next;root.querySelectorAll('.ggm-tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===tab)));render()}
 function rowButton({title,meta,state,value,click,disabled=false,selectedRow=false}){return `<button type="button" class="ggm-row${selectedRow?' selected':''}" ${disabled?'disabled':''} data-value="${esc(value)}"><strong>${esc(title)}</strong><small>${esc(meta)}</small><span class="ggm-state ${state==='BLOQUEADA'?'locked':state==='SUPERADA'?'cleared':''}">${esc(state)}</span></button>`}
 function renderCampaign(){
   const all=Array.from({length:200},(_,i)=>mission(i+1)).filter(Boolean);if(!all.length){content.innerHTML='<div class="ggm-empty">No se pudo cargar el catálogo de misiones.</div>';return;}
   selected=Math.max(1,Math.min(200,selected));const m=mission(selected)||all[0];
   const list=document.createElement('div');list.className='ggm-list';list.setAttribute('aria-label','Campaña: 200 misiones');
   list.innerHTML=all.map(x=>rowButton({title:`${x.nivel}. ${x.nombre}`,meta:`MUNDO ${x.mundo} · ${x.oleadas} OLEADAS · ${x.enemigos} ENEMIGOS · RECOMPENSA ${x.recompensa} ◈`,state:status(x),value:x.nivel,selectedRow:x.nivel===selected})).join('');
   content.append(list);
   const details=document.createElement('aside');details.className='ggm-details';details.setAttribute('aria-label','Detalles de la misión');
   details.innerHTML=`<h2>${esc(m.nombre)}</h2><p class="ggm-sub">MUNDO ${m.mundo} · MISIÓN ${String(m.nivel).padStart(3,'0')}</p><p class="ggm-desc">${esc(m.objetivo)}</p><dl><dt>ESTADO</dt><dd>${status(m)}</dd><dt>OLEADAS</dt><dd>${m.oleadas}</dd><dt>ENEMIGOS</dt><dd>${m.enemigos}</dd><dt>RECOMPENSA</dt><dd>◈ ${Number(m.recompensa).toLocaleString('es-ES')}</dd></dl><button class="ggm-play" type="button" ${status(m)==='BLOQUEADA'?'disabled':''}>JUGAR MISIÓN ▶</button>`;
   content.append(details);
   list.addEventListener('click',e=>{const b=e.target.closest('.ggm-row');if(!b||b.disabled)return;selected=Number(b.dataset.value);renderCampaign();});
   details.querySelector('.ggm-play').addEventListener('click',()=>{if(status(m)==='BLOQUEADA')return;hide();bridge.selectCampaignMission?.(m.nivel)});
 }
 function summaryRows(items){const rows=[];for(let i=0;i<items.length;i+=2){const pair=items.slice(i,i+2);rows.push(`<div class="ggm-summary-row${pair.length===1?' single':''}">${pair.map(([label,value,sub='',done=true])=>`<div class="ggm-stat"><small>${done?'✦':'◇'} ${esc(label)}</small><strong>${esc(value)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`).join('')}</div>`)}return `<div class="ggm-summary">${rows.join('')}</div>`}
 function renderProgress(){const p=profile(),last=Number(save().lastUnlocked||1),items=[['MISIONES SUPERADAS',`${Math.max(0,last-1)} / 200`],['PLANETAS ALCANZADOS',`${Math.min(10,Math.ceil(last/20))} / 10`],['PIEZAS',Number(p.pieces||0).toLocaleString('es-ES')],['VICTORIAS',Number(p.wins||0).toLocaleString('es-ES')],['JEFES DERROTADOS',Number(p.bossWins||0).toLocaleString('es-ES')],['MEJOR PUNTUACIÓN',Number(p.bestScore||0).toLocaleString('es-ES')],['NAVES DESBLOQUEADAS',`${Number(p.ships||0)} / 60`]];content.innerHTML=summaryRows(items)}
 function renderAchievements(){const p=profile(),last=Number(save().lastUnlocked||1),checks=[['PRIMER VUELO','1 misión completada',`${Number(p.wins||0)} / 1`,Number(p.wins||0)>=1],['CAZADOR DE JEFES','Derrota a un jefe',`${Number(p.bossWins||0)} / 1`,Number(p.bossWins||0)>=1],['EXPLORADOR','Supera 20 misiones',`${Math.max(0,last-1)} / 20`,last>20],['MÁS ALLÁ DEL BORDE','Alcanza el mundo 5',`${Math.min(5,Math.ceil(last/20))} / 5 mundos`,last>80],['COLECCIONISTA','Consigue 500 piezas',`${Number(p.pieces||0).toLocaleString('es-ES')} / 500`,Number(p.pieces||0)>=500],['FLOTA ESTELAR','Desbloquea 10 naves',`${Number(p.ships||0)} / 10`,Number(p.ships||0)>=10]].map(([name,desc,progress,done])=>[done?'LOGRO CONSEGUIDO · '+name:'LOGRO PENDIENTE · '+name,desc,progress,done]);content.innerHTML=summaryRows(checks)}
 function renderRanking(){const p=profile(),runs=bridge.pilotRuns?.()||[];const list=document.createElement('div');list.className='ggm-list';list.setAttribute('aria-label','Mejores partidas');if(!runs.length){content.innerHTML='<div class="ggm-empty">Todavía no hay partidas registradas. Completa una misión para aparecer aquí.</div>';return;}list.innerHTML=runs.slice(0,10).map((r,i)=>rowButton({title:`${i+1}. ${r.name}`,meta:`MISIÓN ${r.level} · ${r.won?'VICTORIA':'PARTIDA'} · ${Number(r.score).toLocaleString('es-ES')} PUNTOS`,state:i===0?'MEJOR PARTIDA':'REGISTRO',value:i})).join('');content.append(list);const d=document.createElement('aside');d.className='ggm-details';d.innerHTML=`<h2>RANKING LOCAL</h2><p class="ggm-sub">PILOTO: ${esc(p.name||'PILOTO')}</p><p class="ggm-desc">Mejores partidas guardadas en este dispositivo.</p><dl><dt>PARTIDAS</dt><dd>${runs.length}</dd><dt>MEJOR PUNTUACIÓN</dt><dd>${Number(p.bestScore||0).toLocaleString('es-ES')}</dd><dt>VICTORIAS</dt><dd>${Number(p.wins||0)}</dd></dl><button class="ggm-play" type="button">ABRIR RANKING COMPLETO</button>`;content.append(d);d.querySelector('button').addEventListener('click',()=>{hide();bridge.openRanking?.()})}
 function render(){root.querySelector('.ggm-coins').textContent=`◈ ${Number(profile().pieces||0).toLocaleString('es-ES')}`;content.innerHTML='';if(tab==='campaign')renderCampaign();else if(tab==='progress')renderProgress();else if(tab==='achievements')renderAchievements();else renderRanking()}
 function open(){active=true;root.classList.add('active');window.GG_EXACT_UI?.hide();render();resize();root.querySelector('.ggm-tab')?.focus({preventScroll:true})}
 function hide(){active=false;root.classList.remove('active')}
 root.addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t)setTab(t.dataset.tab);if(e.target.closest('.ggm-return')){hide();bridge.screen('home')}});
 window.addEventListener('resize',resize);window.addEventListener('keydown',e=>{if(active&&e.key==='Escape'){e.preventDefault();hide();bridge.screen('home')}});
 bridge.hook(id=>{if(id!=='home'&&active)hide()});
 window.GG_MISSIONS_UI={open,hide,render,get active(){return active}};
})();
