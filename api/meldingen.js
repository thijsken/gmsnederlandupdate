// /api/meldingen.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = require('/confige/gmsnederland-3029e-firebase-adminsdk-fbsvc-c900bf64b5.json');

// Zorg dat Firebase slechts één keer wordt geïnitialiseerd
if (!global.firebaseApp) {
  global.firebaseApp = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://gmsnederland-3029e-default-rtdb.europe-west1.firebasedatabase.app'
  });
}
const db = getDatabase();

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: '❌ serverId ontbreekt in de query' });
  }

  const ref = db.ref(`servers/${serverId}/Meldingen`);

  try {
    switch (req.method) {
      case 'GET':
        const snapshot = await ref.once('value');
        const data = snapshot.val() || {};
        return res.status(200).json(Object.values(data)); // Object -> lijst

      case 'POST':
        const melding = req.body;
        if (!melding || typeof melding !== 'object') {
          return res.status(400).json({ error: '❌ Ongeldige melding in body' });
        }

        const newRef = await ref.push(melding);
        return res.status(201).json({ message: '✅ Melding opgeslagen', id: newRef.key });

      default:
        return res.status(405).json({ error: '❌ Method not allowed' });
    }
  } catch (err) {
    console.error('❌ Fout bij Firebase-opslag:', err);
    return res.status(500).json({ error: 'Serverfout bij Firebase' });
  }
}
