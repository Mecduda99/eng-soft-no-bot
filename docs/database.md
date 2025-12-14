Esta documentação técnica detalha a camada de persistência de dados para a arquitetura de microserviços da Plataforma "Não Sou Robô", utilizando o **SQLite** conforme solicitado.

Devido à natureza *Database per Service* da arquitetura de microserviços, cada serviço terá sua própria instância de banco de dados SQLite para gerenciar dados localmente.

---

# Documentação de Banco de Dados: SQLite

## 1. Estratégia de Persistência

A plataforma adota o padrão de **Banco de Dados por Serviço** (Database per Service). Isso significa que cada microserviço é independente e gerencia seus próprios dados. Embora o SQLite seja um banco de dados *file-based* (baseado em arquivo), ele é adequado para esta arquitetura em um contexto de microserviços Node.js onde ele pode armazenar dados transacionais e de domínio específicos para cada serviço.

**Observação:** O uso do SQLite em um ambiente de produção Dockerizado (que é um requisito do projeto) exige o mapeamento cuidadoso do volume do Docker para garantir que o arquivo de banco de dados (`.sqlite`) persista entre os *restarts* e *deploys* dos containers.

## 2. Esquemas de Dados Conceituais (SQLite DDL)

Os esquemas refletem as principais necessidades de dados dos serviços, como gerenciar a emissão de identidades (DIDs), registrar a validação de provas e lidar com revogações.

### 2.1 Identity-Issuer Service (Gerenciamento de Identidades)

Este serviço lida com a emissão e o status de vinculação das identidades descentralizadas (DIDs).

**Tabela: `identities`**
Armazena os identificadores descentralizados criados e o status de sua vinculação a fontes governamentais (Gov.br/CIN).

| Coluna | Tipo SQLite | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **did** | TEXT | PRIMARY KEY | O Identificador Descentralizado único do Cidadão (Ex: did:example:123). |
| **gov_link_status** | TEXT | NOT NULL | Status de vinculação ao Gov.br/CIN ('PENDING', 'LINKED'). |
| **gov_id_ref** | TEXT | UNIQUE | Referência da conta Gov.br/CIN (Pode ser nulo até a vinculação). |
| **creation_timestamp** | INTEGER | NOT NULL | Data de criação do DID (epoch time). |

**Tabela: `credentials`**
Armazena metadados sobre as Credenciais Verificáveis (VCs) emitidas, antes de serem publicadas na Blockchain (ou armazenadas na carteira do usuário).

| Coluna | Tipo SQLite | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **vc_id** | TEXT | PRIMARY KEY | ID da Credencial Verificável. |
| **did_owner** | TEXT | FOREIGN KEY | DID do proprietário da credencial. |
| **issue_date** | INTEGER | NOT NULL | Data de emissão. |
| **expiration_date** | INTEGER | | Data de expiração da VC. |

### 2.2 Proof-Verification Service (Validação de Provas)

Este serviço registra logs e resultados de todas as solicitações de validação de Zero-Knowledge Proof (ZK-Proof).

**Tabela: `verification_logs`**
Armazena o histórico das tentativas de verificação.

| Coluna | Tipo SQLite | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **log_id** | INTEGER | PRIMARY KEY AUTOINCREMENT | ID do log de verificação. |
| **did_submitted** | TEXT | NOT NULL | DID que submeteu a prova. |
| **proof_result** | TEXT | NOT NULL | Resultado da validação ('VERIFIED', 'FAILED'). |
| **verification_timestamp** | INTEGER | NOT NULL | Data e hora da validação da prova. |
| **blockchain_tx_ref** | TEXT | | Referência da transação na Blockchain (Validação ZK-Proof). |

### 2.3 Credential-Revocation Service (Revogação de Credenciais)

Este serviço mantém um registro local das credenciais que foram marcadas como revogadas para agilizar a consulta. Este registro é espelhado na Blockchain.

**Tabela: `revocations`**
Registra todas as credenciais que foram comprometidas ou expiradas.

| Coluna | Tipo SQLite | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **vc_id** | TEXT | PRIMARY KEY | ID da Credencial Verificável revogada. |
| **revocation_date** | INTEGER | NOT NULL | Data em que a revogação foi solicitada/efetivada. |
| **reason** | TEXT | | Motivo da revogação (e.g., 'COMPROMISED', 'EXPIRED'). |
| **blockchain_update_status** | TEXT | NOT NULL | Status de atualização na infraestrutura Blockchain aplicável. |

### 2.4 Edge-Middleware Gateway (Logs de Tráfego e Bots)

O Edge-Middleware precisa armazenar logs de tráfego e eventos anômalos para cumprir sua função de bloquear bots e tráfegos indevidos de rede.

**Tabela: `traffic_anomalies`**
Armazena detalhes sobre tráfego suspeito ou bots bloqueados.

| Coluna | Tipo SQLite | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **anomaly_id** | INTEGER | PRIMARY KEY AUTOINCREMENT | ID do evento anômalo. |
| **source_ip** | TEXT | NOT NULL | Endereço IP detectado. |
| **detection_timestamp** | INTEGER | NOT NULL | Hora da detecção. |
| **anomaly_type** | TEXT | NOT NULL | Tipo de anomalia ('BOT', 'DOS', 'RATE_LIMIT'). |
| **action_taken** | TEXT | | Ação executada pelo Gateway ('BLOCKED', 'THROTTLED'). |