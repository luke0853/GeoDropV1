// Mehr Pages Navigation Functions

// Test function to verify mehr navigation is loaded
window.testMehrNavigation = function() {
    console.log('🧪 Testing Mehr Navigation...');
    console.log('✅ showMehrTab function exists:', typeof window.showMehrTab);
    console.log('✅ mehr-tab-content element exists:', !!document.getElementById('mehr-tab-content'));
    console.log('✅ mehr-tab-btn elements found:', document.querySelectorAll('.mehr-tab-btn').length);
    return 'Mehr Navigation Test Complete - Check Console';
};

// FORCE LOAD: Emergency function to ensure showMehrTab is available
window.forceLoadMehrNavigation = function() {
    console.log('🚨 FORCE LOADING mehr-navigation.js...');
    
    // Check if function exists
    if (typeof window.showMehrTab === 'function') {
        console.log('✅ showMehrTab already exists');
        return 'showMehrTab already loaded';
    }
    
    // Try to reload the script
    const script = document.createElement('script');
    script.src = 'js/mehr-navigation.js';
    script.onload = function() {
        console.log('✅ mehr-navigation.js force loaded successfully');
    };
    script.onerror = function() {
        console.error('❌ Failed to force load mehr-navigation.js');
    };
    document.head.appendChild(script);
    
    return 'Force loading mehr-navigation.js...';
};

// Mehr tab navigation - global function (only for mehr tabs)
window.showMehrTab = function(tabId) {
    console.log('🔄 showMehrTab called with:', tabId);
    
    // Update active tab button
    document.querySelectorAll('.mehr-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('border-blue-500');
        btn.classList.add('border-gray-500');
    });
    const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
        targetBtn.classList.remove('border-gray-500');
        targetBtn.classList.add('border-blue-500');
        console.log('✅ Tab button activated:', tabId);
    } else {
        console.log('❌ Tab button not found for:', tabId);
    }
    
    // Load tab content - only if we're in a mehr context
    const content = document.getElementById('mehr-tab-content');
    if (!content) {
        console.error('❌ mehr-tab-content not found!');
        console.error('❌ Available elements with "mehr" in ID:', 
            Array.from(document.querySelectorAll('[id*="mehr"]')).map(el => el.id));
        alert('❌ Mehr-Tab Content nicht gefunden! Bitte Seite neu laden.');
        return;
    }
    
    console.log('✅ mehr-tab-content found, loading content for:', tabId);
    
    if (content) {
        // Special handling for dashboard - show default content
        if (tabId === 'dashboard') {
            content.innerHTML = `
                <h3 class="text-2xl font-bold text-white mb-8 bg-black px-4 py-2 rounded-lg">🏠 Dashboard</h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- User Statistics -->
                    <div class="bg-gray-700 rounded-lg p-6">
                        <h3 class="text-xl font-semibold text-white mb-4">📊 Deine Statistiken</h3>
                        <div class="space-y-4">
                            <div class="bg-gray-800 rounded-lg p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">PixelDrop Balance:</span>
                                    <span class="text-purple-400 font-bold" id="dashboard-coins">0</span>
                                </div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">tBNB Balance:</span>
                                    <span class="text-yellow-400 font-bold" id="dashboard-tbnb">0.00</span>
                                </div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">GeoDrops gesammelt:</span>
                                    <span class="text-blue-400 font-bold" id="dashboard-drops">0</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-300">Mining Boost:</span>
                                    <span class="text-green-400 font-bold" id="dashboard-boost">1.0x</span>
                                </div>
                            </div>
                            
                            <div class="bg-gray-800 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-3">🎯 Heutige Aktivität</h4>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">GeoDrops heute:</span>
                                    <span class="text-blue-400 font-bold" id="dashboard-today-drops">0</span>
                                </div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">PixelDrop verdient:</span>
                                    <span class="text-purple-400 font-bold" id="dashboard-today-coins">0</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-300">Mining Zeit:</span>
                                    <span class="text-green-400 font-bold" id="dashboard-mining-time">0h 0m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- PixelDrop Auszahlung -->
                    <div class="bg-gray-700 rounded-lg p-6">
                        <h3 class="text-xl font-semibold text-white mb-4">💸 PixelDrop Auszahlung</h3>
                        <div class="space-y-4">
                            <div class="bg-gray-800 rounded-lg p-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">Verfügbare PixelDrop (App):</span>
                                    <span class="text-purple-400 font-bold" id="payout-available-coins">0</span>
                                </div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">Verfügbare PixelDrop (Blockchain):</span>
                                    <span class="text-blue-400 font-bold" id="payout-blockchain-coins">0</span>
                                </div>
                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-gray-300">Auszahlung:</span>
                                    <span class="text-green-400 font-bold">Echte Blockchain-Transaktion</span>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Wallet-Adresse für Auszahlung:</label>
                                <input type="text" id="payout-wallet-input" placeholder="0x..." class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none mb-4">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Auszuzahlende PixelDrop:</label>
                                <div class="flex space-x-2">
                                    <input type="number" id="payout-amount" placeholder="0" min="1" class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none">
                                    <button onclick="setMaxWithdrawal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                        Max
                                    </button>
                                </div>
                            </div>
                            
                            <div class="bg-gray-800 rounded-lg p-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-300">Auszuzahlender Betrag:</span>
                                    <span class="text-yellow-400 font-bold" id="payout-tbnb-amount">0 PixelDrop</span>
                                </div>
                            </div>
                            
                            <div class="flex space-x-2">
                                <button onclick="calculatePayout()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    💰 Berechnen
                                </button>
                                <button onclick="executePayout()" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    💸 Auszahlen
                                </button>
                            </div>
                            
                            <div class="text-xs text-gray-400 bg-gray-800 p-2 rounded">
                                💡 Mindestauszahlung: 100 PixelDrop
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Initialize dashboard functions with current data
            setTimeout(() => {
                // Force update dashboard values directly
                updateDashboardValues();
                
                // Also update all mehr tabs
                if (typeof window.updateAllMehrTabs === 'function') {
                    window.updateAllMehrTabs();
                }
                
                // FORCE UPDATE: Call updateTabContent directly
                updateTabContent('dashboard');
            }, 500);
            
            console.log('✅ Dashboard content loaded successfully');
            return;
        }
        
                // Load simple content files for other tabs
                console.log('🔄 Loading content for tab:', tabId);
                fetch(`../mehr-pages/${tabId}-content.html`)
                    .then(response => response.text())
                    .then(html => {
                        content.innerHTML = html;
                        console.log('✅ Content loaded for tab:', tabId);
                        
                        // Update tab content with current values
                        setTimeout(() => {
                            console.log('🔄 FORCE UPDATING tab content after load:', tabId);
                            updateTabContent(tabId);
                            
                            // FORCE UPDATE: Also call specific tab update functions
                            if (tabId === 'profile') {
                                updateProfileTab();
                            } else if (tabId === 'stats') {
                                updateStatsTab();
                            } else if (tabId === 'settings') {
                                updateSettingsTab();
                            } else if (tabId === 'dev') {
                                updateDevTab();
                            }
                        }, 100);
                    })
            .catch(error => {
                console.error('Error loading mehr tab:', error);
                // Fallback to full HTML files
                fetch(`../mehr-pages/${tabId}.html`)
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const mainContent = doc.querySelector('main');
                        if (mainContent) {
                            content.innerHTML = mainContent.innerHTML;
                        } else {
                            content.innerHTML = html;
                        }
                        console.log('✅ Fallback content loaded for tab:', tabId);
                        
                        // Update tab content with current values
                        setTimeout(() => {
                            console.log('🔄 FORCE UPDATING tab content after fallback load:', tabId);
                            updateTabContent(tabId);
                            
                            // FORCE UPDATE: Also call specific tab update functions
                            if (tabId === 'profile') {
                                updateProfileTab();
                            } else if (tabId === 'stats') {
                                updateStatsTab();
                            } else if (tabId === 'settings') {
                                updateSettingsTab();
                            } else if (tabId === 'dev') {
                                updateDevTab();
                            }
                        }, 100);
                    })
                    .catch(error2 => {
                        console.error('Error loading mehr tab fallback:', error2);
                        content.innerHTML = `
                            <div class="bg-gray-700 rounded-lg p-6">
                                <h3 class="text-xl font-semibold text-white mb-4">${tabId}</h3>
                                <p class="text-gray-300">Tab-Inhalt wird geladen...</p>
                            </div>
                        `;
                        console.log('✅ Fallback placeholder loaded for tab:', tabId);
                    });
            });
    }
};

// Navigation function for mehr-pages - renamed to avoid conflicts
function showMehrPage(pageId) {
    // For standalone page, redirect to main index
    if (pageId !== 'dashboard') {
        window.location.href = '../index.html#' + pageId;
    }
}

// Dashboard functions - these are now handled by dashboard-functions.js
// The functions are globally available through window object

// Update all mehr tabs with current data
window.updateAllMehrTabs = function() {
    console.log('🔄 Updating all mehr tabs with current data...');
    
    // Update dashboard if it's currently active
    const activeTab = document.querySelector('.mehr-tab-btn.active');
    if (activeTab) {
        const activeTabId = activeTab.getAttribute('data-tab');
        
        if (activeTabId === 'dashboard') {
            // Update dashboard values directly
            updateDashboardValues();
        } else {
            // Update other tabs
            updateTabContent(activeTabId);
            
            // FORCE UPDATE: Also call specific tab update functions
            if (activeTabId === 'profile') {
                updateProfileTab();
            } else if (activeTabId === 'stats') {
                updateStatsTab();
            } else if (activeTabId === 'settings') {
                updateSettingsTab();
            } else if (activeTabId === 'dev') {
                updateDevTab();
            }
        }
    }
    
    // Force update user display to ensure current values
    if (typeof window.updateUserDisplay === 'function') {
        window.updateUserDisplay();
    }
    
    // Force update wallet display if connected
    if (typeof window.updateWalletDisplay === 'function') {
        window.updateWalletDisplay();
    }
    
    console.log('✅ All mehr tabs updated with current data');
};

// Load profile data
window.loadProfileData = function() {
    console.log('🔄 Loading profile data...');
    
    // This function can be extended to load user profile data
    // For now, it's just a placeholder
    console.log('✅ Profile data loaded');
};

// Emergency function to force load dashboard
window.forceLoadDashboard = function() {
    console.log('🚨 FORCE LOADING DASHBOARD...');
    
    const content = document.getElementById('mehr-tab-content');
    if (content) {
        content.innerHTML = `
            <div class="bg-gray-700 rounded-lg p-6">
                <h3 class="text-2xl font-bold text-white mb-4 bg-black px-4 py-2 rounded-lg">🏠 Dashboard (Emergency Load)</h3>
                <p class="text-gray-300">Dashboard wurde notfallmäßig geladen.</p>
                <button onclick="showMehrTab('dashboard')" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    🔄 Dashboard neu laden
                </button>
            </div>
        `;
        console.log('✅ Emergency dashboard loaded');
    } else {
        console.error('❌ Cannot load emergency dashboard - content element not found');
    }
};

// Update dashboard values directly
function updateDashboardValues() {
    console.log('🔄 FORCE UPDATING dashboard values...');
    
    // Wait for userProfile to be available
    if (!window.userProfile) {
        console.log('⚠️ No user profile available for dashboard update, waiting...');
        setTimeout(() => {
            updateDashboardValues();
        }, 1000);
        return;
    }
    
    console.log('✅ User profile available, updating dashboard values');
    
    // Update dashboard elements with current values
    const elements = {
        'dashboard-coins': window.userProfile.coins || 0,
        'dashboard-tbnb': window.walletBalance || 0,
        'dashboard-drops': window.userProfile.drops || 0,
        'dashboard-boost': calculateMiningBoost(),
        'dashboard-today-drops': window.userProfile.todayDrops || 0,
        'dashboard-today-coins': window.userProfile.todayCoins || 0,
        'dashboard-mining-time': '0h 0m', // TODO: Calculate actual mining time
        'payout-available-coins': window.userProfile.coins || 0,
        'payout-blockchain-coins': window.userProfile.coins || 0
    };
    
    let updatedCount = 0;
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // Check if it's an input field or text element
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
            updatedCount++;
            console.log(`✅ Updated ${id}: ${value}`);
        } else {
            console.log(`❌ Element not found: ${id}`);
        }
    });
    
    console.log(`✅ Dashboard values updated: ${updatedCount} elements updated`);
}

// Calculate mining boost
function calculateMiningBoost() {
    if (!window.userProfile || !window.userProfile.ownedMachines) {
        return '1.0x';
    }
    
    let totalBoost = 1.0;
    const machines = window.userProfile.ownedMachines;
    
    // Machine 1: 0.02 boost each
    if (machines[1]) totalBoost += machines[1] * 0.02;
    // Machine 2: 0.12 boost each  
    if (machines[2]) totalBoost += machines[2] * 0.12;
    // Machine 3: 0.6 boost each
    if (machines[3]) totalBoost += machines[3] * 0.6;
    // Machine 4: 4.0 boost each
    if (machines[4]) totalBoost += machines[4] * 4.0;
    
    return totalBoost.toFixed(1) + 'x';
}

// Update tab content with current values
function updateTabContent(tabId) {
    console.log('🔄 FORCE UPDATING tab content for:', tabId);
    
    // Wait for userProfile to be available
    if (!window.userProfile) {
        console.log('⚠️ No user profile available, waiting...');
        setTimeout(() => {
            updateTabContent(tabId);
        }, 1000);
        return;
    }
    
    console.log('✅ User profile available, updating tab:', tabId);
    
    switch(tabId) {
        case 'dashboard':
            updateDashboardValues();
            break;
        case 'profile':
            updateProfileTab();
            break;
        case 'stats':
            updateStatsTab();
            break;
        case 'settings':
            updateSettingsTab();
            break;
        case 'dev':
            updateDevTab();
            break;
        default:
            console.log('📝 No specific update for tab:', tabId);
            // Force update dashboard values anyway
            updateDashboardValues();
    }
}

// Update profile tab with current user data
function updateProfileTab() {
    if (!window.userProfile) {
        console.log('⚠️ No user profile available for profile tab update');
        return;
    }
    
    console.log('🔄 Updating profile tab...');
    
    // Get email from currentUser (Firebase Auth)
    const userEmail = window.currentUser?.email || window.userProfile?.email || 'Nicht verfügbar';
    
    // Get registration date from userProfile.createdAt
    let registrationDate = 'Nicht verfügbar';
    if (window.userProfile?.createdAt) {
        try {
            const createdDate = window.userProfile.createdAt.toDate ? 
                window.userProfile.createdAt.toDate() : 
                new Date(window.userProfile.createdAt);
            registrationDate = createdDate.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('❌ Error formatting registration date:', error);
        }
    }
    
    const elements = {
        'profile-username': window.userProfile.username || 'Unknown',
        'profile-email': userEmail,
        'profile-uid': window.currentUser?.uid || window.userProfile?.uid || 'Unknown',
        'profile-created': registrationDate,
        'profile-coins': window.userProfile.coins || 0,
        'profile-drops': window.userProfile.drops || 0,
        'profile-today-drops': window.userProfile.todayDrops || 0,
        'profile-today-coins': window.userProfile.todayCoins || 0,
        'profile-mining-boost': calculateMiningBoost(),
        'profile-referral-code': window.currentUser?.uid || window.userProfile?.uid || 'Unknown'
    };
    
    let updatedCount = 0;
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // Check if it's an input field or text element
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
            updatedCount++;
            console.log(`✅ Updated ${id}: ${value}`);
        } else {
            console.log(`❌ Element not found: ${id}`);
        }
    });
    
    console.log(`✅ Profile tab updated: ${updatedCount} elements updated`);
}

// Update stats tab with current statistics
function updateStatsTab() {
    if (!window.userProfile) {
        console.log('⚠️ No user profile available for stats tab update');
        return;
    }
    
    console.log('🔄 Updating stats tab...');
    
    const elements = {
        'total-drops': window.userProfile.drops || 0,
        'total-earnings': window.userProfile.coins || 0,
        'user-level': 1, // TODO: Calculate actual level
        'mining-machines': calculateTotalMachines(),
        'bonus-claimed': calculateTotalBonus(),
        'current-balance': window.userProfile.coins || 0,
        'first-login': window.userProfile.joinDate || 'Unknown',
        'last-activity': new Date().toLocaleDateString(),
        'total-referrals': window.userProfile.referrals || 0,
        'today-drops': window.userProfile.todayDrops || 0,
        'today-earnings': window.userProfile.todayCoins || 0
    };
    
    let updatedCount = 0;
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // Check if it's an input field or text element
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
            updatedCount++;
            console.log(`✅ Updated ${id}: ${value}`);
        } else {
            console.log(`❌ Element not found: ${id}`);
        }
    });
    
    console.log(`✅ Stats tab updated: ${updatedCount} elements updated`);
}

// Update settings tab
function updateSettingsTab() {
    if (!window.userProfile) {
        console.log('⚠️ No user profile available for settings tab update');
        return;
    }
    
    console.log('🔄 Updating settings tab...');
    
    // Get email from currentUser (Firebase Auth)
    const userEmail = window.currentUser?.email || window.userProfile?.email || 'Nicht verfügbar';
    
    const elements = {
        'settings-username': window.userProfile.username || '',
        'settings-email': userEmail
    };
    
    let updatedCount = 0;
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // Check if it's an input field or text element
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
            updatedCount++;
            console.log(`✅ Updated ${id}: ${value}`);
        } else {
            console.log(`❌ Element not found: ${id}`);
        }
    });
    
    console.log(`✅ Settings tab updated: ${updatedCount} elements updated`);
    
    // Update radio buttons for language selection
    if (typeof window.updateRadioButtons === 'function') {
        setTimeout(() => {
            window.updateRadioButtons();
            console.log('🔄 Radio buttons updated after settings tab load');
        }, 100);
    }
}

// Update dev tab
function updateDevTab() {
    // Dev tab updates are handled by dev-functions.js
    console.log('✅ Dev tab loaded');
}

// Calculate total machines owned
function calculateTotalMachines() {
    if (!window.userProfile || !window.userProfile.ownedMachines) {
        return 0;
    }
    
    const machines = window.userProfile.ownedMachines;
    return (machines[1] || 0) + (machines[2] || 0) + (machines[3] || 0) + (machines[4] || 0);
}

// Calculate total bonus claimed
function calculateTotalBonus() {
    if (!window.userProfile || !window.userProfile.bonusHistory) {
        return 0;
    }
    
    return window.userProfile.bonusHistory.reduce((sum, bonus) => sum + (bonus.amount || 0), 0);
}

// Set max withdrawal amount (local function for mehr-navigation)
window.setMaxWithdrawal = function() {
    const amountInput = document.getElementById('payout-amount');
    
    if (amountInput) {
        // Get the real current balance from userProfile
        let currentBalance = 0;
        
        if (window.userProfile) {
            currentBalance = window.userProfile.coins || 0;
            console.log('📊 Using userProfile.coins for max withdrawal:', currentBalance);
        }
        
        // Get the main UI element as secondary source
        const userCoinsElement = document.getElementById('user-coins');
        if (userCoinsElement) {
            const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
            if (uiBalance > currentBalance) {
                currentBalance = uiBalance;
                console.log('📊 Using UI balance for max withdrawal as it is higher:', currentBalance);
            }
        }
        
        // Set max amount to 95% of current balance (5% reserve)
        const maxAmount = Math.round(currentBalance * 0.95); // 95% of current balance (5% reserve)
        amountInput.value = Math.max(maxAmount, 100); // Minimum 100
        console.log('✅ Max withdrawal set to:', amountInput.value, 'from current balance:', currentBalance, '(5% reserve)');
        
        // Also update the payout amount display
        const payoutAmountElement = document.getElementById('payout-tbnb-amount');
        if (payoutAmountElement) {
            payoutAmountElement.textContent = `${amountInput.value} PixelDrop`;
        }
        
        // Trigger calculation
        if (typeof window.calculatePayout === 'function') {
            window.calculatePayout();
        } else {
            // Local calculatePayout function
            calculatePayoutLocal();
        }
    } else {
        console.error('❌ payout-amount input not found');
    }
};

// Local calculatePayout function for mehr-navigation
function calculatePayoutLocal() {
    const amountInput = document.getElementById('payout-amount');
    const payoutAmount = document.getElementById('payout-tbnb-amount');
    
    if (!amountInput || !payoutAmount) {
        console.log('❌ Missing payout elements');
        return;
    }
    
    const amount = parseFloat(amountInput.value) || 0;
    
    if (amount <= 0) {
        payoutAmount.textContent = '0 PixelDrop';
        console.log('💰 Payout calculated: 0 (invalid amount)');
        return;
    }
    
    // Check if user has enough balance
    const userProfile = window.userProfile;
    let currentBalance = userProfile ? userProfile.coins : 0;
    
    // Get the main UI element
    const userCoinsElement = document.getElementById('user-coins');
    if (userCoinsElement) {
        const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
        if (uiBalance > currentBalance) {
            currentBalance = uiBalance;
        }
    }
    
    if (amount > currentBalance) {
        payoutAmount.textContent = '❌ Nicht genügend PixelDrop';
        console.log('💰 Payout calculated: Insufficient balance. Available:', currentBalance, 'Requested:', amount);
        return;
    }
    
    // Calculate actual payout - if amount is already 95% of balance, no further reduction needed
    // If amount is the full balance, then take 95% (5% reserve)
    // If amount is already 95% of balance, then use the amount as-is
    let actualPayout;
    if (amount >= currentBalance * 0.95) {
        // Amount is already 95% or more of balance, use as-is (no double reduction)
        actualPayout = Math.max(amount, 100);
    } else {
        // Amount is less than 95% of balance, take 95% of the amount
        actualPayout = Math.max(Math.round(amount * 0.95), 100);
    }
    
    payoutAmount.textContent = `${actualPayout} PixelDrop`;
    console.log('💰 Payout calculated:', actualPayout, 'from requested:', amount, 'balance:', currentBalance, '(5% reserve)');
}

// Execute payout function for mehr-navigation
window.executePayout = async function() {
    console.log('🚀 Starting payout process...');
    
    // Check if user is logged in
    const isLoggedIn = window.currentUser || window.userProfile || (window.firebase && window.firebase.auth().currentUser);
    
    if (!isLoggedIn) {
        alert('❌ Bitte zuerst anmelden!');
        return;
    }

    // Check if MetaMask is available
    if (!window.ethereum) {
        alert('❌ MetaMask ist nicht installiert! Bitte installiere MetaMask.');
        return;
    }

    // Get form elements
    const walletInput = document.getElementById('payout-wallet-input');
    const amountInput = document.getElementById('payout-amount');
    
    if (!walletInput || !amountInput) {
        alert('❌ Auszahlungsformular nicht gefunden!');
        return;
    }

    const targetWallet = walletInput.value.trim();
    const amount = parseFloat(amountInput.value);

    // Validation
    if (!targetWallet || !targetWallet.startsWith('0x') || targetWallet.length !== 42) {
        alert('❌ Ungültige Wallet-Adresse!');
        return;
    }

    if (!amount || amount < 100) {
        alert('❌ Minimum 100 PixelDrop erforderlich!');
        return;
    }

    try {
        // Show processing message
        const button = document.querySelector('button[onclick="executePayout()"]');
        if (button) {
            button.textContent = '⏳ Transaktion wird vorbereitet...';
            button.disabled = true;
        }

        console.log('🚀 Starting real withdrawal transaction...');
        console.log('📊 Withdrawal details:', {
            targetWallet,
            amount,
            userProfile: window.userProfile?.username || 'Unknown'
        });

        // Call the main processWithdrawal function if available
        if (typeof window.processWithdrawal === 'function') {
            await window.processWithdrawal();
        } else {
            alert('❌ Auszahlungsfunktion nicht verfügbar! Bitte Seite neu laden.');
        }

    } catch (error) {
        console.error('❌ Payout error:', error);
        alert('❌ Auszahlung fehlgeschlagen: ' + error.message);
    } finally {
        // Reset button
        const button = document.querySelector('button[onclick="executePayout()"]');
        if (button) {
            button.textContent = '💸 Auszahlen';
            button.disabled = false;
        }
    }
};

// Force refresh all current values in mehr tabs
window.refreshMehrTabValues = function() {
    console.log('🔄 FORCE REFRESHING ALL MEHR TAB VALUES...');
    
    // Update dashboard values directly
    updateDashboardValues();
    
    // Update all mehr tabs
    if (typeof window.updateAllMehrTabs === 'function') {
        window.updateAllMehrTabs();
    }
    
    // Update user display
    if (typeof window.updateUserDisplay === 'function') {
        window.updateUserDisplay();
    }
    
    // Update wallet display
    if (typeof window.updateWalletDisplay === 'function') {
        window.updateWalletDisplay();
    }
    
    // Update bonus display
    if (typeof window.updateBonusDisplay === 'function') {
        window.updateBonusDisplay();
    }
    
    // Force update all tab content
    const activeTab = document.querySelector('.mehr-tab-btn.active');
    if (activeTab) {
        const activeTabId = activeTab.getAttribute('data-tab');
        updateTabContent(activeTabId);
    }
    
    console.log('✅ All mehr tab values refreshed with current data');
    return 'All values refreshed - check console for details';
};

// FORCE UPDATE ALL MEHR TABS - This function ALWAYS works
window.forceUpdateAllMehrTabs = function() {
    console.log('🚨 FORCE UPDATING ALL MEHR TABS...');
    
    // Force update dashboard values
    updateDashboardValues();
    
    // Force update all tab content
    const activeTab = document.querySelector('.mehr-tab-btn.active');
    if (activeTab) {
        const activeTabId = activeTab.getAttribute('data-tab');
        console.log('🚨 Force updating active tab:', activeTabId);
        updateTabContent(activeTabId);
        
        // FORCE UPDATE: Also call specific tab update functions
        if (activeTabId === 'profile') {
            updateProfileTab();
        } else if (activeTabId === 'stats') {
            updateStatsTab();
        } else if (activeTabId === 'settings') {
            updateSettingsTab();
        } else if (activeTabId === 'dev') {
            updateDevTab();
        }
    }
    
    // Force update ALL tabs regardless of which is active
    console.log('🚨 Force updating ALL tabs...');
    updateProfileTab();
    updateStatsTab();
    updateSettingsTab();
    updateDevTab();
    
    console.log('🚨 FORCE UPDATE COMPLETED - All tabs should now show current values');
    return 'FORCE UPDATE COMPLETED - Check console for details';
};
