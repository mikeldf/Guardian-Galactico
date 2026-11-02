# Arquitectura de Guardián Galáctico — Fase 54

## Entradas
- `index.html`: **versión segura** para jugar en navegador o en la ventana Electron; mantiene el código principal en el HTML para evitar dependencias adicionales durante la ejecución.
- `index_modular.html`: **misma versión funcional** con sus hojas CSS y scripts inline trasladados a `src/styles/` y `src/scripts/`, conservando el orden de carga. Se probó en navegador y conserva las mismas pantallas.
- `assets/`: **todos** los recursos del motor — modelos de naves, sprites de enemigos, animaciones, música, mapas, fondos e iconografía del HUD.
- `app/main.cjs`: entrada de Electron para Windows. Sin icono incluido.
- `app/windows/iniciar-app.ps1` e `INICIAR_GUARDIAN_GALACTICO.cmd`: iniciador opcional por Microsoft Edge en modo aplicación, sin requerir Python ni un servidor web.

## Código modularizado
- `src/styles/`: 13 hojas CSS separadas de la entrada modular.
- `src/scripts/`: 6 scripts separados de la entrada modular; el motor conserva sus estados y reglas.
- `assets/ui/`: estilos y componentes ilustrados existentes que siguen siendo utilizados.

**No se han reescrito de cero las reglas de combate.** El objetivo es estabilidad y una base que pueda refactorizarse después de las pruebas en Windows, manteniendo una entrada jugable fiable.

## Compilación de Windows (.exe)
`package.json` define el comando `npm run dist:win` para generar un ejecutable portátil en un entorno de desarrollo con Electron y electron-builder. Esa compilación necesita dependencias disponibles en el entorno de construcción; **este ZIP no contiene todavía un EXE compilado**. El archivo CMD no es ese EXE, sino un lanzador que usa Edge instalado.

## Verificación de esta entrega
- `INFORME_VERIFICACION_FASE54.json`: comprobación de archivos, rutas e imágenes.
- `PRUEBA_NAVEGADOR_FASE54.json` y `PRUEBA_NAVEGADOR_MODULAR_FASE54.json`: pruebas de navegación.
- `COMPROBAR_NAVES.html`: página de ayuda que comprueba si los 60 modelos se pueden cargar desde la carpeta extraída.

No extraigas un archivo HTML separado sin su carpeta `assets`: el juego no puede funcionar completo sin ella.
