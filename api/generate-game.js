import { HfInference } from '@huggingface/inference';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, itemCount = 6 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Validate itemCount
  const count = Math.max(3, Math.min(15, parseInt(itemCount) || 6));

  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('HUGGINGFACE_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'HUGGINGFACE_API_KEY is not configured' });
  }

  console.log('API Key exists, length:', process.env.HUGGINGFACE_API_KEY.length);

  try {
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const systemPrompt = `You are a ranking game generator. Generate exactly ${count} items for the user's request and return ONLY valid JSON.

Format:
[
  {
    "id": 1,
    "title": "Item Name",
    "years": "Context or year",
    "image": "emoji",
    "viewershipRank": 1,
    "description": "Short description",
    "fact": "Interesting fact or statistic"
  }
]

Rules:
- Exactly ${count} items
- viewershipRank 1-${count} (1=most popular)
- Relevant emojis
- Brief descriptions
- Add an interesting FACT for each item (sales numbers, awards, records, etc.)
- Facts should be specific and impressive (e.g., "Sold 50 million units" or "Won 7 Academy Awards")
- Valid JSON only`;

    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${count} items for: "${prompt}"` }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message.content.trim();

    // Try to extract JSON if it's wrapped in markdown code blocks
    let jsonText = responseText;
    if (responseText.includes('```')) {
      const match = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (match) {
        jsonText = match[1];
      }
    }

    // Try to find JSON array in the response
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const gameData = JSON.parse(jsonText);

    // Validate the response
    if (!Array.isArray(gameData) || gameData.length === 0) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure we have the requested number of items (pad or trim if needed)
    let finalData = gameData.slice(0, count);

    // Validate and fix each item
    finalData = finalData.map((item, index) => ({
      id: item.id || index + 1,
      title: item.title || `Item ${index + 1}`,
      years: item.years || item.year || 'N/A',
      image: item.image || item.emoji || '⭐',
      viewershipRank: item.viewershipRank || item.rank || index + 1,
      description: item.description || item.title || 'No description',
      fact: item.fact || item.interestingFact || 'A popular choice!'
    }));

    // If we have less than requested, log a warning
    if (finalData.length < count) {
      console.warn(`Only got ${finalData.length} items, expected ${count}`);
    }

    res.status(200).json({
      success: true,
      data: finalData,
      prompt: prompt,
      itemCount: finalData.length
    });

  } catch (error) {
    console.error('Error generating game:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      error: 'Failed to generate game',
      message: error.message,
      details: error.toString()
    });
  }
}
