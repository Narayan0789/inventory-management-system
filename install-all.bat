@echo off
title StockPilot - Setup & Install
echo ====================================================
echo   StockPilot IMS - One-Click Installer
echo ====================================================
echo.
echo [1/2] Installing Backend packages...
cd backend
call npm install
echo.
echo Populating sample database with realistic data...
node seed.js
echo.
echo [2/2] Installing Frontend packages...
cd ..\frontend
call npm install
echo.
echo ====================================================
echo   SUCCESS! All dependencies installed.
echo   Now open start-backend.bat and start-frontend.bat
echo ====================================================
pause
