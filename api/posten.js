export default async function handler(req, res) {
  const { serverId } = req.query;

  if (req.method === 'GET') {
    // Return posten data filtered by serverId if given
    const posten = await getPostenFromDatabase(serverId); // implement this
    return res.status(200).json(posten);
  }

  if (req.method === 'POST') {
    // Save posten data (check auth, validate, etc)
    const postenData = req.body;
    await savePostenToDatabase(serverId, postenData); // implement this
    return res.status(200).json({ message: "Posten opgeslagen" });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
