// GeoDrop App Configuration Template
// Kopiere diese Datei zu config.js und fülle die echten Werte ein

const CONFIG = {
    // Firebase Configuration
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY_HERE",
        authDomain: "your_project_id.firebaseapp.com",
        projectId: "your_project_id",
        storageBucket: "your_project_id.firebasestorage.app",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    },
    
    // Blockchain Configuration
    blockchain: {
        // BSC Testnet
        bscTestnet: {
            chainId: 97,
            rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            blockExplorer: "https://testnet.bscscan.com"
        },
        // BSC Mainnet
        bscMainnet: {
            chainId: 56,
            rpcUrl: "https://bsc-dataseed.binance.org/",
            blockExplorer: "https://bscscan.com"
        },
        // GeoDrop Contract Addresses
        contracts: {
            geodropRevenue: "YOUR_CONTRACT_ADDRESS_HERE",
            // Weitere Contract-Adressen können hier hinzugefügt werden
        }
    },
    
    // App Configuration
    app: {
        name: "GeoDrop",
        version: "2.0.0",
        environment: "development", // development, staging, production
        debug: true,
        defaultLocation: {
            lat: 48.2082,
            lng: 16.3738,
            name: "Vienna, Austria"
        }
    },
    
    // Mining Configuration
    mining: {
        machines: {
            1: { name: "Basic Miner", cost: 0.001, boost: 5, currency: "tBNB" },
            2: { name: "Advanced Miner", cost: 0.005, boost: 15, currency: "tBNB" },
            3: { name: "Pro Miner", cost: 0.02, boost: 40, currency: "tBNB" },
            4: { name: "Mega Miner", cost: 0.1, boost: 100, currency: "tBNB" }
        },
        diminishingReturns: {
            basic: { threshold: 5, reduction: 0.5 },
            advanced: { threshold: 3, reduction: 0.75 },
            pro: { threshold: 2, reduction: 0.8 },
            mega: { threshold: 1, reduction: 0.5 }
        }
    },
    
    // Trading Configuration
    trading: {
        minTradeAmount: 0.001,
        maxTradeAmount: 10.0,
        defaultSlippage: 0.5,
        supportedTokens: ["tBNB", "PixelDrop"]
    },
    
    // UI Configuration
    ui: {
        theme: "dark",
        language: "de",
        animations: true,
        soundEffects: false
    },
    
    // Telegram Configuration
    telegram: {
        botToken: "YOUR_TELEGRAM_BOT_TOKEN_HERE",
        chatId: "YOUR_TELEGRAM_CHAT_ID_HERE",
        enabled: true
    }
};

// Export für Node.js (falls benötigt)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Global verfügbar machen
window.CONFIG = CONFIG;
