const meldingenPerServer = {}; // ⛔️ Let op: dit verdwijnt op Vercel na elk request

export default async function handler(req, res) {
  const { serverId } = req.query;

  switch (req.method) {
    case 'GET':
      return res.status(200).json(meldingenPerServer[serverId] || []);

    case 'POST':
      const melding = req.body;
      if (!meldingenPerServer[serverId]) {
        meldingenPerServer[serverId] = [];
      }
      meldingenPerServer[serverId].push(melding);
      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
