// Firebase Configuration and Initialization
// Konfiguration wird aus config/config-secure.js und config-secrets.js geladen

const firebaseConfig = {
    apiKey: "AIzaSyBbaHV1OY9C_MUt4o3WTkHCGlRVt7ll9UA",
    authDomain: "geodrop-f3ee1.firebaseapp.com",
    projectId: "geodrop-f3ee1",
    storageBucket: "geodrop-f3ee1.firebasestorage.app",
    messagingSenderId: "1054615552034",
    appId: "1:1054615552034:web:8d61c64b5296f4e0cc4a7b",
    measurementId: "G-RBEJES6HX1"
};

// Initialize Firebase
let app, db, storage, auth;

// Wait for Firebase to be available
window.initializeFirebase = function() {
    console.log("🔥 Initializing Firebase...");
    console.log("📋 Firebase config:", firebaseConfig);
    
    if (typeof firebase === 'undefined') {
        console.log("⏳ Waiting for Firebase to load...");
        setTimeout(window.initializeFirebase, 100);
        return;
    }
    
    // Check if Firebase is already initialized
    if (firebase.apps.length > 0) {
        console.log("🔥 Firebase already initialized, using existing app...");
        app = firebase.app();
        db = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();
        
        // Make Firebase services globally available
        window.auth = auth;
        window.db = db;
        window.storage = storage;
        window.firebase = firebase;
        
        // Set current user if already logged in
        if (auth.currentUser) {
            window.currentUser = auth.currentUser;
            console.log('👤 Current user set:', auth.currentUser.email);
        }
        
        // Initialize auth state listener
        setupAuthListener();
        return;
    }
    
    try {
        console.log("🔥 Firebase library loaded, initializing...");
        
        // Check if Firebase is already initialized
        if (!firebase.apps.length) {
            console.log("🔥 Creating new Firebase app...");
            app = firebase.initializeApp(firebaseConfig);
        } else {
            console.log("🔥 Using existing Firebase app...");
            app = firebase.app();
        }
        
        console.log("🔥 Initializing Firebase services...");
        db = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();
        
        console.log("✅ Firebase initialized successfully");
        console.log("📊 Auth object:", auth);
        console.log("🗄️ DB object:", db);
        
        // Make Firebase services globally available
        window.auth = auth;
        window.db = db;
        window.storage = storage;
        window.firebase = firebase;
        
        // Set current user if already logged in
        if (auth.currentUser) {
            window.currentUser = auth.currentUser;
            console.log('👤 Current user set:', auth.currentUser.email);
        } else {
            console.log('👤 No current user found');
        }
        
        // Initialize auth state listener
        setupAuthListener();
        
    } catch (error) {
        console.error("❌ Firebase initialization failed:", error);
        console.error("❌ Error details:", error.message);
        console.error("❌ Error stack:", error.stack);
    }
}

// Initialize Firebase when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeFirebase);
} else {
    window.initializeFirebase();
}

// Clear Firebase cache on page load to prevent old API key issues
window.addEventListener('load', function() {
    console.log('🔄 Page loaded - checking for Firebase cache issues...');
    
    // Check if we need to clear cache (if login fails with old API key)
    const lastLoginAttempt = localStorage.getItem('lastLoginAttempt');
    const now = Date.now();
    
    if (lastLoginAttempt && (now - parseInt(lastLoginAttempt)) < 30000) { // 30 seconds
        console.log('🔄 Recent login attempt detected - clearing Firebase cache...');
        if (window.forceFirebaseReinit) {
            window.forceFirebaseReinit();
        }
    }
});

// Also try to initialize Firebase immediately
setTimeout(window.initializeFirebase, 100);
setTimeout(window.initializeFirebase, 500);
setTimeout(window.initializeFirebase, 1000);

// Re-initialize Firebase after logout to ensure it's ready for new login
window.reinitializeFirebase = function() {
    console.log("🔄 Re-initializing Firebase after logout...");
    
    // Only reinitialize if there are actual issues
    const lastLoginAttempt = localStorage.getItem('lastLoginAttempt');
    const now = Date.now();
    
    if (lastLoginAttempt && (now - parseInt(lastLoginAttempt)) < 10000) { // 10 seconds
        console.log("🔄 Recent login issues detected, reinitializing Firebase...");
        
        // Force delete existing Firebase app to clear cache
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            try {
                firebase.app().delete();
                console.log("🔥 Old Firebase app deleted for re-initialization");
            } catch (error) {
                console.log("🔥 Error deleting old app:", error.message);
            }
        }
        
        // Clear global variables
        app = null;
        db = null;
        storage = null;
        auth = null;
        window.auth = null;
        window.db = null;
        window.storage = null;
        window.firebase = null;
        
        // Re-initialize with delays
        setTimeout(window.initializeFirebase, 100);
        setTimeout(window.initializeFirebase, 500);
        setTimeout(window.initializeFirebase, 1000);
    } else {
        console.log("🔄 No recent login issues detected, skipping reinitialization");
    }
};

// Force clear Firebase cache and reinitialize
window.forceFirebaseReinit = function() {
    console.log("🔄 FORCE Firebase re-initialization...");
    
    // Only clear cache if there are actual issues
    const lastLoginAttempt = localStorage.getItem('lastLoginAttempt');
    const now = Date.now();
    
    if (lastLoginAttempt && (now - parseInt(lastLoginAttempt)) < 10000) { // 10 seconds
        console.log("🧹 Clearing Firebase cache due to recent login issues...");
        
        // Clear all Firebase-related localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('firebase') || key.includes('auth') || key.includes('firestore'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear sessionStorage
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && (key.includes('firebase') || key.includes('auth') || key.includes('firestore'))) {
                sessionKeysToRemove.push(key);
            }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        console.log("🧹 Cleared Firebase cache from localStorage and sessionStorage");
        
        // Force reinitialize
        window.reinitializeFirebase();
    } else {
        console.log("🔄 No recent login issues detected, skipping cache clear");
    }
};

// Check if Firebase is ready for login
window.checkFirebaseReady = function() {
    console.log("🔍 Checking Firebase readiness...");
    console.log("window.auth:", !!window.auth);
    console.log("window.db:", !!window.db);
    console.log("window.firebase:", !!window.firebase);
    console.log("firebase.apps.length:", typeof firebase !== 'undefined' ? firebase.apps.length : 'firebase not loaded');
    
    if (window.auth && window.db && window.firebase && typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        console.log("✅ Firebase is ready for login");
        return true;
    } else {
        console.log("❌ Firebase is not ready for login");
        return false;
    }
};

// Auth State Listener Setup
function setupAuthListener() {
    if (!auth) return;
    
    // Prevent multiple listeners
    if (window.authListenerSetup) {
        console.log('⚠️ Auth listener already setup, skipping...');
        return;
    }
    
    window.authListenerSetup = true;
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('👤 User signed in:', user.email);
            // Set global currentUser for other functions
            window.currentUser = user;
            
            // Update UI - hide landing page when logged in
            setTimeout(() => {
                const landingContent = document.getElementById('landing-content');
                const userInfo = document.getElementById('user-info');
                
                if (landingContent) {
                    landingContent.style.display = 'none';
                    landingContent.style.visibility = 'hidden';
                    console.log('🚫 Landing page HIDDEN (auth listener)');
                }
                if (userInfo) {
                    userInfo.style.display = 'block';
                    userInfo.style.visibility = 'visible';
                    console.log('👤 User info SHOWN (auth listener)');
                }
                
                // Update user display
                if (typeof updateUserDisplay === 'function') {
                    updateUserDisplay();
                }
                
                // Load user profile if function exists
                if (typeof window.loadUserProfile === 'function') {
                    window.loadUserProfile(user.uid);
                }
                
                // Force navigation update for normal users
                if (typeof window.updateNavigationDevStatus === 'function') {
                    window.updateNavigationDevStatus();
                }
                
                // Update navigation for normal users
                if (typeof window.updateUserNavigation === 'function') {
                    window.updateUserNavigation();
                }
                
                // Update ad banner visibility
                if (typeof window.updateAdBannerVisibility === 'function') {
                    window.updateAdBannerVisibility();
                }
                
                console.log('✅ Auth state change - user logged in, navigation updated');
            }, 500);
        } else {
            console.log('👤 User signed out');
            // Clear global currentUser
            window.currentUser = null;
            
            // Show landing page for login after logout
            setTimeout(() => {
                const landingContent = document.getElementById('landing-content');
                const userInfo = document.getElementById('user-info');
                
                if (landingContent) {
                    landingContent.style.display = 'block';
                    landingContent.style.visibility = 'visible';
                    console.log('🌐 Landing page shown after logout (auth listener)');
                }
                if (userInfo) {
                    userInfo.style.display = 'none';
                    userInfo.style.visibility = 'hidden';
                    console.log('👤 User info hidden after logout (auth listener)');
                }
                
                // Force navigation update for logged out users
                if (typeof window.updateNavigationDevStatus === 'function') {
                    window.updateNavigationDevStatus();
                }
                
                // Update user navigation
                if (typeof window.updateUserNavigation === 'function') {
                    window.updateUserNavigation();
                }
                
                // Update ad banner visibility
                if (typeof window.updateAdBannerVisibility === 'function') {
                    window.updateAdBannerVisibility();
                }
                
                console.log('✅ Auth state change - user logged out, navigation updated');
            }, 500);
        }
    });
}

// Load user profile from Firestore
window.loadUserProfile = async function(userId) {
    if (!db || !userId) return;
    
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            window.userProfile = userDoc.data();
            console.log('✅ User profile loaded:', window.userProfile);
            
            // Update UI with user data
            if (typeof window.updateUserDisplay === 'function') {
                window.updateUserDisplay();
            }
        } else {
            console.log('⚠️ No user profile found, creating default...');
            // Create default user profile
            window.userProfile = {
                email: window.currentUser?.email || '',
                coins: 0,
                drops: 0,
                ownedMachines: {},
                lastBonusClaim: null,
                consecutiveDays: 0,
                bonusClaimed: 0,
                withdrawalHistory: [],
                createdAt: new Date().toISOString()
            };
            
            // Save to Firestore
            await db.collection('users').doc(userId).set(window.userProfile);
            console.log('✅ Default user profile created');
        }
    } catch (error) {
        console.error('❌ Error loading user profile:', error);
    }
};

// Firebase Auth Functions
window.login = async function() {
    console.log('🔐 Login function called');
    
    const email = document.getElementById('startseite-auth-email')?.value || document.getElementById('auth-email')?.value;
    const password = document.getElementById('startseite-auth-password')?.value || document.getElementById('auth-password')?.value;
    
    console.log('📧 Email found:', email ? 'Yes' : 'No');
    console.log('🔑 Password found:', password ? 'Yes' : 'No');
    console.log('🔥 Auth object:', auth ? 'Available' : 'Not available');
    
    // Store login attempt timestamp
    localStorage.setItem('lastLoginAttempt', Date.now().toString());
    
    if (!email || !password) {
        console.log('❌ Missing email or password');
        showMessage('❌ Bitte E-Mail und Passwort eingeben', true);
        return;
    }
    
    if (!auth) {
        console.log('❌ Firebase Auth not available');
        showMessage('❌ Firebase Auth nicht verfügbar', true);
        
        // Try to reinitialize Firebase
        console.log('🔄 Attempting to reinitialize Firebase...');
        if (window.initializeFirebase) {
            window.initializeFirebase();
        }
        return;
    }
    
    try {
        showMessage('🔐 Anmeldung läuft...', false);
        console.log('🔄 Attempting login with Firebase...');
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('✅ Login successful:', user.email);
        showMessage('✅ Erfolgreich angemeldet!', false);
        
        // Update UI
        if (typeof window.updateUserDisplay === 'function') {
            window.updateUserDisplay();
        }
        
        // Update landing page display
        if (typeof window.initializeLandingPage === 'function') {
            window.initializeLandingPage();
        }
        
        // Update navigation after successful login - hide landing page
        setTimeout(() => {
            const landingContent = document.getElementById('landing-content');
            const userInfo = document.getElementById('user-info');
            
            if (landingContent) {
                landingContent.style.display = 'none';
                landingContent.style.visibility = 'hidden';
                console.log('🚫 Landing page HIDDEN after login');
            }
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.style.visibility = 'visible';
                console.log('👤 User info SHOWN after login');
            }
            
            // Force navigation update
            if (typeof window.updateNavigationDevStatus === 'function') {
                window.updateNavigationDevStatus();
            }
            
            // Update user navigation
            if (typeof window.updateUserNavigation === 'function') {
                window.updateUserNavigation();
            }
            
            // Update ad banner visibility
            if (typeof window.updateAdBannerVisibility === 'function') {
                window.updateAdBannerVisibility();
            }
            
            console.log('✅ Navigation updated after login');
        }, 500);
        
    } catch (error) {
        console.error('❌ Login error:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        
        let errorMessage = 'Anmeldung fehlgeschlagen';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Benutzer nicht gefunden';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Falsches Passwort';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Ungültige E-Mail';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Zu viele Versuche. Bitte später erneut versuchen';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Netzwerkfehler. Bitte Internetverbindung prüfen';
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Ungültige Anmeldedaten';
        }
        
        showMessage(`❌ ${errorMessage}`, true);
    }
}

window.register = async function() {
    const email = document.getElementById('startseite-auth-email')?.value || document.getElementById('auth-email')?.value;
    const password = document.getElementById('startseite-auth-password')?.value || document.getElementById('auth-password')?.value;
    
    if (!email || !password) {
        showMessage('❌ Bitte E-Mail und Passwort eingeben', true);
        return;
    }
    
    if (password.length < 6) {
        showMessage('❌ Passwort muss mindestens 6 Zeichen haben', true);
        return;
    }
    
    if (!auth) {
        showMessage('❌ Firebase Auth nicht verfügbar', true);
        return;
    }
    
    try {
        showMessage('📝 Registrierung läuft...', false);
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Check for referral code
        const referralCode = localStorage.getItem('referralCode') || '2b2MBGHgaDTcSOaMzepTnGK2JVz1';
        let initialCoins = 100;
        let userProfile = {
            email: email,
            username: email.split('@')[0],
            level: 1,
            coins: initialCoins,
            drops: 0,
            boost: 1.0,
            ownedMachines: {}, // Initialize empty ownedMachines
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Apply referral bonus (always use referral code - either from URL or default)
        userProfile.referredBy = referralCode;
        userProfile.referralBonus = 50;
        userProfile.coins = initialCoins + 50; // Bonus coins
        console.log('🎯 Applying referral bonus for:', referralCode);
        
        // Clear referral code from localStorage (if it was stored)
        localStorage.removeItem('referralCode');
        localStorage.removeItem('referralTimestamp');
        
        // Create user profile
        await db.collection('users').doc(user.uid).set(userProfile);
        
        console.log('✅ Registration successful:', user.email);
        showMessage('✅ Registrierung erfolgreich!', false);
        
        // Update UI
        updateUserDisplay();
        document.getElementById('user-info').style.display = 'block';
        document.querySelector('.bg-gray-700').style.display = 'none';
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        let errorMessage = 'Registrierung fehlgeschlagen';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'E-Mail bereits registriert';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Passwort zu schwach';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Ungültige E-Mail';
        }
        
        showMessage(`❌ ${errorMessage}`, true);
    }
}

window.logout = async function() {
    if (!auth) {
        showMessage('❌ Firebase Auth nicht verfügbar', true);
        return;
    }
    
    try {
        await auth.signOut();
        console.log('✅ Logout successful');
        showMessage('✅ Erfolgreich abgemeldet!', false);
        
        // Show landing page for login after logout
        const landingContent = document.getElementById('landing-content');
        const userInfo = document.getElementById('user-info');
        
        if (landingContent) {
            landingContent.style.display = 'block';
            landingContent.style.visibility = 'visible';
            console.log('🌐 Landing page shown after logout');
        }
        if (userInfo) {
            userInfo.style.display = 'none';
            userInfo.style.visibility = 'hidden';
            console.log('👤 User info hidden after logout');
        }
        
        // Update landing page display
        if (typeof window.initializeLandingPage === 'function') {
            window.initializeLandingPage();
        }
        
        // Clear user data
        document.getElementById('user-email').textContent = '-';
        document.getElementById('user-username').textContent = '-';
        document.getElementById('user-level').textContent = '-';
        document.getElementById('user-coins').textContent = '-';
        document.getElementById('user-drops').textContent = '-';
        document.getElementById('user-boost').textContent = '-';
        
        // Force clear Firebase cache and re-initialize
        setTimeout(() => {
            if (window.forceFirebaseReinit) {
                window.forceFirebaseReinit();
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Logout error:', error);
        showMessage('❌ Abmeldung fehlgeschlagen', true);
    }
}

window.resetPassword = async function() {
    const email = document.getElementById('startseite-auth-email')?.value || document.getElementById('auth-email')?.value;
    
    if (!email) {
        showMessage('❌ Bitte E-Mail eingeben', true);
        return;
    }
    
    if (!auth) {
        showMessage('❌ Firebase Auth nicht verfügbar', true);
        return;
    }
    
    try {
        showMessage('📧 Passwort-Reset E-Mail wird gesendet...', false);
        await auth.sendPasswordResetEmail(email);
        showMessage('✅ Passwort-Reset E-Mail gesendet!', false);
    } catch (error) {
        console.error('❌ Password reset error:', error);
        let errorMessage = 'Passwort-Reset fehlgeschlagen';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'E-Mail nicht gefunden';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Ungültige E-Mail';
        }
        
        showMessage(`❌ ${errorMessage}`, true);
    }
}

// User Display Functions
window.updateUserDisplay = async function() {
    if (!auth || !auth.currentUser) {
        console.log('❌ updateUserDisplay: No auth or currentUser');
        return;
    }
    
    console.log('🔄 updateUserDisplay: Updating user display for:', auth.currentUser.email);
    
    try {
        const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('📊 User data loaded:', userData);
            
            const userEmail = document.getElementById('user-email');
            const userUsername = document.getElementById('user-username');
            const userLevel = document.getElementById('user-level');
            const userCoins = document.getElementById('user-coins');
            const userDrops = document.getElementById('user-drops');
            const userBoost = document.getElementById('user-boost');
            
            console.log('🔍 User elements found:', {
                userEmail: !!userEmail,
                userUsername: !!userUsername,
                userLevel: !!userLevel,
                userCoins: !!userCoins,
                userDrops: !!userDrops,
                userBoost: !!userBoost
            });
            
            if (userEmail) userEmail.textContent = userData.email || auth.currentUser.email || '-';
            if (userUsername) userUsername.textContent = userData.username || '-';
            if (userLevel) userLevel.textContent = userData.level || '1';
            if (userCoins) userCoins.textContent = userData.coins || '0';
            if (userDrops) userDrops.textContent = userData.drops || '0';
            if (userBoost) userBoost.textContent = userData.boost || '0';
            
            console.log('✅ User display updated successfully');
            
            // Update GeoBoard stats if they exist
            const statsUsername = document.getElementById('stats-username');
            const statsCoins = document.getElementById('stats-coins');
            const statsDrops = document.getElementById('stats-drops');
            const statsBoost = document.getElementById('stats-boost');
            
            if (statsUsername) statsUsername.textContent = userData.username || '-';
            if (statsCoins) statsCoins.textContent = userData.coins || '0';
            if (statsDrops) statsDrops.textContent = userData.drops || '0';
            if (statsBoost) statsBoost.textContent = (userData.boost || '1.0') + 'x';
            
            // Ensure ownedMachines exists for mining functions
            if (!userData.ownedMachines) {
                userData.ownedMachines = {};
                // Update database with ownedMachines field
                try {
                    await db.collection('users').doc(auth.currentUser.uid).update({
                        ownedMachines: {}
                    });
                } catch (error) {
                    console.error('❌ Error updating ownedMachines:', error);
                }
            }
            
            // Ensure today's activity fields exist
            if (userData.todayDrops === undefined) {
                userData.todayDrops = 0;
            }
            if (userData.todayCoins === undefined) {
                userData.todayCoins = 0;
            }
            
            // Set global userProfile for mining functions
            window.userProfile = userData;
            
            // Update mining stats if function is available
            if (typeof window.updateMiningStats === 'function') {
                window.updateMiningStats();
            }
            
            // Reload mining machines to show owned count
            if (typeof window.loadMiningMachines === 'function') {
                window.loadMiningMachines();
            }
        } else {
            // User document doesn't exist, create it with default values
            await db.collection('users').doc(auth.currentUser.uid).set({
                email: auth.currentUser.email,
                username: auth.currentUser.email.split('@')[0],
                level: 1,
                coins: 100,
                drops: 0,
                boost: 1.0,
                ownedMachines: {}, // Initialize empty ownedMachines
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update display with default values
            document.getElementById('user-email').textContent = auth.currentUser.email || '-';
            document.getElementById('user-username').textContent = auth.currentUser.email.split('@')[0] || '-';
            document.getElementById('user-level').textContent = '1';
            document.getElementById('user-coins').textContent = '100';
            document.getElementById('user-drops').textContent = '0';
            document.getElementById('user-boost').textContent = '1.0';
            
            // Set global userProfile for mining functions with default values
            window.userProfile = {
                email: auth.currentUser.email,
                username: auth.currentUser.email.split('@')[0],
                level: 1,
                coins: 100,
                drops: 0,
                boost: 1.0,
                ownedMachines: {}, // Initialize empty ownedMachines
                todayDrops: 0, // Initialize today's drops
                todayCoins: 0 // Initialize today's coins
            };
            
            // Update mining stats if function is available
            if (typeof window.updateMiningStats === 'function') {
                window.updateMiningStats();
            }
            
            // Reload mining machines to show owned count
            if (typeof window.loadMiningMachines === 'function') {
                window.loadMiningMachines();
            }
        }
    } catch (error) {
        console.error('❌ Error updating user display:', error);
    }
};

// Update user profile in Firebase
window.updateUserProfile = async function() {
    if (!auth || !auth.currentUser || !window.userProfile) return;
    
    try {
        await db.collection('users').doc(auth.currentUser.uid).set(window.userProfile, { merge: true });
        console.log('✅ User profile updated in Firebase');
    } catch (error) {
        console.error('❌ Error updating user profile:', error);
    }
};

