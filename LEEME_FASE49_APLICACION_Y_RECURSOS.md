# Guardián Galáctico — Fase 49: recursos y base de aplicación

## Qué se ha restaurado
- Partiendo de Fase 48, se conservan todos los recursos y archivos existentes; no se borra ninguna nave.
- Se restituye un fondo de hangar ilustrado y se recupera la ambientación del mapa y los niveles, sin reemplazar sus botones interactivos por imágenes fijas.
- Se incorporan comprobaciones explícitas de los 60 modelos. Si alguno no carga, se muestra un aviso con su ruta.
- Se conserva el icono como pendiente, sin incluir el archivo .ico en esta versión.

## Para jugar ahora en Windows
1. Extrae completamente el ZIP en una **carpeta nueva**.
2. Deben estar en la misma carpeta `index.html`, `assets/` y `app/`.
3. Abre `index.html` con Edge o Chrome. No copies solo el HTML ni lo abras dentro de la ventana del ZIP.
4. En Hangar, al pie de la lista, verás el contador de modelos cargados (por ejemplo `Modelos: 60/60`).
5. Si el contador muestra errores, el ZIP se ha extraído incompleto o no se está usando la carpeta correcta.

## Para convertirlo en una aplicación de Windows (.exe)
El juego ya está escrito en código HTML, CSS y JavaScript. Se incluye un contenedor Electron en `app/main.cjs` y la configuración `package.json` que permite construir una aplicación portable de Windows.
El empaquetado lo realiza un desarrollador/equipo de compilación, no el jugador. En un equipo de desarrollo con Node.js y npm disponibles:
```
npm install
npm run dist:win
```
Esto es **código fuente preparado para la compilación**, no un `.exe` ya compilado ni probado. No requiere Python, no instala un proceso que se inicie con Windows y, cuando se compile, sus recursos se empaquetarán con el ejecutable.

## Estado de pruebas
- Verificación de rutas, interfaz y sprites en navegador automatizado.
- La prueba de la aplicación Electron compilada en Windows sigue pendiente.
- No se han realizado pruebas exhaustivas de las 200 misiones en un ordenador Windows real.
