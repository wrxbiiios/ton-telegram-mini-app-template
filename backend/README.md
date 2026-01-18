# Cyberpunk NFT Shooter - Backend Server

## Overview
Node.js/Express backend server with WebSocket support for real-time multiplayer gameplay.

## Features
- **WebSocket Server** (Socket.io) for real-time communication
- **REST API** for player profiles, NFTs, and leaderboards
- **TON Blockchain Integration** for NFT verification
- **Game State Management** for multiplayer sessions
- **Anti-Cheat Validation** (server-side verification)

## Setup

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file:
```
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/cyberpunk-shooter
TON_API_KEY=your_ton_api_key
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify TON wallet signature

### Player
- `GET /api/player/profile/:address` - Get player profile
- `GET /api/player/nfts/:address` - Get player's NFT collection

### Game
- `GET /api/games` - List active game rooms
- `POST /api/match/create` - Create new match
- `GET /api/match/history/:playerId` - Get match history

### Leaderboard
- `GET /api/leaderboard` - Get global rankings
- `GET /api/leaderboard/season/:season` - Get seasonal rankings

## WebSocket Events

### Client → Server
- `join_room` - Join game room
- `player_move` - Update player position
- `player_shoot` - Fire weapon
- `enemy_hit` - Enemy damage event

### Server → Client
- `joined_room` - Room join confirmation
- `player_joined` - New player joined
- `player_left` - Player disconnected
- `game_state` - Full game state update
- `player_moved` - Player position update
- `player_shot` - Player fired weapon
- `enemy_damaged` - Enemy took damage

## Smart Contract Integration

The backend interacts with TON blockchain smart contracts:

1. **GameCharacterNFT.fc** - Character NFT ownership verification
2. **WeaponUpgradeNFT.fc** - Weapon NFT stats and upgrades
3. **GameTokenContract.fc** - $SKULL token rewards distribution
4. **LeaderboardContract.fc** - On-chain leaderboard updates

## Database Schema (MongoDB)

### Players
```typescript
{
  walletAddress: string,
  username: string,
  level: number,
  xp: number,
  kills: number,
  deaths: number,
  gamesPlayed: number,
  achievements: string[],
  createdAt: Date
}
```

### Matches
```typescript
{
  matchId: string,
  players: string[],
  winner: string,
  finalWave: number,
  duration: number,
  timestamp: Date
}
```

## License
MIT
