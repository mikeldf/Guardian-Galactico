# Guardián Galáctico — Fase 55.1: eventos dinámicos durante la campaña

## Qué hay de nuevo
Manteniendo las **nueve modalidades de misión** ya existentes, la campaña incluye **siete eventos de sector** que pueden surgir en oleadas concretas y que modifican realmente el combate:

1. **Corredor de apoyo**: aparece una mejora recogible de arma, escudo o energía según lo que necesite la nave.
2. **Piloto de élite**: llega un enemigo reforzado y marcado; abatirlo otorga bonificación.
3. **Cargamento secreto**: una nave lleva una mejora que puedes conseguir al derrotarla.
4. **Reagrupamiento sorpresa**: la formación enemiga cambia de figura durante el combate.
5. **Cazas fugitivos**: aparecen interceptores marcados que conviene alcanzar pronto.
6. **Ventana de recarga**: el jugador recibe energía y un escudo adicional (hasta el límite actual).
7. **Desafío de ráfaga**: cuatro eliminaciones en 18 segundos proporcionan 55 monedas extra.

## Dónde aparecen
- Misiones locales 1–3: introducción sin eventos nuevos.
- A partir de la misión local 4 de cada mundo: un evento en una oleada intermedia, si hay suficientes oleadas.
- Desde la misión local 12: puede aparecer otro evento al final, además del primero, si las oleadas lo permiten.
- El patrón depende de mundo, nivel y oleada. Es reproducible para poder investigar errores.
- Los eventos son opcionales; no son condiciones para superar un nivel.

## Compatibilidad
- No altera la campaña de 200 niveles ni los 10 mundos.
- Conserva las 60 naves, las 10 familias / 50 niveles de armas, las 26 pistas de música y los diseños aprobados.
- El sistema de guardado original sigue intacto; las recompensas se contabilizan como monedas normales de la misión.
- No necesita instalar Python ni dependencias nuevas para jugar.
- Se mantiene `index.html` y `index_modular.html`.
- El ejecutable `.exe` independiente y el icono del juego siguen reservados para la siguiente fase.

## Comprobaciones realizadas
- Sintaxis JavaScript de ambas entradas.
- 219 comprobaciones lógicas de calendario, variedad, recompensas y comportamiento del juego, incluyendo 200 misiones.
- Comparación de recursos con la Fase 55: no se ha retirado ningún archivo.
- Integridad de ZIP comprobada.

**Pendiente**: prueba completa de jugabilidad y rendimiento en un equipo Windows real; las pruebas de navegador gráfico no estaban disponibles en este entorno.
