import React, { useEffect, useState } from 'react';
import { listenToRoom, getPlayerCount, getSubmittedCount } from '../utils/roomManager';

const WaitingRoom = ({ roomCode, playerId, onAllSubmitted }) => {
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    // Listen to room updates
    const unsubscribe = listenToRoom(roomCode, (data) => {
      setRoomData(data);

      // Check if all players have submitted
      const totalPlayers = Object.keys(data.players || {}).length;
      const submittedPlayers = Object.values(data.players || {}).filter(p => p.submitted).length;

      if (submittedPlayers === totalPlayers && totalPlayers > 0) {
        // All players submitted, proceed to results
        setTimeout(() => {
          onAllSubmitted();
        }, 1500); // Small delay to show "All submitted!" message
      }
    });

    return () => unsubscribe();
  }, [roomCode, onAllSubmitted]);

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  const playerCount = getPlayerCount(roomData);
  const submittedCount = getSubmittedCount(roomData);
  const allSubmitted = submittedCount === playerCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
          {/* Header */}
          <div className="text-center mb-8">
            {allSubmitted ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-4xl font-bold text-green-600 mb-4">
                  All Rankings Submitted!
                </h1>
                <p className="text-xl text-gray-700">
                  Calculating results...
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">⏳</div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Waiting for Others
                </h1>
                <p className="text-xl text-gray-700 mb-2">
                  You've submitted your ranking!
                </p>
                <p className="text-lg text-gray-600">
                  {submittedCount} of {playerCount} players have submitted
                </p>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(submittedCount / playerCount) * 100}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              {submittedCount}/{playerCount} submitted
            </p>
          </div>

          {/* Players List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Player Status
            </h3>
            <div className="space-y-2">
              {Object.entries(roomData.players || {}).map(([pid, player]) => (
                <div
                  key={pid}
                  className={`flex items-center gap-3 border-2 rounded-xl p-4 transition-all ${
                    player.submitted
                      ? 'bg-green-50 border-green-400'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    player.submitted
                      ? 'bg-green-600'
                      : 'bg-gray-400'
                  }`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-800">
                      {player.name}
                      {player.isHost && (
                        <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                          HOST
                        </span>
                      )}
                      {pid === playerId && (
                        <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {player.submitted ? (
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Submitted
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Ranking...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              📊 Game Info
            </h4>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Prompt:</strong> "{roomData.prompt}"
            </p>
            <p className="text-sm text-gray-700">
              <strong>Room Code:</strong> {roomCode}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="font-semibold text-gray-800 mb-3">💡 What's happening?</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Your ranking has been saved</span>
            </li>
            <li className="flex gap-2">
              <span>⏳</span>
              <span>Waiting for other players to finish ranking</span>
            </li>
            <li className="flex gap-2">
              <span>📊</span>
              <span>Once everyone submits, you'll see the results comparing all rankings!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
