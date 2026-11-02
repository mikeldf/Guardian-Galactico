/* Guardián Galáctico · Opciones de pantalla para navegador y futuro .exe de Windows.
   No reemplaza las interfaces Fase 55.8 ni el motor de combate. */
(()=>{
 'use strict';
 const STORAGE='GG_DISPLAY_SETTINGS_V1';
 const MODES=['fullscreen','window','borderless'];
 const RESOLUTIONS=['1280x720','1600x900','1920x1080','2560x1440','3840x2160'];
 const DEFAULT={mode:'fullscreen',resolution:'1920x1080',scale:100};
 const desktop=window.GG_DESKTOP_DISPLAY;
 const root=document.querySelector('#settings .gg39-settings-column:nth-child(2)');
 if(!root)return;
 let cfg={...DEFAULT};
 let updating=false;
 function clean(v){
  if(!v||typeof v!=='object')v={};
  const n=Number(v.scale);
  return {mode:MODES.includes(v.mode)?v.mode:DEFAULT.mode,
   resolution:RESOLUTIONS.includes(v.resolution)?v.resolution:DEFAULT.resolution,
   scale:Number.isFinite(n)?Math.round(Math.max(75,Math.min(150,n))/5)*5:100};
 }
 try{cfg=clean(JSON.parse(localStorage.getItem(STORAGE)||'null'))}catch{}
 const card=document.createElement('div');
 card.className='panel gg39-setting-card gg-display-card';
 card.id='ggDisplayCard';
 card.innerHTML=`<div class="gg39-card-title"><span class="gg39-card-icon">▣</span><div><small>SISTEMA 05</small><h3>PANTALLA Y RESOLUCIÓN</h3></div></div>
 <div class="gg-display-control"><span>Modo de pantalla</span><select id="ggDisplayMode" aria-label="Modo de pantalla"><option value="fullscreen">Pantalla completa</option><option value="window">Modo ventana</option><option value="borderless">Ventana sin bordes</option></select></div>
 <div class="gg-display-control"><span>Resolución de ventana</span><select id="ggDisplayResolution" aria-label="Resolución de ventana"><option value="1280x720">1280 × 720 (HD)</option><option value="1600x900">1600 × 900</option><option value="1920x1080">1920 × 1080 (Full HD)</option><option value="2560x1440">2560 × 1440 (2K)</option><option value="3840x2160">3840 × 2160 (4K)</option></select></div>
 <label class="gg-display-control" for="ggDisplayScale"><span>Tamaño de interfaz</span><span class="gg-display-slider"><input id="ggDisplayScale" type="range" min="75" max="150" step="5" aria-label="Tamaño de interfaz"><output id="ggDisplayScaleValue" for="ggDisplayScale">100 %</output></span></label>
 <div class="gg-display-actions"><button class="btn small" type="button" id="ggDisplayApply">APLICAR PANTALLA</button><button class="btn small" type="button" id="ggDisplayDefaults">RESTABLECER</button></div>
 <p class="gg-display-status" id="ggDisplayStatus" role="status" aria-live="polite"></p>
 <p class="gg-display-foot">Alt + Enter alterna entre ventana y pantalla completa. La resolución seleccionada se usa en modo ventana; pantalla completa utiliza la resolución nativa del monitor. Los cambios se recuerdan al reiniciar.</p>`;
 const previous=root.querySelector('.gg39-prefs-card');
 if(previous)previous.before(card);else root.append(card);
 const el=id=>document.getElementById(id);
 const mode=el('ggDisplayMode'),res=el('ggDisplayResolution'),scale=el('ggDisplayScale');
 const status=msg=>{el('ggDisplayStatus').textContent=msg};
 function sync(){
  mode.value=cfg.mode;res.value=cfg.resolution;scale.value=cfg.scale;
  el('ggDisplayScaleValue').textContent=cfg.scale+' %';
  res.title='Tamaño preferido en modo ventana. Pantalla completa sigue la resolución física del monitor.';
 }
 function save(){try{localStorage.setItem(STORAGE,JSON.stringify(cfg))}catch{}}
 function scaleBrowser(){
  // Escala contenidos de la interfaz, sin hacer zoom global ni recortar el lienzo de juego.
  document.documentElement.style.setProperty('--gg-menu-scale', String(cfg.scale/100));
  window.dispatchEvent(new Event('resize'));
 }
 async function fullscreenBrowser(on){
  if(on && !document.fullscreenElement){
   if(!document.documentElement.requestFullscreen)throw Error('El navegador no permite pantalla completa.');
   await document.documentElement.requestFullscreen();
  }else if(!on&&document.fullscreenElement){await document.exitFullscreen()}
 }
 async function apply(){
  if(updating)return;
  updating=true;
  try{
   cfg=clean({mode:mode.value,resolution:res.value,scale:scale.value});
   sync();save();
   if(desktop){
    const state=await desktop.apply(cfg);
    if(state)cfg=clean(state);
    sync();
    status(cfg.mode==='fullscreen'?'Pantalla completa aplicada. Se usa la resolución del monitor.':
     cfg.mode==='borderless'?'Ventana sin bordes aplicada: ocupa el área útil del monitor.':
     'Ventana ajustada a '+cfg.resolution+' (limitada por el tamaño del monitor si es necesario).');
   }else{
    scaleBrowser();
    if(cfg.mode==='fullscreen'){
     await fullscreenBrowser(true);
     status('Pantalla completa activada en el navegador. La resolución física no se puede cambiar desde HTML.');
    }else if(cfg.mode==='borderless'){
     await fullscreenBrowser(false);
     status('En el navegador no se pueden quitar los bordes de la ventana. Este modo funcionará en la aplicación .exe.');
    }else{
     await fullscreenBrowser(false);
     status('Modo ventana seleccionado. El navegador controla el tamaño exterior; ajusta sus bordes manualmente.');
    }
   }
  }catch(err){status('No se pudo aplicar el modo de pantalla: '+(err?.message||'operación no permitida'))}
  finally{updating=false}
 }
 mode.addEventListener('change',apply);
 res.addEventListener('change',apply);
 scale.addEventListener('input',()=>{el('ggDisplayScaleValue').textContent=scale.value+' %'});
 scale.addEventListener('change',apply);
 el('ggDisplayApply').addEventListener('click',apply);
 el('ggDisplayDefaults').addEventListener('click',()=>{cfg={...DEFAULT};sync();apply()});
 // El botón antiguo de pantalla completa pasa por el mismo controlador de preferencias.
 const oldButton=el('fullscreenBtn');
 if(oldButton)oldButton.onclick=()=>{mode.value=cfg.mode==='fullscreen'?'window':'fullscreen';apply()};
 const quick=el('quickFull');
 if(quick)quick.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();mode.value=cfg.mode==='fullscreen'?'window':'fullscreen';apply()},true);
 if(desktop){
  desktop.get().then(v=>{if(v){cfg=clean(v);sync();save();}status('Configuración vinculada a la ventana de Windows.')}).catch(()=>{});
  desktop.onChange(v=>{if(v){cfg=clean(v);sync();save();}});
 }else{
  scaleBrowser();
  status('Ajusta el modo de pantalla. En Windows .exe la resolución y los bordes controlarán la ventana real.');
 }
 // Si el usuario sale de fullscreen con Escape o F11, reflejarlo sin forzar la pantalla.
 window.addEventListener('keydown',e=>{
  if(desktop || !e.altKey || e.code!=='Enter' || e.repeat)return;
  e.preventDefault();
  mode.value=cfg.mode==='fullscreen'?'window':'fullscreen';
  apply();
 });
 document.addEventListener('fullscreenchange',()=>{
  if(desktop||updating)return;
  if(!document.fullscreenElement&&cfg.mode==='fullscreen'){
   cfg.mode='window';sync();save();status('Has vuelto a modo ventana.');
  }
 });
 window.GG_DISPLAY_TEST={get:()=>({...cfg}),apply:(v)=>{cfg=clean(v);sync();return apply()},elements:()=>!!card.isConnected};
})();
