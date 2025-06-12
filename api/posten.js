let postenOpslag = []; // tijdelijke opslag posten

function deduplicatePosten(posten) {
  const map = new Map();
  posten.forEach(post => {
    // Gebruik post.id als key, of anders post.name
    const key = post.id || post.name;
    if (key) {
      map.set(key, post); // overschrijft dubbele
    }
  });
  return Array.from(map.values());
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(postenOpslag);
  }

  if (req.method === 'POST') {
    const body = req.body;
    console.log('📥 Nieuwe posten ontvangen:', body);

    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'Payload moet een array zijn' });
    }

    postenOpslag = postenOpslag.concat(body);
    postenOpslag = deduplicatePosten(postenOpslag);

    return res.status(200).json({ message: 'Posten ontvangen', totaal: postenOpslag.length });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
