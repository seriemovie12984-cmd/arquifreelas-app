param(
  [switch]$AutoDeployLocal = $false,
  [int]$WaitSecondsForRemoteBuild = 10
)

if (-not (Test-Path ".git")) { Write-Error "No parece ser un repo Git. Ejecuta desde la raíz del proyecto."; exit 1 }
try { gh auth status > $null } catch { Write-Error "gh no está autenticado. Ejecuta 'gh auth login'."; exit 2 }

$branch = (git branch --show-current).Trim()
if (-not $branch) { Write-Error "No hay rama actual. Salir."; exit 1 }
Write-Output "Rama actual: $branch"

# buscar PR asociado (si existe)
$pr = $null
try { $pr = gh pr view --json number --jq .number --head $branch 2>$null } catch {}

if (-not $pr) {
  Write-Output "No se detectó PR automáticamente. Listando PRs abiertos..."
  gh pr list --state open --json number,title,headRefName | ConvertFrom-Json | ForEach-Object { Write-Output "#$($_.number) - $($_.title) (head: $($_.headRefName))" }
  $sel = Read-Host "Introduce el número del PR a fusionar (ej: 12)"
  if (-not $sel) { Write-Error "No se escogió PR. Saliendo."; exit 1 }
  $pr = $sel
}

Write-Output "Fusionando PR #$pr (branch: $branch)..."
$mergeOut = gh pr merge $pr --merge --delete-branch 2>&1
if ($LASTEXITCODE -ne 0) { Write-Error "Fallo al fusionar PR: $mergeOut"; exit 3 }
Write-Output "PR fusionado: $mergeOut"

# actualizar rama por defecto
$default = (gh repo view --json defaultBranchRef -q .defaultBranchRef.name) 2>$null
if (-not $default) { $default = 'main'; Write-Warning "Usando 'main' como rama por defecto." }
git fetch origin
git checkout $default
git pull origin $default

if ($AutoDeployLocal) {
  Write-Output "Ejecutando deploy local: railway up"
  railway up
  if ($LASTEXITCODE -ne 0) { Write-Warning "railway up falló; comprueba 'railway logs -f'." }
} else {
  Write-Output "Si GitHub→Railway está configurado, el deploy se lanzará automáticamente al hacer merge a $default."
}

$open = Read-Host "¿Abrir Railway dashboard y ver logs ahora? (y/n)"
if ($open -match '^[Yy]') { railway open; railway logs -f }
Write-Output "Fin: PR fusionado y rama $default actualizada."
