const { realtimeDb } = require('../lib/firebaseAdmin');

export default async function handler(req, res) {
  console.log("✅ /api/meldingen bereikt");

  try {
    const { serverId } = req.query;
    console.log("➡️ serverId ontvangen:", serverId);

    const ref = realtimeDb.ref(`meldingen/${serverId}`);
    const snapshot = await ref.once('value');

    if (!snapshot.exists()) {
      console.log("❌ Geen data gevonden voor serverId");
      return res.status(404).json({ error: 'Geen data gevonden' });
    }

    const data = snapshot.val();
    console.log("✅ Data opgehaald:", data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("🔥 Fout in /api/meldingen:", error);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
}
