# 🚀 SERH Chat - FileSearch API (JavaScript)

API simples com Google GenAI SDK em JavaScript para gerenciamento de documentos com FileSearch.

## 📋 Funcionalidades

- ✅ Criar FileSearch Stores
- ✅ Upload de múltiplos arquivos
- ✅ Consultar documentos com FileSearch
- ✅ Gerenciamento de stores

## 🛠️ Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure sua API Key
# Edite .env e adicione:
GOOGLE_API_KEY=sua_chave_aqui

# 3. Rode o projeto
npm start
```

## 📝 Exemplo de Uso

```javascript
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Criar um store
const store = await ai.fileSearchStores.create({
  config: { displayName: 'Meu Store' }
});

// Fazer upload
let operation = await ai.fileSearchStores.uploadToFileSearchStore({
  file: 'documento.pdf',
  fileSearchStoreName: store.name,
  config: { displayName: 'documento.pdf' }
});

// Aguardar conclusão
while (!operation.done) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  operation = await ai.operations.get({ operation });
}

// Consultar
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: "Resuma os documentos",
  config: {
    tools: [{
      fileSearch: {
        fileSearchStoreNames: [store.name]
      }
    }]
  }
});

console.log(response.text);
```

## 🔑 Obter API Key

1. Acesse: https://aistudio.google.com/apikey
2. Clique em "Create API Key"
3. Copie e adicione no `.env`

## 📦 Estrutura

```
SERH_CHAT/
├── main.js          # Script principal
├── package.json     # Dependências
├── .env             # Configuração
└── README.md        # Este arquivo
```

## 🆘 Documentação

- [Google GenAI SDK](https://github.com/google/generative-ai-js)
- [FileSearch API](https://ai.google.dev/gemini-api/docs/file-search)
