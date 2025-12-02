# Quick Start - AI Mode Setup (FREE!)

## What You Need

1. **FREE** Hugging Face API key
2. 3 minutes of your time

## Setup Steps

### 1. Get FREE API Key (2 minutes)

1. Go to https://huggingface.co/
2. Sign up (completely free!)
3. Go to Settings → Access Tokens: https://huggingface.co/settings/tokens
4. Click "New token"
5. Give it a name (e.g., "NostalgiaRank")
6. Select "Read" permissions
7. Copy your token (starts with `hf_...`)

### 2. Add API Key to Environment (30 seconds)

```bash
# Create .env file
echo "HUGGINGFACE_API_KEY=hf_xxxxx" > .env

# (Replace hf_xxxxx with your actual token)
```

### 3. Deploy to Vercel (1 minute)

```
1. Push code to GitHub
2. Go to vercel.com (free!)
3. Import your repo
4. Add environment variable:
   - Name: HUGGINGFACE_API_KEY
   - Value: Your HF token
5. Deploy!
```

## Why Hugging Face?

✅ **100% FREE** - No credit card required
✅ **Generous limits** - 1000s of requests per day
✅ **Good quality** - Uses Llama 3.2 (Meta's latest)
✅ **Fast** - Optimized inference
✅ **No expiration** - Free tier doesn't expire

## Testing Locally

**Important**: For local testing with Vercel functions:

```bash
# Install Vercel CLI
npm install -g vercel

# Run Vercel dev server
vercel dev
```

Then visit http://localhost:3000

## Try It Out!

Once deployed, try these prompts:

### Movies
- "Best Pixar movies"
- "Christopher Nolan films"
- "90s action movies"

### Music
- "Beatles albums"
- "Taylor Swift eras"
- "Best hip hop albums of all time"

### Food & Fun
- "Types of pizza"
- "Ice cream flavors"
- "Best pizza toppings"

### Other
- "Programming languages"
- "Dog breeds"
- "Italian sports cars"
- "Video game consoles"

## Tips for Good Prompts

✅ **Good**: "Best Marvel movies from the MCU"
- Specific and clear
- Well-defined category

❌ **Bad**: "movies"
- Too vague
- Won't generate interesting results

## Costs

🎉 **COMPLETELY FREE!**
- No credit card needed
- No hidden costs
- Generous rate limits
- Perfect for personal projects

## Hugging Face vs Paid APIs

| Feature | Hugging Face (Free) | Claude API (Paid) |
|---------|-------------------|------------------|
| Cost | FREE | ~$0.003/game |
| Quality | Good (Llama 3.2) | Excellent |
| Speed | Fast | Very fast |
| Rate Limit | 1000s/day | Pay per use |
| Setup | 2 minutes | Requires payment |

For this project, Hugging Face is perfect!

## Troubleshooting

### "HUGGINGFACE_API_KEY is not configured"
- Check your `.env` file exists
- Verify token starts with `hf_`
- Restart dev server

### "Rate limit exceeded"
- You've hit the free tier limit (rare)
- Wait a few minutes
- Or create another free account

### Model seems slower
- Free tier has queue
- Usually processes in 5-10 seconds
- Still faster than most alternatives!

## That's It!

You now have a completely FREE AI-powered ranking game! 🎉
