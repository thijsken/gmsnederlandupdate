const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

if (!admin.apps.length) {
  let serviceAccount;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // 🔐 Uit environment variabele
      console.log('🔐 FIREBASE_SERVICE_ACCOUNT geladen uit environment variabele');
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

      // Fix voor newline in private key
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

    } else {
      // 📄 Lokaal JSON bestand (root/config/firebase-service-account.json)
      const filePath = path.resolve(__dirname, '../config/firebase-service-account.json');
      console.log('📄 firebase-service-account.json geladen vanaf root/config/');
      serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // 🚀 Initialiseer Firebase
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
