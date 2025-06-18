const express = require('express');
const router = express.Router();
const { db } = require('./firebaseAdmin');  // Zorg dat je Firebase admin goed geconfigureerd hebt

// POST: unit opslaan
router.post('/', (req, res) => {
  const { serverId, id, type, location } = req.body;

  if (!serverId || !id || !type || !location) {
    return res.status(400).json({ message: 'Ongeldige eenheid of geen serverId' });
  }

  const ref = db.ref(`servers/${serverId}/units/${id}`);
  const unit = { id, type, location };

  ref.set(unit)
    .then(() => res.status(201).json({ message: 'Eenheid opgeslagen', data: unit }))
    .catch(error => {
      console.error('Fout bij opslaan unit:', error);
      res.status(500).json({ message: 'Fout bij opslaan unit' });
    });
});

// GET: alle units ophalen (placeholder, pas aan naar jouw setup)
router.get('/', (req, res) => {
  // Je kunt hier bijvoorbeeld alle units ophalen voor een bepaalde server, bijvoorbeeld via query param
  const serverId = req.query.serverId;
  if (!serverId) {
    return res.status(400).json({ message: 'Geen serverId opgegeven' });
  }

  const ref = db.ref(`servers/${serverId}/units`);

  ref.once('value')
    .then(snapshot => {
      const units = snapshot.val() || {};
      // Omzetten van object naar array van units:
      const unitsArray = Object.values(units);
      res.status(200).json(unitsArray);
    })
    .catch(error => {
      console.error('Fout bij ophalen units:', error);
      res.status(500).json({ message: 'Fout bij ophalen units' });
    });
});

module.exports = router;
