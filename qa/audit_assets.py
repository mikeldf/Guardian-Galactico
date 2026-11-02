from pathlib import Path
from PIL import Image
from collections import Counter
from bs4 import BeautifulSoup
import json,subprocess,re
ROOT=Path(__file__).resolve().parent.parent
assets=ROOT/'assets'
images=list(assets.rglob('*.png'))+list(assets.rglob('*.webp'))+list(assets.rglob('*.jpg'))+list(assets.rglob('*.jpeg'))
bad=[]; zero=[];dims=Counter();formats=Counter(); sizes=[]
for f in images:
 try:
  with Image.open(f) as im:
   im.verify()
  with Image.open(f) as im:
   if im.width<=0 or im.height<=0: zero.append(str(f.relative_to(ROOT)))
   dims[str(im.size)]+=1;formats[im.format]+=1
  sizes.append((f.stat().st_size,str(f.relative_to(ROOT))))
 except Exception as e:bad.append({'path':str(f.relative_to(ROOT)),'error':str(e)})
tracks=[]
for f in sorted((assets/'music').glob('*.mp3')):
 out=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,size','-of','json',str(f)],capture_output=True,text=True)
 if out.returncode:
  tracks.append({'name':f.name,'valid':False,'error':out.stderr[-180:]})
 else:
  d=json.loads(out.stdout)['format'];tracks.append({'name':f.name,'valid':True,'duration_s':round(float(d['duration']),2),'size':int(d['size'])})
resource_count=sum(1 for f in assets.rglob('*') if f.is_file())
ship_ids=[]
for i in range(31,61):
 f=assets/'ships_new'/f'nave_{i}.optim.webp'
 ship_ids.append({'ship':i,'source_exists':f.exists()})
# Cross-check only static CSS url() declarations (not JS templates in the HTML).
missing=[]
css_sources=[]
for file in (ROOT/'src'/'styles').glob('*.css'):
 css_sources.append((file,file.read_text(encoding='utf8',errors='replace')))
for file in (ROOT/'assets'/'ui').rglob('*.css'):
 css_sources.append((file,file.read_text(encoding='utf8',errors='replace')))
for entry in ('index.html','index_modular.html'):
 file=ROOT/entry
 for tag in BeautifulSoup(file.read_text(encoding='utf8',errors='replace'),'html.parser').find_all('style'):
  css_sources.append((file,tag.get_text()))
for file,css in css_sources:
 for url in re.findall(r'url\(\s*[\'\"]?([^\)\'\"\s]+)',css,flags=re.I):
  if url.startswith(('data:','http:','https:','#','var(')):continue
  candidate=(file.parent/url).resolve()
  if not candidate.is_file():missing.append({'file':str(file.relative_to(ROOT)),'url':url})
result={'resources_total':resource_count,'image_count':len(images),'image_failures':bad,'image_zero_dimensions':zero,'image_formats':dict(formats),'largest_images':sorted(sizes,reverse=True)[:12],'mp3_count':len(tracks),'mp3_invalid':[x for x in tracks if not x['valid']],'mp3_duration_range':[min(x['duration_s'] for x in tracks if x['valid']),max(x['duration_s'] for x in tracks if x['valid'])],'ship_new_sources_missing':[x for x in ship_ids if not x['source_exists']],'missing_css_urls':missing[:50],'missing_css_url_count':len(missing)}
(ROOT/'docs'/'FASE55_RECURSOS.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False,indent=2)[:3400])
