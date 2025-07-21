# Crypto Prediction Bot 🤖

A sophisticated Telegram bot that provides daily Bitcoin (BTC) and Ethereum (ETH) price predictions using Grok AI's deep research capabilities.

## Features 🚀

- **Daily Automated Predictions**: Sends BTC & ETH price predictions at scheduled times
- **Multiple Timeframes**: 1-month, 6-month, and 1-year predictions
- **Deep Analysis**: Uses Grok AI for comprehensive market analysis including:
  - Technical analysis (support/resistance, trends, patterns)
  - Fundamental analysis (adoption, regulations, market cap)
  - Market sentiment and external factors
  - Historical price patterns and cycles
  - Macroeconomic factors
  - Institutional adoption trends
- **Professional Formatting**: Clean, readable Telegram messages with emojis
- **Error Handling**: Robust error handling with notifications
- **Manual Predictions**: Run predictions on-demand

## Prerequisites 📋

1. **Telegram Bot**: Create a bot via [@BotFather](https://t.me/botfather)
2. **X.AI (Grok) API Key**: Get your API key from [X.AI Console](https://console.x.ai/)
3. **Node.js**: Version 18+ required
4. **Telegram Chat ID**: Your personal chat ID or group chat ID

## Installation 🔧

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file:**
   ```env
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here

   # X.AI (Grok) API Configuration
   XAI_API_KEY=your_xai_api_key_here
   XAI_BASE_URL=https://api.x.ai/v1

   # Bot Settings
   PREDICTION_TIME=09:00  # Time to send daily predictions (24h format)
   TIMEZONE=UTC
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

## Usage 🎯

### Start the Bot (Production)
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

### Manual Prediction
```bash
npm run dev -- --manual
# or
npm run dev -- -m
```

### Build and Watch
```bash
npm run build
npm run watch
```

## Configuration ⚙️

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from BotFather | Required |
| `TELEGRAM_CHAT_ID` | Chat ID where predictions will be sent | Required |
| `XAI_API_KEY` | Your X.AI (Grok) API key | Required |
| `XAI_BASE_URL` | X.AI API base URL | `https://api.x.ai/v1` |
| `PREDICTION_TIME` | Daily prediction time (24h format) | `09:00` |
| `TIMEZONE` | Timezone for scheduling | `UTC` |

### Getting Your Chat ID

1. Add [@userinfobot](https://t.me/userinfobot) to your Telegram
2. Send `/start` to get your chat ID
3. For groups: Add the bot to your group and use the group's chat ID (starts with -)

## Project Structure 📁

```
src/
├── config/
│   └── config.ts          # Configuration management
├── services/
│   ├── grokService.ts     # Grok AI integration
│   └── telegramService.ts # Telegram bot functionality
├── scheduler/
│   └── scheduler.ts       # Cron job scheduling
└── index.ts              # Main application entry point
```

## Features in Detail 🔍

### Prediction Analysis

The bot uses Grok AI to perform comprehensive analysis including:
- **Technical Analysis**: Chart patterns, support/resistance levels, trend analysis
- **Fundamental Analysis**: Network metrics, adoption rates, regulatory environment
- **Market Sentiment**: Social media trends, institutional interest
- **Historical Patterns**: Seasonal trends, cycle analysis
- **Risk Assessment**: Potential catalysts and risk factors

### Message Formatting

- Professional Telegram formatting with Markdown
- Organized predictions with clear timeframes
- Confidence levels for each prediction
- Disclaimer for responsible usage
- Error notifications with troubleshooting info

### Scheduling

- Flexible daily scheduling
- Timezone-aware execution
- Graceful error handling
- Manual execution capability
- Status monitoring

## Troubleshooting 🔧

### Common Issues

1. **"TELEGRAM_BOT_TOKEN is required"**
   - Make sure your `.env` file exists and contains the bot token

2. **"XAI_API_KEY is required"**
   - Verify your Grok AI API key is correctly set in `.env`

3. **Predictions not sending**
   - Check your chat ID is correct
   - Verify the bot has permission to send messages
   - Check the logs for API errors

4. **Time zone issues**
   - Set `TIMEZONE` in `.env` to your preferred timezone
   - Use standard timezone names (e.g., "America/New_York", "Europe/London")

### Logs

The bot provides detailed console logging:
- ✅ Success operations
- ❌ Errors with details
- 🔄 Processing status
- ⏰ Scheduling information

## API Limits and Costs 💰

- **Grok AI**: Check X.AI pricing for API usage costs
- **Telegram**: Free with rate limits (30 messages/second to same chat)
- Consider implementing rate limiting for production use

## Security Best Practices 🔒

1. **Never commit your `.env` file**
2. **Use environment variables in production**
3. **Regularly rotate API keys**
4. **Monitor API usage and costs**
5. **Use HTTPS endpoints only**

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

MIT License - see LICENSE file for details

## Disclaimer ⚠️

This bot provides predictions for informational purposes only. Cryptocurrency investments carry significant risk. Always do your own research and never invest more than you can afford to lose.

## Support 💬

For issues and questions:
1. Check the troubleshooting section
2. Review the logs for error details  
3. Ensure all environment variables are correctly set
4. Verify API keys and permissions

---

**Made with ❤️ for the crypto community**
