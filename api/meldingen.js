import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.resolve('./data');
const DATA_FILE = path.resolve(DATA_DIR, 'meldingen.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

async function writeData(data) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fout bij schrijven data:', err);
    throw err;
  }
}

export default async function handler(req, res) {
  const { serverId } = req.query;
  if (!serverId) {
    return res.status(400).json({ error: 'serverId ontbreekt' });
  }

  const data = await readData();

  switch (req.method) {
    case 'GET':
      return res.status(200).json(data[serverId] || []);

    case 'POST':
      const melding = req.body;
      if (!data[serverId]) {
        data[serverId] = [];
      }
      data[serverId].push(melding);

      try {
        await writeData(data);
      } catch (err) {
        return res.status(500).json({ error: 'Kon melding niet opslaan' });
      }

      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
