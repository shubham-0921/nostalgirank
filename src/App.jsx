import { useState } from 'react';
import PromptInput from './components/PromptInput';
import JoinRoom from './components/JoinRoom';
import RoomLobby from './components/RoomLobby';
import LoadingState from './components/LoadingState';
import RankingInterface from './components/RankingInterface';
import WaitingRoom from './components/WaitingRoom';
import Results from './components/Results';
import { shuffleArray } from './data/shows';
import { createRoom, joinRoom, submitRanking } from './utils/roomManager';

function App() {
  const [gameState, setGameState] = useState('prompt'); // 'prompt', 'joinRoom', 'loading', 'lobby', 'ranking', 'waiting', 'results'
  const [gameMode, setGameMode] = useState(null); // 'solo', 'multiplayer'
  const [shuffledShows, setShuffledShows] = useState([]);
  const [userRanking, setUserRanking] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [roomData, setRoomData] = useState(null);

  const handleGenerateGame = async (prompt, itemCount = 6, mode = 'solo') => {
    setCurrentPrompt(prompt);
    setGameMode(mode);
    setGameState('loading');

    try {
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, itemCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate game');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const items = result.data;

        if (mode === 'multiplayer') {
          // Create room and store items
          const { roomCode: code, playerId: pid } = await createRoom(prompt, itemCount, items, 'Host');
          setRoomCode(code);
          setPlayerId(pid);
          setRoomData({ prompt, items, itemCount, players: {} });
          setShuffledShows(shuffleArray(items));
          setGameState('lobby');
        } else {
          // Solo mode - go straight to ranking
          setShuffledShows(shuffleArray(items));
          setGameState('ranking');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating game:', error);
      alert('Failed to generate game. Please try again or check your API key configuration.');
      setGameState('prompt');
    }
  };

  const handleJoinRoom = async (code, playerName) => {
    try {
      const { playerId: pid, roomData: data } = await joinRoom(code, playerName);
      setRoomCode(code);
      setPlayerId(pid);
      setRoomData(data);
      setCurrentPrompt(data.prompt);
      setShuffledShows(shuffleArray(data.items));
      setGameMode('multiplayer');
      setGameState('lobby');
    } catch (error) {
      console.error('Error joining room:', error);
      throw error; // Re-throw so JoinRoom component can show the error
    }
  };

  const handleStartRanking = () => {
    setGameState('ranking');
  };

  const handleSubmit = async (ranking) => {
    setUserRanking(ranking);

    if (gameMode === 'multiplayer') {
      // Submit ranking to Firebase
      await submitRanking(roomCode, playerId, ranking.map(item => item.id));
      // Go to waiting room instead of results
      setGameState('waiting');
    } else {
      // Solo mode - go straight to results
      setGameState('results');
    }
  };

  const handleAllSubmitted = () => {
    setGameState('results');
  };

  const handlePlayAgain = () => {
    setUserRanking([]);
    setGameState('prompt');
    setCurrentPrompt('');
    setGameMode(null);
    setRoomCode('');
    setPlayerId('');
    setRoomData(null);
  };

  const handleBackToPrompt = () => {
    setGameState('prompt');
  };

  const handleShowJoinRoom = () => {
    setGameState('joinRoom');
  };

  return (
    <div className="App">
      {gameState === 'prompt' && (
        <PromptInput onGenerate={handleGenerateGame} onJoinRoom={handleShowJoinRoom} />
      )}
      {gameState === 'joinRoom' && (
        <JoinRoom onJoin={handleJoinRoom} onBack={handleBackToPrompt} />
      )}
      {gameState === 'loading' && (
        <LoadingState prompt={currentPrompt} />
      )}
      {gameState === 'lobby' && (
        <RoomLobby
          roomCode={roomCode}
          roomData={roomData}
          playerId={playerId}
          onStartRanking={handleStartRanking}
        />
      )}
      {gameState === 'ranking' && (
        <RankingInterface
          shows={shuffledShows}
          onSubmit={handleSubmit}
          onBack={handleBackToPrompt}
          prompt={currentPrompt}
          isMultiplayer={gameMode === 'multiplayer'}
          roomCode={roomCode}
        />
      )}
      {gameState === 'waiting' && (
        <WaitingRoom
          roomCode={roomCode}
          playerId={playerId}
          onAllSubmitted={handleAllSubmitted}
        />
      )}
      {gameState === 'results' && (
        <Results
          userRanking={userRanking}
          onPlayAgain={handlePlayAgain}
          prompt={currentPrompt}
          isMultiplayer={gameMode === 'multiplayer'}
          roomCode={roomCode}
          playerId={playerId}
        />
      )}
    </div>
  );
}

export default App;
