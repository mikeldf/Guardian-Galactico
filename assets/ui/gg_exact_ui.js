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
const profilePanel=document.createElement('section');profilePanel.className='gg-home-profile';profilePanel.setAttribute('aria-label','Monedas y navegación');profilePanel.innerHTML='<div class="gg-home-profile-grid"><div><strong data-profile="pieces">250</strong></div></div><div class="gg-home-side-actions"><button type="button" class="gg-home-action" data-act="ranking" aria-label="Abrir ranking"><span class="gg-action-copy"><strong>RANKING</strong></span></button><button type="button" class="gg-home-action" data-act="stats" aria-label="Abrir estadísticas"><span class="gg-action-copy"><strong>ESTADÍSTICAS</strong></span></button></div>';root.append(profilePanel);
const homeArt='assets/ui/refs/principal.right-menu.jpg';
const menuRects=[[43,265,390,118],[43,398,390,104],[43,507,390,107],[43,620,390,105],[43,734,390,106]];
let active=false;
function resize(){if(active)stage.style.transform=`translate(-50%,-50%) scale(${innerWidth/1672},${innerHeight/941})`}
window.addEventListener('resize',resize);
function hide(){active=false;root.classList.remove('active')}
function show(id){
  if(id!=='home'){hide();return;}
  active=true;
  const s=bridge.snapshot();
  const profile=bridge.profile?.()||{};
  profilePanel.querySelector('[data-profile="pieces"]').textContent=Number(profile.pieces||0).toLocaleString('es-ES');
  const level=Math.max(1,Math.min(200,Number(bridge.currentMission())||1));
  stage.innerHTML='';stage.style.width='1672px';stage.style.height='941px';
  stage.style.backgroundImage=`url("${homeArt}")`;
  ambient.style.backgroundImage=`url("${homeArt}")`;
  const labels=['JUGAR','MAPA GALÁCTICO','HANGAR','OPCIONES','SALIR'];
  menuRects.forEach(([x,y,w,h],i)=>{
    const b=document.createElement('button');b.type='button';b.className='gg-hit';b.dataset.act='nav:'+i;
    b.className='gg-hit gg-main-menu-action';b.setAttribute('aria-label',labels[i]);b.innerHTML='<strong>'+labels[i]+'</strong>';Object.assign(b.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});stage.append(b);
  });
  const b=document.createElement('button');b.type='button';b.className='gg-continue-main';
  b.dataset.act='continue';b.setAttribute('aria-label','Continuar misión '+level);
  b.textContent='CONTINUAR';
  Object.assign(b.style,{left:'43px',top:'138px',width:'390px',height:'112px'});
  stage.append(b);
  root.classList.add('active');resize();
}
root.addEventListener('click',e=>{
  const b=e.target.closest('button[data-act]');if(!b)return;
  const [kind,value]=b.dataset.act.split(':');
  if(kind==='continue'){bridge.resume();return;}
  if(kind==='ranking'){bridge.openRanking?.();return;}
  if(kind==='stats'){bridge.openStats?.();return;}
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

