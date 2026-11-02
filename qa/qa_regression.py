from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import json
ROOT=Path(__file__).resolve().parent.parent
def make_html(filename):
 soup=BeautifulSoup((ROOT/filename).read_text(encoding='utf8'),'html.parser')
 soup.head.insert(0,soup.new_tag('base',href='https://gg55.invalid/'))
 for node in soup.find_all('link',href=True):
  f=ROOT/node['href']
  if f.is_file() and node.get('rel')==['stylesheet']:
   style=soup.new_tag('style');style.string=f.read_text(encoding='utf8');node.replace_with(style)
 for node in soup.find_all('script',src=True):
  f=ROOT/node['src']
  if f.is_file():
   script=soup.new_tag('script');script.string=f.read_text(encoding='utf8');node.replace_with(script)
 return str(soup)
results=[]
def chk(entry,key,val,expected):
 passed=(val==expected);print('PASS' if passed else 'FAIL',entry,key,repr(val)[:350]);results.append({'entry':entry,'test':key,'pass':passed,'result':val,'expected':expected})
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for entry in ['index.html','index_modular.html']:
  pg=browser.new_page(viewport={'width':1440,'height':900})
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(make_html(entry),wait_until='domcontentloaded',timeout=25000)
  pg.evaluate("window.GG_EXACT_BRIDGE.screen('hangar')")
  reuse=pg.evaluate('''()=>{let box=document.querySelector('#hangarGrid'),child=box.firstElementChild;document.querySelectorAll('#hangarGrid [data-ship]')[1].click();let still=child===box.firstElementChild;return {reused:still,count:box.children.length,detail:document.querySelector('#detailName').textContent,lazy:box.querySelectorAll('img[loading="lazy"]').length}}''')
  chk(entry,'hangar DOM stable',reuse['reused'],True)
  chk(entry,'hangar 60 lazy cards',reuse['lazy'],60)
  chk(entry,'hangar 60 preserved',reuse['count'],60)
  chk(entry,'hangar new selection',reuse['detail'],'Rayo V')
  pg.evaluate("document.querySelector('#gg44SortShips').value='name'; document.querySelector('#gg44SortShips').dispatchEvent(new Event('change',{bubbles:true}))")
  chk(entry,'hangar sorting remains functional',pg.evaluate('document.querySelectorAll("#hangarGrid .shipCard").length'),60)
  pg.evaluate("window.GG_EXACT_BRIDGE.screen('hangar');window.GG_EXACT_BRIDGE.detail(6)")
  chk(entry,'locked ship cannot equip',pg.evaluate('document.querySelector("#selectShip").disabled'),True)
  pg.evaluate('''()=>{let s=window.GG_BRIDGE.getSave();s.worldWeaponLevels=[1,1,1,1,1,1,1,1,1,50];window.GG_BRIDGE.setSave(s)}''')
  # Fase 55 test weapon restart between worlds
  pg.evaluate('window.GG_TEST.testStart(181)')
  chk(entry,'weapon 50 retained in world ten',pg.evaluate('window.GG40_TEST.weapon().current'),50)
  pg.evaluate('window.GG_TEST.testStart(1)')
  chk(entry,'weapon resets when switching worlds',pg.evaluate('window.GG40_TEST.weapon().current'),1)
  # validate export after max weapon
  chk(entry,'max weapon exported in backup',pg.evaluate('window.GG_QUALITY_TEST.roundtrip().worldWeaponLevels[9]'),50)
  pg.keyboard.press('Escape')
  chk(entry,'escape opens pause',pg.evaluate('window.GG40_TEST.pause().overlay'),True)
  chk(entry,'pause menu with options',pg.evaluate('document.querySelector("#modalButtons")?.children.length>=3'),True)
  pg.evaluate("document.querySelector('#modalButtons button').click()")
  chk(entry,'resume button returns to gameplay',pg.evaluate('window.GG40_TEST.pause().paused'),False)
  chk(entry,'no Javascript exceptions',errors,[])
  pg.close()
 browser.close()
(ROOT/'docs'/'FASE55_PRUEBAS_REGRESION.json').write_text(json.dumps({'count':len(results),'passed':sum(r['pass'] for r in results),'tests':results},ensure_ascii=False,indent=2))
print('RESULT',sum(r['pass'] for r in results),'/',len(results))
