import { ref, set, get, onValue, update, push } from 'firebase/database';
import { database } from '../firebase';

// Generate a 4-letter room code
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Generate a unique player ID
export const generatePlayerId = () => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new room
export const createRoom = async (prompt, itemCount, items, playerName = 'Host') => {
  let roomCode = generateRoomCode();
  const playerId = generatePlayerId();

  // Check if room code already exists, regenerate if needed
  let exists = true;
  while (exists) {
    const roomRef = ref(database, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) {
      exists = false;
    } else {
      roomCode = generateRoomCode();
    }
  }

  const roomData = {
    prompt,
    itemCount,
    items,
    createdAt: Date.now(),
    status: 'waiting',
    hostId: playerId,
    players: {
      [playerId]: {
        name: playerName,
        ranking: null,
        submitted: false,
        isHost: true,
        joinedAt: Date.now()
      }
    }
  };

  const roomRef = ref(database, `rooms/${roomCode}`);
  await set(roomRef, roomData);

  // Store player ID in localStorage
  localStorage.setItem('playerId', playerId);
  localStorage.setItem(`room_${roomCode}_playerName`, playerName);

  return { roomCode, playerId };
};

// Join an existing room
export const joinRoom = async (roomCode, playerName = 'Player') => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error('Room not found');
  }

  const roomData = snapshot.val();

  if (roomData.status === 'completed') {
    throw new Error('This game has already ended');
  }

  const playerId = generatePlayerId();

  // Add player to room
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  await set(playerRef, {
    name: playerName,
    ranking: null,
    submitted: false,
    isHost: false,
    joinedAt: Date.now()
  });

  // Store player ID in localStorage
  localStorage.setItem('playerId', playerId);
  localStorage.setItem(`room_${roomCode}_playerName`, playerName);

  return {
    playerId,
    roomData: roomData  // Return full room data including players
  };
};

// Submit player's ranking
export const submitRanking = async (roomCode, playerId, ranking) => {
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  await update(playerRef, {
    ranking,
    submitted: true,
    submittedAt: Date.now()
  });
};

// Listen to room updates
export const listenToRoom = (roomCode, callback) => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  return onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
};

// Get room data once
export const getRoomData = async (roomCode) => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error('Room not found');
  }

  return snapshot.val();
};

// Update room status
export const updateRoomStatus = async (roomCode, status) => {
  const statusRef = ref(database, `rooms/${roomCode}/status`);
  await set(statusRef, status);
};

// Get player count
export const getPlayerCount = (roomData) => {
  return Object.keys(roomData.players || {}).length;
};

// Get submitted count
export const getSubmittedCount = (roomData) => {
  return Object.values(roomData.players || {}).filter(p => p.submitted).length;
};

// Restart room with new prompt and items while keeping all players
export const restartRoom = async (roomCode, prompt, itemCount, items) => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error('Room not found');
  }

  const currentRoomData = snapshot.val();

  // Reset all players' ranking and submitted status
  const resetPlayers = {};
  Object.entries(currentRoomData.players).forEach(([playerId, playerData]) => {
    resetPlayers[playerId] = {
      ...playerData,
      ranking: null,
      submitted: false
    };
  });

  // Update room with new prompt and items, reset status
  await update(roomRef, {
    prompt,
    itemCount,
    items,
    status: 'lobby', // Set to lobby instead of waiting
    players: resetPlayers,
    restartedAt: Date.now()
  });

  return { success: true };
};
