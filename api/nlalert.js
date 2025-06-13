let nlAlerts = []; // tijdelijke opslag van NLAlerts

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, message, location, timestamp } = req.body;

    if (!title || !message || !location || !timestamp) {
      return res.status(400).json({ error: "Ontbrekende velden voor NLAlert" });
    }

    const alert = { title, message, location, timestamp };
    nlAlerts.push(alert);

    console.log("📢 Nieuw NLAlert ontvangen:", alert);

    return res.status(201).json({ message: "NLAlert opgeslagen", totaal: nlAlerts.length });
  }

  if (req.method === 'GET') {
    const alertsToSend = nlAlerts;
    nlAlerts = []; // leegmaken na ophalen

    return res.status(200).json(alertsToSend);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
