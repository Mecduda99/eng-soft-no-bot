# Quick Start - Não Sou Robô

## 🛡️ Sobre a Solução

A plataforma **"Não Sou Robô"** é um sistema revolucionário de identidade digital descentralizada que combate fraudes e bots usando tecnologia blockchain e Zero-Knowledge Proofs. Integrada ao Gov.br e CIN, a solução permite que cidadãos criem identidades digitais seguras (DID), empresas validem usuários reais sem acessar dados pessoais, e o governo monitore conformidade LGPD mantendo total privacidade. Com detecção inteligente de bots, provas criptográficas de humanidade e infraestrutura blockchain nacional, estabelece um novo padrão de segurança digital no Brasil, eliminando dependência de big techs estrangeiras e garantindo soberania digital nacional.

## 🚀 Execução Rápida

### 1. Database (Uma vez)
```bash
cd database
npm install
node setup.js
```

### 2. Backend Services
```bash
# Terminal 1 - API Gateway
cd backend/api-gateway
npm install
npm start

# Terminal 2 - Identity Service  
cd backend/identity-issuer
npm install
npm start

# Terminal 3 - Proof Service
cd backend/proof-verification  
npm install
npm start

# Terminal 4 - Revocation Service
cd backend/credential-revocation
npm install
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## 🌐 URLs
- **API Gateway**: http://localhost:3000/health
- **Frontend**: http://localhost:8080
- **Cidadão**: http://localhost:8080/citizen
- **Empresa**: http://localhost:8080/company
- **Governo**: http://localhost:8080/government

## ✅ Teste Rápido
1. Acesse http://localhost:3000/health
2. Acesse http://localhost:8080
3. Teste criação de DID na página Cidadão