# Guardián Galáctico — Fase 55.4

Actualización sobre la Fase 55.3. Conserva imágenes, modelos, interfaces, armas del jugador, campaña y guardados.

## Audio
- 11 efectos de recogida diferenciados (arma principal, misiles, guiados, láser, plasma, salva, eléctrico, escudo, vida, energía, monedas).
- Sonidos sintetizados localmente con Web Audio. Sin audio tomado de otros videojuegos.
- 6 composiciones instrumentales originales MP3: Ruta nebular, Horizonte azul, Tormenta iónica, Pulso cósmico, Alerta estelar y Núcleo final.
- Biblioteca de 32 pistas en total. Los nuevos temas se alternan con los 26 anteriores al terminar una canción o usar el botón Siguiente.
- En el navegador el sonido comienza tras la primera interacción del jugador, por restricciones habituales de reproducción automática.

## Formaciones
- Se emplean las posiciones originales de las 36 formaciones, dejando de colocarlas sobre una cuadrícula casi idéntica.
- Más de diez enemigos se distribuyen en dos rangos, para evitar superposición.
- Los cambios de formación interpolan sus posiciones durante 1,6 s.

## Power-ups
- Los premios normales se separan al menos 4,7 s; los especiales al menos 2,3 s.
- Máximo tres premios visibles simultáneamente. No se generan múltiples copias de un mismo premio normal al eliminar un enemigo.
- Probabilidad normal reducida, y mejora de arma periódica al alcanzar 23 eliminaciones cuando procede. Se mantiene el misil inicial y los reabastecimientos cuando se acaba la munición.
- Los cargamentos pueden dar recompensa, limitada por el mismo sistema global para evitar saturación.

## Categorías de enemigo
- Débil (tipos 1–2): ● celeste.
- Medio (tipos 3–5): ◆ amarillo.
- Fuerte (tipos 6–7): ▲ salmón.
- Élite (comandantes/líderes): ★ violeta.
- Leyenda visible en combate y selector de niveles; símbolos sobre los enemigos para no depender sólo del color.

## Comprobación
- Los 36 patrones de posición son distintos en las pruebas de lógica y en ambas entradas del juego.
- Se verificaron las 11 clases de sonido, los 32 MP3 presentes y los archivos originales de la Fase 55.3.
- Sintaxis JavaScript comprobada en la entrada principal y motor modular.
- La apertura visual en navegador de pruebas de este entorno quedó bloqueada por una restricción del navegador, así que la respuesta visual y el equilibrio se deben confirmar con partida en Windows.

## Inicio
Extraer el ZIP entero en una carpeta nueva. Ejecutar INICIAR_GUARDIAN_GALACTICO.cmd o abrir index.html. No abrir el HTML desde dentro del ZIP.
