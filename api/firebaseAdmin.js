const admin = require('firebase-admin');

console.log(JSON.stringify(require('./serviceAccountKey.json')));

if (!admin.apps.length) {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!rawServiceAccount) {
    throw new Error('❌ FIREBASE_SERVICE_ACCOUNT ontbreekt in de environment variables');
  }

  let serviceAccount;
  try {
    // Parse de JSON string uit de environment variable
    serviceAccount = JSON.parse(rawServiceAccount);

    // Vervang ge-escaped newline karakters door echte nieuwe regels in private_key
    if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://gmsnederland-3029e.firebaseio.com',
    });

    console.log('✅ Firebase Admin succesvol geïnitialiseerd');
  } catch (err) {
    console.error('❌ Fout bij Firebase initialisatie:', err);
    throw err;
  }
}

const realtimeDb = admin.database();

module.exports = { admin, realtimeDb };
