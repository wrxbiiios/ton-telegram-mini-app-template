# Cyber Skull Shooter - TON Telegram Mini App

A multiplayer cyberpunk-themed shooter game built on the TON blockchain, featuring NFT-powered character upgrades and real-time multiplayer combat. Built with ReactJS, Tailwind CSS, Phaser 3, and integrated with TON blockchain for NFT support.

## 🎮 Game Features

### Core Gameplay
- **Top-down shooter mechanics** with smooth WASD/Arrow key movement
- **Click-to-shoot** or **Space bar** for auto-fire combat
- **Wave-based enemy spawning** with progressive difficulty
- **Cyberpunk skull player character** with neon visual effects
- **Real-time collision detection** and physics-based gameplay
- **Score multiplier system** based on wave progression

### NFT Integration (TON Blockchain)
- **NFT-powered upgrades** that enhance gameplay:
  - **⚔️ Weapon Upgrades**: Increased damage and fire rate
  - **🛡️ Armor Upgrades**: Extra health and damage reduction
  - **⚡ Ability Upgrades**: Special powers and enhanced capabilities
  - **🎨 Cosmetic Upgrades**: Character and weapon skins
- **Automatic stat application** when NFTs are owned in your TON wallet
- **NFT Inventory UI** to view and manage your collection
- **Real-time bonus display** in the game HUD

### Multiplayer Modes
- **🎯 Wave Survival (Solo)**: Survive endless enemy waves alone
- **👥 Team Deathmatch (2-4 Players)**: Cooperate against AI enemies
- **⚔️ Free for All (2-4 Players)**: Compete against other players and AI
- **WebSocket-based synchronization** for real-time multiplayer
- **Player position and health tracking** across all connected players
- **Global leaderboard** with blockchain-verified scores

### UI/UX
- **Cyberpunk-themed design** with neon colors and futuristic styling
- **Main menu** with game mode selection
- **In-game HUD** showing health, score, wave, and active NFT bonuses
- **NFT inventory screen** with detailed upgrade information
- **Global leaderboard** displaying top players
- **Responsive design** optimized for mobile and desktop

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- TON wallet (optional, for NFT features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wrxbiiios/ton-telegram-mini-app-template.git
   cd ton-telegram-mini-app-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in console)

5. Click on the **GAME** tab in the footer to start playing!

## 🎯 How to Play

### Controls
- **WASD** or **Arrow Keys**: Move your character
- **Mouse Click**: Shoot towards cursor
- **Space Bar**: Auto-fire in the direction you're facing
- **ESC**: Pause/Menu (via Menu button)

### Gameplay Tips
- Enemies spawn from all sides - stay mobile!
- Each wave increases enemy count and health
- Collect NFTs to boost your stats permanently
- Connect your TON wallet to unlock NFT upgrades
- Compete on the global leaderboard

## 🏗️ Project Structure

```
ton-telegram-mini-app-template/
├── public/              # Static assets
├── src/
│   ├── components/      # React UI components
│   │   ├── GameHUD.tsx          # In-game heads-up display
│   │   ├── GameMenu.tsx         # Main menu screen
│   │   ├── NFTInventory.tsx     # NFT collection viewer
│   │   ├── Leaderboard.tsx      # Global leaderboard
│   │   └── ...
│   ├── game/            # Phaser game engine code
│   │   ├── GameScene.ts         # Main game scene logic
│   │   ├── PhaserGame.tsx       # React-Phaser integration
│   │   ├── config.ts            # Game configuration
│   │   └── types.ts             # TypeScript interfaces
│   ├── pages/           # Page components
│   │   ├── GamePage.tsx         # Main game page
│   │   ├── Home.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── useTonConnect.ts     # TON wallet integration
│   │   └── ...
│   └── App.tsx          # Main app component
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## 🔧 Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Game Engine**: Phaser 3
- **Styling**: Tailwind CSS + DaisyUI
- **Blockchain**: TON (The Open Network)
  - TON Connect for wallet integration
  - NFT support via ton-core
- **Multiplayer**: Socket.io (client-ready, server required)
- **Build Tool**: Vite
- **State Management**: React hooks + TanStack Query

## 🎨 NFT Upgrade System

The game integrates with TON blockchain to fetch NFTs owned by the connected wallet. Each NFT provides specific bonuses:

### NFT Types
1. **Weapon NFTs** - Increase damage and fire rate
2. **Armor NFTs** - Boost health and provide shields
3. **Ability NFTs** - Grant special powers
4. **Cosmetic NFTs** - Change visual appearance

### How It Works
1. Connect your TON wallet via the header button
2. The game automatically fetches your NFTs
3. Bonuses are applied in real-time
4. View your collection in the NFT Inventory screen
5. All bonuses stack for maximum power!

## 🌐 Multiplayer Setup

**Note**: The game client is fully ready for multiplayer, but requires a separate WebSocket server for full functionality.

### Current Status
- ✅ Client-side multiplayer code implemented
- ✅ Socket.io client integration ready
- ✅ Player synchronization logic in place
- ⏳ WebSocket server needs to be deployed separately

### For Developers
To enable multiplayer, deploy a Socket.io server and update the connection URL in `src/game/PhaserGame.tsx`:

```typescript
socketRef.current = io('YOUR_WEBSOCKET_SERVER_URL');
```

## 📊 Leaderboard System

Scores can be stored on the TON blockchain for permanent verification. The current implementation shows a mock leaderboard - integrate with a smart contract for production use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Credits

Template brought to you by [TonPanda](https://tonpanda.com/).

Game features:
- Phaser 3 game engine
- TON blockchain integration
- Cyberpunk design inspiration