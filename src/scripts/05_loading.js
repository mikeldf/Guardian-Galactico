(function(){
const overlay=document.getElementById('gg40Boot'),bar=document.getElementById('gg40LoadFill'),pct=document.getElementById('gg40LoadPct'),text=document.getElementById('gg40LoadText');
if(!overlay)return;
const files=['assets/ui/gg40_loading_bg.webp','assets/planetas/mundo_01_azul.webp','assets/embedded/36019be08849ec.webp','assets/ui/combate_mundo_01.webp'];
let count=0;const started=performance.now();
const progress=()=>{const n=Math.min(100,Math.round(count/files.length*100));bar.style.width=n+'%';pct.textContent=n+'%';text.textContent=n<40?'Preparando hangares…':n<70?'Cargando mundos y naves…':n<100?'Sincronizando sistemas…':'Sistemas listos · entrando al menú…';};
Promise.all(files.map(src=>new Promise(res=>{const i=new Image();i.onload=i.onerror=()=>{count++;progress();res()};i.src=src;if(i.complete&&i.naturalWidth){count++;progress();res()}}))).then(()=>{const show=()=>{overlay.dataset.state='ready';overlay.classList.add('done');setTimeout(()=>overlay.remove(),850)};const elapsed=performance.now()-started;if(elapsed>=950)show();else setTimeout(show,950-elapsed)});
setTimeout(()=>{if(!overlay.classList.contains('done')){count=files.length;progress();overlay.dataset.state='fallback';overlay.classList.add('done');setTimeout(()=>overlay.remove(),850)}},8500);
})();