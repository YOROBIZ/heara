$file = "c:\Users\hp\Desktop\Hack\CostClock\src\views\ConversationView.vue"
$content = Get-Content -Path $file -Raw

# Replace literal \r\n with actual line breaks
$content = $content.Replace('\\r\\n', "`r`n")

Set-Content -Path $file -Value $content -NoNewline
Write-Host "Fixed line endings!"
