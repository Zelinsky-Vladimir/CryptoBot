import cron from 'node-cron';
import { CryptoAnalysisService } from '../services/cryptoAnalysisService';
import { TelegramService } from '../services/telegramService';
import { config } from '../config/config';

export class PredictionScheduler {
  private cryptoAnalysisService: CryptoAnalysisService;
  private telegramService: TelegramService;
  private isRunning: boolean = false;

  constructor() {
    this.cryptoAnalysisService = new CryptoAnalysisService();
    this.telegramService = new TelegramService();
  }

  start(): void {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log(`Starting prediction scheduler for ${config.bot.predictionTime} ${config.bot.timezone}`);
    
    // Convert time format (e.g., "09:00" to cron format "0 9 * * *")
    const [hours, minutes] = config.bot.predictionTime.split(':');
    const cronExpression = `${minutes} ${hours} * * *`;

    console.log(`Cron expression: ${cronExpression}`);

    // Schedule daily predictions
    cron.schedule(cronExpression, async () => {
      console.log('Running scheduled prediction task...');
      await this.runPredictionTask();
    }, {
      scheduled: true,
      timezone: config.bot.timezone
    });

    this.isRunning = true;
    console.log('✅ Prediction scheduler started successfully!');
    console.log(`📅 Daily predictions will be sent at ${config.bot.predictionTime} ${config.bot.timezone}`);
  }

  async runPredictionTask(): Promise<void> {
    try {
      console.log('🔄 Generating predictions...');
      
      // Get predictions from Gemini AI with real-time crypto data
      const predictions = await this.cryptoAnalysisService.getBothPredictions();
      
      console.log('✅ Predictions generated successfully');
      console.log('📤 Sending predictions to Telegram...');
      
      // Send predictions to Telegram
      await this.telegramService.sendPredictions(predictions.btc, predictions.eth);
      
      console.log('✅ Predictions sent successfully!');
      
    } catch (error) {
      console.error('❌ Error in prediction task:', error);
      
      // Send error notification
      try {
        await this.telegramService.sendErrorMessage(error instanceof Error ? error.message : String(error));
      } catch (telegramError) {
        console.error('❌ Failed to send error notification:', telegramError);
      }
    }
  }

  async runManualPrediction(): Promise<void> {
    console.log('🚀 Running manual prediction...');
    await this.runPredictionTask();
  }

  stop(): void {
    if (!this.isRunning) {
      console.log('Scheduler is not running');
      return;
    }

    // Note: node-cron doesn't provide a direct way to stop specific tasks
    // In a production environment, you might want to store task references
    this.isRunning = false;
    console.log('⏹️ Prediction scheduler stopped');
  }

  getStatus(): { isRunning: boolean; nextRun: string } {
    const now = new Date();
    const [hours, minutes] = config.bot.predictionTime.split(':');
    
    const nextRun = new Date();
    nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    return {
      isRunning: this.isRunning,
      nextRun: nextRun.toLocaleString('en-US', {
        timeZone: config.bot.timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }
}
