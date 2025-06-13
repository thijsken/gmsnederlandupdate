// /api/meldingen.js
const admin = require('firebase-admin');
const express = require('express');

const router = express.Router();

// Zorg dat Firebase niet dubbel geïnitialiseerd wordt
if (!admin.apps.length) {
  const serviceAccount = require('../public/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gmsnederland-3029e-default-rtdb.europe-west1.firebasedatabase.app'
  });
}

const db = admin.database();

// ✅ GET: alle meldingen per server
router.get('/', async (req, res) => {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId is verplicht' });
  }

  try {
    const snapshot = await db.ref(`servers/${serverId}/meldingen`).once('value');
    const meldingen = snapshot.val() || {};
    const lijst = Object.values(meldingen);

    res.status(200).json({
      serverId,
      count: lijst.length,
      recentCalls: lijst
    });
  } catch (err) {
    console.error("❌ Fout bij ophalen meldingen:", err);
    res.status(500).json({ error: 'Fout bij ophalen meldingen' });
  }
});

// ✅ POST: nieuwe melding toevoegen
router.post('/', async (req, res) => {
  const melding = req.body;
  const { serverId } = melding;

  if (!serverId || !melding.type || !melding.location || !melding.description) {
    return res.status(400).json({ error: 'Ongeldige melding, vereiste velden ontbreken' });
  }

  try {
    const ref = db.ref(`servers/${serverId}/meldingen`);
    const newRef = await ref.push(melding);

    console.log("📥 Nieuwe melding toegevoegd:", melding);

    res.status(201).json({
      message: "✅ Melding opgeslagen",
      id: newRef.key,
      data: melding
    });
  } catch (err) {
    console.error("❌ Fout bij opslaan melding:", err);
    res.status(500).json({ error: "Fout bij opslaan melding" });
  }
});

module.exports = router;
