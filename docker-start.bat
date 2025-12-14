@echo off
echo Iniciando aplicacao completa...

echo 1. Configurando database...
cd database
npm install
node setup.js
cd ..

echo 2. Iniciando API Gateway (porta 3000)...
cd backend\api-gateway
start "API-Gateway" cmd /k "npm install && npm start"
cd ..\..

echo 3. Aguardando API Gateway...
ping 127.0.0.1 -n 6 > nul

echo 4. Construindo e executando frontend Docker (porta 8080)...
cd frontend
docker build -t dudac/nao-sou-robo-frontend:latest .
docker stop nao-sou-robo-app 2>nul
docker rm nao-sou-robo-app 2>nul
docker run -d -p 8080:80 --name nao-sou-robo-app dudac/nao-sou-robo-frontend:latest

echo 5. Aplicacao iniciada!
echo Frontend Docker: http://localhost:8080
echo API Gateway: http://localhost:3000/health
echo Teste: http://localhost:8080/health
pause