const admin = require('firebase-admin');

if (!admin.apps.length) {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n')
      );
    } catch (err) {
      console.error('Fout bij het parsen van FIREBASE_SERVICE_ACCOUNT:', err);
      throw new Error('FIREBASE_SERVICE_ACCOUNT is ongeldig');
    }
  } else {
    const {
      FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL,
      FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY_ID,
      FIREBASE_CLIENT_ID,
      FIREBASE_CLIENT_CERT_URL,
    } = process.env;

    if (!FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PROJECT_ID) {
      throw new Error(
        'Firebase configuratie ontbreekt. Stel FIREBASE_SERVICE_ACCOUNT of losse keys in.'
      );
    }

    serviceAccount = {
      type: 'service_account',
      project_id: FIREBASE_PROJECT_ID,
      private_key_id: FIREBASE_PRIVATE_KEY_ID || '',
      private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: FIREBASE_CLIENT_EMAIL,
      client_id: FIREBASE_CLIENT_ID || '',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: FIREBASE_CLIENT_CERT_URL || '',
    };
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gmsnederland-3029e-default-rtdb.europe-west1.firebasedatabase.app", // Realtime Database URL
  });
}

// Firestore instantie
const firestoreDb = admin.firestore();
// Realtime Database instantie
const realtimeDb = admin.database();

module.exports = { admin, firestoreDb, realtimeDb };
