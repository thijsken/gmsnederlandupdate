// Let op: gebruik CommonJS syntax (require), geen import, vanwege Vercel en Node.js standaard

const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = {
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

console.log('RAW ENV:', process.env.FIREBASE_PRIVATE_KEY);
console.log('KEY after replace:', process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'));
console.log('KEY after JSON.parse:', JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`));
console.log('PRIVATE KEY FIRST 50 chars:', process.env.FIREBASE_PRIVATE_KEY.slice(0, 50));
console.log('PRIVATE KEY AFTER REPLACE:', process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').slice(0, 50));
console.log(JSON.stringify(process.env.FIREBASE_PRIVATE_KEY));

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

  const db = admin.database();

module.exports = async function handler(req, res) {
  try {
    console.log('API aangeroepen, methode:', req.method);
    const { serverId } = req.query;
    console.log('serverId:', serverId);

    if (!serverId) {
      console.log('Fout: serverId ontbreekt');
      return res.status(400).json({ error: 'serverId ontbreekt' });
    }

    const ref = db.ref(`servers/${serverId}/Meldingen`);

    if (req.method === 'GET') {
      const snapshot = await ref.once('value');
      const data = snapshot.val() || {};
      console.log('Data opgehaald:', data);
      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const melding = req.body;
      console.log('POST body:', melding);

      const newRef = ref.push();
      await newRef.set(melding);
      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });
    } else {
      console.log('Fout: method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Fout in API:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
