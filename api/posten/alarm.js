export default async function handler(req, res) {
  if (req.method === 'POST') {
    const alarm = req.body;
    // TODO: verwerk alarm voor post
    return res.status(200).json({ message: 'Alarm ontvangen', data: alarm });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
