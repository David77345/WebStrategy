@echo off
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js 24 LTS y vuelve a abrir este archivo.
  pause
  exit /b 1
)
if not exist "apps\web\.env.local" copy "apps\web\.env.example" "apps\web\.env.local" >nul
if not exist "node_modules\next\package.json" (
  call npm.cmd ci
  if errorlevel 1 (
    echo La instalacion fallo. Revisa el mensaje anterior.
    pause
    exit /b 1
  )
)
echo Abre en tu navegador la direccion Local que aparecera abajo.
echo Manten esta ventana abierta. Para detener: Ctrl+C.
call npm.cmd run dev
pause
