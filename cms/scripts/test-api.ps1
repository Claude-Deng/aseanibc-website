$headers = @{ Authorization = "Bearer 4566e39fb70c3a1e3819ce9f27584fc2b7fae06f1e2f0c26f7bded2aff339f90978b2ea628f485f0d8baa3d7848398170329f13a47474a99b1f7ec4cd7900da458fa782f2162693885b65115b3c52f977c5620040c79326b3c12fe02bc2edfcb2821fbb0a460bbfa0d8dfe83d358ddbe3f3c9b226a3afdd5a7ffd1b8880e2989" }
try {
    $r = Invoke-WebRequest "http://127.0.0.1:1337/api/team-members" -Headers $headers -TimeoutSec 5
    Write-Host "Status: $($r.StatusCode)"
    $json = $r.Content | ConvertFrom-Json
    $members = $json
    if ($members.Count -eq $null) { $members = $json.data }
    Write-Host "Count: $($members.Count)"
    $groups = @{}
    foreach ($m in $members) {
        $g = $m.teamGroup
        if (-not $g) { $g = "(空)" }
        if (-not $groups.ContainsKey($g)) { $groups[$g] = @() }
        $groups[$g] += @{ name = $m.name; title = $m.title; order = $m.order }
    }
    foreach ($g in $groups.Keys | Sort-Object) {
        Write-Host ""
        Write-Host "【$g】共 $($groups[$g].Count) 人："
        $sorted = $groups[$g] | Sort-Object order
        foreach ($m in $sorted) {
            Write-Host "  $($m.order). $($m.name) ($($m.title))"
        }
    }
} catch {
    Write-Host "Error: $_"
}
