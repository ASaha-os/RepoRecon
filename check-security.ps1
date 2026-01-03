# Security Check Script for RepoRecon (PowerShell)
# Verifies that no sensitive files are tracked by git

Write-Host "🔒 RepoRecon Security Check" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check for tracked .env files (except .env.example)
Write-Host "📋 Checking for tracked .env files..." -ForegroundColor Yellow
$trackedEnv = git ls-files | Select-String -Pattern "\.env" | Where-Object { $_ -notmatch "\.env\.example" }

if ($null -eq $trackedEnv -or $trackedEnv.Count -eq 0) {
    Write-Host "✅ No sensitive .env files are tracked by git" -ForegroundColor Green
} else {
    Write-Host "❌ WARNING: The following .env files are tracked:" -ForegroundColor Red
    $trackedEnv | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    Write-Host ""
    Write-Host "To remove them from git (but keep locally):" -ForegroundColor Yellow
    Write-Host "git rm --cached <filename>" -ForegroundColor Yellow
}

Write-Host ""

# Check for .env files in working directory
Write-Host "📁 Checking for .env files in working directory..." -ForegroundColor Yellow
$envFiles = Get-ChildItem -Recurse -Filter ".env*" -File | 
    Where-Object { $_.Name -ne ".env.example" -and $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.git" } |
    Select-Object -ExpandProperty FullName

if ($envFiles) {
    $envFiles | ForEach-Object { 
        $relativePath = $_.Replace((Get-Location).Path, ".")
        Write-Host "  $relativePath" -ForegroundColor Gray
    }
} else {
    Write-Host "  No .env files found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Security check complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Remember:" -ForegroundColor Cyan
Write-Host "- Never commit .env files with sensitive data" -ForegroundColor White
Write-Host "- Always use .env.example as a template" -ForegroundColor White
Write-Host "- Keep API keys and secrets in environment variables" -ForegroundColor White
