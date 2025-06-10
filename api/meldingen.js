export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // TODO: haal meldingen uit database
      return res.status(200).json([]);

    case 'POST':
      const melding = req.body;
      // TODO: opslaan in database
      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
