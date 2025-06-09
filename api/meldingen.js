import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gmsnederland-3029e-default-rtdb.europe-west1.firebasedatabase.app',
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { serverId, type, location, playerName } = req.body;

    if (!serverId || !type || !location || !playerName) {
      return res.status(400).json({ message: 'Fout: ongeldige melding of geen serverId' });
    }

    const melding = {
      type,
      location,
      playerName,
      timestamp: Date.now(),
      status: 'new',
    };

    try {
      await db.ref(`servers/${serverId}/meldingen`).push(melding);
      res.status(201).json({ message: '✅ Melding ontvangen en opgeslagen', data: melding });
    } catch (error) {
      console.error('Fout bij opslaan melding:', error);
      res.status(500).json({ message: 'Fout bij opslaan melding' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
