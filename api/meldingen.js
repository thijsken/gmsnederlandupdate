// api/meldingen.js
// You'll need to import and initialize your database connection here
// e.g., import { db } from '../lib/database'; // Assuming you have a separate file for DB connection

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        // TODO: haal meldingen uit database
        // Example: Fetch all existing messages from your database
        // const meldingen = await db.collection('meldingen').find({}).toArray();
        const meldingen = []; // Placeholder for now, replace with actual DB fetch
        return res.status(200).json(meldingen);
      } catch (error) {
        console.error("Error fetching meldingen:", error);
        return res.status(500).json({ error: 'Internal Server Error fetching meldingen' });
      }

    case 'POST':
      try {
        const melding = req.body;
        // Basic validation (optional but recommended)
        if (!melding.playerName || !melding.type || !melding.location) {
            return res.status(400).json({ error: 'Missing required fields in payload' });
        }

        // TODO: opslaan in database
        // Example: Insert the 'melding' object into your database
        // const result = await db.collection('meldingen').insertOne(melding);
        console.log("Received melding:", melding); // Log what you received for debugging
        console.log("Attempting to save melding to database..."); // Placeholder for actual DB save

        return res.status(201).json({ message: 'Melding opgeslagen', data: melding });
      } catch (error) {
        console.error("Error saving melding:", error);
        return res.status(500).json({ error: 'Internal Server Error saving melding' });
      }

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}