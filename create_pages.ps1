$headers = @{
    Authorization = 'Bearer cfut_yOLvkPmPtLKKnhbEHnRoyHtHaVYYTmyePNWNvCIY620225d9'
}
$body = @{
    name              = 'screenshoto'
    production_branch = 'main'
    build_config      = @{
        build_command   = 'npx @cloudflare/next-on-pages'
        destination_dir = '.vercel/output/static'
        root_dir        = ''
    }
}

$result = Invoke-RestMethod -Uri 'https://api.cloudflare.com/client/v4/accounts/e54c8dcb1abbec24d75b5d5471c7c502/pages/projects' -Method POST -Headers $headers -Body ($body | ConvertTo-Json -Depth 10) -ContentType 'application/json'

$result | ConvertTo-Json -Depth 10
