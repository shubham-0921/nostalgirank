import React from 'react';

const Landing = ({ onClassicMode, onAIMode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            NostalgiaRank
          </h1>
          <p className="text-xl text-gray-600">
            The ultimate ranking game - powered by nostalgia & AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Classic Mode */}
          <div className="bg-gradient-to-br from-cn-blue to-cn-pink rounded-2xl p-6 text-white hover:scale-105 transition-all duration-200 cursor-pointer" onClick={onClassicMode}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">📺</div>
              <h2 className="text-2xl font-bold mb-2">Classic Mode</h2>
              <p className="text-sm opacity-90">The Original Experience</p>
            </div>

            <div className="bg-white/20 rounded-xl p-4 mb-4 text-sm">
              <p className="mb-2">Rank iconic Cartoon Network shows:</p>
              <ul className="space-y-1 text-xs">
                <li>• Dexter's Laboratory</li>
                <li>• The Powerpuff Girls</li>
                <li>• Ed, Edd n Eddy</li>
                <li>• And 7 more classics!</li>
              </ul>
            </div>

            <button className="w-full bg-white text-cn-pink font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Play Classic Mode
            </button>
          </div>

          {/* AI Mode */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden" onClick={onAIMode}>
            <div className="absolute top-2 right-2 bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
              NEW ✨
            </div>

            <div className="text-center mb-4">
              <div className="text-6xl mb-3">🤖</div>
              <h2 className="text-2xl font-bold mb-2">AI Mode</h2>
              <p className="text-sm opacity-90">Rank Anything You Want!</p>
            </div>

            <div className="bg-white/20 rounded-xl p-4 mb-4 text-sm">
              <p className="mb-2">Generate custom rankings:</p>
              <ul className="space-y-1 text-xs">
                <li>• "Best 90s action movies"</li>
                <li>• "Italian sports cars"</li>
                <li>• "Taylor Swift albums"</li>
                <li>• Literally anything!</li>
              </ul>
            </div>

            <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Try AI Mode
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-3">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <div className="text-3xl mb-2">1️⃣</div>
              <p>Choose your mode or create custom rankings</p>
            </div>
            <div>
              <div className="text-3xl mb-2">2️⃣</div>
              <p>Drag & drop items from favorite to least favorite</p>
            </div>
            <div>
              <div className="text-3xl mb-2">3️⃣</div>
              <p>See how your taste compares to the consensus!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
