# Ton-Telegram-Mini-App-Template

This is a template for developing Telegram mini apps on the TON blockchain. It is built using ReactJS, Tailwind CSS, and Vite to enable quick development of mini app user interfaces. Brought to you by [TonPanda](https://tonpanda.com/).

## Features

- **ReactJS**: A popular JavaScript library for building user interfaces, providing a component-based architecture and efficient rendering.
- **Tailwind CSS**: A utility-first CSS framework that allows for rapid styling and customization of the app's UI.
- **Vite**: A fast build tool that offers instant hot module replacement and optimized development experience.
- **Comprehensive Level System**: Full-featured level design system for game development (see below)

## 🎮 New: Cyberpunk Shooter Level System

This template now includes a complete level design and procedural generation system perfect for building Telegram-optimized games!

### Level System Features

- ✅ **60 Handcrafted Levels** across 7 unique themes
- ✅ **6 Epic Boss Battles** with multi-phase mechanics
- ✅ **Procedural Generation** with seed-based fairness
- ✅ **Daily & Weekly Challenges** for player engagement
- ✅ **7 Challenge Modes** (Time Attack, Survival, Pacifist, etc.)
- ✅ **Endless & Roguelike Modes** with dynamic difficulty
- ✅ **Complete Progression System** with star ratings
- ✅ **Prestige System** for replayability
- ✅ **Leaderboard System** (level, global, theme-based)
- ✅ **Progress Analytics** and statistics dashboard
- ✅ **Mobile-Optimized** for Telegram mini-apps

### Quick Start with Level System

```bash
# The level system is ready to use!
# Navigate to /game route to see it in action
npm run dev
# Open http://localhost:5173/game
```

### Documentation

- **[Level System Documentation](LEVEL_SYSTEM_README.md)** - Complete system overview
- **[Integration Examples](INTEGRATION_EXAMPLES.md)** - Code examples and best practices

### Level System Architecture

```
src/
├── types/
│   └── level.types.ts           # TypeScript definitions
├── data/
│   ├── themes.ts                # 7 themed environments
│   ├── bosses.ts                # 6 boss configurations
│   └── levels.ts                # 60 level definitions
├── utils/
│   ├── proceduralGenerator.ts   # Procedural level generation
│   ├── levelUtils.ts            # Level management utilities
│   ├── challengeModes.ts        # Challenge variants & endless mode
│   └── leaderboard.ts           # Leaderboard system
├── hooks/
│   └── useLevelSystem.ts        # React hook for level state
├── components/
│   ├── LevelSelector.tsx        # Level selection UI
│   ├── LeaderboardDisplay.tsx   # Leaderboard components
│   └── ProgressStats.tsx        # Statistics dashboard
└── pages/
    └── GamePage.tsx             # Main game interface
```

## Getting Started

To start using this template, follow these steps:

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

This will start a local development server at `http://localhost:3000`. You can now start developing your Telegram mini app using the provided template.

## Project Structure

The project structure is organized as follows:

```
ton-telegram-mini-app-template/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └──...
│   ├── pages/
│   │   └──...
│   ├── App.jsx
│   ├── index.jsx
│   └── tailwind.config.js
├── vite.config.js
└── package.json
```

- `public/`: Contains the static HTML file for the app.
- `src/`: Contains the source code of the app.
- `components/`: Contains reusable UI components.
- `pages/`: Contains the different pages of the app.
- `App.jsx`: The main application component.
- `index.jsx`: The entry point of the application.
- `tailwind.config.js`: The Tailwind CSS configuration file.
- `vite.config.js`: The Vite configuration file.
- `package.json`: Contains the project dependencies and scripts.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.