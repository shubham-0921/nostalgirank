import React, { useState } from 'react';

const JoinRoom = ({ onJoin, onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode.trim() || !playerName.trim()) return;

    setIsJoining(true);
    setError('');

    try {
      await onJoin(roomCode.toUpperCase(), playerName);
    } catch (err) {
      setError(err.message || 'Failed to join room');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚪</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
            Join a Room
          </h1>
          <p className="text-gray-600">
            Enter the room code shared by your friend
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABCD"
              maxLength={4}
              className="w-full px-6 py-4 text-2xl font-bold text-center border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors uppercase tracking-widest"
              disabled={isJoining}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors"
              disabled={isJoining}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!roomCode.trim() || !playerName.trim() || isJoining}
            className={`
              w-full px-6 py-4 rounded-2xl font-bold text-white text-lg
              transition-all duration-200
              ${!roomCode.trim() || !playerName.trim() || isJoining
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105'
              }
            `}
          >
            {isJoining ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining Room...
              </span>
            ) : (
              'Join Room'
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={isJoining}
            className="w-full px-6 py-2 rounded-2xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
