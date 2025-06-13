import { db } from './firebase'; // je eigen firebase init

export default async function handler(req, res) {
  const { serverId } = req.query;

  switch (req.method) {
    case 'GET':
      const snapshot = await db.ref(`meldingen/${serverId}`).once('value');
      return res.status(200).json(snapshot.val() || []);

    case 'POST':
      const melding = req.body;
      await db.ref(`meldingen/${serverId}`).push(melding);
      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
