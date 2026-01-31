# 🚀 DEPLOY NO RAILWAY

## Pré-requisitos

1. **Conta GitHub** com seu repositório
2. **Conta Railway.app** (railway.app)
3. **Seu código no GitHub**

---

## ✅ PASSO 1: Preparar Repositório Local

```bash
# Inicialize git (se não tiver)
git init
git add .
git commit -m "Initial commit: SERHChat FileSearch API"

# Crie repositório no GitHub e faça push
git remote add origin https://github.com/seu-usuario/serh-chat.git
git branch -M main
git push -u origin main
```

**Seu `.gitignore` já está pronto! ✅**

---

## ✅ PASSO 2: Criar Conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **"Sign Up"**
3. Autentique com GitHub (mais fácil)
4. Confirme email

---

## ✅ PASSO 3: Conectar Repositório

### Opção A: Via Web Dashboard (Mais Fácil)

1. No Railway, clique em **"+ New Project"**
2. Selecione **"Deploy from GitHub"**
3. Clique em **"Configure GitHub App"**
4. Autorize Railway a acessar seus repositórios
5. Selecione seu repositório `serh-chat`
6. Railway detectará Node.js automaticamente ✅

### Opção B: Via Railway CLI

```bash
# Instale Railway CLI
npm install -g @railway/cli

# Faça login
railway login

# No diretório do projeto
railway init

# Depois:
railway up
```

---

## ✅ PASSO 4: Configurar Variáveis de Ambiente

No Dashboard do Railway:

1. Vá para seu projeto **"serh-chat"**
2. Clique na aba **"Variables"**
3. Adicione:

```
GOOGLE_API_KEY=sua-chave-google-aqui
NODE_ENV=production
PORT=5000
```

**Obter Google API Key:**
- Acesse https://aistudio.google.com/apikey
- Copie a chave
- Cole em `GOOGLE_API_KEY`

---

## ✅ PASSO 5: Deploy Automático

1. Railway detectará `package.json` ✅
2. Executa `npm install` automaticamente
3. Executa `npm start` para iniciar servidor

**Seu `package.json` já tem:**
```json
{
  "scripts": {
    "start": "node main.js"
  }
}
```

✅ Tudo pronto!

---

## 🎉 SUCESSO!

Após alguns minutos, você verá:
- ✅ Build completo
- ✅ Servidor rodando
- ✅ URL pública (ex: `https://serh-chat-prod.up.railway.app`)

**A URL será exibida em Railway Dashboard!**

---

## 📝 Testar API em Produção

```bash
# Health check
curl https://serh-chat-prod.up.railway.app/

# Criar store
curl -X POST https://serh-chat-prod.up.railway.app/stores \
  -H "Content-Type: application/json" \
  -d '{"displayName":"SERHChat-Prod"}'
```

---

## 🔄 Deploy Contínuo (CI/CD)

**Railway faz automaticamente:**

1. Você faz `git push origin main`
2. GitHub notifica Railway
3. Railway reconstrói e redeploy
4. Novo código em produção em ~2 min ✅

Sem fazer nada extra!

---

## 📊 Monitorar em Produção

No Railway Dashboard:

- **Logs** - Ver o que está acontecendo
- **Metrics** - CPU, memória, requisições
- **Deployments** - Histórico de deploys

Exemplo de log esperado:
```
[2026-01-31T10:30:45.123Z] ✅ Data loaded { activeStore: null, uploadCount: 0 }
[2026-01-31T10:30:45.150Z] ✅ FileSearch API running on port 5000
```

---

## 🛑 Se Algo Dermos Errado

### Build falha?
**Vá em Railway → Logs → Builder Logs**
- Procure por mensagens vermelhas
- Verifique se todas as dependências estão em `package.json`

### Aplicação não inicia?
**Vá em Railway → Logs → Deploy Logs**
- Procure por erros Node.js
- Verifique variáveis de ambiente
- Teste localmente: `npm start`

### Timeout ao fazer upload?
- Railway padrão tem timeout de **30s**
- Você tem timeout de **5 minutos** na API
- Aumente RAM em Railway (Railway → Settings → Compute)

---

## 💰 Custos Railway

- **Grátis**: $5/mês crédito (test)
- **Usado**: ~$5-15/mês para esta API
- Você só paga pelo que usar

---

## 🔐 Segurança

**Google API Key em Produção:**
- ✅ Salva em Railway Variables (encriptada)
- ✅ Nunca exposta em código
- ❌ NUNCA commit `.env` no Git

Seu `.gitignore` bloqueia automaticamente ✅

---

## 📱 Para Frontend React

Configure seu `.env` do React:

```env
REACT_APP_API_URL=https://serh-chat-prod.up.railway.app
```

Depois faça requests:
```javascript
const response = await fetch(`${process.env.REACT_APP_API_URL}/stores`);
```

---

## 🚀 Exemplo Completo de Deploy

```bash
# 1. Confirme mudanças localmente
npm start
# Teste a API...

# 2. Faça commit
git add .
git commit -m "Ready for production"

# 3. Push para GitHub
git push origin main

# 4. Vá em Railway Dashboard
# Verá deploy automático acontecendo...

# 5. Após ~5 minutos, API está ao vivo!
# Teste em produção:
curl https://seu-dominio.up.railway.app/
```

---

## 📚 Referências

- Railway Docs: https://docs.railway.app
- Node.js no Railway: https://docs.railway.app/guides/nodejs
- Google Gemini API: https://aistudio.google.com

---

**Sua API está pronta para produção!** 🎊
