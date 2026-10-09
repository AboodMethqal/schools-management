@echo off
setlocal
title Methqal Tech - School Management Platform (Local Demo)

echo ===================================================
echo     Methqal Tech - School Management Platform
echo     منصة مثقال تك لإدارة المدارس - النسخة التجريبية المحلية
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [2/4] Checking environment configuration...
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo .env created from template.
    )
)
if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo .env.local created from template.
    )
)

if not exist "node_modules" (
    echo Installing dependencies, please wait...
    call npm install
)

echo [3/4] Initializing local SQLite database...
call npx prisma generate

if not exist "dev.db" (
    echo Initializing database schema and demo data...
    call npm run db:migrate
    call npm run db:seed
)

echo [4/4] Starting local development server...
echo.
echo ===================================================
echo  Server is starting on: http://localhost:3000
echo  Try all 6 Demo Roles on: http://localhost:3000/live-demo
echo  To stop the server, press Ctrl + C
echo ===================================================
echo.

start "" "http://localhost:3000/live-demo"

call npm run dev

pause
