# 🎮 Cyberpunk NFT Shooter - TON Blockchain Game

A comprehensive multiplayer cyberpunk-themed shooter game integrated with TON blockchain, featuring NFT characters, weapons, and on-chain leaderboards.

Originally based on the Ton-Telegram-Mini-App-Template by [TonPanda](https://tonpanda.com/).

## 🌟 Features

### Core Gameplay
- **Wave-based Survival**: Battle increasingly difficult enemy waves
- **8 Unique Weapons**: Plasma rifle, spread shot, homing missiles, energy blade, tesla coil, rail gun, grenade launcher, flamethrower
- **Advanced Enemy AI**: Multiple enemy types including melee, ranged, heavy, mini-bosses, and bosses every 5 waves
- **Real-time Physics**: Realistic bullet trajectories and collision detection
- **Power-ups System**: Shield bubbles, ammo multipliers, speed boosters, weapon rotation
- **Cyberpunk Aesthetic**: Neon visuals, grid effects, glowing particles

### Multiplayer (Backend Ready)
- **WebSocket-based Real-time Gameplay**: Socket.io for instant player synchronization
- **Game Rooms**: Create and join multiplayer sessions
- **Player Matchmaking**: Automated team balancing

### NFT Integration (TON Blockchain)
- **Character NFTs**: Unique cyberpunk skull characters with stat bonuses
- **Weapon NFTs**: Upgradeable weapons with rarity tiers
- **$SKULL Token**: In-game currency for rewards
- **On-Chain Leaderboard**: Permanent seasonal rankings

### Technology Stack
- **ReactJS + TypeScript**: Type-safe React components
- **Tailwind CSS**: Utility-first styling with cyberpunk theme
- **Vite**: Fast build tool with HMR
- **Node.js + Express**: Backend server
- **Socket.io**: Real-time WebSocket communication
- **TON Blockchain**: Smart contracts in FunC

## Getting Started

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tonpanda-lab/ton-telegram-mini-app-template.git
   ```

2. Install dependencies:
   ```bash
   cd ton-telegram-mini-app-template
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the game:
   - Frontend: http://localhost:5173
   - Game: http://localhost:5173/game

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/cyberpunk-shooter
TON_API_KEY=your_ton_api_key
EOF

# Start backend server
npm run dev
```

## 🎮 How to Play

### Controls
- **WASD / Arrow Keys**: Move player
- **Mouse**: Aim
- **Left Click**: Shoot

### Gameplay
1. Navigate to `/game` route
2. Click "START GAME"
3. Survive enemy waves
4. Collect power-ups
5. Earn score and climb the leaderboard

## 🏗️ Project Structure

### Frontend
```
src/
├── game/
│   ├── components/        # Game UI components
│   ├── hooks/            # Game logic hooks
│   ├── types/            # TypeScript definitions
│   └── constants/        # Game configuration
├── components/           # App UI components
└── pages/               # Route pages
```

### Backend
```
backend/
├── src/
│   └── server.ts        # WebSocket server
└── contracts/           # TON smart contracts
    ├── GameCharacterNFT.fc
    ├── WeaponUpgradeNFT.fc
    ├── GameTokenContract.fc
    └── LeaderboardContract.fc
```
   npm run dev
   ```

4. Access the game:
   - Frontend: http://localhost:5173
   - Game: http://localhost:5173/game

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/cyberpunk-shooter
TON_API_KEY=your_ton_api_key
EOF

# Start backend server
npm run dev
```

## 🎮 How to Play

### Controls
- **WASD / Arrow Keys**: Move player
- **Mouse**: Aim
- **Left Click**: Shoot

### Gameplay
1. Navigate to `/game` route
2. Click "START GAME"
3. Survive enemy waves
4. Collect power-ups
5. Earn score and climb the leaderboard

## 🏗️ Project Structure

### Frontend
```
src/
├── game/
│   ├── components/        # Game UI components
│   ├── hooks/            # Game logic hooks
│   ├── types/            # TypeScript definitions
│   └── constants/        # Game configuration
├── components/           # App UI components
└── pages/               # Route pages
```

### Backend
```
backend/
├── src/
│   └── server.ts        # WebSocket server
└── contracts/           # TON smart contracts
    ├── GameCharacterNFT.fc
    ├── WeaponUpgradeNFT.fc
    ├── GameTokenContract.fc
    └── LeaderboardContract.fc
```

## 🔗 Smart Contracts

The game includes four TON blockchain smart contracts:

1. **GameCharacterNFT.fc** - Cyberpunk skull character NFTs
2. **WeaponUpgradeNFT.fc** - Upgradeable weapon NFTs
3. **GameTokenContract.fc** - $SKULL token for rewards
4. **LeaderboardContract.fc** - On-chain leaderboard

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.