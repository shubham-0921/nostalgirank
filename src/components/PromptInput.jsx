import React, { useState } from 'react';

const PromptInput = ({ onGenerate, onJoinRoom }) => {
  const [prompt, setPrompt] = useState('');
  const [itemCount, setItemCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState(null); // null, 'solo', 'multiplayer'

  const suggestedPrompts = [
    { emoji: '🎬', text: 'Best Pixar movies', category: 'Movies' },
    { emoji: '🎵', text: 'Taylor Swift albums', category: 'Music' },
    { emoji: '🍕', text: 'Pizza toppings', category: 'Food' },
    { emoji: '🏎️', text: 'Italian sports cars', category: 'Cars' },
    { emoji: '🎮', text: 'Nintendo Switch games', category: 'Games' },
    { emoji: '📺', text: 'Classic sitcoms from the 90s', category: 'TV Shows' },
    { emoji: '☕', text: 'Coffee drinks at Starbucks', category: 'Beverages' },
    { emoji: '🦸', text: 'Marvel Cinematic Universe movies', category: 'Superheroes' },
  ];

  const handleSubmit = async (e, gameMode) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      await onGenerate(prompt, itemCount, gameMode);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    setPrompt(suggestionText);
  };

  // Show mode selection first
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
              NostalgiRank
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Rank anything with AI-powered lists
            </p>
            <p className="text-sm text-gray-500">
              Choose how you want to play
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Solo Mode */}
            <button
              onClick={() => setMode('solo')}
              className="group relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-200 text-left"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Play Solo</h3>
              <p className="text-gray-600 mb-4">
                Create a custom ranking game and compare your choices to the consensus
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                Start Solo Game
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Multiplayer Mode */}
            <button
              onClick={() => setMode('multiplayer')}
              className="group relative bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-200 text-left"
            >
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Play with Friends</h3>
              <p className="text-gray-600 mb-4">
                Create a room and invite friends to rank together in real-time
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Start Multiplayer
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Join Room Button */}
          <div className="text-center">
            <button
              onClick={onJoinRoom}
              className="text-gray-600 hover:text-gray-800 font-semibold underline"
            >
              Or join an existing room →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
            NostalgiRank
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {mode === 'solo' ? 'Play Solo' : 'Play with Friends'}
          </p>
          <p className="text-sm text-gray-500">
            Tell us what you want to rank, and we'll generate a custom game for you
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, mode)} className="mb-8">
          <div className="relative mb-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Best sci-fi movies from the 2010s' or 'Classic rock bands'"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
              disabled={isGenerating}
            />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold">Number of items:</span>
              <input
                type="number"
                min="3"
                max="15"
                value={itemCount}
                onChange={(e) => setItemCount(Math.max(3, Math.min(15, parseInt(e.target.value) || 6)))}
                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-center"
                disabled={isGenerating}
              />
            </label>
            <div className="flex gap-1">
              {[4, 6, 8, 10].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setItemCount(count)}
                  disabled={isGenerating}
                  className={`
                    px-3 py-1 rounded-lg text-sm font-medium transition-all
                    ${itemCount === count
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                    ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`
              w-full px-6 py-4 rounded-2xl font-bold text-white text-lg
              transition-all duration-200
              ${!prompt.trim() || isGenerating
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105'
              }
            `}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating {itemCount} items...
              </span>
            ) : (
              mode === 'solo'
                ? `Generate ${itemCount} Items ✨`
                : `Create Room & Generate ${itemCount} Items 🎮`
            )}
          </button>

          <button
            type="button"
            onClick={() => setMode(null)}
            disabled={isGenerating}
            className="w-full mt-3 px-6 py-2 rounded-2xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
          >
            ← Back to mode selection
          </button>
        </form>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Or try one of these:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedPrompts.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                disabled={isGenerating}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200
                  text-left transition-all duration-200
                  ${isGenerating
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-purple-400 hover:bg-purple-50 hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <div className="text-3xl">{suggestion.emoji}</div>
                <div className="flex-grow">
                  <div className="font-semibold text-gray-800">{suggestion.text}</div>
                  <div className="text-xs text-gray-500">{suggestion.category}</div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Tips for great prompts:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Be specific: "Best action movies from the 1980s" works better than just "movies"</li>
            <li>• Add context: "Cars under $30k" or "Shows suitable for kids"</li>
            <li>• Get creative: "Best pizza toppings" or "Most iconic sneakers"</li>
            <li>• Adjust the number: Fewer items (4-6) for quick games, more (10-15) for deeper rankings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
