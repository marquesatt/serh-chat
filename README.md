Endpoints

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

### 6.1 Conversar com documentos já enviados (File Search)
```http
POST /chat
Content-Type: application/json

{
  "prompt": "Resuma os pontos principais dos documentos enviados",
  "metadataFilter": "author=Robert Graves" // opcional
}
```

**Response:**
```json
{
  "success": true,
  "model": "gemini-3-flash-preview",
  "storeId": "fileSearchStores/serhchat-analytics-xyz123",
  "answer": "...",
  "grounding": { "citations": "..." }
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

### 9. Listar Arquivos (Files API)
```http
GET /files
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "files": [
    {
      "name": "files/abc-123",
      "displayName": "relatorio.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": "524288",
      "createTime": "2026-01-31T10:30:00Z",
      "updateTime": "2026-01-31T10:30:00Z",
      "expirationTime": "2026-02-02T10:30:00Z",
      "state": "ACTIVE",
      "sha256Hash": "..."
    }
  ]
}
```

### 10. Metadata de Arquivo (Files API)
```http
GET /files/:fileId
```

**Response:**
```json
{
  "success": true,
  "file": {
    "name": "files/abc-123",
    "displayName": "relatorio.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": "524288",
    "createTime": "2026-01-31T10:30:00Z",
    "updateTime": "2026-01-31T10:30:00Z",
    "expirationTime": "2026-02-02T10:30:00Z",
    "state": "ACTIVE",
    "sha256Hash": "...",
    "uri": "..."
  }
}
```

### 11. Conversar com Arquivos (Files API)
```http
POST /files/chat
Content-Type: application/json

{
  "fileId": "files/abc-123",
  "prompt": "Resuma este documento em 5 bullets."
}
```

Ou múltiplos arquivos:
```json
{
  "fileIds": ["files/abc-123", "files/def-456"],
  "prompt": "Compare os dois documentos em uma tabela."
}
```

**Response:**
```json
{
  "success": true,
  "model": "gemini-3-flash-preview",
  "files": ["files/abc-123"],
  "answer": "..."
}
```
