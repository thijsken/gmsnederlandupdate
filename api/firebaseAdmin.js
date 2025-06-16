const admin = require('firebase-admin');

console.log('🔥 Start firebaseAdmin.js');
console.log('Raw FIREBASE_SERVICE_ACCOUNT env var:', process.env.FIREBASE_SERVICE_ACCOUNT ? '[Vastgesteld]' : '[Ontbreekt]');

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('✅ JSON parsed succesvol');

  // Vervang escaped \n door echte nieuwe regels
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  console.log('🔑 private_key lengte:', serviceAccount.private_key.length);
  console.log('🔑 private_key start:', serviceAccount.private_key.slice(0, 30));

} catch (e) {
  console.error('❌ Fout bij parsen van FIREBASE_SERVICE_ACCOUNT:', e);
  process.exit(1);
}

const admin = require('firebase-admin');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gmsnederland-3029e-default-rtdb.europe-west1.firebasedatabase.app/',
  });
  console.log('✅ Firebase geïnitieerd');
} catch (e) {
  console.error('❌ Fout bij Firebase initialisatie:', e);
  process.exit(1);
}

const realtimeDb = admin.database();

module.exports = { realtimeDb };
