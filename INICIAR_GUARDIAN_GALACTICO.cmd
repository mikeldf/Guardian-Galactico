@echo off
setlocal
if not exist "%~dp0index.html" (
  echo No se encuentra index.html. Extrae todo el ZIP en una carpeta nueva.
  pause
  exit /b 1
)
if not exist "%~dp0assets\" (
  echo Falta la carpeta assets. Extrae todo el ZIP.
  pause
  exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0app\windows\iniciar-app.ps1"
if errorlevel 1 pause
endlocal
