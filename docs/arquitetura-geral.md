A sua requisição é abrangente e exige a criação de uma documentação detalhada da aplicação ("spec code") com base na arquitetura e nas funcionalidades definidas nos documentos anexos. O projeto em questão visa criar uma **Plataforma robusta de Verificação e Privacidade em Blockchain** para combater fraudes digitais e bots, assegurando uma identidade digital segura e descentralizada.

A documentação a seguir é baseada nos requisitos funcionais e na proposta arquitetural de microserviços descritas nas fontes.

---

## Documentação da Aplicação "Não Sou Robô"

### I. Arquitetura de Back-end (Microserviços)

O projeto da solução é baseado em uma arquitetura de **Microserviços**, utilizando **Comunicação Assíncrona via Eventos** para garantir a independência e a escalabilidade dos componentes. Os usuários (Cidadãos, Empresas, Governo) interagem com o sistema através de aplicativos Web ou Mobile, que se comunicam com um **API Gateway** antes de rotear as requisições aos serviços internos.

#### Microserviços Identificados:

1.  **Identity-Issuer Service**
    *   **Função:** Gerenciar a emissão e vinculação de identidades digitais descentralizadas (DIDs) a contas Gov.br/CIN.
    *   **CRUD/Ações de Domínio:** *Criar* DID, *Ler* status de vinculação, *Atualizar* informações de vinculação, *Emitir* credencial verificável (VC).

2.  **Proof-Verification Service**
    *   **Função:** Validar provas criptográficas (Zero-Knowledge Proofs - ZK-Proofs) enviadas pelos usuários **sem expor dados pessoais**.
    *   **CRUD/Ações de Domínio:** *Criar* solicitação de verificação, *Ler* resultado da validação, *Validar* prova na Blockchain.

3.  **Credential-Revocation Service**
    *   **Função:** Gerenciar a revogação de credenciais verificáveis (VCs) comprometidas ou expiradas.
    *   **CRUD/Ações de Domínio:** *Criar/Registrar* revogação na Blockchain, *Ler* status de revogação de uma VC.

4.  **Edge-Middleware Gateway**
    *   **Função:** Filtrar, interceptar e autenticar tráfego no perímetro da rede, **bloqueando bots** antes que cheguem ao backend.
    *   **CRUD/Ações de Domínio:** *Monitorar* tráfego, *Registrar* eventos anômalos.

### II. Banco de Dados (DB)

Cada microserviço é projetado para ter sua própria persistência de dados (modelo *Database per Service*). Dada a natureza do projeto (identidade descentralizada e Blockchain), a persistência envolve tanto registros locais (para metadados e logs) quanto a interação com a infraestrutura Blockchain aplicável.

| Microserviço | Tipo de Dado (Conceitual) | Ações de Persistência |
| :--- | :--- | :--- |
| Identity-Issuer Service | Registro de DIDs, Status de vinculação Gov.br/CIN | Armazenar, Ler, Atualizar |
| Proof-Verification Service | Logs de solicitação de validação, Resultados ZK-Proof | Criar Log, Consultar (Read) |
| Credential-Revocation Service | Registros de revogação na Blockchain | Inserir/Atualizar registro de revogação |
| Edge-Middleware Gateway | Logs de tráfego, Eventos anômalos, Bots bloqueados | Armazenar Logs, Monitorar (Read) |

### III. Comunicação Assíncrona (Eventos)

A comunicação entre os microserviços do backend deve ser **assíncrona baseada em eventos**. Isso é essencial para desacoplar serviços e garantir que, por exemplo, a emissão de uma identidade (feita pelo *Identity-Issuer*) possa notificar outros serviços sem esperar uma resposta imediata.

| Evento | Publicador | Consumidores | Descrição da Ação Assíncrona |
| :--- | :--- | :--- | :--- |
| `IdentityLinked` | Identity-Issuer Service | Proof-Verification Service | Notifica que um Cidadão vinculou sua identidade ao Gov.br, permitindo futuras validações. |
| `CredentialRevoked` | Credential-Revocation Service | Proof-Verification Service | Notifica que uma credencial foi revogada, para que o sistema impeça o acesso futuro com essa credencial. |
| `AnomalousTrafficDetected` | Edge-Middleware Gateway | Proof-Verification Service (opcionalmente) | Sinaliza um potencial ataque de bot, que pode desencadear regras de segurança ou logs. |

### IV. Documentação de Front-end (Conceitual)

A plataforma Front-end deve suportar a interação dos principais usuários: Cidadão, Empresa e Governo.

| Usuário | Funcionalidades Principais do Front-end (Baseadas na Análise Funcional) |
| :--- | :--- |
| **Cidadão** | Interface para vinculação da Identidade Digital (Gov.br/CIN), Gerenciamento e Revogação de Credenciais (VCs), Solicitação de acesso a serviços digitais. |
| **Empresa** | Interface para solicitação de verificação de humanidade/identidade de um usuário, Gerenciamento de acessos, Monitoramento de eventos anômalos. |
| **Governo** | Interface para certificação de formatos de identidade digital, Definição de modos de integração (Gov.br e CIN), Monitoramento geral de identidades. |

### V. Cenários e Códigos de Testes

Os cenários de testes devem ser derivados das funcionalidades do sistema, cobrindo testes unitários, de integração e de interface (UI). Os exemplos de cenários fornecidos utilizam o padrão Gherkin (Dado/E Que/Quando/Então).

#### 1. Cenários de Testes (Baseados nas User Stories e DST):

**Cenário de Teste de Integração (Validação ZK-Proof):**
*Funcionalidade: Validação de Identidade Segura*
| Tipo de Teste | Descrição |
| :--- | :--- |
| Integração (Service-to-Service) | Dado Que o Cidadão possui uma **Identidade Descentralizada** criada E Que o Cidadão possui uma credencial Gov.br válida Quando O Cidadão solicita acesso a um serviço da Empresa E o `Proof-Verification Service` recebe o ZK-Proof Então O **Sistema valida a prova na Blockchain** e o `Proof-Verification Service` retorna sucesso. |

**Cenário de Teste de Unidade (Revogação):**
*Funcionalidade: Revogação de Credencial Comprometida*
| Tipo de Teste | Descrição |
| :--- | :--- |
| Unitário (Credential-Revocation Service) | Dado Que o `Credential-Revocation Service` está ativo E Que uma das credenciais foi comprometida Quando O Serviço recebe o comando de revogação de credencial (VC) Então O **Sistema atualiza o registro de revogação na Blockchain**. |

**Cenário de Teste UI (Solicitação de Acesso):**
| Tipo de Teste | Descrição |
| :--- | :--- |
| UI (Front-end do Cidadão) | Dado Que o Cidadão está logado em sua Wallet Digital E Que o Cidadão seleciona um serviço online da Empresa Quando O Cidadão clica em "Solicitar Acesso" Então Uma interface de `Verificação de Humanidade` é exibida E a solicitação é enviada ao **Edge-Middleware Gateway**. |

#### 2. Código de Testes (Conceitual)

*Observação: As fontes fornecem apenas os cenários de testes em linguagem BDD/Gherkin e a instrução de que os testes (Unitários, Integração e UI) são necessários. O código de implementação real (Python, Java, etc.) para os testes não está disponível nas fontes, mas o escopo do projeto o exige.*

**Exemplo Conceitual (Proof-Verification Service - Teste Unitário):**

```python
# Teste Unitário (Proof-Verification Service)
def test_validate_valid_zkproof():
    # Setup: Simular um ZK-Proof válido
    valid_proof = {"proof": "valid_zk_data", "user_did": "did:example:123"}
    # Ação: Chamar a função de validação
    result = proof_verification_service.validate_proof(valid_proof)
    # Assert: Verificar se a validação foi bem-sucedida
    assert result.status == "Verified"
    assert "no personal data exposed" in result.notes # Conforme requisito do sistema
```

### VI. Deploy via Docker e Pipeline CI/CD

#### 1. Deploy via Docker

O deploy de cada microserviço e do Edge-Middleware será realizado utilizando **Docker**, garantindo ambientes consistentes.

**Exemplo Conceitual de Dockerfile (Identity-Issuer Service):**

```dockerfile
# Dockerfile para o Identity-Issuer Service
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/identity-issuer-service.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
# Variáveis de ambiente configuradas para conectar ao BD e à infraestrutura Blockchain aplicável
```

#### 2. Código PIPELINE CI/CD (Integração GitHub)

O Pipeline de CI/CD para integração no GitHub (utilizando GitHub Actions como exemplo) deve ser definido para automatizar a construção (CI) e a entrega (CD) do software, um requisito fundamental do projeto.

*Observação: O código YAML do pipeline não está presente nas fontes, mas o requisito é documentado.*

**Exemplo Conceitual de Pipeline CI/CD (para um Microserviço):**

```yaml
# .github/workflows/identity-issuer-ci-cd.yml
name: CI/CD Identity Issuer Service

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    # 1. Build e Testes Unitários/Integração (CI)
    - name: Setup Java 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    - name: Build with Maven
      run: mvn clean install

    # 2. Execução de Testes
    - name: Run Unit and Integration Tests # Testes Unitários e de Integração são requisitos
      run: mvn test

    # 3. Construção da Imagem Docker (Deploy via Docker)
    - name: Build Docker Image
      run: docker build -t myregistry/identity-issuer:latest .

    # 4. Push e Deploy (CD)
    - name: Login to Docker Registry
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Push Docker Image
      run: docker push myregistry/identity-issuer:latest
```