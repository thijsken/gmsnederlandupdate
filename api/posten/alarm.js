let postenAlarms = []; // tijdelijke opslag van postenalarms

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const alarm = req.body;

    // Validatie van alarm-object
    if (
      !alarm || 
      typeof alarm !== 'object' || 
      Array.isArray(alarm) || 
      Object.keys(alarm).length === 0 || 
      !alarm.postId || 
      !alarm.trigger
    ) {
      return res.status(400).json({ error: 'Ongeldig alarm-object' });
    }

    // Optioneel: voorkom dubbele alarms (bijvoorbeeld zelfde postId + trigger)
    const bestaatAl = postenAlarms.some(a => a.postId === alarm.postId && a.trigger === alarm.trigger);
    if (!bestaatAl) {
      postenAlarms.push(alarm);
      console.log('📥 Nieuw postenalarm ontvangen:', alarm);
    } else {
      console.log('⚠️ Alarm al aanwezig, negeer:', alarm);
    }

    return res.status(200).json({ message: 'Alarm ontvangen', totaal: postenAlarms.length });
  }

  if (req.method === 'GET') {
    // Filter lege objecten en arrays eruit voor response
    const filteredAlarms = postenAlarms.filter(
      a => a && typeof a === 'object' && !Array.isArray(a) && Object.keys(a).length > 0
    );
    return res.status(200).json(filteredAlarms);
  }

  // Methode niet toegestaan
  res.status(405).json({ error: 'Method not allowed' });
}
