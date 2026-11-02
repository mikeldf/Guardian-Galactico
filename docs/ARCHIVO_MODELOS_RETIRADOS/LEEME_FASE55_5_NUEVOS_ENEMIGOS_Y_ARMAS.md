# Guardián Galáctico · Fase 55.5 — 50 nuevos enemigos y 50 armas

## Nuevo contenido
- Se añaden 50 naves enemigas y 50 proyectiles exclusivos (cinco parejas por mundo).
- Distribución de los nuevos por mundo: 2 débiles, 1 medio y 2 élites.
- Se conservan intactos los 70 modelos enemigos previos y los 50 diseños de jefes.
- Total actualizado: 120 enemigos normales + 50 diseños de jefe = 170 modelos.
- La campaña continúa con 10 mundos y 200 niveles; no se han borrado diseños ni música.
- Los nuevos se integran progresivamente en las oleadas existentes.

## Diferencias de juego
- Los débiles tienen menos resistencia y ataques sencillos; los medios resisten más.
- Los élites disparan proyectiles distintos y tienen mayor resistencia.
- Cada enemigo nuevo usa un sprite PNG transparente propio; sus armas son 50 imágenes separadas.
- Patrón de ataque nuevo limitado a 1-3 proyectiles por secuencia, para evitar saturación.
- No aparecen rótulos flotantes de categoría encima de las naves ni una leyenda superior.

## Para examinar los sprites
Abre GALERIA_50_ENEMIGOS_50_ARMAS.html desde la carpeta descomprimida.

## Cómo ejecutar
Descomprime TODO el ZIP en una carpeta nueva. Abre `index.html` o
`INICIAR_GUARDIAN_GALACTICO.cmd`. Mantén todas las carpetas dentro de la misma ubicación.

## Estado de verificación
- Validación de 100 imágenes transparentes y rutas; análisis sintáctico en las dos entradas.
- 19.200 selecciones de variantes comprobadas en un banco de pruebas que cubre 200 niveles.
- Se comprobaron por separado los 50 tipos de arma, con 1-3 proyectiles cada uno.
- La ejecución visual en Chromium del contenedor ha sido BLOQUEADA por el entorno;
  por tanto el juego todavía requiere prueba de pantalla y combate en Windows.
- El ejecutable independiente y el icono continúan reservados para la fase de Windows.
