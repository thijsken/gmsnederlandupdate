// /pages/api/meldingen.js

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve('./data/meldingen.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {}; // Geen bestand of corrupte inhoud? Start leeg
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId ontbreekt' });
  }

  const data = readData();

  switch (req.method) {
    case 'GET':
      return res.status(200).json(data[serverId] || []);

    case 'POST':
      const melding = req.body;

      if (!data[serverId]) {
        data[serverId] = [];
      }

      data[serverId].push(melding);
      writeData(data);

      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
