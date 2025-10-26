import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

try {
  // Try to load service account key
  const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  db = admin.firestore();
  console.log('✅ Firebase Admin initialized with service account');
} catch (error) {
  console.log('⚠️ Service account not found, using local/demo mode');
  console.log('Error:', error.message);
  console.log('For production, add serviceAccountKey.json');
  
  // Initialize without credentials for local development
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: 'mediblock-demo'
    });
  }
  
  db = admin.firestore();
  db.settings({
    host: 'localhost:8080',
    ssl: false
  });
}

export { db, admin };
