const admin = require('firebase-admin');
const serviceAccount = require('./config/firebase-service-account.json');

if (!admin.apps.length) {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!rawServiceAccount) {
    throw new Error('❌ FIREBASE_SERVICE_ACCOUNT ontbreekt in de environment variables');
  }

  let serviceAccount;
  try {
    console.log('RAW FIREBASE_SERVICE_ACCOUNT:', rawServiceAccount);
    serviceAccount = JSON.parse(rawServiceAccount);

    // Zorg dat de newline correct wordt geïnterpreteerd
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.error('❌ JSON parse error voor FIREBASE_SERVICE_ACCOUNT:', err);
    throw err;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://gmsnederland-3029e.firebaseio.com',
    });
    console.log('✅ Firebase Admin is geïnitialiseerd');
  } catch (err) {
    console.error('❌ Fout bij Firebase initialisatie:', err);
    throw err;
  }
}

const realtimeDb = admin.database();

module.exports = { admin, realtimeDb };
