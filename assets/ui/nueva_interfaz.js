/* Vínculos y datos vivos para las cuatro pantallas ilustradas. No modifica el motor de combate. */
(() => {
  const $ui = (id)=>document.getElementById(id);
  const originalGalaxy=UI.galaxy;
  const originalLevels=UI.levels;
  const originalHangar=UI.hangar;
  const liveSave=()=>save;
  // Preserve native navigation and unlock rules.
  document.querySelectorAll('.gg-side-menu [data-go]').forEach(button=>{
    button.addEventListener('click',()=>{
      const destination=button.dataset.go;
      if(destination==='exit'){document.getElementById('exitBtn').click();return;}
      if(destination==='hangar')hangarFrom=currentScreen;
      UI.screen(destination);
    });
  });
  UI.galaxy=function(){
    originalGalaxy.call(UI);
    // Elliptical path around the centre, keeping the info panel unobstructed.
    const positions=[[14,28],[31,15],[51,10],[72,17],[87,32],[86,48],[68,82],[47,88],[26,80],[12,62]];
    document.querySelectorAll('#galaxyGrid .world-pin').forEach((button,i)=>{
      button.style.setProperty('--x',positions[i][0]+'%');
      button.style.setProperty('--y',positions[i][1]+'%');
      const done=Math.max(0,Math.min(50,liveSave().lastUnlocked-i*50-1));
      button.setAttribute('aria-label',WORLD_NAMES[i]+': '+done+' de 50 niveles completados');
    });
    markSidebar('galaxy');
  };
  UI.levels=function(){
    originalLevels.call(UI);
    const world=currentWorld;
    const planet=$ui('gg-level-planet');
    if(planet){planet.src=PLANET_ART[world];planet.alt=WORLD_NAMES[world];}
    // Replace cosmetic ✓ glyphs with actual level number and completion/lock state.
    document.querySelectorAll('#levelGrid .level-node').forEach(button=>{
      const number=Number(button.dataset.level);
      const local=(number-1)%50+1;
      const completed=number<liveSave().lastUnlocked;
      const unlocked=number===liveSave().lastUnlocked;
      const boss=local%10===0;
      const label=completed?'✓ SUPERADO':unlocked?'DISPONIBLE':'🔒';
      button.innerHTML='<span>'+local+'</span><small>'+(boss?(local===50?'JEFE':'SUBJEFE'):label)+'</small>';
    });
    // Grid is not horizontally paginated; native button selection still works.
    $ui('levelViewport').scrollLeft=0;
  };
  UI.hangar=function(){
    originalHangar.call(UI);
    markSidebar('hangar');
    const selected=document.querySelector('#hangarGrid .shipCard.selected');
    if(selected)selected.scrollIntoView({inline:'nearest',block:'nearest',behavior:'instant'});
  };
  function markSidebar(screen){
    document.querySelectorAll('.gg-side-menu').forEach(menu=>{
      menu.querySelectorAll('button').forEach(b=>{
        const active=(screen==='galaxy'&&b.classList.contains('gg-menu-map'))||(screen==='hangar'&&b.classList.contains('gg-menu-hangar'));
        b.classList.toggle('active',active);
        if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
      });
    });
  }
  // Reduced-motion / accessibility labeling for backgrounds that are purely decorative.
  document.querySelectorAll('#home .landing-copy, #galaxy .galaxy-layout, #levels .level-layout, #hangar .hangarDetail').forEach(el=>el.setAttribute('data-gg-ui-live','1'));
  window.GG_MENU_VERSION='4 pantallas interactivas · 2026-10-30';
})();

/* Ten planets are equidistant on one true circular orbit, recalculated on resize. */
(()=>{
  const previousGalaxy=UI.galaxy;
  const positionPlanets=()=>{
    const board=document.getElementById('galaxyBoard');
    if(!board || board.getBoundingClientRect().height<50)return;
    const r=board.getBoundingClientRect();
    const compact=window.innerWidth<=700;
    const diameter=compact?49:(window.innerWidth<=1050?67:(window.innerHeight<760?76:85));
    const margin=compact?66:window.innerWidth<=1050?95:window.innerHeight<760?98:128;
    const radius=Math.max(65,Math.min((r.width-margin)/2,(r.height-margin)/2));
    board.style.setProperty('--gg-orbit-radius',radius.toFixed(1)+'px');
    const pins=board.querySelectorAll('#galaxyGrid .world-pin');
    pins.forEach((pin,i)=>{
      const a=(-90+i*36)*Math.PI/180;
      pin.style.setProperty('--x',(r.width/2 + radius*Math.cos(a)).toFixed(1)+'px');
      pin.style.setProperty('--y',(r.height/2 + radius*Math.sin(a)).toFixed(1)+'px');
    });
  };
  UI.galaxy=function(){previousGalaxy.call(UI);positionPlanets();requestAnimationFrame(positionPlanets)};
  window.addEventListener('resize',()=>{if(currentScreen==='galaxy')positionPlanets()});
  window.GG_POSITION_PLANETS=positionPlanets;
})();
