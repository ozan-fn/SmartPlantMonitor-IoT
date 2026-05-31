export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { page = 1, size = 20, filter, start, end } = req.query;
    
    let apiUrl = `http://93.115.101.176:9703/?page=${page}&size=${size}`;
    
    // Add filter parameters
    if (filter) {
      apiUrl += `&filter=${filter}`;
    }
    if (start) {
      apiUrl += `&start=${start}`;
    }
    if (end) {
      apiUrl += `&end=${end}`;
    }
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
}
