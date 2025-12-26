# scripts/deploy-to-vercel.ps1
# Usage: pwsh .\scripts\deploy-to-vercel.ps1


# Config
$projectDir = (Resolve-Path ".").Path
$envFile = Join-Path $projectDir ".env.local"
$requiredVars = @(
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",                # e.g. https://tu-app.vercel.app
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY"
)

# 1) Check Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Vercel CLI not found. Installing globally..."
  npm install -g vercel
}

# 2) Ensure VERCEL_TOKEN available
if (-not $env:VERCEL_TOKEN) {
  Write-Host "Please paste your Vercel Token (it will not be stored):"
  $token = Read-Host -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
  $VERCEL_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  if (-not $VERCEL_TOKEN) { Write-Error "No token provided. Exiting."; exit 1 }
  $env:VERCEL_TOKEN = $VERCEL_TOKEN
}

# 3) Read .env.local (if exists) and collect variables
$varsToSet = @{}
if (Test-Path $envFile) {
  (Get-Content $envFile) | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.+)$') {
      $k = $matches[1].Trim()
      $v = $matches[2].Trim()
      $v = $v.Trim('"')
      $v = $v.Trim("'")
      $varsToSet[$k] = $v
    }
  }
}

# Ensure required vars exist or prompt
foreach ($k in $requiredVars) {
  if (-not $varsToSet.ContainsKey($k)) {
    Write-Host "Variable $k not found in .env.local. Please enter a value (or leave blank to skip):"
    $val = Read-Host
    if ($val) { $varsToSet[$k] = $val }
  }
}

# 4) Link project to Vercel (interactive if necessary)
Write-Host "Linking project to Vercel (if not already linked)..."
pushd $projectDir
try {
  vercel link --yes | Out-Null
} catch {
  Write-Host "If link asks for interactive input, please follow prompts in terminal."
  vercel link
}

# 5) Set environment variables in Vercel (production)
Write-Host "Setting environment variables in Vercel (production)..."
foreach ($pair in $varsToSet.GetEnumerator()) {
  $k = $pair.Key; $v = $pair.Value
  if (-not $v) { continue }
  Write-Host " - Setting $k"
  vercel env add $k $v production --token $env:VERCEL_TOKEN --yes | Out-Null
}

# 6) Deploy to production
Write-Host "Deploying to Vercel (production)..."
$deployOutput = vercel --prod --confirm --token $env:VERCEL_TOKEN
Write-Host "`n--- Deploy output ---"
Write-Host $deployOutput

# parse deployment URL (best-effort)
$deployUrl = $null
if ($deployOutput -like "*vercel.app*") {
  $deployUrl = ($deployOutput -split "`n") | Where-Object { $_ -like "*vercel.app*" } | Select-Object -First 1
  Write-Host "`nDeployment URL (detected): $deployUrl"
} else {
  Write-Host "`nCould not auto-detect deployment URL; check the vercel output above for the URL." 
}

# 7) Smoke test endpoints
$testUrl = $env:NEXT_PUBLIC_SITE_URL
if ($testUrl) {
  Write-Host "`nTesting endpoints on $testUrl..."
  $urls = @("$testUrl/", "$testUrl/login", "$testUrl/api/health")
  foreach ($u in $urls) {
    try {
      $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 15
      Write-Host "  $u -> $($r.StatusCode)"
    } catch {
      Write-Host "  $u -> ERROR ($($_.Exception.Message))"
    }
  }
} else {
  Write-Host "NEXT_PUBLIC_SITE_URL not set; skip smoke tests."
}

Write-Host "`nDone. Next steps:"
Write-Host "- Update Supabase Dashboard > Authentication > URL Configuration: set Site URL and Redirect URL(s) to the new URL."
Write-Host "- Update Google Cloud Console: add new JS origin and confirm redirect URI."
Write-Host "- Test login in an incognito window."

popd
