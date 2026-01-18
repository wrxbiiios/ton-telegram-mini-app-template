# Deployment Guide - Cyberpunk NFT Shooter

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- TON wallet for blockchain deployment
- Domain name (optional, for production)

## Local Development

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Access at http://localhost:5173
```

### Backend
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
# API runs at http://localhost:3001
```

## Production Deployment

### Option 1: Docker Deployment

#### 1. Create Dockerfile for Frontend
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Create Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/server.js"]
```

#### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/cyberpunk-shooter
      - PORT=3001
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

Run with:
```bash
docker-compose up -d
```

### Option 2: Vercel + Railway

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Traditional VPS (DigitalOcean, AWS, etc.)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 2. Deploy Backend
```bash
# Clone repository
git clone https://github.com/your-repo/cyberpunk-shooter.git
cd cyberpunk-shooter/backend

# Install dependencies
npm ci --only=production

# Build
npm run build

# Configure PM2
pm2 start dist/server.js --name "cyberpunk-backend"
pm2 save
pm2 startup
```

#### 3. Deploy Frontend
```bash
cd ../
npm ci
npm run build

# Copy to Nginx
sudo cp -r dist/* /var/www/html/
```

#### 4. Configure Nginx
```nginx
# /etc/nginx/sites-available/cyberpunk-shooter
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cyberpunk-shooter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## TON Smart Contract Deployment

### 1. Install TON Tools
```bash
npm install -g @ton-community/func-js
npm install -g @ton-community/blueprint
```

### 2. Compile Contracts
```bash
cd backend/contracts

# Compile each contract
func -o GameCharacterNFT.fif -SPA GameCharacterNFT.fc
func -o WeaponUpgradeNFT.fif -SPA WeaponUpgradeNFT.fc
func -o GameTokenContract.fif -SPA GameTokenContract.fc
func -o LeaderboardContract.fif -SPA LeaderboardContract.fc
```

### 3. Deploy to TON Testnet
```bash
# Use TON CLI or Blueprint
ton deploy GameCharacterNFT.fif --testnet
ton deploy WeaponUpgradeNFT.fif --testnet
ton deploy GameTokenContract.fif --testnet
ton deploy LeaderboardContract.fif --testnet
```

### 4. Update Backend Configuration
Add contract addresses to backend `.env`:
```env
CHARACTER_NFT_ADDRESS=EQD...
WEAPON_NFT_ADDRESS=EQD...
TOKEN_CONTRACT_ADDRESS=EQD...
LEADERBOARD_CONTRACT_ADDRESS=EQD...
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://api.your-domain.com
VITE_WS_URL=wss://api.your-domain.com
VITE_TON_NETWORK=mainnet
```

### Backend (.env)
```env
PORT=3001
FRONTEND_URL=https://your-domain.com
MONGODB_URI=mongodb://localhost:27017/cyberpunk-shooter
TON_API_KEY=your_ton_api_key
TON_NETWORK=mainnet
JWT_SECRET=your_secret_here
CHARACTER_NFT_ADDRESS=EQD...
WEAPON_NFT_ADDRESS=EQD...
TOKEN_CONTRACT_ADDRESS=EQD...
LEADERBOARD_CONTRACT_ADDRESS=EQD...
```

## Monitoring & Maintenance

### PM2 Monitoring
```bash
# View logs
pm2 logs cyberpunk-backend

# Monitor resources
pm2 monit

# Restart on changes
pm2 reload cyberpunk-backend
```

### Database Backup
```bash
# Backup MongoDB
mongodump --db cyberpunk-shooter --out /backup/$(date +%Y%m%d)

# Restore
mongorestore --db cyberpunk-shooter /backup/20240115
```

### Server Monitoring
- Use DataDog, New Relic, or Prometheus
- Set up error tracking with Sentry
- Configure alerts for downtime

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Multiple backend instances with PM2 cluster mode
- Redis for session management and caching

### Database Optimization
- Add indexes for frequent queries
- Enable MongoDB replication
- Consider sharding for large datasets

### CDN Integration
- Use Cloudflare or AWS CloudFront
- Cache static assets
- Enable DDoS protection

## Security Checklist

- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Secure MongoDB with authentication
- [ ] Use environment variables for secrets
- [ ] Enable firewall (UFW, iptables)
- [ ] Regular security updates
- [ ] Implement input validation
- [ ] Enable CSP headers
- [ ] Regular backups

## Cost Estimation

### Basic Setup (Supports ~100 concurrent players)
- VPS (2 vCPU, 4GB RAM): $20-40/month
- MongoDB Atlas (M10): $57/month
- Domain + SSL: $15/year
- Total: ~$75-100/month

### Production Setup (Supports ~1000 concurrent players)
- Load Balancer: $10/month
- App Servers (2x 4 vCPU, 8GB RAM): $80/month
- Database Cluster: $150/month
- CDN: $20/month
- Total: ~$260/month

## Troubleshooting

### Issue: WebSocket connection fails
**Solution:** Check firewall rules, ensure WebSocket proxy is configured in Nginx

### Issue: High memory usage
**Solution:** Increase server resources, optimize game loop, implement player limits

### Issue: MongoDB connection timeout
**Solution:** Check network connectivity, increase connection pool, restart MongoDB

### Issue: Build fails
**Solution:** Clear node_modules, reinstall dependencies, check Node.js version

## Support Resources

- [TON Documentation](https://ton.org/docs)
- [Socket.io Docs](https://socket.io/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [PM2 Guide](https://pm2.keymetrics.io/)
- [Nginx Docs](https://nginx.org/en/docs/)
