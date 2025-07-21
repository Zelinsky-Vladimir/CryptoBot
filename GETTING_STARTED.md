# 🚀 Getting Started with Crypto Prediction Bot

Your **FREE** Telegram bot for BTC/ETH price predictions using Google Gemini AI and real-time market data!

## 🎯 What You Get

- **Daily automated predictions** for BTC & ETH (1-month, 6-month, 1-year)
- **Real-time crypto data** from CoinGecko API
- **AI-powered analysis** using Google Gemini (FREE tier)
- **Professional Telegram messages** with market data and emojis
- **Comprehensive analysis** including technical, fundamental, and sentiment analysis

## 📋 Quick Setup (5 minutes)

### 1. **Get Your API Keys** (All FREE!)

**🤖 Telegram Bot Token:**
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow prompts
3. Copy your bot token

**🆔 Telegram Chat ID:**
1. Message [@userinfobot](https://t.me/userinfobot) on Telegram
2. Send `/start` to get your chat ID

**🧠 Google Gemini API Key:**
1. Go to [AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key" 
4. Copy the key (starts with `AIza`)

### 2. **Configure Environment**

Create `.env` file in the project root:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# Google Gemini API Configuration  
GEMINI_API_KEY=AIzaSyB...

# Bot Settings (optional)
PREDICTION_TIME=09:00
TIMEZONE=UTC
```

### 3. **Install & Run**

```bash
# Install dependencies
pnpm install

# Test with manual prediction
pnpm dev -- --manual

# Start daily automation
pnpm dev
```

## ✅ What Happens Next

1. **Bot starts** and sends a welcome message
2. **Daily predictions** sent automatically at your scheduled time
3. **Rich analysis** with current prices, market data, and AI insights
4. **Error notifications** if anything goes wrong

## 📱 Sample Output

```
🚀 Daily Crypto Price Predictions 🚀
📅 Monday, July 21, 2025

━━━━━━━━━━━━━━━━━━━━━━

🟠 BITCOIN (BTC) ANALYSIS
💰 Current Price: $67,234
📈 24h Change: +2.45%
💸 Market Cap: $1.3T

PREDICTIONS:
💰 1 Month: $58,000 - $75,000 (most likely: $68,500)
💰 6 Months: $55,000 - $85,000 (most likely: $72,000)
💰 1 Year: $45,000 - $120,000 (most likely: $95,000)
📊 Confidence: Medium

[Detailed AI analysis follows...]
```

## 🛠️ Commands

- `pnpm dev` - Start the bot
- `pnpm dev -- --manual` - Get instant prediction
- `pnpm build` - Compile TypeScript
- `pnpm start` - Run compiled version

## 💡 Tips

- **Free Limits:** Gemini gives 15 requests/minute (more than enough)
- **Market Data:** CoinGecko is free and reliable
- **Scheduling:** Bot runs 24/7, sends predictions daily
- **Error Handling:** Bot notifies you of any issues

## 🔧 Troubleshooting

**"GEMINI_API_KEY is required"**
- Make sure your `.env` file exists with the API key

**"Failed to get prediction"** 
- Check your internet connection
- Verify API key is correct
- Check Gemini API limits

**Bot not responding**
- Verify bot token and chat ID
- Make sure bot can send messages to you

## 🎉 You're All Set!

Your bot will now provide daily crypto predictions with real market data and AI analysis - completely FREE! 

The AI considers technical indicators, market sentiment, fundamentals, and current data to give you comprehensive predictions.

---

*Powered by Google Gemini AI + Real-time CoinGecko Data* 🤖
