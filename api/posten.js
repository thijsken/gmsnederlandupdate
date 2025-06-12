export default async function handler(req, res) {
  const { serverId } = req.query; // ✅ haalt ?serverId=... uit de URL

  if (req.method === 'POST') {
    const data = req.body;

    if (!serverId) {
      return res.status(400).json({ error: "serverId ontbreekt" });
    }

    // TODO: verwerk en sla op in database
    console.log("Data van server:", serverId);
    console.log("Inhoud:", data);

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
