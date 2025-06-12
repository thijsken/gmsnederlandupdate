const express = require('express');
const router = express.Router();

// Tijdelijke opslag luchtalarm acties
let alarmQueue = [];

// POST: Actie instellen voor luchtalarm
router.post('/actie', (req, res) => {
  const { actie, id } = req.body;
  if (!actie || !id) {
    return res.status(400).json({ message: 'Actie of ID ontbreekt' });
  }

  const newAction = { actie, id, timestamp: Date.now() };
  alarmQueue.push(newAction);
  console.log(`🚨 Nieuwe luchtalarm actie toegevoegd:`, newAction);
  res.status(200).json({ message: `Actie '${actie}' toegevoegd aan queue`, data: newAction });
});

// GET: Ophalen eerstvolgende luchtalarm-actie
router.get('/actie', (req, res) => {
  if (alarmQueue.length === 0) {
    return res.status(204).send();
  }

  const nextAction = alarmQueue.shift();
  console.log(`📡 Roblox haalt actie op:`, nextAction);
  res.json(nextAction);
});

// GET: Alle luchtalarm-palen ophalen (optioneel)
let luchtalarmPalen = [];
router.get('/palen', (req, res) => {
  res.json(luchtalarmPalen);
});

// POST: Luchtalarm-palen ontvangen (optioneel)
router.post('/palen', (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ message: 'Ongeldige paaldata' });
  }
  luchtalarmPalen = data;
  console.log("📥 Paaldata ontvangen:", luchtalarmPalen.length);
  res.json({ message: 'Paaldata opgeslagen' });
});

module.exports = router;
