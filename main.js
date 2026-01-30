import express from 'express';
import Busboy from 'busboy';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const db = new Low(new JSONFile('hashes.json'), { hashes: [] });

async function ensureDb() {
  await db.read();
  db.data ||= { hashes: [] };
}

function calculateSHA256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function waitForOperation(operation) {
  if (!operation || !operation.name) {
    return;
  }
  let current = operation;
  while (current && current.name && !current.done) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const next = await ai.operations.get({ operation: current });
    if (!next) {
      break;
    }
    current = next;
  }
}

// GET /
app.get('/', (req, res) => {
  const storeId = process.env.STORE_ID;
  res.json({
    status: 'ok',
    message: 'API FileSearch pronta',
    storeId: storeId || 'não configurado',
    endpoints: ['GET /', 'POST /upload (multipart/form-data)', 'GET /documents']
  });
});

// POST /upload - upload multipart com detecção de duplicatas
app.post('/upload', async (req, res) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return res.status(400).json({
      success: false,
      message: 'Envie multipart/form-data com campo files'
    });
  }

  try {
    const files = await new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: { files: 10, fileSize: 100 * 1024 * 1024 }
      });

      const collected = [];

      busboy.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        const chunks = [];
        let truncated = false;

        file.on('data', data => chunks.push(data));
        file.on('limit', () => { truncated = true; });
        file.on('end', () => {
          collected.push({
            filename,
            mimeType,
            buffer: Buffer.concat(chunks),
            truncated
          });
        });
      });

      busboy.on('error', reject);
      busboy.on('finish', () => resolve(collected));

      req.pipe(busboy);
    });

    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo recebido'
      });
    }

    let storeId = process.env.STORE_ID;
    const results = [];
    await ensureDb();

    if (!storeId) {
      const fileSearchStore = await ai.fileSearchStores.create({
        config: { displayName: 'SERH-Chat-Store' }
      });
      storeId = fileSearchStore.name;
      process.env.STORE_ID = storeId;
      console.log('Store criado:', storeId);
    }

    const tmpDir = path.join(os.tmpdir(), 'serh-chat-uploads');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    for (const file of files) {
      if (file.truncated) {
        results.push({
          filename: file.filename,
          status: 'error',
          message: 'Arquivo excede 100MB'
        });
        continue;
      }

      const fileHash = calculateSHA256(file.buffer);

      const existing = db.data.hashes.find(item => item.hash === fileHash);

      if (existing) {
        results.push({
          filename: file.filename,
          status: 'skipped',
          message: 'Arquivo duplicado detectado',
          duplicateOf: existing.filename,
          hash: fileHash
        });
        continue;
      }

      const displayName = file.filename;
      const mimeType = file.mimeType || 'application/octet-stream';
      const safeName = displayName.replace(/[\\/:*?"<>|]/g, '_');
      const tempFilePath = path.join(tmpDir, `${Date.now()}-${safeName}`);

      try {
        fs.writeFileSync(tempFilePath, file.buffer);

        const uploadResponse = await ai.fileSearchStores.uploadToFileSearchStore({
          file: tempFilePath,
          fileSearchStoreName: storeId,
          config: {
            displayName: displayName,
            mimeType: mimeType
          }
        });

        await waitForOperation(uploadResponse);

        db.data.hashes.push({
          hash: fileHash,
          filename: file.filename,
          createdAt: new Date().toISOString()
        });
        await db.write();

        results.push({
          filename: file.filename,
          displayName: displayName,
          mimeType: mimeType,
          sizeBytes: file.buffer.length,
          status: 'success',
          message: 'Upload realizado com sucesso',
          hash: fileHash
        });
      } catch (error) {
        results.push({
          filename: file.filename,
          displayName: displayName,
          mimeType: mimeType,
          sizeBytes: file.buffer.length,
          status: 'error',
          message: error.message,
          hash: fileHash
        });
      } finally {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    }

    res.json({
      success: true,
      storeId: storeId,
      totalFiles: files.length,
      results,
      summary: {
        successful: results.filter(r => r.status === 'success').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        failed: results.filter(r => r.status === 'error').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload',
      error: error.message
    });
  }
});

// GET /documents - listar documentos
app.get('/documents', async (req, res) => {
  try {
    const storeId = process.env.STORE_ID;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store não configurado. Faça upload primeiro.'
      });
    }

    const documentsResponse = await ai.fileSearchStores.documents.list({
      parent: storeId
    });

    let docList = [];

    if (documentsResponse?.documents || documentsResponse?.fileSearchStoreDocuments) {
      docList = documentsResponse.documents || documentsResponse.fileSearchStoreDocuments || [];
    } else if (Array.isArray(documentsResponse)) {
      docList = documentsResponse;
    } else if (documentsResponse && typeof documentsResponse[Symbol.asyncIterator] === 'function') {
      for await (const doc of documentsResponse) {
        docList.push(doc);
      }
    }

    res.json({
      success: true,
      storeId: storeId,
      totalDocuments: docList.length,
      documents: docList.map(doc => ({
        id: doc.name,
        displayName: doc.displayName,
        createTime: doc.createTime
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar documentos',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\nAPI rodando em http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /          - Health check`);
  console.log(`  POST /upload    - Upload de arquivo (multipart/form-data)`);
  console.log(`  GET  /documents - Listar documentos`);
  console.log(`\n`);
});
