export default function handler(req, res) {
  const { serverId } = req.query;

  console.log('Ontvangen request:', req.method, 'voor serverId:', serverId);
  console.log('Body:', req.body);

  if (!serverId) {
    return res.status(400).json({ error: 'serverId ontbreekt' });
  }

  const data = readData();
  console.log('Gelezen data:', data);

  switch (req.method) {
    case 'GET':
      return res.status(200).json(data[serverId] || []);

    case 'POST':
      try {
        const melding = req.body;
        if (!melding || typeof melding !== 'object') {
          return res.status(400).json({ error: 'Ongeldige melding-body' });
        }

        if (!data[serverId]) {
          data[serverId] = [];
        }

        data[serverId].push(melding);

        writeData(data);

        console.log('Melding opgeslagen:', melding);
        return res.status(201).json({ message: 'Melding opgeslagen', data: melding });
      } catch (err) {
        console.error('❌ Fout tijdens POST:', err);
        return res.status(500).json({ error: 'Interne serverfout' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
