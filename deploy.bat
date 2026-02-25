@echo off
cd /d "%~dp0"
echo Deploying to Vercel...
vercel --prod
echo.
echo Done! Press any key to close.
pause >nul
