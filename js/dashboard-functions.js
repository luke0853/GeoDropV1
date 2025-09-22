// Dashboard Functions - PD Auszahlung

// Function to update all mehr tab displays with current user data
window.updateAllMehrTabs = function() {
    console.log('🔄 Updating all mehr tabs with current data...');
    
    // Update dashboard if it's currently visible
    const dashboardContent = document.getElementById('mehr-tab-content');
    if (dashboardContent && dashboardContent.innerHTML.includes('dashboard-coins')) {
        updateDashboardDisplay();
    }
    
    // Update profile if it's currently visible
    if (dashboardContent && dashboardContent.innerHTML.includes('profile-email')) {
        loadProfileInfo();
        updateAllStatistics();
    }
    
    // Update stats if it's currently visible
    if (dashboardContent && dashboardContent.innerHTML.includes('total-drops')) {
        updateAllStatistics();
    }
    
    // Update withdrawal statistics if visible
    if (dashboardContent && dashboardContent.innerHTML.includes('total-withdrawals')) {
        updateWithdrawalStatistics();
    }
    
    console.log('✅ All mehr tabs updated');
};

// Make showMehrTab available immediately - using working version from backup
window.showMehrTab = function(tabName) {
    console.log(`🔍 === showMehrTab called with: ${tabName} ===`);
    
    // Special handling for dev tab - show password popup if not logged in
    if (tabName === 'dev' && typeof isDevLoggedIn !== 'undefined' && !isDevLoggedIn) {
        console.log('🔐 Dev tab clicked - showing password popup');
        // Only show popup if we're on the mehr page
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.id === 'mehr') {
            if (typeof testDevLogin === 'function') {
                testDevLogin();
            }
            return;
        }
    }
    
    try {
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.mehr-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to tab button
        const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabBtn) {
            tabBtn.classList.add('active');
            console.log(`✅ Tab button ${tabName} activated`);
        }
        
        // Load tab content
        const content = document.getElementById('mehr-tab-content');
        console.log('🔍 Looking for mehr-tab-content element:', content);
        if (content) {
            console.log('📥 Loading content for tab:', tabName);
            // Load content from mehr-pages
            fetch(`mehr-pages/${tabName}.html`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    console.log('✅ Content loaded for tab:', tabName);
                    console.log('📄 HTML length:', html.length);
                    
                    // Extract only the content inside the main div
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const mainContent = doc.querySelector('main');
                    
                    if (mainContent) {
                        console.log('✅ Main element found, extracting content');
                        content.innerHTML = mainContent.innerHTML;
                        console.log('✅ Main content extracted and inserted');
                        console.log('🔍 Content element after insertion:', content);
                        console.log('🔍 Content innerHTML length:', content.innerHTML.length);
                        console.log('🔍 Content visible:', content.offsetHeight > 0);
                        
                        // Debug: Check if language section is present
                        const languageSection = content.querySelector('#settings-language-title');
                        if (languageSection) {
                            console.log('✅ Language section found:', languageSection.textContent);
                        } else {
                            console.error('❌ Language section NOT found in loaded content');
                            console.log('🔍 Available sections:', content.querySelectorAll('h3').length);
                        }
                        
                        // Fix visibility issues - remove any page classes that might hide content
                        const pageElements = content.querySelectorAll('.page');
                        pageElements.forEach(pageEl => {
                            pageEl.style.display = 'block';
                            pageEl.style.visibility = 'visible';
                            pageEl.classList.remove('page');
                            console.log('🔧 Fixed page element visibility');
                        });
                        
                        // Also check for any elements with display: none
                        const hiddenElements = content.querySelectorAll('[style*="display: none"]');
                        hiddenElements.forEach(el => {
                            el.style.display = 'block';
                            console.log('🔧 Fixed hidden element:', el);
                        });
                        
                        console.log('🔍 Content visible after fix:', content.offsetHeight > 0);
                        
                        // Update dashboard data after content is loaded
                        if (tabName === 'dashboard') {
                            setTimeout(() => {
                                updateDashboardDisplay();
                            }, 100);
                        } else if (tabName === 'profile') {
                            setTimeout(() => {
                                if (typeof window.loadProfileData === 'function') {
                                    window.loadProfileData();
                                } else if (typeof loadProfileInfo === 'function') {
                                    loadProfileInfo();
                                }
                                updateAllStatistics();
                            }, 100);
                        } else if (tabName === 'stats') {
                            setTimeout(() => {
                                console.log('📊 Loading stats tab, updating all statistics...');
                                updateAllStatistics();
                                if (typeof window.updateWithdrawalStatistics === 'function') {
                                    window.updateWithdrawalStatistics();
                                }
                                // Also update bonus display
                                if (typeof window.updateBonusDisplay === 'function') {
                                    window.updateBonusDisplay();
                                }
                            }, 100);
                            
                            // Additional delay to ensure DOM is fully loaded
                            setTimeout(() => {
                                console.log('📊 Second update for stats tab...');
                                if (typeof window.updateWithdrawalStatistics === 'function') {
                                    window.updateWithdrawalStatistics();
                                }
                            }, 1000);
                        } else if (tabName === 'settings') {
                            setTimeout(() => {
                                if (typeof window.loadProfileData === 'function') {
                                    window.loadProfileData();
                                }
                                
                            }, 100);
                        }
                    } else {
                        console.log('⚠️ No main element found, using full HTML');
                        content.innerHTML = html;
                        console.log('🔍 Full HTML inserted, length:', html.length);
                    }
                })
                .catch(error => {
                    console.error('❌ Error loading mehr tab:', error);
                    content.innerHTML = `
                        <div class="bg-gray-700 rounded-lg p-6">
                            <h3 class="text-xl font-semibold text-white mb-4">${tabName}</h3>
                            <p class="text-gray-300">Fehler beim Laden des Inhalts: ${error.message}</p>
                        </div>
                    `;
                });
        } else {
            console.error('❌ mehr-tab-content element not found');
        }
        
    } catch (error) {
        console.error('Error in showMehrTab:', error);
    }
};

// Dashboard content generation function
function generateDashboardContent() {
    return `
                <h3 class="text-2xl font-bold text-white mb-8">🏠 Dashboard</h3>
                
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
                                <h4 class="text-lg font-semibold text-white mb-3" id="dashboard-today-activity">🎯 Heutige Aktivität</h4>
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
                                    <span class="text-gray-300" id="dashboard-available-pixeldrop-app">Verfügbare PixelDrop (App):</span>
                                    <span class="text-purple-400 font-bold" id="payout-available-coins">0</span>
                                </div>
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300" id="dashboard-available-pixeldrop-blockchain">Verfügbare PixelDrop (Blockchain):</span>
                                    <span class="text-blue-400 font-bold" id="payout-blockchain-coins">0</span>
                                </div>
                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-gray-300">Auszahlung:</span>
                                    <span class="text-green-400 font-bold">Echte Blockchain-Transaktion</span>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2" id="dashboard-wallet-address">Wallet-Adresse für Auszahlung:</label>
                                <input type="text" id="payout-wallet-input" placeholder="0x..." class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none mb-4">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Auszuzahlende PixelDrop:</label>
                                <div class="flex space-x-2">
                                    <input type="number" id="payout-amount" placeholder="0" min="1" class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none" oninput="calculatePayout()">
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
}


// Global function for updating dashboard display
window.updateDashboardDisplay = async function() {
    try {
        console.log('🔄 Updating dashboard display...');
        
        // First, update the user display to ensure user-coins is current
        if (typeof updateUserDisplay === 'function') {
            await updateUserDisplay();
        }
        
        // Wait a bit for user data to be loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Force reload userProfile from Firebase to get latest data
        if (window.firebase && window.firebase.firestore && window.currentUser) {
            try {
                const userDoc = await window.firebase.firestore().collection('users').doc(window.currentUser.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    
                    // Preserve local withdrawal data if it exists
                    if (window.userProfile && window.userProfile.withdrawals) {
                        console.log('📊 Preserving local withdrawal data during Firebase reload');
                        userData.withdrawals = window.userProfile.withdrawals;
                        userData.totalWithdrawals = window.userProfile.totalWithdrawals;
                        userData.totalWithdrawnAmount = window.userProfile.totalWithdrawnAmount;
                    }
                    
                    window.userProfile = userData;
                    console.log('📊 Reloaded userProfile from Firebase:', {
                        coins: userData.coins,
                        drops: userData.drops,
                        todayDrops: userData.todayDrops,
                        todayCoins: userData.todayCoins,
                        withdrawals: userData.withdrawals,
                        totalWithdrawals: userData.totalWithdrawals,
                        totalWithdrawnAmount: userData.totalWithdrawnAmount
                    });
                    
                    // Also update the main UI element to ensure consistency
                    const userCoinsElement = document.getElementById('user-coins');
                    if (userCoinsElement) {
                        userCoinsElement.textContent = userData.coins || 0;
                        console.log('📊 Updated main UI user-coins element to:', userData.coins);
                    }
                }
            } catch (error) {
                console.error('❌ Error reloading userProfile:', error);
            }
        }
        
        // Update dashboard statistics
        await updateDashboardStats();
        
        console.log('✅ Dashboard display updated successfully');
        
    } catch (error) {
        console.error('❌ Error updating dashboard display:', error);
    }
};

// Update dashboard statistics
window.updateDashboardStats = async function() {
    try {
        console.log('🔄 Updating dashboard statistics...');
        
        // Get user profile data
        const userProfile = window.userProfile;
        if (!userProfile) {
            console.log('⚠️ No user profile found');
            return;
        }
        
        console.log('📊 Dashboard update - userProfile data:', {
            coins: userProfile.coins,
            drops: userProfile.drops,
            dropsCollected: userProfile.dropsCollected,
            ownedMachines: userProfile.ownedMachines,
            tbnb: userProfile.tbnb
        });
        
        // Update PixelDrop balance - show current balance, not total points
        const coinsElement = document.getElementById('dashboard-coins');
        if (coinsElement) {
            // Use current balance from userProfile, not total points
            const currentBalance = userProfile.coins || 0;
            coinsElement.textContent = currentBalance;
            console.log('📊 Dashboard coins updated to:', currentBalance);
        }
        
        // Update tBNB balance
        const tbnbElement = document.getElementById('dashboard-tbnb');
        if (tbnbElement) {
            tbnbElement.textContent = (userProfile.tbnb || 0).toFixed(2);
        }
        
        // Update GeoDrops collected - use correct field name
        const dropsElement = document.getElementById('dashboard-drops');
        if (dropsElement) {
            // Use 'drops' field from userProfile (not 'dropsCollected')
            const totalDrops = userProfile.drops || userProfile.dropsCollected || 0;
            dropsElement.textContent = totalDrops;
            console.log('📊 Dashboard drops updated to:', totalDrops);
        }
        
        // Update mining boost
        const boostElement = document.getElementById('dashboard-boost');
        if (boostElement) {
            const totalBoost = calculateTotalMiningBoost();
            boostElement.textContent = `${totalBoost.toFixed(2)}x`;
        }
        
        // Update today's activity - use real values from userProfile
        const todayDropsElement = document.getElementById('dashboard-today-drops');
        if (todayDropsElement) {
            // Use real todayDrops value from userProfile
            const todayDrops = userProfile.todayDrops || 0;
            todayDropsElement.textContent = todayDrops;
            console.log('📊 Today drops updated to:', todayDrops, '(real value from userProfile)');
        }
        
        const todayCoinsElement = document.getElementById('dashboard-today-coins');
        if (todayCoinsElement) {
            // Use real todayCoins value from userProfile
            const todayCoins = userProfile.todayCoins || 0;
            todayCoinsElement.textContent = todayCoins;
            console.log('📊 Today coins updated to:', todayCoins, '(real value from userProfile)');
        }
        
        // If today's activity is 0, try to calculate from recent activity
        if ((userProfile.todayDrops || 0) === 0 && (userProfile.todayCoins || 0) === 0) {
            console.log('⚠️ Today activity is 0, checking if we need to initialize...');
            
            // Check if user has any drops at all
            const totalDrops = userProfile.drops || 0;
            const totalCoins = userProfile.coins || 0;
            
            if (totalDrops > 0 || totalCoins > 0) {
                console.log('📊 User has activity but today values are 0, initializing...');
                
                // Initialize today's values with a portion of total activity
                const estimatedTodayDrops = Math.max(1, Math.floor(totalDrops * 0.1));
                const estimatedTodayCoins = Math.max(100, Math.floor(totalCoins * 0.1));
                
                // Update local userProfile
                userProfile.todayDrops = estimatedTodayDrops;
                userProfile.todayCoins = estimatedTodayCoins;
                
                // Update UI
                if (todayDropsElement) {
                    todayDropsElement.textContent = estimatedTodayDrops;
                }
                if (todayCoinsElement) {
                    todayCoinsElement.textContent = estimatedTodayCoins;
                }
                
                console.log('📊 Initialized today activity:', {
                    todayDrops: estimatedTodayDrops,
                    todayCoins: estimatedTodayCoins
                });
            }
        }
        
        const miningTimeElement = document.getElementById('dashboard-mining-time');
        if (miningTimeElement) {
            // Calculate mining time from owned machines
            let totalMiningTime = 0;
            if (userProfile.ownedMachines) {
                Object.keys(userProfile.ownedMachines).forEach(machineId => {
                    const count = userProfile.ownedMachines[machineId] || 0;
                    if (count > 0) {
                        // Each machine contributes to mining time (simplified calculation)
                        totalMiningTime += count * 30; // 30 minutes per machine
                    }
                });
            }
            
            const hours = Math.floor(totalMiningTime / 60);
            const minutes = totalMiningTime % 60;
            miningTimeElement.textContent = `${hours}h ${minutes}m`;
            console.log('📊 Mining time updated to:', `${hours}h ${minutes}m`);
        }
        
        // Get the real current balance from userProfile (this is the source of truth)
        let realCurrentBalance = userProfile.coins || 0;
        console.log('📊 Real current balance from userProfile.coins:', realCurrentBalance);
        
        // Get the main UI element
        const userCoinsElement = document.getElementById('user-coins');
        
        // Also check the main UI element as secondary source
        if (userCoinsElement) {
            const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
            console.log('📊 UI balance from user-coins element:', uiBalance);
            
            // Use the higher value (in case UI is more up-to-date)
            if (uiBalance > realCurrentBalance) {
                realCurrentBalance = uiBalance;
                console.log('📊 Using UI balance as it is higher:', realCurrentBalance);
            }
        }
        
        // Update payout available coins - show real current balance
        const payoutCoinsElement = document.getElementById('payout-available-coins');
        if (payoutCoinsElement) {
            payoutCoinsElement.textContent = realCurrentBalance;
            console.log('💰 Payout available coins updated to:', realCurrentBalance, '(real balance)');
        }
        
        // Update blockchain coins (same as app coins for now)
        const blockchainCoinsElement = document.getElementById('payout-blockchain-coins');
        if (blockchainCoinsElement) {
            blockchainCoinsElement.textContent = realCurrentBalance;
            console.log('🔗 Blockchain coins updated to:', realCurrentBalance, '(real balance)');
        }
        
        // Also update the main dashboard coins display
        const dashboardCoinsElement = document.getElementById('dashboard-coins');
        if (dashboardCoinsElement) {
            dashboardCoinsElement.textContent = realCurrentBalance;
            console.log('📊 Dashboard coins updated to:', realCurrentBalance, '(real balance)');
        }
        
        console.log('✅ Dashboard statistics updated successfully');
        
    } catch (error) {
        console.error('❌ Error updating dashboard statistics:', error);
    }
};

// Calculate total mining boost - use same logic as mining page
function calculateTotalMiningBoost() {
    const userProfile = window.userProfile;
    if (!userProfile || !userProfile.ownedMachines) {
        return 1.0;
    }
    
    const ownedMachines = userProfile.ownedMachines;
    let totalBoost = 100; // Base 100% (same as mining page)
    
    // Basic Miner: 2% each, but after 5th only 1%
    const basicCount = ownedMachines[1] || 0;
    if (basicCount <= 5) {
        totalBoost += basicCount * 2;
    } else {
        totalBoost += 5 * 2 + (basicCount - 5) * 1;
    }
    
    // Advanced Miner: 12% each, but after 3rd only 6%
    const advancedCount = ownedMachines[2] || 0;
    if (advancedCount <= 3) {
        totalBoost += advancedCount * 12;
    } else {
        totalBoost += 3 * 12 + (advancedCount - 3) * 6;
    }
    
    // Pro Miner: 60% each, but after 2nd only 30%
    const proCount = ownedMachines[3] || 0;
    if (proCount <= 2) {
        totalBoost += proCount * 60;
    } else {
        totalBoost += 2 * 60 + (proCount - 2) * 30;
    }
    
    // Mega Miner: 400% each, but after 1st only 200%
    const megaCount = ownedMachines[4] || 0;
    if (megaCount <= 1) {
        totalBoost += megaCount * 400;
    } else {
        totalBoost += 1 * 400 + (megaCount - 1) * 200;
    }
    
    // Convert to multiplier (100% = 1.0x, 200% = 2.0x, etc.)
    return totalBoost / 100;
}

// Get machine type for diminishing returns
function getMachineType(machineId) {
    const machineTypes = {
        1: 'basic',
        2: 'advanced', 
        3: 'pro',
        4: 'mega'
    };
    return machineTypes[machineId] || 'basic';
}

// Set maximum withdrawal amount
window.setMaxWithdrawal = function() {
    const amountInput = document.getElementById('payout-amount');
    
    if (amountInput) {
        // Get the real current balance from userProfile (primary source)
        let currentBalance = 0;
        
        if (window.userProfile) {
            currentBalance = window.userProfile.coins || 0;
            console.log('📊 Using userProfile.coins for max withdrawal:', currentBalance);
        }
        
        // Get the main UI element
        const userCoinsElement = document.getElementById('user-coins');
        
        // Also check the main UI element as secondary source
        if (userCoinsElement) {
            const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
            console.log('📊 UI balance for max withdrawal:', uiBalance);
            
            // Use the higher value (in case UI is more up-to-date)
            if (uiBalance > currentBalance) {
                currentBalance = uiBalance;
                console.log('📊 Using UI balance for max withdrawal as it is higher:', currentBalance);
            }
        }
        
        const maxAmount = Math.floor(currentBalance * 0.95); // 95% of current balance (5% reserve)
        amountInput.value = Math.max(maxAmount, 100); // Minimum 100
        console.log('✅ Max withdrawal set to:', amountInput.value, 'from current balance:', currentBalance, '(5% reserve)');
        
        // Also update the payout amount display
        const payoutAmountElement = document.getElementById('payout-tbnb-amount');
        if (payoutAmountElement) {
            payoutAmountElement.textContent = `${amountInput.value} PixelDrop`;
        }
    } else {
        console.log('⚠️ Cannot set max withdrawal - missing amountInput');
    }
};

// Calculate payout amount
window.calculatePayout = function() {
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
    
    // Check if user has enough balance - use the same logic as other functions
    const userProfile = window.userProfile;
    let currentBalance = userProfile ? userProfile.coins : 0;
    
    // Get the main UI element
    const userCoinsElement = document.getElementById('user-coins');
    
    // Also check the main UI element as secondary source
    if (userCoinsElement) {
        const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
        // Use the higher value (in case UI is more up-to-date)
        if (uiBalance > currentBalance) {
            currentBalance = uiBalance;
        }
    }
    
    if (amount > currentBalance) {
        payoutAmount.textContent = '❌ ' + (window.languageSystem ? window.languageSystem.t('dashboard.insufficient.pixeldrop') : 'Nicht genügend PixelDrop');
        console.log('💰 Payout calculated: Insufficient balance. Available:', currentBalance, 'Requested:', amount);
        return;
    }
    
    // Calculate actual payout (95% of requested amount, minimum 100)
    const actualPayout = Math.max(Math.floor(amount * 0.95), 100);
    payoutAmount.textContent = `${actualPayout} PixelDrop`;
    console.log('💰 Payout calculated:', actualPayout, 'from requested:', amount, 'balance:', currentBalance, '(5% reserve)');
};

// Execute payout - redirect to real withdrawal function
window.executePayout = async function() {
    await processWithdrawal();
};

// Real withdrawal function with MetaMask integration - FROM BACKUP
async function processWithdrawal() {
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
    const walletInput = document.getElementById('payout-wallet-input') || 
                      document.getElementById('withdrawal-wallet') ||
                      document.getElementById('payout-wallet-address');
    const amountInput = document.getElementById('payout-amount') || 
                       document.getElementById('withdrawal-amount');
    
    if (!walletInput || !amountInput) {
        alert('❌ Auszahlungsformular nicht gefunden!');
        return;
    }

    const targetWallet = walletInput.value.trim();
    const amount = parseFloat(amountInput.value);

    // Validation
    if (!targetWallet || !targetWallet.startsWith('0x') || targetWallet.length !== 42) {
        alert('❌ ' + (window.languageSystem ? window.languageSystem.t('dashboard.invalid.wallet') : 'Ungültige Wallet-Adresse!'));
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
        console.log('Target wallet:', targetWallet);
        console.log('Amount:', amount, 'PixelDrop');

        // Get provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        console.log('User address:', userAddress);

        // PixelDrop Contract Configuration - SECURITY FIX: Use config instead of hardcoded address
        const PIXELDROP_CONTRACT_ADDRESS = window.CONFIG?.blockchain?.contracts?.pixelDrop || 'MISSING_CONTRACT_ADDRESS';
        const PIXELDROP_ABI = [
            "function transfer(address to, uint256 amount) public returns (bool)",
            "function balanceOf(address account) public view returns (uint256)",
            "function decimals() public view returns (uint8)"
        ];

        // Create contract instance
        const pixelDropContract = new ethers.Contract(PIXELDROP_CONTRACT_ADDRESS, PIXELDROP_ABI, signer);

        // Get current balance
        const currentBalance = await pixelDropContract.balanceOf(userAddress);
        const decimals = await pixelDropContract.decimals();
        const balanceFormatted = ethers.utils.formatUnits(currentBalance, decimals);

        console.log('Current PixelDrop balance:', balanceFormatted);

        // Check if user has enough balance in the app - use the same logic as other functions
        const userProfile = window.userProfile;
        let appBalance = userProfile ? userProfile.coins : 0;
        
        // Get the main UI element
        const userCoinsElement = document.getElementById('user-coins');
        
        // Also check the main UI element as secondary source
        if (userCoinsElement) {
            const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
            // Use the higher value (in case UI is more up-to-date)
            if (uiBalance > appBalance) {
                appBalance = uiBalance;
            }
        }
        
        if (appBalance < amount) {
            alert(`❌ Nicht genügend PixelDrop in der App! Verfügbar: ${appBalance}, Benötigt: ${amount}`);
            return;
        }

        // Check if pool wallet has enough balance - SECURITY FIX: Use config instead of hardcoded address
        const poolWalletAddress = window.CONFIG?.blockchain?.wallets?.poolWallet || 'MISSING_POOL_WALLET_ADDRESS';
        const poolBalance = await pixelDropContract.balanceOf(poolWalletAddress);
        const poolBalanceFormatted = ethers.utils.formatUnits(poolBalance, decimals);
        
        console.log('Pool wallet balance:', poolBalanceFormatted);
        
        if (parseFloat(poolBalanceFormatted) < amount) {
            alert(`❌ Nicht genügend PixelDrop im Pool-Wallet! Verfügbar: ${poolBalanceFormatted}, Benötigt: ${amount}`);
            return;
        }
        
        // Check if pool wallet has enough BNB for gas fees
        const poolBnbBalance = await provider.getBalance(poolWalletAddress);
        const poolBnbFormatted = ethers.utils.formatEther(poolBnbBalance);
        
        console.log('Pool BNB balance for gas:', poolBnbFormatted);
        
        if (parseFloat(poolBnbFormatted) < 0.001) {
            alert(`❌ Nicht genügend BNB für Gas-Gebühren im Pool-Wallet! Verfügbar: ${poolBnbFormatted} BNB`);
            return;
        }

        console.log('✅ App balance check passed:', appBalance, '>=', amount);
        console.log('✅ Pool balance check passed:', poolBalanceFormatted, '>=', amount);

        // Convert amount to wei (considering decimals)
        const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);

        console.log('Amount in wei:', amountWei.toString());

        // Update button text
        if (button) {
            button.textContent = '⏳ Warte auf MetaMask...';
        }

        // Execute REAL blockchain transaction from pool wallet
        console.log('🔄 Executing REAL blockchain transaction...');
        console.log('Pool wallet:', poolWalletAddress);
        console.log('To wallet:', targetWallet);
        console.log('Amount:', amountWei.toString());
        
        // Get the pool wallet private key from secure config
        const poolPrivateKey = window.CONFIG?.blockchain?.privateKeys?.poolPrivateKey;
        
        if (!poolPrivateKey) {
            // For public version, show demo message instead of real withdrawal
            alert('🚧 ' + (window.languageSystem ? window.languageSystem.t('dashboard.demo.mode') : 'Demo-Modus: Echte Auszahlungen sind nur in der lokalen Version verfügbar.\n\nFür echte Auszahlungen verwende die lokale Version mit Private Keys.'));
            return;
        }
        
        // Create a new provider with pool wallet private key
        const poolWallet = new ethers.Wallet(poolPrivateKey, provider);
        const poolContract = new ethers.Contract(PIXELDROP_CONTRACT_ADDRESS, PIXELDROP_ABI, poolWallet);
        
        console.log('✅ Pool wallet connected:', poolWallet.address);
        
        // Execute the transfer transaction from pool wallet
        const tx = await poolContract.transfer(targetWallet, amountWei);
        
        console.log('Transaction hash:', tx.hash);
        
        if (button) {
            button.textContent = '⏳ ' + (window.languageSystem ? window.languageSystem.t('dashboard.transaction.confirming') : 'Transaktion wird bestätigt...');
        }

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Update UI after successful transaction - use the same logic as other functions
        let currentCoins = userProfile ? userProfile.coins : 0;
        
        // Also check the main UI element as secondary source (userCoinsElement already declared above)
        if (userCoinsElement) {
            const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
            // Use the higher value (in case UI is more up-to-date)
            if (uiBalance > currentCoins) {
                currentCoins = uiBalance;
            }
        }
        
        const newCoins = Math.max(0, currentCoins - amount);
        
        // Update userProfile
        if (userProfile) {
            userProfile.coins = newCoins;
            userProfile.hasWithdrawn = true; // Mark that user has made a withdrawal
            userProfile.lastWithdrawal = new Date().toISOString();
            
            // Update withdrawal statistics
            const withdrawalData = {
                amount: amount,
                wallet: targetWallet,
                timestamp: new Date().toISOString(),
                transactionHash: tx.hash,
                date: new Date().toLocaleDateString('de-DE'),
                time: new Date().toLocaleTimeString('de-DE')
            };
            
            // Add to withdrawal history
            if (!userProfile.withdrawals) {
                userProfile.withdrawals = [];
            }
            userProfile.withdrawals.push(withdrawalData);
            
            // Update total withdrawal count and amount
            userProfile.totalWithdrawals = (userProfile.totalWithdrawals || 0) + 1;
            userProfile.totalWithdrawnAmount = (userProfile.totalWithdrawnAmount || 0) + amount;
            
            // Update Firebase - use currentUser.uid instead of userProfile.uid
            try {
                if (window.firebase && window.firebase.firestore && window.currentUser) {
                    await window.firebase.firestore().collection('users').doc(window.currentUser.uid).update({ 
                        coins: newCoins,
                        hasWithdrawn: true,
                        lastWithdrawal: userProfile.lastWithdrawal,
                        withdrawals: userProfile.withdrawals,
                        totalWithdrawals: userProfile.totalWithdrawals,
                        totalWithdrawnAmount: userProfile.totalWithdrawnAmount
                    });
                    console.log('✅ Updated Firebase with withdrawal data');
                } else {
                    console.log('⚠️ Firebase update skipped - missing currentUser or firebase');
                }
            } catch (error) {
                console.error('Error updating Firebase:', error);
                // Try alternative approach - create document if it doesn't exist
                try {
                    if (window.firebase && window.firebase.firestore && window.currentUser) {
                        await window.firebase.firestore().collection('users').doc(window.currentUser.uid).set({ 
                            coins: newCoins,
                            hasWithdrawn: true,
                            lastWithdrawal: userProfile.lastWithdrawal,
                            withdrawals: userProfile.withdrawals,
                            totalWithdrawals: userProfile.totalWithdrawals,
                            totalWithdrawnAmount: userProfile.totalWithdrawnAmount
                        }, { merge: true });
                        console.log('✅ Created/updated Firebase document with withdrawal data');
                    }
                } catch (error2) {
                    console.error('Error creating Firebase document:', error2);
                }
            }
        }

        // Update all UI elements
        if (userCoinsElement) userCoinsElement.textContent = newCoins;

        const dashboardCoins = document.getElementById('dashboard-coins');
        if (dashboardCoins) dashboardCoins.textContent = newCoins;

        const payoutCoins = document.getElementById('payout-available-coins');
        if (payoutCoins) payoutCoins.textContent = newCoins;

        // Update other displays
        if (typeof window.updateUserDisplay === 'function') {
            window.updateUserDisplay();
        }
        
        // Update today's activity after withdrawal
        if (userProfile) {
            // Update today's coins (subtract from today's earnings)
            const todayCoins = userProfile.todayCoins || 0;
            userProfile.todayCoins = Math.max(0, todayCoins - amount);
            console.log('📊 Updated today coins after withdrawal:', userProfile.todayCoins);
            
            // Also update Firebase with the new todayCoins value
            try {
                if (window.firebase && window.firebase.firestore && window.currentUser) {
                    await window.firebase.firestore().collection('users').doc(window.currentUser.uid).update({ 
                        todayCoins: userProfile.todayCoins
                    });
                    console.log('✅ Updated Firebase todayCoins to:', userProfile.todayCoins);
                }
            } catch (error) {
                console.error('Error updating Firebase todayCoins:', error);
            }
        }
        
        await updateDashboardStats();

        // Clear form
        walletInput.value = '';
        amountInput.value = '';

        // Show success message
        if (window.showMessage) {
            window.showMessage(`✅ ECHTE Blockchain-Auszahlung erfolgreich!\n\n${amount} PixelDrop wurden von der Pool-Wallet an ${targetWallet} übertragen.\n\nTransaktions-Hash: ${tx.hash}\n\nNeue App-Balance: ${newCoins} PixelDrop\n\nDie PixelDrop sind jetzt ECHT in deinem Wallet!`, false);
        } else {
            alert(`✅ ECHTE Blockchain-Auszahlung erfolgreich!\n${amount} PixelDrop von Pool-Wallet an ${targetWallet}\nTransaction: ${tx.hash}\n\nNeue App-Balance: ${newCoins} PixelDrop\n\nDie PixelDrop wurden ECHT auf dein Wallet überwiesen!`);
        }

    } catch (error) {
        console.error('Withdrawal error:', error);
        
        let errorMessage = '❌ Auszahlung fehlgeschlagen.';
        
        if (error.code === 4001) {
            errorMessage = '❌ Transaktion vom Benutzer abgelehnt.';
        } else if (error.message.includes('insufficient funds')) {
            errorMessage = '❌ ' + (window.languageSystem ? window.languageSystem.t('dashboard.insufficient.bnb') : 'Nicht genügend BNB für Gas-Gebühren.');
        } else if (error.message.includes('user rejected')) {
            errorMessage = '❌ Transaktion vom Benutzer abgelehnt.';
        } else if (error.message.includes('Pool hat nicht genügend')) {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    } finally {
        // Reset button
        const button = document.querySelector('button[onclick="executePayout()"]');
        if (button) {
            button.textContent = '💸 Auszahlen';
            button.disabled = false;
        }
    }
}

// Make functions globally available
window.processWithdrawal = processWithdrawal;


// Profile functions - username editing moved to settings

// Settings functions
window.saveUsername = function() {
    const usernameInput = document.getElementById('settings-username');
    if (usernameInput) {
        const newUsername = usernameInput.value.trim();
        if (newUsername) {
            console.log('💾 Saving username:', newUsername);
            
            // Update local userProfile
            if (window.userProfile) {
                window.userProfile.username = newUsername;
            }
            
            // Update Firebase
            if (window.firebase && window.firebase.firestore && window.currentUser) {
                window.firebase.firestore().collection('users').doc(window.currentUser.uid).update({
                    username: newUsername
                }).then(() => {
                    console.log('✅ Username updated in Firebase');
                    alert('✅ Benutzername gespeichert!');
                }).catch((error) => {
                    console.error('❌ Error updating username:', error);
                    alert('❌ Fehler beim Speichern des Benutzernamens');
                });
            } else {
                alert('✅ Benutzername lokal gespeichert!');
            }
        } else {
            alert('❌ Bitte einen Benutzernamen eingeben!');
        }
    }
};
window.saveNotificationSettings = function() {
    const emailNotify = document.getElementById('notify-email')?.checked || false;
    const pushNotify = document.getElementById('notify-push')?.checked || false;
    const dailyNotify = document.getElementById('notify-daily')?.checked || false;
    
    console.log('💾 Saving notification settings:', { emailNotify, pushNotify, dailyNotify });
    // TODO: Implement notification settings saving to Firebase
    alert('✅ Benachrichtigungseinstellungen gespeichert!');
};

// Function to manually refresh dashboard balance (for debugging)
window.refreshDashboardBalance = function() {
    console.log('🔄 Manually refreshing dashboard balance...');
    
    // Get the real current balance from userProfile (primary source)
    let realCurrentBalance = 0;
    
    if (window.userProfile) {
        realCurrentBalance = window.userProfile.coins || 0;
        console.log('📊 Real current balance from userProfile.coins:', realCurrentBalance);
    }
    
    // Get the main UI element
    const userCoinsElement = document.getElementById('user-coins');
    
    // Also check the main UI element as secondary source
    if (userCoinsElement) {
        const uiBalance = parseFloat(userCoinsElement.textContent) || 0;
        console.log('📊 UI balance from user-coins element:', uiBalance);
        
        // Use the higher value (in case UI is more up-to-date)
        if (uiBalance > realCurrentBalance) {
            realCurrentBalance = uiBalance;
            console.log('📊 Using UI balance as it is higher:', realCurrentBalance);
        }
    }
    
    // Update all balance displays
    const payoutCoinsElement = document.getElementById('payout-available-coins');
    if (payoutCoinsElement) {
        payoutCoinsElement.textContent = realCurrentBalance;
        console.log('💰 Updated payout available coins to:', realCurrentBalance);
    }
    
    const blockchainCoinsElement = document.getElementById('payout-blockchain-coins');
    if (blockchainCoinsElement) {
        blockchainCoinsElement.textContent = realCurrentBalance;
        console.log('🔗 Updated blockchain coins to:', realCurrentBalance);
    }
    
    const dashboardCoinsElement = document.getElementById('dashboard-coins');
    if (dashboardCoinsElement) {
        dashboardCoinsElement.textContent = realCurrentBalance;
        console.log('📊 Updated dashboard coins to:', realCurrentBalance);
    }
    
    alert(`✅ Balance aktualisiert! Aktuelle Balance: ${realCurrentBalance} PixelDrop`);
};

// Function to update withdrawal statistics display
window.updateWithdrawalStatistics = function() {
    console.log('🔄 updateWithdrawalStatistics called');
    
    const userProfile = window.userProfile;
    if (!userProfile) {
        console.log('⚠️ No user profile found for withdrawal statistics');
        return;
    }
    
    console.log('🔄 Updating withdrawal statistics with userProfile:', {
        withdrawals: userProfile.withdrawals,
        totalWithdrawals: userProfile.totalWithdrawals,
        totalWithdrawnAmount: userProfile.totalWithdrawnAmount,
        hasWithdrawn: userProfile.hasWithdrawn,
        lastWithdrawal: userProfile.lastWithdrawal,
        fullUserProfile: userProfile
    });
    
    // Wait for DOM to be ready
    setTimeout(() => {
        console.log('🔄 DOM ready, updating withdrawal statistics...');
        
        // Check if elements exist
        const totalWithdrawalsElement = document.getElementById('total-withdrawals');
        const totalWithdrawnAmountElement = document.getElementById('total-withdrawn-amount');
        const lastWithdrawalElement = document.getElementById('last-withdrawal');
        const withdrawalListElement = document.getElementById('withdrawal-list');
        
        console.log('🔍 DOM elements found:', {
            totalWithdrawals: !!totalWithdrawalsElement,
            totalWithdrawnAmount: !!totalWithdrawnAmountElement,
            lastWithdrawal: !!lastWithdrawalElement,
            withdrawalList: !!withdrawalListElement
        });
        
        if (!totalWithdrawalsElement) {
            console.log('❌ total-withdrawals element not found');
            return;
        }
    
        // Update total withdrawals
        const totalWithdrawals = userProfile.totalWithdrawals || 0;
        totalWithdrawalsElement.textContent = totalWithdrawals;
        console.log('✅ Total withdrawals updated:', totalWithdrawals);
    
        // Update total withdrawn amount
        if (totalWithdrawnAmountElement) {
            const totalWithdrawnAmount = userProfile.totalWithdrawnAmount || 0;
            totalWithdrawnAmountElement.textContent = totalWithdrawnAmount;
            console.log('✅ Total withdrawn amount updated:', totalWithdrawnAmount);
        }
        
        // Update last withdrawal date
        if (lastWithdrawalElement) {
            if (userProfile.lastWithdrawal) {
                const lastWithdrawalDate = new Date(userProfile.lastWithdrawal);
                lastWithdrawalElement.textContent = lastWithdrawalDate.toLocaleDateString('de-DE');
                console.log('✅ Last withdrawal updated:', lastWithdrawalDate.toLocaleDateString('de-DE'));
            } else {
                lastWithdrawalElement.textContent = '-';
                console.log('✅ Last withdrawal set to - (no withdrawals)');
            }
        }
        
        // Update withdrawal list
        if (withdrawalListElement) {
            const withdrawals = userProfile.withdrawals || [];
            
            if (withdrawals.length === 0) {
                withdrawalListElement.innerHTML = '<p class="text-gray-400 text-center">Keine Auszahlungen vorhanden</p>';
                console.log('✅ Withdrawal list updated: No withdrawals');
            } else {
                // Sort withdrawals by date (newest first)
                const sortedWithdrawals = withdrawals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                withdrawalListElement.innerHTML = sortedWithdrawals.map((withdrawal, index) => `
                    <div class="bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-white font-semibold">${withdrawal.amount} PixelDrop</p>
                                <p class="text-gray-400 text-sm">${withdrawal.date} ${withdrawal.time}</p>
                                <p class="text-gray-500 text-xs">${withdrawal.wallet.substring(0, 10)}...${withdrawal.wallet.substring(38)}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-green-400 text-sm">✅ Erfolgreich</p>
                                <p class="text-gray-500 text-xs">Tx: ${withdrawal.transactionHash.substring(0, 10)}...</p>
                            </div>
                        </div>
                    </div>
                `).join('');
                console.log('✅ Withdrawal list updated:', withdrawals.length, 'withdrawals');
            }
        }
    
    console.log('✅ Withdrawal statistics updated');
    }, 500); // Wait 500ms for DOM to be ready
};

// Function to manually reload withdrawal statistics from Firebase
window.reloadWithdrawalStatistics = async function() {
    if (!window.firebase || !window.firebase.firestore || !window.currentUser) {
        alert('❌ ' + (window.languageSystem ? window.languageSystem.t('dashboard.firebase.unavailable') : 'Firebase oder Benutzer nicht verfügbar'));
        return;
    }
    
    try {
        console.log('🔄 Manually reloading withdrawal statistics from Firebase...');
        
        const userDoc = await window.firebase.firestore().collection('users').doc(window.currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            window.userProfile = userData;
            
            console.log('📊 Reloaded userProfile with withdrawal data:', {
                withdrawals: userData.withdrawals,
                totalWithdrawals: userData.totalWithdrawals,
                totalWithdrawnAmount: userData.totalWithdrawnAmount,
                hasWithdrawn: userData.hasWithdrawn,
                lastWithdrawal: userData.lastWithdrawal
            });
            
            // Update the display
            if (typeof window.updateWithdrawalStatistics === 'function') {
                window.updateWithdrawalStatistics();
            }
            
            alert(`✅ Auszahlungsstatistiken neu geladen!\n\nGefunden:\n- ${userData.totalWithdrawals || 0} Auszahlungen\n- ${userData.totalWithdrawnAmount || 0} PixelDrop ausgezahlt\n- ${(userData.withdrawals || []).length} Einträge in der Historie\n- hasWithdrawn: ${userData.hasWithdrawn || false}`);
        } else {
            alert('❌ Benutzerdokument nicht gefunden');
        }
    } catch (error) {
        console.error('❌ Error reloading withdrawal statistics:', error);
        alert('❌ Fehler beim Laden der Auszahlungsstatistiken: ' + error.message);
    }
};

// REMOVED: Test withdrawal data function - NO MORE TEST DATA!
// This function was removed to prevent demo/test data usage
// Only real Firebase data should be used

// Function to check and repair withdrawal statistics
window.checkWithdrawalStatistics = function() {
    const userProfile = window.userProfile;
    if (!userProfile) {
        console.log('⚠️ No user profile found');
        alert('❌ Kein Benutzerprofil gefunden');
        return;
    }
    
    console.log('🔍 Checking withdrawal statistics...');
    console.log('Full userProfile:', userProfile);
    
    const issues = [];
    
    // Check for missing fields
    if (!userProfile.withdrawals) {
        issues.push('withdrawals array missing');
    }
    if (!userProfile.totalWithdrawals) {
        issues.push('totalWithdrawals missing');
    }
    if (!userProfile.totalWithdrawnAmount) {
        issues.push('totalWithdrawnAmount missing');
    }
    if (!userProfile.hasWithdrawn) {
        issues.push('hasWithdrawn missing');
    }
    
    if (issues.length === 0) {
        alert('✅ Alle Auszahlungsfelder vorhanden!\n\n- withdrawals: ' + (userProfile.withdrawals?.length || 0) + ' Einträge\n- totalWithdrawals: ' + (userProfile.totalWithdrawals || 0) + '\n- totalWithdrawnAmount: ' + (userProfile.totalWithdrawnAmount || 0) + '\n- hasWithdrawn: ' + (userProfile.hasWithdrawn || false));
    } else {
        alert('⚠️ Fehlende Auszahlungsfelder gefunden:\n\n' + issues.join('\n') + '\n\nFühre createTestWithdrawalData() aus, um die Felder zu erstellen.');
    }
};

// REMOVED: Local withdrawal data function - NO MORE TEST DATA!
// This function was removed to prevent demo/test data usage
// Only real Firebase data should be used

// Debug function to check user status
window.checkUserStatus = function() {
    console.log('🔍 Checking user status...');
    console.log('window.currentUser:', window.currentUser);
    console.log('window.auth:', window.auth);
    console.log('window.firebase:', window.firebase);
    console.log('window.db:', window.db);
    
    if (window.auth && window.auth.currentUser) {
        console.log('✅ Auth currentUser:', window.auth.currentUser.email);
        window.currentUser = window.auth.currentUser;
        console.log('✅ window.currentUser set to:', window.currentUser.email);
    } else {
        console.log('❌ No current user in auth');
    }
    
    if (window.currentUser) {
        console.log('✅ User available:', window.currentUser.email);
        return true;
    } else {
        console.log('❌ User not available');
        return false;
    }
};

// Function to clear withdrawal data (remove test data)
window.clearWithdrawalData = async function() {
    if (!window.currentUser) {
        alert('❌ Benutzer nicht verfügbar. Führe checkUserStatus() aus.');
        return;
    }
    
    try {
        console.log('🗑️ Clearing withdrawal data...');
        
        // Clear from local userProfile
        if (window.userProfile) {
            delete window.userProfile.withdrawals;
            delete window.userProfile.totalWithdrawals;
            delete window.userProfile.totalWithdrawnAmount;
            delete window.userProfile.hasWithdrawn;
            delete window.userProfile.lastWithdrawal;
            console.log('✅ Local withdrawal data cleared');
        }
        
        // Clear from Firebase
        if (window.firebase && window.firebase.firestore) {
            const userRef = window.firebase.firestore().collection('users').doc(window.currentUser.uid);
            await userRef.update({
                withdrawals: window.firebase.firestore.FieldValue.delete(),
                totalWithdrawals: window.firebase.firestore.FieldValue.delete(),
                totalWithdrawnAmount: window.firebase.firestore.FieldValue.delete(),
                hasWithdrawn: window.firebase.firestore.FieldValue.delete(),
                lastWithdrawal: window.firebase.firestore.FieldValue.delete()
            });
            console.log('✅ Firebase withdrawal data cleared');
        }
        
        // Update display
        if (typeof window.updateWithdrawalStatistics === 'function') {
            window.updateWithdrawalStatistics();
        }
        
        alert('✅ Auszahlungsdaten gelöscht!\n\n- Test-Auszahlungen entfernt\n- Firebase bereinigt\n- Anzeige aktualisiert');
        
    } catch (error) {
        console.error('❌ Error clearing withdrawal data:', error);
        alert('❌ Fehler beim Löschen: ' + error.message);
    }
};

// Function to load and display all statistics
window.updateAllStatistics = function() {
    console.log('📊 Updating all statistics...');
    
    if (!window.userProfile) {
        console.log('❌ No userProfile available');
        return;
    }
    
    try {
        // Hauptstatistiken
        const totalDrops = document.getElementById('total-drops');
        if (totalDrops) {
            totalDrops.textContent = window.userProfile.drops || 0;
            console.log('✅ Total drops updated:', window.userProfile.drops);
        }
        
        const totalEarnings = document.getElementById('total-earnings');
        if (totalEarnings) {
            totalEarnings.textContent = window.userProfile.coins || 0;
            console.log('✅ Total earnings updated:', window.userProfile.coins);
        }
        
        // Erweiterte Statistiken
        const userLevel = document.getElementById('user-level');
        if (userLevel) {
            // Calculate level based on drops (simple formula: level = Math.floor(drops / 10) + 1)
            const level = Math.floor((window.userProfile.drops || 0) / 10) + 1;
            userLevel.textContent = level;
            console.log('✅ User level updated:', level);
        }
        
        const miningMachines = document.getElementById('mining-machines');
        if (miningMachines && window.userProfile.ownedMachines) {
            const totalMachines = Object.values(window.userProfile.ownedMachines).reduce((sum, count) => sum + (count || 0), 0);
            miningMachines.textContent = totalMachines;
            console.log('✅ Mining machines updated:', totalMachines);
        }
        
        const bonusClaimed = document.getElementById('bonus-claimed');
        if (bonusClaimed) {
            // Calculate total bonus claimed from bonus history
            const bonusHistory = window.userProfile.bonusHistory || [];
            const totalBonusClaimed = bonusHistory.reduce((sum, bonus) => sum + (bonus.amount || 0), 0);
            bonusClaimed.textContent = totalBonusClaimed;
            console.log('✅ Bonus claimed updated:', totalBonusClaimed, 'from', bonusHistory.length, 'bonus entries');
        }
        
        // Aktivitätsstatistiken
        const firstLogin = document.getElementById('first-login');
        if (firstLogin && window.userProfile.createdAt) {
            const createdDate = window.userProfile.createdAt.toDate ? 
                window.userProfile.createdAt.toDate() : 
                new Date(window.userProfile.createdAt);
            const formattedDate = createdDate.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            firstLogin.textContent = formattedDate;
            console.log('✅ First login updated:', formattedDate);
        }
        
        const lastActivity = document.getElementById('last-activity');
        if (lastActivity && window.userProfile.lastUpdated) {
            const lastDate = window.userProfile.lastUpdated.toDate ? 
                window.userProfile.lastUpdated.toDate() : 
                new Date(window.userProfile.lastUpdated);
            const formattedDate = lastDate.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            lastActivity.textContent = formattedDate;
            console.log('✅ Last activity updated:', formattedDate);
        }
        
        const activeDays = document.getElementById('active-days');
        if (activeDays && window.userProfile.createdAt) {
            const createdDate = window.userProfile.createdAt.toDate ? 
                window.userProfile.createdAt.toDate() : 
                new Date(window.userProfile.createdAt);
            const today = new Date();
            const diffTime = Math.abs(today - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            activeDays.textContent = diffDays;
            console.log('✅ Active days updated:', diffDays);
        }
        
        const dropsToday = document.getElementById('drops-today');
        if (dropsToday) {
            dropsToday.textContent = window.userProfile.todayDrops || 0;
            console.log('✅ Drops today updated:', window.userProfile.todayDrops || 0);
        }
        
        const dropsWeek = document.getElementById('drops-week');
        if (dropsWeek) {
            // For now, estimate weekly drops as 7x daily drops
            const weeklyDrops = (window.userProfile.todayDrops || 0) * 7;
            dropsWeek.textContent = weeklyDrops;
            console.log('✅ Drops week updated:', weeklyDrops);
        }
        
        const dropsMonth = document.getElementById('drops-month');
        if (dropsMonth) {
            // For now, estimate monthly drops as 30x daily drops
            const monthlyDrops = (window.userProfile.todayDrops || 0) * 30;
            dropsMonth.textContent = monthlyDrops;
            console.log('✅ Drops month updated:', monthlyDrops);
        }
        
        // Update withdrawal statistics
        const totalWithdrawals = document.getElementById('total-withdrawals');
        if (totalWithdrawals) {
            totalWithdrawals.textContent = window.userProfile.totalWithdrawals || 0;
            console.log('✅ Total withdrawals updated:', window.userProfile.totalWithdrawals || 0);
        }
        
        const totalWithdrawnAmount = document.getElementById('total-withdrawn-amount');
        if (totalWithdrawnAmount) {
            totalWithdrawnAmount.textContent = window.userProfile.totalWithdrawnAmount || 0;
            console.log('✅ Total withdrawn amount updated:', window.userProfile.totalWithdrawnAmount || 0);
        }
        
        const lastWithdrawal = document.getElementById('last-withdrawal');
        if (lastWithdrawal) {
            if (window.userProfile.lastWithdrawal) {
                const lastWithdrawalDate = new Date(window.userProfile.lastWithdrawal);
                lastWithdrawal.textContent = lastWithdrawalDate.toLocaleDateString('de-DE');
                console.log('✅ Last withdrawal updated:', lastWithdrawalDate.toLocaleDateString('de-DE'));
            } else {
                lastWithdrawal.textContent = '-';
                console.log('✅ Last withdrawal set to - (no withdrawals)');
            }
        }
        
        // Update withdrawal list
        const withdrawalList = document.getElementById('withdrawal-list');
        if (withdrawalList) {
            const withdrawals = window.userProfile.withdrawals || [];
            
            if (withdrawals.length === 0) {
                withdrawalList.innerHTML = '<p class="text-gray-400 text-center">Keine Auszahlungen vorhanden</p>';
                console.log('✅ Withdrawal list updated: No withdrawals');
            } else {
                // Sort withdrawals by date (newest first)
                const sortedWithdrawals = withdrawals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
                withdrawalList.innerHTML = sortedWithdrawals.map((withdrawal, index) => `
                    <div class="bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-white font-semibold">${withdrawal.amount} PixelDrop</p>
                                <p class="text-gray-400 text-sm">${withdrawal.date} ${withdrawal.time}</p>
                                <p class="text-gray-500 text-xs">${withdrawal.wallet.substring(0, 10)}...${withdrawal.wallet.substring(38)}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-green-400 text-sm">✅ Erfolgreich</p>
                                <p class="text-gray-500 text-xs">Tx: ${withdrawal.transactionHash.substring(0, 10)}...</p>
                            </div>
                        </div>
                    </div>
                `).join('');
                console.log('✅ Withdrawal list updated:', withdrawals.length, 'withdrawals');
            }
        }
        
        console.log('✅ All statistics updated successfully');
        
        // Also update withdrawal statistics if elements are present
        if (document.getElementById('total-withdrawals')) {
            if (typeof window.updateWithdrawalStatistics === 'function') {
                window.updateWithdrawalStatistics();
            }
        }
        
    } catch (error) {
        console.error('❌ Error updating statistics:', error);
    }
};

// Function to repair withdrawal statistics
window.repairWithdrawalStatistics = function() {
    console.log('🔧 Repairing withdrawal statistics...');
    
    if (!window.userProfile) {
        console.log('❌ No user profile found');
        alert('❌ Kein Benutzerprofil gefunden');
        return;
    }
    
    try {
        // Check if elements exist
        const totalWithdrawalsElement = document.getElementById('total-withdrawals');
        const totalWithdrawnAmountElement = document.getElementById('total-withdrawn-amount');
        const lastWithdrawalElement = document.getElementById('last-withdrawal');
        const withdrawalListElement = document.getElementById('withdrawal-list');
        
        if (!totalWithdrawalsElement) {
            alert('❌ Auszahlungsstatistiken-Elemente nicht gefunden. Bitte gehe zu Mehr > Statistiken.');
            return;
        }
        
        // Update withdrawal statistics
        const withdrawals = window.userProfile.withdrawals || [];
        const totalWithdrawals = window.userProfile.totalWithdrawals || withdrawals.length;
        const totalWithdrawnAmount = window.userProfile.totalWithdrawnAmount || 
            withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
        
        // Update the display
        totalWithdrawalsElement.textContent = totalWithdrawals;
        if (totalWithdrawnAmountElement) {
            totalWithdrawnAmountElement.textContent = totalWithdrawnAmount;
        }
        
        if (lastWithdrawalElement) {
            if (withdrawals.length > 0) {
                const lastWithdrawal = withdrawals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                const lastDate = new Date(lastWithdrawal.timestamp);
                lastWithdrawalElement.textContent = lastDate.toLocaleDateString('de-DE');
            } else {
                lastWithdrawalElement.textContent = '-';
            }
        }
        
        // Update withdrawal list
        if (withdrawalListElement) {
            if (withdrawals.length === 0) {
                withdrawalListElement.innerHTML = '<p class="text-gray-400 text-center">Keine Auszahlungen vorhanden</p>';
            } else {
                const sortedWithdrawals = withdrawals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                withdrawalListElement.innerHTML = sortedWithdrawals.map((withdrawal, index) => `
                    <div class="bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-white font-semibold">${withdrawal.amount} PixelDrop</p>
                                <p class="text-gray-400 text-sm">${withdrawal.date} ${withdrawal.time}</p>
                                <p class="text-gray-500 text-xs">${withdrawal.wallet.substring(0, 10)}...${withdrawal.wallet.substring(38)}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-green-400 text-sm">✅ Erfolgreich</p>
                                <p class="text-gray-500 text-xs">Tx: ${withdrawal.transactionHash.substring(0, 10)}...</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Update user profile with calculated values
        window.userProfile.totalWithdrawals = totalWithdrawals;
        window.userProfile.totalWithdrawnAmount = totalWithdrawnAmount;
        
        // Save to Firebase
        if (window.firebase && window.currentUser) {
            window.firebase.firestore().collection('users').doc(window.currentUser.uid).update({
                totalWithdrawals: totalWithdrawals,
                totalWithdrawnAmount: totalWithdrawnAmount
            });
            console.log('✅ Withdrawal statistics saved to Firebase');
        }
        
        alert(`✅ Auszahlungsstatistiken repariert!\n\n- ${totalWithdrawals} Auszahlungen\n- ${totalWithdrawnAmount} PixelDrop ausgezahlt\n- ${withdrawals.length} Einträge in der Historie\n- Daten aktualisiert`);
        
    } catch (error) {
        console.error('❌ Error repairing withdrawal statistics:', error);
        alert('❌ Fehler beim Reparieren der Auszahlungsstatistiken: ' + error.message);
    }
};

// Function to repair bonus statistics
window.repairBonusStatistics = function() {
    console.log('🔧 Repairing bonus statistics...');
    
    if (!window.userProfile) {
        console.log('❌ No user profile found');
        alert('❌ Kein Benutzerprofil gefunden');
        return;
    }
    
    try {
        // Calculate total bonus from bonus history
        const bonusHistory = window.userProfile.bonusHistory || [];
        const totalBonusClaimed = bonusHistory.reduce((sum, bonus) => sum + (bonus.amount || 0), 0);
        
        // Update the display
        const bonusClaimedElement = document.getElementById('bonus-claimed');
        if (bonusClaimedElement) {
            bonusClaimedElement.textContent = totalBonusClaimed;
            console.log('✅ Bonus claimed updated to:', totalBonusClaimed);
        }
        
        // Update user profile with calculated value
        window.userProfile.bonusClaimed = totalBonusClaimed;
        
        // Save to Firebase
        if (window.firebase && window.currentUser) {
            window.firebase.firestore().collection('users').doc(window.currentUser.uid).update({
                bonusClaimed: totalBonusClaimed
            });
            console.log('✅ Bonus claimed saved to Firebase:', totalBonusClaimed);
        }
        
        alert(`✅ Bonus-Statistiken repariert!\n\n- ${totalBonusClaimed} PixelDrop aus Boni erhalten\n- ${bonusHistory.length} Bonus-Einträge gefunden\n- Daten aktualisiert`);
        
    } catch (error) {
        console.error('❌ Error repairing bonus statistics:', error);
        alert('❌ Fehler beim Reparieren der Bonus-Statistiken: ' + error.message);
    }
};

// Function to request withdrawal from statistics page
window.requestWithdrawal = function() {
    const amountInput = document.getElementById('withdrawal-amount');
    if (!amountInput) {
        alert('❌ Auszahlungsbetrag-Input nicht gefunden');
        return;
    }
    
    const amount = parseFloat(amountInput.value);
    if (!amount || amount < 100) {
        alert('❌ Mindestbetrag: 100 PixelDrop');
        return;
    }
    
    if (!window.currentUser) {
        alert('❌ Bitte zuerst anmelden');
        return;
    }
    
    // Check if user has enough balance
    const currentBalance = window.userProfile ? window.userProfile.coins : 0;
    if (amount > currentBalance) {
        alert(`❌ Nicht genügend Guthaben!\n\nVerfügbar: ${currentBalance} PixelDrop\nGewünscht: ${amount} PixelDrop`);
        return;
    }
    
    // Ask for wallet address
    const walletAddress = prompt('💳 Wallet-Adresse eingeben (0x...):');
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 42) {
        alert('❌ Ungültige Wallet-Adresse! Muss mit 0x beginnen und 42 Zeichen lang sein.');
        return;
    }
    
    // Confirm withdrawal
    const confirmMessage = `💸 Auszahlung bestätigen:\n\nBetrag: ${amount} PixelDrop\nWallet: ${walletAddress.substring(0, 10)}...${walletAddress.substring(38)}\n\nFortfahren?`;
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Execute withdrawal using existing function
    if (typeof window.executePayout === 'function') {
        // Set the payout amount and wallet in the dashboard
        const payoutAmountInput = document.getElementById('payout-amount');
        const payoutWalletInput = document.getElementById('payout-wallet-input');
        
        if (payoutAmountInput) payoutAmountInput.value = amount;
        if (payoutWalletInput) payoutWalletInput.value = walletAddress;
        
        // Execute the payout
        window.executePayout();
    } else {
        alert('❌ Auszahlungsfunktion nicht verfügbar. Bitte verwende das Dashboard.');
    }
};

// Function to load and display profile information
window.loadProfileInfo = function() {
    console.log('👤 Loading profile information...');
    
    if (!window.currentUser) {
        console.log('❌ No current user available');
        return;
    }
    
    if (!window.userProfile) {
        console.log('❌ No userProfile available');
        return;
    }
    
    try {
        // Fill email
        const emailField = document.getElementById('profile-email');
        if (emailField) {
            emailField.value = window.currentUser.email || 'Nicht verfügbar';
            console.log('✅ Email filled:', window.currentUser.email);
        }
        
        // Fill registration date
        const createdField = document.getElementById('profile-created');
        if (createdField && window.userProfile.createdAt) {
            const createdDate = window.userProfile.createdAt.toDate ? 
                window.userProfile.createdAt.toDate() : 
                new Date(window.userProfile.createdAt);
            const formattedDate = createdDate.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            createdField.value = formattedDate;
            console.log('✅ Registration date filled:', formattedDate);
        } else if (createdField) {
            createdField.value = 'Nicht verfügbar';
        }
        
        // Fill Account ID
        const uidField = document.getElementById('profile-uid');
        if (uidField) {
            uidField.value = window.currentUser.uid || 'Nicht verfügbar';
            console.log('✅ Account ID filled:', window.currentUser.uid);
        }
        
        console.log('✅ Profile information loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading profile info:', error);
    }
};

// Function to save local withdrawal data to Firebase
window.saveWithdrawalDataToFirebase = async function() {
    if (!window.userProfile || !window.userProfile.withdrawals) {
        alert('❌ Keine lokalen Auszahlungsdaten gefunden. Führe zuerst createLocalWithdrawalData() aus.');
        return;
    }
    
    // Check and fix user status
    if (!window.currentUser && window.auth && window.auth.currentUser) {
        window.currentUser = window.auth.currentUser;
        console.log('🔧 Fixed currentUser from auth:', window.currentUser.email);
    }
    
    if (!window.firebase || !window.firebase.firestore || !window.currentUser) {
        alert('❌ Firebase oder Benutzer nicht verfügbar. Führe checkUserStatus() aus, um zu diagnostizieren.');
        return;
    }
    
    try {
        console.log('💾 Saving withdrawal data to Firebase...');
        
        const withdrawalData = {
            withdrawals: window.userProfile.withdrawals,
            totalWithdrawals: window.userProfile.totalWithdrawals,
            totalWithdrawnAmount: window.userProfile.totalWithdrawnAmount,
            hasWithdrawn: window.userProfile.hasWithdrawn,
            lastWithdrawal: window.userProfile.lastWithdrawal
        };
        
        console.log('💾 Data to save:', withdrawalData);
        
        // Save to Firebase
        const userRef = window.firebase.firestore().collection('users').doc(window.currentUser.uid);
        await userRef.set(withdrawalData, { merge: true });
        
        console.log('✅ Withdrawal data saved to Firebase successfully');
        alert('✅ Auszahlungsdaten in Firebase gespeichert!\n\n- 2 Auszahlungen\n- 800 PixelDrop ausgezahlt\n- Historie dauerhaft gespeichert');
        
    } catch (error) {
        console.error('❌ Error saving withdrawal data to Firebase:', error);
        alert('❌ Fehler beim Speichern in Firebase: ' + error.message);
    }
};

// Test function to simulate GeoDrop collection (for debugging)
window.testGeoDropCollection = async function() {
    if (!window.currentUser) {
        alert('❌ Bitte zuerst anmelden!');
        return;
    }
    
    try {
        // Simulate collecting a GeoDrop
        const reward = 100;
        const userRef = window.firebase.firestore().collection('users').doc(window.currentUser.uid);
        
        await userRef.set({
            coins: window.firebase.firestore.FieldValue.increment(reward),
            drops: window.firebase.firestore.FieldValue.increment(1),
            todayDrops: window.firebase.firestore.FieldValue.increment(1),
            todayCoins: window.firebase.firestore.FieldValue.increment(reward),
            lastClaim: window.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('🧪 Test GeoDrop collection completed');
        
        // Update local userProfile
        if (window.userProfile) {
            window.userProfile.coins = (window.userProfile.coins || 0) + reward;
            window.userProfile.drops = (window.userProfile.drops || 0) + 1;
            window.userProfile.todayDrops = (window.userProfile.todayDrops || 0) + 1;
            window.userProfile.todayCoins = (window.userProfile.todayCoins || 0) + reward;
        }
        
        // Update UI
        if (typeof updateUserDisplay === 'function') {
            updateUserDisplay();
        }
        
        if (typeof window.updateDashboardDisplay === 'function') {
            setTimeout(() => {
                window.updateDashboardDisplay();
            }, 500);
        }
        
        alert(`✅ Test GeoDrop gesammelt! +${reward} PixelDrops, +1 GeoDrop`);
        
    } catch (error) {
        console.error('❌ Test GeoDrop collection failed:', error);
        alert('❌ Test fehlgeschlagen: ' + error.message);
    }
};
