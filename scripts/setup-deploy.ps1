# scripts/setup-deploy.ps1
Set-StrictMode -Version Latest

# Ensure running from repo root
if (-not (Test-Path .git)) { Write-Error "No estás en la raíz del repo. Ejecuta desde la carpeta del proyecto."; exit 1 }

$branch = "ci/railway-deploy"
Write-Host "Creando rama $branch..."
git checkout -b $branch

# Use single-quoted here-string (@' '@) to avoid PowerShell expanding ${{ ... }}
$workflow = @'
name: CI & Deploy to Railway

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Lint (optional)
        run: npm run lint || true

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Railway CLI
        run: npm i -g railway

      - name: Login to Railway using API key
        env:
          RAILWAY_API_KEY: ${{ secrets.RAILWAY_API_KEY }}
        run: |
          railway login --apiKey "$RAILWAY_API_KEY"

      - name: Run Prisma migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          npx prisma migrate deploy --schema=prisma/schema.prisma

      - name: Trigger Railway deploy
        env:
          RAILWAY_API_KEY: ${{ secrets.RAILWAY_API_KEY }}
        run: |
          railway up --detach || (echo "railway up failed; check token permissions / project" && exit 1)
'@

Write-Host "Creando archivo .github/workflows/deploy-to-railway.yml..."
New-Item -ItemType Directory -Force -Path ".github\workflows" | Out-Null
Set-Content -Path ".github\workflows\deploy-to-railway.yml" -Value $workflow -Encoding UTF8

# Create deploy scripts
$deploySh = @'
#!/usr/bin/env bash
set -e

npm ci
npm run build
npx prisma migrate deploy --schema=prisma/schema.prisma
railway up --detach
'@

Write-Host "Creando scripts/deploy.sh y scripts/deploy.ps1..."
New-Item -ItemType Directory -Force -Path "scripts" | Out-Null
Set-Content -Path "scripts/deploy.sh" -Value $deploySh -Encoding UTF8
# Make sh executable when on systems that respect chmod (WSL/Git Bash users should run chmod +x scripts/deploy.sh)

$deployPs = @'
Set-StrictMode -Version Latest
Write-Host "Install & build..."
npm ci
npm run build

Write-Host "Run prisma migrations..."
npx prisma migrate deploy --schema=prisma/schema.prisma

Write-Host "Deploy to Railway..."
railway up --detach
'@
Set-Content -Path "scripts/deploy.ps1" -Value $deployPs -Encoding UTF8

# .env.example and checklist
Write-Host "Creando .env.example y CHECKLIST_DEPLOY.md..."
Set-Content -Path ".env.example" -Value @"
NEXTAUTH_URL=https://<tu-app>.up.railway.app
NEXTAUTH_SECRET=GENERATE_A_SECRET
DATABASE_URL=postgresql://user:pass@host:port/dbname
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MERCADOPAGO_ACCESS_TOKEN=...
NEXT_PUBLIC_UPLOAD_URL=...
"@ -Encoding UTF8

Set-Content -Path "CHECKLIST_DEPLOY.md" -Value @"
1. Añadir `RAILWAY_API_KEY` en GitHub Secrets.
2. Añadir `DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `MERCADOPAGO_ACCESS_TOKEN`.
3. Mergear PR `ci/railway-deploy` a main.
4. Revisar Actions → Logs → URL pública.
5. Probar login Google, crear proyecto, subir imagen y publicar.
"@ -Encoding UTF8

# Git add/commit/push
Write-Host "Añadiendo cambios y creando commit..."
git add .github\workflows scripts .env.example CHECKLIST_DEPLOY.md
git commit -m "ci: add Railway deploy workflow and deploy scripts"

Write-Host "Pushing branch $branch to origin..."
git push -u origin $branch

# Create PR using gh if available
if (Get-Command gh -ErrorAction SilentlyContinue) {
  Write-Host "Creando PR con gh..."
  gh pr create --title "CI: add Railway deploy workflow" --body "Adds GitHub Action for building and deploying to Railway; includes deploy scripts and checklist." --base main
  Write-Host "PR creada. Revisa y mergea en GitHub." 
} else {
  Write-Host "gh CLI no encontrada. Abre una PR manualmente desde la rama $branch." 
}

Write-Host "Hecho. Mergea la PR a main para iniciar el workflow."