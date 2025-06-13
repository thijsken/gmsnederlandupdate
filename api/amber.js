// 📦 Tijdelijke opslag (kan later vervangen worden door een database)
const amberAlerts = [];

// ✅ Amber Alert opslaan
app.post('/api/amber', (req, res) => {
  const { name, userId, location, description, timestamp } = req.body;

  // Validatie
  if (!name || !userId || !location || !description || !timestamp) {
    return res.status(400).json({ error: "Ontbrekende velden in verzoek." });
  }

  const alert = {
    name,
    userId,
    location,
    description,
    timestamp: Number(timestamp)
  };

  amberAlerts.push(alert);
  console.log("✅ Amber Alert opgeslagen:", alert);

  res.status(201).json({ message: "Amber Alert succesvol opgeslagen", alert });
});

// ✅ Alle Amber Alerts ophalen
app.get('/api/amber', (req, res) => {
  // Optioneel: alleen de laatste 10 of alerts van afgelopen uur?
  res.status(200).json(amberAlerts);
});
