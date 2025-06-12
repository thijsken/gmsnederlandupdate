export default async function handler(req, res) {
  if (req.method === 'GET') {
    // haal posten op
    return res.status(200).json([]);
  }
  
  if (req.method === 'POST') {
    const postenData = req.body;
    // verwerk postenData hier (opslaan in database)
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
