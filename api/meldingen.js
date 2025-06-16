// Let op: gebruik CommonJS syntax (require), geen import, vanwege Vercel en Node.js standaard

const admin = require('firebase-admin');

if (!admin.apps.length) {
  // Maak de serviceAccount object aan vanuit env vars
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    // Vervang escaped \n door echte newlines
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

module.exports = async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId ontbreekt' });
  }

  const ref = db.ref(`servers/${serverId}/Meldingen`);

  try {
    if (req.method === 'GET') {
      const snapshot = await ref.once('value');
      const data = snapshot.val() || {};
      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const melding = req.body;

      // Je kunt hier eventueel validatie toevoegen op melding

      const newRef = ref.push();
      await newRef.set(melding);
      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API fout:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
