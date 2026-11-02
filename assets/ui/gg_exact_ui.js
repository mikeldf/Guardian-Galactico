/* Fase 45: Se conserva únicamente la portada gráfica original del menú.
   El mapa, los niveles y el hangar se renderizan siempre con la interfaz
   interactiva vigente, no con capturas antiguas de 50 misiones por mundo. */
(function(){
'use strict';
const bridge=window.GG_EXACT_BRIDGE;
if(!bridge)return;
const root=document.createElement('div');
root.id='ggExactUI';
root.setAttribute('aria-label','Menú principal de Guardián Galáctico');
root.innerHTML='<div class="gg-photo-ambient"></div><div class="gg-photo-stage" role="region" aria-label="Inicio del juego"></div>';
document.body.append(root);
const stage=root.querySelector('.gg-photo-stage'),ambient=root.querySelector('.gg-photo-ambient');
const profilePanel=document.createElement('section');profilePanel.className='gg-home-profile';profilePanel.setAttribute('aria-label','Perfil de piloto y progreso');profilePanel.innerHTML='<div class="gg-home-profile-title">PERFIL DE PILOTO</div><div class="gg-home-profile-grid"><div><small>PILOTO</small><strong data-profile="name">PILOTO</strong></div><div><small>PIEZAS</small><strong data-profile="pieces">◈ 0</strong></div><div><small>MISIONES</small><strong data-profile="missions">0 / 200</strong></div><div><small>NAVES</small><strong data-profile="ships">5 / 60</strong></div></div><div class="gg-home-side-actions"><button type="button" class="gg-home-action" data-act="missions" aria-label="Abrir misiones"><span aria-hidden="true">✦</span>MISIONES</button><button type="button" class="gg-home-action" data-act="ranking" aria-label="Abrir ranking"><span aria-hidden="true">🏆</span>RANKING</button></div>';root.append(profilePanel);
const homeArt='assets/ui/refs/principal.optim.webp';
const menuRects=[[43,220,333,132],[45,365,332,117],[45,492,332,117],[44,618,335,116],[45,743,332,118]];
const worldNames=['AURIX','VOLTAR','ZENTHAR','CRYON','DRAKON','NEBULIS','ORION','KAELIX','VORTEX','ELYSIUM'];
let active=false;
function resize(){if(active)stage.style.transform=`translate(-50%,-50%) scale(${innerWidth/1672},${innerHeight/941})`}
window.addEventListener('resize',resize);
function hide(){active=false;root.classList.remove('active')}
function show(id){
  if(id!=='home'){hide();return;}
  active=true;
  const s=bridge.snapshot();
  const profile=bridge.profile?.()||{};
  profilePanel.querySelector('[data-profile="name"]').textContent=profile.name||'PILOTO';
  profilePanel.querySelector('[data-profile="pieces"]').textContent='◈ '+Number(profile.pieces||0).toLocaleString('es-ES');
  profilePanel.querySelector('[data-profile="missions"]').textContent=Number(profile.missions||0)+' / 200';
  profilePanel.querySelector('[data-profile="ships"]').textContent=Number(profile.ships||0)+' / 60';
  const level=Math.max(1,Math.min(200,Number(bridge.currentMission())||1));
  stage.innerHTML='';stage.style.width='1672px';stage.style.height='941px';
  stage.style.backgroundImage=`url("${homeArt}")`;
  ambient.style.backgroundImage=`url("${homeArt}")`;
  const labels=['Jugar','Mapa galáctico','Hangar','Opciones','Salir'];
  menuRects.forEach(([x,y,w,h],i)=>{
    const b=document.createElement('button');b.type='button';b.className='gg-hit';b.dataset.act='nav:'+i;
    b.setAttribute('aria-label',labels[i]);Object.assign(b.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});stage.append(b);
  });
  const b=document.createElement('button');b.type='button';b.className='gg-continue-main';
  b.dataset.act='continue';b.setAttribute('aria-label','Continuar misión '+level);
  b.innerHTML=`<span class="gg-continue-icon">↪</span><span>CONTINUAR<small>NIVEL ${level} DE 200 · ${worldNames[Math.floor((level-1)/20)]}</small></span>`;
  stage.append(b);
  root.classList.add('active');resize();
}
root.addEventListener('click',e=>{
  const b=e.target.closest('button[data-act]');if(!b)return;
  const [kind,value]=b.dataset.act.split(':');
  if(kind==='continue'){bridge.resume();return;}
  if(kind==='ranking'){bridge.openRanking?.();return;}
  if(kind==='missions'){bridge.openCurrentLevels();return;}
  if(kind!=='nav')return;
  const i=Number(value);
  if(i===0)bridge.openCurrentLevels();
  else if(i===1)bridge.screen('galaxy');
  else if(i===2)bridge.screen('hangar');
  else if(i===3)bridge.screen('settings');
  else {hide();document.getElementById('exitBtn')?.click();}
});
bridge.hook(show);
show(bridge.snapshot().currentScreen);
window.GG_EXACT_UI={show,hide,resize,mode:'inicio-unicamente-200-niveles'};
})();

