#!/bin/bash

# Crypto Prediction Bot Setup Script

echo "🚀 Setting up Crypto Prediction Bot..."

# Install dependencies
echo "📦 Installing dependencies with pnpm..."
pnpm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created! Please update it with your actual values."
else
    echo "⚠️  .env file already exists"
fi

# Build the project
echo "🔨 Building TypeScript project..."
pnpm build

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with:"
echo "   - TELEGRAM_BOT_TOKEN (from @BotFather)"
echo "   - TELEGRAM_CHAT_ID (your chat ID)"
echo "   - XAI_API_KEY (from X.AI Console)"
echo "2. Run 'pnpm dev' to start the bot"
echo "3. Run 'pnpm dev -- --manual' for a manual prediction test"
echo ""
echo "🤖 Happy crypto predicting!"
