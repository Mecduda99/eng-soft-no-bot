@echo off
echo Iniciando servicos...

echo Database configurado!

echo Iniciando API Gateway...
cd api-gateway
start npm start
cd ..

echo Aguarde 5 segundos...
ping 127.0.0.1 -n 6 > nul

echo Servicos iniciados!
echo Acesse: http://localhost:3000/health
pause