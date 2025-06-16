const admin = require('firebase-admin');

console.log('🔥 Start firebaseAdmin.js');

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!rawServiceAccount) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable ontbreekt!');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(rawServiceAccount);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
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
