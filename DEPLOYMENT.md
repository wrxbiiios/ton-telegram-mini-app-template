# Deployment Guide

This guide will help you deploy the Cyberpunk Shooter game to production.

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository connected to Vercel

### Steps

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy via GitHub**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - Click "Deploy"

3. **Configure Environment Variables** (if needed):
   - Go to Project Settings → Environment Variables
   - Add any required variables

4. **Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain

### Manual Deployment

```bash
cd /path/to/ton-telegram-mini-app-template
vercel
```

Follow the prompts to deploy.

## Backend Deployment (Railway)

### Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository

### Steps

1. **Create New Project**:
   - Go to [railway.app/new](https://railway.app/new)
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Service**:
   - Root Directory: `/backend`
   - Start Command: `npm start`
   - Build Command: `npm install`

3. **Environment Variables**:
   - Go to Variables tab
   - Add the following:
     ```
     TELEGRAM_BOT_TOKEN=your_bot_token
     WEB_APP_URL=your_vercel_url
     PORT=3001
     NODE_ENV=production
     ```

4. **Deploy**:
   - Railway will automatically deploy on push
   - Note the provided URL (e.g., `https://your-app.railway.app`)

### Alternative: Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set WEB_APP_URL=your_frontend_url
git subtree push --prefix backend heroku main
```

## Telegram Bot Configuration

1. **Update Bot with BotFather**:
   - Send `/setmenubutton` to [@BotFather](https://t.me/botfather)
   - Select your bot
   - Send button text: "🎮 Play Game"
   - Send Web App URL: `https://your-vercel-app.vercel.app`

2. **Set Web App**:
   - Send `/newapp` to BotFather (if not done)
   - Provide app details:
     - Title: Cyberpunk Shooter
     - Description: Multiplayer NFT shooter game
     - Photo: Upload game icon
     - Demo GIF: Upload gameplay demo
     - Short name: `cyberpunk_shooter`
     - Web App URL: Your Vercel URL

3. **Configure Commands**:
   - Send `/setcommands` to BotFather
   - Paste:
     ```
     play - Launch the game
     profile - View your stats
     leaderboard - Top players
     dailies - Daily challenges
     stats - Detailed statistics
     claim - Claim daily rewards
     shop - Cosmetics shop
     nfts - NFT collection
     help - Show all commands
     ```

4. **Test**:
   - Open your bot in Telegram
   - Send `/start`
   - Click "🎮 Play Game" button
   - Game should load in Telegram Mini App

## Environment Variables

### Frontend (.env - optional)
```bash
VITE_WS_URL=wss://your-backend.railway.app
VITE_API_URL=https://your-backend.railway.app
```

### Backend (.env - required)
```bash
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
WEB_APP_URL=https://your-app.vercel.app
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/game
TON_API_KEY=your_ton_api_key
TON_NETWORK=mainnet
```

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend WebSocket server running
- [ ] Telegram bot responding to commands
- [ ] Mini App launching correctly
- [ ] WebSocket connection working
- [ ] Service Worker registered
- [ ] Mobile responsiveness tested
- [ ] Haptic feedback working
- [ ] Theme colors correct
- [ ] Share functionality working

## Monitoring

### Frontend (Vercel)
- Analytics: Vercel Analytics dashboard
- Logs: `vercel logs`
- Performance: Lighthouse reports

### Backend (Railway)
- Logs: Railway dashboard → Deployments → View Logs
- Metrics: Railway metrics tab
- Health: `GET /api/health`

### Telegram Bot
- Bot analytics: [@BotFather](https://t.me/botfather) → `/mybots` → Bot Stats
- Error monitoring: Check backend logs for errors

## Troubleshooting

### Frontend not loading
- Check Vercel deployment logs
- Verify build completed successfully
- Test locally: `npm run build && npm run preview`

### Backend WebSocket not connecting
- Check Railway logs
- Verify PORT environment variable
- Test endpoint: `https://your-backend.railway.app/api/health`
- Ensure WebSocket URL in frontend is correct

### Telegram bot not responding
- Verify bot token in Railway environment variables
- Check backend logs for errors
- Test bot: Send `/start` to your bot
- Webhook status: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`

### Mini App not launching
- Verify Web App URL in BotFather settings
- Check frontend deployment is live
- Test Web App URL directly in browser
- Ensure HTTPS (required for Telegram Mini Apps)

## Performance Optimization

### Frontend
1. Enable Vercel Edge Network
2. Configure caching headers (already in vercel.json)
3. Enable compression
4. Use CDN for assets

### Backend
1. Enable Railway auto-scaling
2. Add Redis for session management
3. Implement rate limiting
4. Use connection pooling for database

## Scaling

### Frontend
- Vercel automatically scales
- No additional configuration needed

### Backend
- Railway: Upgrade plan for more resources
- Use horizontal scaling for WebSocket servers
- Implement Redis pub/sub for multi-instance sync

## Security

### Telegram Verification
Implement proper Telegram initData verification:

```javascript
import crypto from 'crypto';

function verifyTelegramWebAppData(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}
```

### CORS Configuration
Update backend CORS for production:

```javascript
app.use(cors({
  origin: process.env.WEB_APP_URL,
  credentials: true
}));
```

## Updates and Maintenance

### Frontend Updates
```bash
git push  # Vercel auto-deploys
```

### Backend Updates
```bash
git push  # Railway auto-deploys
```

### Manual Deploy
```bash
# Frontend
vercel --prod

# Backend (if using Heroku)
git subtree push --prefix backend heroku main
```

## Rollback

### Vercel
- Go to Deployments
- Find previous successful deployment
- Click "..." → "Promote to Production"

### Railway
- Go to Deployments tab
- Click on previous deployment
- Click "Redeploy"

## Support

- Vercel: [vercel.com/support](https://vercel.com/support)
- Railway: [railway.app/help](https://railway.app/help)
- Telegram: [core.telegram.org/bots](https://core.telegram.org/bots)

---

For issues or questions, open an issue on GitHub.
