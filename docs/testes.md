1. Relatório: Funcional_e_Dominio.md

# 1. Análise Funcional e Domain Storytelling (DST)

Este relatório descreve o problema, a proposta de solução e o mapeamento do fluxo de domínio (DST) para a Plataforma de Verificação e Privacidade em Blockchain.

## 1.1 Relato do Problema (1)

O problema a ser enfrentado é a ineficiência e a insegurança das verificações humanas e a proliferação de bots [1]. Este cenário propicia o aumento contínuo de fraudes digitais, acessos automatizados maliciosos e falsas identidades, comprometendo a segurança e a confiança no ambiente digital [1].

## 1.2 Proposta de Solução (2)

A proposta é a criação de uma **Plataforma robusta de Verificação e Privacidade em Blockchain** [2].

O objetivo estratégico é **Assegurar identidade digital segura, confiável e descentralizada** [1, 2].

A plataforma visa atingir os seguintes resultados:
*   Identidade vinculada ao CIN/Gov.br [2].
*   Aumento da confiança na identidade digital [2].
*   Redução de Fraudes [2].
*   Fornecer provas de humanidade para serviços online com privacidade [2].

**Usuários da Solução:**
*   Pessoas físicas (Cidadãos) [2]
*   Empresas [2]
*   Governo [2]

## 1.3 Análise de Funcionalidades (3)

As funcionalidades chave do sistema, que direcionam o projeto da solução, são:

| Funcionalidade | Cidadão | Empresa | Governo |
| :--- | :--- | :--- | :--- |
| Armazenar Identidade | **X** | | |
| Validar pessoa real | | **X** | |
| Controlar Credencial e Consentimento | **X** | | |
| Autenticar de modo rápido e confiável | **X** | | |
| Gerenciar acessos | | **X** | |
| Confirmar identidade segura | | **X** | |
| Bloquear Bots e tráfegos indevidos de rede | | **X** | |
| Monitorar eventos anômalos | | **X** | |
| Estabelecer proteção automatizada para formulários/sistemas | | **X** | |
| Definir modos de integração Gov.br e Cin | | | **X** |
| Certificar os formatos de identidade digital | | | **X** |
| Suportar LGPD e órgãos reguladores | | | **X** |
| Monitorar identidades | | | **X** |
| Apoiar infraestrutura blockchain aplicável | | | **X** |
| Definir modelo de cobrança a ser pago | | **X** | |

## 1.4 Domain Storytelling (DST) (4)

O DST descreve o fluxo de atividades no domínio, onde o cenário envolve diversas funcionalidades [3-5]. A representação gráfica (não incluída aqui, mas referenciada na fonte [6]) segue a lógica de:

1.  **Atores** (pessoa, grupo, software) que iniciam a atividade [5, 6].
2.  **Objetos de trabalho/informação** (documentos, mensagens) [5].
3.  **Atividades** descritas como flechas (ex: cria, edita, envia) entre o ator e o objeto [5, 6].

**Fluxo de Exemplo do Cenário "Não Sou Robô" (Baseado na representação do DST):**

1.  O Governo **Emite** uma Credencial Oficial para o Cidadão [6].
2.  O Cidadão **Cria** uma Identidade Descentralizada [6].
3.  O Cidadão **Solicita acesso** a um serviço digital da Empresa [6].
4.  O Cidadão **Envia** a Verificação Humanidade (via Identidade Descentralizada) para o Middleware Edge Anti-Bot [6].
5.  O Middleware **Encaminha pedido de verificação de Humanidade** para a Empresa [6].
6.  A Plataforma "Não Sou Robô" **Valida** o ZK-Proof na Blockchain, respondendo com um ZK-Proof [6].
7.  A Plataforma **Retorna** "Usuário verificado e Real" à Empresa (após o Middleware) [6].
8.  A Empresa **Permite acesso** ao Cidadão [6].
9.  A Plataforma **Envia Logs Anonimizados** ao Governo [6].


--------------------------------------------------------------------------------
2. Relatório: Arquitetura_Backend_e_BD.md

# 2. Arquitetura de Microserviços e Comunicação

Este relatório detalha o projeto da solução, incluindo a arquitetura de microserviços, o uso de banco de dados e o modelo de comunicação assíncrona exigido.

## 2.1 Projeto da Solução: Arquitetura

O sistema adota uma arquitetura de **Microserviços**, onde aplicativos cliente (Web e Mobile) se comunicam através de um **API Gateway** que roteia as requisições para os serviços independentes [7]. Cada microserviço deve possuir sua própria persistência de dados (DB) [7].

## 2.2 Microserviços (Lista de Serviços com Ações CRUD)

Os microserviços identificados, baseados nas funcionalidades de identidade, prova e revogação, são:

| Microserviço | Descrição Breve | Ações de Domínio/CRUD (Conceitual) |
| :--- | :--- | :--- |
| **1. Identity-Issuer Service** | Gerenciar a emissão e vinculação de identidades digitais descentralizadas (DIDs) a contas Gov.br/CIN [7]. | **Criação** (DID), **Leitura** (Status de vinculação), **Atualização** (Status), **Emissão** (Credencial Verificável - VC). |
| **2. Proof-Verification Service** | Validar provas criptográficas (Zero-Knowledge Proofs - ZK-Proofs) enviadas pelos usuários sem expor dados pessoais [7, 8]. | **Criação** (Solicitação de verificação), **Leitura** (Resultado da validação), **Validação** (Prova na Blockchain). |
| **3. Credential-Revocation Service** | Gerenciar a revogação de credenciais verificáveis (VCs) comprometidas ou expiradas [8]. | **Criação/Registro** (Revogação na Blockchain), **Leitura** (Status de revogação de uma VC). |
| **4. Edge-Middleware Gateway** | Filtrar, interceptar e autenticar tráfego no perímetro da rede, **bloqueando bots** antes do backend [8]. | **Leitura** (Monitorar tráfego), **Criação** (Registrar eventos anômalos). |

## 2.3 Comunicação Assíncrona via Eventos

A comunicação do sistema backend deve ser **COMUNICAÇÃO ASSÍNCRONA EVENTOS** [9]. Isso garante o desacoplamento e a resiliência dos microserviços.

**Eventos Chave no Domínio:**
| Evento (Exemplo) | Descrição |
| :--- | :--- |
| `IdentityLinked` | Evento emitido pelo *Identity-Issuer Service* quando um Cidadão vincula sua identidade Gov.br/CIN. |
| `VerificationRequested` | Evento emitido pelo *Edge-Middleware Gateway* ou Front-end quando uma Empresa solicita a verificação de humanidade. |
| `CredentialRevoked` | Evento emitido pelo *Credential-Revocation Service* notificando outros sistemas sobre uma VC comprometida. |

## 2.4 Uso de Banco de Dados (3)

O uso de Banco de Dados é um requisito [9]. Na arquitetura de Microserviços, é adotado o padrão "Database per Service", garantindo que cada serviço tenha sua própria persistência [7].

*   **Persistência Requerida:** Armazenamento de registros de DIDs, status de vinculação (Identity-Issuer Service), logs de validação ZK-Proof (Proof-Verification Service) e registros de revogação (Credential-Revocation Service).


--------------------------------------------------------------------------------
3. Relatório: Cenarios_e_Codigos_de_Teste.md

# 3. Cenários e Códigos de Testes (Unitários, Integração e UI)

A aplicação requer testes (Unitários, Integração e UI) para garantir a qualidade e a conformidade das funcionalidades [9]. Os cenários de teste são definidos a partir das funcionalidades do sistema, como validação e revogação de identidade [7, 10].

## 3.1 Cenários de Testes (5)

Os cenários são baseados na funcionalidade de validação e revogação, utilizando o formato Gherkin (Dado/E Que/Quando/Então).

### Cenário 1: Cidadão valida sua identidade no sistema "Não Sou Robô"

**Funcionalidade:** Validação e Revogação de Identidade no Sistema [10]

**Cenário de Teste de Integração (Validação ZK-Proof):**
*   **Dado Que** o Cidadão possui uma identidade Gov.br válida [10]
*   **E Que** o Cidadão já vinculou sua Wallet Digital ao sistema "Não Sou Robô" [10]
*   **Quando** O Cidadão solicita acesso a um serviço da Empresa [10]
*   **Então** O Sistema **valida a prova na Blockchain** [10]

### Cenário 2: Cidadão revoga uma credencial comprometida

**Cenário de Teste de Integração (Revogação):**
*   **Dado Que** o Cidadão possui credenciais verificáveis (VCs) ativas em sua Wallet [7]
*   **E Que** uma das credenciais foi comprometida ou utilizada de forma indevida [7]
*   **Quando** O Cidadão acessa sua Wallet Digital [7]
*   **E** Revoga a credencial suspeita [7]
*   **Então** O Sistema **atualiza o registro de revogação na Blockchain** [7]

## 3.2 Código de Testes (Conceitual)

Embora o código específico não esteja nas fontes, a necessidade de testes unitários e de integração é clara [9].

**Exemplo Conceitual (Teste Unitário - Credential-Revocation Service):**

```python
# cred_revocation_service/tests/test_unit.py

def test_registration_of_revoked_credential():
    """Verifica se a revogação de uma VC é registrada localmente e sinalizada para a Blockchain."""
    # Simulação de dados de uma credencial comprometida
    compromised_vc_id = "vc:12345-compromised"
    
    # Ação: Chamar a função de revogação no serviço
    success = revocation_service.request_revocation(compromised_vc_id)
    
    # Assert Unitário: Verificar se a função retornou sucesso e se o status local foi alterado
    assert success is True
    assert revocation_service.check_local_status(compromised_vc_id) == "PendingBlockchainUpdate"

Exemplo Conceitual (Teste UI - Front-end):

// ui_tests/citizen_flow.spec.js (Usando Cypress ou similar)

it('should display verification interface upon service request', () => {
    // Ação: Cidadão solicita acesso a um serviço
    cy.visit('/citizen/wallet')
    cy.get('#service-access-button').click() 
    
    // Assert UI: Verifica se a interface de "Verificação de Humanidade" é exibida
    cy.contains('h2', 'Verificação de Humanidade Requerida').should('be.visible')
    
    // Simula a interação com a Wallet
    cy.get('#send-proof-button').click()
    
    // Espera a confirmação do Edge-Middleware
    cy.contains('Acesso Liberado').should('be.visible')
})


---

## 4. Relatório: Deploy_e_CI_CD.md

```markdown
# 4. Deploy e Pipeline de Integração Contínua/Entrega Contínua (CI/CD)

Este relatório aborda os requisitos de infraestrutura e automação, incluindo o deploy via Docker e a estrutura do Pipeline CI/CD [9].

## 4.1 Deploy via Docker (4)

O deployment de cada microserviço deve ser encapsulado em containers usando **Docker** [9] para garantir portabilidade e ambiente padronizado.

**Exemplo de Dockerfile (Proof-Verification Service):**

```dockerfile
# Dockerfile para o Proof-Verification Service
# Assume-se o uso de uma linguagem como Java ou Python
FROM openjdk:17-jdk-slim 
# ou FROM python:3.10-slim

WORKDIR /usr/src/app

# Copia os arquivos de dependência e aplicação
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt # Se Python
# ou COPY target/proof-verification-service.jar /usr/src/app/app.jar # Se Java

# Configura a porta que o serviço estará exposto internamente
EXPOSE 8082 

# Comando de execução do serviço
CMD ["python", "app.py"] 
# ou ENTRYPOINT ["java", "-jar", "app.jar"] 

4.2 Pipeline CI/CD no GitHub (9)
O pipeline de CI/CD é necessário para a integração contínua e entrega contínua. A estrutura abaixo utiliza o GitHub Actions como exemplo para automatizar o processo de construção, teste e deployment via Docker.
Arquivo Conceitual: .github/workflows/main_pipeline.yml

name: Plataforma Nao Sou Robo CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

env:
  DOCKER_REGISTRY: myregistry.io 
  SERVICE_NAME: identity-issuer-service 
  
jobs:
  # Job de Integração Contínua (CI)
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Código
      uses: actions/checkout@v3

    # 1. Configurar Ambiente
    - name: Configurar Java ou Python (Exemplo)
      uses: actions/setup-java@v3 
      with:
        java-version: '17'
        distribution: 'temurin'

    # 2. Executar Testes Unitários e de Integração (Requisito: Testes)
    - name: Executar Testes de Unidade e Integração
      run: |
        # Comando para rodar testes (Exemplo Maven)
        mvn test
        
    # 3. Construir Imagem Docker (Requisito: Deploy via Docker)
    - name: Construir Imagem Docker
      run: docker build -t ${{ env.DOCKER_REGISTRY }}/${{ env.SERVICE_NAME }}:${{ github.sha }} .

    # 4. Login no Registro (CD)
    - name: Login no Docker Registry
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
        
    # 5. Push da Imagem para o Registro
    - name: Push da Imagem
      run: docker push ${{ env.DOCKER_REGISTRY }}/${{ env.SERVICE_NAME }}:${{ github.sha }}
      
    # 6. Deploy (Continuação do CD)
    # Etapa que acionaria o deploy no ambiente de staging/produção (via Kubernetes ou similar)
    - name: Deploy no Ambiente
      # Usar ferramenta de deployment (ex: kubectl, Terraform, custom script)
      run: echo "Iniciando deployment do ${{ env.SERVICE_NAME }}"

