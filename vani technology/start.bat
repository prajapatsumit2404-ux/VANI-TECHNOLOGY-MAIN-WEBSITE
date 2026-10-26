@echo off
cd /d "%~dp0"
if not exist node_modules call npm install
if not exist public\css\site.css call npm run build:css
npm run dev
