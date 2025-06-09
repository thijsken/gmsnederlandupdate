const express = require('express');
const router = express.Router();
const { db } = require('./firebaseAdmin');

router.post('/', (req, res) => {
  const { serverId, id, type, location } = req.body;

  if (!serverId || !id || !type || !location) {
    return res.status(400).json({ message: 'Ongeldige eenheid of geen serverId' });
  }

  const ref = db.ref(`servers/${serverId}/units/${id}`);
  const unit = { id, type, location };

  ref.set(unit)
    .then(() => res.status(200).json({ message: 'Eenheid opgeslagen', data: unit }))
    .catch(error => {
      console.error('Fout bij opslaan unit:', error);
      res.status(500).json({ message: 'Fout bij opslaan unit' });
    });
});

router.get('/', (req, res) => {
  // Haal units uit je eigen opslag of Firebase, afhankelijk van jouw setup
  res.json([]); // placeholder
});

module.exports = router;
