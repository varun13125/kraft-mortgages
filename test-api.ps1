# Test API endpoint
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer test-token"
}

$body = @{
    mode = "auto"
    targetProvinces = @("BC")
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://www.kraftmortgages.ca/api/debug-run" -Method POST -Headers $headers -Body $body
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10