import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const webAppUrl = process.env.WEB_APP_URL || 'https://your-app.vercel.app';

const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Telegram bot is running...');

// Command: /start
bot.onText(/\/start(.*)/, (msg, match) => {
  const chatId = msg.chat.id;
  const startParam = match[1]?.trim();
  
  const welcomeText = `
🎮 *Welcome to Cyberpunk Shooter!*

A multiplayer NFT shooter game optimized for Telegram!

💀 *Features:*
• 10-wave campaign mode
• 2-player co-op
• Touch-optimized controls
• NFT achievements
• Daily rewards

*Commands:*
/play - Launch the game
/profile - View your stats
/leaderboard - Top players
/dailies - Today's challenges
/help - Show all commands
  `;

  const keyboard = {
    inline_keyboard: [
      [{ text: '🎮 PLAY NOW', web_app: { url: webAppUrl } }],
      [
        { text: '📊 Profile', callback_data: 'profile' },
        { text: '🏆 Leaderboard', callback_data: 'leaderboard' }
      ],
      [
        { text: '🎁 Daily Reward', callback_data: 'daily_reward' },
        { text: '⚙️ Settings', callback_data: 'settings' }
      ]
    ]
  };

  bot.sendMessage(chatId, welcomeText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
  
  // If there's a start parameter (like room invitation)
  if (startParam && startParam.startsWith('room_')) {
    bot.sendMessage(chatId, `🎮 Joining room: ${startParam}...`);
  }
});

// Command: /play
bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [[
      { text: '🎮 LAUNCH GAME', web_app: { url: `${webAppUrl}/game` } }
    ]]
  };

  bot.sendMessage(chatId, '🎮 Ready to play Cyberpunk Shooter?', {
    reply_markup: keyboard
  });
});

// Command: /profile
bot.onText(/\/profile/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // TODO: Fetch real user stats from database
  const profileText = `
👤 *Your Profile*

🆔 Player ID: ${userId}
⭐ Level: 5
📊 XP: 450/500
💎 Tokens: 1,250

📈 *Statistics:*
🎯 Games Played: 42
💀 Total Kills: 856
🏆 Best Score: 15,420
⚡ Win Rate: 68%

🎖️ *Achievements:*
✅ First Victory
✅ 100 Kills
✅ Wave 10 Completed
⬜ Flawless Victory
  `;

  const keyboard = {
    inline_keyboard: [[
      { text: '🎮 Play Now', web_app: { url: webAppUrl } }
    ]]
  };

  bot.sendMessage(chatId, profileText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Command: /leaderboard
bot.onText(/\/leaderboard/, (msg) => {
  const chatId = msg.chat.id;
  
  // TODO: Fetch real leaderboard from database
  const leaderboardText = `
🏆 *Global Leaderboard* (Top 10)

1️⃣ @player1 - 25,840 pts
2️⃣ @player2 - 22,350 pts
3️⃣ @player3 - 19,720 pts
4️⃣ @player4 - 17,890 pts
5️⃣ @player5 - 15,420 pts
6️⃣ @player6 - 13,680 pts
7️⃣ @player7 - 12,150 pts
8️⃣ @player8 - 10,920 pts
9️⃣ @player9 - 9,450 pts
🔟 @player10 - 8,230 pts

_Your rank: #15 (7,840 pts)_
  `;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🎮 Play to Climb', web_app: { url: webAppUrl } }
      ],
      [
        { text: '📊 Weekly', callback_data: 'leaderboard_weekly' },
        { text: '📅 Monthly', callback_data: 'leaderboard_monthly' }
      ]
    ]
  };

  bot.sendMessage(chatId, leaderboardText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Command: /dailies
bot.onText(/\/dailies/, (msg) => {
  const chatId = msg.chat.id;
  
  const dailiesText = `
🎯 *Today's Challenges*

✅ Play 3 games (3/3) - *+100 XP*
⬜ Kill 50 enemies (32/50) - +150 XP
⬜ Complete 5 waves (3/5) - +200 XP

⏰ Resets in: 14h 23m

💎 *Rewards:*
Complete all challenges: +500 tokens
  `;

  const keyboard = {
    inline_keyboard: [[
      { text: '🎮 Start Playing', web_app: { url: webAppUrl } }
    ]]
  };

  bot.sendMessage(chatId, dailiesText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Command: /stats
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  
  const statsText = `
📊 *Your Statistics*

🎮 *Game Stats:*
• Total Games: 42
• Wins: 29 (69%)
• Average Score: 8,450

💀 *Combat Stats:*
• Total Kills: 856
• Best Streak: 15
• Accuracy: 72%

⏱️ *Time Played:*
• Total: 5h 32m
• This Week: 1h 15m
  `;

  bot.sendMessage(chatId, statsText, { parse_mode: 'Markdown' });
});

// Command: /share
bot.onText(/\/share (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const roomId = match[1];
  
  const shareUrl = `${webAppUrl}?startapp=${roomId}`;
  const shareText = `🎮 Join my Cyberpunk Shooter game!\n\n${shareUrl}`;
  
  bot.sendMessage(chatId, shareText);
});

// Command: /claim
bot.onText(/\/claim/, (msg) => {
  const chatId = msg.chat.id;
  
  // TODO: Implement actual reward claiming logic
  const claimText = `
🎁 *Daily Reward Claimed!*

You received:
💎 +100 Tokens
⭐ +50 XP

Come back tomorrow for more rewards!
  `;

  bot.sendMessage(chatId, claimText, { parse_mode: 'Markdown' });
});

// Command: /shop
bot.onText(/\/shop/, (msg) => {
  const chatId = msg.chat.id;
  
  const shopText = `
🛒 *Cosmetics Shop*

🎨 Weapon Skins:
• Neon Plasma Rifle - 500 💎
• Fire Shotgun - 750 💎
• Ice Launcher - 1,000 💎

👤 Character Colors:
• Cyan Glow - 300 💎
• Purple Aura - 400 💎
• Rainbow Effect - 1,500 💎

Your balance: 1,250 💎
  `;

  const keyboard = {
    inline_keyboard: [
      [{ text: '💎 Buy Tokens', callback_data: 'buy_tokens' }],
      [{ text: '🎮 Open in App', web_app: { url: `${webAppUrl}/shop` } }]
    ]
  };

  bot.sendMessage(chatId, shopText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Command: /nfts
bot.onText(/\/nfts/, (msg) => {
  const chatId = msg.chat.id;
  
  const nftsText = `
🖼️ *Your NFT Collection*

🏆 Achievement NFTs:
✅ First Victory Badge
✅ Wave 10 Master
✅ 100 Kills Trophy

📊 Total NFTs: 3
💰 Estimated Value: 45 TON

_New NFTs are minted for major achievements!_
  `;

  const keyboard = {
    inline_keyboard: [
      [{ text: '🎮 Earn More NFTs', web_app: { url: webAppUrl } }],
      [{ text: '💰 View on Marketplace', url: 'https://getgems.io' }]
    ]
  };

  bot.sendMessage(chatId, nftsText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpText = `
📚 *Bot Commands*

🎮 *Game Commands:*
/play - Launch the game
/profile - View your stats
/stats - Detailed statistics

🏆 *Progression:*
/leaderboard - Global rankings
/dailies - Today's challenges
/claim - Claim daily rewards

💰 *Economy:*
/shop - Cosmetics shop
/nfts - Your NFT collection

🔧 *Other:*
/share [room_id] - Share game room
/help - Show this message
  `;

  const keyboard = {
    inline_keyboard: [[
      { text: '🎮 PLAY NOW', web_app: { url: webAppUrl } }
    ]]
  };

  bot.sendMessage(chatId, helpText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Callback query handler
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  switch (data) {
    case 'profile':
      bot.sendMessage(chatId, 'Use /profile to view your stats');
      break;
    
    case 'leaderboard':
      bot.sendMessage(chatId, 'Use /leaderboard to see rankings');
      break;
    
    case 'daily_reward':
      bot.sendMessage(chatId, '🎁 Daily reward claimed! +100 tokens');
      break;
    
    case 'settings':
      bot.sendMessage(chatId, '⚙️ Settings: /help for available commands');
      break;
    
    case 'buy_tokens':
      bot.sendMessage(chatId, '💎 Token shop coming soon! Use TON wallet for payments.');
      break;
    
    default:
      bot.sendMessage(chatId, `Action: ${data}`);
  }

  bot.answerCallbackQuery(query.id);
});

// Handle errors
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

// Notification functions (can be called from game server)
export function sendNotification(userId, message) {
  bot.sendMessage(userId, message);
}

export function sendAchievementNotification(userId, achievement) {
  const text = `
🎖️ *New Achievement Unlocked!*

${achievement.emoji} ${achievement.name}
${achievement.description}

💎 Reward: +${achievement.reward} tokens
  `;

  bot.sendMessage(userId, text, { parse_mode: 'Markdown' });
}

export function sendLevelUpNotification(userId, level) {
  const text = `
⭐ *LEVEL UP!*

You've reached Level ${level}!

💎 Bonus: +${level * 50} tokens
🎁 New rewards unlocked!
  `;

  bot.sendMessage(userId, text, { parse_mode: 'Markdown' });
}
