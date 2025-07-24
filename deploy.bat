@echo off
echo  SecureSight Dashboard Deployment
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo  Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo  Node.js found
node --version

REM Install dependencies
echo  Installing dependencies...
call npm install

REM Generate Prisma client
echo  Generating Prisma client...
call npx prisma generate

REM Run database migrations
echo  Running database migrations...
call npx prisma migrate deploy

REM Seed the database
echo  Seeding database with sample data...
call npx prisma db seed

REM Build the application
echo  Building application...
call npm run build

echo.
echo  Deployment complete!
echo  Start the application with: npm run dev
echo  Open browser to: http://localhost:3000
echo.
echo  Features available:
echo    • Interactive dashboard with incident management
echo    • 24-hour timeline with draggable scrubber
echo    • Real-time incident resolution
echo    • 15 sample incidents across 3 cameras

pause
