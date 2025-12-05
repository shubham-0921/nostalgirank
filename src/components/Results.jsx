import React, { useEffect, useState, useRef } from 'react';
import { getRoomData, listenToRoom } from '../utils/roomManager';
import { getRandomPrompts } from '../data/prompts';

const Results = ({ userRanking, onPlayAgain, onNewGame, onRoomRestarted, isMultiplayer, roomCode, playerId }) => {
  const [allPlayers, setAllPlayers] = useState(null);
  const [showNewGameOptions, setShowNewGameOptions] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [itemCount, setItemCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const initialRestartedAtRef = useRef(null);
  const hasNotifiedRestartRef = useRef(false);

  useEffect(() => {
    if (isMultiplayer && roomCode) {
      // Reset refs when component mounts fresh
      hasNotifiedRestartRef.current = false;
      initialRestartedAtRef.current = null;
      let hasInitialized = false;

      const fetchPlayers = async () => {
        try {
          const roomData = await getRoomData(roomCode);
          setAllPlayers(roomData.players);
          // Store initial restartedAt timestamp only on first fetch
          if (!hasInitialized) {
            hasInitialized = true;
            initialRestartedAtRef.current = roomData.restartedAt || null;
            console.log('[Results] INITIALIZED - restartedAt:', initialRestartedAtRef.current);
          }
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      };
      fetchPlayers();

      // Listen for room updates to detect restart
      const unsubscribe = listenToRoom(roomCode, (data) => {
        console.log('[Results] Room update:', {
          restartedAt: data.restartedAt,
          initialRestartedAt: initialRestartedAtRef.current,
          hasNotified: hasNotifiedRestartRef.current,
          status: data.status
        });

        // Set initial on first listener update if fetch hasn't run yet
        if (!hasInitialized) {
          hasInitialized = true;
          initialRestartedAtRef.current = data.restartedAt || null;
          console.log('[Results] INITIALIZED from listener - restartedAt:', initialRestartedAtRef.current);
        }

        setAllPlayers(data.players);

        // Check if room was restarted by comparing restartedAt timestamp
        // Allow transition if: restartedAt exists AND it's different from what we saw initially
        if (data.restartedAt &&
            data.restartedAt !== initialRestartedAtRef.current &&
            !hasNotifiedRestartRef.current) {
          // Room has been restarted, notify parent to transition to lobby
          console.log('[Results] RESTART DETECTED! Calling onRoomRestarted');
          hasNotifiedRestartRef.current = true;
          if (onRoomRestarted) {
            onRoomRestarted(data);
          }
          // Update the initial timestamp so we don't keep detecting the same restart
          initialRestartedAtRef.current = data.restartedAt;
        }
      });

      return () => unsubscribe();
    }
  }, [isMultiplayer, roomCode, onRoomRestarted]);

  // Create a comparison array with both rankings
  const comparison = userRanking.map((show, index) => ({
    ...show,
    userRank: index + 1,
    actualRank: show.viewershipRank,
    difference: Math.abs((index + 1) - show.viewershipRank),
    matched: (index + 1) === show.viewershipRank,
  }));

  const matchCount = comparison.filter(item => item.matched).length;
  const perfectMatch = matchCount === userRanking.length;

  // Sort actual ranking by viewership
  const actualRanking = [...userRanking].sort((a, b) => a.viewershipRank - b.viewershipRank);

  const handleRandomPrompt = async () => {
    const randomPrompts = getRandomPrompts(1);
    const randomPrompt = randomPrompts[0].text;
    setIsGenerating(true);
    try {
      await onNewGame(randomPrompt, itemCount);
    } catch (error) {
      console.error('Error generating new game:', error);
      alert('Failed to generate new game. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomPrompt = async (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    try {
      await onNewGame(customPrompt, itemCount);
    } catch (error) {
      console.error('Error generating new game:', error);
      alert('Failed to generate new game. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cn-black mb-4">
            The Results Are In!
          </h1>
          {perfectMatch ? (
            <div className="text-2xl text-green-600 font-bold mb-2">
              🎉 Perfect Match! You nailed it! 🎉
            </div>
          ) : (
            <div className="text-xl text-gray-700 mb-2">
              You matched {matchCount} out of {userRanking.length} positions!
            </div>
          )}
          <p className="text-gray-600">
            Here's how your personal ranking compares to actual viewership data
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User's Ranking */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-cn-pink">
              Your Ranking
            </h2>
            <div className="space-y-2">
              {comparison.map((item) => (
                <div
                  key={item.id}
                  className={`
                    p-3 rounded-xl border-2 transition-all
                    ${item.matched
                      ? 'bg-green-50 border-green-400'
                      : 'bg-white border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${item.matched
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-br from-cn-pink to-cn-blue text-white'
                      }
                    `}>
                      {item.userRank}
                    </div>
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-grow">
                      <div className="font-semibold text-sm">{item.title}</div>
                    </div>
                    {item.matched && <div className="text-green-500 text-xl">✓</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Viewership Ranking */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-cn-blue">
              Actual Viewership Ranking
            </h2>
            <div className="space-y-2">
              {actualRanking.map((item) => {
                const userItem = comparison.find(c => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`
                      p-3 rounded-xl border-2 transition-all
                      ${userItem.matched
                        ? 'bg-green-50 border-green-400'
                        : 'bg-white border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold
                        ${userItem.matched
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-br from-cn-blue to-cn-yellow text-white'
                        }
                      `}>
                        {item.viewershipRank}
                      </div>
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-grow">
                        <div className="font-semibold text-sm">{item.title}</div>
                      </div>
                      {userItem.matched && <div className="text-green-500 text-xl">✓</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Multiplayer Rankings Comparison */}
        {isMultiplayer && allPlayers && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-cn-black">
              👥 All Players' Rankings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-3 font-bold text-gray-700">Item</th>
                    {Object.entries(allPlayers).map(([pid, player]) => (
                      <th key={pid} className="text-center p-3 font-bold text-gray-700">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-sm">
                            {player.name}
                            {pid === playerId && <span className="text-xs text-blue-600"> (You)</span>}
                          </div>
                        </div>
                      </th>
                    ))}
                    <th className="text-center p-3 font-bold text-gray-700">Consensus</th>
                  </tr>
                </thead>
                <tbody>
                  {userRanking.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.image}</span>
                          <span className="font-semibold text-sm">{item.title}</span>
                        </div>
                      </td>
                      {Object.entries(allPlayers).map(([pid, player]) => {
                        const playerRanking = player.ranking;
                        const rank = playerRanking ? playerRanking.indexOf(item.id) + 1 : '-';
                        const isCorrect = rank === item.viewershipRank;
                        return (
                          <td key={pid} className="text-center p-3">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                              isCorrect
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {rank}
                            </div>
                          </td>
                        );
                      })}
                      <td className="text-center p-3">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
                          {item.viewershipRank}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded-full bg-green-500"></span>
                = Matched the consensus ranking
              </span>
            </div>
          </div>
        )}

        {/* Fun Insights */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-cn-black">
            Interesting Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {comparison
              .filter(item => !item.matched && item.difference >= 3)
              .slice(0, 4)
              .map((item) => (
                <div key={item.id} className="bg-gradient-to-r from-cn-blue/10 to-cn-pink/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{item.image}</div>
                    <div className="font-bold">{item.title}</div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {item.userRank < item.actualRank ? (
                      <>
                        <span className="font-semibold">Hot take!</span> You ranked this #{item.userRank},
                        but it was actually #{item.actualRank} in viewership. Sounds like you have unique taste!
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">Interesting!</span> You ranked this #{item.userRank},
                        but it was actually #{item.actualRank} in viewership. Everyone else loved this one!
                      </>
                    )}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Interesting Facts Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-cn-black">
            💡 Did You Know?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actualRanking.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{item.image}</div>
                  <div className="font-bold text-gray-800">{item.title}</div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="text-purple-600 font-semibold">📊 </span>
                  {item.fact || 'A popular choice among fans!'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm mb-2">
            <strong>Data Source:</strong> Rankings and facts generated by AI based on popularity metrics and publicly available information.
          </p>
        </div>

        {/* New Game Options */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-cn-black">
            🎮 Ready for Another Round?
          </h2>

          {!showNewGameOptions ? (
            <div className="grid md:grid-cols-3 gap-4">
              {/* Random Prompt Button */}
              <button
                onClick={handleRandomPrompt}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <div className="text-3xl mb-2">🎲</div>
                    <div>Random Topic</div>
                    <div className="text-xs opacity-90 mt-1">Surprise me!</div>
                  </>
                )}
              </button>

              {/* Custom Prompt Button */}
              <button
                onClick={() => setShowNewGameOptions(true)}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-3xl mb-2">✏️</div>
                <div>Custom Topic</div>
                <div className="text-xs opacity-90 mt-1">Choose your own</div>
              </button>

              {/* Back to Menu Button */}
              <button
                onClick={onPlayAgain}
                disabled={isGenerating}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-3xl mb-2">🏠</div>
                <div>Back to Menu</div>
                <div className="text-xs opacity-90 mt-1">Start fresh</div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomPrompt} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., 'Best sci-fi movies from the 2010s' or 'Classic rock bands'"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
                  disabled={isGenerating}
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-4">
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

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!customPrompt.trim() || isGenerating}
                  className={`
                    flex-1 px-6 py-4 rounded-2xl font-bold text-white text-lg
                    transition-all duration-200
                    ${!customPrompt.trim() || isGenerating
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
                      Generating...
                    </span>
                  ) : (
                    `Generate ${itemCount} Items ✨`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewGameOptions(false);
                    setCustomPrompt('');
                  }}
                  disabled={isGenerating}
                  className="px-6 py-4 rounded-2xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {isMultiplayer && (
            <div className="mt-4 text-center text-sm text-gray-600 bg-blue-50 rounded-xl p-3">
              👥 <span className="font-semibold">Multiplayer mode:</span> All players in room <span className="font-mono font-bold">{roomCode}</span> will play together with the new topic
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
