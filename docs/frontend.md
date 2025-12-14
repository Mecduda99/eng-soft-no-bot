A documentação técnica do Front-end deve refletir a complexidade da solução de identidade descentralizada, garantindo que a interface seja simples e funcional para os três tipos de usuários (Cidadão, Empresa e Governo).

O front-end é um requisito fundamental da solução e servirá como a camada de apresentação que interage com o **API Gateway** e, consequentemente, com os Microserviços de backend definidos (Identity-Issuer, Proof-Verification, Credential-Revocation).

---

# Documento Técnico de Front-end: Interface "Não Sou Robô"

## 1. Requisitos Tecnológicos e Arquitetura

O Front-end será construído utilizando as seguintes especificações:

| Requisito | Detalhamento | Notas Técnicas |
| :--- | :--- | :--- |
| **Frameworks** | **React com Vue.js** | Dado o requisito de utilizar ambos, sugere-se a adoção de **React** como framework principal para o shell da aplicação (SPA - Single Page Application) e a implementação de componentes específicos ou módulos da interface (como o painel de Gerenciamento de Credenciais ou o dashboard de Monitoramento) utilizando o **Vue.js** através de uma arquitetura de Micro-Frontends. |
| **Integração Backend** | API Gateway (Node.js) | A comunicação deve ser realizada via chamadas RESTful (ou GraphQL, se implementado) através do **API Gateway**, que atua como ponto de entrada para os Microserviços de Identidade, Prova e Revogação. |
| **Estética e Cores** | Simples, Bonita e Precisa | **Preto** e **Verde** como cores principais, com **Branco** para a fonte. |

## 2. Diretrizes de Design e Estética (Black & Green)

A interface deve ser simples, precisa e seguir a paleta de cores definida, que remete à segurança, seriedade e tecnologia:

| Elemento | Cor | Uso Sugerido |
| :--- | :--- | :--- |
| **Fundo Principal** | Preto (#000000) | Proporciona contraste máximo e uma sensação de segurança e modernidade. |
| **Fonte Principal** | Branco (#FFFFFF) | Garante legibilidade em contraste com o fundo preto. |
| **Cor de Acento/Ação** | Verde (Ex: #00FF00) | Utilizado para botões de ação (ex: "Validar Prova", "Emitir Credencial"), indicadores de status (ex: "Verificado", "Ativo") e elementos interativos. |
| **Tipografia** | Fonte limpa (sem serifa) e moderna, favorecendo a precisão e a legibilidade. |

## 3. Exposição e Integração dos Serviços

O Front-end deve exibir interfaces dedicadas que refletem as funcionalidades cruciais da plataforma e garantem a integração com os microserviços de backend. A interface deve ser adaptada para os diferentes usuários: Cidadão, Empresa e Governo.

### 3.1 Interface do Cidadão (Pessoa Física)

Esta interface deve se integrar primariamente ao **Identity-Issuer Service** e ao **Credential-Revocation Service**.

| Funcionalidade Exposta | Serviço Integrado | Chamadas REST (Exemplo) |
| :--- | :--- | :--- |
| **Vinculação de Identidade** | Identity-Issuer Service | `PUT /identities/:did/link` (Atualiza o status de vinculação Gov.br/CIN). |
| **Gerenciamento de Credenciais** | Identity-Issuer Service | `POST /credentials/:did/issue` (Para emitir uma nova VC). |
| **Revogação de Credenciais** | Credential-Revocation Service | `POST /revocations` (Para registrar uma VC comprometida). |
| **Autenticação Rápida** | Proof-Verification Service | Interface para iniciar o processo de **provas de humanidade para serviços online com privacidade**. |

### 3.2 Interface da Empresa

Esta interface é o ponto de interação para consumo do serviço principal, visando validar usuários e bloquear ameaças. Integra-se primariamente ao **Proof-Verification Service** e ao **Edge-Middleware Gateway**.

| Funcionalidade Exposta | Serviço Integrado | Ação |
| :--- | :--- | :--- |
| **Solicitação de Verificação** | Proof-Verification Service | Permite solicitar a **validação de pessoa real** e **confirmar identidade segura**. |
| **Monitoramento de Acessos** | Edge-Middleware Gateway | Exibição de logs e métricas de tráfego, evidenciando ações de **bloquear bots e tráfegos indevidos de rede** e **monitorar eventos anômalos**. |
| **Gerenciamento de Integração**| Diversos Microserviços | Configuração para **estabelecer proteção automatizada para formulários/sistemas**. |

### 3.3 Interface do Governo

Esta interface foca em gestão e monitoramento, integrando-se principalmente ao **Credential-Revocation Service** e permitindo o **Apoio à infraestrutura Blockchain aplicável**.

| Funcionalidade Exposta | Serviço Integrado | Ação |
| :--- | :--- | :--- |
| **Definição de Padrões** | N/A (Função de Admin) | Interface para **definir modos de integração Gov.br e CIN** e **certificar os formatos de identidade digital**. |
| **Monitoramento Centralizado** | Identity-Issuer / Revocation | Painel para **monitorar identidades** e garantir a conformidade (ex: **Suportar LGPD e órgãos reguladores**). |

## 4. Estrutura Conceitual do Componente de Validação (React + Vue.js)

Para exemplificar a integração e o design:

O módulo de "Solicitação de Acesso" na tela da Empresa, que aciona a validação do ZK-Proof no backend (Proof-Verification Service), poderia ser implementado da seguinte forma, aderindo à estética:

```jsx
// Main Application Shell (React)

const App = () => {
    // Componente React principal renderiza o container para o Micro-Frontend em Vue.js
    return (
        <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh' }}>
            <h1 style={{ color: '#00FF00' }}>Plataforma Anti-Fraude Blockchain</h1>
            
            {/* O componente de Verificação é injetado aqui via Micro-Frontend */}
            <VerificationMicroFrontend /> 
        </div>
    );
}

// Micro-Frontend (Vue.js Component - Exemplo de estilo)

<template>
  <div class="verification-box">
    <p>Status: Aguardando Prova de Humanidade...</p>
    <button @click="sendProof" style="background-color: #00FF00; color: #000000; border: none; padding: 10px 20px; cursor: pointer;">
      Enviar Prova Segura (ZK-Proof)
    </button>
  </div>
</template>

<style scoped>
.verification-box {
  border: 1px solid #00FF00; /* Borda Verde */
  padding: 20px;
  background-color: #1a1a1a; /* Preto levemente acinzentado para destaque */
  color: #FFFFFF;
}
</style>
```