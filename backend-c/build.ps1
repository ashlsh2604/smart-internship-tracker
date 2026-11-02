# PowerShell Build Script for Smart Internship Tracker C Backend (Native Windows)
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "SMART INTERNSHIP TRACKER - NATIVE WINDOWS BUILD SCRIPT" -ForegroundColor Cyan
Write-Host "Compiling native Windows 10/11 C executables without Linux or WSL..." -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot
if (-not (Test-Path "obj")) {
    New-Item -ItemType Directory -Path "obj" | Out-Null
}

$cSourceFiles = @(
    "src/bst.c",
    "src/expression_stack.c",
    "src/graph.c",
    "src/linked_list.c",
    "src/problem_solving.c",
    "src/queue.c",
    "src/searching.c",
    "src/sorting.c",
    "src/stack.c"
)

$gcc = Get-Command "gcc" -ErrorAction SilentlyContinue
$clang = Get-Command "clang" -ErrorAction SilentlyContinue
$cl = Get-Command "cl" -ErrorAction SilentlyContinue

if ($gcc) {
    Write-Host "[Compiler] Using GCC for Windows (MinGW-w64)" -ForegroundColor Green
    Write-Host "[1/2] Compiling c_engine.exe..." -ForegroundColor Yellow
    & gcc -Wall -Wextra -O2 -Iinclude -std=c11 ($cSourceFiles + "src/c_engine.c") -o c_engine.exe
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   -> c_engine.exe compiled successfully!" -ForegroundColor Green
    }

    Write-Host "[2/2] Compiling c_http_server.exe..." -ForegroundColor Yellow
    & gcc -Wall -Wextra -O2 -Iinclude -std=c11 ($cSourceFiles + @("src/crypto.c", "src/db.c", "src/http_server.c", "src/c_server_main.c")) -o c_http_server.exe -lws2_32 -lsqlite3 2>$null
    if (-not (Test-Path "c_http_server.exe")) {
        & gcc -Wall -Wextra -O2 -Iinclude -std=c11 ($cSourceFiles + @("src/crypto.c", "src/db.c", "src/http_server.c", "src/c_server_main.c")) -o c_http_server.exe -lws2_32
    }
    if (Test-Path "c_http_server.exe") {
        Write-Host "   -> c_http_server.exe compiled successfully!" -ForegroundColor Green
        Write-Host "`nAll Windows native C binaries are ready!" -ForegroundColor Cyan
    }
} elseif ($clang) {
    Write-Host "[Compiler] Using Clang for Windows" -ForegroundColor Green
    & clang -Wall -Wextra -O2 -Iinclude -std=c11 ($cSourceFiles + "src/c_engine.c") -o c_engine.exe
    & clang -Wall -Wextra -O2 -Iinclude -std=c11 ($cSourceFiles + @("src/crypto.c", "src/db.c", "src/http_server.c", "src/c_server_main.c")) -o c_http_server.exe -lws2_32 -lsqlite3
} elseif ($cl) {
    Write-Host "[Compiler] Using MSVC (cl.exe) for Windows" -ForegroundColor Green
    & cl /W3 /O2 /Iinclude ($cSourceFiles + "src/c_engine.c") /Fe:c_engine.exe
    & cl /W3 /O2 /Iinclude ($cSourceFiles + @("src/crypto.c", "src/db.c", "src/http_server.c", "src/c_server_main.c")) ws2_32.lib /Fe:c_http_server.exe
} else {
    Write-Host "[Notice] No C compiler (gcc, clang, cl) was detected in PATH." -ForegroundColor Yellow
    Write-Host "To compile C code natively on Windows, install MinGW-w64 via WinLibs or winget:" -ForegroundColor Yellow
    Write-Host "  winget install -e --id BrechtSanders.WinLibs.POSIX.UCRT" -ForegroundColor White
}
