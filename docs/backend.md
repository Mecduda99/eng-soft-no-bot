Este documento técnico detalha a arquitetura de backend em microserviços para a plataforma "Não Sou Robô", utilizando **Node.js** como linguagem de implementação para os serviços, conforme solicitado. A arquitetura segue o modelo de microserviços com comunicação **assíncrona baseada em eventos**, que é um requisito fundamental do projeto.

---

# Documento Técnico de Backend: Plataforma "Não Sou Robô"

## 1. Visão Geral da Arquitetura

O backend é estruturado em uma arquitetura de Microserviços para suportar a Plataforma robusta de Verificação e Privacidade em Blockchain, cujo objetivo estratégico é assegurar identidade digital segura, confiável e descentralizada.

Utilizaremos **Node.js** (com framework Express ou similar) para a construção dos serviços, favorecendo o modelo de I/O não bloqueante, ideal para o tráfego intenso e a comunicação assíncrona necessária.

### 1.1 Tecnologia e Comunicação
| Componente | Especificação Técnica | Propósito no Domínio |
| :--- | :--- | :--- |
| **Linguagem Backend** | Node.js / TypeScript | Desenvolvimento rápido e eficiente em ambiente assíncrono. |
| **Comunicação** | Assíncrona via Eventos (Message Broker: Kafka/RabbitMQ) | Desacoplamento de serviços e garantia de entrega de eventos (e.g., `IdentityLinked`). |
| **Persistência** | Database per Service (ex: MongoDB para DIDs, PostgreSQL para Logs) | Garantir autonomia e escolha da melhor persistência para cada serviço. |
| **Interface Externa** | API Gateway | Ponto único de entrada, crucial para filtrar e bloquear bots antes do backend (Edge-Middleware conceitual). |

## 2. Especificação dos Microserviços (Node.js)

Foram selecionados três serviços de domínio (Core Domain Services) que lidam diretamente com as funcionalidades de Identidade, Prova e Revogação.

### 2.1 Microserviço 1: Identity-Issuer Service

Este serviço é responsável por gerenciar a emissão e vinculação de identidades digitais descentralizadas (DIDs) a contas Gov.br/CIN.

#### **Ações de Domínio (CRUD):**
| Verbo HTTP | Rota (REST) | Ação de Domínio / Função | Descrição (CRUD) |
| :--- | :--- | :--- | :--- |
| `POST` | `/identities` | Criar Identidade Descentralizada (DID) | **Cria** um novo DID para um Cidadão. |
| `GET` | `/identities/:did` | Consultar Status de Identidade | **Lê** o status atual de vinculação do DID. |
| `PUT` | `/identities/:did/link` | Vincular Conta Gov.br/CIN | **Atualiza** o registro de vinculação da identidade. |
| `POST` | `/credentials/:did/issue` | Emitir Credencial Verificável (VC) | Emite uma VC após a vinculação ser confirmada. |

#### **Estrutura Conceitual (Node.js/Express):**

```javascript
// identity-issuer/routes/identityRoutes.js
const express = require('express');
const router = express.Router();
const publisher = require('../messaging/eventPublisher'); // Para comunicação assíncrona

// PUT /identities/:did/link (Ação de atualização)
router.put('/:did/link', async (req, res) => {
    // Lógica para vincular o DID ao Gov.br/CIN...
    
    // Publica evento de sucesso (Comunicação Assíncrona)
    await publisher.publish('IdentityLinked', { did: req.params.did, timestamp: Date.now() });
    
    res.status(200).send({ message: 'Identidade vinculada com sucesso.' });
});

// Outras rotas (POST, GET)...

module.exports = router;
```

#### **Comunicação Assíncrona (Eventos Publicados):**
*   `IdentityLinked`: Publicado quando uma identidade é vinculada ao Gov.br/CIN.

---

### 2.2 Microserviço 2: Proof-Verification Service

Este serviço é responsável por validar provas criptográficas (Zero-Knowledge Proofs - ZK-Proofs) enviadas pelos usuários. É crucial que este serviço realize a validação **sem expor dados pessoais**.

#### **Ações de Domínio (CRUD):**
| Verbo HTTP | Rota (REST) | Ação de Domínio / Função | Descrição (CRUD) |
| :--- | :--- | :--- | :--- |
| `POST` | `/proofs/verify` | Receber e Validar ZK-Proof | **Cria** um registro de solicitação de verificação; **Valida** a prova criptográfica na Blockchain. |
| `GET` | `/proofs/:proof_id` | Consultar Resultado da Validação | **Lê** o resultado final da validação (Verified/Failed). |

#### **Comunicação Assíncrona (Eventos Consumidos):**
Este serviço deve consumir eventos para verificar a validade de uma credencial ou identidade antes de processar uma prova:

*   `IdentityLinked`: Garante que a identidade subjacente está ativa.
*   `CredentialRevoked`: Verifica se a Credencial Verificável (VC) apresentada não foi revogada.

#### **Estrutura Conceitual (Node.js/Express):**

```javascript
// proof-verification/messaging/eventConsumer.js

const consumer = require('./messageBroker'); 

consumer.on('CredentialRevoked', async (eventData) => {
    console.log(`[PROOF-VERIFICATION] Credencial Revogada: ${eventData.vc_id}`);
    // Lógica: Inserir a VC na lista de credenciais bloqueadas localmente
    await revocationCache.add(eventData.vc_id); 
});

// proof-verification/api/verificationRoutes.js
router.post('/verify', async (req, res) => {
    const { zkProof } = req.body;
    
    if (revocationCache.isRevoked(zkProof.vc_id)) {
        return res.status(403).send({ status: 'Revoked', result: 'Access Denied' });
    }
    
    // Lógica para chamar a infraestrutura Blockchain para validar a prova
    const isValid = await blockchainAdapter.validateProof(zkProof); // O Sistema valida a prova na Blockchain
    
    res.status(200).send({ status: isValid ? 'Verified' : 'Failed', result: 'Provas de humanidade com privacidade' });
});
```

---

### 2.3 Microserviço 3: Credential-Revocation Service

Este serviço gerencia o ciclo de vida das credenciais verificáveis (VCs), especificamente a revogação de VCs comprometidas ou expiradas.

#### **Ações de Domínio (CRUD):**
| Verbo HTTP | Rota (REST) | Ação de Domínio / Função | Descrição (CRUD) |
| :--- | :--- | :--- | :--- |
| `POST` | `/revocations` | Registrar Revogação de Credencial | **Cria/Registra** a revogação de uma VC na Blockchain. |
| `GET` | `/revocations/:vc_id` | Consultar Status de Revogação | **Lê** o status de revogação de uma credencial (VC). |
| `DELETE` | `/revocations/:vc_id` | Remover Registro de Revogação | Embora não seja um fluxo comum em Blockchain, pode ser usado para **reverter** um registro local ou log de revogação. |

#### **Comunicação Assíncrona (Eventos Publicados):**
*   `CredentialRevoked`: Publicado quando uma credencial é marcada como comprometida, para notificar outros serviços (como o *Proof-Verification Service*).

#### **Estrutura Conceitual (Node.js/Express):**

```javascript
// credential-revocation/controllers/revocationController.js

async function handleRevocationRequest(req, res) {
    const vc_id = req.params.vc_id;
    
    // 1. Atualizar o registro de revogação na Blockchain
    const blockchainSuccess = await blockchainAdapter.registerRevocation(vc_id); // O Sistema atualiza o registro de revogação na Blockchain
    
    if (blockchainSuccess) {
        // 2. Publicar o evento assíncrono para os consumidores
        await publisher.publish('CredentialRevoked', { vc_id: vc_id, reason: 'Compromised' });
        res.status(202).send({ status: 'Accepted', message: `VC ${vc_id} em processo de revogação.` });
    } else {
        res.status(500).send({ error: 'Falha ao registrar na Blockchain.' });
    }
}
```