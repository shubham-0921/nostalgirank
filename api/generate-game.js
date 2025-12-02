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

  // Helper function to generate with retry logic
  async function generateWithRetry(hf, systemPrompt, userPrompt, maxRetries = 2) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Generation attempt ${attempt}/${maxRetries}`);

        const response = await hf.chatCompletion({
          model: "meta-llama/Llama-3.2-3B-Instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 2500,
          temperature: attempt === 1 ? 0.4 : 0.3, // Lower temperature on retry
        });

        return response;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw lastError;
  }

  try {
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const systemPrompt = `You are an expert ranking game generator. Your task is to create a list of items based on the user's topic.

CRITICAL REQUIREMENTS:
1. Generate EXACTLY ${count} items - no more, no less
2. Return ONLY a valid JSON array - no explanatory text, no markdown formatting, no code blocks
3. Each item must include ALL required fields with appropriate data

OUTPUT FORMAT (respond with ONLY this JSON structure):
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

FIELD SPECIFICATIONS:
- "id": Integer from 1 to ${count}
- "title": Clear, concise name (2-8 words maximum)
- "years": Relevant time period, year range, or era (e.g., "2010-2015", "1990s", "Season 1")
- "image": Single relevant emoji that represents the item
- "viewershipRank": Integer from 1 to ${count} representing consensus popularity (1 = most popular/beloved)
- "description": One sentence description (10-25 words) explaining what makes it notable
- "fact": Specific, impressive statistic or achievement (e.g., "Won 7 Academy Awards", "Sold 50 million copies", "Highest-rated episode with 9.8/10")

RANKING LOGIC:
- Rank items by genuine popularity, critical acclaim, cultural impact, or mainstream recognition
- Consider factors like: sales figures, awards won, critical reviews, cultural influence, fanbase size
- Rank 1 should be the most universally recognized/popular
- Rankings should reflect reality, not be arbitrary

QUALITY STANDARDS:
- Choose items that are well-known and representative of the topic
- Ensure diversity in the selection (different eras, styles, or types when applicable)
- Facts must be specific numbers or achievements, not vague statements
- Descriptions should be informative and highlight what makes each item special
- Emojis should be intuitive and relevant

EXAMPLES OF GOOD vs BAD:

GOOD fact: "Grossed $1.2 billion worldwide, the highest-grossing animated film of 2019"
BAD fact: "Very popular and loved by many people"

GOOD description: "A groundbreaking sci-fi series that revolutionized television storytelling with its complex narrative"
BAD description: "A show that people liked"

RESPONSE FORMAT:
Return ONLY the JSON array starting with [ and ending with ]. Do not include:
- Explanatory text before or after
- Markdown code blocks (no \`\`\`json)
- Comments or notes
- Any text outside the JSON structure`;

    const userPrompt = `Generate a ranking game with exactly ${count} items for the following topic:

Topic: "${prompt}"

Remember:
- Return ONLY the JSON array
- Exactly ${count} items
- All fields required for each item
- Rankings should reflect real-world popularity/acclaim
- Facts must be specific and impressive

Begin your response with [ and end with ]`;

    const response = await generateWithRetry(hf, systemPrompt, userPrompt);

    let responseText = response.choices[0].message.content.trim();
    console.log('Raw AI response length:', responseText.length);

    // Enhanced JSON extraction with multiple strategies
    let jsonText = responseText;

    // Strategy 1: Remove markdown code blocks
    if (responseText.includes('```')) {
      const match = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (match) {
        jsonText = match[1];
        console.log('Extracted from markdown code block');
      }
    }

    // Strategy 2: Find JSON array in the response (handles text before/after)
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    // Strategy 3: Clean common AI formatting issues
    jsonText = jsonText
      .replace(/^\s*Here's?\s+(?:the|your).*?:\s*/i, '') // Remove "Here's the JSON:"
      .replace(/\n\s*\/\/.*$/gm, '') // Remove line comments
      .replace(/,\s*\]/g, ']') // Remove trailing commas in arrays
      .replace(/,\s*\}/g, '}') // Remove trailing commas in objects
      .trim();

    let gameData;
    try {
      gameData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Attempted to parse:', jsonText.substring(0, 500));
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

    // Validate the response structure
    if (!Array.isArray(gameData)) {
      throw new Error('AI response is not an array');
    }

    if (gameData.length === 0) {
      throw new Error('AI returned empty array');
    }

    // Ensure we have the requested number of items
    let finalData = gameData.slice(0, count);

    // If we got fewer items than requested, log warning
    if (finalData.length < count) {
      console.warn(`AI returned ${finalData.length} items, expected ${count}`);
    }

    // Validate and normalize each item with strict requirements
    finalData = finalData.map((item, index) => {
      // Validate required fields exist
      if (!item.title || typeof item.title !== 'string') {
        console.warn(`Item ${index + 1} missing or invalid title, using fallback`);
      }

      return {
        id: Number(item.id) || index + 1,
        title: String(item.title || `Item ${index + 1}`).trim(),
        years: String(item.years || item.year || 'N/A').trim(),
        image: String(item.image || item.emoji || '⭐').trim(),
        viewershipRank: Number(item.viewershipRank || item.rank || index + 1),
        description: String(item.description || item.title || 'No description available').trim(),
        fact: String(item.fact || item.interestingFact || 'A notable entry in this category').trim()
      };
    });

    // Quality validation: check for placeholder/low-quality data
    const hasQualityIssues = finalData.some(item =>
      item.title.includes('Item ') ||
      item.description === 'No description available' ||
      item.fact === 'A notable entry in this category'
    );

    if (hasQualityIssues) {
      console.warn('Quality issues detected in AI response - some items have placeholder data');
    }

    res.status(200).json({
      success: true,
      data: finalData,
      prompt: prompt,
      itemCount: finalData.length,
      qualityWarning: hasQualityIssues ? 'Some items may have incomplete data' : null
    });

  } catch (error) {
    console.error('Error generating game:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Provide user-friendly error messages
    let userMessage = 'Failed to generate game';
    let statusCode = 500;

    if (error.message.includes('rate limit') || error.message.includes('429')) {
      userMessage = 'AI service is temporarily busy. Please try again in a moment.';
      statusCode = 429;
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      userMessage = 'Request timed out. Please try again.';
      statusCode = 504;
    } else if (error.message.includes('JSON')) {
      userMessage = 'AI generated an invalid response. Please try a different prompt or fewer items.';
      statusCode = 500;
    } else if (error.message.includes('API key')) {
      userMessage = 'Server configuration error. Please contact support.';
      statusCode = 500;
    }

    res.status(statusCode).json({
      error: userMessage,
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
      retryable: statusCode === 429 || statusCode === 504
    });
  }
}
