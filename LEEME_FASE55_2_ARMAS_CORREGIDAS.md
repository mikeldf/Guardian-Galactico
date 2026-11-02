# Guardián Galáctico — Fase 55.2 · Armamento del jugador corregido

Se ha aplicado la corrección a **index.html** y **src/scripts/02_engine.js** para mantener idéntico el comportamiento de la versión modular.

- Se extrajeron 50 sprites de proyectil individual desde los 50 gráficos aprobados. No se sustituyeron los originales (continúan en assets/gg41_approved/shots).
- Las 10 familias conservan cinco evoluciones, pero la cantidad de disparos se determina por lógica y está limitada por evolución.
- Se corrigieron los disparos suplementarios añadidos por poderes temporales: aumentan su efecto sin duplicar formaciones.
- Se corrigió la cadencia para evitar saturación cuando el arma alcanza niveles avanzados.
- Los drones pueden acompañar a la nave en lugar de aparecer como una flota dentro de cada bala roja.
- Se conservaron los 200 niveles, las 60 naves, las músicas, los demás recursos y las secundarias.

Para revisar todos los sprites sin arrancar una partida, abre **COMPROBAR_ARMAS_FASE55_2.html** desde la carpeta extraída.

Pruebas: 621 verificaciones de patrones y parámetros de disparo sobre las dos entradas de código; 50 PNG individuales transparentes comprobados. Esto no equivale a jugar toda la campaña ni a certificar el rendimiento real en Windows.
