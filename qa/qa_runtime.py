from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from datetime import datetime
import json, time
ROOT=Path(__file__).resolve().parent.parent; REPORT=[]

def html_inline(name):
 soup=BeautifulSoup((ROOT/name).read_text(encoding='utf-8'),'html.parser')
 base=soup.new_tag('base',href='https://gg55.invalid/')
 soup.head.insert(0,base)
 for link in list(soup.find_all('link',href=True)):
  f=ROOT/link['href'];
  if f.is_file() and link.get('rel')==['stylesheet']:
   x=soup.new_tag('style');x.string=f.read_text(encoding='utf-8');link.replace_with(x)
 for script in list(soup.find_all('script',src=True)):
  f=ROOT/script['src'];
  if f.is_file():
   x=soup.new_tag('script');x.string=f.read_text(encoding='utf-8');script.replace_with(x)
 return str(soup)

def test(name,call,check=lambda v:True):
 try:
  value=call(); ok=bool(check(value));REPORT.append({'test':name,'passed':ok,'observed':value if isinstance(value,(str,int,float,bool,dict,list,type(None))) else str(value)});
  print('PASS' if ok else 'FAIL',name,str(value)[:220],flush=True)
 except Exception as e:
  print('ERROR',name,str(e)[:250],flush=True);REPORT.append({'test':name,'passed':False,'error':str(e)[:800]})

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for entry in ('index.html','index_modular.html'):
  print('ENTRY',entry,flush=True)
  page=browser.new_page(viewport={'width':1440,'height':900});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html_inline(entry),wait_until='domcontentloaded',timeout=25000)
  page.wait_for_timeout(600)
  test(entry+' boot home',lambda:page.evaluate('window.GG_TEST.getState().screen'),lambda v:v=='home')
  test(entry+' campaign all 200',lambda:page.evaluate('window.GG40_TEST.campaign()'),lambda v:v['total']==200 and v['worlds']==[20]*10 and v['bosses']==list(range(10,201,10)))
  test(entry+' ship count',lambda:page.evaluate('window.GG_TEST.getState().shipTypes'),lambda v:v==60)
  test(entry+' 9 mission types',lambda:page.evaluate('window.GG42_TEST.campaign().types'),lambda v:len(v)==9 and sum(x['count'] for x in v)==200)
  test(entry+' hangar navigation',lambda:(page.evaluate("document.querySelector('[data-act=\"nav:2\"]').click()"),page.evaluate('window.GG_TEST.getState().screen'))[1],lambda v:v=='hangar')
  test(entry+' 60 hangar cards',lambda:page.locator('#hangarGrid .shipCard').count(),lambda v:v==60)
  test(entry+' visible only hangar',lambda:page.evaluate('({active:[...document.querySelectorAll(".screen:not(.hidden)")].map(e=>e.id),classic:document.getElementById("gg50Classic")?.classList.contains("active")})'),lambda v:v['active']==['hangar'] and not v['classic'])
  test(entry+' change hangar selection',lambda:(page.evaluate('document.querySelectorAll("#hangarGrid .shipCard")[1].click()'),page.evaluate('document.querySelector("#detailName")?.textContent'))[1],lambda v:len(v)>0)
  test(entry+' hangar back',lambda:(page.evaluate('document.querySelector("#hangarBack").click()'),page.evaluate('window.GG_TEST.getState().screen'))[1],lambda v:v in ('home','galaxy'))
  test(entry+' settings open',lambda:(page.evaluate("document.querySelector('[data-act=\"nav:3\"]').click()"),page.evaluate('window.GG_TEST.getState().screen'))[1],lambda v:v=='settings')
  test(entry+' save backup roundtrip',lambda:page.evaluate('window.GG_QUALITY_TEST.roundtrip()'),lambda v:v['lastUnlocked']>=1 and v['lastUnlocked']<=201 and len(v['worldWeaponLevels'])==10)
  test(entry+' galaxy nav',lambda:(page.evaluate("document.querySelector('[data-act=\"nav:1\"]').click()"),page.evaluate('({screen:window.GG_TEST.getState().screen,overlay:window.GG50_VISUAL?.diagnostics().active})'))[1],lambda v:v['screen']=='galaxy' and v['overlay']=='galaxy')
  test(entry+' galaxy pins clickable',lambda:page.locator('#gg50Classic .gg50-map-planet').count(),lambda v:v==10)
  test(entry+' click first planet',lambda:(page.evaluate('document.querySelectorAll("#gg50Classic .gg50-map-planet")[0].click()'),page.wait_for_function("window.GG_TEST.getState().screen === 'levels'", timeout=7000),page.evaluate('({screen:window.GG_TEST.getState().screen,overlay:window.GG50_VISUAL?.diagnostics().active})'))[2],lambda v:v['screen']=='levels' and v['overlay']=='levels')
  test(entry+' 20 selector cards',lambda:page.locator('#gg50Classic .gg50-level-card').count(),lambda v:v==20)
  test(entry+' start level 1 from UI',lambda:(page.evaluate('document.querySelector("#gg50Classic .gg50-launch").click()'),page.evaluate('window.GG_TEST.getState().screen'))[1],lambda v:v=='play')
  test(entry+' pause Escape',lambda:(page.keyboard.press('Escape'),page.evaluate('window.GG40_TEST.pause()'))[1],lambda v:v['paused'] and v['overlay'])
  test(entry+' 50 weapon evolutions',lambda:page.evaluate('''(()=>{let names=[];for(let n=1;n<=50;n++){const inf=window.GG40_TEST.setWeapon(n);if(!inf)return {error:n};if(n%5===1)names.push(inf.family||inf.name||inf.nombre||inf.weapon||JSON.stringify(inf).slice(0,70));}return {families:names,length:names.length};})()'''),lambda v:v.get('length')==10 and len(set(v['families']))>=8)
  test(entry+' all 200 mission starts',lambda:page.evaluate('''(()=>{let failures=[];for(let n=1;n<=200;n++){try{window.GG_TEST.testStart(n);const s=window.GG_TEST.getState();if(s.stage!==((n-1)%20+1)||s.screen!=='play')failures.push([n,s.stage,s.screen]);}catch(e){failures.push([n,String(e)]);}}return {count:200,failures:failures.slice(0,20),failedTotal:failures.length,final:window.GG_TEST.getState().stage};})()'''),lambda v:v['failedTotal']==0 and v['final']==20)
  test(entry+' spawn 20 bosses',lambda:page.evaluate('''(()=>{const faults=[];for(let n=10;n<=200;n+=10){try{window.GG_TEST.testStart(n);const ok=window.GG_TEST.testSpawnBoss(),s=window.GG_TEST.getState();if(!ok||!s.bossHp||s.bossHp<=0)faults.push({n,ok,hp:s.bossHp});}catch(e){faults.push({n,error:String(e)})}}return {n:20,faults};})()'''),lambda v:len(v['faults'])==0)
  test(entry+' js runtime errors',lambda:errors,lambda v:len(v)==0)
  page.close()
 browser.close()

out={'timestamp':datetime.now().isoformat(),'tests':REPORT,'total':len(REPORT),'passed':sum(x['passed'] for x in REPORT)}
(ROOT/'docs').mkdir(exist_ok=True)
(ROOT/'docs'/'FASE55_PRUEBAS_RUNTIME.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print('RESULT',out['passed'],'/',out['total'])
