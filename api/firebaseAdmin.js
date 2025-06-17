const admin = require('firebase-admin');

if (!admin.apps.length) {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!rawServiceAccount) {
    throw new Error('❌ FIREBASE_SERVICE_ACCOUNT ontbreekt in de environment variables');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(rawServiceAccount);

    // Fix de \n in de private key
    if (serviceAccount.private_key) {
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
