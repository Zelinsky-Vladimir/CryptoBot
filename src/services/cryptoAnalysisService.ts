import axios, { AxiosResponse } from 'axios';
import { config } from '../config/config';

export interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

export interface MarketSentiment {
  fearGreedIndex: number;
  dominance: {
    btc: number;
    eth: number;
  };
  totalMarketCap: number;
}

export interface PredictionResponse {
  crypto: string;
  currentPrice: number;
  predictions: {
    month: string;
    halfYear: string;
    year: string;
  };
  analysis: string;
  confidence: string;
  timestamp: string;
  marketData: CryptoData;
}

export class CryptoAnalysisService {
  private readonly geminiApiKey: string;
  private readonly geminiBaseUrl: string;

  constructor() {
    this.geminiApiKey = config.gemini.apiKey;
    this.geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async getCryptoData(symbol: string): Promise<CryptoData> {
    try {
      // Map symbols to CoinGecko coin IDs
      const coinId = symbol === 'BTC' ? 'bitcoin' : 'ethereum';
      
      // Using CoinGecko's free API for real-time crypto data
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_24hr_high=true&include_24hr_low=true`
      );
      
      console.log(`API Response for ${coinId}:`, JSON.stringify(response.data, null, 2));
      
      const data = response.data[coinId];
      
      if (!data) {
        throw new Error(`No data returned for ${coinId}`);
      }
      
      return {
        symbol: symbol,
        price: data.usd || 0,
        change24h: data.usd_24h_change || 0,
        volume24h: data.usd_24h_vol || 0,
        marketCap: data.usd_market_cap || 0,
        high24h: data.usd_24h_high || 0,
        low24h: data.usd_24h_low || 0
      };
    } catch (error) {
      console.error(`Error fetching crypto data for ${symbol}:`, error);
      throw error;
    }
  }

  async getMarketSentiment(): Promise<MarketSentiment> {
    try {
      // Using CoinGecko's global market data
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      const data = response.data.data;
      
      return {
        fearGreedIndex: 50, // Default neutral, you can integrate Fear & Greed Index API
        dominance: {
          btc: data.market_cap_percentage?.bitcoin || 0,
          eth: data.market_cap_percentage?.ethereum || 0
        },
        totalMarketCap: data.total_market_cap?.usd || 0
      };
    } catch (error) {
      console.error('Error fetching market sentiment:', error);
      return {
        fearGreedIndex: 50,
        dominance: { btc: 45, eth: 18 },
        totalMarketCap: 2000000000000
      };
    }
  }

  async getPricePrediction(crypto: 'BTC' | 'ETH'): Promise<PredictionResponse> {
    try {
      // Get real-time crypto data
      const [cryptoData, marketSentiment] = await Promise.all([
        this.getCryptoData(crypto),
        this.getMarketSentiment()
      ]);

      // Create comprehensive prompt with real data
      const prompt = this.createPredictionPrompt(crypto, cryptoData, marketSentiment);

      // Call Google Gemini 2.5 Pro API
      const response = await axios.post(
        `${this.geminiBaseUrl}/models/gemini-2.5-pro:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const geminiResponse = response.data.candidates[0].content.parts[0].text;
      return this.parsePredictionResponse(crypto, geminiResponse, cryptoData);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error(`Failed to get prediction for ${crypto}: ${error}`);
    }
  }

  private createPredictionPrompt(crypto: string, cryptoData: CryptoData, marketSentiment: MarketSentiment): string {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `
You are a world-class cryptocurrency research analyst with extensive experience in quantitative analysis, institutional trading, and blockchain technology research.

Perform a DEEP RESEARCH-DRIVEN PRICE PREDICTION analysis for ${crypto} as of ${currentDate}.

**RESEARCH METHODOLOGY:** Use advanced analytical frameworks including Elliott Wave Theory, Fibonacci retracements, on-chain metrics, network value models, and comparative valuation methods.

**CURRENT MARKET DATA:**
- Current Price: $${cryptoData.price.toLocaleString()}
- 24h Change: ${cryptoData.change24h.toFixed(2)}%
- 24h Volume: $${cryptoData.volume24h.toLocaleString()}
- Market Cap: $${cryptoData.marketCap.toLocaleString()}
- BTC Dominance: ${marketSentiment.dominance.btc.toFixed(1)}%
- ETH Dominance: ${marketSentiment.dominance.eth.toFixed(1)}%
- Total Market Cap: $${(marketSentiment.totalMarketCap / 1000000000000).toFixed(2)}T

**ANALYSIS REQUIREMENTS:**
Provide detailed price predictions for:
1. **1 Month** (30 days from now)
2. **6 Months** (180 days from now) 
3. **1 Year** (365 days from now)

**DEEP RESEARCH ANALYSIS REQUIRED:**

🔬 **ADVANCED TECHNICAL ANALYSIS:**
- Multi-timeframe trend analysis (daily, weekly, monthly)
- Advanced indicators: RSI, MACD, Bollinger Bands, Ichimoku Cloud
- Elliott Wave patterns and Fibonacci levels
- Volume profile and order flow analysis
- Support/resistance clusters and pivot points

📊 **ON-CHAIN & FUNDAMENTAL RESEARCH:**
- Network hash rate and security metrics
- Active addresses, transaction volume, and network fees
- HODL patterns and long-term holder behavior
- Developer activity and GitHub commits
- Institutional adoption and ETF inflows
- Staking ratios and yield dynamics

🌍 **MACRO & SENTIMENT DEEP DIVE:**
- Federal Reserve policy impact analysis
- Global liquidity conditions and DXY correlation
- Institutional money flow and market structure
- Social sentiment: Twitter, Reddit, Google Trends
- Options flow and derivatives positioning
- Cross-asset correlations (Gold, NASDAQ, bonds)

📈 **QUANTITATIVE MODELS:**
- Stock-to-Flow model implications
- Network Value to Transactions (NVT) ratio
- MVRV (Market Value to Realized Value) analysis
- Rainbow charts and logarithmic growth curves
- Metcalfe's Law network valuation

**RESPOND IN THIS SIMPLE FORMAT:**

🎯 **PRICE PREDICTIONS:**
• 1 Month: [Your prediction]
• 6 Months: [Your prediction] 
• 1 Year: [Your prediction]

📊 **KEY ANALYSIS:**
[Provide 2-3 concise paragraphs covering your most important insights about technical trends, fundamental drivers, and market sentiment that led to these predictions]

⚖️ **CONFIDENCE:** [High/Medium/Low] - [Brief explanation]

⚠️ **MAJOR RISKS:** [List 2-3 key risk factors]

🚀 **CATALYSTS:** [List 2-3 key positive drivers]

Keep your response focused, clear, and actionable. No need for complex formatting - just solid analysis.
    `;
  }

  private parsePredictionResponse(crypto: string, response: string, cryptoData: CryptoData): PredictionResponse {
    const now = new Date().toISOString();
    
    // Simple confidence extraction, but don't worry if it fails
    const confidenceMatch = response.match(/CONFIDENCE:.*?(High|Medium|Low)/i);
    
    return {
      crypto,
      currentPrice: cryptoData.price,
      predictions: {
        month: 'See analysis below',
        halfYear: 'See analysis below', 
        year: 'See analysis below'
      },
      analysis: response, // Just return the full Gemini response
      confidence: confidenceMatch ? confidenceMatch[1] : 'Medium',
      timestamp: now,
      marketData: cryptoData
    };
  }

  async getBothPredictions(): Promise<{ btc: PredictionResponse; eth: PredictionResponse }> {
    try {
      console.log('🔄 Fetching real-time crypto data and generating AI predictions...');
      
      const [btcPrediction, ethPrediction] = await Promise.all([
        this.getPricePrediction('BTC'),
        this.getPricePrediction('ETH')
      ]);

      console.log('✅ Successfully generated both BTC and ETH predictions');

      return {
        btc: btcPrediction,
        eth: ethPrediction
      };
    } catch (error) {
      console.error('❌ Error getting both predictions:', error);
      throw error;
    }
  }
}
