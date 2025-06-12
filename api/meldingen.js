// api/meldingen.js
import { db } from './firebaseAdmin';

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'Parameter serverId ontbreekt in query' });
  }

  const meldingenRef = db.ref(`servers/${serverId}/Meldingen`);

  switch (req.method) {
    case 'GET':
      try {
        const snapshot = await meldingenRef.once('value');
        const meldingen = snapshot.val() || {};
        return res.status(200).json(meldingen);
      } catch (error) {
        return res.status(500).json({ error: 'Fout bij ophalen van meldingen', details: error.message });
      }

    case 'POST':
      try {
        const melding = req.body;
        if (!melding || typeof melding !== 'object') {
          return res.status(400).json({ error: 'Ongeldige melding data' });
        }

        const nieuweMeldingRef = meldingenRef.push();
        await nieuweMeldingRef.set(melding);

        return res.status(201).json({
          message: 'Melding opgeslagen',
          id: nieuweMeldingRef.key,
          data: melding
        });
      } catch (error) {
        return res.status(500).json({ error: 'Fout bij opslaan van melding', details: error.message });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
