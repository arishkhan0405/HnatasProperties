@echo off
title HantasProperties Local Web Server
echo Starting HantasProperties local web server on http://localhost:8080 ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
