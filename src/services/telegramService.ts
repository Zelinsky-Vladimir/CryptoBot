import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/config';
import { PredictionResponse } from './cryptoAnalysisService';

export class TelegramService {
  private bot: TelegramBot;
  private chatId: string;

  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
    this.chatId = config.telegram.chatId;
  }

  async sendMessage(message: string): Promise<void> {
    try {
      // First try with Markdown
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
      console.log('Message sent successfully');
    } catch (error) {
      console.log('Markdown failed, trying without formatting...');
      try {
        // If Markdown fails, try without formatting
        const plainMessage = message.replace(/\*([^*]+)\*/g, '$1'); // Remove * formatting
        await this.bot.sendMessage(this.chatId, plainMessage);
        console.log('Message sent successfully (plain text)');
      } catch (secondError) {
        console.error('Error sending message:', secondError);
        throw secondError;
      }
    }
  }

  async sendPredictions(btcPrediction: PredictionResponse, ethPrediction: PredictionResponse): Promise<void> {
    // Always send separate messages with full analysis for better readability
    const btcMessage = this.formatSinglePredictionMessage(btcPrediction);
    const ethMessage = this.formatSinglePredictionMessage(ethPrediction);
    
    console.log('📤 Sending BTC prediction...');
    await this.sendMessage(btcMessage);
    
    console.log('⏳ Waiting 2 seconds before sending ETH prediction...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    
    console.log('📤 Sending ETH prediction...');
    await this.sendMessage(ethMessage);
  }

  private formatPredictionMessage(btcPrediction: PredictionResponse, ethPrediction: PredictionResponse): string {
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
🚀 *Daily Crypto Price Predictions* 🚀
📅 ${date}

━━━━━━━━━━━━━━━━━━━━━━

🟠 *BITCOIN (BTC) ANALYSIS*
💰 *Current Price:* $${btcPrediction.currentPrice.toLocaleString()}
📈 *24h Change:* ${btcPrediction.marketData.change24h.toFixed(2)}%
💸 *Market Cap:* $${(btcPrediction.marketData.marketCap / 1000000000).toFixed(1)}B

*PREDICTIONS:*
💰 *1 Month:* ${btcPrediction.predictions.month}
💰 *6 Months:* ${btcPrediction.predictions.halfYear}
💰 *1 Year:* ${btcPrediction.predictions.year}
📊 *Confidence:* ${btcPrediction.confidence}

━━━━━━━━━━━━━━━━━━━━━━

🔵 *ETHEREUM (ETH) ANALYSIS*
💰 *Current Price:* $${ethPrediction.currentPrice.toLocaleString()}
📈 *24h Change:* ${ethPrediction.marketData.change24h.toFixed(2)}%
💸 *Market Cap:* $${(ethPrediction.marketData.marketCap / 1000000000).toFixed(1)}B

*PREDICTIONS:*
💰 *1 Month:* ${ethPrediction.predictions.month}
💰 *6 Months:* ${ethPrediction.predictions.halfYear}
💰 *1 Year:* ${ethPrediction.predictions.year}
📊 *Confidence:* ${ethPrediction.confidence}

━━━━━━━━━━━━━━━━━━━━━━

🤖 *Powered by Google Gemini AI + Real-time CoinGecko Data*
    `;
  }

  private formatSinglePredictionMessage(prediction: PredictionResponse): string {
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const cryptoEmoji = prediction.crypto === 'BTC' ? '🟠' : '🔵';
    const cryptoName = prediction.crypto === 'BTC' ? 'BITCOIN (BTC)' : 'ETHEREUM (ETH)';

    let message = `
🚀 *Daily Crypto Price Prediction* 🚀
📅 ${date}

━━━━━━━━━━━━━━━━━━━━━━

${cryptoEmoji} *${cryptoName} ANALYSIS*
💰 *Current Price:* $${prediction.currentPrice.toLocaleString()}
📈 *24h Change:* ${prediction.marketData.change24h.toFixed(2)}%
💸 *Market Cap:* $${(prediction.marketData.marketCap / 1000000000).toFixed(1)}B

━━━━━━━━━━━━━━━━━━━━━━
`;

    // Add truncated analysis if the message is getting too long
    const remainingSpace = 3800 - message.length;
    if (prediction.analysis.length > remainingSpace) {
      message += prediction.analysis.substring(0, remainingSpace - 100) + '... [Analysis truncated]';
    } else {
      message += prediction.analysis;
    }

    message += `

━━━━━━━━━━━━━━━━━━━━━━

🤖 *Powered by Google Gemini AI + Real-time CoinGecko Data*
`;

    return message;
  }

  async sendStartupMessage(): Promise<void> {
    const message = `
🤖 *Crypto Prediction Bot Started!* 🚀

✅ Bot is now active and running
📅 Daily predictions will be sent at ${config.bot.predictionTime} ${config.bot.timezone}
📊 Analyzing BTC & ETH with Google Gemini AI + real-time data

━━━━━━━━━━━━━━━━━━━━━━

🔍 *What I do:*
• Daily BTC & ETH price predictions
• 1-month, 6-month, and 1-year forecasts
• Deep market analysis using Google Gemini AI
• Technical & fundamental analysis
• Market sentiment evaluation

🎯 *Next prediction:* Tomorrow at ${config.bot.predictionTime}

Stay tuned for daily crypto insights! 📈
`;

    await this.sendMessage(message);
  }

  async sendErrorMessage(error: string): Promise<void> {
    const message = `
❌ *Error Occurred*

There was an issue generating today's predictions:

\`${error}\`

The bot will try again at the next scheduled time.

🔧 Please check your configuration if this persists.
`;

    await this.sendMessage(message);
  }
}
