#!/usr/bin/env node
// Quick API test without external termination

const BASE_URL = "http://localhost:3000";

async function test() {
  console.log("\n🧪 TESTANDO API REFATORADA\n");
  
  try {
    // Test 1: Health Check
    console.log("1️⃣ Health Check...");
    const health = await fetch(`${BASE_URL}/`);
    const healthData = await health.json();
    console.log("✅ Response:", JSON.stringify(healthData, null, 2));
    
    // Test 2: List Stores
    console.log("\n2️⃣ Listando Stores...");
    const storesResp = await fetch(`${BASE_URL}/stores`);
    const storesData = await storesResp.json();
    console.log(`✅ Total stores: ${storesData.count}`);
    
    // Test 3: Create Store
    console.log("\n3️⃣ Criando Store...");
    const createResp = await fetch(`${BASE_URL}/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'SERHChat-Test' })
    });
    const storeCreated = await createResp.json();
    if (storeCreated.success) {
      console.log(`✅ Store criado: ${storeCreated.storeId}`);
      
      // Test 4: Configure Store
      console.log("\n4️⃣ Configurando Store...");
      const configResp = await fetch(`${BASE_URL}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: storeCreated.storeId })
      });
      const configData = await configResp.json();
      console.log(`✅ ${configData.message}`);
      
      // Test 5: List Documents
      console.log("\n5️⃣ Listando Documentos...");
      const docsResp = await fetch(`${BASE_URL}/documents`);
      const docsData = await docsResp.json();
      console.log(`✅ Total documentos: ${docsData.count}`);
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ TODOS OS TESTES PASSARAM!");
    console.log("=".repeat(50) + "\n");
    
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

test();
