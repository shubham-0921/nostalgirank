import React, { useEffect, useState } from 'react';
import { listenToRoom, getPlayerCount, getSubmittedCount } from '../utils/roomManager';

const RoomLobby = ({ roomCode, roomData: initialRoomData, playerId, onStartRanking }) => {
  const [roomData, setRoomData] = useState(initialRoomData);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Listen to room updates
    const unsubscribe = listenToRoom(roomCode, (data) => {
      setRoomData(data);
    });

    return () => unsubscribe();
  }, [roomCode]);

  const playerCount = getPlayerCount(roomData);
  const isHost = roomData.players[playerId]?.isHost;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoom = async () => {
    const shareData = {
      title: 'Join my NostalgiRank game!',
      text: `Let's rank "${roomData.prompt}" together! Room code: ${roomCode}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyRoomCode();
      }
    } else {
      copyRoomCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
          {/* Room Info */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl px-6 py-3 mb-4">
              <p className="text-sm opacity-90">Room Code</p>
              <p className="text-4xl font-bold tracking-widest">{roomCode}</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              "{roomData.prompt}"
            </h2>
            <p className="text-gray-600">
              {roomData.itemCount} items to rank
            </p>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={copyRoomCode}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all"
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </span>
              )}
            </button>
            <button
              onClick={shareRoom}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </span>
            </button>
          </div>

          {/* Players List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Players ({playerCount})
            </h3>
            <div className="space-y-2">
              {Object.entries(roomData.players || {}).map(([pid, player]) => (
                <div
                  key={pid}
                  className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
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
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ready
                      </span>
                    ) : (
                      <span className="text-gray-400 font-semibold">Waiting...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartRanking}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            Start Ranking 🎮
          </button>

          {isHost && (
            <p className="text-center text-sm text-gray-500 mt-4">
              As the host, you can start the game anytime. Other players can join later!
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="font-semibold text-gray-800 mb-3">💡 How it works:</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex gap-2">
              <span>1️⃣</span>
              <span>Share the room code with your friends</span>
            </li>
            <li className="flex gap-2">
              <span>2️⃣</span>
              <span>Everyone ranks the same {roomData.itemCount} items independently</span>
            </li>
            <li className="flex gap-2">
              <span>3️⃣</span>
              <span>Submit your ranking when done</span>
            </li>
            <li className="flex gap-2">
              <span>4️⃣</span>
              <span>Compare everyone's rankings and see who matched the consensus!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
