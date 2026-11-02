window.GG_SPRITE_DIAGNOSTICS={
 verify:async()=>{const manifest=Array.from({length:10},(_,w)=>Array.from({length:5},(_,i)=>'assets/gg58_new/enemies/mundo_'+String(w+1).padStart(2,'0')+'/'+String(i+1).padStart(2,'0')+'.png')).flat();
  const results=await Promise.all(manifest.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src,ok:img.naturalWidth>0});img.onerror=()=>resolve({src,ok:false});img.src=src;})));
  return {normalEnemies:50,oldEnemies:0,loaded:results.filter(v=>v.ok).length,results};
 },
 worldPaths:Array.from({length:10},(_,w)=>({world:w+1,enemies:Array.from({length:5},(_,i)=>'assets/gg58_new/enemies/mundo_'+String(w+1).padStart(2,'0')+'/'+String(i+1).padStart(2,'0')+'.png')}))
};
