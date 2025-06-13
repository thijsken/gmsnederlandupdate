// /pages/api/meldingen.js

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('./data');
const DATA_FILE = path.join(DATA_DIR, 'meldingen.json');

// Zorg dat /data map bestaat
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
}

function readData() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn("📁 Geen geldige meldingen.json, start met lege data.");
    return {};
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Fout bij wegschrijven naar bestand:", err);
  }
}

export default function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId || typeof serverId !== 'string') {
    return res.status(400).json({ error: '❌ serverId ontbreekt of ongeldig' });
  }

  const data = readData();

  switch (req.method) {
    case 'GET': {
      const meldingen = data[serverId] || [];
      return res.status(200).json({
        serverId,
        count: meldingen.length,
        recentCalls: meldingen
      });
    }

    case 'POST': {
      const melding = req.body;

      // Simpele validatie
      if (
        !melding ||
        typeof melding !== 'object' ||
        !melding.type ||
        !melding.location ||
        !melding.description ||
        !melding.timestamp
      ) {
        return res.status(400).json({ error: '❌ Ongeldige melding structuur' });
      }

      if (!data[serverId]) {
        data[serverId] = [];
      }

      // Voeg toe aan lijst
      data[serverId].push(melding);

      // Alleen laatste 100 meldingen bewaren (limiet)
      if (data[serverId].length > 100) {
        data[serverId] = data[serverId].slice(-100);
      }

      writeData(data);

      return res.status(201).json({
        message: '✅ Melding opgeslagen',
        melding
      });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `❌ Methode ${req.method} niet toegestaan` });
  }
}
