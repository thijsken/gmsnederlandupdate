const unitsPerServer = {}; // ⛔️ Let op: dit verdwijnt op Vercel na elk request

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      // TODO: haal units op uit database
      return res.status(200).json([]);

    case 'POST':
      const unit = req.body;
      // TODO: sla eenheid op
      return res.status(201).json({ message: 'Eenheid opgeslagen', data: unit });

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
