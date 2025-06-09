// routes/meldingen.js
const express = require('express');
const router = express.Router();
const { db } = require('./firebaseAdmin');

// POST: nieuwe melding
router.post('/', (req, res) => {
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

  const ref = db.ref(`servers/${serverId}/meldingen`);
  ref.push(melding)
    .then(() => res.status(201).json({ message: '✅ Melding ontvangen en opgeslagen', data: melding }))
    .catch(error => {
      console.error('Fout bij opslaan melding:', error);
      res.status(500).json({ message: 'Fout bij opslaan melding' });
    });
});

// GET: alle meldingen ophalen
router.get('/', (req, res) => {
  const serverId = req.query.serverId;
  if (!serverId) {
    return res.status(400).json({ message: 'serverId is verplicht' });
  }

  const ref = db.ref(`servers/${serverId}/meldingen`);
  ref.once('value')
    .then(snapshot => {
      const data = snapshot.val() || {};
      const meldingen = Object.values(data);
      res.json(meldingen);
    })
    .catch(error => {
      console.error('Fout bij ophalen meldingen:', error);
      res.status(500).json({ message: 'Fout bij ophalen meldingen' });
    });
});

// PATCH: status update
router.patch('/:meldingId/status', async (req, res) => {
  const { meldingId } = req.params;
  const { status } = req.body;
  const serverId = req.query.serverId;

  if (!["new", "accepted", "assigned", "closed"].includes(status)) {
    return res.status(400).json({ message: 'Ongeldige status' });
  }
  if (!serverId) {
    return res.status(400).json({ message: 'serverId is verplicht' });
  }

  try {
    const ref = db.ref(`servers/${serverId}/meldingen/${meldingId}`);
    const snapshot = await ref.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Melding niet gevonden' });
    }
    await ref.update({ status });
    const updated = await ref.once('value');
    res.json({ message: 'Status bijgewerkt', melding: updated.val() });
  } catch (error) {
    console.error('Fout bij updaten status melding:', error);
    res.status(500).json({ message: 'Fout bij updaten status' });
  }
});

module.exports = router;
