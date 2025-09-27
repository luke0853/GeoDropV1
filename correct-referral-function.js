        // Update Referral statistics with real data from Firebase - KORREKTE VERSION
        function updateReferralStats() {
            console.log('📊 Updating Referral statistics from Firebase - KORREKTE VERSION...');
            
            if (window.db && window.auth) {
                const user = window.auth.currentUser;
                if (user) {
                    console.log('🔍 Current user UID:', user.uid);
                    
                    // 1. ZÄHLE DIREKTE REFERRALS: User mit referredBy == currentUser.uid
                    window.db.collection('users')
                        .where('referredBy', '==', user.uid)
                        .get()
                        .then((directRefsSnapshot) => {
                            const directReferrals = directRefsSnapshot.size;
                            console.log('✅ Direkte Referrals gefunden:', directReferrals);
                            
                            let indirectReferrals = 0;
                            let activeReferrals = 0;
                            let totalEarnings = 0;
                            
                            // 2. ZÄHLE INDIREKTE REFERRALS: Für jeden direkten Referral, zähle seine Referrals
                            const indirectPromises = [];
                            directRefsSnapshot.forEach((directRefDoc) => {
                                const directRefId = directRefDoc.id;
                                const directRefData = directRefDoc.data();
                                
                                // Zähle aktive direkte Referrals (die gekauft haben)
                                if (directRefData.totalSpent && directRefData.totalSpent > 0) {
                                    activeReferrals++;
                                    totalEarnings += directRefData.totalSpent * 0.05; // 5% für direkte
                                    console.log('💰 Direkter Referral gekauft:', directRefData.totalSpent, 'tBNB');
                                }
                                
                                // Zähle indirekte Referrals (Referrals der direkten Referrals)
                                indirectPromises.push(
                                    window.db.collection('users')
                                        .where('referredBy', '==', directRefId)
                                        .get()
                                        .then((indirectRefsSnapshot) => {
                                            indirectReferrals += indirectRefsSnapshot.size;
                                            console.log('🔍 Indirekte Referrals für', directRefId, ':', indirectRefsSnapshot.size);
                                            
                                            // Zähle aktive indirekte Referrals
                                            indirectRefsSnapshot.forEach((indirectRefDoc) => {
                                                const indirectData = indirectRefDoc.data();
                                                if (indirectData.totalSpent && indirectData.totalSpent > 0) {
                                                    activeReferrals++;
                                                    totalEarnings += indirectData.totalSpent * 0.01; // 1% für indirekte
                                                    console.log('💰 Indirekter Referral gekauft:', indirectData.totalSpent, 'tBNB');
                                                }
                                            });
                                        })
                                );
                            });
                            
                            // 3. WARTE AUF ALLE INDIREKTEN REFERRALS UND UPDATE DOM
                            Promise.all(indirectPromises).then(() => {
                                const referralStats = {
                                    directReferrals: directReferrals.toString(),
                                    indirectReferrals: indirectReferrals.toString(),
                                    activeReferrals: activeReferrals.toString(),
                                    referralEarnings: totalEarnings.toFixed(2),
                                    totalReferralEarnings: totalEarnings.toFixed(2)
                                };
                                
                                console.log('📊 FINALE REFERRAL STATISTIKEN:', referralStats);
                                
                                // Update DOM elements
                                const referralElements = {
                                    'direct-referrals': referralStats.directReferrals,
                                    'indirect-referrals-count': referralStats.indirectReferrals,
                                    'active-referrals': referralStats.activeReferrals,
                                    'referral-earnings': referralStats.referralEarnings + ' tBNB',
                                    'total-referral-earnings': referralStats.totalReferralEarnings + ' tBNB'
                                };
                                
                                Object.entries(referralElements).forEach(([id, value]) => {
                                    const element = document.getElementById(id);
                                    if (element) {
                                        element.textContent = value;
                                        console.log('✅ Updated', id, 'to:', value);
                                    }
                                });
                                
                                console.log('✅ Referral statistics KORREKT geladen aus Firebase:', referralStats);
                            });
                        })
                        .catch((error) => {
                            console.error('❌ Error loading referral stats from Firebase:', error);
                        });
                } else {
                    console.log('❌ No authenticated user found');
                }
            } else {
                console.log('❌ Firebase database not available');
            }
        }
