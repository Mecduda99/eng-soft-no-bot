# Deploy Docker - Frontend "Não Sou Robô"

## 🐳 Imagem Publicada

**Usuario/Imagem:** `dudac/nao-sou-robo-frontend:latest`

## 🚀 Execução

```bash
# Executar container
docker run -d -p 8080:80 --name nao-sou-robo-app dudac/nao-sou-robo-frontend:latest

# Acessar aplicação
http://localhost:8080
```

## 📦 Build Local

```bash
# Build da imagem
docker build -t dudac/nao-sou-robo-frontend:latest .

# Push para registry (opcional)
docker push dudac/nao-sou-robo-frontend:latest
```

## 🔧 Configuração

- **Porta:** 80 (container) → 8080 (host)
- **Nginx:** Servidor web otimizado
- **Proxy API:** `/api` → `http://host.docker.internal:3000`
- **SPA:** React Router configurado

## ✅ Status

Container rodando em: **http://localhost:8080**
- Interface Cidadão: http://localhost:8080/citizen
- Interface Empresa: http://localhost:8080/company  
- Interface Governo: http://localhost:8080/government