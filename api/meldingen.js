export async function meldingenHandler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json([
      { id: 1, type: 'Brand', location: 'Utrecht', status: 'new' },
      { id: 2, type: 'Ongeval', location: 'Rotterdam', status: 'accepted' }
    ]);
  }

  if (req.method === 'POST') {
    const melding = req.body;
    // In echte app: opslaan in DB
    return res.status(201).json({ message: 'Melding opgeslagen', data: melding });
  }

  res.status(405).json({ error: 'Method not allowed' });
}