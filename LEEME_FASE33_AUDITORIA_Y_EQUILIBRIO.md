# Guardián Galáctico — Fase 33 · Auditoría y equilibrio de combate

## Qué se comprobó realmente

- Se inspeccionó el código de la versión Fase 32, sus directores de oleadas, tablas de 70 enemigos, armas, 36 formaciones, 50 jefes, hitboxes, balance por dificultad y visualización de fondos.
- El contenido estructural cuenta con **500 misiones** en **10 mundos**, **2.615 oleadas programadas** y **47.735 apariciones enemigas programadas** (suma de cantidades, no enemigos simultáneos).
- Conservadas las **60 naves**, sus mejoras, el hangar y el progreso. Las imágenes/assets se copiaron sin cambiar su tamaño ni número de ficheros.
- No se ha superado ni certificado cada uno de los 500 niveles en una partida real. La auditoría enumera el contenido y prueba muestras, no verifica el equilibrio de todas las situaciones con un jugador humano.

## Causas concretas de los defectos

1. El director permitía disparar cada ~1,2 s en el primer mundo y podía sumar un segundo tirador a la vez; los picados podían disparar también por separado.
2. El picado anterior seguía `sin(pi*t)` en la posición vertical: llegaba a un punto medio y luego regresaba a su formación.
3. El fondo se dibujaba sin una reducción de brillo común entre planetas, dificultando distinguir disparos en zonas claras.

## Cambios implementados

- **Cadencia global coordinada:** 2,85 s (mundo 1) hasta 1,85 s (mundo 10), leve reducción dentro de cada mundo a partir de los niveles 16/31, con multiplicador por dificultad.
- **Un único tirador por turno:** eliminada la segunda nave que disparaba simultáneamente. Aviso de 0,73 s, ampliado a 0,88 s en los primeros 10 niveles.
- **Límite de proyectiles simultáneos:** 5 a 14 por mundo en condiciones base, +1 hacia los últimos niveles, y +5 para encuentros de jefes. Las dificultades siguen ajustando el límite.
- **Disparo inicial:** un proyectil apuntado en niveles 1–10 y velocidad moderada. Los patrones múltiples se añaden progresivamente.
- **Picados:** solo cazas pequeños de tipo 0; una persecución a la vez. Se dirigen a la posición del jugador y continúan hasta la zona del jugador o la salida por abajo; no rebotan hacia arriba.
- **Ataque de contacto:** colisión de picado ajustada para esperar contacto visible con la nave, evitando desapariciones prematuras.
- **Bala del picado:** disparo opcional condicionado por el mismo reloj de separación de las ráfagas globales. No hay segunda descarga automática del picado.
- **Jefes:** enfriamiento de ataques 25% superior de base, respetando sus fases, patrones y torretas. Se deja de borrar parte de las balas existentes al cambiar de fase.
- **Legibilidad del fondo:** superposición oscura de 38% únicamente sobre la ilustración del mundo, antes de dibujar proyectiles, enemigos, nave y HUD.

## Balance nominal por mundo (dificultad normal)

| Mundo | Misiones | Oleadas | Enemigos programados | Pausa nominal entre ráfagas | Límite de balas |
|---|---:|---:|---:|---:|---:|
| 1 | 50 | 263 | 4166 | 2.85 s | 5 |
| 2 | 50 | 258 | 4175 | 2.65 s | 6 |
| 3 | 50 | 258 | 4433 | 2.45 s | 7 |
| 4 | 50 | 258 | 4691 | 2.30 s | 8 |
| 5 | 50 | 263 | 5045 | 2.22 s | 9 |
| 6 | 50 | 263 | 5045 | 2.15 s | 10 |
| 7 | 50 | 263 | 5045 | 2.05 s | 11 |
| 8 | 50 | 263 | 5045 | 1.98 s | 12 |
| 9 | 50 | 263 | 5045 | 1.90 s | 13 |
| 10 | 50 | 263 | 5045 | 1.85 s | 14 |

## Pruebas automatizadas ejecutadas

- JavaScript: 5 bloques compilados con `node --check`, todos válidos.
- Carga aislada del juego en Chromium: sin errores JS ni rutas ausentes en la prueba.
- Nivel 1: 19 segundos de tiempo de simulación, 5 proyectiles enemigos creados; 2 ataques de caza pequeño tipo 0, con contacto detectado a la altura del jugador.
- Nivel 12: arranque, oleada y nuevos parámetros revisados; captura real del motor en `GG_Fase33_Combate_Real.png` (fuera del ZIP).
- Se comprobó el inventario completo de 500 misiones, 10 mundos, 70 perfiles enemigos, 50 jefes, 36 variantes de formaciones y 60 naves.
- Los recursos `assets/` se conservaron con el mismo número de archivos y tamaños que en la Fase 32. Los 10 fondos de combate existen.

## Pendiente de validar en PC

- Sesiones completas de juego en Windows con movimiento real del jugador y cada nivel de dificultad.
- Ajustar sensación de fuego enemigo en sub-jefes y jefes de mundos 6–10 tras pruebas de juego.
- Evaluar todas las combinaciones de naves, mejoras, armas y enemigos en los 500 niveles; esta fase no certifica las 500 partidas.

## Instalación

Extraer el ZIP entero en una **carpeta nueva** y abrir `index.html` en Chrome o Edge. `index.html` está en la raíz del ZIP; `assets/` debe permanecer a su lado. No mezclar con carpetas anteriores.
