@echo off
echo Iniciando todos os servicos backend...

echo Configurando database...
cd ..
cd database
npm install
node setup.js
cd backend

echo Iniciando API Gateway (porta 3000)...
start "API-Gateway" cmd /k "cd api-gateway && npm install && npm start"

ping 127.0.0.1 -n 4 > nul

echo Iniciando Identity-Issuer (porta 3001)...
start "Identity-Service" cmd /k "cd identity-issuer && npm install && npm start"

ping 127.0.0.1 -n 4 > nul

echo Iniciando Proof-Verification (porta 3002)...
start "Proof-Service" cmd /k "cd proof-verification && npm install && npm start"

ping 127.0.0.1 -n 4 > nul

echo Iniciando Credential-Revocation (porta 3003)...
start "Revocation-Service" cmd /k "cd credential-revocation && npm install && npm start"

echo Todos os servicos foram iniciados!
echo API Gateway: http://localhost:3000
echo Frontend: http://localhost:8080
pause