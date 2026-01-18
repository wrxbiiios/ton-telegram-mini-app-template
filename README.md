# Cyberpunk Shooter - Telegram Mini App

A multiplayer cyberpunk NFT shooter game optimized for Telegram Mini Apps with mobile-first design, built on the TON blockchain.

![Cyberpunk Shooter](public/logo-with-bg-min.png)

## 🎮 Features

### Core Gameplay
- **10-Wave Campaign**: Progressive difficulty single-player mode
- **2-Player Co-op**: Real-time multiplayer with WebSocket sync
- **Touch-Optimized Controls**: Joystick movement + tap-to-shoot
- **4 Enemy Types**: Drone, Trooper, Heavy Tank, Mini-Boss
- **5 Weapon Types**: Plasma Rifle, Shotgun, Missile Launcher, Energy Shield, Tesla Coil
- **Wave-Based Progression**: Dynamic enemy spawning system
- **Particle Effects**: Optimized visual effects for mobile

### Telegram Integration
- **Full WebApp SDK Integration**: Haptic feedback, theme colors, deep linking
- **Telegram Bot**: Quick access via commands (`/play`, `/profile`, `/leaderboard`)
- **Share to Telegram**: Post scores and achievements to channels
- **User Authentication**: Telegram user data for seamless login
- **Mobile-First Design**: Optimized for 375px width Telegram window
- **Dark/Light Theme Support**: Respects Telegram's theme settings

### TON Blockchain
- **GameToken Contract**: Simple token rewards for gameplay
- **Achievement NFTs**: Auto-mint NFTs for major milestones
- **Leaderboard Contract**: On-chain rankings with weekly rewards
- **TON Wallet Integration**: Direct payments for cosmetics

### Performance Optimizations
- **Service Worker**: Offline support and caching
- **Lazy Loading**: Assets loaded on-demand
- **Bundle Size**: Optimized to <5MB initial load
- **60 FPS**: Smooth gameplay on high-end devices
- **30 FPS Fallback**: Support for low-end phones
- **Battery Saver**: Reduced frame rate when battery low

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Telegram account
- TON wallet (optional, for blockchain features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wrxbiiios/ton-telegram-mini-app-template.git
cd ton-telegram-mini-app-template
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Start the development server:
```bash
npm run dev
```

5. Start the backend server (in a separate terminal):
```bash
cd backend
npm run dev
```

6. Start the Telegram bot (optional):
```bash
cd backend
cp .env.example .env
# Edit .env with your Telegram bot token
npm run bot
```

## 📱 Telegram Bot Setup

1. **Create Bot with BotFather**:
   - Open [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Copy the bot token to `backend/.env`

2. **Create Mini App**:
   - Send `/newapp` to BotFather
   - Select your bot
   - Provide app details and URL
   - Set the short name (e.g., `cyberpunk_shooter`)

3. **Configure Deep Links**:
   - Format: `https://t.me/YourBot/app?startapp=room_123`
   - Update `WEB_APP_URL` in `backend/.env`

## 🎯 Game Controls

### Mobile (Touch)
- **Left Side**: Movement joystick
- **Right Side**: Fire button (tap or hold)
- **Auto-Aim**: Weapon automatically targets nearest enemy

### Desktop (Fallback)
- **WASD**: Movement
- **Mouse**: Aim
- **Click**: Shoot
- **Space**: Special ability

## 🏗️ Project Structure

```
ton-telegram-mini-app-template/
├── src/
│   ├── components/
│   │   └── game/
│   │       ├── GameCanvas.tsx      # Main game loop
│   │       ├── GameHUD.tsx         # In-game UI
│   │       ├── GameLobby.tsx       # Pre-game lobby
│   │       ├── GameMenu.tsx        # Main menu
│   │       ├── Joystick.tsx        # Touch controls
│   │       └── PostMatch.tsx       # Post-game screen
│   ├── hooks/
│   │   ├── useTelegramWebApp.ts    # Telegram SDK hook
│   │   └── useServiceWorker.ts     # Offline support
│   ├── pages/
│   │   ├── CyberpunkGame.tsx       # Game page
│   │   ├── Home.tsx                # Landing page
│   │   └── Plan.tsx                # Info page
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── backend/
│   ├── server.js                   # WebSocket server
│   ├── telegram-bot.js             # Bot handler
│   └── package.json                # Backend dependencies
├── contracts/
│   ├── GameToken.fc                # Token contract
│   ├── AchievementNFT.fc           # NFT contract
│   └── Leaderboard.fc              # Leaderboard contract
├── public/
│   └── service-worker.js           # PWA support
└── package.json                    # Frontend dependencies
```

## 🎨 Customization

### Game Configuration
Edit game parameters in `src/components/game/GameCanvas.tsx`:
- Enemy spawn rates
- Wave difficulty
- Player stats
- Weapon properties

### Theme Colors
Telegram theme colors are automatically applied. Customize neon effects in component styles.

### Bot Commands
Add new commands in `backend/telegram-bot.js`:
```javascript
bot.onText(/\/mycommand/, (msg) => {
  // Your command logic
});
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Configure environment variables on platform
# Deploy via Git or CLI
```

### Environment Variables
**Backend:**
- `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather
- `WEB_APP_URL`: Your deployed app URL
- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: Database connection (optional)

## 📊 API Documentation

### WebSocket Events

**Client → Server:**
- `create_room`: Create new game room
- `join_room`: Join existing room
- `quick_match`: Auto-matchmaking
- `ready`: Mark player as ready
- `player_update`: Sync player state
- `game_event`: Send game event

**Server → Client:**
- `connected`: Connection established
- `room_created`: Room created
- `player_joined`: Player joined room
- `game_start`: Game starting
- `player_state`: Other player update

### Telegram Bot Commands
- `/start` - Welcome message
- `/play` - Launch game
- `/profile` - Player stats
- `/leaderboard` - Rankings
- `/dailies` - Daily challenges
- `/claim` - Claim rewards
- `/shop` - Cosmetics
- `/nfts` - NFT collection

## 🔧 Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Type Check
```bash
npm run build  # Runs TypeScript check
```

## 🛡️ Security

- Telegram user verification via `initData`
- CORS configuration for production
- Input validation on all endpoints
- Rate limiting (TODO)
- Message sanitization (TODO)

## 🗺️ Roadmap

- [x] Core game mechanics
- [x] Telegram integration
- [x] WebSocket multiplayer
- [x] Service worker
- [x] Smart contracts
- [ ] MongoDB integration
- [ ] NFT minting on achievements
- [ ] Advanced matchmaking
- [ ] Spectator mode
- [ ] Replay system
- [ ] Tournament mode

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- Built with [ReactJS](https://react.dev/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/)
- Telegram integration via [@twa-dev/sdk](https://www.npmjs.com/package/@twa-dev/sdk)
- TON blockchain support via [ton-core](https://github.com/ton-core/ton-core)
- Template by [TonPanda](https://tonpanda.com/)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For support, join our [Telegram Community](https://t.me/tonchina) or open an issue on GitHub.

---

Made with 💜 for the TON ecosystem
