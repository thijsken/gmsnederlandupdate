// pages/api/meldingen.js
import { db } from '../../lib/firebase';

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId is verplicht' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const snapshot = await db.ref(`meldingen/${serverId}`).once('value');
        const data = snapshot.val() || {};
        const meldingen = Object.values(data);
        return res.status(200).json(meldingen);
      } catch (error) {
        console.error("❌ Fout bij ophalen:", error);
        return res.status(500).json({ error: 'Fout bij ophalen meldingen' });
      }
    }

    case 'POST': {
      try {
        const melding = {
          ...req.body,
          timestamp: Date.now(),
          status: "new"
        };

        await db.ref(`meldingen/${serverId}`).push(melding);
        return res.status(201).json({ message: '✅ Melding opgeslagen', data: melding });
      } catch (error) {
        console.error("❌ Fout bij opslaan:", error);
        return res.status(500).json({ error: 'Fout bij opslaan melding' });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
