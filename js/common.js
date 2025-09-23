// Common Functions for GeoDrop App

// SECURITY: HTML escaping function to prevent XSS attacks
window.escapeHtml = function(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// SECURITY: Safe innerHTML function that escapes content
window.setSafeInnerHTML = function(element, content) {
    if (!element) return;
    if (typeof content === 'string') {
        element.innerHTML = window.escapeHtml(content);
    } else {
        element.innerHTML = content;
    }
};

// Test function - Create only ONE Austria Tourist Drop (available everywhere)
window.createTestAustriaDrop = async function() {
    console.log('🧪 Creating TEST Austria Tourist Drop...');
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        
        // Get Schloss Schönbrunn image from local file
        console.log('📥 Getting Schloss Schönbrunn image from local file...');
        
        // Use your local background.png that definitely works
        const imageResponse = await fetch('./images/background.png');
        const imageBlob = await imageResponse.blob();
        
        console.log('✅ Got Schloss Schönbrunn image from local file');
        
        // Get current user
        let currentUser = window.currentUser;
        if (!currentUser && window.auth && window.auth.currentUser) {
            currentUser = window.auth.currentUser;
        }
        if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
            currentUser = window.firebase.auth().currentUser;
        }
        
        if (!currentUser) {
            showMessage('❌ Bitte zuerst anmelden!', true);
            return;
        }
        
        // Get next UserDrop number
        const userDropsSnapshot = await db.collection('userDrops')
            .where('createdBy', '==', currentUser.uid)
            .get();
        
        const nextUserDropNumber = userDropsSnapshot.size + 1;
        const imageFilename = `UserDrop${nextUserDropNumber}_Schloss_Schoenbrunn.jpg`;
        
        // Upload to Firebase Storage with correct filename
        const storage = window.firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`referenzbilder_userdrop/${imageFilename}`);
        
        console.log('📤 Uploading reference image to Firebase Storage...');
        const uploadTask = await imageRef.put(imageBlob);
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Calculate hash for image comparison
        const arrayBuffer = await imageBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const imageHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        console.log('🔐 Reference image hash calculated:', imageHash);
        console.log('✅ Reference image uploaded:', downloadURL);
        
        // Test drop - Schloss Schönbrunn in Wien
        const testDrop = {
            name: `UserDrop${nextUserDropNumber}`,
            description: '🇦🇹 Schloss Schönbrunn - Wien (TEST)',
            photoDescription: 'Fotografiere das Schloss Schönbrunn mit seiner barocken Fassade und den prächtigen Gärten. Das Schloss sollte vollständig sichtbar sein.',
            reward: 10,
            lat: 48.1833,
            lng: 16.3167,
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || currentUser.email || 'Test User',
            createdAt: new Date(),
            isActive: true,
            isAvailable: true,
            geodropNumber: nextUserDropNumber.toString(),
            collection: 'userDrops',
            referenceImage: imageFilename,
            referenceImageUrl: downloadURL, // Firebase Storage URL
            referenceImageHash: imageHash, // SHA-256 hash for comparison
            isAustriaTouristDrop: true,
            federalState: 'Wien'
        };
        
        await db.collection('userDrops').add(testDrop);
        
        console.log('✅ Test Austria Drop created:', testDrop.name);
        showMessage('✅ Test Austria Drop erfolgreich erstellt! (Schloss Schönbrunn)', false);
        
        // Reload drops if function exists
        if (typeof loadAllUserDrops === 'function') {
            loadAllUserDrops();
        }
        
    } catch (error) {
        console.error('❌ Error creating test Austria Drop:', error);
        showMessage('❌ Fehler beim Erstellen des Test Austria Drops: ' + error.message, true);
    }
};

// Message Display Function
window.showMessage = function(message, isError = false) {
    const alert = document.getElementById('custom-alert');
    if (!alert) return;
    
    // Create message with enhanced styling for errors
    const messageClass = isError ? 'bg-red-600 border-2 border-red-400' : 'bg-green-500';
    const iconClass = isError ? 'animate-pulse' : '';
    
    alert.innerHTML = `
        <div class="${messageClass} text-white px-6 py-4 rounded-lg shadow-lg ${isError ? 'ring-2 ring-red-300' : ''}">
            <div class="flex items-center">
                <span class="mr-3 ${iconClass}">${isError ? '❌' : '✅'}</span>
                <span class="font-medium">${message}</span>
                ${isError ? '<button onclick="this.parentElement.parentElement.parentElement.style.display=\'none\'" class="ml-auto text-white hover:text-gray-200 font-bold text-lg">&times;</button>' : ''}
            </div>
        </div>
    `;
    
    alert.style.display = 'block';
    
    // Auto-hide after different durations based on message type
    const hideDelay = isError ? 60000 : 8000; // 60 seconds for errors, 8 seconds for success
    setTimeout(() => {
        alert.style.display = 'none';
    }, hideDelay);
}

// GPS Location Functions
let currentLocation = null;

window.getCurrentLocation = function() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation wird nicht unterstützt'));
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                console.log('📍 Current location:', currentLocation);
                resolve(currentLocation);
            },
            (error) => {
                console.error('❌ Geolocation error:', error);
                reject(error);
            },
            options
        );
    });
}

// Map Functions - removed to prevent duplicate maps

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(timestamp) {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('de-DE');
}

// Animation Functions
function createFloatingElement(text, color = '#667eea') {
    const element = document.createElement('div');
    element.className = 'floating-element';
    element.textContent = text;
    element.style.color = color;
    element.style.position = 'fixed';
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';
    element.style.fontSize = '3rem';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    
    document.body.appendChild(element);
    
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, 1500);
}

function createBonusParticles(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'bonus-particle';
            particle.textContent = '💰';
            particle.style.position = 'fixed';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            particle.style.fontSize = '2rem';
            particle.style.zIndex = '2000';
            particle.style.pointerEvents = 'none';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }, i * 100);
    }
}

// MetaMask Functions
async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        showMessage('❌ MetaMask nicht installiert', true);
        return null;
    }
    
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
            showMessage('✅ MetaMask verbunden!', false);
            return accounts[0];
        }
    } catch (error) {
        console.error('❌ MetaMask connection error:', error);
        showMessage('❌ MetaMask Verbindung fehlgeschlagen', true);
    }
    
    return null;
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
        return defaultValue;
    }
}

// Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password && password.length >= 6;
}

// White Paper Popup Functions
window.showWhitePaperPopup = function() {
    const popup = document.getElementById('whitepaper-popup');
    if (popup) {
        popup.classList.remove('hidden');
    }
};

window.closeWhitePaperPopup = function() {
    const popup = document.getElementById('whitepaper-popup');
    if (popup) {
        popup.classList.add('hidden');
    }
};

// Debug Window Functions
window.toggleDebugWindow = function() {
    const debugWindow = document.getElementById('debug-window');
    if (debugWindow) {
        if (debugWindow.style.display === 'none' || debugWindow.style.display === '') {
            debugWindow.style.display = 'block';
        } else {
            debugWindow.style.display = 'none';
        }
    }
};

// Monetag SDK Functions for Container-specific Ad Display
window.showAdInSlot = function(containerId, zoneId) {
    console.log(`🔄 Zeige Ad in Container: ${containerId} (Zone: ${zoneId})`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`❌ Container nicht gefunden: ${containerId}`);
        return false;
    }
    
    // Prüfe ob die entsprechende Monetag SDK Funktion verfügbar ist
    const sdkFunction = `show_${zoneId}`;
    if (typeof window[sdkFunction] === 'function') {
        console.log(`✅ Monetag SDK Funktion gefunden: ${sdkFunction}`);
        
        try {
            // Versuche die Ad im Container anzuzeigen
            window[sdkFunction]({
                type: 'inPage',
                containerId: containerId
            });
            return true;
        } catch (error) {
            console.warn(`⚠️ SDK Funktion ${sdkFunction} Fehler:`, error);
            return false;
        }
    } else {
        console.warn(`❌ Monetag SDK Funktion nicht verfügbar: ${sdkFunction}`);
        
        // Fallback: Zeige Platzhalter-Banner mit korrekter Größe
        const containerWidth = container.offsetWidth || 300;
        const containerHeight = container.offsetHeight || 90;
        
        container.innerHTML = `
            <div style="width: ${containerWidth}px; height: ${containerHeight}px; max-width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="text-align: center; padding: 8px;">
                    <div style="font-size: 16px; margin-bottom: 2px;">📢</div>
                    <div style="font-size: 11px;">Zone ${zoneId}</div>
                    <div style="font-size: 9px; opacity: 0.8;">SDK lädt...</div>
                </div>
            </div>
        `;
        
        // Versuche SDK-Funktion später nochmal
        setTimeout(() => {
            if (typeof window[sdkFunction] === 'function') {
                console.log(`🔄 Retry: Monetag SDK Funktion ${sdkFunction} jetzt verfügbar`);
                window.showAdInSlot(containerId, zoneId);
            }
        }, 5000);
        
        return false;
    }
};

// Container-spezifische Ad-Funktionen
window.showSidebarAd = function() {
    return window.showAdInSlot('monetag-9915234', '9915234');
};

window.showTopBannerAd = function() {
    return window.showAdInSlot('monetag-9915224', '9915224');
};

window.showBottomBannerAd = function() {
    return window.showAdInSlot('monetag-9915233', '9915233');
};

// Alle Banner auf einmal laden
window.loadAllMonetagBanners = function() {
    console.log('🚀 Lade alle Monetag Banner...');
    
    const results = {
        sidebar: window.showSidebarAd(),
        top: window.showTopBannerAd(),
        bottom: window.showBottomBannerAd()
    };
    
    console.log('📊 Banner Lade-Ergebnisse:', results);
    return results;
};

// Monetag SDK Status prüfen
window.checkMonetagSDK = function() {
    console.log('🔍 Prüfe Monetag SDK Status...');
    
    const zones = ['9915234', '9915224', '9915233'];
    const sdkStatus = {};
    
    zones.forEach(zoneId => {
        const sdkFunction = `show_${zoneId}`;
        sdkStatus[zoneId] = {
            function: sdkFunction,
            available: typeof window[sdkFunction] === 'function',
            container: document.getElementById(`monetag-${zoneId}`) ? 'gefunden' : 'nicht gefunden'
        };
    });
    
    console.log('📊 Monetag SDK Status:', sdkStatus);
    return sdkStatus;
};

// Banner Container Status prüfen
window.checkBannerContainers = function() {
    console.log('🔍 Prüfe Banner Container...');
    
    const containers = ['monetag-9915234', 'monetag-9915224', 'monetag-9915233'];
    const containerStatus = {};
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        containerStatus[containerId] = {
            exists: !!container,
            visible: container ? container.offsetParent !== null : false,
            content: container ? container.innerHTML.length : 0,
            dimensions: container ? {
                width: container.offsetWidth,
                height: container.offsetHeight
            } : null
        };
    });
    
    console.log('📊 Banner Container Status:', containerStatus);
    return containerStatus;
};

// Manuelle SDK-Test-Funktion
window.testMonetagSDK = function() {
    console.log('🧪 Teste Monetag SDK manuell...');
    
    const zones = ['9915234', '9915224', '9915233'];
    zones.forEach(zoneId => {
        const sdkFunction = `show_${zoneId}`;
        console.log(`🔍 Prüfe ${sdkFunction}:`, typeof window[sdkFunction]);
        
        if (typeof window[sdkFunction] === 'function') {
            console.log(`✅ ${sdkFunction} verfügbar - teste Aufruf...`);
            try {
                // Teste den Aufruf ohne Parameter
                window[sdkFunction]();
                console.log(`✅ ${sdkFunction} erfolgreich aufgerufen`);
            } catch (error) {
                console.warn(`⚠️ ${sdkFunction} Fehler:`, error);
            }
        } else {
            console.log(`❌ ${sdkFunction} nicht verfügbar`);
        }
    });
    
    // Prüfe auch globale Monetag-Objekte
    console.log('🔍 Globale Monetag-Objekte:', {
        monetag: typeof window.monetag,
        monetagObject: window.monetag,
        monetagKeys: window.monetag ? Object.keys(window.monetag) : 'N/A'
    });
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 GeoDrop App initialized');
    
    // Try to get current location
    if (typeof getCurrentLocation === 'function') {
        const locationPromise = getCurrentLocation();
        if (locationPromise && typeof locationPromise.catch === 'function') {
            locationPromise.catch(error => {
                console.log('📍 GPS failed - no fallback location set');
            });
        }
    } else {
        console.log('📍 getCurrentLocation function not available');
    }
    
    // Warte auf Monetag SDK und lade dann Banner
    setTimeout(() => {
        console.log('🔄 Versuche Monetag Banner zu laden...');
        window.checkMonetagSDK();
        window.checkBannerContainers();
        window.loadAllMonetagBanners();
        
        // Teste SDK nach 10 Sekunden nochmal
        setTimeout(() => {
            console.log('🔄 Teste Monetag SDK nach 10 Sekunden...');
            window.testMonetagSDK();
        }, 10000);
    }, 3000);
});
