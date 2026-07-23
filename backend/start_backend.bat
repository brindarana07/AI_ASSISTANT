@echo off
setlocal
title Verdant AI Backend

REM Remove only proxy values for this backend session. This prevents an unavailable
REM localhost proxy from blocking the Gemini SDK on Windows.
set HTTP_PROXY=
set HTTPS_PROXY=
set ALL_PROXY=
set http_proxy=
set https_proxy=
set all_proxy=

REM Stop an older Flask server only when it is using Verdant's API port.
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":5000 .*LISTENING"') do taskkill /PID %%p /F >nul 2>&1

cd /d "%~dp0"
echo Starting Verdant AI backend at http://127.0.0.1:5000
echo Keep this window open while using the website.
python app.py
pause
