@echo off
echo Launching services in separate terminals...

:: Start DB
start "DB Server" cmd /k "docker-compose -f auth-ms/docker-compose.yml up"

:: Start Auth Server
:: Cleans dist folder to avoid permission errors or stale builds
start "Auth Server" cmd /k "cd auth-ms && if exist dist rmdir /s /q dist && npm run start:dev"

:: Start Frontend
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Done. Check the opened terminals.
