// GeoDrop App Configuration - SECURE VERSION
// Diese Datei enthält KEINE sensiblen Daten

const CONFIG = {
    // Firebase Configuration - KEINE API KEYS HIER!
    firebase: {
        // apiKey: "YOUR_FIREBASE_API_KEY_HERE", // Wird aus config-secrets.js geladen
        authDomain: "geodrop-f3ee1.firebaseapp.com",
        projectId: "geodrop-f3ee1",
        storageBucket: "geodrop-f3ee1.firebasestorage.app",
        messagingSenderId: "1054615552034",
        appId: "1:1054615552034:web:8d61c64b5296f4e0cc4a7b",
        measurementId: "G-RBEJES6HX1"
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
            geodropRevenue: "0xecF36D6E0324cA88ced6D64329717c45f3dc0B1B", // Use PixelDrop contract for mining
            pixelDrop: "0xecF36D6E0324cA88ced6D64329717c45f3dc0B1B",
            miningContract: "0xecF36D6E0324cA88ced6D64329717c45f3dc0B1B", // Dedicated mining contract
            // Weitere Contract-Adressen können hier hinzugefügt werden
        },
        // Wallet Addresses (PUBLIC - safe to expose)
        wallets: {
            geodropEinnahmen: "0xA11dbD457CEe886EDf0BbFE0126efECAd9220DEa",
            lagerWallet: "0x6167202E3dA90e92da3A85b79e9eDA265e4EEBC4",
            poolWallet: "0x6167202E3dA90e92da3A85b79e9eDA265e4EEBC4" // Account nr 2
        },
            // PRIVATE KEYS - WERDEN AUS config-secrets.js GELADEN
            privateKeys: {
                // poolPrivateKey: "YOUR_PRIVATE_KEY_HERE" // Wird aus config-secrets.js geladen
            },
            
            // AWS Configuration (for Rekognition)
            aws: {
                region: 'eu-central-1',
                // accessKeyId: "YOUR_AWS_ACCESS_KEY" // Wird aus config-secrets.js geladen
                // secretAccessKey: "YOUR_AWS_SECRET_KEY" // Wird aus config-secrets.js geladen
            }
    },
    
    // App Configuration
    app: {
        name: "GeoDrop",
        version: "2.0.0",
        environment: "development", // development, staging, production
        debug: true,
        defaultLocation: {
            lat: 0,
            lng: 0,
            name: "World View"
        }
    },
    
    // Dev Configuration - KEINE PASSWÖRTER HIER!
    dev: {
        // password: "YOUR_DEV_PASSWORD_HERE" // Wird aus config-secrets.js geladen
    },
    
    // Mining Configuration
    mining: {
        machines: {
            1: { name: "Basic Miner", cost: 0.001, boost: 2, currency: "tBNB" },
            2: { name: "Advanced Miner", cost: 0.005, boost: 12, currency: "tBNB" },
            3: { name: "Pro Miner", cost: 0.02, boost: 60, currency: "tBNB" },
            4: { name: "Mega Miner", cost: 0.1, boost: 400, currency: "tBNB" }
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
        language: "de", // Will be overridden by localStorage
        animations: true,
        soundEffects: false
    },
    
            // Telegram Configuration - KEINE TOKENS HIER!
            telegram: {
                // botToken: "YOUR_BOT_TOKEN_HERE", // Wird aus config-secrets.js geladen
                chatId: "-1001270226245",
                enabled: true
            },
            
            // Google Configuration
            google: {
                // placesApiKey: "YOUR_GOOGLE_PLACES_API_KEY" // Wird aus config-secrets.js geladen
            }
};

// Export für Node.js (falls benötigt)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Global verfügbar machen
window.CONFIG = CONFIG;