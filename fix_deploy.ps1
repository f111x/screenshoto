$headers = @{ Authorization = 'Bearer cfut_1UR64VH9cZRIMNTochjwf02vmtRyVzCSBBGv2vh13f06e903' }
$accountId = 'e54c8dcb1abbec24d75b5d5471c7c502'

# Fix build config
$body = @{
    build_config = @{
        build_command   = 'npx @cloudflare/next-on-pages'
        destination_dir = '.vercel/output/static'
        root_dir        = ''
    }
}

$result = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/screenshoto" -Method PATCH -Headers $headers -Body ($body | ConvertTo-Json -Depth 10) -ContentType 'application/json'
Write-Host "=== UPDATE RESULT ==="
$result | ConvertTo-Json -Depth 10

# Trigger a new deployment
$deployBody = @{ branch = 'main' } | ConvertTo-Json
$deployResult = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/screenshoto/deployments" -Method POST -Headers $headers -Body $deployBody -ContentType 'application/json'
Write-Host "=== DEPLOY RESULT ==="
$deployResult | ConvertTo-Json -Depth 10
