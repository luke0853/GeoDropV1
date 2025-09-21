// Wallet Functions for GeoDrop App

// Mobile device detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check if MetaMask mobile app is available
function isMetaMaskMobileAvailable() {
    return isMobileDevice() && (window.ethereum || window.web3);
}

// Mobile MetaMask deep link function
function openMetaMaskMobile() {
    const currentUrl = encodeURIComponent(window.location.href);
    const metamaskUrl = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
    
    // Create a more robust mobile MetaMask connection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Show loading message
    showMessage('📱 Öffne MetaMask App...', false);
    
    if (isIOS) {
        // iOS MetaMask deep link - improved
        const iosUrl = `metamask://dapp/${window.location.host}${window.location.pathname}`;
        
        // Try to open MetaMask app
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = iosUrl;
        document.body.appendChild(iframe);
        
        // Fallback to App Store if MetaMask not installed
        setTimeout(() => {
            document.body.removeChild(iframe);
            if (confirm('📱 MetaMask App nicht gefunden. Zum App Store weiterleiten?')) {
                window.open('https://apps.apple.com/app/metamask/id1438144202', '_blank');
            }
        }, 2000);
    } else if (isAndroid) {
        // Android MetaMask deep link - improved
        const androidUrl = `intent://${window.location.host}${window.location.pathname}#Intent;scheme=https;package=io.metamask;end`;
        
        // Try to open MetaMask app
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = androidUrl;
        document.body.appendChild(iframe);
        
        // Fallback to Play Store if MetaMask not installed
        setTimeout(() => {
            document.body.removeChild(iframe);
            if (confirm('📱 MetaMask App nicht gefunden. Zum Play Store weiterleiten?')) {
                window.open('https://play.google.com/store/apps/details?id=io.metamask', '_blank');
            }
        }, 2000);
    } else {
        // Generic mobile fallback
        window.location.href = metamaskUrl;
    }
    
    // Show instructions after delay
    setTimeout(() => {
        showMessage('📱 Öffne MetaMask App und kehre hierher zurück', false);
    }, 1000);
}

// Wallet connection functions
window.connectWallet = async function() {
    console.log('🔗 Attempting to connect wallet...');
    
    // Mobile-specific handling
    if (isMobileDevice()) {
        console.log('📱 Mobile device detected');
        
        // Check if MetaMask is available in mobile browser
        if (typeof window.ethereum === 'undefined') {
            // Try to open MetaMask mobile app
            showMessage('📱 Öffne MetaMask App...', false);
            openMetaMaskMobile();
            return;
        }
    }
    
    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
        if (isMobileDevice()) {
            showMessage('📱 MetaMask App nicht gefunden. Bitte installiere MetaMask aus dem App Store!', true);
        } else {
            showMessage('❌ MetaMask nicht installiert!', true);
        }
        return;
    }
    
    try {
        // First, revoke existing permissions to force re-selection
        try {
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });
        } catch (permError) {
            console.log('⚠️ Permission request failed, continuing with normal flow');
        }
        
        // Now request accounts (should ask for permission)
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.walletAddress = accounts[0];
        window.connectedWallet = accounts[0];
        window.walletExplicitlyConnected = true; // SECURITY: Mark as explicitly connected
        console.log('✅ Wallet connected (permission forced):', window.walletAddress);
        console.log('🔍 All available accounts:', accounts);
        updateWalletDisplay();
        updateTbnbDisplays();
        
        // Update trading wallet status if function exists
        if (typeof window.updateTradingWalletStatus === 'function') {
            window.updateTradingWalletStatus();
        }
        
        showMessage('✅ Wallet erfolgreich verbunden!');
    } catch (error) {
        console.error('❌ Wallet connection error:', error);
        if (error.code === 4001) {
            if (isMobileDevice()) {
                showMessage('❌ Wallet-Verbindung abgebrochen. Versuche es erneut in der MetaMask App.', true);
            } else {
                showMessage('❌ Wallet-Verbindung vom Benutzer abgebrochen', true);
            }
        } else if (error.code === -32002) {
            showMessage('❌ Wallet-Verbindung bereits ausstehend. Bitte warten...', true);
        } else {
            if (isMobileDevice()) {
                showMessage('❌ Mobile Wallet-Verbindung fehlgeschlagen. Bitte öffne MetaMask App manuell.', true);
            } else {
                showMessage(`❌ Wallet Verbindung fehlgeschlagen: ${error.message}`, true);
            }
        }
    }
};

window.disconnectWallet = function() {
    console.log('🔒 FORCING wallet disconnect...');
    
    // Clear all wallet variables
    window.walletAddress = null;
    window.connectedWallet = null;
    window.walletBalance = 0;
    window.walletProvider = null;
    window.walletSigner = null;
    window.walletExplicitlyConnected = false; // SECURITY: Mark as disconnected
    
    // Clear localStorage
    localStorage.removeItem('geodrop_user_address');
    localStorage.removeItem('geodrop_tbnb');
    localStorage.removeItem('geodrop_wallet_connected');
    
    // Update UI
    updateWalletDisplay();
    
    // Update trading wallet status if function exists
    if (typeof window.updateTradingWalletStatus === 'function') {
        window.updateTradingWalletStatus();
    }
    
    // CRITICAL: Force clear any remaining MetaMask connections
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Try to revoke permissions
            window.ethereum.request({
                method: 'wallet_revokePermissions',
                params: [{ eth_accounts: {} }]
            }).catch(error => {
                console.log('🔒 Permission revocation failed (expected):', error.message);
            });
        } catch (error) {
            console.log('🔒 Permission revocation not supported');
        }
    }
    
    showMessage('✅ Wallet getrennt', false);
    console.log('🔒 Wallet FORCE disconnected - no auto-reconnection allowed');
};

// Reset/switch wallet function
window.resetWallet = async function() {
    console.log('🔄 Resetting wallet connection...');
    
    // Disconnect current wallet
    window.disconnectWallet();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Connect wallet again (this will force account selection)
    await window.connectWallet();
};

function updateWalletDisplay() {
    const statusEl = document.getElementById('wallet-status');
    const addressEl = document.getElementById('wallet-address');
    const connectBtn = document.getElementById('connect-wallet-btn');
    const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');
    const disconnectBtn = document.getElementById('disconnect-wallet-btn');
    const mobileInstructions = document.getElementById('mobile-wallet-instructions');
    
    // Use global wallet address
    const currentWalletAddress = window.connectedWallet || window.walletAddress;
    
    if (statusEl && addressEl && connectBtn && disconnectBtn) {
        if (currentWalletAddress) {
            statusEl.textContent = 'Verbunden';
            statusEl.className = 'text-lg font-semibold text-green-400';
            addressEl.textContent = `${currentWalletAddress.slice(0, 6)}...${currentWalletAddress.slice(-4)}`;
            connectBtn.classList.add('hidden');
            if (connectMobileBtn) connectMobileBtn.classList.add('hidden');
            disconnectBtn.classList.remove('hidden');
            if (mobileInstructions) mobileInstructions.classList.add('hidden');
        } else {
            statusEl.textContent = 'Nicht verbunden';
            statusEl.className = 'text-lg font-semibold text-yellow-400';
            addressEl.textContent = 'Nicht verbunden';
            connectBtn.classList.remove('hidden');
            disconnectBtn.classList.add('hidden');
            
            // Show mobile-specific UI elements
            if (isMobileDevice()) {
                if (connectMobileBtn) connectMobileBtn.classList.remove('hidden');
                if (mobileInstructions) mobileInstructions.classList.remove('hidden');
            } else {
                if (connectMobileBtn) connectMobileBtn.classList.add('hidden');
                if (mobileInstructions) mobileInstructions.classList.add('hidden');
            }
        }
    }
}

window.testWalletConnection = function() {
    const currentWallet = window.connectedWallet || window.walletAddress;
    if (!currentWallet) {
        showMessage('❌ Bitte zuerst Wallet verbinden', true);
        return;
    }
    showMessage('🧪 Wallet Test erfolgreich!', false);
};

window.updateTbnbDisplays = async function() {
    const tbnbEl = document.getElementById('mining-tbnb');
    if (tbnbEl) {
        const currentWallet = window.connectedWallet || window.walletAddress;
        if (!currentWallet) {
            tbnbEl.textContent = '0.000000';
            return;
        }
        
        // SECURITY: Only update balance if wallet was explicitly connected
        if (!window.walletExplicitlyConnected) {
            console.log('🔒 Wallet not explicitly connected by user - skipping balance update');
            tbnbEl.textContent = '0.000000';
            return;
        }
        
        try {
            // Get real balance from wallet
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [currentWallet, 'latest']
            });
            const realBalance = parseInt(balance, 16) / Math.pow(10, 18);
            tbnbEl.textContent = realBalance.toFixed(6);
            window.walletBalance = realBalance;
            console.log('🔒 Balance updated for explicitly connected wallet:', realBalance);
        } catch (error) {
            console.error('❌ Error getting balance:', error);
            // NO MOCK DATA - Show error instead
            tbnbEl.textContent = 'Error';
            window.walletBalance = 0;
            console.log('❌ NO MOCK DATA - Real wallet balance required');
        }
    }
};

// Mobile-specific wallet connection function
window.connectWalletMobile = async function() {
    console.log('📱 Mobile wallet connection...');
    
    if (isMobileDevice()) {
        // Show mobile-specific instructions
        const instructions = `
📱 Mobile Wallet Verbindung:

1. Öffne die MetaMask App auf deinem Handy
2. Tippe auf "Browser" oder "DApp Browser"
3. Gehe zu: ${window.location.href}
4. Verbinde dein Wallet in der App

Oder tippe auf "MetaMask öffnen" um direkt zur App zu gelangen.
        `;
        
        if (confirm(instructions + '\n\nMetaMask App jetzt öffnen?')) {
            openMetaMaskMobile();
        }
        return false;
    }
    
    // Fallback to normal connection for non-mobile
    return await window.connectWalletUnified();
};

// Unified wallet connection function for all pages
window.connectWalletUnified = async function() {
    console.log('🔗 Unified wallet connection...');
    
    // Check for mobile first
    if (isMobileDevice() && typeof window.ethereum === 'undefined') {
        return await window.connectWalletMobile();
    }
    
    if (typeof window.ethereum === 'undefined') {
        if (isMobileDevice()) {
            alert('📱 MetaMask App nicht gefunden! Bitte installiere MetaMask aus dem App Store.');
        } else {
            alert('❌ MetaMask nicht installiert!');
        }
        return false;
    }
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        
        // Set all wallet variables consistently
        window.connectedWallet = walletAddress;
        window.walletAddress = walletAddress;
        window.walletBalance = 0;
        window.walletExplicitlyConnected = true; // SECURITY: Mark as explicitly connected
        
        console.log('✅ Unified wallet connected:', window.walletAddress);
        
        // Update all displays
        if (typeof window.updateWalletDisplay === 'function') {
            window.updateWalletDisplay();
        }
        
        if (typeof window.updateTbnbDisplays === 'function') {
            window.updateTbnbDisplays();
        }
        
        if (typeof window.updateTradingWalletStatus === 'function') {
            window.updateTradingWalletStatus();
        }
        
        return true;
    } catch (error) {
        console.error('❌ Unified wallet connection error:', error);
        alert('❌ Wallet-Verbindung fehlgeschlagen: ' + error.message);
        return false;
    }
};

// Initialize mobile wallet UI on page load - SECURITY FIXED
window.initializeMobileWallet = function() {
    console.log('📱 Initializing mobile wallet UI (NO AUTO-CONNECT)...');
    
    // SECURITY FIX: NO updateWalletDisplay() call - this might trigger auto-connection
    // updateWalletDisplay(); // REMOVED - this was causing auto-connection
    
    // CRITICAL SECURITY FIX: Disconnect wallet when MetaMask window is closed
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', function(accounts) {
            console.log('🔒 MetaMask accounts changed:', accounts);
            if (!accounts || accounts.length === 0) {
                console.log('🔒 MetaMask window closed - disconnecting wallet');
                window.disconnectWallet();
            } else {
                // CRITICAL: If accounts are provided (auto-reconnection), disconnect them
                console.log('🔒 MetaMask auto-reconnected accounts - FORCING DISCONNECT');
                window.disconnectWallet();
            }
        });
        
        // Also listen for disconnect events
        window.ethereum.on('disconnect', function() {
            console.log('🔒 MetaMask disconnected - disconnecting wallet');
            window.disconnectWallet();
        });
        
        // CRITICAL: Listen for chain changes and force disconnect
        window.ethereum.on('chainChanged', function() {
            console.log('🔒 MetaMask chain changed - disconnecting wallet');
            window.disconnectWallet();
        });
    }
    
    // Add mobile-specific event listeners - ONLY for explicit user clicks
    if (isMobileDevice()) {
        console.log('📱 Mobile device detected, showing mobile wallet options');
        
        // Add a global click handler for mobile wallet connection - ONLY on explicit clicks
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'connect-wallet-mobile-btn') {
                e.preventDefault();
                console.log('🔒 User explicitly clicked connect wallet button');
                window.connectWalletMobile();
            }
        });
    }
    
    console.log('🔒 Mobile wallet UI initialized - NO automatic connection, NO display update');
};

// SECURITY FIX: NO AUTO-INITIALIZATION - User must explicitly connect wallet
// Removed automatic wallet initialization for security
console.log('🔒 Wallet auto-initialization disabled for security');

// CRITICAL SECURITY FIX: Check for auto-connected wallet on page load and disconnect it
window.addEventListener('load', function() {
    console.log('🔒 Page loaded - checking for auto-connected wallet...');
    
    // Wait a moment for MetaMask to potentially auto-connect
    setTimeout(() => {
        if (typeof window.ethereum !== 'undefined') {
            // Check if MetaMask has auto-connected any accounts
            window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
                if (accounts && accounts.length > 0) {
                    console.log('🔒 CRITICAL: MetaMask auto-connected accounts detected:', accounts);
                    console.log('🔒 FORCING disconnect of auto-connected wallet...');
                    window.disconnectWallet();
                } else {
                    console.log('🔒 No auto-connected accounts detected');
                }
            }).catch(error => {
                console.log('🔒 Error checking for auto-connected accounts:', error);
            });
        }
    }, 1000); // Wait 1 second for MetaMask to potentially auto-connect
});

// CRITICAL SECURITY FIX: Force disconnect wallet when page is unloaded
window.addEventListener('beforeunload', function() {
    console.log('🔒 Page unloading - disconnecting wallet for security');
    if (window.disconnectWallet) {
        window.disconnectWallet();
    }
});

// Also disconnect on page hide (when switching tabs)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('🔒 Page hidden - disconnecting wallet for security');
        if (window.disconnectWallet) {
            window.disconnectWallet();
        }
    }
});