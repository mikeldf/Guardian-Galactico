// Guardián Galáctico · ventana nativa de Windows y configuración de pantalla.
// No modifica el motor HTML5 ni requiere servicios externos.
const { app, BrowserWindow, ipcMain, shell, screen, Menu } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const RESOLUTIONS = Object.freeze({
 '1280x720':[1280,720], '1600x900':[1600,900], '1920x1080':[1920,1080],
 '2560x1440':[2560,1440], '3840x2160':[3840,2160]
});
const DEFAULT = Object.freeze({ mode:'fullscreen', resolution:'1920x1080', scale:100 });
let win = null;
let display = {...DEFAULT};
let rebuilding = false;
const settingsFile = () => path.join(app.getPath('userData'), 'display-settings.json');
function clean(value) {
 const v = value && typeof value === 'object' ? value : {};
 const mode = ['fullscreen','window','borderless'].includes(v.mode) ? v.mode : DEFAULT.mode;
 const resolution = Object.hasOwn(RESOLUTIONS,v.resolution) ? v.resolution : DEFAULT.resolution;
 const valueScale = Number(v.scale);
 const scale = Number.isFinite(valueScale) ? Math.round(Math.min(150,Math.max(75,valueScale))/5)*5 : DEFAULT.scale;
 return {mode,resolution,scale};
}
function loadSettings() {
 try { return clean(JSON.parse(fs.readFileSync(settingsFile(),'utf8'))); }
 catch { return {...DEFAULT}; }
}
function persistSettings() {
 try { fs.mkdirSync(path.dirname(settingsFile()),{recursive:true});fs.writeFileSync(settingsFile(),JSON.stringify(display,null,2),'utf8'); }
 catch(err) { console.warn('No se pudo guardar la pantalla:',err.message); }
}
function dimensions() {
 const [w,h] = RESOLUTIONS[display.resolution];
 const area=screen.getPrimaryDisplay().workAreaSize;
 return {width:Math.max(560,Math.min(w,area.width)),height:Math.max(380,Math.min(h,area.height))};
}
function notify() {
 if(win&&!win.isDestroyed()&&!win.webContents.isDestroyed()) win.webContents.send('gg:display:state',display);
}
function createWindow(openSettings=false) {
 const old=win;
 const dims=dimensions();
 const next = new BrowserWindow({
  ...dims, minWidth:560,minHeight:380, frame:display.mode!=='borderless',
  fullscreen:display.mode==='fullscreen',
  backgroundColor:'#020916',autoHideMenuBar:true,show:false,
  webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}
 });
 win=next;
 Menu.setApplicationMenu(null);
 if(display.mode==='borderless') {
   next.setBounds(screen.getDisplayMatching(next.getBounds()).workArea);
   next.setResizable(false);
 } else if(display.mode==='window') {
   next.center();
 }
 next.loadFile(path.join(__dirname,'..','index.html'));
 next.webContents.setZoomFactor(display.scale/100);
 next.once('ready-to-show',()=>{
   if(next.isDestroyed())return;
   next.show();
   if(openSettings)next.webContents.executeJavaScript("window.UI?.screen('settings')").catch(()=>{});
   if(old && !old.isDestroyed())old.destroy();
   rebuilding=false;
   notify();
 });
 next.webContents.on('did-finish-load',()=>{
   next.webContents.setZoomFactor(display.scale/100);
   notify();
 });
 next.webContents.on('before-input-event',(event,input)=>{
   if(input.type==='keyDown' && input.alt && input.key==='Enter' && !input.isAutoRepeat) {
    event.preventDefault();
    applySettings({...display,mode:display.mode==='fullscreen'?'window':'fullscreen'});
   }
 });
 next.webContents.setWindowOpenHandler(({url})=>{
  if(/^https:\/\//.test(url))shell.openExternal(url);
  return {action:'deny'};
 });
 next.webContents.on('will-navigate',(event,url)=>{
  if(!url.startsWith('file:'))event.preventDefault();
 });
 next.on('resize',notify);
 next.on('enter-full-screen',notify);
 next.on('leave-full-screen',notify);
 return next;
}
function applySettings(value) {
 const next=clean(value);
 const oldMode=display.mode;
 display=next;
 persistSettings();
 if(!win || win.isDestroyed())return display;
 if(rebuilding)return display;
 if((oldMode==='borderless') !== (next.mode==='borderless')) {
  rebuilding=true;
  createWindow(true); // El modo sin bordes requiere otra ventana nativa (sin barra de título).
  return display;
 }
 if(next.mode==='fullscreen') {
  win.setFullScreen(true);
 } else {
  win.setFullScreen(false);
  if(next.mode==='borderless') {
   win.setBounds(screen.getDisplayMatching(win.getBounds()).workArea);
  } else {
   const dims=dimensions();
   win.setResizable(true);
   win.setSize(dims.width,dims.height);
   win.center();
  }
 }
 win.webContents.setZoomFactor(next.scale/100);
 win.webContents.executeJavaScript("window.dispatchEvent(new Event('resize'))").catch(()=>{});
 notify();
 return display;
}
app.whenReady().then(()=>{
 display=loadSettings();
 ipcMain.handle('gg:display:get',(event)=>event.sender===win?.webContents?display:null);
 ipcMain.handle('gg:display:apply',(event,next)=>{
  if(event.sender!==win?.webContents)throw new Error('Ventana no autorizada');
  return applySettings(next);
 });
 createWindow();
 app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin'&&!rebuilding)app.quit()});
