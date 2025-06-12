import { getDatabase } from "firebase-admin/database";
import { initializeApp, cert } from "firebase-admin/app";

const serviceAccount = require("./confige/gmsnederland-3029e-firebase-adminsdk-fbsvc-c900bf64b5.json"); // je Firebase key

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://gmsnederland-3029e-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = getDatabase();

export default async function handler(req, res) {
  const { serverId } = req.query;
  const ref = db.ref(`meldingen/${serverId}`);

  switch (req.method) {
    case 'GET':
      const snapshot = await ref.once("value");
      return res.status(200).json(snapshot.val() || []);

    case 'POST':
      const melding = req.body;
      await ref.push(melding);
      return res.status(201).json({ message: 'Melding opgeslagen', data: melding });

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
