# Guardián Galáctico — Fase 55.8: balas enemigas visibles

## Problema identificado
Los 50 PNG de armas de Fase 55.5/55.6 medían 160×160 píxeles pero el proyectil real ocupaba solo el 19–45 % del ancho. El motor dibujaba la imagen completa a 32–49 px y la bala resultante quedaba minúscula.

## Arreglo realizado
- Recortados los **50 proyectiles** a su componente principal con transparencia real, eliminando fragmentos residuales de la lámina.
- El renderizado ahora **respeta las proporciones originales**, sin estirar cada bala en un cuadrado.
- Tamaños máximos visibles según categoría: **42, 45, 49, 54 y 58 píxeles**.
- Halo de luminosidad moderado para que resalten sobre el espacio sin parecer dos disparos superpuestos.
- Las balas de los **jefes** aumentan ligeramente de tamaño y brillo para no quedar más pequeñas que las normales.
- Si una imagen aún no ha cargado, el juego recurre al disparo de respaldo existente.
- **No se han aumentado ni daño, ni cantidad de balas, ni hitbox, ni velocidad.**
- Corregidos `index.html` y `src/scripts/02_engine.js` (entrada modular).
- Conservados los 50 enemigos nuevos, sus modelos reparados, los jefes y resto de contenidos.

## Pruebas
Abrir `COMPROBAR_50_BALAS_FASE55_8.html` para revisar las 50 balas sobre fondo oscuro, a escala real, y comprobar el antes/después.
La verificación en partida real en Windows queda pendiente.
