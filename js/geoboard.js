// GeoBoard Functions - Load real data from Firebase

window.refreshLeaderboard = function() {
    const db = window.db || db;
    if (typeof db === 'undefined' || !db) {
        console.error('❌ Firebase nicht verfügbar');
        return;
    }
    
    const leaderboard = document.getElementById('leaderboard');
    if (!leaderboard) return;
    
    leaderboard.innerHTML = '<div class="text-center text-gray-400 p-4">Lade Rangliste...</div>';
    
    // Load all users and sort by points (coins) - FIXED: Remove duplicate usernames (keep highest points)
    db.collection('users')
        .orderBy('coins', 'desc')
        .limit(20) // Load more to filter duplicates
        .get()
        .then(querySnapshot => {
            let html = '';
            let rank = 1;
            const seenUsernames = new Map(); // Track seen usernames with their highest points
            
            querySnapshot.forEach(doc => {
                const userData = doc.data();
                const username = userData.username || userData.email?.split('@')[0] || 'Unbekannt';
                const points = userData.coins || 0;
                const userId = doc.id;
                
                // If we've seen this username before, only keep the one with higher points
                if (seenUsernames.has(username)) {
                    const existingPoints = seenUsernames.get(username);
                    if (points <= existingPoints) {
                        console.log('⚠️ Skipping duplicate username with lower points:', username, points, 'vs', existingPoints);
                        return;
                    } else {
                        console.log('🔄 Replacing username with higher points:', username, points, 'vs', existingPoints);
                    }
                }
                
                seenUsernames.set(username, points);
                
                let rankColor = 'text-gray-300';
                if (rank === 1) rankColor = 'text-yellow-400';
                else if (rank === 2) rankColor = 'text-gray-300';
                else if (rank === 3) rankColor = 'text-orange-400';
                else if (rank <= 5) rankColor = 'text-blue-400';
                else rankColor = 'text-green-400';
                
                html += `
                    <div class="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                        <span class="text-white font-bold">${rank}. ${username}</span>
                        <span class="${rankColor}">${points} Punkte</span>
                    </div>
                `;
                rank++;
                
                // Stop after 10 unique users
                if (rank > 10) return;
            });
            
            if (html === '') {
                html = '<div class="text-center text-gray-400 p-4">Noch keine User registriert</div>';
            }
            
            leaderboard.innerHTML = html;
            console.log('✅ Rangliste aktualisiert (Duplikate entfernt)');
        })
        .catch(error => {
            console.error('Error loading leaderboard:', error);
            // Don't show error to user if it's a permission issue (user not logged in)
            if (error.code === 'permission-denied' || error.message.includes('permissions')) {
                console.log('🔒 User not logged in, skipping leaderboard load');
                leaderboard.innerHTML = '<div class="text-center text-gray-400 p-4">Bitte zuerst anmelden</div>';
                return;
            }
            leaderboard.innerHTML = '<div class="text-center text-red-400 p-4">Fehler beim Laden der Rangliste</div>';
        });
};

window.refreshUserStats = function() {
    const auth = window.auth || auth;
    const db = window.db || db;
    
    if (typeof auth === 'undefined' || !auth || !auth.currentUser) {
        console.log('❌ Bitte zuerst anmelden');
        return;
    }
    
    if (typeof db === 'undefined' || !db) {
        console.error('❌ Firebase nicht verfügbar');
        return;
    }
    
    // Load current user data
    db.collection('users').doc(auth.currentUser.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                
                const usernameEl = document.getElementById('stats-username');
                const coinsEl = document.getElementById('stats-coins');
                const tbnbEl = document.getElementById('stats-tbnb');
                const dropsEl = document.getElementById('stats-drops');
                const boostEl = document.getElementById('stats-boost');
                
                if (usernameEl) usernameEl.textContent = userData.username || userData.email?.split('@')[0] || 'Unbekannt';
                if (coinsEl) coinsEl.textContent = userData.coins || 0;
                if (tbnbEl) tbnbEl.textContent = (userData.tbnb || 0).toFixed(2);
                if (dropsEl) dropsEl.textContent = userData.drops || 0;
                
                // Update bonus statistics - FIXED: Count indirect referrals
                const bonusClaimedEl = document.getElementById('stats-bonus-claimed');
                const referralCountEl = document.getElementById('stats-referral-count');
                const referralEarningsEl = document.getElementById('stats-referral-earnings');
                const activeReferralsEl = document.getElementById('stats-active-referrals');
                
                // FIX: Calculate real bonus from bonus history
                if (bonusClaimedEl) {
                    const bonusHistory = userData.bonusHistory || [];
                    const totalBonusClaimed = bonusHistory.reduce((sum, bonus) => sum + (bonus.amount || 0), 0);
                    bonusClaimedEl.textContent = totalBonusClaimed;
                    console.log('🎁 Real bonus calculated:', totalBonusClaimed, 'from', bonusHistory.length, 'entries');
                }
                if (referralCountEl) referralCountEl.textContent = userData.referralCount || 0;
                if (referralEarningsEl) referralEarningsEl.textContent = userData.referralEarnings || 0;
                
                // Count indirect referrals (referrals of referrals)
                if (activeReferralsEl) {
                    db.collection('users')
                        .where('referredBy', '==', auth.currentUser.uid)
                        .get()
                        .then(directReferrals => {
                            let indirectCount = 0;
                            const promises = [];
                            
                            directReferrals.forEach(directRef => {
                                promises.push(
                                    db.collection('users')
                                        .where('referredBy', '==', directRef.id)
                                        .get()
                                        .then(indirectRefs => {
                                            indirectCount += indirectRefs.size;
                                        })
                                );
                            });
                            
                            Promise.all(promises).then(() => {
                                activeReferralsEl.textContent = indirectCount;
                                console.log('✅ Indirect referrals counted:', indirectCount);
                            });
                        })
                        .catch(error => {
                            console.error('Error counting indirect referrals:', error);
                            activeReferralsEl.textContent = '0';
                        });
                }
                
                // Calculate mining boost from owned machines - USE EXACT SAME LOGIC AS MINING-FUNCTIONS
                let miningBoost = 1.0;
                if (userData.ownedMachines) {
                    const machines = [
                        { id: 1, baseBoost: 0.02 },
                        { id: 2, baseBoost: 0.12 },
                        { id: 3, baseBoost: 0.60 },
                        { id: 4, baseBoost: 4.00 }
                    ];
                    
                    machines.forEach(machine => {
                        // Check consistent format first (machineType as number key)
                        let count = 0;
                        if (userData.ownedMachines[machine.id] !== undefined) {
                            count = userData.ownedMachines[machine.id];
                        }
                        // Fallback to old format (machine{machine.id})
                        else if (userData.ownedMachines[`machine${machine.id}`] !== undefined) {
                            count = userData.ownedMachines[`machine${machine.id}`];
                        }
                        
                        miningBoost += count * machine.baseBoost;
                        console.log(`🔧 GeoBoard Machine ${machine.id}: count=${count}, boost=${machine.baseBoost}, total=${count * machine.baseBoost}`);
                    });
                }
                
                // Use the same calculation as mining-functions.js
                if (typeof window.calculateTotalMiningBoost === 'function') {
                    const calculatedBoost = window.calculateTotalMiningBoost();
                    if (calculatedBoost !== 1.0) {
                        miningBoost = calculatedBoost;
                        console.log('🔧 GeoBoard using mining-functions boost calculation:', miningBoost);
                    }
                }
                
                // Also update mining stats to ensure consistency
                if (typeof window.updateMiningStats === 'function') {
                    setTimeout(() => {
                        window.updateMiningStats();
                    }, 100);
                }
                
                if (boostEl) {
                    const boostPercentage = ((miningBoost - 1) * 100).toFixed(1);
                    boostEl.textContent = `${boostPercentage}%`;
                    console.log('🔧 GeoBoard boost calculated:', miningBoost, 'Percentage:', boostPercentage);
                }
                
                console.log('🔧 User stats updated:', { 
                    username: userData.username, 
                    coins: userData.coins, 
                    ownedMachines: userData.ownedMachines,
                    miningBoost: miningBoost 
                });
                
                // Calculate user rank based on points
                window.calculateUserRank(userData.coins || 0);
                
                console.log('✅ Statistiken aktualisiert');
            } else {
                console.log('❌ Benutzerdaten nicht gefunden');
            }
        })
        .catch(error => {
            console.error('Error loading user stats:', error);
            console.error('❌ Fehler beim Laden der Statistiken');
        });
};

window.calculateUserRank = function(userPoints) {
    const db = window.db || db;
    if (typeof db === 'undefined' || !db) return;
    
    db.collection('users')
        .where('coins', '>', userPoints)
        .get()
        .then(querySnapshot => {
            const rank = querySnapshot.size + 1;
            const rankElement = document.getElementById('stats-rank');
            if (rankElement) {
                rankElement.textContent = `#${rank}`;
            }
        })
        .catch(error => {
            console.error('Error calculating rank:', error);
            const rankElement = document.getElementById('stats-rank');
            if (rankElement) {
                rankElement.textContent = '-';
            }
        });
};

window.loadGlobalStats = function() {
    const db = window.db || db;
    if (typeof db === 'undefined' || !db) return;
    
    // Load global statistics from multiple collections
    Promise.all([
        db.collection('users').get(),
        db.collection('purchases').get(),
        db.collection('geodrops').get(),
        db.collection('devDrops').get()
    ])
    .then(([usersSnapshot, purchasesSnapshot, geodropsSnapshot, devDropsSnapshot]) => {
        let totalUsers = 0;
        let totalDrops = 0;
        let totalCoins = 0;
        let totalTbnb = 0;
        let totalPackages = 0;
        
        // Count users and their stats
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            totalUsers++;
            totalDrops += userData.drops || 0;
            totalCoins += userData.coins || 0;
            totalTbnb += userData.tbnb || 0;
        });
        
        // Count purchased packages (mining machines) - avoid double counting
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.ownedMachines) {
                console.log('🔍 User ownedMachines:', userData.ownedMachines);
                const ownedMachines = userData.ownedMachines;
                let userPackages = 0;
                
                // Count machines properly (avoid double counting between formats)
                const machineTypes = [1, 2, 3, 4];
                machineTypes.forEach(machineId => {
                    let count = 0;
                    
                    // Check old format first (machine.id)
                    if (ownedMachines[machineId]) {
                        count = ownedMachines[machineId];
                    }
                    // If not in old format, check new format (machine{machine.id})
                    else if (ownedMachines[`machine${machineId}`]) {
                        count = ownedMachines[`machine${machineId}`];
                    }
                    
                    userPackages += count;
                    console.log(`📦 GeoBoard Machine ${machineId}: count=${count}, userTotal=${userPackages}`);
                });
                
                totalPackages += userPackages;
                console.log('📦 User packages added:', userPackages);
            }
        });
        
        console.log('📦 Total packages counted:', totalPackages);
        console.log('🔍 Looking for global-packages element...');
        const packagesElement = document.getElementById('global-packages');
        console.log('🔍 global-packages element found:', packagesElement);
        
        // Count total drops from both collections
        totalDrops += geodropsSnapshot.size;
        totalDrops += devDropsSnapshot.size;
        
        // Update UI - check if elements exist first
        const globalUsers = document.getElementById('global-users');
        const globalDrops = document.getElementById('global-drops');
        const globalCoins = document.getElementById('global-coins');
        const globalTbnb = document.getElementById('global-tbnb');
        const globalPackages = document.getElementById('global-packages');
        
        if (globalUsers) globalUsers.textContent = totalUsers;
        if (globalDrops) globalDrops.textContent = totalDrops;
        if (globalCoins) globalCoins.textContent = totalCoins;
        if (globalTbnb) globalTbnb.textContent = totalTbnb.toFixed(2);
        if (globalPackages) {
            globalPackages.textContent = totalPackages;
            console.log('✅ Updated global-packages to:', totalPackages);
        } else {
            console.log('❌ global-packages element not found!');
        }
        
        console.log('📊 Global stats updated:', {
            users: totalUsers,
            drops: totalDrops,
            coins: totalCoins,
            tbnb: totalTbnb,
            packages: totalPackages
        });
        
        // Debug: Log individual user coin amounts
        console.log('🔍 Debug - User coin breakdown:');
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const coins = userData.coins || 0;
            if (coins > 0) {
                console.log(`  ${userData.username || userData.email || 'Unknown'}: ${coins} coins`);
            }
        });
    })
    .catch(error => {
        console.error('Error loading global stats:', error);
        // Don't show error to user if it's a permission issue (user not logged in)
        if (error.code === 'permission-denied' || error.message.includes('permissions')) {
            console.log('🔒 User not logged in, skipping global stats load');
            return;
        }
        // Fallback to user-only stats if other collections fail
        const db = window.db || db;
        if (db) {
            db.collection('users').get()
            .then(querySnapshot => {
                let totalUsers = 0;
                let totalDrops = 0;
                let totalCoins = 0;
                let totalTbnb = 0;
                
                querySnapshot.forEach(doc => {
                    const userData = doc.data();
                    totalUsers++;
                    totalDrops += userData.drops || 0;
                    totalCoins += userData.coins || 0;
                    totalTbnb += userData.tbnb || 0;
                });
                
                const globalUsers = document.getElementById('global-users');
                const globalDrops = document.getElementById('global-drops');
                const globalCoins = document.getElementById('global-coins');
                const globalTbnb = document.getElementById('global-tbnb');
                const globalPackages = document.getElementById('global-packages');
                
                if (globalUsers) globalUsers.textContent = totalUsers;
                if (globalDrops) globalDrops.textContent = totalDrops;
                if (globalCoins) globalCoins.textContent = totalCoins;
                if (globalTbnb) globalTbnb.textContent = totalTbnb.toFixed(2);
                if (globalPackages) globalPackages.textContent = '0';
            })
            .catch(fallbackError => {
                console.error('Fallback error loading global stats:', fallbackError);
                // Don't show error to user if it's a permission issue (user not logged in)
                if (fallbackError.code === 'permission-denied' || fallbackError.message.includes('permissions')) {
                    console.log('🔒 User not logged in, skipping fallback stats load');
                    return;
                }
            });
        }
    });
};

// Auto-refresh global stats every 30 seconds
window.startGlobalStatsAutoRefresh = function() {
    // Load stats immediately
    window.loadGlobalStats();
    
    // Set up interval for auto-refresh
    setInterval(() => {
        window.loadGlobalStats();
    }, 30000); // 30 seconds
    
    console.log('🔄 Global stats auto-refresh started (30s interval)');
};

// Initialize auto-refresh when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Start auto-refresh after a short delay to ensure Firebase is ready
    setTimeout(() => {
        if (typeof window.startGlobalStatsAutoRefresh === 'function') {
            window.startGlobalStatsAutoRefresh();
        }
    }, 2000);
});
