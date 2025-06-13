import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  const { serverId } = req.query;
  if (!serverId) {
    return res.status(400).json({ error: 'serverId ontbreekt' });
  }

  if (req.method === 'POST') {
    try {
      const melding = req.body;

      // Voeg timestamp toe als die er nog niet is
      if (!melding.timestamp) melding.timestamp = Date.now();

      // Voeg document toe aan Firestore collectie servers/{serverId}/Meldingen
      const docRef = await db.collection('servers').doc(serverId).collection('Meldingen').add(melding);

      return res.status(201).json({ message: 'Melding opgeslagen', id: docRef.id });
    } catch (error) {
      console.error('Fout bij opslaan melding:', error);
      return res.status(500).json({ error: 'Kon melding niet opslaan' });
    }
  } else if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('servers').doc(serverId).collection('Meldingen').orderBy('timestamp', 'desc').get();

      const meldingen = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return res.status(200).json(meldingen);
    } catch (error) {
      console.error('Fout bij ophalen meldingen:', error);
      return res.status(500).json({ error: 'Kon meldingen niet ophalen' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
