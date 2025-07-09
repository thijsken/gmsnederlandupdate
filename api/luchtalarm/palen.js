let paalDataOpslag = []; // tijdelijke opslag van paaldata

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(paalDataOpslag);
  }

  if (req.method === 'POST') {
    const body = req.body;

    console.log('📥 Nieuwe paaldata ontvangen:', body);

    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'Payload moet een array zijn' });
    }

    // Voeg nieuwe paaldata toe aan bestaande data
    paalDataOpslag = paalDataOpslag.concat(body);

    return res.status(200).json({ message: 'Paaldata ontvangen', totaal: paalDataOpslag.length });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
