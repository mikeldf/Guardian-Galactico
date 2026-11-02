// API mínima y aislada: solo permite consultar o cambiar pantalla.
const {contextBridge,ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('GG_DESKTOP_DISPLAY',Object.freeze({
 get:()=>ipcRenderer.invoke('gg:display:get'),
 apply:(settings)=>ipcRenderer.invoke('gg:display:apply',settings),
 onChange:(cb)=>{
  if(typeof cb!=='function')return;
  ipcRenderer.on('gg:display:state',(_event,state)=>cb(state));
 }
}));
