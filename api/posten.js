let postenOpslag = []; // tijdelijke in-memory opslag

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Geef huidige posten terug
    return res.status(200).json(postenOpslag);
  }
  
  if (req.method === 'POST') {
    const nieuwePosten = req.body;
    
    if (!Array.isArray(nieuwePosten)) {
      return res.status(400).json({ error: 'Payload moet een array zijn' });
    }

    // Voeg nieuwe posten toe aan de bestaande opslag (zonder alles te verwijderen)
    postenOpslag = postenOpslag.concat(nieuwePosten);

    return res.status(200).json({ success: true, totalPosten: postenOpslag.length });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
