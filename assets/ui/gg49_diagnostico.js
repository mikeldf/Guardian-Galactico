/* FASE 49 — Diagnóstico de modelos reales y recursos del paquete. Sin eliminar archivos. */
(()=>{'use strict';
const BRIDGE=window.GG_EXACT_BRIDGE;
if(!BRIDGE) return;
const audit={tested:0,loaded:0,missing:[],finished:false,origin:location.protocol};
const hint=document.getElementById('gg43AssetWarning');
const modelPaths=BRIDGE.snapshot()?.ART?.naves||[];
window.GG49_ASSETS={status:()=>({...audit,missing:audit.missing.slice()}),test:checkModels};
function loadOne(src){return new Promise(resolve=>{const image=new Image();image.onload=()=>resolve({src,ok:image.naturalWidth>0,w:image.naturalWidth,h:image.naturalHeight});image.onerror=()=>resolve({src,ok:false});image.src=src;});}
async function checkModels(){audit.tested=0;audit.loaded=0;audit.missing=[];audit.finished=false;
 const result=await Promise.all(modelPaths.map(loadOne));
 for(const item of result){audit.tested++;if(item.ok)audit.loaded++;else audit.missing.push(item.src);}
 audit.finished=true;
 if(hint){if(audit.missing.length){hint.hidden=false;hint.textContent=`Faltan ${audit.missing.length} de ${audit.tested} modelos. Extrae el ZIP completo a una carpeta nueva: index.html y assets deben estar juntos. Primer archivo ausente: ${audit.missing[0]}`;}else{hint.hidden=true;}}
 const count=document.getElementById('gg49AssetCount');if(count)count.textContent=`Modelos: ${audit.loaded}/${audit.tested}`;
 return window.GG49_ASSETS.status();}
function makeStatus(){const tag=document.createElement('span');tag.id='gg49AssetCount';tag.textContent='Comprobando modelos…';tag.style.cssText='font-size:10px;color:#9be6ff;letter-spacing:.07em;white-space:nowrap';const footer=document.querySelector('#hangar .gg44-list-footer');if(footer){footer.append(' · ');footer.append(tag);}}
makeStatus();checkModels().catch(e=>{audit.missing.push('Error comprobación: '+String(e));if(hint){hint.hidden=false;hint.textContent='Error al verificar recursos. Comprueba la carpeta assets y vuelve a extraer el ZIP.';}});
})();
