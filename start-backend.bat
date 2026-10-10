@echo off
title StockPilot - Backend Server
echo ====================================================
echo   StockPilot IMS - Starting Backend Server
echo   Running at: http://localhost:5000
echo ====================================================

:: Free port 5000 if already occupied by an old process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo [Info] Freeing port 5000 from existing process (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

cd backend
node server.js
pause
