// Bonus Functions for GeoDrop App
console.log('🎁 bonus-functions.js loaded successfully!');

// Main bonus claim function (from backup)
window.claimBonus = async function() {
    console.log('🎁 claimBonus called');
    console.log('🔍 currentUser:', window.currentUser);
    console.log('🔍 userProfile:', window.userProfile);
    
    if (!window.currentUser || !window.userProfile) {
        alert('❌ Bitte zuerst anmelden!\n\nDebug Info:\n- currentUser: ' + (window.currentUser ? '✅' : '❌') + '\n- userProfile: ' + (window.userProfile ? '✅' : '❌'));
        return;
    }
    
    try {
        const today = new Date().toDateString();
        const lastBonusClaim = window.userProfile.lastBonusClaim;
        
        if (lastBonusClaim === today) {
            alert('❌ Bonus bereits heute abgeholt!');
            return;
        }
        
        // Fixed bonus amount (50 PixelDrops as in backup)
        const bonusAmount = 50;
        
        // Update user profile
        window.userProfile.coins = (window.userProfile.coins || 0) + bonusAmount;
        window.userProfile.lastBonusClaim = today;
        window.userProfile.consecutiveDays = (window.userProfile.consecutiveDays || 0) + 1;
        window.userProfile.bonusClaimed = (window.userProfile.bonusClaimed || 0) + bonusAmount;
        
        // Add to bonus history
        if (!window.userProfile.bonusHistory) {
            window.userProfile.bonusHistory = [];
        }
        window.userProfile.bonusHistory.push({
            date: new Date().toISOString(),
            amount: bonusAmount,
            type: 'daily'
        });
        
        // Update Firebase
        await window.updateUserProfile();
        
        // Update UI
        if (typeof window.updateUserDisplay === 'function') {
            window.updateUserDisplay();
        }
        
        // Update bonus display
        window.updateBonusDisplay();
        
        // Update statistics if function exists
        if (typeof window.updateAllStatistics === 'function') {
            window.updateAllStatistics();
        }
        
        // Show success message (as in backup)
        showMessage(`🎉 Bonus erfolgreich abgeholt! +${bonusAmount} PixelDrops`, false);
        
        // Create bonus effects (as in backup)
        createBonusEffects();
        
    } catch (error) {
        console.error('❌ Error claiming bonus:', error);
        alert('❌ Fehler beim Abholen des Bonus!');
    }
};

// Daily bonus system (alias for compatibility)
window.claimDailyBonus = window.claimBonus;

// Check if daily bonus is available
window.checkDailyBonus = function() {
    if (!window.userProfile) {
        console.log('⚠️ No userProfile available for bonus check');
        return false;
    }
    
    const today = new Date().toDateString();
    const lastBonusClaim = window.userProfile.lastBonusClaim;
    
    console.log('🎁 Bonus check - Today:', today, 'Last claim:', lastBonusClaim);
    
    return lastBonusClaim !== today;
};

// Weekly bonus system
window.claimWeeklyBonus = async function() {
    if (!window.currentUser || !window.userProfile) {
        alert('❌ Bitte zuerst anmelden!');
        return;
    }
    
    try {
        const thisWeek = getWeekNumber(new Date());
        const lastWeeklyBonus = window.userProfile.lastWeeklyBonus;
        
        if (lastWeeklyBonus === thisWeek) {
            alert('❌ Wöchentlicher Bonus bereits diese Woche abgeholt!');
            return;
        }
        
        const bonusAmount = 1000; // Fixed weekly bonus
        
        // Update user profile
        window.userProfile.coins = (window.userProfile.coins || 0) + bonusAmount;
        window.userProfile.lastWeeklyBonus = thisWeek;
        window.userProfile.bonusClaimed = (window.userProfile.bonusClaimed || 0) + bonusAmount;
        
        // Update Firebase
        await window.updateUserProfile();
        
        // Update UI
        if (typeof window.updateUserDisplay === 'function') {
            window.updateUserDisplay();
        }
        
        alert(`✅ Wöchentlicher Bonus abgeholt!\n\n+${bonusAmount} PixelDrop`);
        
    } catch (error) {
        console.error('❌ Error claiming weekly bonus:', error);
        alert('❌ Fehler beim Abholen des wöchentlichen Bonus!');
    }
};

// Monthly bonus system
window.claimMonthlyBonus = async function() {
    if (!window.currentUser || !window.userProfile) {
        alert('❌ Bitte zuerst anmelden!');
        return;
    }
    
    try {
        const thisMonth = new Date().getMonth() + '-' + new Date().getFullYear();
        const lastMonthlyBonus = window.userProfile.lastMonthlyBonus;
        
        if (lastMonthlyBonus === thisMonth) {
            alert('❌ Monatlicher Bonus bereits diesen Monat abgeholt!');
            return;
        }
        
        const bonusAmount = 5000; // Fixed monthly bonus
        
        // Update user profile
        window.userProfile.coins = (window.userProfile.coins || 0) + bonusAmount;
        window.userProfile.lastMonthlyBonus = thisMonth;
        window.userProfile.bonusClaimed = (window.userProfile.bonusClaimed || 0) + bonusAmount;
        
        // Update Firebase
        await window.updateUserProfile();
        
        // Update UI
        if (typeof window.updateUserDisplay === 'function') {
            window.updateUserDisplay();
        }
        
        alert(`✅ Monatlicher Bonus abgeholt!\n\n+${bonusAmount} PixelDrop`);
        
    } catch (error) {
        console.error('❌ Error claiming monthly bonus:', error);
        alert('❌ Fehler beim Abholen des monatlichen Bonus!');
    }
};

// Helper function to get week number
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Update bonus display (from backup)
window.updateBonusDisplay = function() {
    console.log('🎁 updateBonusDisplay called');
    console.log('🔍 userProfile:', window.userProfile);
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        console.log('🎁 DOM ready, checking elements...');
        
        // Always try to show bonus available first
        const bonusAvailable = document.getElementById('bonus-available');
        const bonusClaimed = document.getElementById('bonus-claimed');
        
        console.log('🔍 bonusAvailable element:', bonusAvailable);
        console.log('🔍 bonusClaimed element:', bonusClaimed);
        
        if (!bonusAvailable || !bonusClaimed) {
            console.log('❌ Bonus elements not found!');
            console.log('🔍 Available elements:', document.querySelectorAll('[id*="bonus"]'));
            console.log('🔍 All elements with "bonus" in ID:', document.querySelectorAll('[id*="bonus"]'));
            return;
        }
        
        if (!window.userProfile) {
            console.log('⚠️ No userProfile available - showing bonus claimed by default');
            bonusAvailable.style.display = 'none';
            bonusClaimed.style.display = 'block';
            console.log('✅ Showing bonus claimed (no user profile)');
            return;
        }
        
        console.log('🎁 Updating bonus display with user profile...');
        
        const today = new Date().toDateString();
        const lastBonusClaim = window.userProfile.lastBonusClaim;
        const isAvailable = lastBonusClaim !== today;
        
        console.log('🔍 isAvailable:', isAvailable);
        console.log('🔍 today:', today);
        console.log('🔍 lastBonusClaim:', lastBonusClaim);
        
        // Show correct bonus status based on availability
        if (isAvailable) {
            // Bonus is available - show claim button
            bonusAvailable.style.display = 'block';
            bonusClaimed.style.display = 'none';
            console.log('✅ Showing bonus available - can claim!');
        } else {
            // Bonus already claimed today - show claimed status
            bonusAvailable.style.display = 'none';
            bonusClaimed.style.display = 'block';
            console.log('✅ Showing bonus claimed - already claimed today');
        }
        
        // Update countdown timer
        updateCountdownTimer();
        
        // Update bonus history
        updateBonusHistory();
        
        console.log('✅ Bonus display updated');
    }, 1000);
};

// Update countdown timer
function updateCountdownTimer() {
    const countdownTimer = document.getElementById('countdown-timer');
    if (!countdownTimer) return;
    
    function updateTimer() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        countdownTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Update bonus history with special effects
function updateBonusHistory() {
    const bonusHistoryList = document.getElementById('bonus-history-list');
    if (!bonusHistoryList || !window.userProfile) return;
    
    const bonusHistory = window.userProfile.bonusHistory || [];
    
    if (bonusHistory.length === 0) {
        bonusHistoryList.innerHTML = `
            <div class="text-center text-gray-400 py-8">
                <div class="text-6xl mb-4 animate-pulse">📊</div>
                <p class="text-lg">Noch keine Bonus-Historie</p>
                <p class="text-sm text-gray-500 mt-2">Hole dir deinen ersten Bonus ab!</p>
            </div>
        `;
        return;
    }
    
    let historyHTML = '';
    bonusHistory.slice(-10).reverse().forEach((entry, index) => {
        const date = new Date(entry.date).toLocaleDateString('de-DE');
        const time = new Date(entry.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        
        // Different colors for different days
        const colors = [
            'from-green-600 to-emerald-600',
            'from-blue-600 to-cyan-600', 
            'from-purple-600 to-pink-600',
            'from-yellow-600 to-orange-600',
            'from-red-600 to-pink-600'
        ];
        const colorClass = colors[index % colors.length];
        
        historyHTML += `
            <div class="bg-gradient-to-r ${colorClass} rounded-lg p-4 flex justify-between items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in">
                <div class="flex items-center space-x-3">
                    <div class="text-2xl animate-bounce">🎁</div>
                    <div>
                        <span class="text-white font-bold text-lg">${date}</span>
                        <span class="text-white ml-2 text-sm">${time}</span>
                        <div class="text-white font-semibold">+${entry.amount} PixelDrops</div>
                    </div>
                </div>
                <div class="text-white text-3xl animate-pulse">
                    ✨
                </div>
            </div>
        `;
    });
    
    bonusHistoryList.innerHTML = historyHTML;
}


// Create bonus effects - EXACT BACKUP IMPLEMENTATION
function createBonusEffects() {
    console.log('🎁 Creating bonus effects...');
    
    // Create floating gift element (EXACT BACKUP - from center of screen)
    const giftElement = document.createElement('div');
    giftElement.className = 'floating-element';
    giftElement.innerHTML = '🎁';
    document.body.appendChild(giftElement);
    
    // Create bonus particles (EXACT BACKUP - from random positions)
    const emojis = ['💰', '✨', '⭐', '💎', '🎯', '🏆', '💫', '🌟'];
    
    emojis.forEach((emoji, index) => {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'bonus-particle';
            particle.innerHTML = emoji;
            
            // Random position across screen (EXACT BACKUP)
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            
            document.body.appendChild(particle);
            
            // Remove particle after animation (EXACT BACKUP - 2s)
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }, 2000);
        }, index * 100);
    });
    
    // Remove gift element after animation (EXACT BACKUP - 1.5s)
    setTimeout(() => {
        if (document.body.contains(giftElement)) {
            document.body.removeChild(giftElement);
        }
    }, 1500);
}

// Test function for bonus effects
window.testBonusEffect = function() {
    console.log('🧪 Testing bonus effect...');
    createBonusEffects();
};

// Debug function to show bonus status
window.debugBonusStatus = function() {
    console.log('🔍 Debugging bonus status...');
    console.log('🔍 userProfile:', window.userProfile);
    
    if (window.userProfile) {
        const today = new Date().toDateString();
        const lastBonusClaim = window.userProfile.lastBonusClaim;
        const isAvailable = lastBonusClaim !== today;
        
        console.log('🔍 Today:', today);
        console.log('🔍 Last bonus claim:', lastBonusClaim);
        console.log('🔍 Is bonus available:', isAvailable);
        
        alert(`🎁 Bonus Status Debug:\n\n` +
              `Heute: ${today}\n` +
              `Letzter Claim: ${lastBonusClaim}\n` +
              `Verfügbar: ${isAvailable ? '✅ JA' : '❌ NEIN'}\n\n` +
              `Bonus sollte ${isAvailable ? 'verfügbar' : 'bereits geclaimt'} sein.`);
    } else {
        alert('❌ Kein User-Profil gefunden!');
    }
};

// Test function to check bonus system
window.testBonusSystem = function() {
    console.log('🧪 Testing Bonus System...');
    console.log('🔍 claimBonus function:', typeof window.claimBonus);
    console.log('🔍 updateBonusDisplay function:', typeof window.updateBonusDisplay);
    console.log('🔍 checkDailyBonus function:', typeof window.checkDailyBonus);
    console.log('🔍 currentUser:', window.currentUser);
    console.log('🔍 userProfile:', window.userProfile);
    
    // Test if HTML elements exist
    const bonusAvailable = document.getElementById('bonus-available');
    const bonusClaimed = document.getElementById('bonus-claimed');
    console.log('🔍 bonus-available element:', bonusAvailable);
    console.log('🔍 bonus-claimed element:', bonusClaimed);
    
    alert('🧪 Bonus System Test:\n\n' +
          'Functions loaded: ' + (typeof window.claimBonus === 'function' ? '✅' : '❌') + '\n' +
          'User logged in: ' + (window.currentUser ? '✅' : '❌') + '\n' +
          'Profile loaded: ' + (window.userProfile ? '✅' : '❌') + '\n' +
          'HTML elements: ' + (bonusAvailable && bonusClaimed ? '✅' : '❌'));
};

// Force show bonus button
window.forceShowBonusButton = function() {
    console.log('🔧 Force showing bonus button...');
    
    const bonusAvailable = document.getElementById('bonus-available');
    const bonusClaimed = document.getElementById('bonus-claimed');
    
    console.log('🔍 bonusAvailable:', bonusAvailable);
    console.log('🔍 bonusClaimed:', bonusClaimed);
    
    if (bonusAvailable && bonusClaimed) {
        bonusAvailable.style.display = 'block';
        bonusClaimed.style.display = 'none';
        console.log('✅ Bonus button forced to show');
        alert('✅ Bonus Button wurde angezeigt!');
    } else {
        console.log('❌ Bonus elements not found');
        console.log('🔍 All elements:', document.querySelectorAll('*'));
        console.log('🔍 Elements with "bonus" in ID:', document.querySelectorAll('[id*="bonus"]'));
        alert('❌ Bonus-Elemente nicht gefunden!');
    }
};

// Debug function to check all elements
window.debugBonusElements = function() {
    console.log('🔍 Debugging bonus elements...');
    console.log('🔍 All elements with "bonus" in ID:', document.querySelectorAll('[id*="bonus"]'));
    console.log('🔍 All elements with "bonus" in class:', document.querySelectorAll('[class*="bonus"]'));
    console.log('🔍 Document body:', document.body);
    console.log('🔍 Current page content:', document.body.innerHTML.substring(0, 1000));
};

// REMOVED: Reset bonus function - prevents cheating!
// Bonus resets automatically at 6:00 AM daily

// Manual referral code override function
window.setReferralCode = function(code) {
    if (!code || code.trim() === '') {
        console.log('❌ Invalid referral code provided');
        return false;
    }
    
    console.log('🔧 Manually setting referral code to:', code);
    localStorage.setItem('referralCode', code.trim());
    localStorage.setItem('referralTimestamp', Date.now().toString());
    
    // Auto-fill referral field if it exists
    const referralField = document.getElementById('reg-referral');
    if (referralField) {
        referralField.value = code.trim();
        console.log('🎯 Auto-filled referral field with:', code.trim());
    }
    
    // Show success message
    if (typeof showMessage === 'function') {
        showMessage(`✅ Referral-Code auf "${code.trim()}" gesetzt!`, false);
    }
    
    return true;
};

// Set GeoDrop#420 as direct referral
window.setGeoDrop420AsReferral = async function() {
    if (!window.currentUser || !window.db) {
        console.log('❌ User not logged in or Firebase not available');
        return;
    }
    
    try {
        // Find GeoDrop#420 user
        const usersSnapshot = await window.db.collection('users').get();
        let geodrop420UserId = null;
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const username = userData.username || userData.email || doc.id;
            
            if (username.includes('GeoDrop#420') || username.includes('geodrop#420')) {
                geodrop420UserId = doc.id;
                console.log(`✅ Found GeoDrop#420: ${doc.id} (${username})`);
            }
        });
        
        if (!geodrop420UserId) {
            console.log('❌ GeoDrop#420 not found');
            return;
        }
        
        // Update current user's referral
        await window.db.collection('users').doc(window.currentUser.uid).update({
            referredBy: geodrop420UserId,
            referralBonus: 50,
            referralLevel: 1,
            coins: (window.userProfile?.coins || 0) + 50
        });
        
        // Update local profile
        if (window.userProfile) {
            window.userProfile.referredBy = geodrop420UserId;
            window.userProfile.referralBonus = 50;
            window.userProfile.referralLevel = 1;
            window.userProfile.coins = (window.userProfile.coins || 0) + 50;
        }
        
        console.log('✅ GeoDrop#420 set as direct referral');
        
        // Show success message
        if (typeof showMessage === 'function') {
            showMessage('✅ GeoDrop#420 wurde als dein direkter Referral gesetzt! +50 PixelDrop Bonus!', false);
        }
        
        // Update UI
        if (typeof window.updateUserDisplay === 'function') {
            window.updateUserDisplay();
        }
        
    } catch (error) {
        console.error('❌ Error setting GeoDrop#420 as referral:', error);
    }
};

// Get current referral code function
window.getCurrentReferralCode = function() {
    const storedCode = localStorage.getItem('referralCode');
    const defaultCode = '2b2MBGHgaDTcSOaMzepTnGK2JVz1';
    return storedCode || defaultCode;
};

// Reset referral code to default
window.resetReferralCode = function() {
    console.log('🔄 Resetting referral code to default');
    localStorage.removeItem('referralCode');
    localStorage.removeItem('referralTimestamp');
    
    // Auto-fill referral field with default if it exists
    const referralField = document.getElementById('reg-referral');
    if (referralField) {
        referralField.value = '2b2MBGHgaDTcSOaMzepTnGK2JVz1';
        console.log('🎯 Reset referral field to default');
    }
    
    // Show success message
    if (typeof showMessage === 'function') {
        showMessage('✅ Referral-Code auf Standard zurückgesetzt!', false);
    }
};

// Function to show referral notification with username
async function showReferralNotification(referralId, isLoggedIn) {
    try {
        // Try to get username from referral ID
        let displayName = referralId; // Fallback to ID
        
        if (window.firebase && window.firebase.firestore) {
            const db = window.firebase.firestore();
            
            // Try to find user by UID first
            const userDoc = await db.collection('users').doc(referralId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                displayName = userData.username || userData.email || referralId;
            } else {
                // Try to find user by username or email
                const userQuery = await db.collection('users')
                    .where('username', '==', referralId)
                    .limit(1)
                    .get();
                
                if (!userQuery.empty) {
                    const userData = userQuery.docs[0].data();
                    displayName = userData.username || userData.email || referralId;
                } else {
                    // Try by email
                    const emailQuery = await db.collection('users')
                        .where('email', '==', referralId)
                        .limit(1)
                        .get();
                    
                    if (!emailQuery.empty) {
                        const userData = emailQuery.docs[0].data();
                        displayName = userData.username || userData.email || referralId;
                    }
                }
            }
        }
        
        // Show notification with username
        if (typeof showMessage === 'function') {
            if (isLoggedIn) {
                showMessage(`🎉 Referral-Code von ${displayName} wurde zu deinem Account hinzugefügt!`, false);
            } else {
                showMessage(`🎉 Du wurdest von ${displayName} eingeladen! Du erhältst einen Bonus bei der Registrierung!`, false);
            }
        } else {
            if (isLoggedIn) {
                alert(`🎉 Referral-Code von ${displayName} wurde zu deinem Account hinzugefügt!`);
            } else {
                alert(`🎉 Du wurdest von ${displayName} eingeladen! Du erhältst einen Bonus bei der Registrierung!`);
            }
        }
    } catch (error) {
        console.error('❌ Error getting referral username:', error);
        // Fallback to showing ID
        if (typeof showMessage === 'function') {
            if (isLoggedIn) {
                showMessage(`🎉 Referral-Code von ${referralId} wurde zu deinem Account hinzugefügt!`, false);
            } else {
                showMessage(`🎉 Du wurdest von ${referralId} eingeladen! Du erhältst einen Bonus bei der Registrierung!`, false);
            }
        } else {
            if (isLoggedIn) {
                alert(`🎉 Referral-Code von ${referralId} wurde zu deinem Account hinzugefügt!`);
            } else {
                alert(`🎉 Du wurdest von ${referralId} eingeladen! Du erhältst einen Bonus bei der Registrierung!`);
            }
        }
    }
}

// Referral system functions
window.processReferralLink = function() {
    console.log('🔗 Processing referral link...');
    
    // Check URL for referral parameters
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref') || urlParams.get('referral');
    
    // Also check for /ref/ in path
    const pathMatch = window.location.pathname.match(/\/ref\/([^\/]+)/);
    const pathRefCode = pathMatch ? pathMatch[1] : null;
    
    // Check for /ref/ in hash (for SPA routing)
    const hashMatch = window.location.hash.match(/\/ref\/([^\/]+)/);
    const hashRefCode = hashMatch ? hashMatch[1] : null;
    
    const finalRefCode = refCode || pathRefCode || hashRefCode;
    
    if (finalRefCode) {
        console.log('🎯 Referral code found:', finalRefCode);
        
        // Check if user is already logged in
        const isLoggedIn = window.userProfile && window.userProfile.username;
        
        if (isLoggedIn) {
            // User is already logged in - apply referral to existing account
            console.log('👤 User already logged in, applying referral to existing account');
            window.applyReferralToExistingAccount(finalRefCode);
        } else {
            // User is not logged in - store for later use during registration
            console.log('👤 User not logged in, storing referral for registration');
            localStorage.setItem('referralCode', finalRefCode);
            localStorage.setItem('referralTimestamp', Date.now().toString());
            
            // Auto-fill referral field if it exists
            const referralField = document.getElementById('reg-referral');
            if (referralField) {
                referralField.value = finalRefCode;
                console.log('🎯 Auto-filled referral field with:', finalRefCode);
            }
        }
        
        // Show referral notification with username
        showReferralNotification(finalRefCode, isLoggedIn);
        
        // Clean URL (remove referral parameters)
        if (refCode) {
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete('ref');
            newUrl.searchParams.delete('referral');
            window.history.replaceState({}, '', newUrl);
        }
        
        return finalRefCode;
    } else {
        // No referral code found - use default referral (KryptoGuru) only for new users
        console.log('🎯 No referral code found, using default referral: KryptoGuru');
        const defaultRefCode = '2b2MBGHgaDTcSOaMzepTnGK2JVz1';
        
        // Check if user is already logged in
        const isLoggedIn = window.userProfile && window.userProfile.username;
        
        if (!isLoggedIn) {
            // User is not logged in - store default referral for later use during registration
            console.log('👤 User not logged in, storing default referral for registration');
            localStorage.setItem('referralCode', defaultRefCode);
            localStorage.setItem('referralTimestamp', Date.now().toString());
            
            // Auto-fill referral field with default if it exists
            const referralField = document.getElementById('reg-referral');
            if (referralField) {
                referralField.value = defaultRefCode;
                console.log('🎯 Auto-filled referral field with default:', defaultRefCode);
            }
        }
        
        return defaultRefCode;
    }
};

// Debug function to check referral data
window.debugReferralData = async function() {
    console.log('🔍 Debugging referral data...');
    
    if (!window.db || !window.firebase) {
        console.error('❌ Firebase not available');
        alert('❌ Firebase nicht verfügbar');
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        const currentUser = window.currentUser || window.auth?.currentUser;
        
        if (!currentUser) {
            alert('❌ Kein User angemeldet');
            return;
        }
        
        console.log('👤 Current user:', currentUser.uid, currentUser.email);
        
        // Get all users to see what referral data exists
        const allUsersSnapshot = await db.collection('users').get();
        console.log(`📊 Found ${allUsersSnapshot.size} total users`);
        
        let referralData = [];
        allUsersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.referredBy) {
                referralData.push({
                    id: doc.id,
                    email: userData.email,
                    username: userData.username,
                    referredBy: userData.referredBy,
                    referralEarnings: userData.referralEarnings || 0
                });
            }
        });
        
        console.log('🎯 Users with referrals:', referralData);
        
        // Check for specific users
        const geodrop420 = referralData.find(u => u.username?.includes('GeoDrop#420') || u.email?.includes('GeoDrop#420'));
        const nikolausmos = referralData.find(u => u.username?.includes('nikolausmos') || u.email?.includes('nikolausmos'));
        
        console.log('🎯 GeoDrop#420:', geodrop420);
        console.log('🎯 nikolausmos:', nikolausmos);
        
        alert(`🔍 Referral Debug:\n\n- ${allUsersSnapshot.size} total users\n- ${referralData.length} users with referrals\n- GeoDrop#420: ${geodrop420 ? 'Found' : 'Not found'}\n- nikolausmos: ${nikolausmos ? 'Found' : 'Not found'}\n\nCheck console for details.`);
        
    } catch (error) {
        console.error('❌ Error debugging referral data:', error);
        alert('❌ Fehler beim Debuggen: ' + error.message);
    }
};

// Add specific users to referral lines
window.addSpecificUsersToReferralLines = async function() {
    console.log('🎯 Adding specific users to referral lines...');
    
    if (!window.db || !window.firebase) {
        console.error('❌ Firebase not available');
        alert('❌ Firebase nicht verfügbar');
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        const kryptoGuruRefCode = '2b2MBGHgaDTcSOaMzepTnGK2JVz1';
        
        // Get all users to find the specific ones
        const usersSnapshot = await db.collection('users').get();
        console.log(`📊 Found ${usersSnapshot.size} users to search through`);
        
        let geodrop420Found = false;
        let nikolausmosFound = false;
        let geodrop420UserId = null;
        
        // First, find the users
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const username = userData.username || userData.email || doc.id;
            
            if (username.includes('GeoDrop#420') || username.includes('geodrop#420')) {
                geodrop420Found = true;
                geodrop420UserId = doc.id;
                console.log(`✅ Found GeoDrop#420: ${doc.id} (${username})`);
            }
            
            if (username.includes('nikolausmos')) {
                nikolausmosFound = true;
                console.log(`✅ Found nikolausmos: ${doc.id} (${username})`);
            }
        });
        
        if (!geodrop420Found) {
            alert('❌ GeoDrop#420 nicht gefunden!');
            return;
        }
        
        if (!nikolausmosFound) {
            alert('❌ nikolausmos nicht gefunden!');
            return;
        }
        
        const batch = db.batch();
        let updatedCount = 0;
        
        // Add GeoDrop#420 to KryptoGuru's referral line
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const username = userData.username || userData.email || doc.id;
            
            if (username.includes('GeoDrop#420') || username.includes('geodrop#420')) {
                batch.update(doc.ref, {
                    referredBy: kryptoGuruRefCode,
                    referralBonus: 50,
                    coins: (userData.coins || 0) + 50,
                    lastReferralUpdate: window.firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log(`✅ Adding GeoDrop#420 to KryptoGuru referral line`);
                updatedCount++;
            }
        });
        
        // Add nikolausmos to GeoDrop#420's referral line (FIRST LINE RESTORED)
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const username = userData.username || userData.email || doc.id;
            
            if (username.includes('nikolausmos')) {
                batch.update(doc.ref, {
                    referredBy: geodrop420UserId,
                    referralBonus: 50,
                    coins: (userData.coins || 0) + 50,
                    lastReferralUpdate: window.firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log(`✅ Adding nikolausmos to GeoDrop#420 referral line (FIRST LINE RESTORED)`);
                updatedCount++;
            }
        });
        
        if (updatedCount > 0) {
            await batch.commit();
            console.log(`✅ Successfully added ${updatedCount} users to referral lines`);
            
            // Update referral statistics if available
            if (typeof window.loadReferralsData === 'function') {
                setTimeout(() => {
                    window.loadReferralsData();
                }, 1000);
            }
            
            alert(`✅ Erfolgreich ${updatedCount} User zu Referral-Linien hinzugefügt!\n\n- GeoDrop#420 → KryptoGuru Referral-Linie\n- nikolausmos → GeoDrop#420 Referral-Linie\n- Jeder User erhielt 50 PixelDrop Bonus\n\n💰 Referral-System:\n- 5% von GeoDrop#420's Käufen → KryptoGuru\n- 5% von nikolausmos's Käufen → GeoDrop#420\n- 1% von nikolausmos's Käufen → KryptoGuru (indirekt)\n\n📊 Referral-Statistiken werden aktualisiert...`);
        } else {
            alert('❌ Keine User aktualisiert');
        }
        
    } catch (error) {
        console.error('❌ Error adding users to referral lines:', error);
        alert('❌ Fehler beim Hinzufügen der User zu Referral-Linien: ' + error.message);
    }
};

// Process referral rewards for purchases (machines, coins, etc.)
window.processReferralRewards = async function(amount, purchaseType) {
    console.log('💰 Processing referral rewards for purchase:', amount, purchaseType);
    
    if (!window.userProfile || !window.db || !window.currentUser) {
        console.log('❌ Cannot process referral rewards - missing user data');
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        const currentUserId = window.currentUser.uid;
        const referredBy = window.userProfile.referredBy;
        
        if (!referredBy) {
            console.log('ℹ️ User has no referrer, skipping referral rewards');
            return;
        }
        
        console.log('🎯 User referred by:', referredBy);
        
        // Calculate 5% for direct referrer
        const directReward = amount * 0.05;
        
        // Find direct referrer
        const directReferrerSnapshot = await db.collection('users')
            .where('email', '==', referredBy)
            .or(db.collection('users').where('username', '==', referredBy))
            .get();
        
        if (!directReferrerSnapshot.empty) {
            const directReferrerDoc = directReferrerSnapshot.docs[0];
            const directReferrerData = directReferrerDoc.data();
            
            // Add reward to direct referrer
            await directReferrerDoc.ref.update({
                referralEarnings: (directReferrerData.referralEarnings || 0) + directReward,
                coins: (directReferrerData.coins || 0) + directReward,
                lastReferralReward: window.firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log(`✅ Added ${directReward} tBNB to direct referrer: ${referredBy}`);
            
            // Check if direct referrer has a referrer (for 1% indirect reward)
            const directReferrerReferredBy = directReferrerData.referredBy;
            if (directReferrerReferredBy) {
                const indirectReward = amount * 0.01;
                
                // Find indirect referrer
                const indirectReferrerSnapshot = await db.collection('users')
                    .where('email', '==', directReferrerReferredBy)
                    .or(db.collection('users').where('username', '==', directReferrerReferredBy))
                    .get();
                
                if (!indirectReferrerSnapshot.empty) {
                    const indirectReferrerDoc = indirectReferrerSnapshot.docs[0];
                    const indirectReferrerData = indirectReferrerDoc.data();
                    
                    // Add 1% reward to indirect referrer
                    await indirectReferrerDoc.ref.update({
                        referralEarnings: (indirectReferrerData.referralEarnings || 0) + indirectReward,
                        coins: (indirectReferrerData.coins || 0) + indirectReward,
                        lastReferralReward: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    console.log(`✅ Added ${indirectReward} tBNB to indirect referrer: ${directReferrerReferredBy}`);
                }
            }
        }
        
        // Log the referral reward transaction
        await db.collection('referralTransactions').add({
            buyerId: currentUserId,
            buyerEmail: window.userProfile.email,
            referredBy: referredBy,
            amount: amount,
            directReward: directReward,
            indirectReward: directReferrerReferredBy ? amount * 0.01 : 0,
            purchaseType: purchaseType,
            timestamp: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Referral rewards processed successfully');
        
    } catch (error) {
        console.error('❌ Error processing referral rewards:', error);
    }
};

// Apply referral to existing logged-in account
window.applyReferralToExistingAccount = async function(referralCode) {
    if (!window.userProfile || !window.db || !window.currentUser) {
        console.log('❌ Cannot apply referral - missing user data');
        return;
    }
    
    try {
        // Check if user already has a referral
        if (window.userProfile.referredBy) {
            console.log('⚠️ User already has a referral:', window.userProfile.referredBy);
            if (typeof showMessage === 'function') {
                showMessage('⚠️ Du hast bereits einen Referral-Code!', true);
            }
            return;
        }
        
        // Add referral to user profile
        window.userProfile.referredBy = referralCode;
        window.userProfile.referralBonus = 50; // Give 50 coins bonus
        window.userProfile.referralLevel = 1; // Direct referral
        
        // Update Firebase
        await window.db.collection('users').doc(window.currentUser.uid).update({
            referredBy: referralCode,
            referralBonus: 50,
            referralLevel: 1,
            coins: (window.userProfile.coins || 0) + 50
        });
        
        // Update local profile
        window.userProfile.coins = (window.userProfile.coins || 0) + 50;
        
        console.log('✅ Referral applied to existing account:', referralCode);
        
        // Update UI
        if (typeof window.updateUserDisplay === 'function') {
            window.updateUserDisplay();
        }
        
        // Show success message
        if (typeof showMessage === 'function') {
            showMessage('🎉 Referral-Bonus von 50 Coins wurde zu deinem Account hinzugefügt!', false);
        }
        
    } catch (error) {
        console.error('❌ Error applying referral to existing account:', error);
        if (typeof showMessage === 'function') {
            showMessage('❌ Fehler beim Hinzufügen des Referral-Codes', true);
        }
    }
};

// Generate referral link for current user
window.generateReferralLink = function() {
    if (!window.userProfile || !window.userProfile.username) {
        return 'https://luke0853.github.io/GeoDropV1/#/ref/' + (window.userProfile?.username || 'User');
    }
    
    const baseUrl = window.location.origin + window.location.pathname;
    const refCode = window.userProfile.username.replace(/[^a-zA-Z0-9]/g, '');
    return `${baseUrl}?ref=${refCode}`;
};

// Update referral link display
window.updateReferralLink = function() {
    console.log('🔗 Updating referral link...');
    console.log('🔍 currentUser:', window.currentUser);
    console.log('🔍 userProfile:', window.userProfile);
    
    const referralInput = document.getElementById('referral-link-input') || 
                         document.querySelector('input[value*="luke0853.github.io"]');
    
    if (referralInput) {
        let newLink;
        
        if (window.currentUser && window.currentUser.uid) {
            // Use Firebase UID as referral code
            newLink = `https://luke0853.github.io/GeoDropV1/#/ref/${window.currentUser.uid}`;
            console.log('🔗 Using Firebase UID as referral code:', window.currentUser.uid);
        } else if (window.userProfile && window.userProfile.username) {
            // Use username as referral code
            newLink = `https://luke0853.github.io/GeoDropV1/#/ref/${window.userProfile.username}`;
            console.log('🔗 Using username as referral code:', window.userProfile.username);
        } else {
            // Fallback to generic link
            newLink = 'https://luke0853.github.io/GeoDropV1/#/ref/User';
            console.log('🔗 Using fallback referral link');
        }
        
        referralInput.value = newLink;
        console.log('🔗 Updated referral link:', newLink);
    } else {
        console.log('❌ Referral input not found');
    }
};

// Save username function (for settings page)
window.saveUsername = async function() {
    console.log('👤 Saving username from settings...');
    
    const usernameInput = document.getElementById('settings-username');
    if (!usernameInput) {
        console.error('❌ Settings username input not found');
        showMessage('❌ Username-Input nicht gefunden!', true);
        return;
    }
    
    const newUsername = usernameInput.value.trim();
    if (!newUsername) {
        showMessage('❌ Bitte gib einen Benutzernamen ein!', true);
        return;
    }
    
    if (newUsername.length < 3) {
        showMessage('❌ Benutzername muss mindestens 3 Zeichen lang sein!', true);
        return;
    }
    
    if (newUsername.length > 20) {
        showMessage('❌ Benutzername darf maximal 20 Zeichen lang sein!', true);
        return;
    }
    
    // Check for invalid characters
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
        showMessage('❌ Benutzername darf nur Buchstaben, Zahlen, _ und - enthalten!', true);
        return;
    }
    
    try {
        if (!window.currentUser) {
            showMessage('❌ Bitte zuerst anmelden!', true);
            return;
        }
        
        // Update user profile in Firebase
        const userRef = window.firebase.firestore().collection('users').doc(window.currentUser.uid);
        await userRef.update({
            username: newUsername,
            lastUsernameUpdate: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update local userProfile
        if (window.userProfile) {
            window.userProfile.username = newUsername;
        }
        
        console.log('✅ Username updated successfully:', newUsername);
        showMessage(`✅ Benutzername erfolgreich zu "${newUsername}" geändert!`, false);
        
        // Update referral link if it exists
        if (typeof window.updateReferralLink === 'function') {
            window.updateReferralLink();
        }
        
    } catch (error) {
        console.error('❌ Error saving username:', error);
        showMessage('❌ Fehler beim Speichern des Benutzernamens: ' + error.message, true);
    }
};

// Load profile data function
window.loadProfileData = function() {
    console.log('👤 Loading profile data...');
    
    if (!window.currentUser) {
        console.log('❌ No current user found');
        return;
    }
    
    // Update email field
    const emailInput = document.getElementById('profile-email');
    if (emailInput) {
        emailInput.value = window.currentUser.email || 'Nicht verfügbar';
    }
    
    // Update username field (both profile and settings)
    const profileUsernameInput = document.getElementById('profile-username');
    const settingsUsernameInput = document.getElementById('settings-username');
    
    if (window.userProfile && window.userProfile.username) {
        if (profileUsernameInput) {
            profileUsernameInput.value = window.userProfile.username;
        }
        if (settingsUsernameInput) {
            settingsUsernameInput.value = window.userProfile.username;
        }
    }
    
    // Update created date
    const createdInput = document.getElementById('profile-created');
    if (createdInput && window.currentUser.metadata && window.currentUser.metadata.creationTime) {
        const createdDate = new Date(window.currentUser.metadata.creationTime);
        createdInput.value = createdDate.toLocaleDateString('de-DE');
    }
    
    // Update UID field
    const uidInput = document.getElementById('profile-uid');
    if (uidInput) {
        uidInput.value = window.currentUser.uid;
    }
    
    console.log('✅ Profile data loaded');
};

// Copy referral link function
window.copyReferralLink = function() {
    const referralInput = document.getElementById('referral-link-input') ||
                         document.querySelector('input[value*="luke0853.github.io"]') || 
                         document.querySelector('input[value*="?ref="]');
    
    if (referralInput) {
        referralInput.select();
        referralInput.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            if (typeof showMessage === 'function') {
                showMessage('✅ Referral-Link kopiert!', false);
            } else {
                alert('✅ Referral-Link kopiert!');
            }
        } catch (err) {
            // Fallback for modern browsers
            navigator.clipboard.writeText(referralInput.value).then(() => {
                if (typeof showMessage === 'function') {
                    showMessage('✅ Referral-Link kopiert!', false);
                } else {
                    alert('✅ Referral-Link kopiert!');
                }
            }).catch(() => {
                if (typeof showMessage === 'function') {
                    showMessage('❌ Fehler beim Kopieren des Links', true);
                } else {
                    alert('❌ Fehler beim Kopieren des Links');
                }
            });
        }
    }
};

// Load referral data function
window.loadReferralData = async function() {
    try {
        if (!window.currentUser) {
            console.log('❌ User not logged in, skipping referral data');
            return;
        }

        // Load user profile to get referral data
        const userDoc = await window.db.collection('users').doc(window.currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Update referral link
            const referralLink = `https://luke0853.github.io/GeoDropV1/#?ref=${window.currentUser.uid}`;
            const referralInput = document.getElementById('referral-link-input');
            if (referralInput) {
                referralInput.value = referralLink;
            }
            
            // Update referral statistics - FIXED: Count direct and indirect referrals
            const referralCount = userData.referralCount || 0;
            const referralEarnings = userData.referralEarnings || 0;
            
            // Count indirect referrals (referrals of referrals)
            let indirectReferralCount = 0;
            try {
                const directReferrals = await window.db.collection('users')
                    .where('referredBy', '==', window.currentUser.uid)
                    .get();
                
                for (const directRef of directReferrals.docs) {
                    const indirectReferrals = await window.db.collection('users')
                        .where('referredBy', '==', directRef.id)
                        .get();
                    indirectReferralCount += indirectReferrals.size;
                }
            } catch (error) {
                console.error('Error counting indirect referrals:', error);
            }
            
            const referralCountElement = document.getElementById('referral-count');
            const referralEarningsElement = document.getElementById('referral-earnings');
            const activeReferralsElement = document.getElementById('active-referrals');
            
            if (referralCountElement) {
                referralCountElement.textContent = referralCount;
            }
            if (referralEarningsElement) {
                referralEarningsElement.textContent = referralEarnings;
            }
            if (activeReferralsElement) {
                activeReferralsElement.textContent = indirectReferralCount;
            }
            
            console.log('✅ Referral data loaded:', { 
                referralCount, 
                referralEarnings, 
                indirectReferralCount 
            });
        }
    } catch (error) {
        console.error('❌ Error loading referral data:', error);
    }
};

// Show referral info in user interface
window.showReferralInfo = async function() {
    console.log('🔄 showReferralInfo called');
    const referralCode = localStorage.getItem('referralCode');
    const referralInfo = document.getElementById('referral-info');
    const referralUser = document.getElementById('referral-user');
    
    console.log('🔍 Referral code:', referralCode);
    console.log('🔍 Referral info element:', !!referralInfo);
    console.log('🔍 Referral user element:', !!referralUser);
    
    if (referralCode && referralInfo && referralUser) {
        try {
            // Try to get username from referral ID
            let displayName = referralCode; // Fallback to ID
            
            if (window.firebase && window.firebase.firestore) {
                console.log('🔥 Firebase available, searching for username...');
                const db = window.firebase.firestore();
                
                // Try to find user by UID first
                const userDoc = await db.collection('users').doc(referralCode).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    displayName = userData.username || userData.email || referralCode;
                    console.log('✅ Found user by UID:', displayName);
                } else {
                    // Try to find user by username or email
                    const userQuery = await db.collection('users')
                        .where('username', '==', referralCode)
                        .limit(1)
                        .get();
                    
                    if (!userQuery.empty) {
                        const userData = userQuery.docs[0].data();
                        displayName = userData.username || userData.email || referralCode;
                        console.log('✅ Found user by username:', displayName);
                    } else {
                        // Try by email
                        const emailQuery = await db.collection('users')
                            .where('email', '==', referralCode)
                            .limit(1)
                            .get();
                        
                        if (!emailQuery.empty) {
                            const userData = emailQuery.docs[0].data();
                            displayName = userData.username || userData.email || referralCode;
                            console.log('✅ Found user by email:', displayName);
                        } else {
                            console.log('❌ No user found for referral code:', referralCode);
                        }
                    }
                }
            } else {
                console.log('❌ Firebase not available');
            }
            
            referralUser.textContent = displayName;
            referralInfo.classList.remove('hidden');
            console.log('🎯 Showing referral info for:', displayName, '(ID:', referralCode, ')');
        } catch (error) {
            console.error('❌ Error getting referral username:', error);
            // Fallback to showing ID
            referralUser.textContent = referralCode;
            referralInfo.classList.remove('hidden');
            console.log('🎯 Showing referral info for (fallback):', referralCode);
        }
    } else {
        console.log('❌ Missing elements or referral code');
    }
};

// Apply manual referral code
window.applyManualReferralCode = function() {
    const referralInput = document.getElementById('manual-referral-code');
    if (!referralInput) return;
    
    const referralCode = referralInput.value.trim();
    if (!referralCode) {
        if (typeof showMessage === 'function') {
            showMessage('❌ Bitte gib einen Referral-Code ein!', true);
        } else {
            alert('❌ Bitte gib einen Referral-Code ein!');
        }
        return;
    }
    
    // Check if user is logged in
    if (!window.userProfile || !window.userProfile.username) {
        if (typeof showMessage === 'function') {
            showMessage('❌ Bitte melde dich zuerst an!', true);
        } else {
            alert('❌ Bitte melde dich zuerst an!');
        }
        return;
    }
    
    // Apply referral code
    window.applyReferralToExistingAccount(referralCode);
    
    // Clear input
    referralInput.value = '';
};

// Initialize referral system
window.initializeReferralSystem = function() {
    console.log('🔗 Initializing referral system...');
    
    // Process any referral links
    window.processReferralLink();
    
    // Show referral info if available
    window.showReferralInfo();
    
    // Update referral links
    window.updateReferralLink();
    
    // Hide manual referral input if user already has a referral
    const referralInfo = document.getElementById('referral-info');
    const referralInputSection = document.getElementById('referral-input-section');
    
    if (referralInfo && referralInputSection) {
        if (!referralInfo.classList.contains('hidden')) {
            // User already has a referral, hide input section
            referralInputSection.style.display = 'none';
        }
    }
};

// 2-Level Referral System Functions
window.calculateReferralRewards = function(earnings, referralLevel) {
    if (referralLevel === 1) {
        return earnings * 0.05; // 5% for direct referrals
    } else if (referralLevel === 2) {
        return earnings * 0.01; // 1% for second level referrals
    }
    return 0;
};

// Process referral rewards when user earns coins
window.processReferralRewards = async function(userId, earnings) {
    if (!window.db) return;
    
    try {
        // Get user data
        const userDoc = await window.db.collection('users').doc(userId).get();
        if (!userDoc.exists) return;
        
        const userData = userDoc.data();
        const referredBy = userData.referredBy;
        
        if (!referredBy) return;
        
        // Find the referrer
        const referrerQuery = await window.db.collection('users')
            .where('username', '==', referredBy)
            .limit(1)
            .get();
        
        if (referrerQuery.empty) return;
        
        const referrerDoc = referrerQuery.docs[0];
        const referrerData = referrerDoc.data();
        
        // Calculate 5% reward for direct referrer
        const directReward = window.calculateReferralRewards(earnings, 1);
        
        if (directReward > 0) {
            // Update referrer's coins
            await window.db.collection('users').doc(referrerDoc.id).update({
                coins: (referrerData.coins || 0) + directReward,
                referralEarnings: (referrerData.referralEarnings || 0) + directReward
            });
            
            console.log(`💰 Referral reward: ${directReward} coins to ${referredBy}`);
        }
        
        // Check for second level referral
        const secondLevelReferrer = referrerData.referredBy;
        if (secondLevelReferrer) {
            const secondLevelQuery = await window.db.collection('users')
                .where('username', '==', secondLevelReferrer)
                .limit(1)
                .get();
            
            if (!secondLevelQuery.empty) {
                const secondLevelDoc = secondLevelQuery.docs[0];
                const secondLevelData = secondLevelDoc.data();
                
                // Calculate 1% reward for second level referrer
                const secondLevelReward = window.calculateReferralRewards(earnings, 2);
                
                if (secondLevelReward > 0) {
                    await window.db.collection('users').doc(secondLevelDoc.id).update({
                        coins: (secondLevelData.coins || 0) + secondLevelReward,
                        referralEarnings: (secondLevelData.referralEarnings || 0) + secondLevelReward
                    });
                    
                    console.log(`💰 Second level referral reward: ${secondLevelReward} coins to ${secondLevelReferrer}`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error processing referral rewards:', error);
    }
};

