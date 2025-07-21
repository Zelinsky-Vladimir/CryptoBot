import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  telegram: {
    botToken: string;
    chatId: string;
  };
  gemini: {
    apiKey: string;
  };
  bot: {
    predictionTime: string;
    timezone: string;
  };
}

export const config: Config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  bot: {
    predictionTime: process.env.PREDICTION_TIME || '09:00',
    timezone: process.env.TIMEZONE || 'UTC',
  },
};

export function validateConfig(): void {
  if (!config.telegram.botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is required');
  }
  if (!config.telegram.chatId) {
    throw new Error('TELEGRAM_CHAT_ID is required');
  }
  if (!config.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }
}
