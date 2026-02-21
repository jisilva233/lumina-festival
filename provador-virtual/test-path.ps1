$psRoot = $PSScriptRoot
$projectRoot = Split-Path -Parent $psRoot
Write-Host "Project root: $projectRoot"
$storyPath = Join-Path $projectRoot "docs\stories"
Write-Host "Story path: $storyPath"
Write-Host "Existe: $(Test-Path $storyPath)"
Write-Host ""
Write-Host "Conteúdo:"
Get-ChildItem -Path $storyPath -Filter "1.*" | Select-Object Name
