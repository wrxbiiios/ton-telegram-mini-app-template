# Quick Start Guide

Get the Cyberpunk Shooter game running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Telegram account (for bot testing)
- Code editor (VS Code recommended)

## Installation

```bash
# 1. Clone and install dependencies
cd ton-telegram-mini-app-template
npm install

# 2. Install backend dependencies
cd backend
npm install
cd ..
```

## Running Locally

### Terminal 1 - Frontend
```bash
npm run dev
```
Game will open at `http://localhost:5173`

### Terminal 2 - Backend (Optional)
```bash
cd backend
npm run dev
```
WebSocket server at `http://localhost:3001`

### Terminal 3 - Telegram Bot (Optional)
```bash
cd backend
cp .env.example .env
# Edit .env and add your TELEGRAM_BOT_TOKEN
npm run bot
```

## Quick Test

1. Open `http://localhost:5173` in your browser
2. Click "🎮 Play Cyberpunk Shooter"
3. Choose game mode and start playing
4. Use on-screen joystick and fire button

## Game Controls

### Mobile/Touch
- **Left joystick**: Move player
- **Right button**: Fire weapon
- **Auto-aim**: Targets nearest enemy

### Desktop (Fallback)
- **WASD**: Move
- **Mouse**: Aim
- **Click**: Shoot

## Key Features to Try

1. **Main Menu**: View your level and XP
2. **Settings**: Adjust audio, haptic, graphics
3. **Leaderboard**: See top players
4. **Game Lobby**: Choose single-player or co-op
5. **Campaign**: Play 10-wave mode
6. **Post-Match**: Share your score

## Building for Production

```bash
# Build frontend
npm run build

# Output in dist/ folder
# Deploy to Vercel, Netlify, etc.
```

## Telegram Bot Setup (Optional)

1. Talk to [@BotFather](https://t.me/botfather)
2. Create bot: `/newbot`
3. Copy token to `backend/.env`
4. Create Mini App: `/newapp`
5. Set app URL
6. Test: Send `/start` to your bot

## Project Structure

```
ton-telegram-mini-app-template/
├── src/
│   ├── components/game/     # Game components
│   ├── hooks/               # React hooks
│   └── pages/               # App pages
├── backend/
│   ├── server.js            # WebSocket server
│   └── telegram-bot.js      # Telegram bot
├── contracts/               # TON smart contracts
└── public/                  # Static assets
```

## Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
3. Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details

## Common Issues

### Port already in use
```bash
# Change port in vite.config.ts
# Or kill process: kill -9 $(lsof -t -i:5173)
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### WebSocket not connecting
- Make sure backend is running on port 3001
- Check CORS settings in backend/server.js

## Testing in Telegram

1. Deploy frontend to Vercel (free)
2. Deploy backend to Railway (free tier)
3. Configure bot with your URLs
4. Open bot in Telegram
5. Click "Play Game" button

## Development Tips

- Use Chrome DevTools for debugging
- Enable "Toggle Device Toolbar" for mobile testing
- Check Console for errors
- Use Network tab for WebSocket inspection

## Support

- **Documentation**: Check README.md files
- **Issues**: Open GitHub issue
- **Community**: Join Telegram group

## What You Can Modify

### Easy Customizations
- Enemy spawn rates (GameCanvas.tsx)
- Player health and speed (GameCanvas.tsx)
- Wave count (CyberpunkGame.tsx)
- Colors and themes (Tailwind classes)
- Button text and labels (UI components)

### Medium Difficulty
- Add new weapons
- Create new enemy types
- Add power-ups
- Customize UI layouts
- Add sound effects

### Advanced
- Implement full multiplayer sync
- Add MongoDB persistence
- Integrate TON wallet payments
- Deploy smart contracts
- Add more game modes

## Performance Tips

### For Development
- Keep browser DevTools closed for better FPS
- Use production build for testing performance
- Monitor Network tab for issues

### For Production
- Enable Vercel Edge Network
- Use CDN for assets
- Optimize images with WebP
- Enable compression

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Backend
cd backend
npm start                # Production mode
npm run dev              # Development mode
npm run bot              # Run Telegram bot

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

## Resources

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [TON Documentation](https://ton.org/docs)
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Ready to play? Run `npm run dev` and start gaming! 🎮**
