export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'Missing url' });

  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      { headers: { 'User-Agent': 'write-your-future/1.0' } }
    );
    if (!response.ok) throw new Error(`TinyURL status ${response.status}`);
    const short = (await response.text()).trim();
    if (!short.startsWith('http')) throw new Error('Invalid TinyURL response');
    return res.json({ url: short });
  } catch (err) {
    console.error('shorten error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
