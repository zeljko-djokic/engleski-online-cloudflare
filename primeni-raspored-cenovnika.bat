@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0primeni-raspored-cenovnika.ps1"
echo.
pause
