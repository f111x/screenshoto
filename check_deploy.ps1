$headers = @{ Authorization = 'Bearer cfut_1UR64VH9cZRIMNTochjwf02vmtRyVzCSBBGv2vh13f06e903' }
$deployId = 'a6d1e2fd-ad7c-4790-99d0-31d3776f1623'
$accountId = 'e54c8dcb1abbec24d75b5d5471c7c502'

$result = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/screenshoto/deployments/$deployId" -Method GET -Headers $headers
$result | ConvertTo-Json -Depth 10

# Also fetch build logs
$logs = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/accounts/$accountId/pages/projects/screenshoto/deployments/$deployId/history" -Method GET -Headers $headers -ErrorAction SilentlyContinue
Write-Host "=== LOGS ==="
$logs | ConvertTo-Json -Depth 10
