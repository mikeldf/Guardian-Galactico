$ErrorActionPreference = 'Stop'
$game = (Resolve-Path (Join-Path $PSScriptRoot '..\..\index.html')).Path
$folder = Split-Path -Parent $game
if (-not (Test-Path (Join-Path $folder 'assets'))) {
    Write-Host 'Falta la carpeta assets. Extrae el ZIP completo.' -ForegroundColor Red
    exit 1
}
$x86 = [Environment]::GetEnvironmentVariable('ProgramFiles(x86)')
$pf = [Environment]::GetEnvironmentVariable('ProgramFiles')
$candidates = @()
if ($x86) { $candidates += (Join-Path $x86 'Microsoft\Edge\Application\msedge.exe') }
if ($pf) { $candidates += (Join-Path $pf 'Microsoft\Edge\Application\msedge.exe') }
$edge = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) {
    Write-Host 'Microsoft Edge no encontrado. Abre index.html en Chrome o Edge.' -ForegroundColor Yellow
    exit 2
}
$url = ([Uri]$game).AbsoluteUri
Start-Process -FilePath $edge -ArgumentList @('--app=' + $url, '--start-maximized')
