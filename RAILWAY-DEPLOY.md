# 🚂 DEPLOY NO RAILWAY - PASSO A PASSO

## ✅ PASSO 1: Criar Conta no Railway

1. Acesse: **https://railway.app**
2. Clique em **"Login"** (canto superior direito)
3. Escolha **"Login with GitHub"** (mais fácil)
4. Autorize Railway a acessar sua conta GitHub
5. Confirme seu email se solicitado

✅ **Conta criada!**

---

## ✅ PASSO 2: Criar Novo Projeto

1. No Railway Dashboard, clique em **"+ New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Você verá uma lista dos seus repositórios

**Se não aparecer seu repositório:**
- Clique em **"Configure GitHub App"**
- Autorize Railway nos repositórios
- Selecione **"All repositories"** ou escolha `serh-chat`
- Clique em **"Save"**

4. Agora selecione o repositório **`serh-chat`**
5. Railway detectará automaticamente que é Node.js ✅

---

## ✅ PASSO 3: Railway Detecta Automaticamente

Railway vai detectar:
- ✅ **Node.js** (via `package.json`)
- ✅ **Start command**: `npm start` (via `package.json` scripts)
- ✅ **Build command**: `npm install`

**Você não precisa configurar nada disso!** 🎉

---

## ✅ PASSO 4: Configurar Variáveis de Ambiente

### 🔑 Adicionar GOOGLE_API_KEY

1. No Railway, clique no seu serviço **"serh-chat"**
2. Vá na aba **"Variables"** (ícone de tag 🏷️)
3. Clique em **"+ New Variable"**
4. Adicione:

```
Variable Name: GOOGLE_API_KEY
Value: [COLE SUA CHAVE AQUI]
```

5. Clique em **"Add"**

### 🎯 Variáveis Adicionais (Opcionais)

Adicione também:

```
NODE_ENV=production
```

**NÃO precisa adicionar PORT** - Railway define automaticamente!

---

## ✅ PASSO 5: Deploy Automático

Após adicionar as variáveis:
1. Railway começará o deploy automaticamente
2. Você verá em tempo real:
   - 📦 **Building...** (instalando dependências)
   - 🚀 **Deploying...** (iniciando servidor)
   - ✅ **Live** (no ar!)

**Tempo estimado: 2-5 minutos**

---

## ✅ PASSO 6: Obter URL Pública

1. No Railway Dashboard, clique no seu serviço
2. Vá na aba **"Settings"** (⚙️)
3. Role até **"Domains"**
4. Clique em **"Generate Domain"**
5. Railway criará algo como: `serh-chat-production.up.railway.app`

✅ **Seu domínio público está pronto!**

---

## 🧪 PASSO 7: Testar em Produção

```powershell
# Health Check
$url = "https://serh-chat-production.up.railway.app"
Invoke-RestMethod "$url/" | ConvertTo-Json

# Listar stores
Invoke-RestMethod "$url/stores" | ConvertTo-Json

# Criar store
$body = @{ displayName = "SERHChat-Prod" } | ConvertTo-Json
Invoke-RestMethod "$url/stores" -Method Post -Body $body -ContentType "application/json"
```

---

## 📊 PASSO 8: Monitorar Aplicação

No Railway Dashboard você tem:

### **Logs** (📄)
- Veja logs em tempo real
- Filtre por erro/warning/info
- Exemplo: `[2026-01-31T10:30:00.000Z] ✅ Data loaded`

### **Metrics** (📈)
- CPU usage
- Memory usage
- Network usage

### **Deployments** (🚀)
- Histórico de deploys
- Rollback para versão anterior se necessário

---

## 🔄 Deploy Contínuo (CI/CD)

**Configurado automaticamente! 🎉**

Sempre que você fizer:
```bash
git push origin main
```

Railway irá:
1. Detectar mudanças no GitHub
2. Fazer rebuild automaticamente
3. Redeploy sem downtime
4. Novo código em produção em ~2-3 min

---

## ⚙️ Configurações Avançadas (Opcional)

### Aumentar Recursos

Se precisar de mais performance:
1. Vá em **Settings** → **Resources**
2. Aumente RAM ou CPU conforme necessário
3. Railway cobra por uso (~$5-20/mês)

### Custom Domain

Quer usar seu próprio domínio?
1. Vá em **Settings** → **Domains**
2. Clique em **"Custom Domain"**
3. Adicione: `api.seudominio.com`
4. Configure CNAME no seu DNS

---

## 🐛 Troubleshooting

### Build Falha?

**Ver logs:**
1. Clique no deploy que falhou
2. Veja **"Build Logs"**
3. Procure por linhas vermelhas/erro

**Erros comuns:**
- `MODULE_NOT_FOUND` → Adicione dependência em `package.json`
- `GOOGLE_API_KEY not defined` → Configure variável

### App Não Inicia?

**Ver logs:**
1. Vá em **Deployments** → Deploy atual
2. Clique em **"View Logs"**
3. Procure por erro no startup

**Teste localmente primeiro:**
```bash
npm start
```

Se funcionar local mas falhar no Railway, compare variáveis de ambiente.

### Timeout ao fazer Upload?

Railway tem timeout padrão de **30 segundos** para requests.

Para arquivos grandes:
1. Vá em **Settings**
2. Procure **"Healthcheck Timeout"**
3. Aumente para `300` (5 minutos)

---

## 💰 Custos Railway

### Plano Hobby (Recomendado)
- **$5/mês** crédito grátis
- Paga apenas o que usar
- Estimativa para sua API: **$5-15/mês**

### O que afeta o custo:
- CPU usage (seu app é leve ✅)
- Memory usage (JSON storage é eficiente ✅)
- Network egress (uploads grandes aumentam custo)

**Monitorar custos:**
- Railway → Billing → Usage

---

## 🎉 CHECKLIST FINAL

Antes de considerar completo:

- [ ] Build passou com sucesso? ✅
- [ ] Servidor está "Live"? ✅
- [ ] `GOOGLE_API_KEY` configurada? ✅
- [ ] URL pública funcionando? ✅
- [ ] Health check retorna `{"status":"ok"}`? ✅
- [ ] Consegue criar store? ✅
- [ ] Upload funciona? ✅

---

## 📞 Suporte Railway

Se precisar de ajuda:
- **Docs:** https://docs.railway.app
- **Discord:** https://discord.gg/railway
- **Status:** https://railway.statuspage.io

---

## 🚀 RESUMO RÁPIDO

```bash
1. Acesse https://railway.app
2. Login with GitHub
3. New Project → Deploy from GitHub repo
4. Selecione "serh-chat"
5. Variables → Add GOOGLE_API_KEY
6. Aguarde deploy (~3 min)
7. Settings → Generate Domain
8. Teste a URL pública
9. 🎉 No ar!
```

---

## 🔗 Links Úteis

- **Railway Dashboard:** https://railway.app/dashboard
- **Seu Projeto:** https://railway.app/project/[seu-id]
- **Documentação Railway:** https://docs.railway.app/guides/nodejs
- **Google API Key:** https://aistudio.google.com/apikey

---

**Pronto para deploy? Bora lá! 🚀**
