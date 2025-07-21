#!/usr/bin/env node

import { config, validateConfig } from './config/config';
import { PredictionScheduler } from './scheduler/scheduler';
import { TelegramService } from './services/telegramService';
import { CryptoAnalysisService } from './services/cryptoAnalysisService';
import { startHealthServer } from './health';

class CryptoPredictionBot {
  public scheduler: PredictionScheduler;
  private telegramService: TelegramService;
  private cryptoService: CryptoAnalysisService;

  constructor() {
    this.scheduler = new PredictionScheduler();
    this.telegramService = new TelegramService();
    this.cryptoService = new CryptoAnalysisService();
  }

  async start(): Promise<void> {
    try {
      console.log('🚀 Starting Crypto Prediction Bot...');
      
      // Validate configuration
      validateConfig();
      console.log('✅ Configuration validated');

      // Start health check server for deployment platforms
      startHealthServer();
      
      // Send startup notification
      await this.telegramService.sendStartupMessage();
      console.log('✅ Startup notification sent');

      // Start the scheduler
      this.scheduler.start();

      // Display status
      const status = this.scheduler.getStatus();
      console.log(`📅 Next prediction scheduled for: ${status.nextRun}`);

      console.log('✅ Crypto Prediction Bot is now running!');
      console.log('💡 Press Ctrl+C to stop the bot');

      // Set up graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      console.error('❌ Failed to start bot:', error);
      process.exit(1);
    }
  }

  async runInstantPrediction(): Promise<void> {
    try {
      console.log('📊 Fetching BTC prediction...');
      const btcPrediction = await this.cryptoService.getPricePrediction('BTC');
      
      console.log('📊 Fetching ETH prediction...');
      const ethPrediction = await this.cryptoService.getPricePrediction('ETH');
      
      console.log('📤 Sending predictions to Telegram...');
      await this.telegramService.sendPredictions(btcPrediction, ethPrediction);
      
    } catch (error) {
      console.error('❌ Instant prediction failed:', error);
      throw error;
    }
  }

  async runManualPrediction(): Promise<void> {
    try {
      console.log('🔄 Running manual prediction...');
      await this.scheduler.runManualPrediction();
    } catch (error) {
      console.error('❌ Manual prediction failed:', error);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`\n📥 Received ${signal}, shutting down gracefully...`);
      
      try {
        this.scheduler.stop();
        console.log('✅ Scheduler stopped');
        
        await this.telegramService.sendMessage('🤖 Bot is shutting down... Will restart soon!');
        console.log('✅ Shutdown notification sent');
        
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
      } finally {
        console.log('👋 Goodbye!');
        process.exit(0);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const bot = new CryptoPredictionBot();

  if (args.includes('--manual') || args.includes('-m')) {
    // Run manual prediction
    await bot.runManualPrediction();
    process.exit(0);
  } else {
    // Start the bot normally
    await bot.start();
    
    // Keep the process running
    setInterval(() => {
      const status = bot.scheduler.getStatus();
      console.log(`⏰ Bot running... Next prediction: ${status.nextRun}`);
    }, 3600000); // Log status every hour
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}
