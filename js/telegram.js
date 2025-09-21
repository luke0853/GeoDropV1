// Telegram Integration - Real Notifications
// Extracted from backup to keep index.html clean

// Telegram Bot Configuration
// Lädt Konfiguration aus CONFIG oder verwendet Fallback
const TELEGRAM_CONFIG = window.CONFIG ? window.CONFIG.telegram : {
    botToken: 'MISSING_BOT_TOKEN',
    chatId: '-1001270226245',
    enabled: true
};

// Machine names mapping
const MACHINE_NAMES = {
    1: 'Basic Miner',
    2: 'Advanced Miner', 
    3: 'Pro Miner',
    4: 'Mega Miner'
};

// Machine costs mapping
const MACHINE_COSTS = {
    1: 0.001,
    2: 0.005,
    3: 0.02,
    4: 0.1
};

// Get machine cost
function getMachineCost(machineType) {
    return MACHINE_COSTS[machineType] || 0;
}

// Send Telegram notification for machine purchase
async function sendTelegramNotification(machineType) {
    // Überprüfe ob Telegram aktiviert ist
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('📱 Telegram notifications are disabled');
        return;
    }
    
    try {
        console.log('📱 Sending Telegram notification for machine type:', machineType);
        
        const machineName = MACHINE_NAMES[machineType] || 'Unknown Miner';
        const cost = getMachineCost(machineType);
        
        // Get username from global variables
        const username = window.userProfile?.username || window.currentUser?.email?.split('@')[0] || 'User';
        
        const message = `🚀 Neue Mining Machine gekauft!\n\n👤 Benutzer: ${username}\n🔧 Machine: ${machineName}\n💰 Kosten: ${cost} tBNB\n⏰ Zeit: ${new Date().toLocaleString('de-DE')}`;
        
        console.log('📱 Telegram message:', message);
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodedMessage}`;
        
        console.log('📱 Telegram URL:', telegramUrl);
        
        const response = await fetch(telegramUrl);
        const result = await response.json();
        
        console.log('📱 Telegram response:', result);
        
        if (result.ok) {
            console.log('✅ Telegram notification sent successfully');
            if (window.showMessage) {
                window.showMessage('📱 Telegram-Nachricht gesendet!', false);
            }
        } else {
            console.error('❌ Failed to send Telegram notification:', result);
            if (window.showMessage) {
                window.showMessage('❌ Telegram-Nachricht fehlgeschlagen', true);
            }
        }
        
    } catch (error) {
        console.error('❌ Error sending Telegram notification:', error);
        if (window.showMessage) {
            window.showMessage('❌ Telegram-Fehler: ' + error.message, true);
        }
    }
}

// Send Telegram notification for PixelDrop purchase
async function sendTelegramPixelDropNotification(username, pixelDropsToReceive) {
    // Überprüfe ob Telegram aktiviert ist
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('📱 Telegram notifications are disabled');
        return;
    }
    
    try {
        console.log('📱 Sending Telegram notification for PixelDrop purchase');
        
        const message = `🛒 ${username} hat ${pixelDropsToReceive} PixelDrop gekauft!`;
        
        console.log('📱 Telegram message:', message);
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodedMessage}`;
        
        console.log('📱 Telegram URL:', telegramUrl);
        
        const response = await fetch(telegramUrl);
        const result = await response.json();
        
        console.log('📱 Telegram response:', result);
        
        if (result.ok) {
            console.log('✅ Telegram PixelDrop notification sent successfully');
        } else {
            console.error('❌ Failed to send Telegram PixelDrop notification:', result);
        }
        
    } catch (error) {
        console.error('❌ Error sending Telegram PixelDrop notification:', error);
    }
}

// Test Telegram function
async function testTelegram() {
    // Überprüfe ob Telegram aktiviert ist
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('📱 Telegram notifications are disabled');
        if (window.showMessage) {
            window.showMessage('❌ Telegram ist deaktiviert', true);
        }
        return;
    }
    
    try {
        console.log('🧪 Testing Telegram...');
        
        const testMessage = '🧪 Test Message from GeoDrop Mining!';
        const encodedMessage = encodeURIComponent(testMessage);
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodedMessage}`;
        
        console.log('📱 Test Telegram URL:', telegramUrl);
        
        const response = await fetch(telegramUrl);
        const data = await response.json();
        
        console.log('📱 Test Response Status:', response.status);
        console.log('📱 Test Response Data:', data);
        
        if (data.ok) {
            console.log('✅ Test Telegram message sent successfully!');
            if (window.showMessage) {
                window.showMessage('✅ Test Telegram-Nachricht gesendet!', false);
            }
        } else {
            console.error('❌ Test Telegram failed:', data);
            if (data.error_code === 401) {
                if (window.showMessage) {
                    window.showMessage('❌ Telegram-Bot-Token ist ungültig (401 Unauthorized)', true);
                }
                console.log('💡 Lösung: Neuen Telegram-Bot erstellen oder Token aktualisieren');
            } else {
                if (window.showMessage) {
                    window.showMessage('❌ Test Telegram fehlgeschlagen: ' + data.description, true);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Test Telegram error:', error);
        if (window.showMessage) {
            window.showMessage('❌ Test Telegram-Fehler: ' + error.message, true);
        }
    }
}

// Send custom Telegram message
async function sendCustomTelegramMessage(message) {
    // Überprüfe ob Telegram aktiviert ist
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('📱 Telegram notifications are disabled');
        return false;
    }
    
    try {
        console.log('📱 Sending custom Telegram message:', message);
        
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodedMessage}`;
        
        const response = await fetch(telegramUrl);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Custom Telegram message sent successfully');
            return true;
        } else {
            console.error('❌ Failed to send custom Telegram message:', result);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error sending custom Telegram message:', error);
        return false;
    }
}

// Make functions globally available
window.sendTelegramNotification = sendTelegramNotification;
window.sendTelegramPixelDropNotification = sendTelegramPixelDropNotification;
window.testTelegram = testTelegram;
window.sendCustomTelegramMessage = sendCustomTelegramMessage;

console.log('📱 Telegram system loaded successfully');
