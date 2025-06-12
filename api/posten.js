export default async function handler(req, res) {
  if (req.method === 'GET') {
    // TODO: haal posten op uit database
    return res.status(200).json([]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
