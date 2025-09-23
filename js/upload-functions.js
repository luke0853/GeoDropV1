// Upload Functions for GeoDrop App

// Validate image for GeoDrop using AWS Rekognition
async function validateImageForGeoDrop(file, drop) {
    console.log('🔍 Validating image for GeoDrop with AWS Rekognition...');
    
    try {
        // Basic file validation
        if (!file || !file.type.startsWith('image/')) {
            return { valid: false, error: 'Bitte wähle eine gültige Bilddatei aus!' };
        }
        
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return { valid: false, error: 'Bild ist zu groß! Maximal 10MB erlaubt.' };
        }
        
        // For Dev Drops or Dev users, use proper validation (not lenient)
        if (drop.isDevDrop || drop.collection === 'devDrops' || window.isDevLoggedIn) {
            console.log('🔧 Dev Drop/User - using AWS validation for proper testing');
            
            // Use AWS validation for dev users too (for proper testing)
            if (window.awsRekognitionService) {
                try {
                    const validation = await window.awsRekognitionService.validateImage(file);
                    console.log('🔧 Dev AWS validation result:', validation);
                    
                    // For dev users, still require proper validation
                    if (validation.valid) {
                        return { valid: true, confidence: validation.confidence };
                    } else {
                        return { valid: false, error: `AWS Validation failed: ${validation.reasons ? validation.reasons.join(', ') : validation.error}` };
                    }
                } catch (awsError) {
                    console.log('🔧 AWS validation failed for dev user:', awsError);
                    return { valid: false, error: `AWS Validation error: ${awsError.message}` };
                }
            } else {
                console.log('🔧 No AWS service available for dev user');
                return { valid: false, error: 'AWS validation service not available' };
            }
        }
        
        // For normal users, use strict AWS validation
        if (window.awsRekognitionService) {
            console.log('🔍 Using AWS Rekognition for image validation...');
            
            // Get reference image if available
            let referenceImage = null;
            if (drop.referenceImage) {
                try {
                    // Try to load reference image from Firebase Storage
                    const referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2F${drop.referenceImage}.jpg?alt=media`;
                    const response = await fetch(referenceImageUrl);
                    if (response.ok) {
                        const blob = await response.blob();
                        referenceImage = blob;
                        console.log('📸 Reference image loaded for comparison');
                    }
                } catch (error) {
                    console.log('⚠️ Could not load reference image:', error);
                }
            }
            
            const validation = await window.awsRekognitionService.validateImage(file, referenceImage);
            console.log('🔍 AWS validation result:', validation);
            
            if (validation.valid) {
                console.log(`✅ AWS validation passed (Confidence: ${validation.confidence.toFixed(1)}%)`);
                return { valid: true, confidence: validation.confidence };
            } else {
                const errorMessage = validation.reasons.length > 0 
                    ? validation.reasons.join(', ') 
                    : validation.error || 'Bildvalidierung fehlgeschlagen';
                console.log('❌ AWS validation failed:', errorMessage);
                return { valid: false, error: `AWS Validation: ${errorMessage}` };
            }
        } else {
            console.error('❌ AWS Rekognition service not available');
            return { valid: false, error: 'Bildvalidierungsservice nicht verfügbar!' };
        }
        
    } catch (error) {
        console.error('❌ Image validation error:', error);
        return { valid: false, error: 'Fehler bei der Bildvalidierung!' };
    }
}

// GPS and image quality functions removed - now using AWS Rekognition for all validation

// Enhanced Photo Upload with Coordinate Adjustment
window.claimGeoDrop = async function() {
    console.log('🎯 Starting GeoDrop claim process...');
    
    // Check if user is logged in
    if (!window.currentUser) {
        const errorMsg = 'Bitte zuerst anmelden!';
        showMessage(`❌ ${errorMsg}`, true);
        return { success: false, error: errorMsg };
    }
    
    // Get photo input
    const photoInput = document.getElementById('photo-input');
    if (!photoInput || !photoInput.files || photoInput.files.length === 0) {
        const errorMsg = 'Bitte wähle ein Foto aus!';
        showMessage(`❌ ${errorMsg}`, true);
        return { success: false, error: errorMsg };
    }
    
    // Get selected drop
    const selectedDropId = document.getElementById('selected-drop-id')?.value;
    if (!selectedDropId) {
        const errorMsg = 'Bitte wähle einen GeoDrop aus!';
        showMessage(`❌ ${errorMsg}`, true);
        return { success: false, error: errorMsg };
    }
    
    const file = photoInput.files[0];
    
    try {
        showMessage('📸 Verarbeite Foto und Koordinaten...', false);
        
        // 0. Client-side file validation
        if (!file) {
            showMessage('❌ Bitte wähle eine Datei aus!', true);
            return { success: false, error: 'No file selected' };
        }
        
        // Check file format
        const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        if (!supportedFormats.includes(file.type)) {
            showMessage(`❌ Unsupported Dateiformat: ${file.type}. Erlaubt: JPEG, PNG, WebP`, true);
            return { success: false, error: 'Unsupported file format' };
        }
        
        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showMessage(`❌ Datei zu groß: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 5MB`, true);
            return { success: false, error: 'File too large' };
        }
        
        // 1. Get current location with high accuracy
        let location = await getCurrentLocationWithAccuracy();
        if (!location) {
            const errorMsg = 'Standort konnte nicht ermittelt werden!';
            showMessage(`❌ ${errorMsg}`, true);
            return { success: false, error: errorMsg };
        }
        
        // Check if Dev coordinates are set and user is Dev - use them instead
        const isDevLoggedIn = window.isDevLoggedIn || 
                             sessionStorage.getItem('devLoggedIn') === 'true';
        
        if (isDevLoggedIn && window.devTestLat && window.devTestLng) {
            console.log('🎯 Dev user - using Dev test coordinates instead of GPS');
            location = {
                lat: window.devTestLat,
                lng: window.devTestLng,
                accuracy: 1, // Dev coordinates are considered very accurate
                timestamp: new Date()
            };
        }
        
        console.log('📍 Current location:', location);
        
        // 2. Calculate file hash for verification
        const fileHash = await calculateFileHash(file);
        console.log('🔐 File hash calculated:', fileHash);
        
        // 3. Upload photo to Firebase Storage
        const timestamp = Date.now();
        const filename = `user_upload_${selectedDropId}_${window.currentUser.uid}_${timestamp}.jpg`;
        const storageRef = storage.ref(`user_uploads/${filename}`);
        
        showMessage('📤 Lade Foto hoch...', false);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        if (!downloadURL) {
            throw new Error('Foto-Upload fehlgeschlagen - keine Download-URL erhalten');
        }
        
        console.log('✅ Photo upload successful:', downloadURL);
        
        // 4. Determine drop collection (devDrops or userDrops)
        let dropCollection;
        if (window.currentDropCollection) {
            // Use collection from GeoCard
            dropCollection = window.currentDropCollection;
            console.log('🎯 Using currentDropCollection:', dropCollection);
        } else {
            // Fallback logic: check if it's a user drop or dev drop
            if (selectedDropId.includes('UserDrop') || selectedDropId.includes('user')) {
                dropCollection = 'userDrops';
            } else {
                dropCollection = 'devDrops';
            }
            console.log('🎯 Using fallback collection logic:', { selectedDropId, dropCollection });
        }
        
        // 5. Get drop document
        const dropDoc = await db.collection(dropCollection).doc(selectedDropId).get();
        if (!dropDoc.exists) {
            throw new Error('GeoDrop nicht gefunden!');
        }
        
        const drop = dropDoc.data();
        
        // 6. Calculate distance between user and drop
        const distance = calculateDistance(
            location.lat, location.lng,
            drop.lat, drop.lng
        );
        
        console.log('📏 Distance to drop:', distance, 'meters');
        
        // 7. Check if user is close enough (within 50 meters for normal users, unlimited for Dev users)
        const maxDistance = window.isDevLoggedIn ? Infinity : 50; // Unlimited for Dev, 50m for normal users
        if (distance > maxDistance) {
            const errorMsg = `Zu weit entfernt! Du bist ${distance.toFixed(0)}m vom GeoDrop entfernt. Maximal ${maxDistance === Infinity ? 'unbegrenzt (Dev)' : '50m'} erlaubt.`;
            showMessage(`❌ ${errorMsg}`, true);
            return { success: false, error: errorMsg };
        }
        
        // Log distance info for Dev users
        if (window.isDevLoggedIn) {
            console.log(`🔧 Dev mode: Distance ${distance.toFixed(0)}m (limit: ${maxDistance}m) - OK`);
        }
        
        // 7.5. Validate image matches the GeoDrop (basic validation)
        const imageValidation = await validateImageForGeoDrop(file, drop);
        if (!imageValidation.valid) {
            const errorMsg = imageValidation.error || 'Das Foto entspricht nicht dem GeoDrop. Bitte mache ein Foto vom richtigen Ort!';
            showMessage(`❌ ${errorMsg}`, true);
            return { success: false, error: errorMsg };
        }
        
        // 8. Check if user already claimed this drop today
        const today = new Date().toDateString();
        const lastClaimDate = drop.lastClaimDate ? drop.lastClaimDate.toDate().toDateString() : null;
        
        if (lastClaimDate === today && drop.claimedBy === window.currentUser.uid) {
            const errorMsg = 'Du hast diesen GeoDrop heute bereits gesammelt! Komm morgen wieder.';
            showMessage(`❌ ${errorMsg}`, true);
            return { success: false, error: errorMsg };
        }
        
        // 9. Update drop with claim information (daily system)
        const claimData = {
            claimedBy: window.currentUser.uid,
            claimedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastClaimDate: firebase.firestore.FieldValue.serverTimestamp(),
            claimPhoto: downloadURL,
            claimLocation: {
                lat: location.lat,
                lng: location.lng,
                accuracy: location.accuracy
            },
            claimDistance: distance,
            fileHash: fileHash,
            isClaimedToday: true,
            claimCount: (drop.claimCount || 0) + 1,
            // Keep isAvailable true for daily claims
            isAvailable: true
        };
        
        console.log('🎯 Updating drop with claim data:', { 
            dropCollection, 
            selectedDropId, 
            claimData: {
                claimedBy: claimData.claimedBy,
                lastClaimDate: 'serverTimestamp',
                isClaimedToday: claimData.isClaimedToday
            }
        });
        
        await db.collection(dropCollection).doc(selectedDropId).update(claimData);
        
        console.log('✅ Drop claim data updated successfully');
        
        // 10. Update user's PixelDrop balance
        const reward = drop.reward || 100;
        await updateUserPixelDrops(reward);
        
        // 11. Send Telegram notification
        if (window.CONFIG && window.CONFIG.telegram.enabled) {
            try {
                await sendTelegramNotification('geodrop', {
                    username: window.currentUser.displayName || window.currentUser.email,
                    reward: reward,
                    distance: distance
                });
            } catch (telegramError) {
                console.warn('⚠️ Telegram notification failed:', telegramError);
            }
        }
        
        // 12. Show success message
        showMessage(`✅ GeoDrop erfolgreich gesammelt! +${reward} PixelDrops`, false);
        
        // 13. Create visual effects
        if (typeof createFloatingElement === 'function') {
            createFloatingElement(`+${reward}`, '#10b981');
        }
        
        if (typeof createBonusParticles === 'function') {
            createBonusParticles(5);
        }
        
        // 14. Clear form
        photoInput.value = '';
        document.getElementById('selected-drop-id').value = '';
        
        // 15. Reload drops
        if (typeof loadGeoDrops === 'function') {
            loadGeoDrops();
        }
        
        console.log('🎯 GeoDrop claim completed successfully');
        
        // 15.5. Send Telegram notification for successful claim
        try {
            const username = window.userProfile?.username || window.currentUser?.email?.split('@')[0] || 'User';
            const dropName = drop.name || 'Unknown Drop';
            const telegramMessage = `🎯 **GeoDrop Claimed!**\n\n👤 User: ${username}\n📍 Drop: ${dropName}\n💰 Reward: ${reward} PixelDrops\n📏 Distance: ${distance.toFixed(0)}m\n⏰ Time: ${new Date().toLocaleString('de-DE')}`;
            
            console.log('📱 Sending Telegram notification for GeoDrop claim:', telegramMessage);
            
            // Use the same Telegram function as trading
            if (typeof window.sendTelegramNotification === 'function') {
                await window.sendTelegramNotification(telegramMessage);
            } else {
                // Fallback: direct Telegram call
                const botToken = window.PUBLIC_TELEGRAM_CONFIG?.botToken || '1935483099:AAHOfH7npOyPg_xURTQi4uDc3Esh_fg37Bc';
                const chatId = window.PUBLIC_TELEGRAM_CONFIG?.chatId || '-1001270226245';
                const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(telegramMessage)}`;
                
                await fetch(telegramUrl);
                console.log('✅ Telegram notification sent for GeoDrop claim');
            }
        } catch (telegramError) {
            console.error('❌ Error sending Telegram notification for GeoDrop claim:', telegramError);
            // Don't fail the claim if Telegram fails
        }
        
        // 16. Return success result
        return { success: true, reward: reward, distance: distance };
        
    } catch (error) {
        console.error('❌ Error claiming GeoDrop:', error);
        
        // Create user-friendly error message
        let errorMsg = 'GPS Position oder Bild falsch!';
        
        // Check for specific error types and provide better messages
        if (error.message.includes('Cannot access')) {
            errorMsg = 'GPS Position oder Bild falsch!';
        } else if (error.message.includes('Zu weit entfernt')) {
            errorMsg = error.message; // Keep distance message as is
        } else if (error.message.includes('Bild enthält keine GPS-Daten')) {
            errorMsg = error.message; // Keep GPS message as is
        } else if (error.message.includes('entspricht nicht dem Referenzbild')) {
            errorMsg = error.message; // Keep image validation message as is
        } else if (error.message.includes('zu alt') || error.message.includes('zu klein') || error.message.includes('zu dunkel')) {
            errorMsg = error.message; // Keep image quality messages as is
        } else if (error.message.includes('bereits heute gesammelt')) {
            errorMsg = error.message; // Keep daily claim message as is
        } else {
            // For technical errors, show generic message
            errorMsg = 'GPS Position oder Bild falsch!';
        }
        
        showMessage(`❌ ${errorMsg}`, true);
        return { success: false, error: errorMsg };
    }
};

// Get current location with high accuracy
async function getCurrentLocationWithAccuracy() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation nicht unterstützt'));
            return;
        }
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date()
                };
                
                console.log('📍 High accuracy location obtained:', location);
                resolve(location);
            },
            (error) => {
                console.error('❌ Geolocation error:', error);
                reject(error);
            },
            options
        );
    });
}

// Calculate distance between two coordinates in meters
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

// Calculate file hash for verification
async function calculateFileHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Update user's PixelDrop balance and activity
window.updateUserPixelDrops = async function(amount) {
    try {
        const userRef = db.collection('users').doc(window.currentUser.uid);
        
        // Get current date for today's activity
        const today = new Date().toDateString();
        
        // Update multiple fields - use set with merge to ensure fields exist
        await userRef.set({
            coins: firebase.firestore.FieldValue.increment(amount), // Main balance
            drops: firebase.firestore.FieldValue.increment(1), // Total drops collected
            todayDrops: firebase.firestore.FieldValue.increment(1), // Today's drops
            todayCoins: firebase.firestore.FieldValue.increment(amount), // Today's coins earned
            lastClaim: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log(`💰 User balance updated: +${amount} PixelDrops, +1 GeoDrop`);
        
        // Update local userProfile if it exists
        if (window.userProfile) {
            window.userProfile.coins = (window.userProfile.coins || 0) + amount;
            window.userProfile.drops = (window.userProfile.drops || 0) + 1;
            window.userProfile.todayDrops = (window.userProfile.todayDrops || 0) + 1;
            window.userProfile.todayCoins = (window.userProfile.todayCoins || 0) + amount;
            console.log('📊 Local userProfile updated:', {
                coins: window.userProfile.coins,
                drops: window.userProfile.drops,
                todayDrops: window.userProfile.todayDrops,
                todayCoins: window.userProfile.todayCoins
            });
        }
        
        // Update UI if function exists
        if (typeof updateUserDisplay === 'function') {
            updateUserDisplay();
        }
        
        // Update dashboard if function exists
        if (typeof window.updateDashboardDisplay === 'function') {
            setTimeout(() => {
                window.updateDashboardDisplay();
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Error updating user balance:', error);
        throw error;
    }
}

// Enhanced upload photo function
window.uploadPhoto = function() {
    // Check if we have a captured photo from camera
    let file = null;
    
    if (window.capturedPhotoFile) {
        // Use captured photo from camera
        file = window.capturedPhotoFile;
        console.log('📸 Using captured photo from camera');
    } else {
        // Fallback to file input
        const input = document.getElementById('photo-input');
        if (input && input.files.length > 0) {
            file = input.files[0];
            console.log('📁 Using file from input');
        }
    }
    
    if (file) {
        const fileSize = file.size / 1024 / 1024; // Size in MB
        
        if (fileSize > 10) {
            showMessage('❌ Datei zu groß! Maximal 10MB erlaubt.', true);
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            showMessage('❌ Bitte wähle eine Bilddatei aus!', true);
            return;
        }
        
        showMessage('📸 Foto ausgewählt! Bereit zum Hochladen.', false);
        console.log('📸 Photo selected:', {
            name: file.name,
            size: fileSize.toFixed(2) + 'MB',
            type: file.type
        });
    } else {
        showMessage('❌ Bitte wähle ein Foto aus', true);
    }
};

// Coordinate adjustment function
window.adjustCoordinates = function() {
    const latInput = document.getElementById('adjust-lat');
    const lngInput = document.getElementById('adjust-lng');
    
    if (!latInput || !lngInput) {
        showMessage('❌ Koordinaten-Eingabefelder nicht gefunden!', true);
        return;
    }
    
    const newLat = parseFloat(latInput.value);
    const newLng = parseFloat(lngInput.value);
    
    if (isNaN(newLat) || isNaN(newLng)) {
        showMessage('❌ Bitte gültige Koordinaten eingeben!', true);
        return;
    }
    
    if (newLat < -90 || newLat > 90) {
        showMessage('❌ Breitengrad muss zwischen -90 und 90 liegen!', true);
        return;
    }
    
    if (newLng < -180 || newLng > 180) {
        showMessage('❌ Längengrad muss zwischen -180 und 180 liegen!', true);
        return;
    }
    
    // Update current location
    window.currentLocation = {
        lat: newLat,
        lng: newLng,
        accuracy: 1, // Manual adjustment = high accuracy
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
        
        window.locationMarker.bindPopup(`
            <div class="text-center">
                <strong>📍 Angepasster Standort</strong><br>
                <small>${newLat.toFixed(6)}, ${newLng.toFixed(6)}</small><br>
                <small>Manuell angepasst</small>
            </div>
        `).openPopup();
    }
    
    showMessage(`✅ Koordinaten angepasst: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}`, false);
    console.log('📍 Coordinates adjusted:', { lat: newLat, lng: newLng });
};

console.log('📤 Upload functions loaded');
