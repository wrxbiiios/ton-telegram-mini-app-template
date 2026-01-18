import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Game rooms storage
const rooms = new Map();
const players = new Map();

class GameRoom {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.maxPlayers = 2;
    this.gameState = 'waiting'; // waiting, playing, finished
    this.createdAt = Date.now();
  }

  addPlayer(playerId, ws) {
    if (this.players.length >= this.maxPlayers) {
      return false;
    }

    this.players.push({
      id: playerId,
      ws: ws,
      position: { x: 0, y: 0 },
      health: 100,
      score: 0,
      ready: false,
    });

    return true;
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
    
    if (this.players.length === 0) {
      return true; // Room should be deleted
    }
    
    return false;
  }

  broadcast(message, excludePlayerId = null) {
    this.players.forEach(player => {
      if (player.id !== excludePlayerId && player.ws.readyState === 1) {
        player.ws.send(JSON.stringify(message));
      }
    });
  }

  isFull() {
    return this.players.length >= this.maxPlayers;
  }

  canStart() {
    return this.players.length === this.maxPlayers && 
           this.players.every(p => p.ready);
  }
}

// Auto-cleanup old rooms
setInterval(() => {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  for (const [roomId, room] of rooms.entries()) {
    if (now - room.createdAt > maxAge && room.players.length === 0) {
      rooms.delete(roomId);
      console.log(`Cleaned up room ${roomId}`);
    }
  }
}, 60000); // Run every minute

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const playerId = generatePlayerId();
  players.set(playerId, { ws, roomId: null });
  
  console.log(`Player ${playerId} connected`);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(playerId, message, ws);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    handleDisconnect(playerId);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    playerId: playerId,
  }));
});

function handleMessage(playerId, message, ws) {
  const { type, data } = message;

  switch (type) {
    case 'create_room':
      handleCreateRoom(playerId, ws);
      break;
    
    case 'join_room':
      handleJoinRoom(playerId, data.roomId, ws);
      break;
    
    case 'quick_match':
      handleQuickMatch(playerId, ws);
      break;
    
    case 'leave_room':
      handleLeaveRoom(playerId);
      break;
    
    case 'ready':
      handleReady(playerId);
      break;
    
    case 'player_update':
      handlePlayerUpdate(playerId, data);
      break;
    
    case 'game_event':
      handleGameEvent(playerId, data);
      break;
    
    default:
      console.log(`Unknown message type: ${type}`);
  }
}

function handleCreateRoom(playerId, ws) {
  const roomId = generateRoomId();
  const room = new GameRoom(roomId);
  
  room.addPlayer(playerId, ws);
  rooms.set(roomId, room);
  
  const player = players.get(playerId);
  player.roomId = roomId;
  
  ws.send(JSON.stringify({
    type: 'room_created',
    roomId: roomId,
    playerCount: room.players.length,
  }));
  
  console.log(`Room ${roomId} created by player ${playerId}`);
}

function handleJoinRoom(playerId, roomId, ws) {
  const room = rooms.get(roomId);
  
  if (!room) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Room not found',
    }));
    return;
  }
  
  if (room.isFull()) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Room is full',
    }));
    return;
  }
  
  room.addPlayer(playerId, ws);
  const player = players.get(playerId);
  player.roomId = roomId;
  
  ws.send(JSON.stringify({
    type: 'room_joined',
    roomId: roomId,
    playerCount: room.players.length,
  }));
  
  // Notify other players
  room.broadcast({
    type: 'player_joined',
    playerId: playerId,
    playerCount: room.players.length,
  }, playerId);
  
  console.log(`Player ${playerId} joined room ${roomId}`);
}

function handleQuickMatch(playerId, ws) {
  // Find an available room
  let availableRoom = null;
  
  for (const [roomId, room] of rooms.entries()) {
    if (!room.isFull() && room.gameState === 'waiting') {
      availableRoom = room;
      break;
    }
  }
  
  // Create new room if none available
  if (!availableRoom) {
    handleCreateRoom(playerId, ws);
    return;
  }
  
  // Join available room
  handleJoinRoom(playerId, availableRoom.id, ws);
}

function handleLeaveRoom(playerId) {
  const player = players.get(playerId);
  if (!player || !player.roomId) return;
  
  const room = rooms.get(player.roomId);
  if (!room) return;
  
  const shouldDelete = room.removePlayer(playerId);
  player.roomId = null;
  
  if (shouldDelete) {
    rooms.delete(room.id);
    console.log(`Room ${room.id} deleted`);
  } else {
    room.broadcast({
      type: 'player_left',
      playerId: playerId,
      playerCount: room.players.length,
    });
  }
}

function handleReady(playerId) {
  const player = players.get(playerId);
  if (!player || !player.roomId) return;
  
  const room = rooms.get(player.roomId);
  if (!room) return;
  
  const roomPlayer = room.players.find(p => p.id === playerId);
  if (roomPlayer) {
    roomPlayer.ready = true;
    
    room.broadcast({
      type: 'player_ready',
      playerId: playerId,
    });
    
    if (room.canStart()) {
      room.gameState = 'playing';
      room.broadcast({
        type: 'game_start',
      });
      console.log(`Game started in room ${room.id}`);
    }
  }
}

function handlePlayerUpdate(playerId, data) {
  const player = players.get(playerId);
  if (!player || !player.roomId) return;
  
  const room = rooms.get(player.roomId);
  if (!room || room.gameState !== 'playing') return;
  
  // Update player state
  const roomPlayer = room.players.find(p => p.id === playerId);
  if (roomPlayer) {
    if (data.position) roomPlayer.position = data.position;
    if (data.health !== undefined) roomPlayer.health = data.health;
    if (data.score !== undefined) roomPlayer.score = data.score;
    
    // Broadcast to other players (with throttling handled by client)
    room.broadcast({
      type: 'player_state',
      playerId: playerId,
      state: {
        position: roomPlayer.position,
        health: roomPlayer.health,
        score: roomPlayer.score,
      },
    }, playerId);
  }
}

function handleGameEvent(playerId, data) {
  const player = players.get(playerId);
  if (!player || !player.roomId) return;
  
  const room = rooms.get(player.roomId);
  if (!room) return;
  
  // Broadcast game events to other players
  room.broadcast({
    type: 'game_event',
    playerId: playerId,
    event: data,
  }, playerId);
}

function handleDisconnect(playerId) {
  console.log(`Player ${playerId} disconnected`);
  handleLeaveRoom(playerId);
  players.delete(playerId);
}

function generateRoomId() {
  return 'room_' + Math.random().toString(36).substr(2, 9);
}

function generatePlayerId() {
  return 'player_' + Math.random().toString(36).substr(2, 9);
}

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    players: players.size,
  });
});

app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    gameState: room.gameState,
  }));
  
  res.json(roomList);
});

app.post('/api/verify-telegram', (req, res) => {
  // Verify Telegram initData
  // This should validate the signature from Telegram
  const { initData } = req.body;
  
  // TODO: Implement proper Telegram verification
  // For now, accept all requests
  res.json({
    valid: true,
    user: {
      id: 12345,
      username: 'demo_user',
    },
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`✅ Game server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});
