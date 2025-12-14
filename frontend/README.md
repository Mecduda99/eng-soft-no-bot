# Frontend - Plataforma "Não Sou Robô"

Interface web para a Plataforma Anti-Fraude Blockchain com identidade digital segura e descentralizada.

## Tecnologias

- **React 18** - Framework principal (SPA)
- **React Router** - Navegação entre páginas
- **Axios** - Comunicação com API Gateway
- **CSS3** - Estilização com tema Black & Green

## Arquitetura

### Estrutura de Páginas

1. **Cidadão** (`/citizen`)
   - Criação e gerenciamento de identidade digital (DID)
   - Vinculação com Gov.br/CIN
   - Emissão e revogação de credenciais
   - Verificação de humanidade (ZK-Proof)

2. **Empresa** (`/company`)
   - Verificação de usuários
   - Monitoramento de tráfego e anomalias
   - Configuração de proteção automatizada

3. **Governo** (`/government`)
   - Definição de padrões de identidade digital
   - Monitoramento centralizado de identidades
   - Conformidade LGPD e regulatória
   - Status da infraestrutura blockchain

### Design System

**Paleta de Cores:**
- Fundo Principal: `#000000` (Preto)
- Fonte Principal: `#FFFFFF` (Branco)
- Cor de Ação: `#00FF00` (Verde)
- Destaque: `#1a1a1a` (Preto acinzentado)

**Componentes:**
- `.btn` - Botões de ação
- `.card` - Containers de conteúdo
- `.input` - Campos de entrada
- `.verification-box` - Componente de verificação

## Integração Backend

Comunicação via API Gateway (`http://localhost:3000/api`):

### Endpoints Utilizados

**Identity Service:**
- `POST /identities` - Criar DID
- `GET /identities/:did` - Consultar identidade
- `PUT /identities/:did/link` - Vincular Gov.br
- `POST /credentials/:did/issue` - Emitir credencial

**Proof Verification:**
- `POST /proofs/verify` - Verificar ZK-Proof
- `GET /proofs/:log_id` - Consultar resultado

**Credential Revocation:**
- `POST /revocations` - Revogar credencial
- `GET /revocations/:vc_id` - Status de revogação

**Monitoring:**
- `GET /monitoring/anomalies` - Logs de tráfego

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

## Funcionalidades Implementadas

### Interface do Cidadão
✅ Criação de identidade digital (DID)  
✅ Consulta de status de identidade  
✅ Vinculação com Gov.br/CIN  
✅ Emissão de credenciais verificáveis  
✅ Revogação de credenciais  
✅ Verificação de humanidade (ZK-Proof)  

### Interface da Empresa
✅ Verificação de usuários  
✅ Monitoramento de anomalias de tráfego  
✅ Visualização de logs de segurança  
✅ Configuração de proteção  

### Interface do Governo
✅ Definição de padrões de identidade  
✅ Monitoramento de identidades  
✅ Consulta de revogações  
✅ Status da infraestrutura blockchain  
✅ Conformidade LGPD  

## Micro-Frontend Architecture

O projeto implementa uma arquitetura híbrida:
- **React** como shell principal da aplicação
- **Componente de Verificação** simulando integração Vue.js
- Preparado para Module Federation em produção

## Próximos Passos

1. Integração real com Vue.js via Module Federation
2. Implementação de autenticação JWT
3. Testes automatizados (Jest/React Testing Library)
4. PWA (Progressive Web App)
5. Internacionalização (i18n)