// /api/luchtalarm/actie.js

let alarmQueue = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { actie, id } = req.body;
    if (!actie || !id) {
      return res.status(400).json({ message: 'Actie of ID ontbreekt' });
    }

    const newAction = { actie, id, timestamp: Date.now() };
    alarmQueue.push(newAction);
    console.log(`🚨 Nieuwe luchtalarm actie toegevoegd:`, newAction);
    res.status(200).json({ message: `Actie '${actie}' toegevoegd aan queue`, data: newAction });

  } else if (req.method === 'GET') {
    if (alarmQueue.length === 0) {
      return res.status(204).end();
    }

    const nextAction = alarmQueue.shift();
    console.log(`📡 Roblox haalt actie op:`, nextAction);
    res.status(200).json(nextAction);

  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
