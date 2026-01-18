# API Documentation - Cyberpunk NFT Shooter

## Base URL
- Development: `http://localhost:3001`
- Production: `https://api.your-domain.com`

## Authentication
Most endpoints require TON wallet authentication via signature verification.

### Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## REST API Endpoints

### Health Check

#### `GET /api/health`
Check server status

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1642345678901
}
```

---

### Authentication

#### `POST /api/auth/verify`
Verify TON wallet ownership

**Request Body:**
```json
{
  "walletAddress": "EQD...",
  "signature": "base64_signature",
  "message": "Sign in to Cyberpunk Shooter"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "walletAddress": "EQD...",
  "expiresIn": 86400
}
```

---

### Player

#### `GET /api/player/profile/:address`
Get player profile and statistics

**Parameters:**
- `address` (string): TON wallet address

**Response:**
```json
{
  "address": "EQD...",
  "username": "Player123",
  "level": 15,
  "xp": 12500,
  "totalKills": 1250,
  "totalDeaths": 85,
  "highestWave": 25,
  "gamesPlayed": 42,
  "winRate": 0.65,
  "createdAt": "2024-01-01T00:00:00Z",
  "lastPlayed": "2024-01-15T10:30:00Z"
}
```

#### `PUT /api/player/profile`
Update player profile

**Request Body:**
```json
{
  "username": "NewUsername",
  "avatar": "url_or_nft_id"
}
```

**Response:**
```json
{
  "success": true,
  "profile": { ... }
}
```

#### `GET /api/player/nfts/:address`
Get player's NFT collection

**Response:**
```json
{
  "characters": [
    {
      "tokenId": "1",
      "name": "Cyber Skull #1",
      "rarity": "legendary",
      "generation": 1,
      "stats": {
        "healthBonus": 20,
        "damageBonus": 15,
        "speedBonus": 10
      },
      "imageUrl": "ipfs://..."
    }
  ],
  "weapons": [
    {
      "tokenId": "42",
      "weaponType": "plasma_rifle",
      "level": 5,
      "rarity": "epic",
      "stats": {
        "damageMultiplier": 1.5,
        "fireRateBonus": 0.2
      }
    }
  ],
  "armor": []
}
```

#### `GET /api/player/stats/:address`
Detailed player statistics

**Response:**
```json
{
  "address": "EQD...",
  "combat": {
    "totalKills": 1250,
    "totalDeaths": 85,
    "kdr": 14.7,
    "accuracy": 0.68,
    "headshots": 320,
    "favoriteWeapon": "plasma_rifle"
  },
  "progression": {
    "level": 15,
    "xp": 12500,
    "nextLevelXp": 15000,
    "skillPoints": 3
  },
  "achievements": [
    {
      "id": "first_blood",
      "name": "First Blood",
      "unlockedAt": "2024-01-02T15:30:00Z"
    }
  ]
}
```

---

### Game Management

#### `GET /api/games`
List active game rooms

**Query Parameters:**
- `status` (optional): "waiting" | "in_progress" | "finished"
- `gameMode` (optional): "cooperative" | "pvp" | "ranked"

**Response:**
```json
[
  {
    "id": "room_1642345678901",
    "name": "Epic Battle #1",
    "hostId": "EQD...",
    "playerCount": 2,
    "maxPlayers": 4,
    "gameMode": "cooperative",
    "status": "waiting",
    "wave": 1,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### `POST /api/match/create`
Create new game room

**Request Body:**
```json
{
  "name": "My Epic Game",
  "maxPlayers": 4,
  "gameMode": "cooperative",
  "isPrivate": false,
  "password": "optional_password"
}
```

**Response:**
```json
{
  "roomId": "room_1642345678901",
  "status": "created",
  "joinCode": "ABC123"
}
```

#### `GET /api/match/history/:playerId`
Get player's match history

**Parameters:**
- `playerId` (string): Player's wallet address

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)

**Response:**
```json
{
  "matches": [
    {
      "matchId": "match_123",
      "gameMode": "cooperative",
      "finalWave": 18,
      "kills": 145,
      "deaths": 3,
      "score": 12500,
      "duration": 1800,
      "result": "victory",
      "players": ["EQD...", "EQD..."],
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 5,
    "totalMatches": 92
  }
}
```

---

### Leaderboard

#### `GET /api/leaderboard`
Get global leaderboard

**Query Parameters:**
- `season` (optional): Season number
- `timeframe`: "all_time" | "monthly" | "weekly" | "daily"
- `limit` (number): Results to return (default: 100)

**Response:**
```json
{
  "season": 1,
  "timeframe": "all_time",
  "entries": [
    {
      "rank": 1,
      "playerId": "EQD...",
      "username": "ProGamer",
      "score": 125000,
      "kills": 5420,
      "highestWave": 50,
      "gamesPlayed": 120,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "playerRank": 42
}
```

#### `GET /api/leaderboard/season/:season`
Get leaderboard for specific season

**Response:** Same as above

---

### Achievements

#### `GET /api/achievements`
List all achievements

**Response:**
```json
[
  {
    "id": "first_blood",
    "name": "First Blood",
    "description": "Get your first kill",
    "icon": "🩸",
    "rarity": "common",
    "reward": {
      "xp": 100,
      "tokens": 10
    }
  }
]
```

#### `GET /api/achievements/:playerId`
Get player's achievements

**Response:**
```json
{
  "unlocked": [
    {
      "id": "first_blood",
      "unlockedAt": "2024-01-02T15:30:00Z",
      "progress": 1,
      "maxProgress": 1
    }
  ],
  "locked": [
    {
      "id": "boss_slayer",
      "progress": 3,
      "maxProgress": 10
    }
  ]
}
```

---

### NFT Marketplace

#### `GET /api/marketplace/listings`
Get NFT marketplace listings

**Query Parameters:**
- `type`: "character" | "weapon" | "armor"
- `rarity`: "common" | "rare" | "epic" | "legendary"
- `minPrice` (number)
- `maxPrice` (number)
- `sort`: "price_asc" | "price_desc" | "recent"

**Response:**
```json
{
  "listings": [
    {
      "listingId": "list_123",
      "nftType": "character",
      "tokenId": "42",
      "seller": "EQD...",
      "price": 100,
      "currency": "TON",
      "rarity": "legendary",
      "stats": { ... },
      "listedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Client → Server Events

#### `join_room`
Join a game room

**Payload:**
```json
{
  "roomId": "room_1642345678901",
  "username": "Player123",
  "characterNFT": "optional_nft_id"
}
```

#### `leave_room`
Leave current room

**Payload:**
```json
{
  "roomId": "room_1642345678901"
}
```

#### `player_move`
Update player position

**Payload:**
```json
{
  "position": { "x": 400, "y": 300 },
  "rotation": 1.57,
  "velocity": { "x": 5, "y": 0 }
}
```

#### `player_shoot`
Fire weapon

**Payload:**
```json
{
  "position": { "x": 400, "y": 300 },
  "direction": { "x": 1, "y": 0 },
  "weaponType": "plasma_rifle"
}
```

#### `enemy_hit`
Report enemy damage

**Payload:**
```json
{
  "enemyId": "enemy_123",
  "damage": 25,
  "isCritical": false
}
```

#### `collect_powerup`
Collect power-up

**Payload:**
```json
{
  "powerupId": "powerup_123"
}
```

---

### Server → Client Events

#### `joined_room`
Confirmation of room join

**Payload:**
```json
{
  "roomId": "room_1642345678901",
  "playerId": "socket_id",
  "players": [ ... ]
}
```

#### `player_joined`
New player joined room

**Payload:**
```json
{
  "id": "player_id",
  "username": "NewPlayer",
  "position": { "x": 400, "y": 300 }
}
```

#### `player_left`
Player left room

**Payload:**
```json
{
  "playerId": "player_id"
}
```

#### `game_state`
Full game state update

**Payload:**
```json
{
  "players": [ ... ],
  "enemies": [ ... ],
  "bullets": [ ... ],
  "powerUps": [ ... ],
  "wave": 5,
  "score": 5000
}
```

#### `player_moved`
Player position update

**Payload:**
```json
{
  "playerId": "player_id",
  "position": { "x": 400, "y": 300 },
  "rotation": 1.57
}
```

#### `player_shot`
Player fired weapon

**Payload:**
```json
{
  "playerId": "player_id",
  "bulletId": "bullet_123",
  "position": { "x": 400, "y": 300 },
  "direction": { "x": 1, "y": 0 }
}
```

#### `enemy_damaged`
Enemy took damage

**Payload:**
```json
{
  "enemyId": "enemy_123",
  "damage": 25,
  "playerId": "player_id",
  "remainingHealth": 75
}
```

#### `enemy_killed`
Enemy eliminated

**Payload:**
```json
{
  "enemyId": "enemy_123",
  "playerId": "player_id",
  "reward": {
    "xp": 50,
    "tokens": 5
  }
}
```

#### `wave_complete`
Wave finished

**Payload:**
```json
{
  "wave": 5,
  "bonus": 1000,
  "nextWave": 6,
  "countdown": 10
}
```

#### `game_over`
Game ended

**Payload:**
```json
{
  "finalWave": 18,
  "finalScore": 125000,
  "stats": {
    "kills": 450,
    "deaths": 5,
    "accuracy": 0.72
  },
  "rewards": {
    "xp": 5000,
    "tokens": 250,
    "nfts": []
  }
}
```

#### `error`
Error occurred

**Payload:**
```json
{
  "code": "ROOM_FULL",
  "message": "Room is at maximum capacity"
}
```

---

## Error Codes

| Code | Message |
|------|---------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

- **General API**: 100 requests per minute
- **WebSocket events**: 60 events per second
- **Authentication**: 5 attempts per minute
- **Marketplace**: 30 requests per minute

## Webhooks

Subscribe to game events via webhooks:

**POST /api/webhooks/subscribe**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["player_achievement", "nft_minted"]
}
```

---

## SDKs & Libraries

### JavaScript/TypeScript
```bash
npm install cyberpunk-shooter-sdk
```

```typescript
import { CyberpunkAPI } from 'cyberpunk-shooter-sdk';

const api = new CyberpunkAPI({
  apiUrl: 'http://localhost:3001',
  token: 'your_jwt_token'
});

const profile = await api.player.getProfile('EQD...');
```

---

For support, visit [GitHub Issues](https://github.com/wrxbiiios/ton-telegram-mini-app-template/issues)
