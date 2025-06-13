
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const alarm = req.body;

    // Validatie van alarm-object
    if (!alarm || typeof alarm !== 'object') {
      return res.status(400).json({ error: 'Ongeldige payload' });
    }

    // Voeg alarm toe aan opslag
    postenAlarms.push(alarm);

    console.log('📥 Nieuw postenalarm ontvangen:', alarm);

    return res.status(200).json({ message: 'Alarm ontvangen', totaal: postenAlarms.length });
  }

  if (req.method === 'GET') {
    // Stuur alle opgeslagen alarms terug
    return res.status(200).json(postenAlarms);
  }

  // Methode niet toegestaan
  res.status(405).json({ error: 'Method not allowed' });
}
