'use strict';
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const text=fs.readFileSync(require('node:path').join(__dirname,'../src/scripts/02_engine.js'),'utf8');
const block=text.split('/* FASE 55.1 — EVENTOS DE SECTOR.')[1].split('/* FASE 38 · Escuadrones dinámicos')[0];
assert(block);
let history=[];
const context={
  run:null,foes:[],drops:[],W:600,H:820,GG40_MAX_POWER:50,
  PHASE9_RULES:{maxVisibleDrops:14},
  FORMATIONS:Array.from({length:36},(_,i)=>({nombre:'Formación '+i})),
  clamp:(n,min,max)=>Math.min(max,Math.max(min,n)),
  gg42MissionBonus:(r,n,message)=>{r.earned+=n;r.gg42Bonus+=n;history.push(message)},
  announce:msg=>{history.push(msg)}
};
vm.createContext(context);
vm.runInContext('/* FASE 55.1 — EVENTOS DE SECTOR.'+block,context);
const catalog=vm.runInContext('GG56_EVENTS.map(e=>e.id)',context);
assert.equal(catalog.length,7);
const seen=new Set();let checks=0;
function makeRun(level, k=1, count=3){let r={level,world:Math.floor((level-1)/20),local:(level-1)%20+1,waveCount:count,wave:k+1,elapsed:12,weapon:8,shield:0,energy:32,px:290,earned:0,gg42Bonus:0,gg56EventsSeen:0,gg56ChallengesWon:0,formationState:{id:2,name:'Prueba',wave:k,gg56Shifted:false,nextDiveAt:40}};context.run=r;context.drops=[];context.foes=Array.from({length:12},(_,i)=>({group:k,hp:60,maxHp:60,type:i%7,x:50+i*38,y:200,entryDuration:2.0,pattern:2,phase:'hold',age:3}));return r;}
for(let level=1;level<=200;level++){
  const r=makeRun(level);
  vm.runInContext('gg56SectorEvent(run,foes,1)',context);
  if(r.local<4)assert.equal(r.gg56EventsSeen,0);
  else {assert.equal(r.gg56EventsSeen,1);seen.add(r.gg56Event);assert(r.gg56EventUntil>r.elapsed)}
  checks++;
}
assert.deepEqual([...seen].sort(), [...catalog].sort());
const selected={};
for(let level=4;level<=200;level++){
  const r=makeRun(level);
  vm.runInContext('gg56SectorEvent(run,foes,1)',context);
  if(!selected[r.gg56Event])selected[r.gg56Event]=level;
}
for(const id of catalog){
  const r=makeRun(selected[id]);
  vm.runInContext('gg56SectorEvent(run,foes,1)',context);
  assert.equal(r.gg56Event,id);
  if(id==='supply')assert.equal(context.drops.length,1);
  if(id==='ace')assert(context.foes.some(e=>e.gg42Captain||e.gg56Ace));
  if(id==='courier')assert(context.foes.some(e=>e.gg42Cargo||e.gg56Cargo));
  if(id==='intercept')assert(context.foes.some(e=>e.gg42Runner||e.gg56Runner));
  if(id==='recharge'){assert.equal(r.energy,72);assert.equal(r.shield,1);}
  if(id==='shift'){
    r.elapsed=16.5;
    vm.runInContext('gg56Tick()',context);
    assert.equal(r.formationState.gg56Shifted,true);
    assert(context.foes.some(e=>e.disrupted));
  }
  if(id==='combo'){
    for(let i=0;i<4;i++)vm.runInContext('gg56OnKill(foes['+i+'])',context);
    assert.equal(r.gg56ChallengesWon,1);assert.equal(r.earned,55);
    vm.runInContext('gg56OnKill(foes[5])',context);
    assert.equal(r.earned,55);
  }
  checks++;
}
for(let local=12;local<=20;local++){
  let r=makeRun(local,2,3);
  vm.runInContext('gg56SectorEvent(run,foes,2)',context);
  assert.equal(r.gg56EventsSeen,1);
  checks++;
}
// No new events on introductory levels; not blocking wave completion.
for(let local=1;local<=3;local++){
 let r=makeRun(local,1,3);vm.runInContext('gg56SectorEvent(run,foes,1)',context);
 assert.equal(r.gg56EventsSeen,0);checks++;
}
console.log(JSON.stringify({checks,eventFamilies:[...seen].sort(),sampleLevels:selected,announcements:history.length},null,2));
