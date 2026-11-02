# Pruebas automatizadas de Guardián Galáctico

La carpeta `qa/` contiene tres programas de pruebas para desarrolladores. No se necesitan para jugar.

- `qa_runtime.py`: prueba arranque, menús, campaña, armas, jefes y pausa de las dos entradas HTML.
- `qa_regression.py`: comprueba ahorro de reconstrucciones del hangar, sorteo, bloqueo, persistencia de mejoras y reanudación.
- `audit_assets.py`: valida las imágenes con Pillow, la música con `ffprobe` y las rutas de CSS estático.

Necesitan Python, `beautifulsoup4`, `playwright`, `Pillow` y Chromium; el último necesita estar instalado para el navegador de pruebas. En Windows, la forma recomendada de diagnóstico sin dependencias es `COMPROBAR_FASE55.html`.

Los resultados de esta entrega se encuentran en `docs/FASE55_*`.
