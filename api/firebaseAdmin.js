const admin = require('firebase-admin');

console.log('🔥 Start firebaseAdmin.js');

// Print raw env var (pas op met gevoelige data in logs, alleen voor debugging lokaal)
console.log('Raw FIREBASE_SERVICE_ACCOUNT env var:', process.env.FIREBASE_SERVICE_ACCOUNT ? '[Vastgesteld]' : '[Niet gevonden]');

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('✅ JSON parsed succesvol');
} catch (err) {
  console.error('❌ Fout bij parsen JSON FIREBASE_SERVICE_ACCOUNT:', err.message);
  process.exit(1);
}

// Check private_key waarde en lengte
if (!serviceAccount.private_key) {
  console.error('❌ private_key ontbreekt in serviceAccount object');
  process.exit(1);
} else {
  console.log('🔑 private_key lengte:', serviceAccount.private_key.length);
  // Toon eerste 50 tekens private_key (voor debugging), nooit hele key in logs!
  console.log('🔑 private_key start:', serviceAccount.private_key.slice(0, 50));
}

// Vervang \\n door echte newline
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
console.log('🔄 private_key na replace nieuwe regels:');
console.log(serviceAccount.private_key.slice(0, 50).replace(/\n/g, '\\n') + '...');

// Init Firebase
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://gmsnederland-3029e.firebaseio.com',
    });
    console.log('🚀 Firebase succesvol geïnitialiseerd');
  }
} catch (error) {
  console.error('❌ Fout bij Firebase initialisatie:', error);
  process.exit(1);
}

const realtimeDb = admin.database();

module.exports = { realtimeDb };
