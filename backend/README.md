# Cyberpunk Shooter Backend

Backend server for the Telegram Mini App multiplayer cyberpunk shooter game.

## Features

- **WebSocket Server**: Real-time multiplayer with 2-player co-op support
- **Telegram Bot**: Commands for quick game access and stats
- **Room Management**: Create, join, and manage game rooms
- **Auto-matchmaking**: Quick match system pairs players in <2 seconds
- **Player Sync**: Optimized state synchronization every 100ms

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Get Telegram Bot Token:
   - Talk to [@BotFather](https://t.me/botfather)
   - Create a new bot with `/newbot`
   - Copy the token to `.env`

4. Configure Web App:
   - Use `/newapp` with BotFather
   - Set your web app URL
   - Update `WEB_APP_URL` in `.env`

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Run Telegram bot:
```bash
npm run bot
```

## API Endpoints

### REST API

- `GET /api/health` - Server health check
- `GET /api/rooms` - List active game rooms
- `POST /api/verify-telegram` - Verify Telegram user

### WebSocket Events

**Client → Server:**
- `create_room` - Create a new game room
- `join_room` - Join an existing room
- `quick_match` - Auto-matchmaking
- `leave_room` - Leave current room
- `ready` - Mark player as ready
- `player_update` - Update player state
- `game_event` - Send game event to other players

**Server → Client:**
- `connected` - Connection established
- `room_created` - Room created successfully
- `room_joined` - Joined room successfully
- `player_joined` - Another player joined
- `player_left` - Player left the room
- `player_ready` - Player marked as ready
- `game_start` - Game starting
- `player_state` - Other player's state update
- `game_event` - Game event from other player
- `error` - Error message

## Telegram Bot Commands

- `/start` - Welcome message and game launch
- `/play` - Launch the game
- `/profile` - View player stats
- `/leaderboard` - Global rankings
- `/dailies` - Daily challenges
- `/stats` - Detailed statistics
- `/share [room_id]` - Share game room
- `/claim` - Claim daily rewards
- `/shop` - Cosmetics shop
- `/nfts` - NFT collection
- `/help` - Show all commands

## Architecture

```
backend/
├── server.js           # WebSocket + Express server
├── telegram-bot.js     # Telegram bot handler
├── package.json        # Dependencies
└── .env.example        # Environment template
```

## Deployment

### Vercel/Netlify (Frontend)
Deploy the main app to Vercel or Netlify.

### Railway/Heroku (Backend)
Deploy the backend to Railway or Heroku for WebSocket support.

Example Railway deployment:
1. Create new project on Railway
2. Connect GitHub repository
3. Set environment variables
4. Deploy

## Performance Optimization

- **Auto-cleanup**: Removes empty rooms after 5 minutes
- **Connection limit**: Max 2 players per room
- **State compression**: Only sync essential data
- **Event batching**: Reduce WebSocket message frequency

## Security

- Telegram user verification via initData
- CORS configuration for production
- Connection rate limiting (TODO)
- Message validation (TODO)

## Future Enhancements

- [ ] MongoDB integration for persistent data
- [ ] Redis for session management
- [ ] TON blockchain integration
- [ ] NFT minting on achievements
- [ ] Leaderboard smart contracts
- [ ] Advanced matchmaking algorithm
- [ ] Spectator mode
- [ ] Replay system

## License

MIT
