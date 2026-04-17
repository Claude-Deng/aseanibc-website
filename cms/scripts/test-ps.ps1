$proc = Get-Process -Id 22412 -ErrorAction SilentlyContinue
if ($proc) {
    $owner = (Get-WmiObject Win32_Process -Filter "ProcessId=22412").GetOwner()
    Write-Host "Process: $($proc.ProcessName)"
    Write-Host "User: $($owner.User)"
    Write-Host "Domain: $($owner.Domain)"
} else {
    Write-Host "Process not found"
}
