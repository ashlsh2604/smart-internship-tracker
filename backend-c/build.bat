@echo off
setlocal enabledelayedexpansion

echo ====================================================================
echo SMART INTERNSHIP DEADLINE TRACKER - NATIVE WINDOWS C COMPILER
echo ====================================================================
echo Building native Windows 10/11 C executables without Linux, WSL, or Docker...
echo.

cd /d "%~dp0"
if not exist obj mkdir obj

:: 1. Check for GCC (MinGW-w64 / WinLibs / MSYS2 / TDM-GCC)
where gcc >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Compiler Found] Detected GCC for Windows:
    gcc --version | findstr /i "gcc"
    echo.
    echo [1/2] Compiling c_engine.exe (CLI ^& DSA Test Suite)...
    gcc -Wall -Wextra -O2 -Iinclude -std=c11 src/bst.c src/expression_stack.c src/graph.c src/linked_list.c src/problem_solving.c src/queue.c src/searching.c src/sorting.c src/stack.c src/c_engine.c -o c_engine.exe
    if %ERRORLEVEL% NEQ 0 (
        echo [Build Error] Failed to compile c_engine.exe
        exit /b %ERRORLEVEL%
    )
    echo    - c_engine.exe successfully built!

    echo.
    echo [2/2] Compiling c_http_server.exe (Native Windows HTTP REST Server with Winsock2 ^& SQLite3)...
    gcc -Wall -Wextra -O2 -Iinclude -std=c11 src/bst.c src/expression_stack.c src/graph.c src/linked_list.c src/problem_solving.c src/queue.c src/searching.c src/sorting.c src/stack.c src/crypto.c src/db.c src/http_server.c src/c_server_main.c -o c_http_server.exe -lws2_32 -lsqlite3 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo    - Notice: Linking standard sqlite3 failed, trying fallback compilation with Winsock2...
        gcc -Wall -Wextra -O2 -Iinclude -std=c11 src/bst.c src/expression_stack.c src/graph.c src/linked_list.c src/problem_solving.c src/queue.c src/searching.c src/sorting.c src/stack.c src/crypto.c src/db.c src/http_server.c src/c_server_main.c -o c_http_server.exe -lws2_32
    )

    if exist c_http_server.exe (
        echo    - c_http_server.exe successfully built!
        echo.
        echo ====================================================================
        echo BUILD SUCCESSFUL: Native Windows C backend binaries ready!
        echo Run 'run.bat' to launch the C server, or 'test.bat' to run DSA tests.
        echo ====================================================================
        exit /b 0
    )
)

:: 2. Check for Clang
where clang >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Compiler Found] Detected Clang for Windows.
    clang -Wall -Wextra -O2 -Iinclude -std=c11 src/bst.c src/expression_stack.c src/graph.c src/linked_list.c src/problem_solving.c src/queue.c src/searching.c src/sorting.c src/stack.c src/c_engine.c -o c_engine.exe
    clang -Wall -Wextra -O2 -Iinclude -std=c11 src/bst.c src/expression_stack.c src/graph.c src/linked_list.c src/problem_solving.c src/queue.c src/searching.c src/sorting.c src/stack.c src/crypto.c src/db.c src/http_server.c src/c_server_main.c -o c_http_server.exe -lws2_32 -lsqlite3
    if exist c_http_server.exe (
        echo [Success] Built native Windows executables with Clang!
        exit /b 0
    )
)

:: 3. Check for MSVC (cl.exe)
where cl >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [Compiler Found] Detected Microsoft Visual C++ Compiler (cl.exe).
    cl /W3 /O2 /Iinclude src\bst.c src\expression_stack.c src\graph.c src\linked_list.c src\problem_solving.c src\queue.c src\searching.c src\sorting.c src\stack.c src\c_engine.c /Fe:c_engine.exe
    cl /W3 /O2 /Iinclude src\bst.c src\expression_stack.c src\graph.c src\linked_list.c src\problem_solving.c src\queue.c src\searching.c src\sorting.c src\stack.c src\crypto.c src\db.c src\http_server.c src\c_server_main.c ws2_32.lib /Fe:c_http_server.exe
    if exist c_http_server.exe (
        echo [Success] Built native Windows executables with MSVC!
        exit /b 0
    )
)

echo [Notice] No C compiler (gcc, clang, or cl) found in your Windows PATH.
echo To compile the native C binaries on Windows:
echo   - Option A: Install MinGW-w64 via winget: 'winget install -e --id MSYS2.MSYS2' or 'winget install -e --id BrechtSanders.WinLibs.POSIX.UCRT'
echo   - Option B: Use Visual Studio Community with Desktop C++ tools
echo Note: The Node.js dev server will run automatically and provide all API endpoints even before C compilation.
exit /b 0
