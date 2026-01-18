import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Game state
interface Player {
  id: string;
  username: string;
  position: { x: number; y: number };
  health: number;
  score: number;
  roomId: string;
}

interface GameRoom {
  id: string;
  players: Map<string, Player>;
  bullets: any[];
  enemies: any[];
  wave: number;
  status: 'waiting' | 'in_progress' | 'finished';
}

const gameRooms = new Map<string, GameRoom>();
const playerRooms = new Map<string, string>();

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/auth/verify', (req: Request, res: Response) => {
  const { walletAddress, signature } = req.body;
  // TODO: Implement TON wallet verification
  res.json({ success: true, walletAddress });
});

app.get('/api/player/profile/:address', (req: Request, res: Response) => {
  const { address } = req.params;
  // TODO: Fetch from database
  res.json({
    address,
    username: 'Player',
    level: 1,
    xp: 0,
    kills: 0,
    deaths: 0
  });
});

app.get('/api/player/nfts/:address', (req: Request, res: Response) => {
  const { address } = req.params;
  // TODO: Fetch NFTs from TON blockchain
  res.json({ characters: [], weapons: [], armor: [] });
});

app.get('/api/leaderboard', (req: Request, res: Response) => {
  // TODO: Fetch from blockchain contract
  res.json({ season: 1, entries: [] });
});

app.get('/api/games', (req: Request, res: Response) => {
  const activeRooms = Array.from(gameRooms.values())
    .filter(room => room.status === 'waiting')
    .map(room => ({
      id: room.id,
      playerCount: room.players.size,
      maxPlayers: 4,
      status: room.status
    }));
  res.json(activeRooms);
});

app.post('/api/match/create', (req: Request, res: Response) => {
  const roomId = `room_${Date.now()}`;
  const newRoom: GameRoom = {
    id: roomId,
    players: new Map(),
    bullets: [],
    enemies: [],
    wave: 1,
    status: 'waiting'
  };
  gameRooms.set(roomId, newRoom);
  res.json({ roomId, status: 'created' });
});

// WebSocket event handlers
io.on('connection', (socket: Socket) => {
  console.log('Player connected:', socket.id);

  socket.on('join_room', (data: { roomId: string; username: string }) => {
    const { roomId, username } = data;
    const room = gameRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const player: Player = {
      id: socket.id,
      username,
      position: { x: 400, y: 300 },
      health: 100,
      score: 0,
      roomId
    };

    room.players.set(socket.id, player);
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);

    socket.emit('joined_room', { roomId, playerId: socket.id });
    io.to(roomId).emit('player_joined', player);
    io.to(roomId).emit('game_state', {
      players: Array.from(room.players.values()),
      enemies: room.enemies,
      bullets: room.bullets,
      wave: room.wave
    });
  });

  socket.on('player_move', (data: { position: { x: number; y: number }; rotation: number }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = gameRooms.get(roomId);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (player) {
      player.position = data.position;
      socket.to(roomId).emit('player_moved', {
        playerId: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    }
  });

  socket.on('player_shoot', (data: { position: { x: number; y: number }; direction: { x: number; y: number } }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    io.to(roomId).emit('player_shot', {
      playerId: socket.id,
      bulletId: `bullet_${Date.now()}_${Math.random()}`,
      position: data.position,
      direction: data.direction
    });
  });

  socket.on('enemy_hit', (data: { enemyId: string; damage: number }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    io.to(roomId).emit('enemy_damaged', {
      enemyId: data.enemyId,
      damage: data.damage,
      playerId: socket.id
    });
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    const roomId = playerRooms.get(socket.id);
    
    if (roomId) {
      const room = gameRooms.get(roomId);
      if (room) {
        room.players.delete(socket.id);
        io.to(roomId).emit('player_left', { playerId: socket.id });

        if (room.players.size === 0) {
          gameRooms.delete(roomId);
        }
      }
      playerRooms.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎮 WebSocket server ready`);
});

export default app;
