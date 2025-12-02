import React, { useEffect, useState } from 'react';
import { getRoomData } from '../utils/roomManager';

const Results = ({ userRanking, onPlayAgain, isMultiplayer, roomCode, playerId }) => {
  const [allPlayers, setAllPlayers] = useState(null);

  useEffect(() => {
    if (isMultiplayer && roomCode) {
      const fetchPlayers = async () => {
        try {
          const roomData = await getRoomData(roomCode);
          setAllPlayers(roomData.players);
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      };
      fetchPlayers();
    }
  }, [isMultiplayer, roomCode]);

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

        <div className="text-center">
          <button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-cn-pink to-cn-blue hover:from-cn-blue hover:to-cn-pink text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
