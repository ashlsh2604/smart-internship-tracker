@echo off
cd /d "%~dp0"
if not exist c_engine.exe (
    echo [Info] c_engine.exe not found. Building now...
    call build.bat
)

if exist c_engine.exe (
    echo ====================================================================
    echo Running C DSA Engine Tests Natively on Windows 10/11...
    echo ====================================================================
    c_engine.exe
) else (
    echo [Error] Could not find or build c_engine.exe.
    pause
)
