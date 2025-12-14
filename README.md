# Plataforma "Não Sou Robô" - Sistema Anti-Fraude Blockchain

Plataforma robusta de Verificação e Privacidade em Blockchain para combater fraudes digitais e bots, assegurando identidade digital segura e descentralizada.

## 🎯 Objetivo

Criar uma solução completa que:
- **Assegura identidade digital** segura, confiável e descentralizada
- **Combate fraudes digitais** e proliferação de bots
- **Preserva privacidade** através de Zero-Knowledge Proofs
- **Integra com Gov.br/CIN** para validação oficial

## 🏗️ Arquitetura

### Microserviços Backend (Node.js)
- **Identity-Issuer Service** (3001) - Gerencia DIDs e vinculação Gov.br/CIN
- **Proof-Verification Service** (3002) - Valida ZK-Proofs sem expor dados
- **Credential-Revocation Service** (3003) - Revoga credenciais comprometidas
- **API Gateway** (3000) - Ponto único de entrada com detecção de bots

### Frontend (React + Vue.js)
- **Interface Cidadão** - Gerenciamento de identidade digital
- **Interface Empresa** - Verificação de usuários e monitoramento
- **Interface Governo** - Definição de padrões e conformidade

### Database (SQLite)
- **Database per Service** - Cada microserviço tem sua própria base
- **Esquemas específicos** conforme documentação técnica

## 🚀 Execução Rápida

### 1. Configurar Database
```bash
cd database
npm install
npm run setup
```

### 2. Executar Backend
```bash
cd backend

# Opção 1: Docker (recomendado)
docker-compose up --build

# Opção 2: Local
cd identity-issuer && npm install && npm start &
cd ../proof-verification && npm install && npm start &
cd ../credential-revocation && npm install && npm start &
cd ../api-gateway && npm install && npm start
```

### 3. Executar Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Estrutura do Projeto

```
eng-soft-dev/
├── backend/                 # Microserviços Node.js
│   ├── api-gateway/        # Gateway com detecção de bots
│   ├── identity-issuer/    # Serviço de identidades
│   ├── proof-verification/ # Verificação ZK-Proof
│   ├── credential-revocation/ # Revogação de credenciais
│   ├── shared/            # Utilitários compartilhados
│   └── docker-compose.yml # Orquestração Docker
├── database/              # Esquemas SQLite
│   ├── identity-issuer.sql
│   ├── proof-verification.sql
│   ├── credential-revocation.sql
│   └── edge-middleware.sql
├── frontend/              # Interface React
│   ├── src/pages/        # Páginas por tipo de usuário
│   ├── src/components/   # Componentes reutilizáveis
│   └── src/services/     # Integração API
├── docs/                 # Documentação técnica
└── README.md            # Este arquivo
```

## 🔗 Endpoints da API

### Identity Service
- `POST /api/identities` - Criar DID
- `GET /api/identities/:did` - Consultar identidade
- `PUT /api/identities/:did/link` - Vincular Gov.br/CIN
- `POST /api/credentials/:did/issue` - Emitir credencial

### Proof Verification
- `POST /api/proofs/verify` - Verificar ZK-Proof
- `GET /api/proofs/:log_id` - Consultar resultado

### Credential Revocation
- `POST /api/revocations` - Revogar credencial
- `GET /api/revocations/:vc_id` - Status de revogação

### Monitoring
- `GET /api/monitoring/anomalies` - Logs de tráfego suspeito

## 🎨 Design System

**Paleta de Cores:**
- Fundo: `#000000` (Preto)
- Fonte: `#FFFFFF` (Branco)
- Ação: `#00FF00` (Verde)

**Princípios:**
- Interface simples, bonita e precisa
- Contraste máximo para segurança
- Tipografia limpa e moderna

## 🧪 Testes

```bash
# Backend - Testes unitários
cd backend/identity-issuer && npm test
cd backend/proof-verification && npm test
cd backend/credential-revocation && npm test

# Frontend - Testes React
cd frontend && npm test
```

## 🐳 Docker

```bash
# Executar todos os serviços
docker-compose up --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📊 Monitoramento

- **API Gateway**: http://localhost:3000/health
- **Identity Service**: http://localhost:3001/health
- **Proof Service**: http://localhost:3002/health
- **Revocation Service**: http://localhost:3003/health
- **Frontend**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (admin/admin123)

## 🔐 Funcionalidades Principais

### Para Cidadãos
✅ Criar identidade digital descentralizada (DID)  
✅ Vincular com Gov.br/CIN  
✅ Emitir credenciais verificáveis  
✅ Revogar credenciais comprometidas  
✅ Provas de humanidade com privacidade  

### Para Empresas
✅ Validar identidade de usuários  
✅ Bloquear bots automaticamente  
✅ Monitorar tráfego anômalo  
✅ Configurar proteção de formulários  

### Para Governo
✅ Definir padrões de identidade digital  
✅ Monitorar conformidade LGPD  
✅ Certificar formatos de identidade  
✅ Apoiar infraestrutura blockchain  

## 🛠️ Tecnologias

**Backend:**
- Node.js + Express
- SQLite (Database per Service)
- RabbitMQ (Comunicação assíncrona)
- Docker + Docker Compose

**Frontend:**
- React 18 + React Router
- Axios (API Integration)
- CSS3 (Black & Green Theme)

**Arquitetura:**
- Microserviços
- Comunicação assíncrona via eventos
- Zero-Knowledge Proofs
- Identidade descentralizada (DID)

## 📚 Documentação

- [Arquitetura Geral](docs/arquitetura-geral.md)
- [Backend](docs/backend.md)
- [Database](docs/database.md)
- [Frontend](docs/frontend.md)
- [Testes](docs/testes.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido para combater fraudes digitais e garantir identidade segura na era blockchain** 🔒
