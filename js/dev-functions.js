// Dev Functions for GeoDrop App

// Global variables
let isDevLoggedIn = false;
let devPassword = 'geheim'; // Default dev password

// Helper function to sync global dev status
function updateGlobalDevStatus() {
    window.isDevLoggedIn = isDevLoggedIn;
    
    // Update GeoCard Dev coordinates section visibility
    if (typeof window.autoActivateAdminMode === 'function') {
        window.autoActivateAdminMode();
    }
}

// Test dev login function
window.testDevLogin = function() {
    const passwordInput = document.getElementById('dev-password');
    if (!passwordInput) {
        alert('❌ Dev-Passwort Eingabefeld nicht gefunden!');
        return;
    }
    
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === devPassword) {
        // Set dev session
        isDevLoggedIn = true;
        window.isAdmin = true;
        window.isDevLoggedIn = true; // Add this for upload functions
        updateGlobalDevStatus();
        
        // Save to localStorage
        localStorage.setItem('devLoggedIn', 'true');
        localStorage.setItem('devLoginTimestamp', Date.now().toString());
        
        // Update UI
        window.updateDevStatus();
        
        alert('✅ Dev-Zugang erfolgreich!');
        passwordInput.value = '';
        
        // Update debug info
        if (window.currentUser) {
            document.getElementById('debug-user-id').textContent = window.currentUser.uid;
            document.getElementById('debug-session').textContent = 'Aktiv';
        }
        
        console.log('🔧 Dev login successful');
    } else {
        alert('❌ Falsches Dev-Passwort!');
        passwordInput.value = '';
    }
};

// Dev Login System
window.showDevLoginPopup = function() {
    console.log('🔐 showDevLoginPopup called, isDevLoggedIn:', isDevLoggedIn);
    
    // Check if already logged in
    if (isDevLoggedIn) {
        console.log('🔓 Already logged in, switching to dev page...');
        // Use the proper navigation function
        if (typeof showPage === 'function') {
            showPage('dev');
        } else if (typeof window.showPage === 'function') {
            window.showPage('dev');
        } else {
            // Fallback to direct navigation
            window.location.href = 'pages/dev.html';
        }
        return;
    }
    
    const popup = document.getElementById('dev-login-popup');
    if (popup) {
        popup.classList.remove('hidden');
        document.getElementById('dev-password').focus();
        console.log('🔐 Dev login popup shown');
    } else {
        console.error('❌ Dev login popup not found!');
    }
}

window.closeDevLoginPopup = function() {
    const popup = document.getElementById('dev-login-popup');
    if (popup) {
        popup.classList.add('hidden');
        document.getElementById('dev-password').value = '';
    }
}

window.loginDev = async function() {
    const password = document.getElementById('dev-password').value;
    
    // SECURITY: Only allow correct password
    if (password === devPassword) {
        try {
            // Set dev session
        isDevLoggedIn = true;
        window.isAdmin = true;
            window.isDevLoggedIn = true;
        updateGlobalDevStatus();
        
            // Save to localStorage
        localStorage.setItem('devLoggedIn', 'true');
            localStorage.setItem('devLoginTimestamp', Date.now().toString());
            
            // Update UI
            updateDevStatus();
            
            // Close popup
        closeDevLoginPopup();
            
            // Show success message
            showMessage('✅ Dev-Zugang erfolgreich!', false);
            
            // Open Dev page after successful login
        setTimeout(() => {
                if (typeof showPage === 'function') {
                    showPage('dev');
                } else if (typeof window.showPage === 'function') {
                    window.showPage('dev');
    } else {
                    window.location.href = 'pages/dev.html';
                }
            }, 500);
            
            console.log('🔧 Dev login successful');
    } catch (error) {
            console.error('❌ Dev login error:', error);
            showMessage('❌ Dev-Login Fehler!', true);
        }
        } else {
        showMessage('❌ Falsches Dev-Passwort!', true);
        document.getElementById('dev-password').value = '';
    }
}

// Dev Status Management
window.updateDevStatus = function() {
    console.log('🔧 Updating dev status...');
    
    // Update status elements
    const devStatusElement = document.getElementById('dev-status');
    const adminStatusElement = document.getElementById('admin-status');
    const devPermissionElement = document.getElementById('dev-permission-status');
    const currentUserElement = document.getElementById('current-user');
    const devDropBtn = document.getElementById('dev-drop-btn');
    
    if (isDevLoggedIn) {
        if (devStatusElement) devStatusElement.textContent = '✅ Dev-Berechtigung aktiv';
        if (devStatusElement) devStatusElement.className = 'text-lg font-semibold text-green-400';
        if (adminStatusElement) adminStatusElement.textContent = 'Aktiv';
        if (adminStatusElement) adminStatusElement.className = 'text-green-400';
        if (devPermissionElement) devPermissionElement.textContent = 'Vollzugriff';
        if (devPermissionElement) devPermissionElement.className = 'text-green-400';
        if (devDropBtn) {
            devDropBtn.disabled = false;
            devDropBtn.textContent = '🎯 Dev Drop erstellen';
        }
        } else {
        if (devStatusElement) devStatusElement.textContent = '🔒 Dev-Berechtigung inaktiv';
        if (devStatusElement) devStatusElement.className = 'text-lg font-semibold text-red-400';
        if (adminStatusElement) adminStatusElement.textContent = 'Inaktiv';
        if (adminStatusElement) adminStatusElement.className = 'text-red-400';
        if (devPermissionElement) devPermissionElement.textContent = 'Keine Berechtigung';
        if (devPermissionElement) devPermissionElement.className = 'text-red-400';
        if (devDropBtn) {
            devDropBtn.disabled = true;
            devDropBtn.textContent = '🔒 Admin-Modus erforderlich';
        }
    }
    
    // Update current user
    if (currentUserElement) {
        if (window.currentUser) {
            currentUserElement.textContent = window.currentUser.email || 'Angemeldet';
            } else {
            currentUserElement.textContent = 'Nicht angemeldet';
        }
    }
}

// Dev Authorization Functions
window.authorizeDev = function() {
    if (!window.currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        return;
    }
    
    if (confirm('🔧 Dev-Berechtigung für aktuellen User aktivieren?')) {
        isDevLoggedIn = true;
        window.isAdmin = true;
        window.isDevLoggedIn = true;
        updateGlobalDevStatus();
        updateDevStatus();
        showMessage('✅ Dev-Berechtigung aktiviert!', false);
        console.log('🔧 Dev authorization granted');
    }
}

window.deauthorizeDev = function() {
    if (confirm('🔧 Dev-Berechtigung deaktivieren?')) {
    isDevLoggedIn = false;
    window.isAdmin = false;
        window.isDevLoggedIn = false;
    updateGlobalDevStatus();
        updateDevStatus();
        showMessage('❌ Dev-Berechtigung deaktiviert!', false);
        console.log('🔧 Dev authorization revoked');
    }
}

window.logoutDev = function() {
    if (confirm('🔧 Dev-Session beenden?')) {
        isDevLoggedIn = false;
        window.isAdmin = false;
        window.isDevLoggedIn = false;
        updateGlobalDevStatus();
        updateDevStatus();
        localStorage.removeItem('devLoggedIn');
        localStorage.removeItem('devLoginTimestamp');
        showMessage('🚪 Dev-Session beendet!', false);
        console.log('🔧 Dev session ended');
    }
}

// Dev Status Debug
window.debugDevStatus = function() {
    console.log('🔍 Dev Status Debug:');
    console.log('- isDevLoggedIn:', isDevLoggedIn);
    console.log('- window.isAdmin:', window.isAdmin);
    console.log('- window.isDevLoggedIn:', window.isDevLoggedIn);
    console.log('- sessionStorage devLoggedIn:', sessionStorage.getItem('devLoggedIn'));
    console.log('- sessionStorage devLoginTimestamp:', sessionStorage.getItem('devLoginTimestamp'));
    console.log('- currentUser:', window.currentUser);
    
    showMessage('🔍 Dev-Status in Konsole ausgegeben', false);
}

// Get Total Drops Count (Dev + User)
window.getTotalDropsCount = async function() {
    try {
        if (!window.db) {
            return 0;
        }
        
        const devDropsSnapshot = await window.db.collection('devDrops').get();
        const userDropsSnapshot = await window.db.collection('userDrops').get();
        
        const totalCount = devDropsSnapshot.size + userDropsSnapshot.size;
        console.log(`📊 Total drops count: ${devDropsSnapshot.size} dev + ${userDropsSnapshot.size} user = ${totalCount}`);
        return totalCount;
    } catch (error) {
        console.error('❌ Error getting total drops count:', error);
        return 0;
    }
};

// Get Dev Drops Count (for backward compatibility)
window.getDevDropsCount = async function() {
    try {
        if (!window.db) {
            return 0;
        }
        
        const devDropsSnapshot = await window.db.collection('devDrops').get();
        
        // Count only real GeoDrops (starting with "GeoDrop"), not pattern drops like "devDrop1"
        let realGeoDropsCount = 0;
        devDropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.name && data.name.startsWith('GeoDrop')) {
                realGeoDropsCount++;
            }
        });
        
        console.log(`📊 Dev drops count: ${devDropsSnapshot.size} total, ${realGeoDropsCount} real GeoDrops`);
        return realGeoDropsCount;
    } catch (error) {
        console.error('❌ Error getting dev drops count:', error);
        return 0;
    }
};

// Update Next Filename Display (AWS-secured)
window.updateNextFilenameDisplay = async function() {
    try {
        console.log('🔄 Updating next filename display with AWS security...');
        
        // Use AWS-secured counting
        let count;
        if (window.awsRekognitionService) {
            try {
                count = await window.awsRekognitionService.getSecureDropCount();
                console.log('🔒 Using AWS-secured count:', count);
            } catch (awsError) {
                console.warn('⚠️ AWS count failed, falling back to local count:', awsError);
                count = await getDevDropsCount();
            }
        } else {
            console.log('⚠️ AWS service not available, using local count');
            count = await getDevDropsCount();
        }
        
        const nextNumber = count + 1;
        const nextFilename = `GeoDrop${nextNumber}`;
        
        console.log(`📊 Secure count: ${count}, next number: ${nextNumber}`);
        
        const displayElement = document.getElementById('next-filename-display');
        if (displayElement) {
            displayElement.textContent = `Nächster: ${nextFilename}`;
            console.log(`✅ Updated display element: Nächster: ${nextFilename}`);
        }
        
        // Also update the filename input field
        const filenameInput = document.getElementById('dev-filename');
        if (filenameInput) {
            if (!filenameInput.value || filenameInput.value === 'GeoDrop1') {
                filenameInput.value = nextFilename;
                console.log(`✅ Updated filename input: ${nextFilename}`);
            } else {
                console.log(`ℹ️ Filename input already has value: ${filenameInput.value}`);
            }
        }
        
        console.log(`📝 Next filename: ${nextFilename} (${count} existing drops)`);
    } catch (error) {
        console.error('❌ Error updating next filename display:', error);
    }
};

// Dev Drop Creation
window.createDevDrop = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    if (!window.currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        return;
    }
    
    try {
    // Get current location
        let lat, lng;
        if (window.currentLocation) {
            lat = window.currentLocation.lat;
            lng = window.currentLocation.lng;
        } else {
            showMessage('❌ Standort nicht verfügbar!', true);
        return;
    }
    
        // Get current language
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
        
        // Create dev drop
        const dropData = {
            id: `dev_${Date.now()}`,
            name: 'Dev Drop',
            description: 'Entwickler-Drop für Tests',
            lat: lat,
            lng: lng,
            reward: 100,
            createdBy: window.currentUser.uid,
            createdAt: new Date(),
            type: 'dev',
            isActive: true,
            // Dual language fields
            language: currentLang,
            description_de: currentLang === 'de' ? 'Entwickler-Drop für Tests' : null,
            description_en: currentLang === 'en' ? 'Developer Drop for Tests' : null
        };
        
        // Save to Firebase
        await db.collection('devDrops').doc(dropData.id).set(dropData);
        
        showMessage('✅ Dev Drop erfolgreich erstellt!', false);
        console.log('🔧 Dev drop created:', dropData);
        
        // Refresh map and drop lists
        if (typeof window.loadGeoDrops === 'function') {
            console.log('🔄 Refreshing map after dev drop creation...');
            window.loadGeoDrops();
        }
        
        // Refresh dev drops table
        if (typeof window.loadDevDropsForUpload === 'function') {
            console.log('🔄 Refreshing dev drops table...');
            window.loadDevDropsForUpload();
        }
        
        // Navigate map to new drop location
        if (window.geoMap && lat && lng) {
            console.log(`🗺️ Navigating map to new dev drop: ${lat}, ${lng}`);
            window.geoMap.setView([lat, lng], 15);
        }
        
    } catch (error) {
        console.error('❌ Dev drop creation error:', error);
        showMessage('❌ Fehler beim Erstellen des Dev Drops!', true);
    }
}

// Dev Tab Management (for index.html dev tab)
window.showDevTabIndex = function(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.dev-tab');
    tabs.forEach(tab => tab.classList.add('hidden'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('[id$="-tab"]');
    tabButtons.forEach(btn => {
        btn.classList.remove('bg-blue-600');
        btn.classList.add('bg-gray-600');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-content');
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Activate selected tab button
    const selectedButton = document.getElementById(tabName + '-tab');
    if (selectedButton) {
        selectedButton.classList.remove('bg-gray-600');
        selectedButton.classList.add('bg-blue-600');
    }

    console.log('🔧 Switched to dev tab (index):', tabName);
}

// Test Functions
window.runAllTests = function() {
    console.log('🧪 Running all tests...');
    
    // Test 1: Dev Status
    console.log('✅ Test 1 - Dev Status:', isDevLoggedIn);
    
    // Test 2: Firebase Connection
    if (typeof db !== 'undefined') {
        console.log('✅ Test 2 - Firebase connected');
    } else {
        console.log('❌ Test 2 - Firebase not connected');
    }
    
    // Test 3: Current User
    if (window.currentUser) {
        console.log('✅ Test 3 - User logged in:', window.currentUser.email);
    } else {
        console.log('❌ Test 3 - No user logged in');
    }
    
    // Test 4: Location
    if (window.currentLocation) {
        console.log('✅ Test 4 - Location available:', window.currentLocation);
    } else {
        console.log('❌ Test 4 - No location available');
    }
    
    showMessage('🧪 Alle Tests in Konsole ausgegeben', false);
}

window.debugApp = function() {
    console.log('🔍 App Debug Info:');
    console.log('- User:', window.currentUser);
    console.log('- Location:', window.currentLocation);
    console.log('- Dev Status:', isDevLoggedIn);
    console.log('- Firebase:', typeof db !== 'undefined');
    console.log('- LocalStorage:', localStorage);
    
    showMessage('🔍 App-Debug in Konsole ausgegeben', false);
}

window.debugLocation = function() {
    if (window.currentLocation) {
        console.log('📍 Location Debug:');
        console.log('- Lat:', window.currentLocation.lat);
        console.log('- Lng:', window.currentLocation.lng);
        console.log('- Accuracy:', window.currentLocation.accuracy);
        console.log('- Timestamp:', window.currentLocation.timestamp);
        
        showMessage(`📍 Standort: ${window.currentLocation.lat.toFixed(6)}, ${window.currentLocation.lng.toFixed(6)}`, false);
    } else {
        showMessage('❌ Kein Standort verfügbar!', true);
    }
}

window.getCurrentLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                window.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date()
                };
                showMessage('🎯 Standort aktualisiert!', false);
                console.log('📍 New location:', window.currentLocation);
            },
            (error) => {
                console.error('❌ Location error:', error);
                showMessage('❌ Standort-Fehler!', true);
            }
        );
    } else {
        showMessage('❌ Geolocation nicht unterstützt!', true);
    }
}

// Firebase Tests
window.debugFirebaseCollections = async function() {
    if (!db) {
        showMessage('❌ Firebase nicht verbunden!', true);
        return;
    }
    
    try {
        console.log('🔥 Firebase Collections Debug:');
        
        // Test geodrops collection
        const geodropsSnapshot = await db.collection('geodrops').limit(5).get();
        console.log('- GeoDrops count:', geodropsSnapshot.size);
        
        // Test users collection
        const usersSnapshot = await db.collection('users').limit(5).get();
        console.log('- Users count:', usersSnapshot.size);
        
        showMessage('🔥 Firebase-Test in Konsole ausgegeben', false);
    } catch (error) {
        console.error('❌ Firebase test error:', error);
        showMessage('❌ Firebase-Test Fehler!', true);
    }
}

window.debugAllCounters = async function() {
    if (!db) {
        showMessage('❌ Firebase nicht verbunden!', true);
            return;
        }
        
    try {
        console.log('📊 Counter Debug:');
        
        const countersDoc = await db.collection('counters').doc('main').get();
        if (countersDoc.exists) {
            console.log('- Counters:', countersDoc.data());
        } else {
            console.log('- No counters document found');
        }
        
        showMessage('📊 Counter-Test in Konsole ausgegeben', false);
    } catch (error) {
        console.error('❌ Counter test error:', error);
        showMessage('❌ Counter-Test Fehler!', true);
    }
}

// Drop Tests
window.resetDailyClaims = async function() {
    if (!window.currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        return;
    }
    
    if (confirm('🔄 Tägliche Claims für aktuellen User zurücksetzen?')) {
        try {
            await db.collection('users').doc(window.currentUser.uid).update({
                dailyClaims: [],
                lastClaimDate: null
            });
            
            showMessage('✅ Tägliche Claims zurückgesetzt!', false);
            console.log('🔄 Daily claims reset for user:', window.currentUser.uid);
    } catch (error) {
            console.error('❌ Reset daily claims error:', error);
            showMessage('❌ Fehler beim Zurücksetzen!', true);
        }
    }
}

window.addDropDescriptions = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    try {
        const geodropsSnapshot = await db.collection('geodrops').get();
        let updated = 0;
        
        geodropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (!data.description || data.description === '') {
                db.collection('geodrops').doc(doc.id).update({
                    description: 'Ein mysteriöser GeoDrop wartet auf dich!'
                });
                updated++;
            }
        });
        
        showMessage(`✅ ${updated} Drops mit Beschreibungen aktualisiert!`, false);
        console.log('📝 Added descriptions to', updated, 'drops');
    } catch (error) {
        console.error('❌ Add descriptions error:', error);
        showMessage('❌ Fehler beim Hinzufügen der Beschreibungen!', true);
    }
}

window.debugDropNumbers = async function() {
    if (!db) {
        showMessage('❌ Firebase nicht verbunden!', true);
                return;
            }
            
    try {
        const geodropsSnapshot = await db.collection('geodrops').get();
        const dropNumbers = [];
        
        geodropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.dropNumber) {
                dropNumbers.push(data.dropNumber);
            }
        });
        
        console.log('📊 Drop Numbers:', dropNumbers.sort((a, b) => a - b));
        showMessage(`📊 ${dropNumbers.length} Drop-Nummern in Konsole ausgegeben`, false);
    } catch (error) {
        console.error('❌ Debug drop numbers error:', error);
        showMessage('❌ Fehler beim Debuggen der Drop-Nummern!', true);
    }
}

window.debugGeoDrops = async function() {
    if (!db) {
        showMessage('❌ Firebase nicht verbunden!', true);
        return;
    }
    
    try {
        const geodropsSnapshot = await db.collection('geodrops').get();
        console.log('🎯 GeoDrops loaded:', geodropsSnapshot.size);
        
        geodropsSnapshot.forEach(doc => {
            console.log('- Drop:', doc.id, doc.data());
        });
        
        showMessage(`🎯 ${geodropsSnapshot.size} GeoDrops in Konsole ausgegeben`, false);
    } catch (error) {
        console.error('❌ Load geodrops error:', error);
        showMessage('❌ Fehler beim Laden der GeoDrops!', true);
    }
}

window.fixOldDevDrops = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    try {
        const geodropsSnapshot = await db.collection('geodrops').where('type', '==', 'dev').get();
        let fixed = 0;
        
        geodropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (!data.dropNumber) {
                db.collection('geodrops').doc(doc.id).update({
                    dropNumber: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                });
                fixed++;
            }
        });
        
        showMessage(`✅ ${fixed} Dev Drops repariert!`, false);
        console.log('🔧 Fixed', fixed, 'dev drops');
                } catch (error) {
        console.error('❌ Fix dev drops error:', error);
        showMessage('❌ Fehler beim Reparieren der Dev Drops!', true);
    }
}

window.resetDropAvailability = async function(type) {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    if (confirm(`🔄 Verfügbarkeit für ${type} Drops zurücksetzen?`)) {
        try {
            const geodropsSnapshot = await db.collection('geodrops').get();
            let reset = 0;
            
            geodropsSnapshot.forEach(doc => {
                const data = doc.data();
                if (type === 'all' || data.type === type) {
                    db.collection('geodrops').doc(doc.id).update({
                        isActive: true,
                        claimedBy: null,
                        claimedAt: null
                    });
                    reset++;
                }
            });
            
            showMessage(`✅ ${reset} Drops zurückgesetzt!`, false);
            console.log('🔄 Reset', reset, 'drops');
    } catch (error) {
            console.error('❌ Reset drops error:', error);
            showMessage('❌ Fehler beim Zurücksetzen der Drops!', true);
        }
    }
}

// Counter Tests
window.resetGeoDropCounter = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    if (confirm('🔄 GeoDrop Counter auf 1 zurücksetzen? (Vorsicht: Kann zu Namenskonflikten führen!)')) {
        try {
            await db.collection('counters').doc('main').set({
                geodropCounter: 1
            }, { merge: true });
            
            showMessage('✅ Counter auf 1 zurückgesetzt!', false);
            console.log('🔄 GeoDrop counter reset to 1');
    } catch (error) {
            console.error('❌ Reset counter error:', error);
            showMessage('❌ Fehler beim Zurücksetzen des Counters!', true);
        }
    }
}

// Removed duplicate function - using async version above

// AWS Migration Function
window.migrateDevDropsToAWS = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    try {
        showMessage('🔄 Starte Migration der Dev Drops zu AWS...', false);
        console.log('🔄 Starting AWS migration...');
        
        if (!window.awsRekognitionService) {
            showMessage('❌ AWS Rekognition Service nicht verfügbar!', true);
            return;
        }
        
        // Start migration
        const result = await window.awsRekognitionService.migrateOldDevDrops();
        
        showMessage(`✅ Migration abgeschlossen! ${result.migrated} Drops migriert, ${result.errors} Fehler`, false);
        console.log('🎯 Migration result:', result);
        
        // Reload the dev drops list
        setTimeout(() => {
            if (typeof loadDevDropsForDeletion === 'function') {
                loadDevDropsForDeletion();
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        showMessage('❌ Migration fehlgeschlagen!', true);
    }
}

// Pool Wallet Functions (from backup)
window.initializePoolWallet = function() {
    console.log('🏦 Initializing pool wallet...');
    updatePoolWalletDisplay();
}

window.updatePoolWalletDisplay = function() {
    const poolPixeldrops = document.getElementById('pool-pixeldrops');
    const poolBnb = document.getElementById('pool-bnb');
    
    if (poolPixeldrops) {
        poolPixeldrops.textContent = 'Lädt...';
    }
    if (poolBnb) {
        poolBnb.textContent = 'Lädt...';
    }
    
    // Fetch real pool wallet data
    updatePoolWalletBalances();
}

window.updatePoolWalletBalances = async function() {
    try {
        console.log('🏦 Updating pool wallet balances...');
        
        if (!window.ethereum) {
            console.log('❌ No ethereum provider');
            const poolPixeldrops = document.getElementById('pool-pixeldrops');
            const poolBnb = document.getElementById('pool-bnb');
            
            if (poolPixeldrops) {
                poolPixeldrops.textContent = 'Kein Wallet';
            }
            if (poolBnb) {
                poolBnb.textContent = 'Kein Wallet';
            }
            return;
        }
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const poolWalletAddress = window.CONFIG.blockchain.wallets.poolWallet;
        
        // Get BNB balance
        const bnbBalance = await provider.getBalance(poolWalletAddress);
        const bnbFormatted = ethers.utils.formatEther(bnbBalance);
        
        // Get PixelDrop balance
        const pixeldropContractAddress = window.CONFIG.blockchain.contracts.pixelDrop;
        const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ];
        
        const pixeldropContract = new ethers.Contract(pixeldropContractAddress, erc20Abi, provider);
        const pixeldropBalance = await pixeldropContract.balanceOf(poolWalletAddress);
        const decimals = await pixeldropContract.decimals();
        const pixeldropFormatted = ethers.utils.formatUnits(pixeldropBalance, decimals);
        
        // Update display
        const poolPixeldrops = document.getElementById('pool-pixeldrops');
        const poolBnb = document.getElementById('pool-bnb');
        
        if (poolPixeldrops) {
            poolPixeldrops.textContent = `${parseFloat(pixeldropFormatted).toFixed(2)} PD`;
        }
        if (poolBnb) {
            poolBnb.textContent = `${parseFloat(bnbFormatted).toFixed(4)} tBNB`;
        }
        
        console.log('✅ Pool wallet balances updated');
        
    } catch (error) {
        console.error('❌ Error updating pool wallet balances:', error);
        const poolPixeldrops = document.getElementById('pool-pixeldrops');
        const poolBnb = document.getElementById('pool-bnb');
        
        if (poolPixeldrops) {
            poolPixeldrops.textContent = 'Fehler';
        }
        if (poolBnb) {
            poolBnb.textContent = 'Fehler';
        }
    }
}

// Upload Functions
window.uploadDevImageWithDrop = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
            return;
        }
        
    const fileInput = document.getElementById('dev-image-file');
    const filenameInput = document.getElementById('dev-filename');
    const descriptionInput = document.getElementById('dev-drop-description');
    const latInput = document.getElementById('upload-lat');
    const lngInput = document.getElementById('upload-lng');
    
    if (!fileInput.files[0]) {
        showMessage('❌ Bitte wähle ein Bild aus!', true);
            return;
        }
        
    try {
        const file = fileInput.files[0];
        
        // Client-side file validation
        if (!file) {
            showMessage('❌ Bitte wähle eine Datei aus!', true);
            return;
        }
        
        // Check file format
        const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        if (!supportedFormats.includes(file.type)) {
            showMessage(`❌ Unsupported Dateiformat: ${file.type}. Erlaubt: JPEG, PNG, WebP`, true);
            return;
        }
        
        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showMessage(`❌ Datei zu groß: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 5MB`, true);
            return;
        }
        
        // AWS Rekognition Image Validation with Secure Drop Counting
        if (window.awsRekognitionService) {
            try {
                showMessage('🔍 Validiere Bild und Drop-Nummer mit AWS...', false);
                
                const dropData = {
                    name: filenameInput.value || 'GeoDrop1',
                    description: descriptionInput.value || 'Ein mysteriöser GeoDrop wartet auf dich!'
                };
                
                const validation = await window.awsRekognitionService.validateDropCreation(file, dropData);
                
                if (!validation.valid) {
                    console.warn('⚠️ AWS validation failed, using fallback:', validation.error);
                    showMessage('⚠️ AWS-Validierung fehlgeschlagen, verwende lokale Zählung...', false);
                    
                    // Fallback to local counting
                    const devDropsCount = await getDevDropsCount();
                    const nextNumber = devDropsCount + 1;
                    const filename = `GeoDrop${nextNumber}`;
                    filenameInput.value = filename;
                    window.currentUploadAWSHash = null; // No AWS hash
                } else {
                    showMessage(`✅ AWS-Validierung erfolgreich (Confidence: ${validation.confidence.toFixed(1)}%)`, false);
                    
                    // Use AWS-secured filename
                    const filename = `GeoDrop${validation.nextNumber}`;
                    filenameInput.value = filename;
                    
                    // Store AWS hash for later use
                    window.currentUploadAWSHash = validation.imageHash;
                }
            } catch (awsError) {
                console.warn('⚠️ AWS service error, using fallback:', awsError);
                showMessage('⚠️ AWS-Service Fehler, verwende lokale Zählung...', false);
                
                // Fallback to local counting
                const devDropsCount = await getDevDropsCount();
                const nextNumber = devDropsCount + 1;
                const filename = `GeoDrop${nextNumber}`;
                filenameInput.value = filename;
                window.currentUploadAWSHash = null; // No AWS hash
            }
        } else {
            // Fallback to local counting if AWS not available
            console.log('⚠️ AWS service not available, using local counting');
            showMessage('⚠️ AWS-Service nicht verfügbar, verwende lokale Zählung...', false);
            
            const devDropsCount = await getDevDropsCount();
            const nextNumber = devDropsCount + 1;
            const filename = `GeoDrop${nextNumber}`;
            filenameInput.value = filename;
            window.currentUploadAWSHash = null; // No AWS hash
        }
        
        const filename = filenameInput.value;
        const description = descriptionInput.value || 'Ein mysteriöser GeoDrop wartet auf dich!';
        
        // Get all form fields (multilingual)
        const photoDescriptionDe = document.getElementById('dev-photo-description-de')?.value || description;
        const photoDescriptionEn = document.getElementById('dev-photo-description-en')?.value || description;
        const placeDe = document.getElementById('dev-place-de')?.value || 'GeoDrop Location';
        const placeEn = document.getElementById('dev-place-en')?.value || 'GeoDrop Location';
        const stateDe = document.getElementById('dev-state-de')?.value || 'Active';
        const stateEn = document.getElementById('dev-state-en')?.value || 'Active';
        const reward = parseInt(document.getElementById('dev-reward')?.value) || 100;
        const ersteller = document.getElementById('dev-ersteller')?.value || (window.userProfile?.username || window.currentUser?.displayName || 'KryptoGuru');
        
        // Get coordinates
        let lat, lng;
        if (latInput.value && lngInput.value) {
            lat = parseFloat(latInput.value);
            lng = parseFloat(lngInput.value);
        } else if (window.currentLocation) {
            lat = window.currentLocation.lat;
            lng = window.currentLocation.lng;
        } else {
            showMessage('❌ Keine Koordinaten verfügbar!', true);
            return;
        }
        
        // Upload image to Firebase Storage (Dev images go to referenzbilder/)
        const storageRef = storage.ref(`referenzbilder/${filename}`);
        const uploadTask = storageRef.put(file);
        
        showMessage('📤 Bild wird hochgeladen...', false);
        
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload progress:', progress + '%');
            },
            (error) => {
                console.error('❌ Upload error:', error);
                showMessage('❌ Upload-Fehler!', true);
            },
            async () => {
                try {
                    // Get download URL
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    
                    // Get current language
                    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
                    
                    // Create drop data with complete structure like devDrop1
                    const dropData = {
                        // Basic fields
                        coordinates: [lng, lat],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        createdBy: window.currentUser?.uid || 'dev',
                        createdByName: window.userProfile?.username || window.currentUser?.displayName || 'KryptoGuru',
                        createdByEmail: window.currentUser?.email || null,
                        description: description,
                        dropType: 'dev',
                        ersteller: ersteller,
                        geodropNumber: filename.replace('GeoDrop', ''),
                        imageHash: window.currentUploadAWSHash || null,
                        imageUrl: downloadURL,
                        isActive: true,
                        lat: lat,
                        lng: lng,
                        name: filename,
                        photoDescription: currentLang === 'de' ? photoDescriptionDe : photoDescriptionEn,
                        place: currentLang === 'de' ? placeDe : placeEn,
                        reward: reward,
                        state: currentLang === 'de' ? stateDe : stateEn,
                        
                        // AWS data (if available)
                        awsImageHash: window.currentUploadAWSHash || null,
                        awsMigrated: window.currentUploadAWSHash ? true : false,
                        awsMigrationDate: window.currentUploadAWSHash ? new Date() : null,
                        newHashMethod: window.currentUploadAWSHash ? 'aws-rekognition' : 'local-fallback',
                        
                        // Dual language fields
                        language: currentLang,
                        description_de: currentLang === 'de' ? description : null,
                        description_en: currentLang === 'en' ? description : null,
                        photoDescription_de: photoDescriptionDe,
                        photoDescription_en: photoDescriptionEn,
                        place_de: placeDe,
                        place_en: placeEn,
                        state_de: stateDe,
                        state_en: stateEn,
                        
                        // Claim fields
                        claimedBy: null,
                        lastClaimDate: null
                    };
                    
                    // Save to Firebase using the drop name as document ID
                    await db.collection('devDrops').doc(dropData.name).set(dropData);
                    
                    showMessage('✅ Bild hochgeladen und Drop erstellt!', false);
                    console.log('🔧 Dev drop created:', dropData);
                    
                    // Refresh map and drop lists
                    if (typeof window.loadGeoDrops === 'function') {
                        console.log('🔄 Refreshing map after dev drop creation...');
                        window.loadGeoDrops();
                    }
                    
                    // Refresh dev drops table
                    if (typeof window.loadDevDropsForUpload === 'function') {
                        console.log('🔄 Refreshing dev drops table...');
                        window.loadDevDropsForUpload();
                    }
                    
                    // Navigate map to new drop location
                    if (window.geoMap && lat && lng) {
                        console.log(`🗺️ Navigating map to new dev drop: ${lat}, ${lng}`);
                        window.geoMap.setView([lat, lng], 15);
                    }
                    
                    // Clear form
                    fileInput.value = '';
                    descriptionInput.value = '';
                    document.getElementById('dev-photo-description-de').value = '';
                    document.getElementById('dev-photo-description-en').value = '';
                    document.getElementById('dev-place-de').value = '';
                    document.getElementById('dev-place-en').value = '';
                    document.getElementById('dev-state-de').value = '';
                    document.getElementById('dev-state-en').value = '';
                    document.getElementById('dev-reward').value = '100';
                    document.getElementById('dev-ersteller').value = '';
                    latInput.value = '';
                    lngInput.value = '';
        
    } catch (error) {
                    console.error('❌ Drop creation error:', error);
                    showMessage('❌ Fehler beim Erstellen des Drops!', true);
                }
            }
        );
        
    } catch (error) {
        console.error('❌ Upload error:', error);
        showMessage('❌ Upload-Fehler!', true);
    }
}

window.adminUpload = function() {
        if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
            return;
        }
        
    const uploadType = document.getElementById('admin-upload-type').value;
    const fileInput = document.getElementById('admin-upload-input');
    
    if (!fileInput.files[0]) {
        showMessage('❌ Bitte wähle eine Datei aus!', true);
        return;
    }
    
    showMessage(`📤 ${uploadType} Upload gestartet...`, false);
    console.log('🔧 Admin upload:', uploadType, fileInput.files[0]);
}

// Dev Drop Management Functions
window.loadDevDropsForDeletion = async function() {
        if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
            return;
        }
        
    try {
        console.log('🎯 Loading dev drops for deletion...');
        
        if (!window.db) {
            showMessage('❌ Firebase nicht verbunden!', true);
            return;
        }
        
        // Load Dev Drops from devDrops collection (both isAvailable and isActive)
        const allDevDropsSnapshot = await window.db.collection('devDrops').get();
        
        // Filter for active/available drops
        const devDropsSnapshot = {
            docs: allDevDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.isActive === true || data.isAvailable === true;
            }),
            size: 0
        };
        devDropsSnapshot.size = devDropsSnapshot.docs.length;
        console.log('🎯 Loading Dev Drops from devDrops collection:', devDropsSnapshot.size, 'drops');
        const select = document.getElementById('dev-drop-select');
        
        console.log('🎯 Found', devDropsSnapshot.size, 'dev drops');
        
        if (select) {
            select.innerHTML = '<option value="">Dev Drop auswählen...</option>';
            
            if (devDropsSnapshot.empty) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Keine Dev Drops gefunden';
                option.disabled = true;
                select.appendChild(option);
            } else {
                // Convert to array and sort by number
                const devDrops = [];
                devDropsSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    devDrops.push({ id: doc.id, ...data });
                });
                
                // Sort drops by number (extract from name if needed)
                devDrops.sort((a, b) => {
                    let numA = parseInt(a.geodropNumber) || 0;
                    let numB = parseInt(b.geodropNumber) || 0;
                    
                    // If no geodropNumber, try to extract from name
                    if (numA === 0 && a.name && a.name.includes('GeoDrop')) {
                        const match = a.name.match(/GeoDrop(\d+)/);
                        if (match) numA = parseInt(match[1]);
                    }
                    if (numB === 0 && b.name && b.name.includes('GeoDrop')) {
                        const match = b.name.match(/GeoDrop(\d+)/);
                        if (match) numB = parseInt(match[1]);
                    }
                    
                    return numA - numB;
                });
                
                // Add sorted options
                devDrops.forEach(drop => {
                    const option = document.createElement('option');
                    option.value = drop.id;
                    // Extract number from name for display
                    let displayNumber = drop.geodropNumber || drop.id;
                    if (drop.name && drop.name.includes('GeoDrop')) {
                        const match = drop.name.match(/GeoDrop(\d+)/);
                        if (match) {
                            displayNumber = match[1]; // Just the number
                        }
                    }
                    option.textContent = `🎯 Dev GeoDrop${displayNumber} - ${drop.reward || 100} PixelDrops (${drop.lat?.toFixed(4) || 'N/A'}, ${drop.lng?.toFixed(4) || 'N/A'})`;
                    select.appendChild(option);
                });
            }
        }
        
        showMessage(`✅ ${devDropsSnapshot.size} Dev Drops geladen`, false);
    } catch (error) {
        console.error('❌ Load dev drops error:', error);
        showMessage('❌ Fehler beim Laden der Dev Drops!', true);
    }
}

window.deleteSelectedDevDrop = async function() {
        if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
            return;
        }
        
    const select = document.getElementById('dev-drop-select');
    const selectedId = select.value;
    
    if (!selectedId) {
        showMessage('❌ Bitte wähle einen Dev Drop aus!', true);
            return;
        }
        
        
    if (confirm('🗑️ Dev Drop wirklich löschen? (Bild wird ebenfalls gelöscht!)')) {
        try {
            // Get drop data first
            const dropDoc = await window.db.collection('devDrops').doc(selectedId).get();
            const dropData = dropDoc.data();
            
            // Delete from Firestore
            await window.db.collection('devDrops').doc(selectedId).delete();
            
            // Delete image from Storage if exists
            if (dropData.imageUrl) {
                try {
                    const imageRef = storage.refFromURL(dropData.imageUrl);
                    await imageRef.delete();
                } catch (storageError) {
                    console.warn('⚠️ Could not delete image from storage:', storageError);
                }
            }
            
            showMessage('✅ Dev Drop gelöscht!', false);
            console.log('🗑️ Dev drop deleted:', selectedId);
            
            // Reload the list
            loadDevDropsForDeletion();
        
    } catch (error) {
            console.error('❌ Delete dev drop error:', error);
            showMessage('❌ Fehler beim Löschen des Dev Drops!', true);
        }
    }
}

window.synchronizeDevDropsWithImages = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    try {
        const geodropsSnapshot = await db.collection('geodrops').where('type', '==', 'dev').get();
        let synced = 0;
        let errors = 0;
        
        for (const doc of geodropsSnapshot.docs) {
            const data = doc.data();
            if (data.imageUrl) {
                try {
                    // Check if image exists in storage
                    const imageRef = storage.refFromURL(data.imageUrl);
                    await imageRef.getMetadata();
                    synced++;
    } catch (error) {
                    console.warn('⚠️ Image not found for drop:', doc.id);
                    errors++;
                }
            }
        }
        
        showMessage(`✅ ${synced} Drops synchronisiert, ${errors} Fehler`, false);
        console.log('🔍 Dev drops sync completed:', { synced, errors });
        
        } catch (error) {
        console.error('❌ Sync dev drops error:', error);
        showMessage('❌ Fehler beim Synchronisieren!', true);
    }
}

// Create test dev drops
window.createTestDevDrops = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Modus erforderlich!', true);
        return;
    }
    
    if (!db) {
        showMessage('❌ Firebase nicht verbunden!', true);
        return;
    }
    
    try {
        console.log('🎯 Creating test dev drops...');
        
        const testDrops = [
            {
                coordinates: [48.2082, 16.3738],
                createdBy: window.currentUser?.uid || 'dev',
                createdByName: window.currentUser?.email || 'dev@test.com',
                description: 'Ein Test-Drop für Entwicklung',
                description_de: 'Ein Test-Drop für Entwicklung',
                description_en: 'A test drop for development',
                dropType: 'dev',
                ersteller: 'Dev User',
                geodropNumber: 'test1',
                imageHash: null,
                imageUrl: null,
                isActive: true,
                lat: 48.2082,
                lng: 16.3738,
                name: 'testDrop1',
                photoDescription: 'Fotografiere die Test Location für Entwickler Test Drop 1.',
                photoDescription_de: 'Fotografiere die Test Location für Entwickler Test Drop 1.',
                photoDescription_en: 'Photograph the test location for developer test drop 1.',
                place: 'Wien Test Location 1',
                reward: 100,
                state: 'Wien'
            },
            {
                coordinates: [48.2100, 16.3750],
                createdBy: window.currentUser?.uid || 'dev',
                createdByName: window.currentUser?.email || 'dev@test.com',
                description: 'Zweiter Test-Drop',
                description_de: 'Zweiter Test-Drop',
                description_en: 'Second test drop',
                dropType: 'dev',
                ersteller: 'Dev User',
                geodropNumber: 'test2',
                imageHash: null,
                imageUrl: null,
                isActive: true,
                lat: 48.2100,
                lng: 16.3750,
                name: 'testDrop2',
                photoDescription: 'Fotografiere die Test Location für Entwickler Test Drop 2.',
                photoDescription_de: 'Fotografiere die Test Location für Entwickler Test Drop 2.',
                photoDescription_en: 'Photograph the test location for developer test drop 2.',
                place: 'Wien Test Location 2',
                reward: 100,
                state: 'Wien'
            },
            {
                coordinates: [48.2050, 16.3700],
                createdBy: window.currentUser?.uid || 'dev',
                createdByName: window.currentUser?.email || 'dev@test.com',
                description: 'Dritter Test-Drop',
                description_de: 'Dritter Test-Drop',
                description_en: 'Third test drop',
                dropType: 'dev',
                ersteller: 'Dev User',
                geodropNumber: 'test3',
                imageHash: null,
                imageUrl: null,
                isActive: true,
                lat: 48.2050,
                lng: 16.3700,
                name: 'testDrop3',
                photoDescription: 'Fotografiere die Test Location für Entwickler Test Drop 3.',
                photoDescription_de: 'Fotografiere die Test Location für Entwickler Test Drop 3.',
                photoDescription_en: 'Photograph the test location for developer test drop 3.',
                place: 'Wien Test Location 3',
                reward: 100,
                state: 'Wien'
            }
        ];
        
        let created = 0;
        for (const dropData of testDrops) {
            const fullDropData = {
                ...dropData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Verwende den Namen als Dokument-ID
            await db.collection('devDrops').doc(dropData.name).set(fullDropData);
            created++;
        }
        
        showMessage(`✅ ${created} Test-Drops erstellt!`, false);
        console.log('🎯 Test drops created:', created);
        
        // Reload the list
    setTimeout(() => {
            loadDevDropsForDeletion();
    }, 1000);
        
        } catch (error) {
        console.error('❌ Create test drops error:', error);
        showMessage('❌ Fehler beim Erstellen der Test-Drops!', true);
    }
}

// Initialize dev password from config
function initializeDevPassword() {
    if (window.CONFIG?.dev?.password) {
        devPassword = window.CONFIG.dev.password;
        console.log('✅ Dev password loaded from config');
    } else {
        // Fallback: Use default dev password
        devPassword = 'geheim';
        console.log('✅ Dev password set to default');
    }
}

// Check dev session on page load
function checkDevSession() {
    // Always require fresh login - no automatic session restoration
    isDevLoggedIn = false;
    window.isAdmin = false;
    window.isDevLoggedIn = false;
    
    // Clear any existing session data
    localStorage.removeItem('devLoggedIn');
    localStorage.removeItem('devLoginTimestamp');
    
    updateGlobalDevStatus();
    console.log('🔧 Dev session cleared - fresh login required');
}

// Load Dev Drops for Upload (for Dev Tab compatibility)
window.loadDevDropsForUpload = async function() {
    console.log('🎯 Loading Dev Drops for Upload (Dev Tab)...');
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        // Load all dev drops (both isAvailable and isActive)
        const allDevDropsSnapshot = await db.collection('devDrops').get();
        
        // Filter for active/available drops and exclude claimed drops for today
        const today = new Date().toDateString();
        const currentUser = window.currentUser || window.auth?.currentUser;
        
        const devDropsSnapshot = {
            docs: allDevDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                const isActive = data.isActive === true || data.isAvailable === true;
                
                // Check if claimed today by current user
                const lastClaimDate = data.lastClaimDate ? data.lastClaimDate.toDate().toDateString() : null;
                const isClaimedToday = lastClaimDate === today && data.claimedBy === currentUser?.uid;
                
                // Only include drops that are active AND not claimed today
                return isActive && !isClaimedToday;
            }),
            size: 0
        };
        devDropsSnapshot.size = devDropsSnapshot.docs.length;
        
        const devDrops = [];
        devDropsSnapshot.docs.forEach(doc => {
            devDrops.push({ id: doc.id, ...doc.data(), collection: 'devDrops' });
        });
        
        // Sort drops by geodropNumber (extract number from name if needed)
        devDrops.sort((a, b) => {
            let numA = parseInt(a.geodropNumber) || 0;
            let numB = parseInt(b.geodropNumber) || 0;
            
            // If no geodropNumber, try to extract from name
            if (numA === 0 && a.name && a.name.includes('GeoDrop')) {
                const match = a.name.match(/GeoDrop(\d+)/);
                if (match) numA = parseInt(match[1]);
            }
            if (numB === 0 && b.name && b.name.includes('GeoDrop')) {
                const match = b.name.match(/GeoDrop(\d+)/);
                if (match) numB = parseInt(match[1]);
            }
            
            return numA - numB;
        });
        
        // Only update dropdowns if we're currently showing dev drops
        if (window.currentUploadListType === 'dev') {
            // Update dev drops select for both languages
            const currentLang = window.currentLanguage || 'de';
            const selectDe = document.getElementById('geocard-drop-select-de');
            const selectEn = document.getElementById('geocard-drop-select-en');
            
            let selectText, devDropText, pixeldropsText;
            if (currentLang === 'en') {
                selectText = 'Select Dev GeoDrop...';
                devDropText = 'Dev GeoDrop';
                pixeldropsText = 'PixelDrops';
            } else {
                selectText = 'Dev GeoDrop auswählen...';
                devDropText = 'Dev GeoDrop';
                pixeldropsText = 'PixelDrops';
            }
            
            // Update German dropdown
            if (selectDe) {
                selectDe.innerHTML = `<option value="">${selectText}</option>`;
                devDrops.forEach(drop => {
                    const option = document.createElement('option');
                    option.value = drop.id;
                    option.textContent = `${devDropText}${drop.geodropNumber || drop.id} - ${drop.reward || 100} ${pixeldropsText}`;
                    selectDe.appendChild(option);
                });
            }
            
            // Update English dropdown
            if (selectEn) {
                selectEn.innerHTML = `<option value="">Select Dev GeoDrop...</option>`;
                devDrops.forEach(drop => {
                    const option = document.createElement('option');
                    option.value = drop.id;
                    option.textContent = `Dev GeoDrop${drop.geodropNumber || drop.id} - ${drop.reward || 100} PixelDrops`;
                    selectEn.appendChild(option);
                });
            }
            
            // Legacy support for old select element
            const select = document.getElementById('geocard-drop-select');
            if (select) {
                select.innerHTML = `<option value="">${selectText}</option>`;
                devDrops.forEach(drop => {
                    const option = document.createElement('option');
                    option.value = `devDrops:${drop.id}`;
                    // Extract number from name for display
                    let displayNumber = drop.geodropNumber || drop.id;
                    if (drop.name && drop.name.includes('GeoDrop')) {
                        const match = drop.name.match(/GeoDrop(\d+)/);
                        if (match) {
                            displayNumber = match[1]; // Just the number
                        }
                    }
                    // Sicherheitsprüfung: displayNumber und reward validieren
                    const safeDisplayNumber = displayNumber || 'N/A';
                    const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                    option.textContent = `🎯 ${devDropText}${safeDisplayNumber} - ${safeReward} ${pixeldropsText}`;
                    select.appendChild(option);
                });
            }
        }
        
        console.log(`✅ Loaded ${devDrops.length} Dev Drops for Upload`);
    } catch (error) {
        console.error('❌ Error loading Dev Drops for Upload:', error);
        if (error.code === 'permission-denied') {
            console.log('🔒 User not logged in, skipping Dev Drops for Upload load');
            showMessage('ℹ️ Bitte anmelden um Dev Drops zu sehen', false);
        } else {
            showMessage('Fehler beim Laden der Dev Drops', true);
        }
    }
};

// Load User Drops for Upload (for Dev Tab compatibility) - COPIED FROM WORKING VERSION
window.loadUserDropsForUpload = async function() {
    console.log('👤 Loading User Drops for Upload (Dev Tab)...');
    
    // Check if lists are cleared
    if (window.userDropListsCleared) {
        console.log('⏭️ User Drop lists are cleared, skipping load');
        return;
    }
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        // Load all user drops and filter out claimed ones
        const allUserDropsSnapshot = await db.collection('userDrops').get();
        
        // Filter for active drops and exclude claimed drops for today
        const today = new Date().toDateString();
        const currentUser = window.currentUser || window.auth?.currentUser;
        
        const userDropsSnapshot = {
            docs: allUserDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                const isActive = data.isActive === true;
                
                // Check if claimed today by current user
                const lastClaimDate = data.lastClaimDate ? data.lastClaimDate.toDate().toDateString() : null;
                const isClaimedToday = lastClaimDate === today && data.claimedBy === currentUser?.uid;
                
                // Only include drops that are active AND not claimed today
                return isActive && !isClaimedToday;
            }),
            size: 0
        };
        userDropsSnapshot.size = userDropsSnapshot.docs.length;
        
        const userDrops = [];
        userDropsSnapshot.docs.forEach(doc => {
            userDrops.push({ id: doc.id, ...doc.data(), collection: 'userDrops' });
        });
        
        // Sort drops by geodropNumber (1, 2, 3, ...)
        userDrops.sort((a, b) => {
            const numA = parseInt(a.geodropNumber) || parseInt(a.id) || 0;
            const numB = parseInt(b.geodropNumber) || parseInt(b.id) || 0;
            return numA - numB;
        });
        
        // Only update dropdowns if we're currently showing user drops
        if (window.currentUploadListType === 'user') {
            // Update user drops select - USE SAME DROPDOWN IDs AS DEV DROPS IN DEV TAB
            const userSelectDe = document.getElementById('geocard-drop-select-de');
            const userSelectEn = document.getElementById('geocard-drop-select-en');
            
            const userSelectTextDe = 'User GeoDrop auswählen...';
            const userSelectTextEn = 'Select User GeoDrop...';
            
            // Update German dropdown
            if (userSelectDe) {
                userSelectDe.innerHTML = `<option value="">${userSelectTextDe}</option>`;
                userDrops.forEach(drop => {
                    const option = document.createElement('option');
                    option.value = `userDrops:${drop.id}`;
                    // Use displayName first, then email, then fallback
                    // Get the real username from Firebase Auth, not from stored data
                    let creatorName = 'Unbekannt';
                    
                    // Check if this is the current user's drop
                    let currentUser = window.currentUser;
                    if (!currentUser && window.auth && window.auth.currentUser) {
                        currentUser = window.auth.currentUser;
                    }
                    if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                        currentUser = window.firebase.auth().currentUser;
                    }
                    
                    // Use the ersteller field from Firebase
                    creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                    console.log(`✅ Using ${creatorName} for drop ${drop.name}`);
                    const dropNumber = drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A';
                    const userDropText = 'User GeoDrop';
                    const pixeldropsText = 'PixelDrops';
                    // Sicherheitsprüfung: creatorName und reward validieren
                    const safeCreatorName = creatorName || 'Unknown';
                    const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                    option.textContent = `👤 ${userDropText}${dropNumber} - ${safeReward} ${pixeldropsText} (${safeCreatorName})`;
                    userSelectDe.appendChild(option);
                });
            }
            
            // Update English dropdown
            if (userSelectEn) {
                userSelectEn.innerHTML = `<option value="">${userSelectTextEn}</option>`;
                userDrops.forEach(drop => {
                    const option = document.createElement('option');
                    option.value = `userDrops:${drop.id}`;
                    let creatorName = 'Unknown';
                    creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                    const dropNumber = drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A';
                    const userDropText = 'User GeoDrop';
                    const pixeldropsText = 'PixelDrops';
                    const safeCreatorName = creatorName || 'Unknown';
                    const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                    option.textContent = `👤 ${userDropText}${dropNumber} - ${safeReward} ${pixeldropsText} (${safeCreatorName})`;
                    userSelectEn.appendChild(option);
                });
            }
        }
        
        console.log(`✅ Loaded ${userDrops.length} User Drops for Upload`);
    } catch (error) {
        console.error('❌ Error loading User Drops for Upload:', error);
        if (error.code === 'permission-denied') {
            console.log('🔒 User not logged in, skipping User Drops for Upload load');
            showMessage('ℹ️ Bitte anmelden um User Drops zu sehen', false);
        } else {
            showMessage('Fehler beim Laden der User Drops', true);
        }
    }
};

// Switch Upload List Type (for Dev Tab compatibility)
window.switchToUploadListType = function(type) {
    console.log(`🔄 Switching upload to ${type} drops list (Dev Tab)`);
    
    const devBtn = document.getElementById('upload-dev-drops-btn');
    const userBtn = document.getElementById('upload-user-drops-btn');
    const devSection = document.getElementById('upload-dev-drops-section');
    const userSection = document.getElementById('upload-user-drops-section');
    
    if (type === 'dev') {
        // Switch to dev drops for upload
        if (devBtn) {
            devBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors bg-blue-600 text-white';
            devBtn.innerHTML = '🎯 Dev Drops';
        }
        if (userBtn) {
            userBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors text-gray-300 hover:text-white';
            userBtn.innerHTML = '👤 User Drops';
        }
        if (devSection) devSection.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
        window.currentUploadListType = 'dev';
        
        // Load dev drops for upload (this will update the dropdown)
        if (typeof window.loadDevDropsForUpload === 'function') {
            window.loadDevDropsForUpload();
        }
        
        showMessage('🎯 Dev Drops für Upload ausgewählt', false);
    } else if (type === 'user') {
        // Switch to user drops for upload
        if (devBtn) {
            devBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors text-gray-300 hover:text-white';
            devBtn.innerHTML = '🎯 Dev Drops';
        }
        if (userBtn) {
            userBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors bg-green-600 text-white';
            userBtn.innerHTML = '👤 User Drops';
        }
        if (devSection) devSection.style.display = 'none';
        if (userSection) userSection.style.display = 'block';
        window.currentUploadListType = 'user';
        
        // Load user drops for upload (this will update the dropdown)
        if (typeof window.loadUserDropsForUpload === 'function') {
            window.loadUserDropsForUpload();
        }
        
        showMessage('👤 User Drops für Upload ausgewählt', false);
    }
};

// Debug function to check user drops
window.debugUserDrops = async function() {
    console.log('🔍 Debugging User Drops...');
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        const allUserDropsSnapshot = await db.collection('userDrops').get();
        
        console.log(`📊 Total User Drops in database: ${allUserDropsSnapshot.size}`);
        
        if (allUserDropsSnapshot.size === 0) {
            console.log('❌ No User Drops found in database!');
            showMessage('❌ Keine User Drops in der Datenbank gefunden!', true);
            return;
        }
        
        allUserDropsSnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`👤 User Drop ${doc.id}:`, {
                name: data.name,
                geodropNumber: data.geodropNumber,
                isActive: data.isActive,
                isAvailable: data.isAvailable,
                reward: data.reward,
                createdBy: data.createdBy,
                createdAt: data.createdAt
            });
        });
        
        showMessage(`✅ ${allUserDropsSnapshot.size} User Drops gefunden - Details in Konsole`, false);
        
    } catch (error) {
        console.error('❌ Error debugging user drops:', error);
        showMessage('❌ Fehler beim Debuggen der User Drops!', true);
    }
};

// Show Message function (fallback if not available)
if (typeof window.showMessage === 'undefined') {
    window.showMessage = function(message, isError = false) {
        console.log(isError ? '❌' : '✅', message);
        
        // Try to show in custom alert if available
        const alertElement = document.getElementById('custom-alert');
        if (alertElement) {
            alertElement.textContent = message;
            alertElement.className = `custom-alert ${isError ? 'bg-red-600' : 'bg-green-600'} text-white p-3 rounded-lg shadow-lg`;
            alertElement.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 3000);
        }
    };
}

// Initialize dev functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Dev functions loaded');
    
    // Initialize dev password from config
    initializeDevPassword();

    // Check dev session
    checkDevSession();
    
    // Update dev status
    updateDevStatus();
    
    // Update filename display
    updateNextFilenameDisplay();
});
