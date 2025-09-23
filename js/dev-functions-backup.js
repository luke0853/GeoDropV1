// Dev Functions for GeoDrop App - BACKUP VERSION

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
