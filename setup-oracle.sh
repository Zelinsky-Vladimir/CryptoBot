#!/bin/bash
# Oracle Cloud VM Setup Script for Crypto Prediction Bot

echo "🚀 Setting up Crypto Prediction Bot on Oracle Cloud..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
sudo npm install -g pnpm

# Clone repository
git clone https://github.com/Zelinsky-Vladimir/CryptoBot.git
cd CryptoBot

# Install dependencies
pnpm install

# Build the project
pnpm build

# Create environment file
echo "Creating .env file..."
echo "TELEGRAM_BOT_TOKEN=your_bot_token_here" > .env
echo "TELEGRAM_CHAT_ID=your_chat_id_here" >> .env
echo "GEMINI_API_KEY=your_gemini_key_here" >> .env
echo "PREDICTION_TIME=09:00" >> .env
echo "TIMEZONE=UTC" >> .env
echo "NODE_ENV=production" >> .env

# Create systemd service
sudo tee /etc/systemd/system/crypto-bot.service > /dev/null <<EOF
[Unit]
Description=Crypto Prediction Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/CryptoBot
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys: nano .env"
echo "2. Enable service: sudo systemctl enable crypto-bot"
echo "3. Start service: sudo systemctl start crypto-bot"
echo "4. Check status: sudo systemctl status crypto-bot"
echo "5. View logs: sudo journalctl -u crypto-bot -f"
