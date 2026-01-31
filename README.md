# SERHChat FileSearch API

Integração robusta com Google Gemini FileSearch API para gerenciamento e busca em arquivos.

## ✨ Características

- ✅ **API Express.js** completa com 8 endpoints
- ✅ **Google Gemini FileSearch** integrado
- ✅ **Persistência em JSON** (simples e eficiente)
- ✅ **Detecção de duplicatas** via SHA256
- ✅ **Rate limiting** contra abuso
- ✅ **Timeout e retry** em operações longas
- ✅ **Limpeza automática** de arquivos temporários
- ✅ **Logs estruturados** com timestamps
- ✅ **Graceful shutdown** com tratamento de sinais
- ✅ **Error handling** robusto em toda aplicação

## 📋 Requisitos

- **Node.js** 18+
- **Google API Key** (Gemini API)

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/serh-chat.git
cd serh-chat

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com sua Google API Key
```

## ⚙️ Configuração

### `.env`

```env
GOOGLE_API_KEY=your-google-api-key-here
PORT=3000
NODE_ENV=development
```

## 🏃 Execução

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

Servidor rodará em `http://localhost:3000`

## 📚 API Endpoints

### 1. Health Check
```http
GET /
```
Verifica se a API está respondendo e se há uma store configurada.

**Response:**
```json
{
  "status": "ok",
  "configured": true,
  "timestamp": "2026-01-30T10:30:00.000Z"
}
```

### 2. Criar Store
```http
POST /stores
Content-Type: application/json

{
  "displayName": "SERHChat-Analytics"
}
```

**Response:**
```json
{
  "success": true,
  "storeId": "fileSearchStores/serhchat-analytics-xyz123",
  "displayName": "SERHChat-Analytics"
}
```

### 3. Listar Stores
```http
GET /stores
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "stores": [
    {
      "name": "fileSearchStores/store1-xyz",
      "displayName": "Store 1",
      "createTime": "2026-01-30T10:00:00Z",
      "activeDocumentsCount": 5
    }
  ]
}
```

### 4. Configurar Store Ativa
```http
POST /config
Content-Type: application/json

{
  "storeId": "fileSearchStores/serhchat-analytics-xyz123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Store configured successfully",
  "storeId": "fileSearchStores/serhchat-analytics-xyz123"
}
```

### 5. Fazer Upload de Arquivos
```http
POST /upload
Content-Type: multipart/form-data

[arquivo1.pdf]
[arquivo2.txt]
[arquivo3.docx]
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total": 3,
    "success": 2,
    "skipped": 0,
    "failed": 1
  },
  "results": [
    {
      "filename": "documento.pdf",
      "status": "success",
      "size": 524288,
      "hash": "a1b2c3d4"
    },
    {
      "filename": "relatorio.txt",
      "status": "success",
      "size": 12345,
      "hash": "e5f6g7h8"
    }
  ]
}
```

### 6. Listar Documentos
```http
GET /documents
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "documents": [
    {
      "id": "fileSearchStores/xyz/documents/doc1",
      "displayName": "documento.pdf",
      "state": "STATE_ACTIVE",
      "createTime": "2026-01-30T10:30:00Z"
    }
  ]
}
```

### 7. Deletar Documento
```http
DELETE /documents/doc-id-here
```

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### 8. Deletar Store
```http
DELETE /stores/fileSearchStores/store-id-here?force=true
```

**Response:**
```json
{
  "success": true,
  "message": "Store deleted successfully"
}
```

## 🔒 Rate Limiting

- **Limite**: 100 requisições por minuto por IP
- **Comportamento**: Retorna `429 Too Many Requests` ao exceder

## ⏱️ Timeouts

- **Upload para Google**: 5 minutos
- **Poll de operações**: 2 segundos
- **Limpeza de temp files**: A cada 30 minutos

## 📦 Estrutura de Dados

### `data.json`
```json
{
  "activeStore": "fileSearchStores/store-id",
  "uploads": {
    "hash-sha256-do-arquivo": "nome-arquivo.pdf",
    "outro-hash-sha256": "outro-arquivo.txt"
  }
}
```

## 🧹 Limpeza Automática

- Arquivos temporários com mais de **1 hora** são deletados
- Limpeza acontece a cada **30 minutos**
- Entradas de rate limit expiradas são removidas automaticamente

## 📊 Logs

Todos os eventos são logados com:
- **Timestamp** ISO-8601
- **Nível** (ℹ️ info, ✅ success, ❌ error, ⚠️ warn)
- **Contexto** relevante em JSON

Exemplo:
```
[2026-01-30T10:30:45.123Z] ✅ File uploaded to Google FileSearch { filename: 'doc.pdf' }
```

## 🛡️ Tratamento de Erros

### Duplicatas Detectadas
Arquivos com mesmo conteúdo (SHA256) são pulados:
```json
{
  "filename": "documento.pdf",
  "status": "skipped",
  "duplicate": "documento-original.pdf"
}
```

### Timeouts em Operações
Se upload demorar mais de 5 minutos, retorna erro:
```json
{
  "filename": "arquivo-grande.pdf",
  "status": "error",
  "error": "Operation timeout after 301s"
}
```

### Validação de Entrada
```json
{
  "success": false,
  "error": "displayName is required"
}
```

## 🚀 Hospedagem

### Railway (Recomendado)
```bash
# 1. Push para GitHub
git push origin main

# 2. Conecte Railway em railway.app
# 3. Configure variáveis de ambiente:
# - GOOGLE_API_KEY

# 4. Deploy automático via Railway CLI:
railway up
```

### Outras opções
- **Render.com** - 7-25$/mês
- **Fly.io** - 5-20$/mês
- **Self-hosted** - VPS próprio

## 📝 Exemplo de Uso (cURL)

```bash
# 1. Criar store
STORE=$(curl -X POST http://localhost:3000/stores \
  -H "Content-Type: application/json" \
  -d '{"displayName":"MeuStore"}' | jq -r '.storeId')

# 2. Configurar como ativa
curl -X POST http://localhost:3000/config \
  -H "Content-Type: application/json" \
  -d "{\"storeId\":\"$STORE\"}"

# 3. Upload de arquivo
curl -F "file=@documento.pdf" http://localhost:3000/upload

# 4. Listar documentos
curl http://localhost:3000/documents | jq
```

## 🧪 Testes

Execute o script PowerShell de teste:
```powershell
.\test-api.ps1
```

Valida:
- ✅ Health check
- ✅ Criação de stores
- ✅ Configuração de store ativa
- ✅ Upload de arquivos
- ✅ Listagem de documentos
- ✅ Detecção de duplicatas

## 🔧 Troubleshooting

### Erro: "listen EADDRINUSE"
Outra aplicação está usando porta 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Erro: "GOOGLE_API_KEY not found"
Verifique se `.env` existe e contém a chave:
```bash
cat .env
```

### Erro: "Operation timeout"
Arquivo muito grande ou rede lenta. Aumente timeout em `main.js`:
```javascript
const OPERATION_TIMEOUT = 600000; // 10 minutos
```

## 📦 Dependências

```json
{
  "@google/genai": "^1.0.0",    // Google Gemini API
  "busboy": "^1.6.0",           // Multipart form parser
  "dotenv": "^16.0.3",          // Variáveis de ambiente
  "express": "^4.18.2"          // Web framework
}
```

## 📄 Licença

MIT - Veja [LICENSE](LICENSE)

## 👨‍💻 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📞 Suporte

Issues? Abra uma [issue no GitHub](https://github.com/seu-usuario/serh-chat/issues)

---

**Desenvolvido com ❤️ para SERH**
