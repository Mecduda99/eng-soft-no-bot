# Plataforma "Não Sou Robô" - Backend Microserviços

Plataforma robusta de Verificação e Privacidade em Blockchain para combater fraudes digitais e bots, assegurando identidade digital segura e descentralizada.

## Arquitetura

### Microserviços Implementados

1. **Identity-Issuer Service** (Porta 3001)
   - Gerencia emissão e vinculação de identidades digitais descentralizadas (DIDs)
   - Integração com Gov.br/CIN

2. **Proof-Verification Service** (Porta 3002)
   - Valida provas criptográficas (Zero-Knowledge Proofs)
   - Verificação sem exposição de dados pessoais

3. **Credential-Revocation Service** (Porta 3003)
   - Gerencia revogação de credenciais verificáveis (VCs)
   - Registro na Blockchain

4. **API Gateway** (Porta 3000)
   - Ponto único de entrada
   - Detecção e bloqueio de bots
   - Roteamento para microserviços

### Comunicação Assíncrona

- **Message Broker**: RabbitMQ
- **Eventos**: IdentityLinked, CredentialRevoked
- **Padrão**: Publish/Subscribe

### Banco de Dados

- **SQLite** por serviço (Database per Service)
- **Volumes Docker** para persistência

## Configuração e Execução

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### Instalação Local

```bash
# Instalar dependências
npm install

# Executar todos os serviços
npm start

# Executar em modo desenvolvimento
npm run dev
```

### Execução com Docker

```bash
# Construir e executar todos os serviços
docker-compose up --build

# Executar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## Endpoints da API

### API Gateway (http://localhost:3000)

#### Identity Service
- `POST /api/identities` - Criar DID
- `GET /api/identities/:did` - Consultar identidade
- `PUT /api/identities/:did/link` - Vincular Gov.br/CIN
- `POST /api/credentials/:did/issue` - Emitir credencial

#### Proof Verification
- `POST /api/proofs/verify` - Verificar ZK-Proof
- `GET /api/proofs/:log_id` - Consultar resultado

#### Credential Revocation
- `POST /api/revocations` - Revogar credencial
- `GET /api/revocations/:vc_id` - Status de revogação

#### Monitoramento
- `GET /api/monitoring/anomalies` - Logs de tráfego suspeito

## Testes

```bash
# Executar todos os testes
npm test

# Testes por serviço
cd identity-issuer && npm test
cd proof-verification && npm test
cd credential-revocation && npm test
```

## Exemplo de Uso

### 1. Criar Identidade Digital

```bash
curl -X POST http://localhost:3000/api/identities \
  -H "Content-Type: application/json" \
  -d '{"did": "did:example:123456"}'
```

### 2. Vincular ao Gov.br

```bash
curl -X PUT http://localhost:3000/api/identities/did:example:123456/link \
  -H "Content-Type: application/json" \
  -d '{"gov_id_ref": "gov_123456"}'
```

### 3. Verificar Prova de Humanidade

```bash
curl -X POST http://localhost:3000/api/proofs/verify \
  -H "Content-Type: application/json" \
  -d '{
    "zkProof": {
      "did": "did:example:123456",
      "vc_id": "vc:credential:789",
      "proof": "zk_proof_data"
    }
  }'
```

### 4. Revogar Credencial

```bash
curl -X POST http://localhost:3000/api/revocations \
  -H "Content-Type: application/json" \
  -d '{
    "vc_id": "vc:credential:789",
    "reason": "COMPROMISED"
  }'
```

## Monitoramento

- **RabbitMQ Management**: http://localhost:15672 (admin/admin123)
- **Health Checks**: 
  - Gateway: http://localhost:3000/health
  - Identity: http://localhost:3001/health
  - Proof: http://localhost:3002/health
  - Revocation: http://localhost:3003/health

## Estrutura do Projeto

```
backend/
├── api-gateway/          # Gateway com detecção de bots
├── identity-issuer/      # Serviço de identidades
├── proof-verification/   # Verificação de provas
├── credential-revocation/# Revogação de credenciais
├── shared/              # Utilitários compartilhados
├── data/                # Bancos SQLite
├── docker-compose.yml   # Orquestração Docker
└── package.json         # Workspace raiz
```