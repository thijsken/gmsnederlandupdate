const { realtimeDb } = require('./firebaseAdmin'); // pas dit pad aan als nodig

module.exports = async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId ontbreekt' });
  }

  const ref = realtimeDb.ref(`servers/${serverId}/Meldingen`);

  try {
    if (req.method === 'GET') {
      const snapshot = await ref.once('value');
      const data = snapshot.val() || {};
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const melding = req.body;

      if (!melding || typeof melding !== 'object') {
        return res.status(400).json({ error: 'Ongeldige melding data' });
      }

      const newRef = ref.push();
      await newRef.set(melding);
      return res.status(201).json({ message: '✅ Melding opgeslagen', data: melding });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('❌ Fout in API:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
