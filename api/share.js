export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return res.status(500).json({ error: 'KV not configured' });
  }

  const kvRes = await fetch(`${process.env.KV_REST_API_URL}/get/${id}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });

  if (!kvRes.ok) return res.status(404).json({ error: 'Not found' });

  const { result } = await kvRes.json();
  if (!result) return res.status(404).json({ error: 'Not found' });

  try {
    const payload = JSON.parse(decodeURIComponent(result));
    return res.json(payload);
  } catch {
    return res.status(500).json({ error: 'Corrupt share data' });
  }
}
