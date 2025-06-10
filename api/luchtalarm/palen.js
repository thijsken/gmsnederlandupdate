export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    const body = req.body;
    console.log('📥 Nieuwe paaldata ontvangen:', body);
    // TODO: sla op in database of log het ergens
    return res.status(200).json({ message: 'Paaldata ontvangen', data: body });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
