@echo off
cd /d "%~dp0"
if not exist c_http_server.exe (
    echo [Info] c_http_server.exe not found. Building now...
    call build.bat
)

if exist c_http_server.exe (
    echo ====================================================================
    echo Launching Native Windows C HTTP REST Server on port 9095...
    echo ====================================================================
    c_http_server.exe --port 9095 --db tracker.db
) else (
    echo [Error] Could not find or build c_http_server.exe.
    echo Ensure GCC (MinGW-w64) or Visual Studio C++ is installed.
    pause
)
