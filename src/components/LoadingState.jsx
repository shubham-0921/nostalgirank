import React, { useState, useEffect } from 'react';

const LoadingState = ({ prompt }) => {
  const [loadingText, setLoadingText] = useState('Analyzing your request...');

  const loadingSteps = [
    'Analyzing your request...',
    'Consulting the AI brain...',
    'Gathering the best items...',
    'Calculating rankings...',
    'Adding some nostalgia...',
    'Almost ready...',
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % loadingSteps.length;
      setLoadingText(loadingSteps[currentStep]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Spinning outer circle */}
            <div className="absolute inset-0 border-8 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-transparent border-t-purple-600 rounded-full animate-spin"></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Creating Your Game
          </h2>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-6">
            <p className="text-lg font-semibold text-gray-700">
              "{prompt}"
            </p>
          </div>

          <p className="text-xl text-purple-600 font-medium animate-pulse mb-8">
            {loadingText}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          This usually takes 5-10 seconds...
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
