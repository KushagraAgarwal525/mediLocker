// Lightweight Web Crypto helpers for per-user RSA keypair + hybrid AES encryption
// Uses RSA-OAEP (SHA-256) to wrap an AES-GCM symmetric key used to encrypt file bytes.

const STORAGE_KEY = 'medilocker_crypto_keys';

function bufToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuf(b64: string) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function generateRSAKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );
}

async function exportKeyPair(keyPair: CryptoKeyPair) {
  const spki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  return {
    publicKey: bufToBase64(spki),
    privateKey: bufToBase64(pkcs8)
  };
}

async function importPublicKey(spkiBase64: string) {
  const spki = base64ToBuf(spkiBase64);
  return crypto.subtle.importKey(
    'spki',
    spki,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  );
}

async function importPrivateKey(pkcs8Base64: string) {
  const pkcs8 = base64ToBuf(pkcs8Base64);
  return crypto.subtle.importKey(
    'pkcs8',
    pkcs8,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['decrypt']
  );
}

function loadKeysStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveKeysStorage(obj: Record<string, any>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// Ensure a keypair exists for a given userId. Returns imported CryptoKey objects.
export async function ensureKeyPairForUser(userId: string) {
  const store = loadKeysStorage();
  if (store[userId] && store[userId].publicKey && store[userId].privateKey) {
    const publicKey = await importPublicKey(store[userId].publicKey);
    const privateKey = await importPrivateKey(store[userId].privateKey);
    return { publicKey, privateKey };
  }

  // generate and persist
  const kp = await generateRSAKeyPair();
  const exported = await exportKeyPair(kp);
  store[userId] = exported;
  saveKeysStorage(store);

  const publicKey = await importPublicKey(exported.publicKey);
  const privateKey = await importPrivateKey(exported.privateKey);
  return { publicKey, privateKey };
}

// Hybrid encrypt file bytes (ArrayBuffer) with generated AES-GCM key wrapped by RSA public key
export async function encryptWithPublicKey(publicKey: CryptoKey, data: ArrayBuffer) {
  // generate AES key
  const aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);

  // iv
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // encrypt data
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, data);

  // export raw AES key and encrypt (wrap) with RSA public key
  const rawAes = await crypto.subtle.exportKey('raw', aesKey);
  const encryptedKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, rawAes);

  return {
    encryptedKey: bufToBase64(encryptedKey),
    iv: bufToBase64(iv.buffer),
    ciphertext: bufToBase64(ciphertext)
  };
}

// Decrypt the hybrid payload using private RSA key
export async function decryptWithPrivateKey(privateKey: CryptoKey, payload: { encryptedKey: string; iv: string; ciphertext: string; }) {
  const encryptedKeyBuf = base64ToBuf(payload.encryptedKey);
  const ivBuf = base64ToBuf(payload.iv);
  const ciphertextBuf = base64ToBuf(payload.ciphertext);

  // decrypt AES raw key
  const rawAes = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedKeyBuf);

  // import AES key
  const aesKey = await crypto.subtle.importKey('raw', rawAes, { name: 'AES-GCM' }, true, ['decrypt']);

  // decrypt ciphertext
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(ivBuf) }, aesKey, ciphertextBuf);
  return plain; // ArrayBuffer
}

export function base64ToBlobDataUrl(base64: string, mime: string) {
  // base64 is standard btoa-style string without data: prefix
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

export default {
  ensureKeyPairForUser,
  encryptWithPublicKey,
  decryptWithPrivateKey,
  base64ToBlobDataUrl
};
