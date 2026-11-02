# Guardián Galáctico · Fase 55.7 — Recorte nuevo desde originales

Los 50 PNG de enemigos se han recortado **de nuevo desde los archivos originales de la Fase 55.6**, no desde los recortes defectuosos de una corrección anterior. Están en `assets/gg58_new/enemies/`, en formato PNG RGBA con fondo transparente.

Se han eliminado fragmentos sueltos y fondo azul oscuro, y se han interpolado pequeñas líneas divisorias que cortaban algunas naves al pasar desde la lámina original. Se han vuelto a centrar los sprites y se han dejado márgenes transparentes consistentes. Se mantienen sin cambios las 50 armas enemigas, 50 jefes, 60 naves del jugador, 32 canciones y 200 niveles.

Para comprobarlos, abre `REVISAR_50_RECORTES_LIMPIOS.html` y alterna entre fondo claro y oscuro, o consulta `AUDITORIA_RECORTES_NUEVOS_TRANSPARENCIA.png`.

**Límite técnico importante:** donde la lámina original ya cortaba una sección grande de la nave, recortar o reconstruir unas filas no puede recuperar el arte faltante al 100%. Esos diseños necesitarán un original limpio sin líneas o redibujado. Este paquete no afirma falsamente haber recuperado detalle ausente.
