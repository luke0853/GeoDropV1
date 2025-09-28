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
                
                // AWS Rekognition Service
                rekognition: {
                    endpoint: 'https://rekognition.eu-central-1.amazonaws.com',
                    apiVersion: '2016-06-27',
                    limits: {
                        maxImages: 5000,
                        maxLabels: 5000,
                        maxFaces: 5000,
                        maxCompareFaces: 1000
                    }
                },
                
                // Image validation settings
                validation: {
                    minConfidence: 80,
                    maxFileSize: 5 * 1024 * 1024,
                    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
                    minWidth: 400,
                    minHeight: 400,
                    maxWidth: 4096,
                    maxHeight: 4096
                },
                
                // Face detection settings - DISABLED for GeoDrops
                faceDetection: {
                    enabled: false,  // Disabled for landscapes/buildings
                    minConfidence: 70,
                    maxFaces: 1,
                    attributes: ['ALL']
                },
                
                // Object detection settings
                objectDetection: {
                    enabled: true,
                    minConfidence: 60,
                    maxLabels: 10,
                    minInstances: 1
                }
            }
    },
    
    // Google Places API Configuration (für Standortvalidierung)
    googlePlaces: {
        // apiKey: "YOUR_GOOGLE_PLACES_API_KEY_HERE", // Wird aus config-secrets.js geladen
        searchRadius: 50, // Suchradius in Metern
        maxResults: 5, // Maximale Anzahl Ergebnisse
        minConfidence: 0.7, // Minimale Konfidenz für öffentliche Orte
        cacheDuration: 60 * 60 * 1000, // Cache-Dauer: 1 Stunde
        enableFallback: true // Fallback-Validierung aktivieren
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
        language: "de",
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
                // mapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Wird aus config-secrets.js geladen
            },
            
};

// Export für Node.js (falls benötigt)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Global verfügbar machen
window.CONFIG = CONFIG;

// Lade Google Places API Key aus config-secrets.js
if (typeof SECRETS !== 'undefined' && SECRETS.googlePlaces && SECRETS.googlePlaces.apiKey) {
    window.CONFIG.googlePlaces.apiKey = SECRETS.googlePlaces.apiKey;
    console.log('✅ Google Places API Key geladen');
} else {
    console.warn('⚠️ Google Places API Key nicht in config-secrets.js gefunden');
}