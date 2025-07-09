const admin = require('firebase-admin');

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('❌ Firebase env vars ontbreken. Check FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL en FIREBASE_PROJECT_ID.');
  }

  const serviceAccount = {
    project_id: projectId,
    private_key: privateKey.replace(/\\n/g, '\n'),
    client_email: clientEmail,
    type: 'service_account',
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });

  console.log('✅ Firebase Admin succesvol geïnitialiseerd');
}

const realtimeDb = admin.database();

module.exports = { admin, realtimeDb };
