// Navigation and Page Loading Functions for GeoDrop App

// Simple page navigation - make it global
window.showPage = function(pageId) {
    console.log('🔄 Switching to page:', pageId);
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Find and activate the correct nav button
    const targetBtn = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
        console.log('✅ Nav button activated:', pageId);
    }
    
    // Ensure navigation buttons are clickable
    if (typeof window.updateUserNavigation === 'function') {
        window.updateUserNavigation();
    }
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
        console.log('✅ Page shown:', pageId);
        
        // Banner system removed
        
        // Load content via fetch for pages that need it
        if (['geocard', 'machines', 'bonus', 'geochat', 'trading', 'mehr', 'geoboard', 'dev'].includes(pageId)) {
            // Preserve DEV status when switching pages
            const currentDevStatus = window.isDevLoggedIn;
            const currentAdminStatus = window.isAdmin;
            loadPageContent(pageId, selectedPage).then(() => {
                // Restore DEV status after page load
                if (currentDevStatus) {
                    window.isDevLoggedIn = currentDevStatus;
                    window.isAdmin = currentAdminStatus;
                    console.log('🔓 DEV status restored after page switch');
                }
            });
        }
        
        // Update Dev status after page change
        if (typeof window.updateDevStatus === 'function') {
            window.updateDevStatus();
        }
        if (typeof window.updateNavigationDevStatus === 'function') {
            window.updateNavigationDevStatus();
        }
        if (typeof window.updateDevSessionButton === 'function') {
            window.updateDevSessionButton();
        }
        
        // Update user navigation
        if (typeof window.updateUserNavigation === 'function') {
            window.updateUserNavigation();
        }
        
        // Update Dev Navigation to ensure Dev tab remains clickable and shows correct status
        if (typeof window.updateDevNavigation === 'function') {
            window.updateDevNavigation();
        }
        
        // Also update dev status to ensure correct display
        if (typeof window.updateDevStatus === 'function') {
            window.updateDevStatus();
        }
        
        // CRITICAL: Reload all drop lists when switching to GeoCard page
        if (pageId === 'geocard') {
            setTimeout(() => {
                console.log('🔄 Reloading all drop lists on GeoCard page switch...');
                if (typeof window.reloadAllDropLists === 'function') {
                    window.reloadAllDropLists();
                }
            }, 1000);
        }
    } else {
        console.error('❌ Page not found:', pageId);
    }
};

// Load page content via fetch
window.loadPageContent = function(pageId, container) {
    console.log('📥 Loading content for:', pageId);
    
    let fetchUrl = `pages/${pageId}.html`;
    
    return fetch(fetchUrl)
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            console.log('✅ Content loaded for:', pageId);
            
        // Apply translations after content is loaded
        if (typeof window.updateAllTexts === 'function') {
            setTimeout(() => {
                console.log('🔄 Applying translations to loaded content...');
                window.updateAllTexts();
            }, 100);
        }
        
        // Update language containers after content is loaded
        if (typeof window.updateLanguageContainers === 'function') {
            setTimeout(() => {
                console.log('🔄 Updating language containers after page load...');
                const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
                window.updateLanguageContainers(currentLang);
            }, 200);
        }
            
            // Initialize map for geocard
            if (pageId === 'geocard') {
                setTimeout(() => {
                    console.log('🗺️ Loading GeoCard page, initializing map...');
                    if (typeof initGeoMap === 'function') {
                        initGeoMap('mapid');
                        
                        // Load GeoDrops after map is initialized
                        setTimeout(() => {
                            console.log('🔍 Checking loadGeoDrops function availability...');
                            console.log('🔍 typeof loadGeoDrops:', typeof loadGeoDrops);
                            console.log('🔍 typeof window.loadGeoDrops:', typeof window.loadGeoDrops);
                            
                            // Apply translations again after map initialization
                            if (typeof window.updateAllTexts === 'function') {
                                console.log('🔄 Applying translations after map initialization...');
                                window.updateAllTexts();
                            }
                            
                            if (typeof loadGeoDrops === 'function') {
                                console.log('🎯 Loading GeoDrops...');
                                loadGeoDrops().catch(error => {
                                    console.error('❌ Error in loadGeoDrops:', error);
                                });
                            } else if (typeof window.loadGeoDrops === 'function') {
                                console.log('🎯 Loading GeoDrops via window...');
                                window.loadGeoDrops().catch(error => {
                                    console.error('❌ Error in window.loadGeoDrops:', error);
                                });
                            } else {
                                console.log('⏳ Waiting for loadGeoDrops function...');
                                setTimeout(() => {
                                    if (typeof loadGeoDrops === 'function') {
                                        console.log('🎯 Loading GeoDrops (delayed)...');
                                        loadGeoDrops().catch(error => {
                                            console.error('❌ Error in delayed loadGeoDrops:', error);
                                        });
                                    } else if (typeof window.loadGeoDrops === 'function') {
                                        console.log('🎯 Loading GeoDrops via window (delayed)...');
                                        window.loadGeoDrops().catch(error => {
                                            console.error('❌ Error in delayed window.loadGeoDrops:', error);
                                        });
                                    } else {
                                        console.error('❌ loadGeoDrops function still not available after delay');
                                    }
                                }, 1000);
                            }
                        }, 2000);
                        
                        // CRITICAL: Load all drop lists when GeoCard page loads
                        setTimeout(() => {
                            console.log('🔄 Loading all drop lists on GeoCard page load...');
                            
                            // Apply translations after all content is loaded
                            if (typeof window.updateAllTexts === 'function') {
                                console.log('🔄 Applying translations after all content loaded...');
                                window.updateAllTexts();
                            }
                            
                            // Load Dev Drops for upload
                            if (typeof loadDevDropsForUpload === 'function') {
                                console.log('🔄 Loading Dev Drops for upload...');
                                loadDevDropsForUpload();
                            }
                            
                            // Load User Drops for upload
                            if (typeof loadUserDropsForUpload === 'function') {
                                console.log('🔄 Loading User Drops for upload...');
                                loadUserDropsForUpload();
                            }
                            
                            // Load Dev GeoDrops table
                            if (typeof loadDevGeoDrops === 'function') {
                                console.log('🔄 Loading Dev GeoDrops table...');
                                loadDevGeoDrops();
                            }
                            
                            // Load User GeoDrops table
                            if (typeof loadUserGeoDrops === 'function') {
                                console.log('🔄 Loading User GeoDrops table...');
                                loadUserGeoDrops();
                            }
                            
                            console.log('✅ All drop lists loaded on GeoCard page load');
                            
                            // Apply translations after all drop lists are loaded
                            if (typeof window.updateAllTexts === 'function') {
                                console.log('🔄 Applying translations after all drop lists loaded...');
                                window.updateAllTexts();
                            }
                            
                            // CRITICAL: Load GeoDrops for map after all lists are loaded
                            setTimeout(() => {
                                console.log('🗺️ Loading GeoDrops for map after all lists loaded...');
                                if (typeof window.loadGeoDrops === 'function') {
                                    window.loadGeoDrops().catch(error => {
                                        console.error('❌ Error loading GeoDrops for map:', error);
                                    });
                                } else {
                                    console.error('❌ window.loadGeoDrops not available');
                                }
                                
                                // Apply translations after map GeoDrops are loaded
                                setTimeout(() => {
                                    if (typeof window.updateAllTexts === 'function') {
                                        console.log('🔄 Applying translations after map GeoDrops loaded...');
                                        window.updateAllTexts();
                                    }
                                }, 500);
                            }, 1000);
                        }, 3000);
                        
                        // CRITICAL: Also reload all drop lists when switching to GeoCard
                        setTimeout(() => {
                            console.log('🔄 Force reloading all drop lists on GeoCard switch...');
                            if (typeof window.reloadAllDropLists === 'function') {
                                window.reloadAllDropLists().then(() => {
                                    // Apply translations after force reload
                                    if (typeof window.updateAllTexts === 'function') {
                                        console.log('🔄 Applying translations after force reload...');
                                        window.updateAllTexts();
                                    }
                                });
                            }
                        }, 5000);
                        
                    } else {
                        console.log('⏳ Waiting for initGeoMap function...');
                        setTimeout(() => {
                        if (typeof initGeoMap === 'function') {
                            initGeoMap('mapid');
                                
                                // Load GeoDrops after map is initialized
                                setTimeout(() => {
                                    if (typeof loadGeoDrops === 'function') {
                                        console.log('🎯 Loading GeoDrops...');
                                        loadGeoDrops();
                                    }
                                    
                                    // Apply translations after delayed map initialization
                                    if (typeof window.updateAllTexts === 'function') {
                                        console.log('🔄 Applying translations after delayed map initialization...');
                                        window.updateAllTexts();
                                    }
                                }, 2000);
                            }
                        }, 500);
                    }
                }, 100);
            }
            
            // Initialize bonus system
            if (pageId === 'bonus') {
                setTimeout(() => {
                    console.log('🎁 Loading Bonus page, initializing bonus system...');
                    if (typeof window.updateBonusDisplay === 'function') {
                        window.updateBonusDisplay();
                    } else {
                        console.log('⏳ Waiting for updateBonusDisplay function...');
                        setTimeout(() => {
                            if (typeof window.updateBonusDisplay === 'function') {
                                window.updateBonusDisplay();
                            }
                        }, 500);
                    }
                    
                    // Apply translations after bonus system initialization
                    if (typeof window.updateAllTexts === 'function') {
                        console.log('🔄 Applying translations after bonus system initialization...');
                        window.updateAllTexts();
                    }
                    
                    // CRITICAL: Update referral link with user's actual ID
                    setTimeout(() => {
                        console.log('🔗 Updating referral link on bonus page load...');
                        if (typeof window.updateReferralLink === 'function') {
                            window.updateReferralLink();
                        } else {
                            console.log('❌ updateReferralLink function not found');
                        }
                        
                        // Apply translations after referral link update
                        if (typeof window.updateAllTexts === 'function') {
                            console.log('🔄 Applying translations after referral link update...');
                            window.updateAllTexts();
                        }
                    }, 2000);
                    
                    // Fallback: Force show bonus button after 2 seconds if still not visible
                    setTimeout(() => {
                        const bonusAvailable = document.getElementById('bonus-available');
                        const bonusClaimed = document.getElementById('bonus-claimed');
                        
                        if (bonusAvailable && bonusClaimed) {
                            const isAvailableVisible = bonusAvailable.style.display !== 'none';
                            const isClaimedVisible = bonusClaimed.style.display !== 'none';
                            
                            if (!isAvailableVisible && !isClaimedVisible) {
                                console.log('🔧 Fallback: Force showing bonus button');
                                bonusAvailable.style.display = 'block';
                                bonusClaimed.style.display = 'none';
                            }
                        }
                        
                        // Apply translations after fallback
                        if (typeof window.updateAllTexts === 'function') {
                            console.log('🔄 Applying translations after fallback...');
                            window.updateAllTexts();
                        }
                    }, 2000);
                }, 100);
            }
            
            if (pageId === 'machines') {
                console.log('⛏️ Loading Mining page, initializing machines...');
                
                // Initialize mining functions immediately
                if (typeof window.loadMiningMachines === 'function') {
                    window.loadMiningMachines();
                }
                
                // SECURITY FIX: NO automatic wallet display update - this causes auto-connection
                // if (typeof window.updateWalletDisplay === 'function') {
                //     window.updateWalletDisplay();
                // }
                console.log('🔒 SECURITY: Skipped automatic wallet display update to prevent auto-connection');
                
                if (typeof window.updateMiningStats === 'function') {
                    window.updateMiningStats();
                }
                
                // Apply translations after mining page initialization
                if (typeof window.updateAllTexts === 'function') {
                    console.log('🔄 Applying translations after mining page initialization...');
                    window.updateAllTexts();
                }
            }
                    
            // Initialize geoboard with real data
            if (pageId === 'geoboard') {
                setTimeout(() => {
                    console.log('📊 Loading GeoBoard data...');
                    if (typeof refreshLeaderboard === 'function') {
                        refreshLeaderboard();
                    }
                    if (typeof refreshUserStats === 'function') {
                        refreshUserStats();
                    }
                    if (typeof loadGlobalStats === 'function') {
                        loadGlobalStats();
                    }
                    
                    // Apply translations after geoboard data loading
                    if (typeof window.updateAllTexts === 'function') {
                        console.log('🔄 Applying translations after geoboard data loading...');
                        window.updateAllTexts();
                    }
                    
                    // Initialize Colloseum tabs - DIRECT APPROACH
                    console.log('🏛️ Setting up Colloseum tabs directly...');
                    setTimeout(() => {
                        const geoboardTab = document.getElementById('geoboard-tab');
                        const colloseumTab = document.getElementById('colloseum-tab');
                        const geoboardContent = document.getElementById('geoboard-content');
                        const colloseumContent = document.getElementById('colloseum-content');
                        
                        if (geoboardTab && colloseumTab && geoboardContent && colloseumContent) {
                            console.log('✅ Found all Colloseum elements - setting up tabs');
                            
                            // Set onclick handlers directly - using mehr-tab-btn styling
                            geoboardTab.onclick = function() {
                                console.log('📊 CLICKED GeoBoard tab');
                                
                                // Remove active class from all buttons
                                document.querySelectorAll('.mehr-tab-btn').forEach(btn => {
                                    btn.classList.remove('active');
                                });
                                
                                // Add active class to clicked button
                                geoboardTab.classList.add('active');
                                
                                geoboardContent.classList.remove('hidden');
                                colloseumContent.classList.add('hidden');
                            };
                            
                            colloseumTab.onclick = function() {
                                console.log('🏛️ CLICKED Colloseum tab');
                                
                                // Remove active class from all buttons
                                document.querySelectorAll('.mehr-tab-btn').forEach(btn => {
                                    btn.classList.remove('active');
                                });
                                
                                // Add active class to clicked button
                                colloseumTab.classList.add('active');
                                
                                colloseumContent.classList.remove('hidden');
                                geoboardContent.classList.add('hidden');
                                console.log('✅ Colloseum should be visible now!');
                            };
                            
                            console.log('✅ Colloseum tabs setup complete');
                            
                            // Apply translations after colloseum tabs setup
                            if (typeof window.updateAllTexts === 'function') {
                                console.log('🔄 Applying translations after colloseum tabs setup...');
                                window.updateAllTexts();
                            }
                        } else {
                            console.error('❌ Colloseum elements not found:', {
                                geoboardTab: !!geoboardTab,
                                colloseumTab: !!colloseumTab,
                                geoboardContent: !!geoboardContent,
                                colloseumContent: !!colloseumContent
                            });
                        }
                    }, 100);
                }, 100);
            }
            
            // Initialize geochat
            if (pageId === 'geochat') {
                setTimeout(() => {
                    console.log('💬 Initializing GeoChat...');
                    if (typeof window.loadChatMessages === 'function') {
                        window.loadChatMessages();
                    }
                    if (typeof window.updateChatStats === 'function') {
                        window.updateChatStats();
                    }
                    
                    // Apply translations after geochat initialization
                    if (typeof window.updateAllTexts === 'function') {
                        console.log('🔄 Applying translations after geochat initialization...');
                        window.updateAllTexts();
                    }
                }, 100);
            }
            
            // Initialize trading
            if (pageId === 'trading') {
                setTimeout(() => {
                    console.log('📈 Initializing Trading...');
                    if (typeof window.updateTradingChart === 'function') {
                        window.updateTradingChart();
                    }
                    updateTradingStats();
                    
                    // Update wallet status in trading page
                    setTimeout(() => {
                        updateTradingWalletStatus();
                    }, 200);
                    
                    // Apply translations after trading initialization
                    if (typeof window.updateAllTexts === 'function') {
                        console.log('🔄 Applying translations after trading initialization...');
                        window.updateAllTexts();
                    }
                }, 100);
            }
            
            // Initialize mehr page
            if (pageId === 'mehr') {
                setTimeout(() => {
                    console.log('⚙️ Initializing Mehr...');
                    // Show dashboard by default
                    if (typeof window.showMehrTab === 'function') {
                        console.log('✅ Calling showMehrTab("dashboard")');
                        window.showMehrTab('dashboard');
                    } else {
                        console.log('❌ showMehrTab function not found');
                    }
                    
                    // Update all mehr tabs with current data
                    if (typeof window.updateAllMehrTabs === 'function') {
                        setTimeout(() => {
                            window.updateAllMehrTabs();
                        }, 500);
                    }
                    
                    // Load profile data when profile tab is shown
                    if (typeof window.loadProfileData === 'function') {
                        setTimeout(() => {
                            window.loadProfileData();
                        }, 1000);
                    }
                    
                    // Apply translations after mehr page initialization
                    if (typeof window.updateAllTexts === 'function') {
                        console.log('🔄 Applying translations after mehr page initialization...');
                        window.updateAllTexts();
                    }
                    
                    // CRITICAL: Force update dashboard content if showMehrTab doesn't work
                    setTimeout(() => {
                        const mehrContent = document.getElementById('mehr-tab-content');
                        if (mehrContent && mehrContent.innerHTML.trim() === '') {
                            console.log('🔧 Mehr tab content is empty, forcing dashboard load...');
                            window.showMehrTab('dashboard');
                        }
                        
                        // Apply translations after force update
                        if (typeof window.updateAllTexts === 'function') {
                            console.log('🔄 Applying translations after force update...');
                            window.updateAllTexts();
                        }
                    }, 1000);
                }, 100);
            }
            
            // Initialize dev page
            if (pageId === 'dev') {
                setTimeout(() => {
                    console.log('🔧 Initializing Dev page...');
                    
                    // Initialize Dev tab functions
                    if (typeof window.showDevTab === 'function') {
                        console.log('🔧 showDevTab function already exists, using it');
                        window.showDevTab('dev-main');
                    } else {
                        console.log('❌ showDevTab function not found - this should not happen');
                    }
                    
                    // Initialize Dev status
                    if (typeof window.updateDevStatus === 'function') {
                        window.updateDevStatus();
                    }
                    
                    // Initialize Pool Wallet
                    if (typeof window.initializePoolWallet === 'function') {
                        window.initializePoolWallet();
                    }
                    
                    // Update filename display
                    if (typeof window.updateNextFilenameDisplay === 'function') {
                        setTimeout(() => {
                            window.updateNextFilenameDisplay();
                        }, 500);
                    }
                    
                    // Apply translations after dev page initialization
                    if (typeof window.updateAllTexts === 'function') {
                        console.log('🔄 Applying translations after dev page initialization...');
                        window.updateAllTexts();
                    }
                    
                }, 100);
            }
            
            
            // Initialize mining
            if (pageId === 'machines') {
                setTimeout(() => {
                    console.log('⛏️ Initializing Mining page...');
                    if (typeof window.updateMiningStats === 'function') {
                        window.updateMiningStats();
                    }
                    
                    // Apply translations after mining page initialization
                    if (typeof window.updateAllTexts === 'function') {
                        console.log('🔄 Applying translations after mining page initialization...');
                        window.updateAllTexts();
                    }
                }, 100);
            }
        })
        .catch(error => {
            console.error('❌ Error loading page:', error);
            container.innerHTML = `
                <div class="max-w-6xl mx-auto p-6">
                    <h2 class="text-3xl font-bold text-white mb-4">Seite nicht gefunden</h2>
                    <p class="text-gray-300">Die Seite "${pageId}" konnte nicht geladen werden.</p>
                </div>
            `;
            
            // Apply translations after error handling
            if (typeof window.updateAllTexts === 'function') {
                console.log('🔄 Applying translations after error handling...');
                window.updateAllTexts();
            }
        });
};

// Auto-login function
function checkAutoLogin() {
    console.log('🔍 Checking auto-login...');
    
    // Get auth from global scope (set by firebase.js)
    const auth = window.auth || window.firebase?.auth();
    console.log('Auth object:', auth);
    console.log('Current user:', auth ? auth.currentUser : 'No auth');
    
    if (auth && auth.currentUser) {
        console.log('👤 User already logged in:', auth.currentUser.email);
        // Set global currentUser for other functions
        window.currentUser = auth.currentUser;
        
        // Update UI - but keep startseite visible
        setTimeout(() => {
            const userInfo = document.getElementById('user-info');
            if (userInfo) {
                userInfo.style.display = 'block';
                console.log('✅ User info shown for logged in user');
            }
            
            // Update user data if function is available
            if (typeof updateUserDisplay === 'function') {
                updateUserDisplay();
            }
            
            // Force navigation update
            if (typeof window.updateNavigationDevStatus === 'function') {
                window.updateNavigationDevStatus();
            }
            
            // Update user navigation
            if (typeof window.updateUserNavigation === 'function') {
                window.updateUserNavigation();
            }
            
            // Load referrals data after auto-login
            if (typeof window.loadReferralsData === 'function') {
                console.log('👥 Loading referrals data after auto-login...');
                window.loadReferralsData();
            }
            
            // Banner system removed
            
            console.log('✅ Auto-login completed successfully');
        }, 500);
    } else {
        console.log('❌ No user logged in');
    }
}

// Banner system removed

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Navigation initialized');
    
    // Wait for Firebase to initialize before checking auto-login
    function waitForFirebaseAndCheckLogin() {
        const auth = window.auth || window.firebase?.auth();
        if (typeof auth !== 'undefined' && auth) {
            console.log('✅ Firebase auth available, checking auto-login...');
            checkAutoLogin();
        } else {
            console.log('⏳ Waiting for Firebase auth...');
            setTimeout(waitForFirebaseAndCheckLogin, 500);
        }
    }
    
    // Start checking for Firebase auth after a short delay
    setTimeout(waitForFirebaseAndCheckLogin, 1000);
});

// Global GeoBoard Tab Functions
window.switchToGeoBoard = function() {
    console.log('📊 Switching to GeoBoard tab');
    
    const geoboardTab = document.getElementById('geoboard-tab');
    const colloseumTab = document.getElementById('colloseum-tab');
    const geoboardContent = document.getElementById('geoboard-content');
    const colloseumContent = document.getElementById('colloseum-content');
    
    if (geoboardTab && colloseumTab && geoboardContent && colloseumContent) {
        // Remove active class from all buttons
        document.querySelectorAll('.mehr-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        geoboardTab.classList.add('active');
        
        geoboardContent.classList.remove('hidden');
        colloseumContent.classList.add('hidden');
        
        console.log('✅ Switched to GeoBoard tab');
    }
};

window.switchToColloseum = function() {
    console.log('🏛️ Switching to Colloseum tab');
    
    const geoboardTab = document.getElementById('geoboard-tab');
    const colloseumTab = document.getElementById('colloseum-tab');
    const geoboardContent = document.getElementById('geoboard-content');
    const colloseumContent = document.getElementById('colloseum-content');
    
    if (geoboardTab && colloseumTab && geoboardContent && colloseumContent) {
        // Remove active class from all buttons
        document.querySelectorAll('.mehr-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        colloseumTab.classList.add('active');
        
        colloseumContent.classList.remove('hidden');
        geoboardContent.classList.add('hidden');
        
        console.log('✅ Switched to Colloseum tab');
    }
};

// Switch to Referrals tab
window.switchToReferrals = function() {
    console.log('👥 SWITCHING TO REFERRALS');
    const geoboardTab = document.getElementById('geoboard-tab');
    const colloseumTab = document.getElementById('colloseum-tab');
    const referralsTab = document.getElementById('referrals-tab');
    const geoboardContent = document.getElementById('geoboard-content');
    const colloseumContent = document.getElementById('colloseum-content');
    const referralsContent = document.getElementById('referrals-content');
    
    if (geoboardTab && colloseumTab && referralsTab && geoboardContent && colloseumContent && referralsContent) {
        // Remove active from all tabs
        geoboardTab.classList.remove('text-white', 'border-blue-500', 'bg-gray-800');
        geoboardTab.classList.add('text-gray-400', 'border-transparent');
        
        colloseumTab.classList.remove('text-white', 'border-blue-500', 'bg-gray-800');
        colloseumTab.classList.add('text-gray-400', 'border-transparent');
        
        // Add active to referrals tab
        referralsTab.classList.add('text-white', 'border-blue-500', 'bg-gray-800');
        referralsTab.classList.remove('text-gray-400', 'border-transparent');
        
        // Show referrals content, hide others
        referralsContent.classList.remove('hidden');
        geoboardContent.classList.add('hidden');
        colloseumContent.classList.add('hidden');
        
        console.log('✅ Switched to Referrals');
        
        // Load referrals data
        if (typeof window.loadReferralsData === 'function') {
            console.log('🔄 Calling loadReferralsData...');
            window.loadReferralsData();
        } else {
            console.log('❌ loadReferralsData function not found');
        }
        
        // FORCE LOAD REFERRALS AFTER 1 SECOND
        setTimeout(() => {
            console.log('🔄 FORCE LOADING REFERRALS AFTER DELAY...');
            if (typeof window.loadReferralsData === 'function') {
                window.loadReferralsData();
            }
        }, 1000);
    } else {
        console.error('❌ Elements not found for Referrals switch');
        console.log('Available elements:', {
            geoboardTab: !!geoboardTab,
            colloseumTab: !!colloseumTab,
            referralsTab: !!referralsTab,
            geoboardContent: !!geoboardContent,
            colloseumContent: !!colloseumContent,
            referralsContent: !!referralsContent
        });
    }
};

// Load referrals data function - EINFACH UND DIREKT
window.loadReferralsData = async function() {
    console.log('🔍 LADE REFERRALS FÜR USER:', window.currentUser?.uid);
    
    const db = window.firebase.firestore();
    const allUsers = await db.collection('users').get();
    
    const referrals = [];
    allUsers.forEach(doc => {
        const userData = doc.data();
        if (userData.referredBy === window.currentUser.uid) {
            referrals.push({
                id: doc.id,
                username: userData.username,
                email: userData.email,
                createdAt: userData.createdAt
            });
        }
    });
    
    console.log('📊 GEFUNDENE REFERRALS:', referrals.length);
    
    // UI aktualisieren - mit Null-Checks
    const directReferralsCount = document.getElementById('direct-referrals-count');
    const userReferralCode = document.getElementById('user-referral-code');
    
    if (directReferralsCount) {
        directReferralsCount.textContent = referrals.length;
    }
    if (userReferralCode && window.currentUser) {
        userReferralCode.textContent = window.currentUser.uid;
    }
    
    // Liste anzeigen
    const list = document.getElementById('referrals-list');
    if (referrals.length === 0) {
        list.innerHTML = '<div class="text-center text-gray-400 p-8">Keine Referrals gefunden</div>';
    } else {
        let html = '';
        referrals.forEach(ref => {
            html += `
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">${(ref.username || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h3 class="text-white font-medium">${ref.username || 'Unbekannt'}</h3>
                            <p class="text-gray-400 text-sm">ID: ${ref.id}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        if (list) {
            list.innerHTML = html;
        } else {
            console.log('❌ referrals-list element not found');
        }
    }
};

// Update referrals list function
window.updateReferralsList = function(referrals) {
    console.log('🔄 updateReferralsList called with:', referrals.length, 'referrals');
    const referralsList = document.getElementById('referrals-list');
    console.log('🔍 referrals-list element found:', !!referralsList);
    if (!referralsList) {
        console.log('❌ referrals-list element not found');
        return;
    }
    
    if (referrals.length === 0) {
        console.log('📝 No referrals found, showing empty state');
        referralsList.innerHTML = `
            <div class="text-center text-gray-400 p-8">
                <div class="text-4xl mb-4">👥</div>
                <p>Noch keine Referrals</p>
                <p class="text-sm mt-2">Teile deinen Referral-Link mit Freunden!</p>
            </div>
        `;
        return;
    }

    console.log('📝 Building referrals list HTML for', referrals.length, 'referrals');
    let referralsHTML = '';
    referrals.forEach((referral, index) => {
        console.log(`📝 Processing referral ${index + 1}:`, referral);
        const joinDate = referral.createdAt ? 
            (referral.createdAt.toDate ? referral.createdAt.toDate() : new Date(referral.createdAt)) : 
            new Date();
        
        const isActive = referral.lastActivity ? 
            (new Date() - (referral.lastActivity.toDate ? referral.lastActivity.toDate() : new Date(referral.lastActivity))) < 7 * 24 * 60 * 60 * 1000 : 
            false;
        
        referralsHTML += `
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">${(referral.username || referral.email || 'User').charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h3 class="text-white font-medium">${referral.username || referral.email || 'Unbekannter User'}</h3>
                            <p class="text-gray-400 text-sm">Beigetreten: ${joinDate.toLocaleDateString('de-DE')}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="flex items-center space-x-2">
                            <span class="text-xs px-2 py-1 rounded ${isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}">
                                ${isActive ? 'Aktiv' : 'Inaktiv'}
                            </span>
                        </div>
                        <div class="text-sm text-gray-400 mt-1">
                            Verdient: <span class="text-green-400 font-bold">${(referral.referralEarnings || 0).toFixed(4)} tBNB</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    console.log('📝 Final referrals HTML length:', referralsHTML.length);
    referralsList.innerHTML = referralsHTML;
    console.log('✅ Referrals list updated successfully');
};

// Fix Firebase referral relationships for real users
window.fixFirebaseReferrals = async function() {
    console.log('🔧 Fixing Firebase referral relationships...');
    try {
        const db = window.firebase.firestore();
        
        // Load all users to identify them
        const usersSnapshot = await db.collection('users').get();
        console.log('📊 Total users in database:', usersSnapshot.size);
        
        let kryptoGuruId = null;
        let geoDrop420Id = null;
        let nikolausmosId = null;
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            console.log(`👤 ${userData.username || 'Unknown'} (${doc.id}): referredBy = ${userData.referredBy || 'null'}`);
            
            if (userData.username === 'KryptoGuru') {
                kryptoGuruId = doc.id;
            } else if (userData.username === 'GeoDrop#420') {
                geoDrop420Id = doc.id;
            } else if (userData.username === 'nikolausmos') {
                nikolausmosId = doc.id;
            }
        });
        
        console.log('🔍 Found user IDs:', { kryptoGuruId, geoDrop420Id, nikolausmosId });
        
        // Fix the referral relationships
        if (geoDrop420Id && kryptoGuruId) {
            // Set GeoDrop#420 as referred by KryptoGuru
            await db.collection('users').doc(geoDrop420Id).update({
                referredBy: kryptoGuruId
            });
            console.log('✅ Fixed: GeoDrop#420 referredBy = KryptoGuru');
        }
        
        if (nikolausmosId && geoDrop420Id) {
            // Set nikolausmos as referred by GeoDrop#420
            await db.collection('users').doc(nikolausmosId).update({
                referredBy: geoDrop420Id
            });
            console.log('✅ Fixed: nikolausmos referredBy = GeoDrop#420');
        }
        
        console.log('✅ Firebase referral relationships fixed!');
        console.log('📊 Chain: KryptoGuru -> GeoDrop#420 -> nikolausmos');
        
        // Reload referrals data
        setTimeout(() => {
            window.loadReferralsData();
        }, 1000);

    } catch (error) {
        console.error('❌ Error fixing Firebase referrals:', error);
    }
};

// Test function to debug referrals
window.testReferrals = function() {
    console.log('🧪 Testing referrals system...');
    console.log('👤 Current user:', window.currentUser);
    console.log('👤 Auth user:', window.auth?.currentUser);
    console.log('👤 User profile:', window.userProfile);
    console.log('🔥 Firebase:', !!window.firebase);
    console.log('🔥 Firestore:', !!window.firebase?.firestore);
    
    // Test if we can access the referrals tab
    const referralsTab = document.getElementById('referrals-tab');
    const referralsContent = document.getElementById('referrals-content');
    const referralsList = document.getElementById('referrals-list');
    
    console.log('🔍 referrals-tab found:', !!referralsTab);
    console.log('🔍 referrals-content found:', !!referralsContent);
    console.log('🔍 referrals-list found:', !!referralsList);
    
    // Try to load referrals data
    if (typeof window.loadReferralsData === 'function') {
        console.log('🔄 Calling loadReferralsData...');
        window.loadReferralsData();
    } else {
        console.log('❌ loadReferralsData function not found');
    }
};

// MANUAL TEST FUNCTION - Call this in console
window.forceLoadReferrals = async function() {
    console.log('🚀 MANUAL FORCE LOADING REFERRALS...');
    
    try {
        const currentUser = window.currentUser || window.auth?.currentUser;
        if (!currentUser) {
            console.log('❌ No user logged in');
            return;
        }

        console.log('👤 Current user UID:', currentUser.uid);
        const db = window.firebase.firestore();
        
        // Load all users
        const allUsersSnapshot = await db.collection('users').get();
        console.log('📊 Total users in database:', allUsersSnapshot.size);
        
        const referrals = [];
        allUsersSnapshot.forEach(doc => {
            const userData = doc.data();
            console.log('👤 User:', doc.id, 'referredBy:', userData.referredBy, 'username:', userData.username);
            
            if (userData.referredBy === currentUser.uid) {
                console.log('🎯 FOUND REFERRAL:', doc.id, userData.username);
                referrals.push({ 
                    id: doc.id, 
                    username: userData.username || 'Unbekannt',
                    email: userData.email || 'Keine Email',
                    createdAt: userData.createdAt || new Date(),
                    referralEarnings: userData.referralEarnings || 0,
                    ...userData 
                });
            }
        });
        
        console.log('🎯 TOTAL REFERRALS FOUND:', referrals.length);
        console.log('🎯 REFERRALS:', referrals);

        // Force update the UI
        const directReferralsCount = document.getElementById('direct-referrals-count');
        if (directReferralsCount) {
            directReferralsCount.textContent = referrals.length;
            console.log('✅ Updated direct referrals count to:', referrals.length);
        }
        
        // Force update the list
        const referralsList = document.getElementById('referrals-list');
        if (referralsList) {
            let html = '';
            referrals.forEach((referral, index) => {
                console.log(`📝 Creating HTML for referral ${index + 1}:`, referral);
                const joinDate = referral.createdAt ? 
                    (referral.createdAt.toDate ? referral.createdAt.toDate() : new Date(referral.createdAt)) : 
                    new Date();
                
                html += `
                    <div class="bg-gray-800 rounded-lg p-4 border border-gray-600">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span class="text-white font-bold">${(referral.username || referral.email || 'User').charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 class="text-white font-medium">${referral.username || referral.email || 'Unbekannter User'}</h3>
                                    <p class="text-gray-400 text-sm">Beigetreten: ${joinDate.toLocaleDateString('de-DE')}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="flex items-center space-x-2">
                                    <span class="text-xs px-2 py-1 rounded bg-gray-700 text-gray-400">
                                        Inaktiv
                                    </span>
                                </div>
                                <div class="text-sm text-gray-400 mt-1">
                                    Verdient: <span class="text-green-400 font-bold">${(referral.referralEarnings || 0).toFixed(4)} tBNB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            referralsList.innerHTML = html;
            console.log('✅ Referrals list updated with', referrals.length, 'referrals');
        }
        
    } catch (error) {
        console.error('❌ Error in manual referrals loading:', error);
    }
};

// Copy referral link function
window.copyReferralLinkFromGeoBoard = function() {
    const referralInput = document.getElementById('referral-link-display');
    if (referralInput) {
        referralInput.select();
        referralInput.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            alert('✅ Referral-Link kopiert!');
        } catch (err) {
            navigator.clipboard.writeText(referralInput.value).then(() => {
                alert('✅ Referral-Link kopiert!');
            }).catch(() => {
                alert('❌ Fehler beim Kopieren des Links');
            });
        }
    }
};

// Show indirect referrals modal
window.showIndirectReferralsModal = async function() {
    console.log('🔄 Opening indirect referrals modal...');
    const modal = document.getElementById('indirect-referrals-modal');
    const listContainer = document.getElementById('indirect-referrals-list');
    
    if (!modal) {
        console.log('❌ Indirect referrals modal not found');
        return;
    }
    
    modal.classList.remove('hidden');
    if (listContainer) {
        listContainer.innerHTML = '<div class="text-center text-gray-400 p-8">Lade indirekte Referrals...</div>';
    }
    
    try {
        await window.loadIndirectReferrals();
    } catch (error) {
        console.error('❌ Error loading indirect referrals:', error);
        if (listContainer) {
            listContainer.innerHTML = '<div class="text-center text-red-400 p-8">Fehler beim Laden der indirekten Referrals</div>';
        }
    }
};

// Close indirect referrals modal
window.closeIndirectReferralsModal = function() {
    const modal = document.getElementById('indirect-referrals-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
};

// Load indirect referrals
window.loadIndirectReferrals = async function() {
    console.log('🔄 Loading indirect referrals...');
    try {
        const currentUser = window.currentUser || window.auth?.currentUser;
        if (!currentUser) {
            console.log('❌ No user logged in');
            return;
        }

        const db = window.firebase.firestore();
        const listContainer = document.getElementById('indirect-referrals-list');
        
        // First get all direct referrals
        const directReferralsSnapshot = await db.collection('users')
            .where('referredBy', '==', currentUser.uid)
            .get();

        if (directReferralsSnapshot.empty) {
            if (listContainer) {
                listContainer.innerHTML = `
                    <div class="text-center text-gray-400 p-8">
                        <div class="text-4xl mb-4">👥</div>
                        <p>Noch keine direkten Referrals</p>
                        <p class="text-sm mt-2">Indirekte Referrals entstehen, wenn deine Referrals selbst User werben.</p>
                    </div>
                `;
            }
            return;
        }

        // Get indirect referrals for each direct referral
        let allIndirectReferrals = [];
        let totalIndirectEarnings = 0;

        for (const directRef of directReferralsSnapshot.docs) {
            const indirectReferralsSnapshot = await db.collection('users')
                .where('referredBy', '==', directRef.id)
                .get();

            indirectReferralsSnapshot.forEach(doc => {
                const indirectRef = { id: doc.id, ...doc.data(), directReferrer: directRef.data().username || directRef.data().email || 'Unbekannt' };
                allIndirectReferrals.push(indirectRef);
                totalIndirectEarnings += indirectRef.referralEarnings || 0;
            });
        }

        console.log('🔄 Found', allIndirectReferrals.length, 'indirect referrals');

        if (allIndirectReferrals.length === 0) {
            if (listContainer) {
                listContainer.innerHTML = `
                    <div class="text-center text-gray-400 p-8">
                        <div class="text-4xl mb-4">🔄</div>
                        <p>Noch keine indirekten Referrals</p>
                        <p class="text-sm mt-2">Deine direkten Referrals haben noch niemanden geworben.</p>
                    </div>
                `;
            }
            return;
        }

        // Display indirect referrals
        let indirectHTML = `
            <div class="bg-gray-700 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-center">
                    <span class="text-gray-300">Gesamt indirekte Referrals:</span>
                    <span class="text-blue-400 font-bold">${allIndirectReferrals.length}</span>
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-gray-300">Gesamt Einnahmen (1%):</span>
                    <span class="text-green-400 font-bold">${totalIndirectEarnings.toFixed(4)} tBNB</span>
                </div>
            </div>
        `;

        allIndirectReferrals.forEach((referral, index) => {
            const joinDate = referral.createdAt ? 
                (referral.createdAt.toDate ? referral.createdAt.toDate() : new Date(referral.createdAt)) : 
                new Date();
            
            const isActive = referral.lastActivity ? 
                (new Date() - new Date(referral.lastActivity)) < (7 * 24 * 60 * 60 * 1000) : false;
            
            indirectHTML += `
                <div class="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                <span class="text-white font-bold">${(referral.username || referral.email || 'User').charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <h3 class="text-white font-medium">${referral.username || referral.email || 'Unbekannter User'}</h3>
                                <p class="text-gray-400 text-sm">Beigetreten: ${joinDate.toLocaleDateString('de-DE')}</p>
                                <p class="text-purple-400 text-xs">Geworben von: ${referral.directReferrer}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="flex items-center space-x-2">
                                <span class="text-xs px-2 py-1 rounded ${isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}">
                                    ${isActive ? 'Aktiv' : 'Inaktiv'}
                                </span>
                            </div>
                            <div class="text-sm text-gray-400 mt-1">
                                Verdient: <span class="text-green-400 font-bold">${(referral.referralEarnings || 0).toFixed(4)} tBNB</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (listContainer) {
            listContainer.innerHTML = indirectHTML;
        }

    } catch (error) {
        console.error('❌ Error loading indirect referrals:', error);
        const listContainer = document.getElementById('indirect-referrals-list');
        if (listContainer) {
            listContainer.innerHTML = '<div class="text-center text-red-400 p-8">Fehler beim Laden der indirekten Referrals</div>';
        }
    }
};
