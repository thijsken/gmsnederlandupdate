// /pages/api/meldingen.js

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

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

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = getDatabase();

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId ontbreekt' });
  }

  const ref = db.ref(`servers/${serverId}/Meldingen`);

  switch (req.method) {
    case 'GET':
      try {
        const snapshot = await ref.once('value');
        const data = snapshot.val() || {};
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: 'Fout bij ophalen', details: error.message });
      }

    case 'POST':
      try {
        const melding = req.body;
        const newRef = ref.push();
        await newRef.set(melding);
        return res.status(201).json({ message: 'Melding opgeslagen', data: melding });
      } catch (error) {
        return res.status(500).json({ error: 'Fout bij opslaan', details: error.message });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
