// firebaseAdmin.js
const admin = require('firebase-admin');

if (!admin.apps.length) {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Optie 1: JSON string van hele service account
    try {
      serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n')
      );
    } catch (err) {
      console.error('Fout bij het parsen van FIREBASE_SERVICE_ACCOUNT:', err);
      throw new Error('FIREBASE_SERVICE_ACCOUNT is ongeldig');
    }
  } else {
    // Optie 2: losse environment variables
    if (
      !process.env.FIREBASE_PRIVATE_KEY ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PROJECT_ID
    ) {
      throw new Error(
        'Firebase configuratie ontbreekt. Stel FIREBASE_SERVICE_ACCOUNT of losse keys in.'
      );
    }

    serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

module.exports = { admin, db };
