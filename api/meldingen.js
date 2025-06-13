import admin from 'firebase-admin';

const serviceAccountJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
serviceAccountJson.private_key = serviceAccountJson.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountJson),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  try {
    const { serverId } = req.query;
    if (!serverId) {
      return res.status(400).json({ error: 'serverId ontbreekt' });
    }

    const db = admin.firestore();

    if (req.method === 'POST') {
      const melding = req.body;
      if (!melding.timestamp) melding.timestamp = Date.now();

      const docRef = await db.collection('servers').doc(serverId).collection('Meldingen').add(melding);
      return res.status(201).json({ message: 'Melding opgeslagen', id: docRef.id });

    } else if (req.method === 'GET') {
      const snapshot = await db.collection('servers').doc(serverId).collection('Meldingen').orderBy('timestamp', 'desc').get();
      const meldingen = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(meldingen);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error("API handler error:", error);
    return res.status(500).json({ error: 'Er is een server fout opgetreden' });
  }
}
