let postenAlarms = []; // tijdelijke opslag van postenalarms

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const alarm = req.body;

    // Voeg alarm toe aan opslag
    postenAlarms.push(alarm);

    console.log('📥 Nieuw postenalarm ontvangen:', alarm);

    return res.status(200).json({ message: 'Alarm ontvangen', totaal: postenAlarms.length });
  }

  if (req.method === 'GET') {
    // Stuur alle opgeslagen alarms terug
    const alarmsToSend = postenAlarms;
    postenAlarms = []; // leegmaken na ophalen

    return res.status(200).json(alarmsToSend);
  }

  // Methode niet toegestaan
  res.status(405).json({ error: 'Method not allowed' });
}
