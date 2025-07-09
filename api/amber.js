let amberAlerts = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, userId, location, description, timestamp } = req.body;

    if (!name || !userId || !location || !description || !timestamp) {
      return res.status(400).json({ error: "Ontbrekende velden in verzoek." });
    }

    // Bewaar timestamp als string (zoals ISO date string)
    const alert = { name, userId, location, description, timestamp };

    amberAlerts.push(alert);
    console.log("✅ Amber Alert opgeslagen:", alert);

    return res.status(201).json({ message: "Amber Alert succesvol opgeslagen", alert });
  }

  if (req.method === 'GET') {
        const alertsToSend = [...amberAlerts];  // Kopie maken
    amberAlerts = [];  // Leegmaken na ophale
    return res.status(200).json(amberAlerts);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} niet toegestaan` });
}
