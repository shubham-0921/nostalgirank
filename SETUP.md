# Quick Setup Guide

## Step 1: Get Your Anthropic API Key

1. Visit https://console.anthropic.com/
2. Sign up or log in to your account
3. Go to "API Keys" section
4. Click "Create Key"
5. Copy your new API key

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
```

Replace `your_api_key_here` with the actual API key you copied.

## Step 3: Test the App Locally

The app should already be running at http://localhost:5173/

Try both modes:
- **Classic Mode**: Works immediately (no API key needed)
- **AI Mode**: Requires the API key to be configured

## Step 4: Test AI Mode

1. Click on "AI Mode" on the landing page
2. Try a prompt like: "Best Pixar movies"
3. Wait 5-10 seconds for generation
4. Rank the generated items
5. See your results!

## Troubleshooting

### Error: "ANTHROPIC_API_KEY is not configured"
- Make sure your `.env` file exists in the root directory
- Verify the key is correct (no extra spaces)
- Restart the dev server: `npm run dev`

### Error: "Failed to generate game"
- Check your internet connection
- Verify your API key is valid
- Check the console for detailed error messages

### API Calls Failing in Development
- Vercel serverless functions need to be deployed to work
- For local development, you can either:
  - Deploy to Vercel and test there
  - Or modify the code to call Claude API directly from frontend (for testing only)

## Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key
5. Deploy!

Once deployed, the serverless function will work perfectly.

## Cost Estimate

- Claude 3.5 Sonnet costs ~$3 per million input tokens
- Each game generation uses ~500 tokens
- This means you can generate ~6,000 games for $1
- Very affordable for personal use!

## Next Steps

- Try various prompts in AI mode
- Share with friends
- Consider adding rate limiting for production
- Customize the styling to match your brand
