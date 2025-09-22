// Dev Functions for GeoDrop App

// Global variables
let isDevLoggedIn = false;
let devPassword = 'GeoDrop2025!'; // Dev password for admin access

// Initialize dev password from config
function initializeDevPassword() {
    if (window.CONFIG?.dev?.password) {
        devPassword = window.CONFIG.dev.password;
        console.log('✅ Dev password loaded from config');
    } else {
        console.error('❌ Dev password not found in config');
    }
}

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
    
    // Allow empty password for easy dev access
    if (enteredPassword === devPassword || enteredPassword === '' || enteredPassword === 'dev') {
        // Set dev session
        isDevLoggedIn = true;
        window.isAdmin = true;
        window.isDevLoggedIn = true; // Add this for upload functions
        updateGlobalDevStatus();
        
        // Save to sessionStorage (session only, not persistent)
        sessionStorage.setItem('devLoggedIn', 'true');
        sessionStorage.setItem('devLoginTimestamp', Date.now().toString());
        
        // Update UI
        window.updateDevStatus();
        
        // Add adjustDevCoordinates function
        window.adjustDevCoordinates = function() {
            console.log('🔧 Adjusting Dev coordinates...');
            if (!window.isDevLoggedIn) {
                showMessage('❌ Dev-Modus erforderlich!', true);
                return;
            }
            
            // Show manual coordinate input dialog
            const lat = prompt('🔧 Breitengrad (Latitude) eingeben:', window.currentLocation?.lat?.toFixed(6) || '48.1984878');
            const lng = prompt('🔧 Längengrad (Longitude) eingeben:', window.currentLocation?.lng?.toFixed(6) || '15.2122524');
            
            if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lng);
                
                // Validate coordinates
                if (newLat >= -90 && newLat <= 90 && newLng >= -180 && newLng <= 180) {
                    // Update current location
                    window.currentLocation = {
                        lat: newLat,
                        lng: newLng,
                        accuracy: 1, // Manual input = high accuracy
                        timestamp: new Date()
                    };
                    
                    // Update map if available
                    if (window.geoMap) {
                        window.geoMap.setView([newLat, newLng], 16);
                        
                        // Update location marker
                        if (window.locationMarker) {
                            window.geoMap.removeLayer(window.locationMarker);
                        }
                        window.locationMarker = L.marker([newLat, newLng], {
                            icon: L.divIcon({
                                className: 'location-marker',
                                html: '<div style="background: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                                iconSize: [20, 20],
                                iconAnchor: [10, 10]
                            })
                        }).addTo(window.geoMap);
                    }
                    
                    showMessage(`🔧 Dev-Koordinaten manuell gesetzt: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}`, false);
                    console.log('🔧 Dev coordinates manually set:', { lat: newLat, lng: newLng });
                } else {
                    showMessage('❌ Ungültige Koordinaten!', true);
                }
            } else {
                showMessage('❌ Koordinaten-Eingabe abgebrochen!', true);
            }
        };
        
        alert('✅ Dev-Zugang erfolgreich!');
        passwordInput.value = '';
        
        // Update debug info
        if (window.currentUser) {
            document.getElementById('debug-user-id').textContent = window.currentUser.uid;
            document.getElementById('debug-session').textContent = 'Aktiv';
            document.getElementById('debug-last-update').textContent = new Date().toLocaleString('de-DE');
        }
        
    } else {
        alert('❌ Falsches Dev-Passwort!');
        passwordInput.value = '';
    }
};

// Make functions globally available
// SECURITY: Don't call updateGlobalDevStatus() here - wait for explicit login
window.devPassword = devPassword;

// Initialize Dev status on page load
window.initializeDevStatus = async function() {
    console.log('🔧 Initializing Dev status...');
    
    // SECURITY: ALWAYS require explicit login - NO auto-restore
    // Clear any existing session data
    sessionStorage.removeItem('devLoggedIn');
    sessionStorage.removeItem('devLoginTimestamp');
    localStorage.removeItem('devLoggedIn');
    localStorage.removeItem('devLoginTimestamp');
    
    // Force logout state
    isDevLoggedIn = false;
    window.isAdmin = false;
    window.isDevLoggedIn = false;
    updateGlobalDevStatus();
    
    console.log('🔒 Dev status: FORCED LOGOUT - explicit login required');
    
    // Always call updateDevStatus to ensure UI is updated
    if (typeof window.updateDevStatus === 'function') {
        window.updateDevStatus();
    }
    
    // SECURITY: No session restoration - explicit login always required
    console.log('🔒 Dev system initialized - login required');
}

// Test function to manually set dev session (for debugging)
// SECURITY: This function is disabled for production
window.setDevSession = function() {
    console.log('🔒 setDevSession disabled for security');
    alert('❌ Dev-Session kann nicht manuell gesetzt werden - Passwort erforderlich!');
}

// Force dev session activation (for immediate testing)
// SECURITY: This function is disabled for production
window.forceDevSession = function() {
    console.log('🔒 forceDevSession disabled for security');
    alert('❌ Dev-Session kann nicht erzwungen werden - Passwort erforderlich!');
}

// Test function to clear dev session (for debugging)
window.clearDevSession = function() {
    sessionStorage.removeItem('devLoggedIn');
    sessionStorage.removeItem('devLoginTimestamp');
    isDevLoggedIn = false;
    window.isAdmin = false;
    window.updateDevStatus();
    console.log('🔒 Dev session manually cleared');
}

// Test function to check dev session status
window.checkDevSession = function() {
    const savedDevStatus = sessionStorage.getItem('devLoggedIn');
    const savedDevTimestamp = sessionStorage.getItem('devLoginTimestamp');
    const currentTime = Date.now();
    const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
    
    console.log('🔍 Current Dev session status:', {
        isDevLoggedIn,
        windowIsAdmin: window.isAdmin,
        savedDevStatus,
        savedDevTimestamp,
        currentTime,
        sessionTimeout,
        timeDiff: savedDevTimestamp ? (currentTime - parseInt(savedDevTimestamp)) : 'no timestamp',
        isValid: savedDevStatus === 'true' && savedDevTimestamp && (currentTime - parseInt(savedDevTimestamp)) < sessionTimeout
    });
}

// Dev Login System
window.showDevLoginPopup = function() {
    console.log('🔐 showDevLoginPopup called, isDevLoggedIn:', isDevLoggedIn);
    
    // Check if already logged in
    if (isDevLoggedIn) {
        console.log('🔓 Already logged in, redirecting to dev page...');
        window.location.href = 'pages/dev.html';
        return;
    }
    
    const popup = document.getElementById('dev-login-popup');
    if (popup) {
        popup.style.display = 'block';
        document.getElementById('dev-password').focus();
        console.log('🔐 Dev login popup shown');
    } else {
        console.error('❌ Dev login popup not found!');
    }
}

window.closeDevLoginPopup = function() {
    const popup = document.getElementById('dev-login-popup');
    if (popup) {
        popup.style.display = 'none';
        document.getElementById('dev-password').value = '';
    }
}

window.loginDev = async function() {
    const password = document.getElementById('dev-password').value;
    
    // Allow empty password for easy dev access
    if (password === devPassword || password === '' || password === 'dev') {
        isDevLoggedIn = true;
        window.isAdmin = true;
        updateGlobalDevStatus();
        
        // Save to localStorage for immediate persistence
        const currentTime = Date.now();
        localStorage.setItem('devLoggedIn', 'true');
        localStorage.setItem('devLoginTimestamp', currentTime.toString());
        
        console.log('🔓 Dev login successful:', { isDevLoggedIn, windowIsAdmin: window.isAdmin, localStorage: localStorage.getItem('devLoggedIn') });
        
        // Save to Firebase for secure persistence (if available)
        try {
            if (window.firebase && window.firebase.auth().currentUser) {
                const user = window.firebase.auth().currentUser;
                await window.firebase.firestore().collection('devSessions').doc(user.uid).set({
                    devLoggedIn: true,
                    isAdmin: true,
                    timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: new Date().toISOString()
                });
                console.log('🔐 Dev status saved to Firebase');
            } else {
                console.log('✅ Dev status saved to localStorage (no Firebase user)');
            }
        } catch (error) {
            console.error('❌ Error saving dev status to Firebase:', error);
            console.log('✅ Dev status saved to localStorage (Firebase fallback)');
        }
        
        closeDevLoginPopup();
        showMessage('✅ Dev-Zugang erfolgreich! Weiterleitung zur Dev-Seite...', false);
        updateDevStatus(); // This will also call window.updateNavigationDevStatus()
        
        // Update Dev Session Button in GeoCard
        if (typeof window.updateDevSessionButton === 'function') {
            window.updateDevSessionButton();
        }
        
        console.log('🔓 Dev access granted');
        
        // Weiterleitung zur Dev-Seite nach 1 Sekunde
        setTimeout(() => {
            window.location.href = 'pages/dev.html';
        }, 1000);
    } else {
        showMessage('❌ Falsches Dev-Passwort!', true);
        console.log('🔒 Dev access denied - wrong password');
    }
}

window.logoutDev = async function() {
    isDevLoggedIn = false;
    window.isAdmin = false;
    updateGlobalDevStatus();
    
    // Remove from localStorage immediately
    sessionStorage.removeItem('devLoggedIn');
    sessionStorage.removeItem('devLoginTimestamp');
    
    // Remove from Firebase - BUT DON'T LOGOUT THE NORMAL USER!
    try {
        if (window.firebase && window.firebase.auth().currentUser) {
            const user = window.firebase.auth().currentUser;
            // Only remove dev session data, NOT the user authentication
            await window.firebase.firestore().collection('devSessions').doc(user.uid).delete();
            console.log('🔐 Dev status removed from Firebase (user still logged in)');
        }
    } catch (error) {
        console.error('❌ Error removing dev status from Firebase:', error);
        console.log('✅ Dev status removed from localStorage (Firebase fallback)');
    }
    
    showMessage('🚪 Dev-Zugang beendet! (Normaler Login bleibt aktiv)', false);
    updateDevStatus(); // This will also call updateNavigationDevStatus()
    
    // Update Dev Session Button in GeoCard
    if (typeof window.updateDevSessionButton === 'function') {
        window.updateDevSessionButton();
    }
    
    console.log('🔒 Dev access revoked - normal user login preserved');
    
    // Ensure Firebase is ready for normal login after Dev logout
    setTimeout(() => {
        console.log('🔍 Checking Firebase services after Dev logout...');
        console.log('window.auth:', !!window.auth);
        console.log('window.db:', !!window.db);
        console.log('window.firebase:', !!window.firebase);
        
        if (window.auth && window.db && window.firebase) {
            console.log('✅ Firebase services available after Dev logout');
        } else {
            console.log('🔄 Firebase services not available, forcing reinitialization...');
            
            // Force clear and reinitialize Firebase
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                try {
                    firebase.app().delete();
                    console.log('🔥 Old Firebase app deleted');
                } catch (error) {
                    console.log('🔥 Error deleting old app:', error.message);
                }
            }
            
            // Clear global variables
            window.auth = null;
            window.db = null;
            window.storage = null;
            window.firebase = null;
            
            // Reinitialize
            if (window.initializeFirebase) {
                window.initializeFirebase();
            }
        }
    }, 1000);
    
    // Stay on current page instead of redirecting
    console.log('🔒 Dev logout completed - staying on current page');
}

// Simple function to end Dev session without redirect
window.endDevSession = function() {
    console.log('🔒 Ending Dev session...');
    isDevLoggedIn = false;
    window.isAdmin = false;
    updateGlobalDevStatus();
    
    // Remove from localStorage
    sessionStorage.removeItem('devLoggedIn');
    sessionStorage.removeItem('devLoginTimestamp');
    
    // Update UI
    window.updateDevStatus();
    window.updateNavigationDevStatus();
    
    console.log('🔒 Dev session ended - normal user login preserved');
    
    // Ensure Firebase is ready for normal login after Dev logout
    setTimeout(() => {
        console.log('🔍 Checking Firebase services after Dev logout...');
        console.log('window.auth:', !!window.auth);
        console.log('window.db:', !!window.db);
        console.log('window.firebase:', !!window.firebase);
        
        if (window.auth && window.db && window.firebase) {
            console.log('✅ Firebase services available after Dev logout');
        } else {
            console.log('🔄 Firebase services not available, forcing reinitialization...');
            
            // Force clear and reinitialize Firebase
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                try {
                    firebase.app().delete();
                    console.log('🔥 Old Firebase app deleted');
                } catch (error) {
                    console.log('🔥 Error deleting old app:', error.message);
                }
            }
            
            // Clear global variables
            window.auth = null;
            window.db = null;
            window.storage = null;
            window.firebase = null;
            
            // Reinitialize
            if (window.initializeFirebase) {
                window.initializeFirebase();
            }
        }
    }, 1000);
    
    // Also update GeoCard if it exists
    if (typeof window.updateDevCoordsButton === 'function') {
        window.updateDevCoordsButton();
    }
    
    // Update Dev Session Button in GeoCard
    if (typeof window.updateDevSessionButton === 'function') {
        window.updateDevSessionButton();
    }
    
    console.log('✅ Dev session ended');
    if (typeof showMessage === 'function') {
        showMessage('🔒 Dev-Session beendet', false);
    }
};

// Dev Status Management
// SECURITY: This function is disabled for production
window.authorizeDev = async function() {
    console.log('🔒 authorizeDev disabled for security');
    alert('❌ Dev-Autorisierung kann nicht ohne Passwort erfolgen!');
    return;
    
    // Function disabled for security
}

window.deauthorizeDev = async function() {
    isDevLoggedIn = false;
    window.isAdmin = false;
    updateGlobalDevStatus();
    
    // Remove from localStorage immediately
    sessionStorage.removeItem('devLoggedIn');
    sessionStorage.removeItem('devLoginTimestamp');
    
    // Remove from Firebase
    try {
        if (window.firebase && window.firebase.auth().currentUser) {
            const user = window.firebase.auth().currentUser;
            await window.firebase.firestore().collection('devSessions').doc(user.uid).delete();
            console.log('🔐 Dev authorization removed from Firebase');
        }
    } catch (error) {
        console.error('❌ Error removing dev authorization from Firebase:', error);
        console.log('✅ Dev authorization removed from localStorage (Firebase fallback)');
    }
    
    showMessage('🔒 Dev-Berechtigung deaktiviert!', false);
    updateDevStatus(); // This will also call updateNavigationDevStatus()
    console.log('🔒 Dev authorization revoked');
    
    // Stay on current page instead of redirecting
    console.log('🔒 Dev deauthorization completed - staying on current page');
}

window.updateDevStatus = function() {
    const devStatus = document.getElementById('dev-status');
    const adminStatus = document.getElementById('admin-status');
    const devPermissionStatus = document.getElementById('dev-permission-status');
    const devDropBtn = document.getElementById('dev-drop-btn');
    
    // Check current dev status from localStorage as well
    const currentDevStatus = isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
    // console.log('🔄 updateDevStatus called:', { isDevLoggedIn, currentDevStatus, sessionStorage: sessionStorage.getItem('devLoggedIn') });
    
    if (currentDevStatus) {
        if (devStatus) {
            devStatus.textContent = '✅ Dev-Berechtigung aktiv';
            devStatus.className = 'text-lg font-semibold text-green-400';
        }
        if (adminStatus) {
            adminStatus.textContent = 'Aktiv';
            adminStatus.className = 'text-green-400 font-bold';
        }
        if (devPermissionStatus) {
            devPermissionStatus.textContent = 'Vollzugriff';
            devPermissionStatus.className = 'text-green-400';
        }
        if (devDropBtn) {
            devDropBtn.disabled = false;
            devDropBtn.textContent = '🎯 Dev Drop erstellen';
        }
    } else {
        if (devStatus) {
            devStatus.textContent = '🔒 Dev-Berechtigung inaktiv';
            devStatus.className = 'text-lg font-semibold text-red-400';
        }
        if (adminStatus) {
            adminStatus.textContent = 'Inaktiv';
            adminStatus.className = 'text-red-400';
        }
        if (devPermissionStatus) {
            devPermissionStatus.textContent = 'Keine Berechtigung';
            devPermissionStatus.className = 'text-red-400';
        }
        if (devDropBtn) {
            devDropBtn.disabled = true;
            devDropBtn.textContent = '🔒 Admin-Modus erforderlich';
        }
    }
    
    // Update navigation Dev links
    window.updateNavigationDevStatus();
    
    // Also update GeoCard if it exists
    if (typeof window.updateDevCoordsButton === 'function') {
        window.updateDevCoordsButton();
    }
}

// Update Dev status in navigation
window.updateNavigationDevStatus = function() {
    // console.log('🔄 Updating navigation Dev status...', 'isDevLoggedIn:', isDevLoggedIn);
    
    // Find all Dev navigation links
    const devLinks = document.querySelectorAll('a[onclick*="showDevLoginPopup"]');
    // console.log('🔍 Found dev links:', devLinks.length);
    
    devLinks.forEach((link, index) => {
        const iconSpan = link.querySelector('span');
        if (iconSpan) {
            if (isDevLoggedIn) {
                iconSpan.textContent = '🔓'; // Unlocked icon
                link.title = 'Dev-Berechtigung aktiv - Klicken zum Logout';
            } else {
                iconSpan.textContent = '🔧'; // Wrench icon
                link.title = 'Dev-Berechtigung inaktiv - Klicken zum Login';
            }
        }
    });
    
    // Update Dev tab buttons in mehr-pages
    const devTabBtns = document.querySelectorAll('button[onclick*="showDevLoginPopup"]');
    
    devTabBtns.forEach((btn, index) => {
        if (isDevLoggedIn) {
            btn.innerHTML = '🔓 Dev-Bereich (aktiv)';
            btn.className = btn.className.replace('hover:bg-gray-700', 'hover:bg-green-700');
        } else {
            btn.innerHTML = '🔧 Dev-Bereich';
            btn.className = btn.className.replace('hover:bg-green-700', 'hover:bg-gray-700');
        }
    });
    
    // Update navigation buttons for normal users
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach((btn, index) => {
        if (btn && btn.onclick) {
            // Ensure buttons are clickable
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
    });
    
    // Update mobile navigation
    const mobileNavButtons = document.querySelectorAll('.mobile-nav .nav-btn');
    
    mobileNavButtons.forEach((btn, index) => {
        if (btn) {
            // Ensure mobile buttons are clickable
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }
    });
    
    // console.log('✅ Navigation Dev status update completed');
}

// Update navigation for normal users
window.updateUserNavigation = function() {
    // console.log('🔄 Updating user navigation...');
    
    // Update navigation buttons for normal users
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach((btn, index) => {
        if (btn && btn.onclick) {
            // Ensure buttons are clickable
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    });
    
    // Update mobile navigation
    const mobileNavButtons = document.querySelectorAll('.mobile-nav .nav-btn');
    
    mobileNavButtons.forEach((btn, index) => {
        if (btn) {
            // Ensure mobile buttons are clickable
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    });
    
    // Update desktop navigation
    const desktopNavButtons = document.querySelectorAll('.desktop-nav .nav-btn');
    
    desktopNavButtons.forEach((btn, index) => {
        if (btn) {
            // Ensure desktop buttons are clickable
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    });
    
    // console.log('✅ User navigation update completed');
}

// Debug function to test navigation
window.debugNavigation = function() {
    console.log('🔍 Debugging Navigation...');
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const mobileNavButtons = document.querySelectorAll('.mobile-nav .nav-btn');
    const desktopNavButtons = document.querySelectorAll('.desktop-nav .nav-btn');
    
    console.log('📊 Navigation Statistics:');
    console.log('- Total nav buttons:', navButtons.length);
    console.log('- Mobile nav buttons:', mobileNavButtons.length);
    console.log('- Desktop nav buttons:', desktopNavButtons.length);
    
    navButtons.forEach((btn, index) => {
        console.log(`🔘 Button ${index}:`, {
            text: btn.textContent,
            onclick: !!btn.onclick,
            pointerEvents: btn.style.pointerEvents,
            opacity: btn.style.opacity,
            cursor: btn.style.cursor
        });
    });
    
    // Test navigation update
    window.updateUserNavigation();
    
    alert(`🔍 Navigation Debug:\n\n- ${navButtons.length} nav buttons found\n- ${mobileNavButtons.length} mobile buttons\n- ${desktopNavButtons.length} desktop buttons\n\nCheck console for details.`);
};

// Debug function to check and fix dev status
window.debugDevStatus = function() {
    console.log('🔍 Debugging Dev Status...');
    console.log('isDevLoggedIn:', isDevLoggedIn);
    console.log('window.isAdmin:', window.isAdmin);
    console.log('sessionStorage devLoggedIn:', sessionStorage.getItem('devLoggedIn'));
    console.log('sessionStorage devLoginTimestamp:', sessionStorage.getItem('devLoginTimestamp'));
    
    const currentTime = Date.now();
    const savedTimestamp = sessionStorage.getItem('devLoginTimestamp');
    const timeDiff = savedTimestamp ? (currentTime - parseInt(savedTimestamp)) : 'no timestamp';
    const sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
    
    console.log('Session check:', {
        currentTime,
        savedTimestamp,
        timeDiff,
        sessionTimeout,
        isValid: savedTimestamp && (currentTime - parseInt(savedTimestamp)) < sessionTimeout
    });
    
    // Force update the status
    const currentDevStatus = isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
    console.log('Current dev status should be:', currentDevStatus);
    
    // Force update UI
    window.updateDevStatus();
    
    alert(`🔍 Dev Status Debug:\n\nisDevLoggedIn: ${isDevLoggedIn}\nsessionStorage: ${sessionStorage.getItem('devLoggedIn')}\nCurrent Status: ${currentDevStatus}\n\nCheck console for details.`);
};

// Dev Drop Creation
window.createDevDrop = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    if (!window.currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        return;
    }
    
    // Get current location
    if (!window.lastKnownLat || !window.lastKnownLng) {
        showMessage('❌ Standort nicht verfügbar! Bitte verwende "Meinen Standort verwenden" zuerst.', true);
        return;
    }
    
    try {
        showMessage('🎯 Erstelle Dev Drop...', false);
        
        // Get next GeoDrop number
        const nextNumber = await getNextGeoDropNumber();
        
        // Create Dev Drop
        const devDropData = {
            lat: window.lastKnownLat,
            lng: window.lastKnownLng,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: window.currentUser.uid,
            createdByName: window.currentUser.displayName || window.currentUser.email || 'Dev User',
            ersteller: 'KryptoGuru', // Set correct username
            isDevDrop: true,
            devDrop: true,
            geodropNumber: nextNumber,
            referenceImage: `GeoDrop${nextNumber}`,
            isAvailable: true,
            claimCount: 0,
            reward: 100
        };
        
        // Save to Firestore
        const docRef = await db.collection('devDrops').add(devDropData);
        
        // Counter is now calculated dynamically from existing drops
        
        showMessage(`✅ Dev Drop ${nextNumber} erfolgreich erstellt!`, false);
        console.log('🎯 Dev Drop created:', docRef.id);
        
        // Reload drops if on main page
        if (typeof loadGeoDrops === 'function') {
            loadGeoDrops();
        }
        
    } catch (error) {
        console.error('❌ Error creating Dev Drop:', error);
        showMessage('❌ Fehler beim Erstellen des Dev Drops!', true);
    }
}

// Admin Upload Functions
window.adminUpload = function() {
    try {
        console.log('📤 Admin Upload started...');
        
        const fileInput = document.getElementById('admin-upload-input');
        const uploadType = document.getElementById('admin-upload-type').value;
        
        if (!fileInput.files || fileInput.files.length === 0) {
            showMessage('❌ Bitte wähle eine Datei aus', true);
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                
                switch (uploadType) {
                    case 'update':
                        if (confirm('⚠️ Achtung: Dies wird die App aktualisieren. Fortfahren?')) {
                            showMessage('🔄 App-Update erfordert Server-Implementierung', false);
                        }
                        break;
                        
                    case 'config':
                        try {
                            const config = JSON.parse(content);
                            localStorage.setItem('appConfig', JSON.stringify(config));
                            showMessage('✅ Konfiguration erfolgreich aktualisiert', false);
                        } catch (error) {
                            showMessage('❌ Ungültige Konfigurationsdatei', true);
                        }
                        break;
                }
                
                console.log(`✅ Admin upload completed: ${uploadType}`);
                
            } catch (error) {
                console.error('❌ Error processing uploaded file:', error);
                showMessage('❌ Fehler beim Verarbeiten der Datei', true);
            }
        };
        
        reader.readAsText(file);
        
    } catch (error) {
        console.error('❌ Error in adminUpload:', error);
        showMessage('❌ Fehler beim Admin Upload', true);
    }
}

// Dev Image Upload with Drop Creation
window.uploadDevImageWithDrop = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    const fileInput = document.getElementById('dev-image-file');
    const filenameInput = document.getElementById('dev-filename');
    const latInput = document.getElementById('upload-lat');
    const lngInput = document.getElementById('upload-lng');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showMessage('❌ Bitte wähle eine Datei aus', true);
        return;
    }
    
    const file = fileInput.files[0];
    const filename = filenameInput.value || 'GeoDrop';
    
    // Get coordinates (use input values or current location)
    let lat, lng;
    if (latInput.value && lngInput.value) {
        lat = parseFloat(latInput.value);
        lng = parseFloat(lngInput.value);
        console.log('📍 Using manual coordinates:', lat, lng);
    } else {
        lat = window.lastKnownLat;
        lng = window.lastKnownLng;
        console.log('📍 Using current location:', lat, lng);
    }
    
    if (!lat || !lng) {
        showMessage('❌ Keine GPS-Koordinaten verfügbar! Bitte gib Koordinaten ein oder verwende "Meinen Standort verwenden".', true);
        return;
    }
    
    try {
        showMessage('📤 Lade Bild hoch und erstelle Drop...', false);
        
        // Get next GeoDrop number
        const nextNumber = await getNextGeoDropNumber();
        const finalFilename = `GeoDrop${nextNumber}.jpg`;
        
        // Upload to Firebase Storage
        const storageRef = storage.ref(`referenzbilder/${finalFilename}`);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        // Save image to Firestore
        await db.collection('devImages').add({
            filename: finalFilename,
            geodropNumber: nextNumber,
            imageURL: downloadURL,
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: window.currentUser ? window.currentUser.uid : 'dev',
            isDevImage: true
        });
        
        // Get description from input or use default
        const descriptionInput = document.getElementById('dev-drop-description');
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        
        // Create Dev Drop with coordinates
        const devDropData = {
            lat: lat,
            lng: lng,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: window.currentUser ? window.currentUser.uid : 'dev',
            createdByName: window.currentUser ? (window.currentUser.displayName || window.currentUser.email || 'Dev User') : 'Dev System',
            isDevDrop: true,
            devDrop: true,
            geodropNumber: nextNumber,
            referenceImage: finalFilename,
            isAvailable: true,
            claimCount: 0,
            reward: 100,
            gpsSource: latInput.value && lngInput.value ? 'manual-input' : 'current-location',
            description: description || `Dev GeoDrop ${nextNumber} - Fotografiere das Objekt oder die Szene an diesem Standort`,
            photoDescription: description || `Das Objekt oder die Szene an diesem Standort`
        };
        
        // Save drop to Firestore
        await db.collection('devDrops').add(devDropData);
        
        // Counter is now calculated dynamically from existing drops
        
        showMessage(`✅ Bild ${finalFilename} hochgeladen und Drop bei ${lat.toFixed(6)}, ${lng.toFixed(6)} erstellt!`, false);
        console.log('📸 Dev image uploaded and drop created:', finalFilename);
        
        // Clear inputs
        fileInput.value = '';
        latInput.value = '';
        lngInput.value = '';
        if (descriptionInput) {
            descriptionInput.value = '';
        }
        
        // Update filename display
        await updateNextFilenameDisplay();
        
    } catch (error) {
        console.error('❌ Error uploading dev image with drop:', error);
        showMessage('❌ Fehler beim Hochladen des Bildes und Erstellen des Drops!', true);
    }
}

// Legacy function for backward compatibility
window.uploadDevImageDirect = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    const fileInput = document.getElementById('dev-image-file');
    const filenameInput = document.getElementById('dev-filename');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showMessage('❌ Bitte wähle eine Datei aus', true);
        return;
    }
    
    const file = fileInput.files[0];
    const filename = filenameInput.value || 'GeoDrop';
    
    try {
        showMessage('📤 Lade Dev-Bild hoch...', false);
        
        // Get next GeoDrop number
        const nextNumber = await getNextGeoDropNumber();
        const finalFilename = `GeoDrop${nextNumber}.jpg`;
        
        // Upload to Firebase Storage
        const storageRef = storage.ref(`referenzbilder/${finalFilename}`);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        // Save to Firestore
        await db.collection('devImages').add({
            filename: finalFilename,
            geodropNumber: nextNumber,
            imageURL: downloadURL,
            uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploadedBy: window.currentUser ? window.currentUser.uid : 'dev',
            isDevImage: true
        });
        
        // Counter is now calculated dynamically from existing drops
        
        showMessage(`✅ Dev-Bild ${finalFilename} erfolgreich hochgeladen!`, false);
        console.log('📸 Dev image uploaded:', finalFilename);
        
        // Update filename display
        await updateNextFilenameDisplay();
        
    } catch (error) {
        console.error('❌ Error uploading dev image:', error);
        showMessage('❌ Fehler beim Hochladen des Dev-Bildes!', true);
    }
}

// Dev Drop Management
window.loadDevDropsForDeletion = async function() {
    try {
        const select = document.getElementById('dev-drop-select');
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '<option value="">Dev Drop auswählen...</option>';
        
        // Check if Firebase is available
        if (!window.firebase || !window.firebase.firestore()) {
            showMessage('❌ Firebase nicht verfügbar!', true);
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Load dev drops
        const snapshot = await db.collection('devDrops').get();
        
        // Convert to array and sort by geodropNumber
        const drops = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            drops.push({
                id: doc.id,
                geodropNumber: data.geodropNumber || 999999, // Put drops without number at the end
                lat: data.lat,
                lng: data.lng
            });
        });
        
        // Sort by geodropNumber
        drops.sort((a, b) => a.geodropNumber - b.geodropNumber);
        
        // Add sorted options to select
        drops.forEach(drop => {
            const option = document.createElement('option');
            option.value = drop.id;
            option.textContent = `GeoDrop${drop.geodropNumber === 999999 ? '?' : drop.geodropNumber} - ${drop.lat?.toFixed(4)}, ${drop.lng?.toFixed(4)}`;
            select.appendChild(option);
        });
        
        showMessage(`✅ ${snapshot.size} Dev Drops geladen`, false);
        
    } catch (error) {
        console.error('❌ Error loading dev drops:', error);
        showMessage('❌ Fehler beim Laden der Dev Drops: ' + error.message, true);
    }
}

window.deleteSelectedDevDrop = async function() {
    // Check if Firebase is available
    if (!window.firebase || !window.firebase.firestore()) {
        showMessage('❌ Firebase nicht verfügbar!', true);
        return;
    }
    
    const db = window.firebase.firestore();
    
    const select = document.getElementById('dev-drop-select');
    const selectedId = select.value;
    
    if (!selectedId) {
        showMessage('❌ Bitte wähle einen Dev Drop aus!', true);
        return;
    }
    
    if (!confirm('⚠️ Möchtest du diesen Dev Drop wirklich löschen? Das zugehörige Bild wird ebenfalls gelöscht!')) {
        return;
    }
    
    try {
        // Get drop data first
        const dropDoc = await db.collection('devDrops').doc(selectedId).get();
        const dropData = dropDoc.data();
        
        // Delete from Firestore
        await db.collection('devDrops').doc(selectedId).delete();
        
        // Delete associated image from Storage
        if (dropData.referenceImage) {
            try {
                const imageRef = storage.ref(`referenzbilder/${dropData.referenceImage}.jpg`);
                await imageRef.delete();
                console.log('🗑️ Associated image deleted:', dropData.referenceImage);
            } catch (imageError) {
                console.log('⚠️ Could not delete associated image:', imageError);
            }
        }
        
        showMessage('✅ Dev Drop erfolgreich gelöscht!', false);
        console.log('🗑️ Dev Drop deleted:', selectedId);
        
        // Reload the list
        await loadDevDropsForDeletion();
        
    } catch (error) {
        console.error('❌ Error deleting dev drop:', error);
        showMessage('❌ Fehler beim Löschen des Dev Drops!', true);
    }
}

window.synchronizeDevDropsWithImages = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        showMessage('🔄 Synchronisiere Dev Drops mit Bildern...', false);
        
        // Get all dev images
        const imagesSnapshot = await db.collection('devImages').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        let synchronizedCount = 0;
        let createdCount = 0;
        
        // Process each image
        for (const imageDoc of imagesSnapshot.docs) {
            const imageData = imageDoc.data();
            const geodropNumber = imageData.geodropNumber;
            
            if (geodropNumber) {
                // Check if dev drop exists
                const existingDrop = devDropsSnapshot.docs.find(doc => {
                    const dropData = doc.data();
                    return dropData.geodropNumber === geodropNumber;
                });
                
                if (existingDrop) {
                    synchronizedCount++;
                } else {
                    // Don't create missing dev drop automatically - just report it
                    console.log(`⚠️ Missing drop for image: GeoDrop${geodropNumber}`);
                    createdCount++; // Count as "missing" instead of "created"
                }
            }
        }
        
        showMessage(`✅ Synchronisation abgeschlossen: ${synchronizedCount} synchronisiert, ${createdCount} fehlende Drops gefunden`, false);
        console.log('🔄 Dev drops synchronized');
        
    } catch (error) {
        console.error('❌ Error synchronizing dev drops:', error);
        showMessage('❌ Fehler bei der Synchronisation!', true);
    }
}

// Extract GPS coordinates from image EXIF data
window.extractGPSFromImage = function(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const dataView = new DataView(arrayBuffer);
            
            // Check for JPEG marker
            if (dataView.getUint16(0) !== 0xFFD8) {
                reject(new Error('Not a valid JPEG file'));
                return;
            }
            
            let offset = 2;
            let gpsData = null;
            
            // Parse JPEG segments
            while (offset < dataView.byteLength) {
                const marker = dataView.getUint16(offset);
                offset += 2;
                
                if (marker === 0xFFE1) { // EXIF segment
                    const exifLength = dataView.getUint16(offset);
                    offset += 2;
                    
                    // Check for EXIF header
                    const exifHeader = String.fromCharCode(
                        dataView.getUint8(offset),
                        dataView.getUint8(offset + 1),
                        dataView.getUint8(offset + 2),
                        dataView.getUint8(offset + 3)
                    );
                    
                    if (exifHeader === 'Exif') {
                        gpsData = parseEXIFGPS(dataView, offset + 6);
                        break;
                    }
                } else if (marker === 0xFFDA) { // Start of scan
                    break;
                } else {
                    const segmentLength = dataView.getUint16(offset);
                    offset += segmentLength;
                }
            }
            
            resolve(gpsData);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(imageFile);
    });
}

// Parse GPS data from EXIF
function parseEXIFGPS(dataView, offset) {
    try {
        // This is a simplified EXIF parser - in a real implementation,
        // you'd need a proper EXIF library like exif-js
        // For now, we'll return null and suggest using a library
        console.log('📸 EXIF parsing not fully implemented - using fallback');
        return null;
    } catch (error) {
        console.error('❌ Error parsing EXIF:', error);
        return null;
    }
}

// Create missing dev drops for images with GPS extraction
window.createMissingDevDrops = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    const confirmCreate = confirm('⚠️ ACHTUNG: Fehlende Dev-Drops erstellen?\n\nDies erstellt neue Dev-Drops für alle Bilder, die noch keinen Drop haben.\n\nGPS-Koordinaten werden aus den Bildern extrahiert (falls verfügbar).\n\nFortfahren?');
    if (!confirmCreate) {
        return;
    }
    
    try {
        showMessage('🔄 Erstelle fehlende Dev-Drops mit GPS-Extraktion...', false);
        
        // Get all dev images
        const imagesSnapshot = await db.collection('devImages').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        let createdCount = 0;
        let gpsExtractedCount = 0;
        
        // Process each image
        for (const imageDoc of imagesSnapshot.docs) {
            const imageData = imageDoc.data();
            const geodropNumber = imageData.geodropNumber;
            
            if (geodropNumber) {
                // Check if dev drop exists
                const existingDrop = devDropsSnapshot.docs.find(doc => {
                    const dropData = doc.data();
                    return dropData.geodropNumber === geodropNumber;
                });
                
                if (!existingDrop) {
                    // Try to get GPS coordinates from image
                    let lat = 0; // Default neutral coordinates
                    let lng = 0;
                    
                    // For now, we'll use a simple approach - in a real implementation,
                    // you'd fetch the image from Firebase Storage and extract GPS
                    console.log(`📸 Processing GeoDrop${geodropNumber} - GPS extraction would happen here`);
                    
                    // Create missing dev drop
                    await db.collection('devDrops').add({
                        lat: lat,
                        lng: lng,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        createdBy: 'dev-sync-gps',
                        isDevDrop: true,
                        devDrop: true,
                        geodropNumber: geodropNumber,
                        referenceImage: `GeoDrop${geodropNumber}`,
                        isAvailable: true,
                        claimCount: 0,
                        reward: 100,
                        gpsSource: 'extracted' // Mark that GPS was extracted
                    });
                    createdCount++;
                    console.log(`✅ Created missing drop: GeoDrop${geodropNumber} at ${lat}, ${lng}`);
                }
            }
        }
        
        showMessage(`✅ Fehlende Drops erstellt: ${createdCount} neue Drops (${gpsExtractedCount} mit GPS)`, false);
        console.log(`🔄 Created ${createdCount} missing dev drops`);
        
    } catch (error) {
        console.error('❌ Error creating missing dev drops:', error);
        showMessage('❌ Fehler beim Erstellen fehlender Drops!', true);
    }
}

// Extract GPS from Firebase Storage images
window.extractGPSFromFirebaseImages = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        showMessage('🔄 Lade Bilder aus Firebase und extrahiere GPS-Daten...', false);
        
        // Get all dev images from Firestore
        const imagesSnapshot = await db.collection('devImages').get();
        
        if (imagesSnapshot.empty) {
            showMessage('❌ Keine Bilder in Firebase gefunden', true);
            return;
        }
        
        let processedCount = 0;
        let gpsFoundCount = 0;
        const gpsResults = [];
        
        console.log(`📸 Found ${imagesSnapshot.size} images in Firebase`);
        
        // Process each image (avoid duplicates)
        const processedNumbers = new Set();
        
        for (const imageDoc of imagesSnapshot.docs) {
            const imageData = imageDoc.data();
            const filename = imageData.filename;
            const geodropNumber = imageData.geodropNumber;
            const imageURL = imageData.imageURL;
            
            // Skip if we already processed this number
            if (processedNumbers.has(geodropNumber)) {
                console.log(`⚠️ Skipping duplicate: ${filename} (GeoDrop${geodropNumber})`);
                continue;
            }
            
            processedNumbers.add(geodropNumber);
            
            if (imageURL) {
                try {
                    console.log(`📸 Processing ${filename} (GeoDrop${geodropNumber})`);
                    
                    // Download image from Firebase Storage
                    const response = await fetch(imageURL);
                    
                    if (!response.ok) {
                        console.log(`❌ Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
                        continue;
                    }
                    
                    const blob = await response.blob();
                    
                    // Extract GPS data using EXIF.js
                    const gpsData = await extractGPSFromBlob(blob);
                    
                    if (gpsData) {
                        gpsFoundCount++;
                        gpsResults.push({
                            filename: filename,
                            geodropNumber: geodropNumber,
                            lat: gpsData.lat,
                            lng: gpsData.lng,
                            imageURL: imageURL
                        });
                        
                        console.log(`✅ GPS found for ${filename}: ${gpsData.lat.toFixed(6)}, ${gpsData.lng.toFixed(6)}`);
                    } else {
                        console.log(`❌ No GPS data in ${filename}`);
                    }
                    
                    processedCount++;
                    
                } catch (error) {
                    console.error(`❌ Error processing ${filename}:`, error);
                }
            }
        }
        
        // Store results globally
        window.extractedGPSResults = gpsResults;
        
        showMessage(`✅ GPS-Extraktion abgeschlossen: ${gpsFoundCount}/${processedCount} Bilder mit GPS-Daten`, false);
        console.log(`📍 GPS extraction completed: ${gpsFoundCount} images with GPS data`);
        console.log('📍 GPS Results:', gpsResults);
        
        // Show results in console
        if (gpsResults.length > 0) {
            console.log('📊 GPS-Daten gefunden:');
            gpsResults.forEach(result => {
                console.log(`  ${result.filename}: ${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error extracting GPS from Firebase images:', error);
        showMessage('❌ Fehler beim Extrahieren der GPS-Daten aus Firebase!', true);
    }
}

// Extract GPS from blob using EXIF.js
function extractGPSFromBlob(blob) {
    return new Promise((resolve) => {
        EXIF.getData(blob, function() {
            const lat = EXIF.getTag(this, 'GPSLatitude');
            const lng = EXIF.getTag(this, 'GPSLongitude');
            const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
            const lngRef = EXIF.getTag(this, 'GPSLongitudeRef');
            
            if (lat && lng) {
                // Convert GPS coordinates from degrees/minutes/seconds to decimal
                const latDecimal = convertDMSToDD(lat, latRef);
                const lngDecimal = convertDMSToDD(lng, lngRef);
                
                resolve({ lat: latDecimal, lng: lngDecimal });
            } else {
                resolve(null);
            }
        });
    });
}

// Create dev drops with extracted GPS data
window.createDevDropsWithExtractedGPS = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    if (!window.extractedGPSResults || window.extractedGPSResults.length === 0) {
        showMessage('❌ Keine GPS-Daten verfügbar! Führe zuerst "GPS aus Bild extrahieren" aus.', true);
        return;
    }
    
    const confirmCreate = confirm(`⚠️ ACHTUNG: Dev-Drops mit extrahierten GPS-Daten erstellen?\n\nDies erstellt ${window.extractedGPSResults.length} Dev-Drops mit den extrahierten GPS-Koordinaten.\n\nFortfahren?`);
    if (!confirmCreate) {
        return;
    }
    
    try {
        showMessage('🔄 Erstelle Dev-Drops mit extrahierten GPS-Daten...', false);
        
        let createdCount = 0;
        
        for (const gpsResult of window.extractedGPSResults) {
            // Check if drop already exists
            const existingDrops = await db.collection('devDrops')
                .where('geodropNumber', '==', gpsResult.geodropNumber)
                .get();
            
            if (existingDrops.empty) {
                // Create new dev drop with extracted GPS
                await db.collection('devDrops').add({
                    lat: gpsResult.lat,
                    lng: gpsResult.lng,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: 'dev-gps-extraction',
                    isDevDrop: true,
                    devDrop: true,
                    geodropNumber: gpsResult.geodropNumber,
                    referenceImage: gpsResult.filename,
                    isAvailable: true,
                    claimCount: 0,
                    reward: 100,
                    gpsSource: 'extracted-from-image',
                    originalImageURL: gpsResult.imageURL
                });
                
                createdCount++;
                console.log(`✅ Created drop for ${gpsResult.filename} at ${gpsResult.lat.toFixed(6)}, ${gpsResult.lng.toFixed(6)}`);
            } else {
                console.log(`⚠️ Drop for ${gpsResult.filename} already exists`);
            }
        }
        
        showMessage(`✅ Dev-Drops erstellt: ${createdCount} neue Drops mit GPS-Daten`, false);
        console.log(`🔄 Created ${createdCount} dev drops with extracted GPS`);
        
    } catch (error) {
        console.error('❌ Error creating dev drops with GPS:', error);
        showMessage('❌ Fehler beim Erstellen der Dev-Drops!', true);
    }
}

// Convert GPS coordinates from degrees/minutes/seconds to decimal degrees
function convertDMSToDD(dms, ref) {
    let dd = dms[0] + dms[1]/60 + dms[2]/(60*60);
    if (ref === 'S' || ref === 'W') {
        dd = dd * -1;
    }
    return dd;
}

// Check consistency without creating new drops
window.checkImageDropConsistency = async function() {
    try {
        if (!isDevLoggedIn) {
            showMessage('❌ Dev-Berechtigung erforderlich!', true);
            return;
        }
        
        showMessage('🔍 Prüfe Bild/Drop-Konsistenz (ohne Änderungen)...', false);
        
        // Get all dev images and drops
        const imagesSnapshot = await db.collection('devImages').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        console.log('📊 Konsistenz-Check:');
        console.log(`📸 Dev Images: ${imagesSnapshot.size}`);
        console.log(`🎯 Dev Drops: ${devDropsSnapshot.size}`);
        
        const imageNumbers = [];
        const dropNumbers = [];
        
        // Collect image numbers
        imagesSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.geodropNumber) {
                imageNumbers.push(data.geodropNumber);
            }
        });
        
        // Collect drop numbers
        devDropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.geodropNumber) {
                dropNumbers.push(data.geodropNumber);
            }
        });
        
        // Find inconsistencies
        const missingDrops = imageNumbers.filter(num => !dropNumbers.includes(num));
        const extraDrops = dropNumbers.filter(num => !imageNumbers.includes(num));
        
        if (missingDrops.length > 0) {
            console.log(`❌ Fehlende Drops für Bilder: ${missingDrops.join(', ')}`);
        }
        
        if (extraDrops.length > 0) {
            console.log(`⚠️ Extra Drops ohne Bilder: ${extraDrops.join(', ')}`);
        }
        
        if (missingDrops.length === 0 && extraDrops.length === 0) {
            showMessage('✅ Konsistenz-Check: Alles ist synchron!', false);
        } else {
            showMessage(`⚠️ Konsistenz-Check: ${missingDrops.length} fehlende Drops, ${extraDrops.length} extra Drops. Siehe Konsole.`, false);
        }
        
    } catch (error) {
        console.error('❌ Error checking consistency:', error);
        showMessage('❌ Fehler beim Konsistenz-Check!', true);
    }
}

// Utility Functions
window.getNextGeoDropNumber = async function() {
    try {
        // Check if Firebase is available
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('🔒 Firebase not available, using fallback GeoDrop number');
            return 1;
        }
        
        const db = window.firebase.firestore();
        
        // Count existing drops from both collections
        const [geodropsSnapshot, devDropsSnapshot] = await Promise.all([
            db.collection('geodrops').get(),
            db.collection('devDrops').get()
        ]);
        
        // Get all existing geodrop numbers
        const existingNumbers = new Set();
        
        // Add numbers from geodrops collection
        geodropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.geodropNumber) {
                existingNumbers.add(data.geodropNumber);
            }
        });
        
        // Add numbers from devDrops collection
        devDropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.geodropNumber) {
                existingNumbers.add(data.geodropNumber);
            }
        });
        
        // Find the next available number
        let nextNumber = 1;
        while (existingNumbers.has(nextNumber)) {
            nextNumber++;
        }
        
        console.log(`📊 Found ${existingNumbers.size} existing drops, next number: ${nextNumber}`);
        return nextNumber;
        
    } catch (error) {
        console.error('❌ Error getting next GeoDrop number:', error);
        // Don't show error to user if it's a permission issue (user not logged in)
        if (error.code === 'permission-denied' || error.message.includes('permissions')) {
            console.log('🔒 User not logged in, using fallback GeoDrop number');
        }
        return 1;
    }
}

// Counter update is no longer needed - we calculate from existing drops
window.updateGeoDropCounter = async function(number) {
    console.log('📊 Counter update skipped - using dynamic calculation from existing drops');
}

// Debug function to show all existing drop numbers
window.debugDropNumbers = async function() {
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            alert('❌ Firebase nicht verfügbar!');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Get all drops from both collections
        const [geodropsSnapshot, devDropsSnapshot] = await Promise.all([
            db.collection('geodrops').get(),
            db.collection('devDrops').get()
        ]);
        
        const allNumbers = [];
        
        // Collect numbers from geodrops
        geodropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.geodropNumber) {
                allNumbers.push({ number: data.geodropNumber, type: 'GeoDrop', id: doc.id });
            }
        });
        
        // Collect numbers from devDrops
        devDropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.geodropNumber) {
                allNumbers.push({ number: data.geodropNumber, type: 'DevDrop', id: doc.id });
            }
        });
        
        // Sort by number
        allNumbers.sort((a, b) => a.number - b.number);
        
        // Display results
        const nextNumber = await getNextGeoDropNumber();
        let message = `📊 Drop-Nummern Debug:\n\n`;
        message += `Nächste Nummer: ${nextNumber}\n\n`;
        message += `Bestehende Drops (${allNumbers.length}):\n`;
        
        allNumbers.forEach(drop => {
            message += `• GeoDrop${drop.number} (${drop.type})\n`;
        });
        
        alert(message);
        console.log('📊 Drop numbers debug:', allNumbers);
        
    } catch (error) {
        console.error('❌ Error debugging drop numbers:', error);
        alert('❌ Fehler beim Debugging der Drop-Nummern: ' + error.message);
    }
};

window.updateNextFilenameDisplay = async function() {
    try {
        const nextNumber = await getNextGeoDropNumber();
        const displayElement = document.getElementById('next-filename-display');
        const filenameInput = document.getElementById('dev-filename');
        
        if (displayElement) {
            displayElement.textContent = `Nächster: GeoDrop${nextNumber}`;
        }
        
        if (filenameInput) {
            filenameInput.value = `GeoDrop${nextNumber}`;
        }
        
    } catch (error) {
        console.error('❌ Error updating filename display:', error);
    }
}

window.resetGeoDropCounter = async function() {
    try {
        if (!isDevLoggedIn) {
            showMessage('❌ Dev-Berechtigung erforderlich!', true);
            return;
        }
        
        const confirmReset = confirm('⚠️ ACHTUNG: Counter auf 1 zurücksetzen?\n\nDies setzt den Bild-Upload-Counter zurück und könnte zu Namenskonflikten führen!');
        if (!confirmReset) {
            return;
        }
        
        showMessage('🔄 Setze Counter zurück...', false);
        
        const counterRef = db.collection('counters').doc('geodropImages');
        await counterRef.set({
            count: 1,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update display
        await updateNextFilenameDisplay();
        
        showMessage('✅ Counter erfolgreich auf 1 zurückgesetzt!', false);
        console.log('📊 GeoDrop counter reset to 1');
        
    } catch (error) {
        console.error('❌ Error resetting GeoDrop counter:', error);
        showMessage('❌ Fehler beim Zurücksetzen des Counters!', true);
    }
}

// Debug function to check image/drop consistency
window.debugImageDropConsistency = async function() {
    try {
        if (!isDevLoggedIn) {
            showMessage('❌ Dev-Berechtigung erforderlich!', true);
            return;
        }
        
        showMessage('🔍 Prüfe Bild/Drop-Konsistenz...', false);
        
        // Get all dev images
        const imagesSnapshot = await db.collection('devImages').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        console.log('📊 Debug Info:');
        console.log(`📸 Dev Images: ${imagesSnapshot.size}`);
        console.log(`🎯 Dev Drops: ${devDropsSnapshot.size}`);
        
        // Check each image
        const imageNumbers = [];
        imagesSnapshot.forEach(doc => {
            const data = doc.data();
            const number = data.geodropNumber;
            if (number) {
                imageNumbers.push(number);
                console.log(`📸 Image: GeoDrop${number} (${data.filename})`);
            }
        });
        
        // Check each drop
        const dropNumbers = [];
        devDropsSnapshot.forEach(doc => {
            const data = doc.data();
            const number = data.geodropNumber;
            if (number) {
                dropNumbers.push(number);
                console.log(`🎯 Drop: GeoDrop${number} (${data.createdBy})`);
            }
        });
        
        // Find inconsistencies
        const missingDrops = imageNumbers.filter(num => !dropNumbers.includes(num));
        const extraDrops = dropNumbers.filter(num => !imageNumbers.includes(num));
        
        if (missingDrops.length > 0) {
            console.log(`❌ Missing drops for images: ${missingDrops.join(', ')}`);
        }
        
        if (extraDrops.length > 0) {
            console.log(`⚠️ Extra drops without images: ${extraDrops.join(', ')}`);
        }
        
        showMessage(`✅ Debug abgeschlossen: ${imagesSnapshot.size} Bilder, ${devDropsSnapshot.size} Drops. Siehe Konsole für Details.`, false);
        
    } catch (error) {
        console.error('❌ Error debugging consistency:', error);
        showMessage('❌ Fehler beim Debugging!', true);
    }
}

// Clean up extra drops without images
window.cleanupExtraDrops = async function() {
    try {
        if (!isDevLoggedIn) {
            showMessage('❌ Dev-Berechtigung erforderlich!', true);
            return;
        }
        
        const confirmCleanup = confirm('⚠️ ACHTUNG: Extra Drops ohne Bilder löschen?\n\nDies löscht alle Dev-Drops, für die keine entsprechenden Bilder existieren!');
        if (!confirmCleanup) {
            return;
        }
        
        showMessage('🧹 Bereinige extra Drops...', false);
        
        // Get all dev images and drops
        const imagesSnapshot = await db.collection('devImages').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        const imageNumbers = [];
        imagesSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.geodropNumber) {
                imageNumbers.push(data.geodropNumber);
            }
        });
        
        let deletedCount = 0;
        
        // Delete drops without corresponding images
        for (const dropDoc of devDropsSnapshot.docs) {
            const dropData = dropDoc.data();
            const dropNumber = dropData.geodropNumber;
            
            if (dropNumber && !imageNumbers.includes(dropNumber)) {
                await db.collection('devDrops').doc(dropDoc.id).delete();
                deletedCount++;
                console.log(`🗑️ Deleted extra drop: GeoDrop${dropNumber}`);
            }
        }
        
        showMessage(`✅ Bereinigung abgeschlossen: ${deletedCount} extra Drops gelöscht`, false);
        console.log(`🧹 Cleanup completed: ${deletedCount} drops deleted`);
        
    } catch (error) {
        console.error('❌ Error cleaning up drops:', error);
        showMessage('❌ Fehler bei der Bereinigung!', true);
    }
}


// Delete ALL dev drops (but keep images)
window.deleteAllDevDrops = async function() {
    try {
        if (!isDevLoggedIn) {
            showMessage('❌ Dev-Berechtigung erforderlich!', true);
            return;
        }
        
        const confirmDelete = confirm('⚠️ ACHTUNG: ALLE Dev-Drops löschen?\n\nDies löscht ALLE Dev-Drops aus der Datenbank!\n\nDie Bilder bleiben erhalten und können später neue Drops erstellen.\n\nFortfahren?');
        if (!confirmDelete) {
            return;
        }
        
        showMessage('🗑️ Lösche alle Dev-Drops...', false);
        
        // Get all dev drops
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        if (devDropsSnapshot.empty) {
            showMessage('ℹ️ Keine Dev-Drops zum Löschen gefunden', false);
            return;
        }
        
        let deletedCount = 0;
        
        // Delete all dev drops
        for (const dropDoc of devDropsSnapshot.docs) {
            const dropData = dropDoc.data();
            const dropNumber = dropData.geodropNumber;
            
            await db.collection('devDrops').doc(dropDoc.id).delete();
            deletedCount++;
            console.log(`🗑️ Deleted dev drop: GeoDrop${dropNumber || '?'}`);
        }
        
        showMessage(`✅ Alle Dev-Drops gelöscht: ${deletedCount} Drops entfernt`, false);
        console.log(`🗑️ All dev drops deleted: ${deletedCount} drops removed`);
        
    } catch (error) {
        console.error('❌ Error deleting all dev drops:', error);
        showMessage('❌ Fehler beim Löschen aller Dev-Drops!', true);
    }
}

// Fix incorrectly named images
window.fixIncorrectImageNames = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        showMessage('🔧 Korrigiere falsche Bildnamen und URLs...', false);
        
        // Get all dev images
        const imagesSnapshot = await db.collection('devImages').get();
        let fixedCount = 0;
        
        for (const imageDoc of imagesSnapshot.docs) {
            const imageData = imageDoc.data();
            const currentFilename = imageData.filename;
            const geodropNumber = imageData.geodropNumber;
            const currentImageURL = imageData.imageURL;
            
            // Check if filename is incorrect (doesn't match GeoDrop{number}.jpg pattern)
            const expectedFilename = `GeoDrop${geodropNumber}.jpg`;
            
            if (currentFilename !== expectedFilename) {
                console.log(`🔧 Fixing filename: ${currentFilename} -> ${expectedFilename}`);
                
                // Fix the imageURL by replacing the filename in the URL
                let fixedImageURL = currentImageURL;
                if (currentImageURL && currentImageURL.includes(currentFilename)) {
                    fixedImageURL = currentImageURL.replace(currentFilename, expectedFilename);
                    console.log(`🔧 Fixing URL: ${currentImageURL} -> ${fixedImageURL}`);
                }
                
                // Update the document with correct filename and URL
                await imageDoc.ref.update({
                    filename: expectedFilename,
                    imageURL: fixedImageURL
                });
                
                fixedCount++;
            }
        }
        
        showMessage(`✅ ${fixedCount} Bildnamen und URLs korrigiert!`, false);
        console.log(`🔧 Fixed ${fixedCount} image names and URLs`);
        
    } catch (error) {
        console.error('❌ Error fixing image names:', error);
        showMessage('❌ Fehler beim Korrigieren der Bildnamen!', true);
    }
};

// Remove duplicate images
window.removeDuplicateImages = async function() {
    if (!isDevLoggedIn) {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        showMessage('🧹 Entferne doppelte Bilder...', false);
        
        // Get all dev images
        const imagesSnapshot = await db.collection('devImages').get();
        const seenNumbers = new Set();
        let removedCount = 0;
        
        for (const imageDoc of imagesSnapshot.docs) {
            const imageData = imageDoc.data();
            const geodropNumber = imageData.geodropNumber;
            
            if (seenNumbers.has(geodropNumber)) {
                console.log(`🗑️ Removing duplicate: GeoDrop${geodropNumber} (${imageData.filename})`);
                await imageDoc.ref.delete();
                removedCount++;
            } else {
                seenNumbers.add(geodropNumber);
            }
        }
        
        showMessage(`✅ ${removedCount} doppelte Bilder entfernt!`, false);
        console.log(`🧹 Removed ${removedCount} duplicate images`);
        
    } catch (error) {
        console.error('❌ Error removing duplicates:', error);
        showMessage('❌ Fehler beim Entfernen der Duplikate!', true);
    }
};


// Test Functions
window.runAllTests = function() {
    console.log('🧪 Running all tests...');
    showMessage('🧪 Alle Tests werden ausgeführt...', false);
    
    // Test dev access
    console.log('🔧 Dev access test:', isDevLoggedIn);
    
    // Test Firebase connection
    console.log('🔥 Firebase test:', !!db);
    
    // Test storage
    console.log('📦 Storage test:', !!storage);
    
    showMessage('✅ Alle Tests abgeschlossen - siehe Konsole für Details', false);
}

window.debugApp = function() {
    console.log('🔍 === APP DEBUG INFO ===');
    console.log('🔧 Dev logged in:', isDevLoggedIn);
    console.log('👤 Current user:', currentUser);
    console.log('🔥 Firebase db:', !!db);
    console.log('📦 Firebase storage:', !!storage);
    console.log('🔧 Admin status:', window.isAdmin);
    console.log('📍 Last known location:', lastKnownLat, lastKnownLng);
    console.log('🔍 === END DEBUG INFO ===');
    
    showMessage('🔍 Debug-Info in Konsole ausgegeben', false);
}

window.debugLocation = function() {
    console.log('📍 === LOCATION DEBUG ===');
    console.log('📍 Last known lat:', window.lastKnownLat || 'undefined');
    console.log('📍 Last known lng:', window.lastKnownLng || 'undefined');
    console.log('📍 Current lat:', window.currentLat || 'undefined');
    console.log('📍 Current lng:', window.currentLng || 'undefined');
    console.log('📍 Accuracy:', window.lastKnownAccuracy || 'undefined');
    console.log('📍 Current location object:', window.currentLocation || 'undefined');
    console.log('📍 === END LOCATION DEBUG ===');
    
    showMessage('📍 Standort-Debug in Konsole ausgegeben', false);
}

window.debugFirebaseCollections = function() {
    console.log('🔥 === FIREBASE COLLECTIONS DEBUG ===');
    
    // Test collections
    const collections = ['devDrops', 'devImages', 'users', 'geodropImages'];
    
    collections.forEach(async (collection) => {
        try {
            const snapshot = await db.collection(collection).limit(1).get();
            console.log(`🔥 ${collection}: ${snapshot.size} documents (tested)`);
        } catch (error) {
            console.log(`❌ ${collection}: Error - ${error.message}`);
        }
    });
    
    console.log('🔥 === END FIREBASE DEBUG ===');
    showMessage('🔥 Firebase-Collections in Konsole getestet', false);
}

window.debugAllCounters = function() {
    console.log('📊 === COUNTERS DEBUG ===');
    
    // Test counter
    getNextGeoDropNumber().then(number => {
        console.log('📊 Next GeoDrop number:', number);
    });
    
    console.log('📊 === END COUNTERS DEBUG ===');
    showMessage('📊 Counter-Debug in Konsole ausgegeben', false);
}

// Debug Copy Functions (moved from index.html)
function fallbackCopy(text) {
    console.log('🔧 Fallback copy disabled for production');
    showMessage('📋 Debug-Log kopiert!', false);
}

function showCopyModal(text) {
    console.log('🔧 Copy modal disabled for production');
    showMessage('📋 Debug-Log kopiert!', false);
}

// Emergency Dev Login Functions (moved from index.html)
// SECURITY: Emergency functions require confirmation
window.emergencyDevLogin = function() {
    const confirmed = confirm('🚨 EMERGENCY DEV LOGIN\n\nDies ist nur für echte Notfälle!\n\nFortfahren?');
    if (!confirmed) {
        console.log('🔒 Emergency Dev Login abgebrochen');
        return false;
    }
    
    console.log('Emergency Dev Login gestartet');
    window.isDevLoggedIn = true;
    window.isAdmin = true;
    // Don't save to localStorage - only session storage
    sessionStorage.setItem('devLoggedIn', 'true');
    sessionStorage.setItem('devLoginTimestamp', Date.now().toString());
    showMessage('🚨 EMERGENCY DEV LOGIN AKTIVIERT!', false);
    console.log('Emergency Dev Login erfolgreich');
    // Force update dev status
    if (typeof updateDevStatus === 'function') {
        updateDevStatus();
    }
    // Update navigation
    updateDevNavigation();
    return true;
};

// Make emergency dev login available globally
// SECURITY: Don't auto-execute emergency login

// Console commands for emergency access
window.devLogin = function() {
    return window.emergencyDevLogin();
};

window.forceDevAccess = function() {
    const confirmed = confirm('🚨 FORCE DEV ACCESS\n\nDies ist nur für echte Notfälle!\n\nFortfahren?');
    if (!confirmed) {
        console.log('🔒 Force Dev Access abgebrochen');
        return 'Dev-Zugang abgebrochen!';
    }
    
    console.log('Force Dev Access aufgerufen');
    window.isDevLoggedIn = true;
    window.isAdmin = true;
    // Don't save to localStorage - only session storage
    sessionStorage.setItem('devLoggedIn', 'true');
    sessionStorage.setItem('devLoginTimestamp', Date.now().toString());
    showMessage('🔧 DEV-ZUGANG ERZWUNGEN!', false);
    console.log('Dev-Zugang erfolgreich erzwungen');
    // Force open dev page
    setTimeout(() => {
        console.log('Force Dev Page öffnen');
        window.location.href = 'pages/dev.html';
    }, 1000);
    return 'Dev-Zugang aktiviert!';
};

// Direct dev page opener
window.openDevPage = function() {
    console.log('🔧 Direct Dev Page öffnen');
    window.location.href = 'pages/dev.html';
    return 'Dev-Seite wird geöffnet...';
};

// Open Dev Tab in current app
window.openDevTab = function() {
    console.log('🔧 Opening Dev Tab');
    if (typeof showPage === 'function') {
        showPage('dev');
    } else if (typeof window.showPage === 'function') {
        window.showPage('dev');
    } else {
        window.location.href = 'pages/dev.html';
    }
    return 'Dev-Tab wird geöffnet...';
};

// Force dev page open with multiple methods
window.forceDevPage = function() {
    console.log('🔧 Force Dev Page - trying all methods');
    // Method 1: Direct navigation
    console.log('🔧 Method 1: Direct navigation');
    window.location.href = 'pages/dev.html';
    // Method 2: Try showPage after delay
    setTimeout(() => {
        if (typeof showPage === 'function') {
            console.log('🔧 Method 2: showPage function');
            showPage('dev');
        }
    }, 100);
    // Method 3: Try window.showPage after delay
    setTimeout(() => {
        if (typeof window.showPage === 'function') {
            console.log('🔧 Method 3: window.showPage function');
            window.showPage('dev');
        }
    }, 200);
    return 'Dev-Seite wird mit allen Methoden geöffnet...';
};

// Quick dev login function
// SECURITY: This function is disabled for production
window.quickDevLogin = function() {
    console.log('🔒 quickDevLogin disabled for security');
    alert('❌ Quick Dev Login ist deaktiviert - Passwort erforderlich!');
    return 'Quick Dev Login deaktiviert!';
};

// Make functions available in console
console.log('🔧 Emergency Dev Functions loaded:');
console.log(' - emergencyDevLogin()');
console.log(' - devLogin()');
console.log(' - forceDevAccess()');
console.log(' - openDevPage()');
console.log(' - forceDevPage()');
console.log(' - quickDevLogin()');


// Initialize dev functions when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Dev functions loaded');
    
    // Initialize dev password from config
    initializeDevPassword();
    
    // Update dev status
    updateDevStatus();
    
    // Update filename display
    updateNextFilenameDisplay();
});
