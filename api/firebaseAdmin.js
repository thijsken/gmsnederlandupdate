const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    // Voeg eventueel andere velden toe als nodig, zoals 'type': 'service_account'
    type: 'service_account',
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });

  console.log('✅ Firebase Admin succesvol geïnitialiseerd');
}

const realtimeDb = admin.database();

module.exports = { admin, realtimeDb };
