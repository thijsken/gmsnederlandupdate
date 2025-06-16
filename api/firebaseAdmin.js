const admin = require('firebase-admin');

console.log('🔥 Start firebaseAdmin.js');

// Raw env var uitlezen
const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!rawServiceAccount) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable ontbreekt!');
}
console.log('Raw FIREBASE_SERVICE_ACCOUNT env var:', '[Vastgesteld]');

let serviceAccount;
try {
  // Parse JSON van service account, vervang eventueel escaped newlines
  serviceAccount = JSON.parse(rawServiceAccount);

  // Fix private_key newlines als ze escaped zijn (\n)
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  console.log('✅ JSON parsed succesvol');
  console.log('🔑 private_key lengte:', serviceAccount.private_key.length);
  console.log('🔑 private_key start:', serviceAccount.private_key.substring(0, 30));
} catch (error) {
  console.error('❌ Fout bij parsen FIREBASE_SERVICE_ACCOUNT:', error);
  throw error;
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gmsnederland-3029e-default-rtdb.europe-west1.firebasedatabase.app/',
  });
  console.log('✅ Firebase geïnitieerd');
} catch (error) {
  console.error('❌ Fout bij Firebase initialisatie:', error);
  throw error;
}

const realtimeDb = admin.database();

module.exports = { realtimeDb };
