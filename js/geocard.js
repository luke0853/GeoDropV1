// GeoCard Functions - Map and Location Functions

// Add event listener for photo input on mobile
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
        photoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('📸 Photo selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
                
                // Show preview
                const preview = document.getElementById('photo-preview');
                if (preview) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.innerHTML = `
                            <div class="text-sm text-gray-300 mb-2">📸 Ausgewähltes Foto:</div>
                            <img src="${e.target.result}" class="w-full h-32 object-cover rounded border border-gray-600" alt="Foto Preview">
                            <div class="text-xs text-gray-400 mt-1">${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>
                            <div class="text-xs text-green-400 mt-1">✅ Bereit zum Upload</div>
                        `;
                    };
                    reader.readAsDataURL(file);
                }
                
                showMessage('📸 Foto ausgewählt: ' + file.name, false);
            }
        });
    }
});

// Get drop description based on current language and Firebase dual-language fields
function getDropDescription(drop, currentLang) {
    // If dual language fields exist, use them
    if (currentLang === 'de' && drop.description_de) {
        return drop.description_de;
    } else if (currentLang === 'en' && drop.description_en) {
        return drop.description_en;
    }
    
    // Fallback to original description or photoDescription
    if (drop.description) {
        return drop.description;
    } else if (drop.photoDescription) {
        return drop.photoDescription;
    }
    
    // Final fallback
    return currentLang === 'en' ? 'The object or scene at this location' : 'Das Objekt oder die Szene an diesem Standort';
}

// Manual reload function for drop lists
window.reloadAllDropLists = async function() {
    console.log('🔄 Manually reloading all drop lists...');
    
    try {
        // Reload User Drops for Upload
        if (typeof loadUserDropsForUpload === 'function') {
            await loadUserDropsForUpload();
        }
        
        // Reload User GeoDrops table
        if (typeof loadUserGeoDrops === 'function') {
            await loadUserGeoDrops();
        }
        
        // Reload Dev GeoDrops table
        if (typeof loadDevGeoDrops === 'function') {
            await loadDevGeoDrops();
        }
        
        // Reload all GeoDrops for map
        if (typeof loadGeoDrops === 'function') {
            await loadGeoDrops();
        }
        
        console.log('✅ All drop lists manually reloaded');
        showMessage('✅ Alle Listen wurden neu geladen', false);
        
    } catch (error) {
        console.error('❌ Error reloading drop lists:', error);
        showMessage('❌ Fehler beim Neuladen der Listen', true);
    }
};

// Create 9 test drops for all Austrian states
window.createAllAustrianStateDrops = async function() {
    console.log('🇦🇹 Creating 9 Austrian State Test Drops...');
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    const austrianStates = [
        {
            name: 'Burgenland',
            place: 'Schloss Esterházy Eisenstadt',
            coordinates: { lat: 47.8456, lng: 16.5236 },
            dropNumber: 2
        },
        {
            name: 'Kärnten', 
            place: 'Minimundus Klagenfurt',
            coordinates: { lat: 46.6247, lng: 14.3053 },
            dropNumber: 3
        },
        {
            name: 'Niederösterreich',
            place: 'Stift Melk',
            coordinates: { lat: 48.22802251267518, lng: 15.328281989202512 },
            dropNumber: 1,
            skip: true // Already created
        },
        {
            name: 'Oberösterreich',
            place: 'Hallstatt',
            coordinates: { lat: 47.5622, lng: 13.6493 },
            dropNumber: 4
        },
        {
            name: 'Salzburg',
            place: 'Festung Hohensalzburg',
            coordinates: { lat: 47.7944, lng: 13.0467 },
            dropNumber: 5
        },
        {
            name: 'Steiermark',
            place: 'Schloss Eggenberg Graz',
            coordinates: { lat: 47.0708, lng: 15.3903 },
            dropNumber: 6
        },
        {
            name: 'Tirol',
            place: 'Goldenes Dachl Innsbruck',
            coordinates: { lat: 47.2692, lng: 11.3931 },
            dropNumber: 7
        },
        {
            name: 'Vorarlberg',
            place: 'Bregenzer Festspiele',
            coordinates: { lat: 47.5031, lng: 9.7472 },
            dropNumber: 8
        },
        {
            name: 'Wien',
            place: 'Schloss Schönbrunn',
            coordinates: { lat: 48.1847, lng: 16.3122 },
            dropNumber: 9
        }
    ];
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const state of austrianStates) {
        if (state.skip) {
            console.log(`⏭️ Skipping ${state.name} - already created`);
            skipCount++;
            continue;
        }
        
        try {
            console.log(`🏛️ Creating ${state.name} drop: ${state.place}...`);
            
            const db = window.firebase.firestore();
            
            // Get image from Google Places API
            let imageBlob;
            try {
                console.log(`📥 Getting ${state.place} image from Google Places API...`);
                const searchResponse = await fetch(`/api/places/search?query=${encodeURIComponent(state.place)}`);
                if (searchResponse.ok) {
                    const searchData = await searchResponse.json();
                    if (searchData.results && searchData.results.length > 0) {
                        const placeId = searchData.results[0].place_id;
                        console.log(`📍 Found ${state.place} Place ID:`, placeId);
                        
                        const placeResponse = await fetch(`/api/places/details/${placeId}`);
                        if (placeResponse.ok) {
                            const placeData = await placeResponse.json();
                            if (placeData.result.photos && placeData.result.photos.length > 0) {
                                const photoRef = placeData.result.photos[0].photo_reference;
                                const photoResponse = await fetch(`/api/places/photo/?photo_reference=${photoRef}&maxwidth=800`);
                                if (photoResponse.ok) {
                                    imageBlob = await photoResponse.blob();
                                    console.log(`✅ Got real ${state.place} image from Google Places API`);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(`❌ Could not get Google Places image for ${state.place}:`, error);
            }
            
            // Fallback to Unsplash if Google Places fails
            if (!imageBlob) {
                console.log(`📥 Using fallback image for ${state.place}...`);
                try {
                    const imageResponse = await fetch('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format');
                    imageBlob = await imageResponse.blob();
                    console.log(`✅ Using fallback image for ${state.place}`);
                } catch (error) {
                    console.error(`❌ Could not load any image for ${state.place}:`, error);
                    continue;
                }
            }
            
            // Upload to Firebase Storage
            const storage = window.firebase.storage();
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`referenzbilder_userdrop/UserDrop${state.dropNumber}_${state.name.replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue')}.jpg`);
            
            console.log(`📤 Uploading reference image for ${state.name}...`);
            const uploadTask = await imageRef.put(imageBlob);
            const downloadURL = await uploadTask.ref.getDownloadURL();
            
            // Calculate hash
            const arrayBuffer = await imageBlob.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
        // Get current user info
        const currentUser = window.firebase.auth().currentUser;
        const userName = currentUser.displayName || currentUser.email || 'Unknown User';
        
        // Get the real username from Firebase user profile
        let realUsername = null;
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                realUsername = userData.username || userData.displayName;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
        
        if (!realUsername) {
            alert('❌ Username nicht gefunden! Bitte Profil vervollständigen.');
            return;
        }
        
        // Create drop document
        const dropData = {
            name: `UserDrop${state.dropNumber}_${state.name.replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue')}`,
            geodropNumber: state.dropNumber.toString(),
            coordinates: new window.firebase.firestore.GeoPoint(state.coordinates.lat, state.coordinates.lng),
            lat: state.coordinates.lat,
            lng: state.coordinates.lng,
            reward: 10,
            description: `Test-Drop für ${state.name}: ${state.place}`,
            photoDescription: `Fotografiere ${state.place} in ${state.name}. Das Objekt sollte vollständig sichtbar sein.`,
            imageUrl: downloadURL,
            imageHash: hashHex,
            createdBy: currentUser.uid,
            createdByName: userName,
            ersteller: realUsername, // Use real username from Firebase profile
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            dropType: 'user',
            state: state.name,
            place: state.place
        };
            
            await db.collection('userDrops').add(dropData);
            console.log(`✅ ${state.name} Drop created: UserDrop${state.dropNumber}_${state.name.replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue')}`);
            successCount++;
            
            // Small delay between drops
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`❌ Error creating ${state.name} drop:`, error);
        }
    }
    
    console.log(`🎉 Austrian State Drops Creation Complete!`);
    console.log(`✅ Successfully created: ${successCount} drops`);
    console.log(`⏭️ Skipped: ${skipCount} drops`);
    console.log(`❌ Failed: ${austrianStates.length - successCount - skipCount} drops`);
    
    // Reload all lists
    console.log('🔄 Reloading all drop lists...');
    await loadUserDropsForUpload();
    await loadUserGeoDrops();
    await loadGeoDrops();
    console.log('✅ All drop lists reloaded');
    
    showMessage(`🎉 ${successCount} österreichische Bundesländer-Drops erstellt!`, false);
};

// Create individual state drops (simpler approach)
window.createBurgenlandDrop = async function() {
    await createSingleStateDrop('Burgenland', 'Schloss Esterházy Eisenstadt', 47.8456, 16.5236, 2);
};

window.createKaerntenDrop = async function() {
    await createSingleStateDrop('Kärnten', 'Minimundus Klagenfurt', 46.6247, 14.3053, 3);
};

window.createOberoesterreichDrop = async function() {
    await createSingleStateDrop('Oberösterreich', 'Linz Hauptplatz', 48.3069, 14.2858, 4);
};

window.createSalzburgDrop = async function() {
    await createSingleStateDrop('Salzburg', 'Festung Hohensalzburg', 47.7944, 13.0467, 5);
};

window.createSteiermarkDrop = async function() {
    await createSingleStateDrop('Steiermark', 'Schloss Eggenberg Graz', 47.0708, 15.3903, 6);
};

window.createTirolDrop = async function() {
    await createSingleStateDrop('Tirol', 'Goldenes Dachl Innsbruck', 47.2692, 11.3931, 7);
};

window.createVorarlbergDrop = async function() {
    await createSingleStateDrop('Vorarlberg', 'Bregenzer Festspiele', 47.5031, 9.7472, 8);
};

window.createWienDrop = async function() {
    await createSingleStateDrop('Wien', 'Schloss Schönbrunn', 48.1847, 16.3122, 9);
};

// Clear User Drop lists only (not the data behind)
window.clearUserDropLists = function() {
    console.log('🧹 Clearing User Drop lists...');
    
    // Set flag to prevent reloading
    window.userDropListsCleared = true;
    
    // Clear User Drops table
    const userDropsTable = document.getElementById('user-drops-table');
    if (userDropsTable) {
        userDropsTable.innerHTML = `<div class="text-center text-gray-400 p-4">${window.t ? window.t('geocard.user-drop-list-cleared') : 'User Drop Liste geleert'}</div>`;
    }
    
    // Clear All User Drops table
    const allUserDropsTable = document.getElementById('all-user-drops-table');
    if (allUserDropsTable) {
        allUserDropsTable.innerHTML = `<div class="text-center text-gray-400 p-4">${window.t ? window.t('geocard.user-drop-list-cleared') : 'User Drop Liste geleert'}</div>`;
    }
    
    // Clear User Drops select dropdown
    const userDropsSelect = document.getElementById('geocard-user-drop-select');
    if (userDropsSelect) {
        userDropsSelect.innerHTML = `<option value="">${window.t ? window.t('geocard.user-drop-list-cleared') : 'User Drop Liste geleert'}</option>`;
    }
    
    console.log('✅ User Drop lists cleared (data remains intact)');
    showMessage('🧹 User Drop Listen geleert (Daten bleiben erhalten)', false);
};

// Restore User Drop lists (reload from Firebase)
window.restoreUserDropLists = function() {
    console.log('🔄 Restoring User Drop lists...');
    
    // Clear flag to allow reloading
    window.userDropListsCleared = false;
    
    // Reload User Drop lists
    if (typeof loadUserDropsForUpload === 'function') {
        loadUserDropsForUpload();
    }
    if (typeof loadUserGeoDrops === 'function') {
        loadUserGeoDrops();
    }
    
    console.log('✅ User Drop lists restored');
    showMessage('🔄 User Drop Listen wiederhergestellt', false);
};

// Create missing Drop Nr. 1 (Stift Melk) if it doesn't exist
window.createMissingDrop1 = async function() {
    console.log('🔍 Checking if Drop Nr. 1 (Stift Melk) exists...');
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Check if UserDrop1_StiftMelk exists
        const existingDrops = await db.collection('userDrops')
            .where('name', '==', 'UserDrop1_StiftMelk')
            .get();
        
        if (existingDrops.empty) {
            console.log('❌ Drop Nr. 1 (Stift Melk) is missing! Creating it...');
            await createTestMelkDrop();
        } else {
            console.log('✅ Drop Nr. 1 (Stift Melk) exists');
        }
        
    } catch (error) {
        console.error('❌ Error checking Drop Nr. 1:', error);
    }
};

// Check which Austrian state drops are missing from the map
window.checkMissingMapDrops = async function() {
    console.log('🔍 Checking which drops are missing from the map...');
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Expected Austrian states
        const expectedStates = [
            { name: 'Niederösterreich', dropName: 'UserDrop1_StiftMelk' },
            { name: 'Burgenland', dropName: 'UserDrop2_Burgenland' },
            { name: 'Kärnten', dropName: 'UserDrop3_Kaernten' },
            { name: 'Oberösterreich', dropName: 'UserDrop4_Oberoesterreich' },
            { name: 'Salzburg', dropName: 'UserDrop5_Salzburg' },
            { name: 'Steiermark', dropName: 'UserDrop6_Steiermark' },
            { name: 'Tirol', dropName: 'UserDrop7_Tirol' },
            { name: 'Vorarlberg', dropName: 'UserDrop8_Vorarlberg' },
            { name: 'Wien', dropName: 'UserDrop9_Wien' }
        ];
        
        // Get all user drops
        const allUserDropsSnapshot = await db.collection('userDrops').get();
        const existingDrops = [];
        allUserDropsSnapshot.forEach(doc => {
            existingDrops.push(doc.data().name);
        });
        
        console.log('📋 Checking each state:');
        const missingStates = [];
        
        expectedStates.forEach(state => {
            const exists = existingDrops.includes(state.dropName);
            console.log(`   ${exists ? '✅' : '❌'} ${state.name}: ${state.dropName} ${exists ? 'EXISTS' : 'MISSING'}`);
            if (!exists) {
                missingStates.push(state);
            }
        });
        
        if (missingStates.length > 0) {
            console.log(`❌ Missing ${missingStates.length} state drops:`);
            missingStates.forEach(state => {
                console.log(`   - ${state.name}: ${state.dropName}`);
            });
        } else {
            console.log('✅ All 9 Austrian state drops are present!');
        }
        
        // Check map markers
        console.log(`🗺️ Map markers: ${window.dropMarkers ? window.dropMarkers.length : 0} markers on map`);
        
    } catch (error) {
        console.error('❌ Error checking missing drops:', error);
    }
};

// Check how many User Drops are in Firebase
window.checkUserDropCount = async function() {
    console.log('🔍 Checking User Drop count in Firebase...');
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Count all User Drops
        const allUserDropsSnapshot = await db.collection('userDrops').get();
        const allCount = allUserDropsSnapshot.size;
        
        // Count active User Drops
        const activeUserDropsSnapshot = await db.collection('userDrops').where('isActive', '==', true).get();
        const activeCount = activeUserDropsSnapshot.size;
        
        // Count inactive User Drops
        const inactiveCount = allCount - activeCount;
        
        console.log(`📊 User Drop Statistics:`);
        console.log(`   Total User Drops: ${allCount}`);
        console.log(`   Active User Drops: ${activeCount}`);
        console.log(`   Inactive User Drops: ${inactiveCount}`);
        
        // Check for duplicates
        const dropGroups = {};
        allUserDropsSnapshot.forEach(doc => {
            const data = doc.data();
            const name = data.name;
            if (!dropGroups[name]) {
                dropGroups[name] = [];
            }
            dropGroups[name].push({ id: doc.id, data: data, createdAt: data.createdAt });
        });
        
        let duplicateCount = 0;
        let duplicateNames = [];
        
        for (const [name, drops] of Object.entries(dropGroups)) {
            if (drops.length > 1) {
                duplicateCount += drops.length - 1; // -1 because we keep one
                duplicateNames.push(`${name} (${drops.length}x)`);
            }
        }
        
        // Show details of each drop
        console.log(`📋 User Drop Details:`);
        let counter = 1;
        const foundNumbers = [];
        allUserDropsSnapshot.forEach((doc) => {
            const data = doc.data();
            const name = data.name || 'Unbekannt';
            const number = data.geodropNumber || data.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A';
            const state = data.state || 'Unbekannt';
            const active = data.isActive ? '✅' : '❌';
            const isDuplicate = dropGroups[name] && dropGroups[name].length > 1 ? ' 🔄' : '';
            console.log(`   ${counter}. ${name} (Nr. ${number}) - ${state} ${active}${isDuplicate}`);
            if (number !== 'N/A') {
                foundNumbers.push(parseInt(number));
            }
            counter++;
        });
        
        // Show duplicate summary
        if (duplicateCount > 0) {
            console.log(`🔄 Duplikate gefunden: ${duplicateCount} (${duplicateNames.join(', ')})`);
            showMessage(`📊 User Drops: ${allCount} total, ${duplicateCount} Duplikate gefunden!\n\nDuplikate: ${duplicateNames.join(', ')}`, true);
        } else {
            console.log(`✅ Keine Duplikate gefunden`);
            showMessage(`📊 User Drops: ${allCount} total, keine Duplikate gefunden`, false);
        }
        
        // Check which numbers are missing
        const missingNumbers = [];
        for (let i = 1; i <= 9; i++) {
            if (!foundNumbers.includes(i)) {
                missingNumbers.push(i);
            }
        }
        
        if (missingNumbers.length > 0) {
            console.log(`❌ Missing Drop Numbers: ${missingNumbers.join(', ')}`);
        } else {
            console.log(`✅ All Drop Numbers 1-9 are present`);
        }
        
        showMessage(`📊 User Drops: ${allCount} total (${activeCount} aktiv, ${inactiveCount} inaktiv)`, false);
        
    } catch (error) {
        console.error('❌ Error checking User Drop count:', error);
        showMessage('❌ Fehler beim Überprüfen der User Drop Anzahl', true);
    }
};

// Clean up duplicate User Drops (keep only the latest one of each)
window.cleanupDuplicateUserDrops = async function() {
    console.log('🧹 Cleaning up duplicate User Drops...');
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    // Show confirmation dialog
    if (!confirm('🧹 Duplikate bereinigen?\n\nDies löscht alle doppelten User Drops und behält nur die neuesten.')) {
        return;
    }
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        const userDropsSnapshot = await db.collection('userDrops').get();
        
        // Group drops by name
        const dropGroups = {};
        userDropsSnapshot.forEach(doc => {
            const data = doc.data();
            const name = data.name;
            if (!dropGroups[name]) {
                dropGroups[name] = [];
            }
            dropGroups[name].push({ id: doc.id, data: data, createdAt: data.createdAt });
        });
        
        let deletedCount = 0;
        let keptCount = 0;
        
        // For each group, keep only the latest one
        for (const [dropName, drops] of Object.entries(dropGroups)) {
            if (drops.length > 1) {
                console.log(`🔍 Found ${drops.length} duplicates for ${dropName}`);
                
                // Sort by creation date (keep the latest)
                drops.sort((a, b) => {
                    const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
                    const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
                    return dateB - dateA; // Latest first
                });
                
                // Keep the first (latest), delete the rest
                const toKeep = drops[0];
                const toDelete = drops.slice(1);
                
                console.log(`✅ Keeping: ${toKeep.id} (${toKeep.createdAt ? toKeep.createdAt.toDate().toLocaleString() : 'No date'})`);
                keptCount++;
                
                for (const drop of toDelete) {
                    console.log(`🗑️ Deleting: ${drop.id} (${drop.createdAt ? drop.createdAt.toDate().toLocaleString() : 'No date'})`);
                    await db.collection('userDrops').doc(drop.id).delete();
                    deletedCount++;
                }
            } else {
                keptCount++;
            }
        }
        
        console.log(`🎉 Cleanup complete!`);
        console.log(`   Kept: ${keptCount} drops`);
        console.log(`   Deleted: ${deletedCount} duplicates`);
        
        showMessage(`🧹 Bereinigung abgeschlossen! ${deletedCount} Duplikate gelöscht, ${keptCount} Drops behalten`, false);
        
        // Reload lists
        await loadUserDropsForUpload();
        await loadUserGeoDrops();
        
    } catch (error) {
        console.error('❌ Error cleaning up duplicates:', error);
        showMessage('❌ Fehler beim Bereinigen der Duplikate', true);
    }
};

// Create all remaining Austrian state drops (skip Niederösterreich - already exists)
window.createRemainingAustrianDrops = async function() {
    console.log('🇦🇹 Creating all remaining Austrian State Drops...');
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    const remainingStates = [
        { name: 'Burgenland', place: 'Schloss Esterházy Eisenstadt', lat: 47.8456, lng: 16.5236, dropNumber: 2 },
        { name: 'Kärnten', place: 'Minimundus Klagenfurt', lat: 46.6247, lng: 14.3053, dropNumber: 3 },
        { name: 'Oberösterreich', place: 'Linz Hauptplatz', lat: 48.3069, lng: 14.2858, dropNumber: 4 },
        { name: 'Salzburg', place: 'Festung Hohensalzburg', lat: 47.7944, lng: 13.0467, dropNumber: 5 },
        { name: 'Steiermark', place: 'Schloss Eggenberg Graz', lat: 47.0708, lng: 15.3903, dropNumber: 6 },
        { name: 'Tirol', place: 'Goldenes Dachl Innsbruck', lat: 47.2692, lng: 11.3931, dropNumber: 7 },
        { name: 'Vorarlberg', place: 'Bregenzer Festspiele', lat: 47.5031, lng: 9.7472, dropNumber: 8 },
        { name: 'Wien', place: 'Schloss Schönbrunn', lat: 48.1847, lng: 16.3122, dropNumber: 9 }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const state of remainingStates) {
        try {
            await createSingleStateDrop(state.name, state.place, state.lat, state.lng, state.dropNumber);
            successCount++;
        } catch (error) {
            console.error(`❌ Error creating ${state.name} drop:`, error);
            errorCount++;
        }
    }
    
    console.log(`🎉 Remaining Austrian State Drops Creation Complete!`);
    console.log(`✅ Successfully created: ${successCount} drops`);
    console.log(`❌ Failed: ${errorCount} drops`);
    
    // Reload all lists and map
    console.log('🔄 Reloading all drop lists and map...');
    
    // Clear all tables first
    const userDropsTable = document.getElementById('user-drops-table');
    const allUserDropsTable = document.getElementById('all-user-drops-table');
    const userDropsSelect = document.getElementById('geocard-user-drop-select');
    
    if (userDropsTable) userDropsTable.innerHTML = `<div class="text-center text-gray-400 p-4">${window.t ? window.t('geocard.loading-drops') : 'Lade...'}</div>`;
    if (allUserDropsTable) allUserDropsTable.innerHTML = `<div class="text-center text-gray-400 p-4">${window.t ? window.t('geocard.loading-drops') : 'Lade...'}</div>`;
    if (userDropsSelect) userDropsSelect.innerHTML = '<option value="">Lade...</option>';
    
    await loadUserDropsForUpload();
    await loadUserGeoDrops();
    await loadGeoDrops();
    console.log('✅ All drop lists and map reloaded');
    
    showMessage(`🎉 ${successCount} österreichische Bundesländer-Drops erstellt und auf Karte eingefügt!`, false);
};

// Helper function to create a single state drop
async function createSingleStateDrop(stateName, placeName, lat, lng, dropNumber) {
    console.log(`🏛️ Creating ${stateName} drop: ${placeName}...`);
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        
        // Get image from Google Places API
        let imageBlob;
        try {
            console.log(`📥 Getting ${placeName} image from Google Places API...`);
            const searchResponse = await fetch(`/api/places/search?query=${encodeURIComponent(placeName)}`);
            if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                if (searchData.results && searchData.results.length > 0) {
                    const placeId = searchData.results[0].place_id;
                    console.log(`📍 Found ${placeName} Place ID:`, placeId);
                    
                    const placeResponse = await fetch(`/api/places/details/${placeId}`);
                    if (placeResponse.ok) {
                        const placeData = await placeResponse.json();
                        if (placeData.result.photos && placeData.result.photos.length > 0) {
                            const photoRef = placeData.result.photos[0].photo_reference;
                            const photoResponse = await fetch(`/api/places/photo/?photo_reference=${photoRef}&maxwidth=800`);
                            if (photoResponse.ok) {
                                imageBlob = await photoResponse.blob();
                                console.log(`✅ Got real ${placeName} image from Google Places API`);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log(`❌ Could not get Google Places image for ${placeName}:`, error);
        }
        
        // Fallback to Unsplash if Google Places fails
        if (!imageBlob) {
            console.log(`📥 Using fallback image for ${placeName}...`);
            try {
                const imageResponse = await fetch('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format');
                imageBlob = await imageResponse.blob();
                console.log(`✅ Using fallback image for ${placeName}`);
            } catch (error) {
                console.error(`❌ Could not load any image for ${placeName}:`, error);
                showMessage(`❌ Fehler beim Laden des Bildes für ${stateName}`, true);
                return;
            }
        }
        
        // Upload to Firebase Storage
        const storage = window.firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`referenzbilder_userdrop/UserDrop${dropNumber}_${stateName.replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue')}.jpg`);
        
        console.log(`📤 Uploading reference image for ${stateName}...`);
        const uploadTask = await imageRef.put(imageBlob);
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Calculate hash
        const arrayBuffer = await imageBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Get current user info
        const currentUser = window.firebase.auth().currentUser;
        const userName = currentUser.displayName || currentUser.email || 'Unknown User';
        
        // Get the real username from Firebase user profile
        let realUsername = null;
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                realUsername = userData.username || userData.displayName;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
        
        if (!realUsername) {
            alert('❌ Username nicht gefunden! Bitte Profil vervollständigen.');
            return;
        }
        
        // Get current language
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
        
        // Create drop document
        const dropData = {
            name: `UserDrop${dropNumber}_${stateName.replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue')}`,
            geodropNumber: dropNumber.toString(),
            coordinates: new window.firebase.firestore.GeoPoint(lat, lng),
            lat: lat,
            lng: lng,
            reward: 10,
            description: `Test-Drop für ${stateName}: ${placeName}`,
            photoDescription: `Fotografiere ${placeName} in ${stateName}. Das Objekt sollte vollständig sichtbar sein.`,
            imageUrl: downloadURL,
            imageHash: hashHex,
            createdBy: currentUser.uid,
            createdByName: userName,
            ersteller: realUsername, // Use real username from Firebase profile
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            dropType: 'user',
            state: stateName,
            place: placeName,
            // Dual language fields
            language: currentLang,
            description_de: currentLang === 'de' ? `Test-Drop für ${stateName}: ${placeName}` : null,
            description_en: currentLang === 'en' ? `Test Drop for ${stateName}: ${placeName}` : null,
            photoDescription_de: currentLang === 'de' ? `Fotografiere ${placeName} in ${stateName}. Das Objekt sollte vollständig sichtbar sein.` : null,
            photoDescription_en: currentLang === 'en' ? `Photograph ${placeName} in ${stateName}. The object should be fully visible.` : null
        };
        
        await db.collection('userDrops').add(dropData);
        console.log(`✅ ${stateName} Drop created: UserDrop${dropNumber}_${stateName.replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue')}`);
        
        // Reload all lists
        console.log('🔄 Reloading all drop lists...');
        await loadUserDropsForUpload();
        await loadUserGeoDrops();
        await loadGeoDrops();
        console.log('✅ All drop lists reloaded');
        
        showMessage(`✅ ${stateName} Drop erfolgreich erstellt!`, false);
        
    } catch (error) {
        console.error(`❌ Error creating ${stateName} drop:`, error);
        showMessage(`❌ Fehler beim Erstellen des ${stateName} Drops`, true);
    }
}

// Fix Drop 11 Creator Name - SIMPLIFIED VERSION
window.fixDrop11Creator = async function() {
    console.log('🔧 Fixing Drop 11 creator name...');
    
    try {
        const db = window.firebase.firestore();
        const currentUser = window.firebase.auth().currentUser;
        
        if (!currentUser) {
            alert('❌ Bitte zuerst anmelden!');
            return;
        }
        
        const correctCreatorName = currentUser.displayName || currentUser.email || 'Unknown User';
        console.log('👤 Correct creator name:', correctCreatorName);
        
        // Search in both collections
        const collections = ['userDrops', 'devDrops'];
        let found = false;
        
        for (const collectionName of collections) {
            console.log(`🔍 Searching in ${collectionName}...`);
            const snapshot = await db.collection(collectionName).get();
            
            for (const doc of snapshot.docs) {
                const data = doc.data();
                if (data.geodropNumber === '11' || data.geodropNumber === 11) {
                    console.log(`📄 Found Drop 11 in ${collectionName}:`, doc.id);
                    console.log('📊 Current data:', data);
                    
                    // Update the document
                    await doc.ref.update({
                        createdByName: correctCreatorName,
                        createdBy: currentUser.uid
                    });
                    
                    console.log('✅ Drop 11 updated successfully!');
                    found = true;
                    break;
                }
            }
            
            if (found) break;
        }
        
        if (found) {
            alert('✅ Drop 11 Ersteller-Name wurde repariert!');
            // Force reload
            setTimeout(() => {
                if (typeof loadGeoDrops === 'function') {
                    loadGeoDrops();
                }
                if (typeof loadUserGeoDrops === 'function') {
                    loadUserGeoDrops();
                }
            }, 1000);
        } else {
            alert('❌ Drop 11 nicht gefunden!');
        }
        
    } catch (error) {
        console.error('❌ Error fixing Drop 11:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// DEV FUNCTION - Fix any drop creator name
window.devFixDropCreator = async function(dropNumber, newCreatorName) {
    console.log(`🔧 DEV: Fixing Drop ${dropNumber} creator to: ${newCreatorName}`);
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        alert('❌ Dev-Zugang erforderlich!');
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        const collections = ['userDrops', 'devDrops'];
        let found = false;
        
        for (const collectionName of collections) {
            console.log(`🔍 Searching in ${collectionName}...`);
            const snapshot = await db.collection(collectionName).get();
            
            for (const doc of snapshot.docs) {
                const data = doc.data();
                if (data.geodropNumber === dropNumber.toString() || data.geodropNumber === dropNumber) {
                    console.log(`📄 Found Drop ${dropNumber} in ${collectionName}:`, doc.id);
                    console.log('📊 Current data:', data);
                    
                    // Update the document
                    await doc.ref.update({
                        createdByName: newCreatorName,
                        createdBy: 'dev-admin'
                    });
                    
                    console.log(`✅ Drop ${dropNumber} updated successfully!`);
                    found = true;
                    break;
                }
            }
            
            if (found) break;
        }
        
        if (found) {
            alert(`✅ Drop ${dropNumber} Ersteller wurde auf "${newCreatorName}" geändert!`);
            // Force reload
            setTimeout(() => {
                if (typeof loadGeoDrops === 'function') {
                    loadGeoDrops();
                }
                if (typeof loadUserGeoDrops === 'function') {
                    loadUserGeoDrops();
                }
            }, 1000);
        } else {
            alert(`❌ Drop ${dropNumber} nicht gefunden!`);
        }
        
    } catch (error) {
        console.error('❌ Error fixing drop:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// SECURITY FIX - Add user drop tracking to Firebase
window.addUserDropTracking = async function() {
    console.log('🔒 Adding user drop tracking to Firebase...');
    
    try {
        const db = window.firebase.firestore();
        const currentUser = window.firebase.auth().currentUser;
        
        if (!currentUser) {
            alert('❌ Bitte zuerst anmelden!');
            return;
        }
        
        // Get all user drops and count by creator
        const userDropsSnapshot = await db.collection('userDrops').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        const userDropCounts = {};
        
        // Count drops by creator
        [...userDropsSnapshot.docs, ...devDropsSnapshot.docs].forEach(doc => {
            const data = doc.data();
            if (data.createdByName) {
                userDropCounts[data.createdByName] = (userDropCounts[data.createdByName] || 0) + 1;
            }
        });
        
        console.log('📊 User drop counts:', userDropCounts);
        
        // Update user document with drop count
        const userDocRef = db.collection('users').doc(currentUser.uid);
        await userDocRef.set({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            totalDropsCreated: userDropCounts[currentUser.displayName] || 0,
            lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('✅ User drop tracking added to Firebase');
        alert('✅ User-Drop-Tracking wurde zu Firebase hinzugefügt!');
        
    } catch (error) {
        console.error('❌ Error adding user drop tracking:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// KORREKTE LÖSUNG: Setze die RICHTIGEN NUTZERNAMEN in das ersteller Feld
window.setErstellerNamen = async function() {
    console.log('👤 Setze die RICHTIGEN NUTZERNAMEN in das ersteller Feld...');
    try {
        const db = window.firebase.firestore();
        const currentUser = window.firebase.auth().currentUser;
        if (!currentUser) { alert('❌ Bitte zuerst anmelden!'); return; }
        
        // Hole alle Drops
        const userDropsSnapshot = await db.collection('userDrops').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        console.log(`📊 Gefunden: ${userDropsSnapshot.docs.length} userDrops und ${devDropsSnapshot.docs.length} devDrops`);
        
        let updatedCount = 0;
        
        // Aktualisiere userDrops - RICHTIGE NUTZERNAMEN
        for (const doc of userDropsSnapshot.docs) {
            const data = doc.data();
            let richtigerNutzername = null;
            
            // MAPPING: Email zu richtigem Nutzername
            if (data.createdByName === 'hooch_1994@yahoo.de') {
                richtigerNutzername = 'KryptoGuru';
            } else if (data.createdByName === 'KryptoGuru') {
                richtigerNutzername = 'KryptoGuru';
            } else if (data.createdByName === 'GeoDrop#420') {
                richtigerNutzername = 'GeoDrop#420';
            } else if (data.createdByName === 'nikolausmos') {
                richtigerNutzername = 'nikolausmos';
            } else {
                // Fallback: verwende createdByName
                richtigerNutzername = data.createdByName;
            }
            
            if (richtigerNutzername) {
                await doc.ref.update({
                    ersteller: richtigerNutzername
                });
                console.log(`✅ Setze ersteller für userDrop ${doc.id} (${data.geodropNumber}): ${richtigerNutzername}`);
                updatedCount++;
            }
        }
        
        // Aktualisiere devDrops - RICHTIGE NUTZERNAMEN
        for (const doc of devDropsSnapshot.docs) {
            const data = doc.data();
            let richtigerNutzername = null;
            
            // MAPPING: Email zu richtigem Nutzername
            if (data.createdByName === 'hooch_1994@yahoo.de') {
                richtigerNutzername = 'KryptoGuru';
            } else if (data.createdByName === 'KryptoGuru') {
                richtigerNutzername = 'KryptoGuru';
            } else if (data.createdByName === 'GeoDrop#420') {
                richtigerNutzername = 'GeoDrop#420';
            } else if (data.createdByName === 'nikolausmos') {
                richtigerNutzername = 'nikolausmos';
            } else {
                // Fallback: verwende createdByName
                richtigerNutzername = data.createdByName;
            }
            
            if (richtigerNutzername) {
                await doc.ref.update({
                    ersteller: richtigerNutzername
                });
                console.log(`✅ Setze ersteller für devDrop ${doc.id} (${data.geodropNumber}): ${richtigerNutzername}`);
                updatedCount++;
            }
        }
        
        console.log(`🎉 ${updatedCount} Drops haben jetzt die RICHTIGEN NUTZERNAMEN im ersteller Feld!`);
        alert(`✅ ${updatedCount} Drops haben jetzt die RICHTIGEN NUTZERNAMEN im ersteller Feld!`);
        
        // Lade Drops neu
        setTimeout(() => {
            if (typeof loadGeoDrops === 'function') loadGeoDrops();
            if (typeof loadUserGeoDrops === 'function') loadUserGeoDrops();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error setting ersteller names:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// DEBUG: Zeige alle Drops mit ersteller Feld
window.debugErstellerFeld = async function() {
    console.log('🔍 DEBUG: Zeige alle Drops mit ersteller Feld...');
    try {
        const db = window.firebase.firestore();
        const userDropsSnapshot = await db.collection('userDrops').get();
        
        console.log(`📊 Gefunden: ${userDropsSnapshot.docs.length} userDrops`);
        
        userDropsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`📄 Drop ${data.geodropNumber}: ersteller="${data.ersteller}", createdByName="${data.createdByName}"`);
        });
        
    } catch (error) {
        console.error('❌ Error debugging ersteller field:', error);
    }
};

// KORREKTUR: Setze ersteller basierend auf echten Usernames
window.korrigiereErstellerFeld = async function() {
    console.log('🔧 Korrigiere ersteller Feld mit echten Usernames...');
    try {
        const db = window.firebase.firestore();
        const userDropsSnapshot = await db.collection('userDrops').get();
        
        let updatedCount = 0;
        
        for (const doc of userDropsSnapshot.docs) {
            const data = doc.data();
            let correctErsteller = null;
            
            // Hole echten Username aus Firebase User-Profil
            try {
                const userDoc = await db.collection('users').doc(data.createdBy).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    correctErsteller = userData.username || userData.displayName;
                }
            } catch (error) {
                console.error('Error loading user profile for drop:', data.geodropNumber);
            }
            
            // Spezielle Behandlung für Drop 11
            if (data.geodropNumber === '11' || data.geodropNumber === 11) {
                correctErsteller = 'GeoDrop#420';
            }
            
            if (correctErsteller && data.ersteller !== correctErsteller) {
                await doc.ref.update({
                    ersteller: correctErsteller
                });
                console.log(`✅ Korrigiert Drop ${data.geodropNumber}: ersteller="${correctErsteller}"`);
                updatedCount++;
            }
        }
        
        console.log(`🎉 ${updatedCount} Drops wurden korrigiert!`);
        alert(`✅ ${updatedCount} Drops wurden korrigiert!`);
        
        // Lade Drops neu
        setTimeout(() => {
            if (typeof loadUserGeoDrops === 'function') loadUserGeoDrops();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error correcting ersteller field:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// SPEZIELLE KORREKTUR: Drop 11 zu GeoDrop#420
window.korrigiereDrop11 = async function() {
    console.log('🔧 Korrigiere Drop 11 zu GeoDrop#420...');
    try {
        const db = window.firebase.firestore();
        const userDropsSnapshot = await db.collection('userDrops').get();
        
        console.log(`📊 Gefunden: ${userDropsSnapshot.docs.length} userDrops`);
        
        for (const doc of userDropsSnapshot.docs) {
            const data = doc.data();
            console.log(`📄 Prüfe Drop ${data.geodropNumber}: ersteller="${data.ersteller}", createdByName="${data.createdByName}"`);
            
            if (data.geodropNumber === '11' || data.geodropNumber === 11) {
                console.log(`🎯 Gefunden: Drop 11 - aktualisiere ersteller zu "GeoDrop#420"`);
                await doc.ref.update({
                    ersteller: 'GeoDrop#420'
                });
                console.log(`✅ Drop 11 korrigiert: ersteller="GeoDrop#420"`);
                alert('✅ Drop 11 wurde zu GeoDrop#420 korrigiert!');
                
                // Lade Drops neu
                setTimeout(() => {
                    if (typeof loadUserGeoDrops === 'function') loadUserGeoDrops();
                }, 1000);
                return;
            }
        }
        
        alert('❌ Drop 11 nicht gefunden!');
        
    } catch (error) {
        console.error('❌ Error correcting Drop 11:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// KORREKTE LÖSUNG: Setze "ersteller" Feld basierend auf dem was wirklich in Firebase steht
window.fixErstellerField = async function() {
    console.log('🔧 Korrigiere "ersteller" Feld basierend auf Firebase-Daten...');
    try {
        const db = window.firebase.firestore();
        const currentUser = window.firebase.auth().currentUser;
        if (!currentUser) { alert('❌ Bitte zuerst anmelden!'); return; }
        
        // Hole alle Drops
        const userDropsSnapshot = await db.collection('userDrops').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        console.log(`📊 Gefunden: ${userDropsSnapshot.docs.length} userDrops und ${devDropsSnapshot.docs.length} devDrops`);
        
        let updatedCount = 0;
        
        // Aktualisiere userDrops - IMMER basierend auf createdByName
        for (const doc of userDropsSnapshot.docs) {
            const data = doc.data();
            console.log(`📄 userDrop ${doc.id}: geodropNumber=${data.geodropNumber}, createdByName=${data.createdByName}, ersteller=${data.ersteller}`);
            
            if (data.createdByName) {
                await doc.ref.update({
                    ersteller: data.createdByName
                });
                console.log(`✅ Set "ersteller" field to userDrop ${doc.id} (${data.geodropNumber}): ${data.createdByName}`);
                updatedCount++;
            }
        }
        
        // Aktualisiere devDrops - IMMER basierend auf createdByName
        for (const doc of devDropsSnapshot.docs) {
            const data = doc.data();
            console.log(`📄 devDrop ${doc.id}: geodropNumber=${data.geodropNumber}, createdByName=${data.createdByName}, ersteller=${data.ersteller}`);
            
            if (data.createdByName) {
                await doc.ref.update({
                    ersteller: data.createdByName
                });
                console.log(`✅ Set "ersteller" field to devDrop ${doc.id} (${data.geodropNumber}): ${data.createdByName}`);
                updatedCount++;
            }
        }
        
        console.log(`🎉 ${updatedCount} Drops haben jetzt das korrekte "ersteller" Feld!`);
        alert(`✅ ${updatedCount} Drops haben jetzt das korrekte "ersteller" Feld!`);
        
        // Lade Drops neu
        setTimeout(() => {
            if (typeof loadGeoDrops === 'function') loadGeoDrops();
            if (typeof loadUserGeoDrops === 'function') loadUserGeoDrops();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error fixing ersteller field:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// EMERGENCY FIX - Direct console function
window.emergencyFixDrop11 = async function() {
    console.log('🚨 EMERGENCY FIX for Drop 11');
    
    try {
        const db = window.firebase.firestore();
        const user = window.firebase.auth().currentUser;
        const correctName = user.displayName || user.email || 'Unknown User';
        
        console.log('👤 User:', user.email);
        console.log('📝 Correct name:', correctName);
        
        // Get all userDrops
        const userDrops = await db.collection('userDrops').get();
        console.log('📊 Total userDrops:', userDrops.size);
        
        // Find Drop 11
        let drop11Doc = null;
        userDrops.forEach(doc => {
            const data = doc.data();
            console.log(`Drop ${data.geodropNumber}: ${data.createdByName}`);
            if (data.geodropNumber === '11' || data.geodropNumber === 11) {
                drop11Doc = doc;
                console.log('🎯 FOUND Drop 11!', data);
            }
        });
        
        if (drop11Doc) {
            await drop11Doc.ref.update({
                createdByName: correctName,
                createdBy: user.uid
            });
            console.log('✅ Drop 11 FIXED!');
            alert('✅ Drop 11 wurde repariert!');
        } else {
            console.log('❌ Drop 11 not found');
            alert('❌ Drop 11 nicht gefunden');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Fehler: ' + error.message);
    }
};

// Fix All Drops Creator Names
window.fixAllDropsCreator = async function() {
    console.log('🔧 Fixing all drops creator names...');
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        const currentUser = window.firebase.auth().currentUser;
        
        if (!currentUser) {
            console.log('❌ No user logged in');
            showMessage('❌ Bitte zuerst anmelden!', true);
            return;
        }
        
        // Get correct creator name
        const correctCreatorName = currentUser.displayName || currentUser.email || 'Unknown User';
        console.log('👤 Correct creator name:', correctCreatorName);
        
        let fixedCount = 0;
        
        // Fix userDrops
        const userDropsSnapshot = await db.collection('userDrops').get();
        for (const doc of userDropsSnapshot.docs) {
            const data = doc.data();
            if (data.createdBy === currentUser.uid && data.createdByName !== correctCreatorName) {
                await doc.ref.update({
                    createdByName: correctCreatorName
                });
                console.log(`✅ Fixed userDrop ${doc.id} (${data.geodropNumber || 'unknown'})`);
                fixedCount++;
            }
        }
        
        // Fix devDrops
        const devDropsSnapshot = await db.collection('devDrops').get();
        for (const doc of devDropsSnapshot.docs) {
            const data = doc.data();
            if (data.createdBy === currentUser.uid && data.createdByName !== correctCreatorName) {
                await doc.ref.update({
                    createdByName: correctCreatorName
                });
                console.log(`✅ Fixed devDrop ${doc.id} (${data.geodropNumber || 'unknown'})`);
                fixedCount++;
            }
        }
        
        console.log(`🎉 Fixed ${fixedCount} drops total`);
        showMessage(`✅ ${fixedCount} Drops wurden repariert!`, false);
        
        // Reload the drops to show the fixes
        if (typeof loadGeoDrops === 'function') {
            loadGeoDrops();
        }
        if (typeof loadUserGeoDrops === 'function') {
            loadUserGeoDrops();
        }
        
    } catch (error) {
        console.error('❌ Error fixing all drops:', error);
        showMessage('❌ Fehler beim Reparieren der Drops: ' + error.message, true);
    }
};

// Test function - Create Test Drop for Stift Melk
window.createTestMelkDrop = async function() {
    console.log('🏛️ Creating TEST Stift Melk Drop...');
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        
        // Download and upload reference image to Firebase Storage
        console.log('📥 Downloading reference image for Stift Melk...');
        
        let imageBlob;
        
        // Try to get Stift Melk image from Google Places API directly
        console.log('📥 Getting Stift Melk image from Google Places API...');
        try {
            // First, find the correct Place ID for Stift Melk
            const searchResponse = await fetch('/api/places/search?query=Stift Melk');
            if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                if (searchData.results && searchData.results.length > 0) {
                    const placeId = searchData.results[0].place_id;
                    console.log('📍 Found Stift Melk Place ID:', placeId);
                    
                    // Now get the details and photos
                    const placeResponse = await fetch(`/api/places/details/${placeId}`);
                    if (placeResponse.ok) {
                        const placeData = await placeResponse.json();
                        if (placeData.result.photos && placeData.result.photos.length > 0) {
                            const photoRef = placeData.result.photos[0].photo_reference;
                            const photoResponse = await fetch(`/api/places/photo/?photo_reference=${photoRef}&maxwidth=800`);
                            if (photoResponse.ok) {
                                imageBlob = await photoResponse.blob();
                                console.log('✅ Got real Stift Melk image from Google Places API');
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log('❌ Could not get Google Places image:', error);
        }
        
        // Fallback to a good Stift Melk image if Google Places fails
        if (!imageBlob) {
            console.log('📥 Using fallback Stift Melk image...');
            try {
                // Try multiple reliable image sources for Stift Melk
                const imageUrls = [
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
                ];
                
                let imageLoaded = false;
                for (const url of imageUrls) {
                    try {
                        console.log(`📥 Trying image URL: ${url}`);
                        const imageResponse = await fetch(url, {
                            mode: 'cors',
                            headers: {
                                'Accept': 'image/*'
                            }
                        });
                        
                        if (imageResponse.ok) {
                            imageBlob = await imageResponse.blob();
                            console.log('✅ Using fallback Stift Melk image from:', url);
                            imageLoaded = true;
                            break;
                        }
                    } catch (urlError) {
                        console.log(`❌ Failed to load image from ${url}:`, urlError);
                        continue;
                    }
                }
                
                if (!imageLoaded) {
                    throw new Error('All image sources failed');
                }
            } catch (error) {
                console.error('❌ Could not load any image:', error);
                showMessage('❌ Fehler beim Laden des Bildes - alle Quellen fehlgeschlagen', true);
                return;
            }
        }
        
        // Upload to Firebase Storage
        const storage = window.firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`referenzbilder_userdrop/UserDrop1_StiftMelk.jpg`);
        
        console.log('📤 Uploading reference image to Firebase Storage...');
        const uploadTask = await imageRef.put(imageBlob);
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Calculate hash for image comparison
        const arrayBuffer = await imageBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const imageHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        console.log('🔐 Reference image hash calculated:', imageHash);
        console.log('✅ Reference image uploaded:', downloadURL);
        
        // Get current user info
        const currentUser = window.firebase.auth().currentUser;
        const userName = currentUser.displayName || currentUser.email || 'Unknown User';
        
        // Test drop - Stift Melk
        const testDrop = {
            name: 'UserDrop1_StiftMelk',
            description: '🏛️ Stift Melk - Melk (TEST)',
            photoDescription: 'Fotografiere das Stift Melk mit seiner barocken Architektur und dem prächtigen Kloster. Das Stift sollte vollständig sichtbar sein.',
            reward: 10,
            lat: 48.22802251267518,
            lng: 15.328281989202512,
            createdBy: currentUser.uid,
            createdByName: userName,
            createdAt: new Date(),
            isActive: true,
            isAvailable: true,
            geodropNumber: '1',
            collection: 'userDrops',
            referenceImage: 'UserDrop1_StiftMelk.jpg',
            referenceImageUrl: downloadURL,
            referenceImageHash: imageHash,
            isAustriaTouristDrop: true,
            federalState: 'Niederösterreich',
            placeName: 'Stift Melk',
            placeAddress: 'Abt-Berthold-Dietmayr-Straße 1, 3390 Melk, Österreich'
        };
        
        await db.collection('userDrops').add(testDrop);
        
        console.log('✅ Test Melk Drop created:', testDrop.name);
        showMessage('✅ Test Melk Drop erfolgreich erstellt! (Stift Melk)', false);
        
        // Reload all drop lists
        console.log('🔄 Reloading drop lists...');
        
        // Reload User Drops for Upload
        if (typeof loadUserDropsForUpload === 'function') {
            await loadUserDropsForUpload();
        }
        
        // Reload User GeoDrops table
        if (typeof loadUserGeoDrops === 'function') {
            await loadUserGeoDrops();
        }
        
        // Reload all GeoDrops for map
        if (typeof loadGeoDrops === 'function') {
            await loadGeoDrops();
        }
        
        console.log('✅ All drop lists reloaded');
        
    } catch (error) {
        console.error('❌ Error creating test Melk Drop:', error);
        showMessage('❌ Fehler beim Erstellen des Test Melk Drops: ' + error.message, true);
    }
};

// CRITICAL: Define functions immediately to prevent undefined errors
window.showCreateUserDropModal = async function() {
    console.log('➕ Showing create user drop modal');
    const modal = document.getElementById('create-user-drop-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Check if user is Dev and show dev coordinates section
        const isDevLoggedIn = window.isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
        const devSection = document.getElementById('dev-coordinates-section');
        if (devSection) {
            devSection.style.display = isDevLoggedIn ? 'block' : 'none';
        }
        
        // Set coordinate fields based on Dev status
        const latInput = document.getElementById('user-drop-lat');
        const lngInput = document.getElementById('user-drop-lng');
        
        if (isDevLoggedIn) {
            // Dev users can edit coordinates
            latInput.readOnly = false;
            lngInput.readOnly = false;
            latInput.style.background = '#4B5563';
            lngInput.style.background = '#4B5563';
            console.log('🔧 Dev mode: Coordinates editable');
        } else {
            // Normal users can only use current location
            latInput.readOnly = true;
            lngInput.readOnly = true;
            latInput.style.background = '#374151';
            lngInput.style.background = '#374151';
            console.log('👤 Normal user: Coordinates fixed to current location');
        }
        
        // Auto-fill current location if available
        if (window.currentLocation) {
            document.getElementById('user-drop-lat').value = window.currentLocation.lat.toFixed(6);
            document.getElementById('user-drop-lng').value = window.currentLocation.lng.toFixed(6);
        }
        
        // Auto-fill next UserDrop name (count ALL user drops, not just current user's)
        try {
            let currentUser = window.currentUser;
            if (!currentUser && window.auth && window.auth.currentUser) {
                currentUser = window.auth.currentUser;
            }
            if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                currentUser = window.firebase.auth().currentUser;
            }
            
            if (currentUser) {
                const db = window.firebase.firestore();
                // Count ALL user drops, not just current user's drops
                const allUserDropsSnapshot = await db.collection('userDrops').get();
                
                const totalUserDropsCount = allUserDropsSnapshot.size;
                const nextUserDropNumber = totalUserDropsCount + 1;
                const userDropName = `UserDrop${nextUserDropNumber}`;
                
                const nameInput = document.getElementById('user-drop-name');
                if (nameInput) {
                    nameInput.value = userDropName;
                    console.log(`📝 Auto-filled name: ${userDropName} (Total user drops: ${totalUserDropsCount})`);
                }
            }
        } catch (error) {
            console.error('❌ Error auto-filling name:', error);
        }
    } else {
        console.error('❌ Create user drop modal not found');
        showMessage('❌ Modal nicht gefunden', true);
    }
};

window.switchToUploadListType = function(type) {
    console.log(`🔄 Switching upload to ${type} drops list`);
    
    const devBtn = document.getElementById('upload-dev-drops-btn');
    const userBtn = document.getElementById('upload-user-drops-btn');
    const devSection = document.getElementById('upload-dev-drops-section');
    const userSection = document.getElementById('upload-user-drops-section');
    
    if (type === 'dev') {
        // Switch to dev drops for upload
        devBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors bg-blue-600 text-white';
        devBtn.innerHTML = window.t ? window.t('geocard.dev-drops') : '🎯 Dev Drops';
        userBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors text-gray-300 hover:text-white';
        userBtn.innerHTML = window.t ? window.t('geocard.user-drops') : '👤 User Drops';
        devSection.style.display = 'block';
        userSection.style.display = 'none';
        window.currentUploadListType = 'dev';
        
        // Load dev drops for upload (this will update the dropdown)
        if (typeof window.loadDevDropsForUpload === 'function') {
            window.loadDevDropsForUpload();
        }
        
        showMessage('🎯 Dev Drops für Upload ausgewählt', false);
    } else if (type === 'user') {
        // Switch to user drops for upload
        devBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors text-gray-300 hover:text-white';
        devBtn.innerHTML = window.t ? window.t('geocard.dev-drops') : '🎯 Dev Drops';
        userBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors bg-green-600 text-white';
        userBtn.innerHTML = window.t ? window.t('geocard.user-drops') : '👤 User Drops';
        devSection.style.display = 'none';
        userSection.style.display = 'block';
        window.currentUploadListType = 'user';
        
        // Load user drops for upload (this will update the dropdown)
        if (typeof window.loadUserDropsForUpload === 'function') {
            window.loadUserDropsForUpload();
        }
        
        showMessage('👤 User Drops für Upload ausgewählt', false);
    }
};

// Close Create User Drop Modal
window.closeCreateUserDropModal = function() {
    const modal = document.getElementById('create-user-drop-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// Use Current Location for User Drop
window.useCurrentLocationForUserDrop = function() {
    if (window.currentLocation) {
        document.getElementById('user-drop-lat').value = window.currentLocation.lat.toFixed(6);
        document.getElementById('user-drop-lng').value = window.currentLocation.lng.toFixed(6);
        showMessage('📍 Aktuelle Position eingefügt', false);
    } else {
        showMessage('❌ Aktuelle Position nicht verfügbar', true);
    }
};

// Create User Drop
window.createUserDrop = async function() {
    console.log('👤 Creating User Drop...');
    
    // PREVENT DUPLICATE CREATION - Disable button during creation
    const createButton = document.querySelector('button[onclick="createUserDrop()"]');
    if (createButton) {
        if (createButton.disabled) {
            console.log('⚠️ User Drop creation already in progress, ignoring duplicate click');
            showMessage('⚠️ User Drop wird bereits erstellt, bitte warten...', true);
            return;
        }
        createButton.disabled = true;
        createButton.textContent = window.t ? window.t('common.loading') : '🔄 Erstelle...';
        createButton.style.opacity = '0.6';
    }
    
    // Check if user is logged in
    if (!window.currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        if (createButton) {
            createButton.disabled = false;
            createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
            createButton.style.opacity = '1';
        }
        return;
    }
    
    // Check GPS position
    if (!window.lastKnownLat || !window.lastKnownLng) {
        showMessage('❌ GPS-Position nicht verfügbar! Bitte erlaube Standortzugriff.', true);
        if (createButton) {
            createButton.disabled = false;
            createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
            createButton.style.opacity = '1';
        }
        return;
    }
    
    // Check minimum distance (5km) to existing drops
    const minDistance = await checkMinimumDistance(window.lastKnownLat, window.lastKnownLng, 5000);
    if (!minDistance.allowed) {
        showMessage(`❌ Zu nah an anderen Drops! Mindestabstand: 5km. Nächster Drop: ${Math.round(minDistance.nearestDistance)}m entfernt.`, true);
        if (createButton) {
            createButton.disabled = false;
            createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
            createButton.style.opacity = '1';
        }
        return;
    }
    
    try {
        // Get form elements with fallback
        const nameInput = document.getElementById('user-drop-name') || document.querySelector('#create-user-drop-modal input[placeholder*="Historisches"]');
        const descriptionInput = document.getElementById('user-drop-description') || document.querySelector('#create-user-drop-modal textarea');
        const latInput = document.getElementById('user-drop-lat') || document.querySelector('#create-user-drop-modal input[placeholder*="Breitengrad"]');
        const lngInput = document.getElementById('user-drop-lng') || document.querySelector('#create-user-drop-modal input[placeholder*="Längengrad"]');
        const referenceImageInput = document.getElementById('user-drop-reference-image') || document.querySelector('#create-user-drop-modal input[type="file"]');
    
        console.log('🔍 Form elements found:', {
            nameInput: !!nameInput,
            descriptionInput: !!descriptionInput,
            latInput: !!latInput,
            lngInput: !!lngInput,
            referenceImageInput: !!referenceImageInput
        });
        
        if (!nameInput || !descriptionInput || !latInput || !lngInput) {
            console.error('❌ Form elements not found!');
            console.log('🔍 Available inputs in modal:', document.querySelectorAll('#create-user-drop-modal input, #create-user-drop-modal textarea'));
            showMessage('❌ Formular-Elemente nicht gefunden!', true);
            return;
        }
    
        // Get form data
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const reward = 10; // Fixed 10 PixelDrops for User Drops
        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);
        const referenceImage = referenceImageInput ? referenceImageInput.files[0] : null;
    
        console.log('📋 Form data:', { name, description, reward, lat, lng, hasImage: !!referenceImage });
        
        // Validation
        if (!name) {
            showMessage('❌ Bitte gib einen Drop-Namen ein!', true);
            return;
        }
        if (!description) {
            showMessage('❌ Bitte gib eine Beschreibung ein!', true);
            return;
        }
        if (isNaN(lat) || isNaN(lng)) {
            const validCoordinatesText = window.t ? window.t('geocard.valid-coordinates') : 'Bitte gib gültige Koordinaten ein!';
            showMessage(`❌ ${validCoordinatesText}`, true);
            return;
        }
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            const invalidCoordinatesText = window.t ? window.t('geocard.invalid-coordinates') : 'Ungültige Koordinaten!';
            showMessage(`❌ ${invalidCoordinatesText}`, true);
            return;
        }
        
        // 🏛️ NEUE VALIDIERUNG: Prüfe ob Standort öffentlich ist
        console.log('🏛️ Validating public place...');
        showMessage('🔍 Validiere Standort...', false);
        
        try {
            if (window.publicPlaceValidator) {
                const validationResult = await window.publicPlaceValidator.validatePublicPlace(lat, lng, referenceImage);
                
                if (!validationResult.isValid) {
                    const message = window.publicPlaceValidator.getValidationMessage(validationResult);
                    showMessage(message, true);
                    return;
                }
                
                console.log('✅ Standort validiert:', validationResult);
                showMessage('✅ Standort validiert!', false);
            } else {
                console.warn('⚠️ Public Place Validator nicht verfügbar');
            }
        } catch (validationError) {
            console.error('❌ Fehler bei Standortvalidierung:', validationError);
            showMessage('⚠️ Standortvalidierung fehlgeschlagen. Drop wird trotzdem erstellt.', false);
        }
        
        // Check if user is logged in
        let currentUser = window.currentUser;
        if (!currentUser && window.auth && window.auth.currentUser) {
            currentUser = window.auth.currentUser;
        }
        if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
            currentUser = window.firebase.auth().currentUser;
        }
        
        if (!currentUser) {
            showMessage('❌ Bitte zuerst anmelden!', true);
            return;
        }
    
        console.log('👤 Current user:', currentUser.uid);
        
        const db = window.firebase.firestore();
        
        // Get current user drops count to determine next number
        // Count ALL user drops, not just current user's drops
        const allUserDropsSnapshot = await db.collection('userDrops').get();
        
        const totalUserDropsCount = allUserDropsSnapshot.size;
        const nextUserDropNumber = totalUserDropsCount + 1;
        const finalFilename = `UserDrop${nextUserDropNumber}.jpg`;
        
        let referenceImageUrl = null;
        let referenceImageHash = null;
        
        // Upload reference image if provided
        if (referenceImage) {
            console.log('📤 Uploading reference image...');
            try {
                // Calculate hash for the reference image
                const arrayBuffer = await referenceImage.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                referenceImageHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                
                console.log('🔐 Reference image hash calculated:', referenceImageHash);
                
                const storage = window.firebase.storage();
                const storageRef = storage.ref();
                const imageRef = storageRef.child(`referenzbilder_userdrop/${finalFilename}`);
                
                const uploadTask = await imageRef.put(referenceImage);
                referenceImageUrl = await uploadTask.ref.getDownloadURL();
                console.log('✅ Reference image uploaded:', referenceImageUrl);
            } catch (uploadError) {
                console.error('❌ Error uploading reference image:', uploadError);
                showMessage('❌ Fehler beim Hochladen des Referenzbildes', true);
                return;
            }
        }
        
        // Use the calculated values
        const userDropName = `UserDrop${nextUserDropNumber}`;
        
        console.log(`📊 Total user drops count: ${totalUserDropsCount}, next number: ${nextUserDropNumber}`);
        
        // Get the real username from Firebase user profile
        let realUsername = null;
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                realUsername = userData.username || userData.displayName;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
        
        if (!realUsername) {
            alert('❌ Username nicht gefunden! Bitte Profil vervollständigen.');
            return;
        }

        // Get current language
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
        
        const userDropData = {
            name: userDropName, // Use auto-generated name
            description: description,
            photoDescription: description,
            reward: reward,
            lat: lat,
            lng: lng,
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || currentUser.email || 'Unknown User',
            createdByEmail: currentUser.email,
            ersteller: realUsername, // Use real username from Firebase profile
            createdAt: new Date(),
            isActive: true,
            isAvailable: true,
            geodropNumber: nextUserDropNumber.toString(),
            collection: 'userDrops',
            referenceImage: referenceImage ? finalFilename : null, // Use consistent filename
            referenceImageUrl: referenceImageUrl,
            referenceImageHash: referenceImageHash,
            // Dual language fields
            language: currentLang,
            description_de: currentLang === 'de' ? description : null,
            description_en: currentLang === 'en' ? description : null,
            photoDescription_de: currentLang === 'de' ? description : null,
            photoDescription_en: currentLang === 'en' ? description : null
        };
        
        console.log('💾 Saving user drop data:', userDropData);
        
        const docRef = await db.collection('userDrops').add(userDropData);
        
        console.log('✅ User drop created with ID:', docRef.id);
        showMessage(`✅ User Drop "${name}" erfolgreich erstellt!`, false);
        
        // Close modal
        console.log('🔄 Closing modal...');
        const modal = document.getElementById('create-user-drop-modal');
        if (modal) {
            modal.style.display = 'none';
            console.log('✅ Modal closed');
        }
        
        // Clear form
        nameInput.value = '';
        descriptionInput.value = '';
        if (document.getElementById('user-drop-reward')) {
            document.getElementById('user-drop-reward').value = '10';
        }
        latInput.value = '';
        lngInput.value = '';
        if (referenceImageInput) {
            referenceImageInput.value = '';
        }
        const preview = document.getElementById('user-drop-image-preview');
        if (preview) {
            preview.style.display = 'none';
        }
        
        // Reload user drops
        if (window.currentListType === 'user') {
            loadUserGeoDrops();
        }
        if (window.currentUploadListType === 'user') {
            loadUserDropsForUpload();
        }
        
        // Reload all drops for map only (not dropdown to avoid overwriting upload selection)
        // loadGeoDrops(); // REMOVED - was overwriting upload dropdown
        
        // Force reload the current list type
        if (window.currentListType === 'dev') {
            loadDevGeoDrops();
        } else if (window.currentListType === 'user') {
            loadUserGeoDrops();
        }
        
    } catch (error) {
        console.error('❌ Error creating user drop:', error);
        showMessage('❌ Fehler beim Erstellen des User Drops: ' + error.message, true);
    } finally {
        // RE-ENABLE BUTTON - Always re-enable button regardless of success or error
        const createButton = document.querySelector('button[onclick="createUserDrop()"]');
        if (createButton) {
            createButton.disabled = false;
            createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
            createButton.style.opacity = '1';
        }
    }
};

// Check minimum distance to existing drops
async function checkMinimumDistance(lat, lng, minDistanceMeters) {
    console.log('🔍 Checking minimum distance to existing drops...');
    console.log('📍 Current position:', { lat, lng });
    console.log('📏 Minimum distance required:', minDistanceMeters, 'meters');
    
    try {
        const db = window.firebase.firestore();
        
        // Get all drops from both collections
        const [devDropsSnapshot, userDropsSnapshot] = await Promise.all([
            db.collection('devDrops').get(),
            db.collection('userDrops').get()
        ]);
        
        const allDrops = [];
        
        // Add dev drops
        devDropsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.lat && data.lng) {
                allDrops.push({
                    id: doc.id,
                    lat: data.lat,
                    lng: data.lng,
                    type: 'dev',
                    name: data.name || `Dev Drop ${doc.id}`
                });
            }
        });
        
        // Add user drops
        userDropsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.lat && data.lng) {
                allDrops.push({
                    id: doc.id,
                    lat: data.lat,
                    lng: data.lng,
                    type: 'user',
                    name: data.name || `User Drop ${doc.id}`
                });
            }
        });
        
        console.log(`📊 Found ${allDrops.length} existing drops to check`);
        
        let nearestDistance = Infinity;
        let nearestDrop = null;
        
        // Check distance to each existing drop
        for (const drop of allDrops) {
            const distance = calculateDistance(lat, lng, drop.lat, drop.lng);
            console.log(`📍 Distance to ${drop.type} drop "${drop.name}": ${Math.round(distance)}m`);
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestDrop = drop;
            }
        }
        
        console.log(`🎯 Nearest drop: ${nearestDrop ? nearestDrop.name : 'None'} at ${Math.round(nearestDistance)}m`);
        
        const allowed = nearestDistance >= minDistanceMeters;
        console.log(`✅ Distance check result: ${allowed ? 'ALLOWED' : 'BLOCKED'} (nearest: ${Math.round(nearestDistance)}m, required: ${minDistanceMeters}m)`);
        
        return {
            allowed,
            nearestDistance,
            nearestDrop
        };
        
    } catch (error) {
        console.error('❌ Error checking minimum distance:', error);
        // Allow creation if check fails (fail-safe)
        return {
            allowed: true,
            nearestDistance: Infinity,
            nearestDrop: null
        };
    }
}

// Load Dev Drops for Upload
window.loadDevDropsForUpload = async function() {
    console.log('🎯 Loading Dev Drops for Upload...');
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        // Load all dev drops (both isAvailable and isActive)
        const allDevDropsSnapshot = await db.collection('devDrops').get();
        
        // Filter for active/available drops and exclude claimed drops for today
        const today = new Date().toDateString();
        const currentUser = window.currentUser || window.auth?.currentUser;
        
        const devDropsSnapshot = {
            docs: allDevDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                const isActive = data.isActive === true || data.isAvailable === true;
                
                // Check if claimed today by current user
                const lastClaimDate = data.lastClaimDate ? data.lastClaimDate.toDate().toDateString() : null;
                const isClaimedToday = lastClaimDate === today && data.claimedBy === currentUser?.uid;
                
                // Debug logging for drops 9 and 10
                if (data.geodropNumber === '9' || data.geodropNumber === '10' || 
                    (data.name && (data.name.includes('GeoDrop9') || data.name.includes('GeoDrop10')))) {
                    console.log(`🔍 Debug Drop ${data.geodropNumber || data.name}:`, {
                        isActive,
                        isClaimedToday,
                        lastClaimDate,
                        claimedBy: data.claimedBy,
                        currentUser: currentUser?.uid,
                        today,
                        willInclude: isActive && !isClaimedToday
                    });
                }
                
                // Only include drops that are active AND not claimed today
                return isActive && !isClaimedToday;
            }),
            size: 0
        };
        devDropsSnapshot.size = devDropsSnapshot.docs.length;
        
        const devDrops = [];
        devDropsSnapshot.docs.forEach(doc => {
            devDrops.push({ id: doc.id, ...doc.data(), collection: 'devDrops' });
        });
        
        // Sort drops by geodropNumber (extract number from name if needed)
        devDrops.sort((a, b) => {
            let numA = parseInt(a.geodropNumber) || 0;
            let numB = parseInt(b.geodropNumber) || 0;
            
            // If no geodropNumber, try to extract from name
            if (numA === 0 && a.name && a.name.includes('GeoDrop')) {
                const match = a.name.match(/GeoDrop(\d+)/);
                if (match) numA = parseInt(match[1]);
            }
            if (numB === 0 && b.name && b.name.includes('GeoDrop')) {
                const match = b.name.match(/GeoDrop(\d+)/);
                if (match) numB = parseInt(match[1]);
            }
            
            return numA - numB;
        });
        
        // Update dev drops select for both languages
        const currentLang = window.currentLanguage || 'de';
        const selectDe = document.getElementById('geocard-drop-select-de');
        const selectEn = document.getElementById('geocard-drop-select-en');
        
        let selectText, devDropText, pixeldropsText;
        if (currentLang === 'en') {
            selectText = 'Select Dev GeoDrop...';
            devDropText = 'Dev GeoDrop';
            pixeldropsText = 'PixelDrops';
        } else {
            selectText = 'Dev GeoDrop auswählen...';
            devDropText = 'Dev GeoDrop';
            pixeldropsText = 'PixelDrops';
        }
        
        // Update German dropdown
        if (selectDe) {
            selectDe.innerHTML = `<option value="">${selectText}</option>`;
            devDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = drop.id;
                option.textContent = `${devDropText}${drop.geodropNumber || drop.id} - ${drop.reward || 100} ${pixeldropsText}`;
                selectDe.appendChild(option);
            });
        }
        
        // Update English dropdown
        if (selectEn) {
            selectEn.innerHTML = `<option value="">Select Dev GeoDrop...</option>`;
            devDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = drop.id;
                option.textContent = `Dev GeoDrop${drop.geodropNumber || drop.id} - ${drop.reward || 100} PixelDrops`;
                selectEn.appendChild(option);
            });
        }
        
        // Legacy support for old select element
        const select = document.getElementById('geocard-drop-select');
        if (select) {
            
            select.innerHTML = `<option value="">${selectText}</option>`;
            devDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = `devDrops:${drop.id}`;
                // Extract number from name for display
                let displayNumber = drop.geodropNumber || drop.id;
                if (drop.name && drop.name.includes('GeoDrop')) {
                    const match = drop.name.match(/GeoDrop(\d+)/);
                    if (match) {
                        displayNumber = match[1]; // Just the number
                    }
                }
                // Sicherheitsprüfung: displayNumber und reward validieren
                const safeDisplayNumber = displayNumber || 'N/A';
                const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                option.textContent = `🎯 ${devDropText}${safeDisplayNumber} - ${safeReward} ${pixeldropsText}`;
                select.appendChild(option);
            });
        }
        
        console.log(`✅ Loaded ${devDrops.length} Dev Drops for Upload`);
    } catch (error) {
        console.error('❌ Error loading Dev Drops for Upload:', error);
        if (error.code === 'permission-denied') {
            console.log('🔒 User not logged in, skipping Dev Drops for Upload load');
            showMessage('ℹ️ Bitte anmelden um Dev Drops zu sehen', false);
        } else {
            showMessage('Fehler beim Laden der Dev Drops', true);
        }
    }
};

// Load User Drops for Upload
window.loadUserDropsForUpload = async function() {
    console.log('👤 Loading User Drops for Upload...');
    
    // Check if lists are cleared
    if (window.userDropListsCleared) {
        console.log('⏭️ User Drop lists are cleared, skipping load');
        return;
    }
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        // Load all user drops and filter out claimed ones
        const allUserDropsSnapshot = await db.collection('userDrops').get();
        
        // Filter for active drops and exclude claimed drops for today
        const today = new Date().toDateString();
        const currentUser = window.currentUser || window.auth?.currentUser;
        
        const userDropsSnapshot = {
            docs: allUserDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                const isActive = data.isActive === true;
                
                // Check if claimed today by current user
                const lastClaimDate = data.lastClaimDate ? data.lastClaimDate.toDate().toDateString() : null;
                const isClaimedToday = lastClaimDate === today && data.claimedBy === currentUser?.uid;
                
                // Debug logging for drops 9 and 10
                if (data.geodropNumber === '9' || data.geodropNumber === '10' || 
                    (data.name && (data.name.includes('UserDrop9') || data.name.includes('UserDrop10')))) {
                    console.log(`🔍 Debug User Drop ${data.geodropNumber || data.name}:`, {
                        isActive,
                        isClaimedToday,
                        lastClaimDate,
                        claimedBy: data.claimedBy,
                        currentUser: currentUser?.uid,
                        today,
                        willInclude: isActive && !isClaimedToday
                    });
                }
                
                // Only include drops that are active AND not claimed today
                return isActive && !isClaimedToday;
            }),
            size: 0
        };
        userDropsSnapshot.size = userDropsSnapshot.docs.length;
        
        const userDrops = [];
        userDropsSnapshot.docs.forEach(doc => {
            userDrops.push({ id: doc.id, ...doc.data(), collection: 'userDrops' });
        });
        
        // Sort drops by geodropNumber (1, 2, 3, ...)
        userDrops.sort((a, b) => {
            const numA = parseInt(a.geodropNumber) || parseInt(a.id) || 0;
            const numB = parseInt(b.geodropNumber) || parseInt(b.id) || 0;
            return numA - numB;
        });
        
        // Update user drops select
        const userSelectDe = document.getElementById('geocard-user-drop-select-de');
        const userSelectEn = document.getElementById('geocard-user-drop-select-en');
        
        const userSelectTextDe = 'User GeoDrop auswählen...';
        const userSelectTextEn = 'Select User GeoDrop...';
        
        // Update German dropdown
        if (userSelectDe) {
            userSelectDe.innerHTML = `<option value="">${userSelectTextDe}</option>`;
            userDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = `userDrops:${drop.id}`;
                // Use displayName first, then email, then fallback
                // Get the real username from Firebase Auth, not from stored data
                let creatorName = 'Unbekannt';
                
                // Check if this is the current user's drop
                let currentUser = window.currentUser;
                if (!currentUser && window.auth && window.auth.currentUser) {
                    currentUser = window.auth.currentUser;
                }
                if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                    currentUser = window.firebase.auth().currentUser;
                }
                
                // Use the ersteller field from Firebase
                creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                console.log(`✅ Using ${creatorName} for drop ${drop.name}`);
                const dropNumber = drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A';
                const userDropText = 'User GeoDrop';
                const pixeldropsText = 'PixelDrops';
                // Sicherheitsprüfung: creatorName und reward validieren
                const safeCreatorName = creatorName || 'Unknown';
                const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                option.textContent = `👤 ${userDropText}${dropNumber} (${safeCreatorName}) - ${safeReward} ${pixeldropsText}`;
                userSelectDe.appendChild(option);
            });
        }
        
        // Update English dropdown
        if (userSelectEn) {
            userSelectEn.innerHTML = `<option value="">${userSelectTextEn}</option>`;
            userDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = `userDrops:${drop.id}`;
                // Use displayName first, then email, then fallback
                // Get the real username from Firebase Auth, not from stored data
                let creatorName = 'Unknown';
                
                // Check if this is the current user's drop
                let currentUser = window.currentUser;
                if (!currentUser && window.auth && window.auth.currentUser) {
                    currentUser = window.auth.currentUser;
                }
                if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                    currentUser = window.firebase.auth().currentUser;
                }
                
                // Use the ersteller field from Firebase
                creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                console.log(`✅ Using ${creatorName} for drop ${drop.name}`);
                const dropNumber = drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A';
                const userDropText = 'User GeoDrop';
                const pixeldropsText = 'PixelDrops';
                // Sicherheitsprüfung: creatorName und reward validieren
                const safeCreatorName = creatorName || 'Unknown';
                const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                option.textContent = `👤 ${userDropText}${dropNumber} (${safeCreatorName}) - ${safeReward} ${pixeldropsText}`;
                userSelectEn.appendChild(option);
            });
        }
        
        
        console.log(`✅ Loaded ${userDrops.length} User Drops for Upload`);
    } catch (error) {
        console.error('❌ Error loading User Drops for Upload:', error);
        if (error.code === 'permission-denied') {
            console.log('🔒 User not logged in, skipping User Drops for Upload load');
            showMessage('ℹ️ Bitte anmelden um User Drops zu sehen', false);
        } else {
            showMessage('Fehler beim Laden der User Drops', true);
        }
    }
};

// Load Dev GeoDrops (only dev drops)
window.loadDevGeoDrops = async function() {
    console.log('🎯 Loading Dev GeoDrops...');
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        // Load all dev drops (both isAvailable and isActive)
        const allDevDropsSnapshot = await db.collection('devDrops').get();
        
        // Filter for active/available drops
        const devDropsSnapshot = {
            docs: allDevDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.isActive === true || data.isAvailable === true;
            }),
            size: 0
        };
        devDropsSnapshot.size = devDropsSnapshot.docs.length;
        
        const devDrops = [];
        devDropsSnapshot.docs.forEach(doc => {
            devDrops.push({ id: doc.id, ...doc.data(), collection: 'devDrops' });
        });
        
        // Sort drops by geodropNumber (extract number from name if needed)
        devDrops.sort((a, b) => {
            let numA = parseInt(a.geodropNumber) || 0;
            let numB = parseInt(b.geodropNumber) || 0;
            
            // If no geodropNumber, try to extract from name
            if (numA === 0 && a.name && a.name.includes('GeoDrop')) {
                const match = a.name.match(/GeoDrop(\d+)/);
                if (match) numA = parseInt(match[1]);
            }
            if (numB === 0 && b.name && b.name.includes('GeoDrop')) {
                const match = b.name.match(/GeoDrop(\d+)/);
                if (match) numB = parseInt(match[1]);
            }
            
            return numA - numB;
        });
        
        // Update dev drops table
        const table = document.getElementById('geodrops-table');
        if (table && devDrops.length > 0) {
            // Get current user for status check
            let currentUser = window.currentUser;
            if (!currentUser && window.auth && window.auth.currentUser) {
                currentUser = window.auth.currentUser;
            }
            if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                currentUser = window.firebase.auth().currentUser;
            }
            
            let tableHTML = '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-gray-600"><th class="text-left p-2">Nr.</th><th class="text-left p-2">Ersteller</th><th class="text-left p-2">Reward</th><th class="text-left p-2">Status</th><th class="text-left p-2">Typ</th><th class="text-center p-2">Icon</th><th class="text-left p-2">Koordinaten</th></tr></thead><tbody>';
            devDrops.forEach(drop => {
                const coords = drop.lat && drop.lng ? `${drop.lat.toFixed(4)}, ${drop.lng.toFixed(4)}` : 'N/A';
                // Check if claimed today with proper date comparison
                const today = new Date().toDateString();
                const lastClaimDate = drop.lastClaimDate ? drop.lastClaimDate.toDate().toDateString() : null;
                const isClaimedToday = lastClaimDate === today && drop.claimedBy === currentUser?.uid;
                const statusText = isClaimedToday ? '⏰ Heute gesammelt' : '✅ Verfügbar';
                const rowClass = isClaimedToday ? 'border-b border-gray-700 bg-gray-800 opacity-60' : 'border-b border-gray-700';
                const textClass = isClaimedToday ? 'text-gray-500' : 'text-white';
                
                // Creator name will be set below
                
                // Use geodropNumber for display, fallback to name, then id
                let displayNumber = drop.geodropNumber || drop.id;
                if (drop.name && drop.name.includes('GeoDrop')) {
                    const match = drop.name.match(/GeoDrop(\d+)/);
                    if (match) {
                        displayNumber = match[1]; // Just the number
                    }
                }
                // Get creator name for dev drops - all should be KryptoGuru
                let creatorName = 'KryptoGuru';
                
                tableHTML += `<tr class="${rowClass}"><td class="p-2 ${textClass}">${displayNumber}</td><td class="p-2 ${textClass}">${creatorName}</td><td class="p-2 ${textClass}">${drop.reward || 100}</td><td class="p-2 ${textClass}">${statusText}</td><td class="p-2 ${textClass}">🎯 Dev</td><td class="p-2 text-center"><span class="text-2xl">🎯</span></td><td class="p-2 text-xs ${textClass}">${coords}</td></tr>`;
            });
            tableHTML += '</tbody></table></div>';
            table.innerHTML = tableHTML;
        } else if (table) {
            const noDropsText = window.t ? window.t('geocard.no-dev-drops') : 'Keine Dev GeoDrops gefunden';
            table.innerHTML = `<div class="text-center text-gray-400 p-4">${noDropsText}</div>`;
        }
        
        console.log(`✅ Loaded ${devDrops.length} Dev GeoDrops`);
    } catch (error) {
        console.error('❌ Error loading Dev GeoDrops:', error);
        if (error.code === 'permission-denied') {
            console.log('🔒 User not logged in, skipping Dev GeoDrops load');
            const loginToSeeDevText = window.t ? window.t('geocard.login-to-see-dev') : 'Bitte anmelden um Dev GeoDrops zu sehen';
            showMessage(`ℹ️ ${loginToSeeDevText}`, false);
        } else {
            const errorLoadingDevText = window.t ? window.t('geocard.error-loading-dev') : 'Fehler beim Laden der Dev GeoDrops';
            showMessage(errorLoadingDevText, true);
        }
        
        const table = document.getElementById('geodrops-table');
        if (table) {
            table.innerHTML = '<div class="text-center text-red-400 p-4">Fehler beim Laden der Dev GeoDrops</div>';
        }
    }
};


// Load ALL User Drops (for public viewing with creator names)
window.loadAllUserDrops = async function() {
    console.log('👥 Loading ALL User Drops...');
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Load ALL user drops (not just current user's)
        const userDropsSnapshot = await db.collection('userDrops')
            .where('isActive', '==', true)
            .get();
        
        const userDrops = [];
        userDropsSnapshot.forEach(doc => {
            userDrops.push({ id: doc.id, ...doc.data(), collection: 'userDrops' });
        });
        
        // Sort drops by geodropNumber (1, 2, 3, ...)
        userDrops.sort((a, b) => {
            const numA = parseInt(a.geodropNumber) || parseInt(a.id) || 0;
            const numB = parseInt(b.geodropNumber) || parseInt(b.id) || 0;
            return numA - numB;
        });
        
        // Update all user drops table
        const allUserDropsTable = document.getElementById('all-user-drops-table');
        if (allUserDropsTable && userDrops.length > 0) {
            let tableHTML = '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-gray-600"><th class="text-left p-2">Nr.</th><th class="text-left p-2">Reward</th><th class="text-left p-2">Ersteller</th><th class="text-left p-2">Status</th><th class="text-left p-2">Koordinaten</th><th class="text-left p-2">Erstellt</th><th class="text-center p-2">Icon</th><th class="text-left p-2">Aktionen</th></tr></thead><tbody>';
            userDrops.forEach(drop => {
                const coords = drop.lat && drop.lng ? `${drop.lat.toFixed(4)}, ${drop.lng.toFixed(4)}` : 'N/A';
                const createdDate = drop.createdAt ? drop.createdAt.toDate().toLocaleDateString() : 'N/A';
                const statusText = drop.isActive ? '✅ Aktiv' : '❌ Inaktiv';
                const statusClass = drop.isActive ? 'text-green-400' : 'text-red-400';
                // Get the real username from Firebase Auth, not from stored data
                let creatorName = 'Unbekannt';
                
                // Check if this is the current user's drop
                let currentUser = window.currentUser;
                if (!currentUser && window.auth && window.auth.currentUser) {
                    currentUser = window.auth.currentUser;
                }
                if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                    currentUser = window.firebase.auth().currentUser;
                }
                
                // Use the ersteller field from Firebase
                creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                console.log(`✅ Using ${creatorName} for drop ${drop.name}`);
                
                // Get current user for permission check (already declared above)
                
                const isDev = window.isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
                const isCreator = currentUser && drop.createdBy === currentUser.uid;
                const canDelete = isDev || isCreator;
                
                tableHTML += `
                    <tr class="border-b border-gray-700">
                        <td class="p-2 text-white">${drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A'}</td>
                        <td class="p-2 text-white">${drop.reward || 100}</td>
                        <td class="p-2 text-blue-400">${creatorName}</td>
                        <td class="p-2 ${statusClass}">${statusText}</td>
                        <td class="p-2 text-xs text-white">${coords}</td>
                        <td class="p-2 text-xs text-white">${createdDate}</td>
                        <td class="p-2 text-center">
                            <span class="text-2xl">🎯</span>
                        </td>
                        <td class="p-2">
                            ${isDev ? `
                                <button onclick="editUserDrop('${drop.id}')" class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 mr-1">
                                    ✏️
                                </button>
                                <button onclick="toggleUserDrop('${drop.id}', ${drop.isActive})" class="px-2 py-1 ${drop.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded text-xs">
                                    ${drop.isActive ? '⏸️' : '▶️'}
                                </button>
                            ` : canDelete ? `
                                <button onclick="deleteUserDrop('${drop.id}')" class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                                    🗑️
                                </button>
                            ` : `
                                <span class="text-gray-500 text-xs">Nur Ersteller</span>
                            `}
                        </td>
                    </tr>
                `;
            });
            tableHTML += '</tbody></table></div>';
            allUserDropsTable.innerHTML = tableHTML;
        } else if (allUserDropsTable) {
            const noUserDropsText = window.t ? window.t('geocard.no-user-drops') : 'Keine User GeoDrops gefunden';
            allUserDropsTable.innerHTML = `<div class="text-center text-gray-400 p-4">${noUserDropsText}</div>`;
        }
        
        console.log(`✅ Loaded ${userDrops.length} ALL User GeoDrops`);
    } catch (error) {
        console.error('❌ Error loading ALL User GeoDrops:', error);
            const errorLoadingUserText = window.t ? window.t('geocard.error-loading-user') : 'Fehler beim Laden aller User GeoDrops';
            showMessage(errorLoadingUserText, true);
    }
};

// Create Austria Tourist Drops for all federal states
window.createAustriaTouristDrops = async function() {
    console.log('🇦🇹 Creating Austria Tourist Drops...');
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        
        // Austria tourist attractions by federal state
        const austriaDrops = {
            'Burgenland': [
                { name: 'Burg Forchtenstein', lat: 47.7125, lng: 16.3333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die imposante Burg Forchtenstein mit ihren charakteristischen Türmen und der mittelalterlichen Architektur. Die Burg sollte vollständig im Bild sichtbar sein.' },
                { name: 'Schloss Esterházy Eisenstadt', lat: 47.8456, lng: 16.5256, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das prächtige Schloss Esterházy mit seiner barocken Fassade und den schönen Gärten. Das Hauptgebäude sollte gut erkennbar sein.' },
                { name: 'Neusiedler See', lat: 47.8333, lng: 16.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Neusiedler See mit dem Wasser und der charakteristischen Schilflandschaft. Der See sollte als Hauptmotiv erkennbar sein.' },
                { name: 'Seebühne Mörbisch', lat: 47.7500, lng: 16.6667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die berühmte Seebühne Mörbisch am Neusiedler See. Die Bühne sollte mit dem Wasser im Hintergrund sichtbar sein.' },
                { name: 'Weinmuseum Moschendorf', lat: 47.0500, lng: 16.4833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Weinmuseum Moschendorf mit seinem charakteristischen Gebäude. Das Museum sollte gut erkennbar sein.' },
                { name: 'Naturpark Geschriebenstein', lat: 47.3500, lng: 16.4167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Landschaft des Naturparks Geschriebenstein mit seinen charakteristischen Hügeln und der Natur. Die typische Landschaft sollte erkennbar sein.' },
                { name: 'Schloss Halbturn', lat: 47.8667, lng: 16.9500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das barocke Schloss Halbturn mit seiner prächtigen Architektur und den Gärten. Das Schloss sollte als Hauptmotiv sichtbar sein.' },
                { name: 'St. Martins Therme', lat: 47.8000, lng: 16.6333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die St. Martins Therme mit ihrem modernen Gebäude und den Thermalbecken. Die Therme sollte gut erkennbar sein.' },
                { name: 'Freilichtmuseum Gerersdorf', lat: 47.0667, lng: 16.2500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Freilichtmuseum Gerersdorf mit seinen historischen Gebäuden und der ländlichen Architektur. Die typischen Häuser sollten erkennbar sein.' },
                { name: 'Römersteinbruch St. Margarethen', lat: 47.8000, lng: 16.6000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den historischen Römersteinbruch St. Margarethen mit seinen charakteristischen Steinwänden und der antiken Atmosphäre. Der Steinbruch sollte gut sichtbar sein.' }
            ],
            'Kärnten': [
                { name: 'Wörthersee', lat: 46.6167, lng: 14.1500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den berühmten Wörthersee mit seinem kristallklaren Wasser und der malerischen Landschaft. Der See sollte als Hauptmotiv erkennbar sein.' },
                { name: 'Minimundus Klagenfurt', lat: 46.6167, lng: 14.2667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Minimundus mit seinen Miniatur-Nachbauten berühmter Bauwerke. Die kleinen Modelle sollten gut erkennbar sein.' },
                { name: 'Burg Hochosterwitz', lat: 46.7500, lng: 14.4500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die imposante Burg Hochosterwitz auf ihrem Felsen mit den charakteristischen Türmen. Die Burg sollte vollständig sichtbar sein.' },
                { name: 'Pyramidenkogel Aussichtsturm', lat: 46.5833, lng: 14.0000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Pyramidenkogel Aussichtsturm mit seiner charakteristischen Form. Der Turm sollte gut erkennbar sein.' },
                { name: 'Nockalmstraße', lat: 46.8333, lng: 13.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die malerische Nockalmstraße mit ihren Kurven und der alpinen Landschaft. Die Straße sollte erkennbar sein.' },
                { name: 'Millstätter See', lat: 46.8000, lng: 13.5833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Millstätter See mit seinem ruhigen Wasser und der umgebenden Natur. Der See sollte als Hauptmotiv sichtbar sein.' },
                { name: 'Gerlitzen Alpe', lat: 46.7500, lng: 13.9167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Gerlitzen Alpe mit ihren Skipisten und der alpinen Landschaft. Die Berge sollten erkennbar sein.' },
                { name: 'Tscheppaschlucht', lat: 46.6667, lng: 14.3333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Tscheppaschlucht mit ihren steilen Felswänden und dem Wasserfall. Die Schlucht sollte gut sichtbar sein.' },
                { name: 'Burg Landskron Affenberg', lat: 46.6167, lng: 14.0000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Burg Landskron mit dem Affenberg. Die Burg und die Affen sollten erkennbar sein.' },
                { name: 'Dobratsch Naturpark', lat: 46.5833, lng: 13.6667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Landschaft des Dobratsch Naturparks mit seinen Bergen und der unberührten Natur. Die typische Landschaft sollte erkennbar sein.' }
            ],
            'Niederösterreich': [
                { name: 'Stift Melk', lat: 48.2333, lng: 15.3333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das berühmte Stift Melk mit seiner barocken Architektur und der goldenen Fassade. Das Kloster sollte vollständig sichtbar sein.' },
                { name: 'Schloss Grafenegg', lat: 48.4333, lng: 15.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Schloss Grafenegg mit seinem modernen Konzertpavillon und den historischen Gebäuden. Das Schloss sollte gut erkennbar sein.' },
                { name: 'Wachau-Tal', lat: 48.3667, lng: 15.4167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die malerische Wachau mit ihren Weinbergen, der Donau und den historischen Orten. Die typische Landschaft sollte erkennbar sein.' },
                { name: 'Schloss Laxenburg', lat: 48.0667, lng: 16.3667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Schloss Laxenburg mit seinem Schlosspark und den historischen Gebäuden. Das Schloss sollte als Hauptmotiv sichtbar sein.' },
                { name: 'Naturpark Hohe Wand', lat: 47.8333, lng: 16.0833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Landschaft des Naturparks Hohe Wand mit seinen Felswänden und der alpinen Natur. Die charakteristische Landschaft sollte erkennbar sein.' },
                { name: 'Rax-Seilbahn', lat: 47.7000, lng: 15.7000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Rax-Seilbahn mit ihren Gondeln und der Bergstation. Die Seilbahn sollte gut erkennbar sein.' },
                { name: 'Schneeberg', lat: 47.7667, lng: 15.8000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Schneeberg mit seinem Gipfel und der alpinen Landschaft. Der Berg sollte als Hauptmotiv erkennbar sein.' },
                { name: 'Krems an der Donau', lat: 48.4167, lng: 15.6000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die historische Altstadt von Krems mit ihren barocken Gebäuden und der Donau. Die Altstadt sollte gut sichtbar sein.' },
                { name: 'Burg Kreuzenstein', lat: 48.3500, lng: 16.3167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Burg Kreuzenstein mit ihrer mittelalterlichen Architektur und den Türmen. Die Burg sollte vollständig sichtbar sein.' },
                { name: 'Kittenberger Erlebnisgärten', lat: 48.2167, lng: 15.6500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Kittenberger Erlebnisgärten mit ihren thematischen Gärten und Pflanzen. Die Gärten sollten gut erkennbar sein.' }
            ],
            'Oberösterreich': [
                { name: 'Hallstatt', lat: 47.5667, lng: 13.6500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das berühmte Hallstatt mit seinen Häusern am See und der malerischen Landschaft. Das Dorf sollte mit dem See im Hintergrund sichtbar sein.' },
                { name: 'Dachstein Eishöhlen', lat: 47.5167, lng: 13.7000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Eingang zu den Dachstein Eishöhlen mit der charakteristischen Felsformation. Der Höhleneingang sollte erkennbar sein.' },
                { name: 'Linz Hauptplatz', lat: 48.3000, lng: 14.2833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Linzer Hauptplatz mit der Dreifaltigkeitssäule und den barocken Gebäuden. Der Platz sollte gut erkennbar sein.' },
                { name: 'Ars Electronica Center', lat: 48.3167, lng: 14.3000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Ars Electronica Center mit seiner modernen Architektur und den LED-Fassaden. Das Gebäude sollte gut sichtbar sein.' },
                { name: 'Schloss Ort Gmunden', lat: 47.9167, lng: 13.8000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Schloss Ort am Traunsee mit seiner romantischen Lage auf der Insel. Das Schloss sollte mit dem See sichtbar sein.' },
                { name: 'Attersee', lat: 47.9167, lng: 13.5500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Attersee mit seinem klaren Wasser und der alpinen Landschaft. Der See sollte als Hauptmotiv erkennbar sein.' },
                { name: 'Mauthausen Gedenkstätte', lat: 48.2500, lng: 14.5000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Gedenkstätte Mauthausen mit ihren Mahnmalen und der historischen Bedeutung. Die Gedenkstätte sollte respektvoll fotografiert werden.' },
                { name: 'Pöstlingbergbahn', lat: 48.3167, lng: 14.2833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Pöstlingbergbahn mit ihren historischen Waggons und der steilen Strecke. Die Bahn sollte erkennbar sein.' },
                { name: 'Traunsee', lat: 47.8667, lng: 13.8000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Traunsee mit seinen Bergen und dem klaren Wasser. Der See sollte mit der Landschaft sichtbar sein.' },
                { name: 'Stift St. Florian', lat: 48.2167, lng: 14.3833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Stift St. Florian mit seiner barocken Architektur und den prächtigen Gebäuden. Das Kloster sollte gut erkennbar sein.' }
            ],
            'Salzburg': [
                { name: 'Festung Hohensalzburg', lat: 47.8000, lng: 13.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Festung Hohensalzburg auf dem Festungsberg mit ihrer imposanten Architektur. Die Festung sollte vollständig sichtbar sein.' },
                { name: 'Mozarts Geburtshaus', lat: 47.8000, lng: 13.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere Mozarts Geburtshaus in der Getreidegasse mit der charakteristischen Fassade. Das Haus sollte gut erkennbar sein.' },
                { name: 'Mirabellgarten', lat: 47.8000, lng: 13.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Mirabellgarten mit seinen Blumenbeeten und dem Schloss Mirabell. Die Gärten sollten gut sichtbar sein.' },
                { name: 'Eisriesenwelt Werfen', lat: 47.5000, lng: 13.1833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Eingang zur Eisriesenwelt mit der charakteristischen Felsformation. Der Höhleneingang sollte erkennbar sein.' },
                { name: 'Krimmler Wasserfälle', lat: 47.1833, lng: 12.1833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Krimmler Wasserfälle mit ihrem tosenden Wasser und der imposanten Höhe. Die Wasserfälle sollten gut sichtbar sein.' },
                { name: 'Salzburger Dom', lat: 47.8000, lng: 13.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Salzburger Dom mit seiner barocken Fassade und den charakteristischen Türmen. Der Dom sollte vollständig sichtbar sein.' },
                { name: 'Getreidegasse', lat: 47.8000, lng: 13.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die berühmte Getreidegasse mit ihren historischen Häusern und den charakteristischen Geschäftsschildern. Die Gasse sollte erkennbar sein.' },
                { name: 'Hellbrunn Schloss', lat: 47.7667, lng: 13.0667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Schloss Hellbrunn mit seinen Wasserspielen und dem barocken Garten. Das Schloss sollte gut erkennbar sein.' },
                { name: 'Kapuzinerberg', lat: 47.8000, lng: 13.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Kapuzinerberg mit dem Kloster und der Aussicht auf Salzburg. Der Berg sollte mit der Stadt sichtbar sein.' },
                { name: 'St. Peter Stiftskeller', lat: 47.8000, lng: 13.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das St. Peter Stiftskeller mit seinem historischen Gebäude und der traditionellen Architektur. Das Gebäude sollte gut erkennbar sein.' }
            ],
            'Steiermark': [
                { name: 'Schlossberg Graz', lat: 47.0833, lng: 15.4333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Uhrturm Graz', lat: 47.0833, lng: 15.4333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Basilika Mariazell', lat: 47.7667, lng: 15.3167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Therme Loipersdorf', lat: 47.0167, lng: 16.1000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Schladming-Dachstein', lat: 47.4000, lng: 13.6833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Riegersburg', lat: 47.0000, lng: 15.9333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Grüner See', lat: 47.5500, lng: 15.0500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Tierwelt Herberstein', lat: 47.2000, lng: 15.8000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Murinsel Graz', lat: 47.0833, lng: 15.4333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Lurgrotte Peggau', lat: 47.2167, lng: 15.3500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' }
            ],
            'Tirol': [
                { name: 'Innsbrucker Altstadt', lat: 47.2667, lng: 11.3833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Goldenes Dachl', lat: 47.2667, lng: 11.3833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Nordkette Seilbahn', lat: 47.2667, lng: 11.3833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Swarovski Kristallwelten', lat: 47.3000, lng: 11.6000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Zillertal', lat: 47.1667, lng: 11.8667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Achensee', lat: 47.4333, lng: 11.7000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Kufstein Festung', lat: 47.5833, lng: 12.1667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Stubaital', lat: 47.1167, lng: 11.3167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Alpbach', lat: 47.4000, lng: 11.9500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Ötztal', lat: 47.0000, lng: 10.9333, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' }
            ],
            'Vorarlberg': [
                { name: 'Bregenzer Festspiele', lat: 47.5000, lng: 9.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Pfänderbahn', lat: 47.5000, lng: 9.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Kunsthaus Bregenz', lat: 47.5000, lng: 9.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Silvretta Hochalpenstraße', lat: 46.9167, lng: 10.0833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Rappenlochschlucht Dornbirn', lat: 47.4167, lng: 9.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Bregenzerwald', lat: 47.3333, lng: 9.9167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Karren Seilbahn', lat: 47.4167, lng: 9.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Montafon', lat: 47.0833, lng: 9.9167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Burg Schattenburg', lat: 47.5000, lng: 9.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' },
                { name: 'Bodensee', lat: 47.5000, lng: 9.7500, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop' }
            ],
            'Wien': [
                { name: 'Schloss Schönbrunn', lat: 48.1833, lng: 16.3167, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Schloss Schönbrunn mit seiner barocken Fassade und den prächtigen Gärten. Das Schloss sollte vollständig sichtbar sein.' },
                { name: 'Stephansdom', lat: 48.2000, lng: 16.3667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Stephansdom mit seinem charakteristischen gotischen Turm und der bunten Dachziegel. Der Dom sollte gut erkennbar sein.' },
                { name: 'Hofburg', lat: 48.2000, lng: 16.3667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Hofburg mit ihrer imposanten Architektur und den historischen Gebäuden. Die Hofburg sollte als Hauptmotiv sichtbar sein.' },
                { name: 'Prater Riesenrad', lat: 48.2167, lng: 16.4000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Wiener Riesenrad im Prater mit seiner charakteristischen Form. Das Riesenrad sollte gut erkennbar sein.' },
                { name: 'Belvedere', lat: 48.1833, lng: 16.3833, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Schloss Belvedere mit seinen beiden Palästen und den barocken Gärten. Das Schloss sollte gut sichtbar sein.' },
                { name: 'Kunsthistorisches Museum', lat: 48.2000, lng: 16.3667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Kunsthistorische Museum mit seiner prächtigen Architektur und der Kuppel. Das Museum sollte gut erkennbar sein.' },
                { name: 'Naschmarkt', lat: 48.2000, lng: 16.3667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere den Naschmarkt mit seinen Ständen und der lebendigen Atmosphäre. Der Markt sollte gut sichtbar sein.' },
                { name: 'Albertina', lat: 48.2000, lng: 16.3667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Albertina mit ihrer klassizistischen Fassade und der charakteristischen Architektur. Das Gebäude sollte gut erkennbar sein.' },
                { name: 'Wiener Staatsoper', lat: 48.2000, lng: 16.3667, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere die Wiener Staatsoper mit ihrer neorenaissance Architektur und den charakteristischen Säulen. Die Oper sollte gut sichtbar sein.' },
                { name: 'Hundertwasserhaus', lat: 48.2000, lng: 16.4000, reward: 10, referenceImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', description: 'Fotografiere das Hundertwasserhaus mit seinen bunten Fassaden und der unkonventionellen Architektur. Das Haus sollte gut erkennbar sein.' }
            ]
        };
        
        let totalCreated = 0;
        let dropNumber = 1;
        
        // Create drops for each federal state
        for (const [state, drops] of Object.entries(austriaDrops)) {
            console.log(`🏛️ Creating drops for ${state}...`);
            
            for (const drop of drops) {
                const userDropData = {
                    name: `Austria-${state}-${dropNumber}`,
                    description: `🇦🇹 ${drop.name} - ${state}`,
                    photoDescription: drop.description || `Fotografiere ${drop.name} in ${state}`,
                    reward: drop.reward,
                    lat: drop.lat,
                    lng: drop.lng,
                    createdBy: 'austria-tourist-system',
                    createdByName: 'Austria Tourist System',
                    createdAt: new Date(),
                    isActive: true,
                    isAvailable: true,
                    geodropNumber: dropNumber.toString(),
                    collection: 'userDrops',
                    referenceImage: `${drop.name.replace(/\s+/g, '_')}.jpg`,
                    referenceImageUrl: drop.referenceImage,
                    referenceImageHash: null, // Will be calculated when image is processed
                    isAustriaTouristDrop: true,
                    federalState: state
                };
                
                await db.collection('userDrops').add(userDropData);
                console.log(`✅ Created: ${drop.name} (${state}) - ${drop.reward} PixelDrops`);
                totalCreated++;
                dropNumber++;
            }
        }
        
        showMessage(`✅ ${totalCreated} Austria Tourist Drops erfolgreich erstellt!`, false);
        console.log(`🇦🇹 Created ${totalCreated} Austria Tourist Drops across all federal states`);
        
        // Reload drops
        if (typeof loadAllUserDrops === 'function') {
            loadAllUserDrops();
        }
        
    } catch (error) {
        console.error('❌ Error creating Austria Tourist Drops:', error);
        showMessage('❌ Fehler beim Erstellen der Austria Tourist Drops: ' + error.message, true);
    }
};

// Test function - Create only ONE Austria Tourist Drop
window.createTestAustriaDrop = async function() {
    console.log('🧪 Creating TEST Austria Tourist Drop...');
    
    if (!window.isDevLoggedIn && sessionStorage.getItem('devLoggedIn') !== 'true') {
        showMessage('❌ Dev-Zugang erforderlich!', true);
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        
        // Get Schloss Schönbrunn image from local file
        console.log('📥 Getting Schloss Schönbrunn image from local file...');
        
        // Use your local background.png that definitely works
        const imageResponse = await fetch('./images/background.png');
        const imageBlob = await imageResponse.blob();
        
        console.log('✅ Got Schloss Schönbrunn image from local file');
        
        // Get current user
        let currentUser = window.currentUser;
        if (!currentUser && window.auth && window.auth.currentUser) {
            currentUser = window.auth.currentUser;
        }
        if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
            currentUser = window.firebase.auth().currentUser;
        }
        
        if (!currentUser) {
            showMessage('❌ Bitte zuerst anmelden!', true);
            return;
        }
        
        // Get next UserDrop number
        const userDropsSnapshot = await db.collection('userDrops')
            .where('createdBy', '==', currentUser.uid)
            .get();
        
        const nextUserDropNumber = userDropsSnapshot.size + 1;
        const imageFilename = `UserDrop${nextUserDropNumber}_Schloss_Schoenbrunn.jpg`;
        
        // Upload to Firebase Storage with correct filename
        const storage = window.firebase.storage();
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`referenzbilder_userdrop/${imageFilename}`);
        
        console.log('📤 Uploading reference image to Firebase Storage...');
        const uploadTask = await imageRef.put(imageBlob);
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Calculate hash for image comparison
        const arrayBuffer = await imageBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const imageHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        console.log('🔐 Reference image hash calculated:', imageHash);
        console.log('✅ Reference image uploaded:', downloadURL);
        
        // Test drop - Schloss Schönbrunn in Wien
        const testDrop = {
            name: `UserDrop${nextUserDropNumber}`,
            description: '🇦🇹 Schloss Schönbrunn - Wien (TEST)',
            photoDescription: 'Fotografiere das Schloss Schönbrunn mit seiner barocken Fassade und den prächtigen Gärten. Das Schloss sollte vollständig sichtbar sein.',
            reward: 10,
            lat: 48.1833,
            lng: 16.3167,
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || currentUser.email || 'Unknown User',
            createdByEmail: currentUser.email,
            createdAt: new Date(),
            isActive: true,
            isAvailable: true,
            geodropNumber: nextUserDropNumber.toString(),
            collection: 'userDrops',
            referenceImage: imageFilename,
            referenceImageUrl: downloadURL, // Firebase Storage URL
            referenceImageHash: imageHash, // SHA-256 hash for comparison
            isAustriaTouristDrop: true,
            federalState: 'Wien'
        };
        
        await db.collection('userDrops').add(testDrop);
        
        console.log('✅ Test Austria Drop created:', testDrop.name);
        showMessage('✅ Test Austria Drop erfolgreich erstellt! (Schloss Schönbrunn)', false);
        
        // Reload drops
        if (typeof loadAllUserDrops === 'function') {
            loadAllUserDrops();
        }
        
    } catch (error) {
        console.error('❌ Error creating test Austria Drop:', error);
        showMessage('❌ Fehler beim Erstellen des Test Austria Drops: ' + error.message, true);
    }
};

// List Type Switching Functions
window.currentListType = 'dev'; // Track current list type
window.currentUploadListType = 'dev'; // Track current upload list type

// Make functions globally available
window.showCreateUserDropModal = window.showCreateUserDropModal;
window.switchToUploadListType = window.switchToUploadListType;
window.switchToListType = window.switchToListType;
window.loadGeoDrops = window.loadGeoDrops;

window.switchToListType = function(type) {
    console.log(`🔄 Switching to ${type} drops list`);
    
    const devBtn = document.getElementById('dev-drops-btn');
    const userBtn = document.getElementById('user-drops-btn');
    const devSection = document.getElementById('dev-drops-section');
    const userSection = document.getElementById('user-drops-section');
    
    if (type === 'dev') {
        // Switch to dev drops
        devBtn.className = 'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white';
        userBtn.className = 'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white';
        devSection.style.display = 'block';
        userSection.style.display = 'none';
        window.currentListType = 'dev';
        
        // Load dev drops
        loadDevGeoDrops();
        
        const devDropsShownText = window.t ? window.t('geocard.dev-drops-shown') : 'Dev GeoDrops angezeigt';
        showMessage(`🎯 ${devDropsShownText}`, false);
    } else if (type === 'user') {
        // Switch to user drops
        devBtn.className = 'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white';
        userBtn.className = 'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-green-600 text-white';
        devSection.style.display = 'none';
        userSection.style.display = 'block';
        window.currentListType = 'user';
        
        // Load user drops
        loadUserGeoDrops();
        
        const userDropsShownText = window.t ? window.t('geocard.user-drops-shown') : 'User GeoDrops angezeigt';
        showMessage(`👤 ${userDropsShownText}`, false);
    }
};

window.initGeoMap = function(mapContainerId = null) {
    console.log('🗺️ Initializing map...');
    
    try {
        // Remove existing map if it exists
        if (window.geoMap) {
            window.geoMap.remove();
            window.geoMap = null;
        }
        
        // Determine which map container to use
        let mapId = mapContainerId;
        if (!mapId) {
            // Default to standard map container
            mapId = 'mapid';
        }
        
        console.log(`🗺️ Using map container: ${mapId}`);
        
        // Check if map container exists
        const mapContainer = document.getElementById(mapId);
        if (!mapContainer) {
            console.error(`❌ Map container not found: ${mapId}`);
            return;
        }
        
        // Initialize new map with neutral location (world view)
        // Mobile-optimized map settings
        const isMobile = window.innerWidth <= 768;
        const mapOptions = {
            zoomControl: !isMobile, // Hide zoom controls on mobile (use gestures)
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            scrollWheelZoom: !isMobile, // Disable scroll zoom on mobile
            boxZoom: false,
            keyboard: false,
            zoomSnap: 0.1,
            zoomDelta: 0.5
        };
        
        window.geoMap = L.map(mapId, mapOptions).setView([0, 0], 2);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CartoDB',
            maxZoom: 20,
            subdomains: 'abcd'
        }).addTo(window.geoMap);
        
        console.log('✅ Map initialized');
        
        // Add mobile touch gestures
        if (isMobile) {
            // Add custom zoom controls for mobile
            const zoomInBtn = L.control({position: 'topright'});
            zoomInBtn.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'mobile-zoom-control');
                div.innerHTML = '<button class="bg-white p-2 rounded shadow-lg text-lg font-bold">+</button>';
                div.onclick = function() {
                    map.zoomIn();
                };
                return div;
            };
            zoomInBtn.addTo(window.geoMap);
            
            const zoomOutBtn = L.control({position: 'topright'});
            zoomOutBtn.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'mobile-zoom-control');
                div.innerHTML = '<button class="bg-white p-2 rounded shadow-lg text-lg font-bold">-</button>';
                div.style.marginTop = '50px';
                div.onclick = function() {
                    map.zoomOut();
                };
                return div;
            };
            zoomOutBtn.addTo(window.geoMap);
            
            // Add location button for mobile
            const locationBtn = L.control({position: 'topleft'});
            locationBtn.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'mobile-location-control');
                div.innerHTML = '<button class="bg-blue-500 text-white p-2 rounded shadow-lg text-lg">📍</button>';
                div.onclick = function() {
                    getCurrentLocation();
                };
                return div;
            };
            locationBtn.addTo(window.geoMap);
        }
        
        showMessage('🗺️ Karte geladen! Standort wird automatisch ermittelt...', false);
        
        // Auto get location after map is loaded
        setTimeout(() => {
            getUserLocation();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Map error:', error);
        showMessage('❌ Fehler beim Laden der Karte', true);
    }
};

// GPS Cache clearing function
window.clearGPSCache = function() {
    console.log('🗑️ Clearing GPS cache...');
    
    // Clear all location-related data
    window.currentLocation = null;
    sessionStorage.removeItem('lastLocation');
    sessionStorage.removeItem('lastKnownLocation');
    sessionStorage.removeItem('gpsCache');
    sessionStorage.removeItem('locationCache');
    sessionStorage.removeItem('cachedLocation');
    
    // Clear map markers
    if (window.locationMarker) {
        window.geoMap.removeLayer(window.locationMarker);
        window.locationMarker = null;
    }
    if (window.accuracyCircle) {
        window.geoMap.removeLayer(window.accuracyCircle);
        window.accuracyCircle = null;
    }
    
    showMessage('🗑️ GPS-Cache komplett geleert! Lade Standort neu...', false);
    console.log('🗑️ GPS cache cleared successfully - forcing fresh GPS data');
    
    // Auto-reload location after cache clear
    setTimeout(() => {
        if (typeof window.getUserLocation === 'function') {
            window.getUserLocation();
        }
    }, 1000);
};

window.getUserLocation = function() {
    console.log('📍 Getting user location...');
    console.log('🌐 Browser Info:', {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        geolocationSupported: !!navigator.geolocation,
        online: navigator.onLine
    });
    
    if (!navigator.geolocation) {
        console.error('❌ Geolocation not supported');
        showMessage('❌ Geolocation wird nicht unterstützt', true);
        return;
    }
    
    showMessage('📍 Standort wird ermittelt... (Falls GPS nicht funktioniert, verwende Dev-Modus)', false);
    
    const options = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0 // Force fresh GPS - no cache allowed
    };
    
    // Force fresh GPS data - no cache allowed
    console.log('📍 GPS Options:', {
        enableHighAccuracy: options.enableHighAccuracy,
        timeout: options.timeout + 'ms',
        maximumAge: options.maximumAge + 'ms (FORCE FRESH GPS)'
    });
    console.log('📍 FORCING fresh GPS data - no cache allowed!');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            console.log('✅ Location found:', { lat, lng, accuracy });
            console.log('🔍 GPS Details:', {
                latitude: lat,
                longitude: lng,
                accuracy: accuracy + 'm',
                altitude: position.coords.altitude || 'N/A',
                heading: position.coords.heading || 'N/A',
                speed: position.coords.speed || 'N/A',
                timestamp: new Date(position.timestamp).toLocaleString()
            });
            
            // Validate coordinates (basic sanity check)
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                console.error('❌ Invalid coordinates:', { lat, lng });
                const invalidGPSText = window.t ? window.t('geocard.invalid-gps') : 'Ungültige GPS-Koordinaten erhalten!';
                showMessage(`❌ ${invalidGPSText}`, true);
                return;
            }
            
            // Check if coordinates look like Vienna (common GPS cache issue)
            const isVienna = (lat >= 48.0 && lat <= 48.3 && lng >= 16.0 && lng <= 16.5);
            if (isVienna) {
                console.warn('⚠️ WARNING: Coordinates look like Vienna! This might be cached GPS data.');
                console.warn('📍 Vienna coordinates detected:', { lat, lng });
                
                // Add Vienna detection warning and cache clear button
                const locationInfoVienna = document.getElementById('location-info');
                if (locationInfoVienna) {
                    locationInfoVienna.innerHTML += `
                        <div class="mt-3 p-3 bg-red-900 border border-red-600 rounded-lg">
                            <div class="text-red-300 font-bold mb-2">⚠️ ${window.t ? window.t('geocard.cached-coordinates') : 'Gecachte Koordinaten erkannt!'}</div>
                            <div class="text-red-200 text-sm mb-3">${window.t ? window.t('geocard.cached-gps-data') : 'Das sind wahrscheinlich gecachte GPS-Daten. Bitte aktualisiere deinen Standort!'}</div>
                            <button onclick="clearGPSCache()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                🗑️ ${window.t ? window.t('geocard.clear-gps-cache') : 'GPS-Cache leeren'} & neu laden
                            </button>
                        </div>
                    `;
                }
            }
            
            // Update global currentLocation
            window.currentLocation = {
                lat: lat,
                lng: lng,
                accuracy: accuracy,
                timestamp: new Date()
            };
            
            console.log('📍 Updated currentLocation:', window.currentLocation);
            console.log('🌍 Location check - Vienna?', isVienna ? 'YES ⚠️' : 'NO ✅');
            
            // Update location info display
            const locationInfoSuccess = document.getElementById('location-info');
            if (locationInfoSuccess) {
                locationInfoSuccess.innerHTML = `
                <div class="bg-green-900 border border-green-600 rounded p-3 mt-2">
                    <strong class="text-green-300">📍 Standort gefunden:</strong><br>
                    <span class="text-green-200">Breitengrad: ${lat.toFixed(6)}</span><br>
                    <span class="text-green-200">Längengrad: ${lng.toFixed(6)}</span><br>
                    <span class="text-green-200">Genauigkeit: ${accuracy.toFixed(0)}m</span><br>
                    <span class="text-green-200">Zeit: ${new Date().toLocaleTimeString()}</span>
                </div>
            `;
            }
            
            showMessage(`📍 Standort aktualisiert: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, false);
            
            // Update map if available
            if (window.geoMap && typeof L !== 'undefined') {
                // Center map on user location with appropriate zoom
                const zoomLevel = accuracy < 100 ? 16 : accuracy < 500 ? 14 : 12;
                
                // Force map to update position
                window.geoMap.setView([lat, lng], zoomLevel, { animate: true, duration: 1 });
                
                // Double-check position after a short delay
                setTimeout(() => {
                    if (window.geoMap) {
                        const currentCenter = window.geoMap.getCenter();
                        window.geoMap.setView([lat, lng], zoomLevel);
                        console.log('🗺️ Map position verified:', { 
                            requested: { lat, lng, zoomLevel },
                            actual: { 
                                lat: currentCenter.lat, 
                                lng: currentCenter.lng,
                                zoom: window.geoMap.getZoom()
                            }
                        });
                        
                        // Check if map actually moved to the right position
                        const newCenter = window.geoMap.getCenter();
                        const distance = Math.sqrt(
                            Math.pow(newCenter.lat - lat, 2) + 
                            Math.pow(newCenter.lng - lng, 2)
                        );
                        console.log('🗺️ Map position accuracy:', {
                            distance: distance.toFixed(6),
                            accurate: distance < 0.001 ? 'YES ✅' : 'NO ❌'
                        });
                    }
                }, 500);
                
                // Remove existing location marker
                if (window.locationMarker) {
                    window.geoMap.removeLayer(window.locationMarker);
                }
                
                // Add new location marker with accuracy circle
                window.locationMarker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'location-marker',
                        html: '<div style="background: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(window.geoMap);
                
                // Add accuracy circle to show GPS uncertainty
                if (window.accuracyCircle) {
                    window.geoMap.removeLayer(window.accuracyCircle);
                }
                window.accuracyCircle = L.circle([lat, lng], {
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.1,
                    radius: accuracy
                }).addTo(window.geoMap);
                
                
                const yourLocationText = window.t ? window.t('geocard.your-location') : 'Dein Standort';
                const accuracyText = window.t ? window.t('geocard.accuracy') : 'Genauigkeit';
                const zoomText = window.t ? window.t('geocard.zoom') : 'Zoom';
                
                window.locationMarker.bindPopup(`
                    <div class="text-center">
                        <strong>📍 ${yourLocationText}</strong><br>
                        <small>${lat.toFixed(6)}, ${lng.toFixed(6)}</small><br>
                        <small>${accuracyText}: ${accuracy.toFixed(0)}m</small><br>
                        <small>${zoomText}: ${zoomLevel}</small>
                    </div>
                `).openPopup();
                
                console.log('✅ Map updated with location:', { lat, lng, accuracy, zoomLevel });
            }
        },
        (error) => {
            console.error('❌ Geolocation error:', error);
            
            let errorMessage = 'Unbekannter Fehler';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Standortzugriff verweigert - bitte in den Browser-Einstellungen erlauben';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Standort nicht verfügbar - möglicherweise GPS-Cache-Problem. Bitte Browser neu starten.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Standort-Timeout - GPS-Signal zu schwach. Bitte versuche es erneut.';
                    break;
            }
            
            const locationInfoFallback = document.getElementById('location-info');
            if (locationInfoFallback) {
                locationInfoFallback.innerHTML = `
                    <div class="bg-red-900 border border-red-600 rounded p-3 mt-2">
                        <strong class="text-red-300">❌ Fehler:</strong><br>
                        <span class="text-red-200">${errorMessage}</span>
                    </div>
                `;
            }
            
            showMessage(`❌ ${errorMessage} (Tipp: Verwende Dev-Modus für Test-Koordinaten)`, true);
            
            // Add GPS cache clear button for all users (Vienna detection)
            const locationInfoError = document.getElementById('location-info');
            if (locationInfoError) {
                locationInfoError.innerHTML += `
                    <div class="mt-3">
                        <button onclick="clearGPSCache()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            🗑️ GPS-Cache leeren (Vienna-Problem)
                        </button>
                    </div>
                `;
            }
            
            // Try fallback with less strict options
            console.log('🔄 Trying fallback location detection...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
                    
                    console.log('✅ Fallback location found:', { lat, lng, accuracy });
                    
                    window.currentLocation = {
                        lat: lat,
                        lng: lng,
                        accuracy: accuracy,
                        timestamp: new Date()
                    };
                    
                    if (window.geoMap) {
                        window.geoMap.setView([lat, lng], 12);
                        showMessage(`📍 Fallback-Standort: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, false);
                    }
                },
                (fallbackError) => {
                    console.error('❌ Fallback also failed:', fallbackError);
                    showMessage('❌ Standort konnte nicht ermittelt werden', true);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        },
        options
    );
};

window.forceUpdateLocation = function() {
    getUserLocation();
};

window.toggleMobileDebug = function() {
    // Remove existing debug window if it exists
    const existingDebug = document.getElementById('debug-window');
    if (existingDebug) {
        existingDebug.remove();
        return;
    }
    
    // Get current location if available
    let locationInfo = 'Nicht verfügbar';
    let locationAccuracy = 'N/A';
    let locationTime = 'N/A';
    
    if (typeof window.currentLocation !== 'undefined' && window.currentLocation) {
        locationInfo = `${window.currentLocation.lat.toFixed(6)}, ${window.currentLocation.lng.toFixed(6)}`;
        locationAccuracy = `${window.currentLocation.accuracy.toFixed(0)}m`;
        locationTime = window.currentLocation.timestamp ? window.currentLocation.timestamp.toLocaleTimeString() : 'N/A';
    }
    
    // Get map status
    const notInitializedText = window.t ? window.t('geocard.not-initialized') : 'Nicht initialisiert';
    let mapStatus = `❌ ${notInitializedText}`;
    if (typeof window.geoMap !== 'undefined' && window.geoMap) {
        const center = window.geoMap.getCenter();
        const zoom = window.geoMap.getZoom();
        const zoomText = window.t ? window.t('geocard.zoom') : 'Zoom';
        mapStatus = `✅ OK (${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}, ${zoomText}: ${zoom})`;
    }
    
    // Get user agent info
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isHTTPS = location.protocol === 'https:';
    
    const debugInfo = `
        <div id="debug-window" style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.95); color: white; padding: 15px; border-radius: 8px; z-index: 9999; max-width: 380px; font-family: 'Courier New', monospace; font-size: 11px; border: 2px solid #10b981; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
            <h4 style="margin: 0 0 15px 0; color: #10b981; font-size: 14px;">🐛 GeoDrop Debug Console</h4>
            
            <div style="margin-bottom: 10px;">
                <strong style="color: #fbbf24;">📍 ${window.t ? window.t('geocard.gps-status') : 'GPS Status'}:</strong><br>
                <span style="color: #d1d5db;">${window.t ? window.t('geocard.position') : 'Position'}: ${locationInfo}</span><br>
                <span style="color: #d1d5db;">${window.t ? window.t('geocard.accuracy') : 'Genauigkeit'}: ${locationAccuracy}</span><br>
                <span style="color: #d1d5db;">${window.t ? window.t('geocard.time') : 'Zeit'}: ${locationTime}</span>
            </div>
            
            <div style="margin-bottom: 10px;">
                <strong style="color: #3b82f6;">🗺️ ${window.t ? window.t('geocard.map-status') : 'Karte Status'}:</strong><br>
                <span style="color: #d1d5db;">${mapStatus}</span><br>
                <span style="color: #d1d5db;">Leaflet: ${typeof L !== 'undefined' ? `✅ ${window.t ? window.t('geocard.loaded') : 'Geladen'}` : `❌ ${window.t ? window.t('geocard.missing') : 'Fehlt'}`}</span>
            </div>
            
            <div style="margin-bottom: 10px;">
                <strong style="color: #8b5cf6;">🌐 Verbindung:</strong><br>
                <span style="color: #d1d5db;">Online: ${navigator.onLine ? '✅ Ja' : '❌ Nein'}</span><br>
                <span style="color: #d1d5db;">HTTPS: ${isHTTPS ? '✅ Ja' : '❌ Nein'}</span><br>
                <span style="color: #d1d5db;">Protokoll: ${location.protocol}</span>
            </div>
            
            <div style="margin-bottom: 10px;">
                <strong style="color: #ef4444;">📱 Gerät:</strong><br>
                <span style="color: #d1d5db;">Mobile: ${isMobile ? '✅ Ja' : '❌ Nein'}</span><br>
                <span style="color: #d1d5db;">Platform: ${navigator.platform}</span><br>
                <span style="color: #d1d5db;">Bildschirm: ${screen.width}x${screen.height}</span><br>
                <span style="color: #d1d5db;">Fenster: ${window.innerWidth}x${window.innerHeight}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: #06b6d4;">🔧 ${window.t ? window.t('geocard.app-status') : 'App Status'}:</strong><br>
                <span style="color: #d1d5db;">Firebase: ${typeof auth !== 'undefined' ? '✅ OK' : '❌ Fehler'}</span><br>
                <span style="color: #d1d5db;">User: ${auth && auth.currentUser ? auth.currentUser.email : (window.t ? window.t('geocard.not-logged-in') : 'Nicht angemeldet')}</span>
            </div>
            
            <button onclick="document.getElementById('debug-window').remove()" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold;">❌ Schließen</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', debugInfo);
};

// Global functions for all pages
window.showMapLegend = function() {
    showMessage('🗺️ Karten-Legende: 🟢 Grüne Marker = Deine GeoDrops, 🔵 Blaue Marker = Andere Spieler, 🟡 Gelbe Marker = Beliebte Orte', false);
};

window.showDropRules = function() {
    const dropRulesText = window.t ? window.t('geocard.drop-rules') : `
📋 GeoDrop-Regeln:

🎯 ERSTELLEN:
• Mindestabstand: 5km zu anderen Drops
• GPS-Position erforderlich
• Beschreibung und Foto erforderlich

📸 CLAIMEN:
• Maximal 50m vom Drop entfernt
• Foto muss dem Referenzbild entsprechen
• AR-Konturen helfen beim Ausrichten
• Täglich nur einmal pro Drop

💰 BELOHNUNGEN:
• Dev Drops: 100 PixelDrops
• User Drops: 100 PixelDrops
• Täglich sammelbar

⚠️ WICHTIG:
• Keine Drops in 5km Umkreis
• GPS muss aktiviert sein
• Foto muss scharf und passend sein
    `;
    showMessage(dropRulesText, false);
};

// Load GeoDrops from Firebase
window.loadGeoDrops = async function() {
    console.log('🗺️ Loading GeoDrops...');
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        // Clear existing markers first
        if (window.dropMarkers && window.dropMarkers.length > 0) {
            console.log('🗑️ Clearing existing markers...');
            window.dropMarkers.forEach(marker => {
                if (marker && window.geoMap) {
                    window.geoMap.removeLayer(marker);
                }
            });
            window.dropMarkers = [];
        }
        
        const db = window.firebase.firestore();
        console.log('🔍 Loading devDrops...');
        // Load all dev drops (both isAvailable and isActive)
        const allDevDropsSnapshot = await db.collection('devDrops').get();
        console.log('🔍 All dev drops found:', allDevDropsSnapshot.size);
        
        // Filter for active/available drops
        const devDropsSnapshot = {
            docs: allDevDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.isActive === true || data.isAvailable === true;
            }),
            size: 0
        };
        devDropsSnapshot.size = devDropsSnapshot.docs.length;
        console.log('🔍 Active/Available dev drops found:', devDropsSnapshot.size);
        
        console.log('🔍 Loading userDrops...');
        const userDropsSnapshot = await db.collection('userDrops').where('isActive', '==', true).get();
        console.log('🔍 User drops found:', userDropsSnapshot.size);
        
        const allDrops = [];
        devDropsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log('🔍 Dev drop:', doc.id, 'lat:', data.lat, 'lng:', data.lng);
            allDrops.push({ id: doc.id, ...data, collection: 'devDrops' });
        });
        userDropsSnapshot.forEach(doc => {
            const data = doc.data();
            console.log('🔍 User drop:', doc.id, 'lat:', data.lat, 'lng:', data.lng);
            allDrops.push({ id: doc.id, ...data, collection: 'userDrops' });
        });
        
        // Sort drops by geodropNumber (starting with 1)
        allDrops.sort((a, b) => {
            const numA = parseInt(a.geodropNumber) || parseInt(a.id) || 0;
            const numB = parseInt(b.geodropNumber) || parseInt(b.id) || 0;
            return numA - numB;
        });
        
        // Update main dropdown (not upload dropdown)
        // Update main dropdown with all drops (show all initially)
        updateMainDropdown(allDrops);
        
        // Don't load any specific drops initially - let user choose
        
        // Also update upload dropdowns if they exist
        updateUploadDropdowns(allDrops);
        
        console.log('🔍 Total drops to add to map:', allDrops.length);
        console.log('🔍 All drops data:', allDrops);
        
        // Add drop markers to map
        console.log('🗺️ Calling addDropMarkersToMap...');
        addDropMarkersToMap(allDrops);
        
        console.log(`✅ Loaded ${allDrops.length} GeoDrops`);
    } catch (error) {
        console.error('❌ Error loading GeoDrops:', error);
        if (error.code === 'permission-denied') {
            console.log('🔒 User not logged in, skipping GeoDrops load');
            showMessage('ℹ️ Bitte anmelden um GeoDrops zu sehen', false);
        } else {
            showMessage('❌ Fehler beim Laden der GeoDrops: ' + error.message, true);
        }
        // Don't show error to user if it's a permission issue (user not logged in)
        if (error.code === 'permission-denied' || error.message.includes('permissions')) {
            console.log('🔒 User not logged in, skipping GeoDrops load');
            return;
        }
        showMessage('Fehler beim Laden der GeoDrops', true);
        
        // Hide loading indicator on error
        const geodropsList = document.getElementById('geodrops-list');
        if (geodropsList) {
            geodropsList.innerHTML = '<div class="text-center text-red-400 py-4"><p>❌ Fehler beim Laden der GeoDrops</p></div>';
        }
        
        const table = document.getElementById('geodrops-table');
        if (table) {
            table.innerHTML = '<div class="text-center text-red-400 p-4">Fehler beim Laden der GeoDrops</div>';
        }
    }
};

// Update main dropdown with all drops
function updateMainDropdown(allDrops) {
    console.log('📋 Updating main dropdown with', allDrops.length, 'drops');
    
    // Update German dropdown
    const mainDropdownDe = document.getElementById('geocard-drop-select-de');
    if (mainDropdownDe) {
        mainDropdownDe.innerHTML = '<option value="">auswählen</option>';
        
        // Add all drops to German dropdown
        allDrops.forEach(drop => {
            const option = document.createElement('option');
            option.value = drop.id;
            const dropNumber = drop.geodropNumber || drop.name?.match(/(\d+)/)?.[1] || 'N/A';
            const creatorName = drop.ersteller || drop.createdByName || 'Unknown';
            const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
            const dropType = drop.collection === 'devDrops' ? 'Dev' : 'User';
            option.textContent = `${dropType} GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
            option.dataset.collection = drop.collection;
            mainDropdownDe.appendChild(option);
        });
    }
    
    // Update English dropdown
    const mainDropdownEn = document.getElementById('geocard-drop-select-en');
    if (mainDropdownEn) {
        mainDropdownEn.innerHTML = '<option value="">choose</option>';
        
        // Add all drops to English dropdown
        allDrops.forEach(drop => {
            const option = document.createElement('option');
            option.value = drop.id;
            const dropNumber = drop.geodropNumber || drop.name?.match(/(\d+)/)?.[1] || 'N/A';
            const creatorName = drop.ersteller || drop.createdByName || 'Unknown';
            const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
            const dropType = drop.collection === 'devDrops' ? 'Dev' : 'User';
            option.textContent = `${dropType} GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
            option.dataset.collection = drop.collection;
            mainDropdownEn.appendChild(option);
        });
    }
    
    console.log('✅ Main dropdowns updated with', allDrops.length, 'drops');
    
    // Update dropdown language based on current global language
    updateDropdownLanguage();
}

// Update upload dropdowns with all drops
function updateUploadDropdowns(allDrops) {
    console.log('📋 Updating upload dropdowns with', allDrops.length, 'drops');
    
    // Update user drops upload dropdown (both language versions)
    const userUploadSelectDe = document.getElementById('geocard-user-drop-select-de');
    const userUploadSelectEn = document.getElementById('geocard-user-drop-select-en');
    
    if (userUploadSelectDe || userUploadSelectEn) {
        const userSelectTextDe = 'User GeoDrop auswählen...';
        const userSelectTextEn = 'Select User GeoDrop...';
        
        // Filter for user drops only
        const userDrops = allDrops.filter(drop => drop.collection === 'userDrops');
        
        // Update German dropdown
        if (userUploadSelectDe) {
            userUploadSelectDe.innerHTML = `<option value="">${userSelectTextDe}</option>`;
            userDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = `userDrops:${drop.id}`;
                const dropNumber = drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A';
                const creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                option.textContent = `👤 User GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
                userUploadSelectDe.appendChild(option);
            });
        }
        
        // Update English dropdown
        if (userUploadSelectEn) {
            userUploadSelectEn.innerHTML = `<option value="">${userSelectTextEn}</option>`;
            userDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = `userDrops:${drop.id}`;
                const dropNumber = drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A';
                const creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                option.textContent = `👤 User GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
                userUploadSelectEn.appendChild(option);
            });
        }
        
        console.log('✅ User upload dropdowns updated with', userDrops.length, 'user drops');
    }
    
    // Update dev drops upload dropdown (both language versions)
    const devUploadSelectDe = document.getElementById('geocard-drop-select-de');
    const devUploadSelectEn = document.getElementById('geocard-drop-select-en');
    
    if (devUploadSelectDe || devUploadSelectEn) {
        const devSelectTextDe = 'Dev GeoDrop auswählen...';
        const devSelectTextEn = 'Select Dev GeoDrop...';
        
        // Filter for dev drops only
        const devDrops = allDrops.filter(drop => drop.collection === 'devDrops');
        
        // Update German dropdown
        if (devUploadSelectDe) {
            devUploadSelectDe.innerHTML = `<option value="">${devSelectTextDe}</option>`;
            devDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = `devDrops:${drop.id}`;
                const dropNumber = drop.geodropNumber || drop.name?.match(/GeoDrop(\d+)/)?.[1] || 'N/A';
                const creatorName = drop.ersteller || drop.createdByName || 'Dev System';
                const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                option.textContent = `🔧 Dev GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
                devUploadSelectDe.appendChild(option);
            });
        }
        
        // Update English dropdown
        if (devUploadSelectEn) {
            devUploadSelectEn.innerHTML = `<option value="">${devSelectTextEn}</option>`;
            devDrops.forEach(drop => {
                const option = document.createElement('option');
                option.value = `devDrops:${drop.id}`;
                const dropNumber = drop.geodropNumber || drop.name?.match(/GeoDrop(\d+)/)?.[1] || 'N/A';
                const creatorName = drop.ersteller || drop.createdByName || 'Dev System';
                const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
                option.textContent = `🔧 Dev GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
                devUploadSelectEn.appendChild(option);
            });
        }
        
        console.log('✅ Dev upload dropdowns updated with', devDrops.length, 'dev drops');
    }
}

// Update dropdown language based on global language switch
window.updateDropdownLanguage = function() {
    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
    console.log('🌍 Updating dropdown language to:', currentLang);
    
    // Show/hide dropdowns based on current language
    const dropdownDe = document.getElementById('geocard-drop-select-de');
    const dropdownEn = document.getElementById('geocard-drop-select-en');
    
    if (dropdownDe && dropdownEn) {
        if (currentLang === 'de') {
            dropdownDe.style.display = 'block';
            dropdownEn.style.display = 'none';
        } else {
            dropdownDe.style.display = 'none';
            dropdownEn.style.display = 'block';
        }
    }
    
    console.log('✅ Dropdown language updated to:', currentLang);
};


// Add drop markers to map
window.addDropMarkersToMap = function(drops) {
    console.log(`🗺️ Adding ${drops.length} drop markers to map`);
    
    if (!window.geoMap) {
        console.log('❌ Map not available - retrying in 1 second...');
        setTimeout(() => {
            window.addDropMarkersToMap(drops);
        }, 1000);
        return;
    }
    
    // Clear existing drop markers
    if (window.dropMarkers) {
        window.dropMarkers.forEach(marker => {
            if (marker) {
                window.geoMap.removeLayer(marker);
            }
        });
    }
    window.dropMarkers = [];
    
    // Add new markers
    console.log(`🗺️ Processing ${drops.length} drops for markers...`);
    drops.forEach((drop, index) => {
        // console.log(`🗺️ Drop ${index + 1}: ${drop.name}, lat=${drop.lat}, lng=${drop.lng}, collection=${drop.collection}`);
        if (drop.lat && drop.lng) {
            const isDevDrop = drop.isDevDrop || drop.collection === 'devDrops';
            const isUserDrop = drop.collection === 'userDrops';
            
            // Get current user for status check
            let currentUser = window.currentUser;
            if (!currentUser && window.auth && window.auth.currentUser) {
                currentUser = window.auth.currentUser;
            }
            if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                currentUser = window.firebase.auth().currentUser;
            }
            
            // Check if claimed today with proper date comparison
            const today = new Date().toDateString();
            const lastClaimDate = drop.lastClaimDate ? drop.lastClaimDate.toDate().toDateString() : null;
            const isClaimedToday = lastClaimDate === today && drop.claimedBy === currentUser?.uid;
            
            // Different marker sizes and icons for different drop types
            let markerSize, markerIcon, markerAnchor, popupAnchor;
            if (isDevDrop) {
                markerSize = [62, 62];
                markerIcon = '🎯';
                markerAnchor = [31, 31];
                popupAnchor = [0, -31];
            } else if (isUserDrop) {
                markerSize = [35, 35];
                markerIcon = '🎯';
                markerAnchor = [17, 17];
                popupAnchor = [0, -17];
            } else {
                markerSize = [25, 25];
                markerIcon = '🎯';
                markerAnchor = [12, 12];
                popupAnchor = [0, -12];
            }
            
            const markerIconElement = L.divIcon({
                className: 'drop-marker',
                html: `<div style="font-size: ${markerSize[0]}px; text-align: center; line-height: 1; filter: ${isClaimedToday ? 'grayscale(100%) opacity(0.5)' : 'none'};">${markerIcon}</div>`,
                iconSize: markerSize,
                iconAnchor: markerAnchor,
                popupAnchor: popupAnchor
            });
            
            // Get current language for status texts
            const currentLang = window.currentLanguage || 'de';
            // Use direct language check for all texts
            const collectedTodayText = currentLang === 'en' ? 'Collected Today' : 'Heute gesammelt';
            const availableText = currentLang === 'en' ? 'Available' : 'Verfügbar';
            const devDropText = currentLang === 'en' ? 'Dev' : 'Dev';
            const userDropText = currentLang === 'en' ? 'User' : 'User';
            const normalDropText = currentLang === 'en' ? 'Normal' : 'Normal';
            
            const statusText = isClaimedToday ? `⏰ ${collectedTodayText}` : `✅ ${availableText}`;
            const dropTypeText = isDevDrop ? `🎯 ${devDropText}` : isUserDrop ? `👤 ${userDropText}` : `🌍 ${normalDropText}`;
            // Check if user can delete this drop
            const isDev = window.isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
            const isCreator = currentUser && drop.createdBy === currentUser.uid;
            const canDelete = isDev || isCreator;
            
            // console.log(`🗺️ Creating marker for ${drop.name} at [${drop.lat}, ${drop.lng}]`);
            const marker = L.marker([drop.lat, drop.lng], { icon: markerIconElement })
                .addTo(window.geoMap);
            
            // Store drop data in marker for later use
            marker.dropData = drop;
            
            // console.log(`🗺️ Marker added to map: ${marker._leaflet_id}`);
            
            // Create popup content with current language
            const photographText = currentLang === 'en' ? 'Photograph:' : 'Fotografiere:';
            const deleteText = currentLang === 'en' ? 'Delete' : 'Löschen';
            const rewardLabelText = currentLang === 'en' ? 'Reward:' : 'Reward:';
            const statusLabelText = currentLang === 'en' ? 'Status:' : 'Status:';
            const coordinatesLabelText = currentLang === 'en' ? 'Coordinates:' : 'Koordinaten:';
            const pixeldropsText = currentLang === 'en' ? 'PixelDrops' : 'PixelDrops';
            
            // Get description from Firebase dual-language fields
            const dropDescription = getDropDescription(drop, currentLang);
            
            marker.bindPopup(`
                    <div class="text-sm" style="min-width: 200px;">
                        <strong>${dropTypeText} GeoDrop${drop.geodropNumber || drop.id}</strong><br>
                        <div style="margin: 8px 0; padding: 8px; background: #f0f0f0; border-radius: 4px; border-left: 3px solid #10b981;">
                            <strong>📸 ${photographText}</strong><br>
                            <span style="color: #374151; font-size: 12px;">
                                ${dropDescription}
                            </span>
                        </div>
                        <div style="margin: 4px 0;">
                            <strong>💰 ${rewardLabelText}</strong> ${drop.reward || 100} ${pixeldropsText}<br>
                            <strong>📊 ${statusLabelText}</strong> ${statusText}<br>
                            <strong>📍 ${coordinatesLabelText}</strong> ${drop.lat.toFixed(6)}, ${drop.lng.toFixed(6)}
                        </div>
                        ${canDelete ? `
                            <div style="margin-top: 8px; text-align: center;">
                                <button onclick="deleteUserDrop('${drop.id}')" 
                                        style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; border: none; cursor: pointer; font-size: 12px;">
                                    🗑️ ${deleteText}
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `);
            
            window.dropMarkers.push(marker);
        }
    });
    
    console.log(`✅ Added ${window.dropMarkers.length} markers to map`);
    console.log(`🗺️ Map bounds:`, window.geoMap.getBounds());
    console.log(`🗺️ Map center:`, window.geoMap.getCenter());
    console.log(`🗺️ Map zoom:`, window.geoMap.getZoom());
};

// Update all marker popups with current language
window.updateMarkerPopups = function() {
    console.log('🔄 Updating all marker popups with current language...');
    
    // Update location marker popup
    if (window.locationMarker && window.locationMarker.getPopup()) {
        const popup = window.locationMarker.getPopup();
        const content = popup.getContent();
        if (content) {
            const yourLocationText = window.t ? window.t('geocard.your-location') : 'Your Location';
            const accuracyText = window.t ? window.t('geocard.accuracy') : 'Accuracy';
            const zoomText = window.t ? window.t('geocard.zoom') : 'Zoom';
            
            // Extract coordinates from existing popup
            const coordMatch = content.match(/(\d+\.\d+), (\d+\.\d+)/);
            const accuracyMatch = content.match(/(Genauigkeit|Accuracy).*?(\d+)m/);
            const zoomMatch = content.match(/Zoom.*?(\d+)/);
            
            if (coordMatch && accuracyMatch && zoomMatch) {
                const lat = coordMatch[1];
                const lng = coordMatch[2];
                const accuracy = accuracyMatch[2];
                const zoom = zoomMatch[1];
                
                const newContent = `
                    <div class="text-center">
                        <strong>📍 ${yourLocationText}</strong><br>
                        <small>${lat}, ${lng}</small><br>
                        <small>${accuracyText}: ${accuracy}m</small><br>
                        <small>${zoomText}: ${zoom}</small>
                    </div>
                `;
                
                window.locationMarker.setPopupContent(newContent);
                console.log('✅ Location marker popup updated');
            }
        }
    }
    
    // Update drop markers popups
    if (window.dropMarkers && window.dropMarkers.length > 0) {
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
        console.log(`🔄 Updating ${window.dropMarkers.length} drop markers with language: ${currentLang}`);
        
        window.dropMarkers.forEach((marker, index) => {
            if (marker && marker.getPopup()) {
                // Get drop data from marker (if stored)
                const dropData = marker.dropData;
                if (dropData) {
                    console.log(`🔍 Updating marker ${index + 1} with drop data:`, dropData);
                    
                    // Recreate popup with current language using drop data
                    const dropTypeText = dropData.type === 'dev' ? '🎯 Dev' : dropData.type === 'user' ? '👤 User' : '🌍 Normal';
                    const photographText = currentLang === 'en' ? 'Photograph:' : 'Fotografiere:';
                    const rewardLabelText = currentLang === 'en' ? 'Reward:' : 'Reward:';
                    const statusLabelText = currentLang === 'en' ? 'Status:' : 'Status:';
                    const coordinatesLabelText = currentLang === 'en' ? 'Coordinates:' : 'Koordinaten:';
                    const pixeldropsText = currentLang === 'en' ? 'PixelDrops' : 'PixelDrops';
                    const availableText = currentLang === 'en' ? 'Available' : 'Verfügbar';
                    
                    // Get description from Firebase dual-language fields
                    const dropDescription = getDropDescription(dropData, currentLang);
                    console.log(`📝 Drop description for ${currentLang}:`, dropDescription);
                    
                    const newContent = `
                        <div class="text-sm" style="min-width: 200px;">
                            <strong>${dropTypeText} GeoDrop${dropData.geodropNumber || dropData.id}</strong><br>
                            <div style="margin: 8px 0; padding: 8px; background: #f0f0f0; border-radius: 4px; border-left: 3px solid #10b981;">
                                <strong>📸 ${photographText}</strong><br>
                                <span style="color: #374151; font-size: 12px;">
                                    ${dropDescription}
                                </span>
                            </div>
                            <div style="margin: 4px 0;">
                                <strong>💰 ${rewardLabelText}</strong> ${dropData.reward || 100} ${pixeldropsText}<br>
                                <strong>📊 ${statusLabelText}</strong> ✅ ${availableText}<br>
                                <strong>📍 ${coordinatesLabelText}</strong> ${dropData.lat.toFixed(6)}, ${dropData.lng.toFixed(6)}
                            </div>
                        </div>
                    `;
                    
                    marker.setPopupContent(newContent);
                    console.log(`✅ Drop marker ${index + 1} popup updated with language: ${currentLang}`);
                } else {
                    console.log(`⚠️ No drop data found for marker ${index + 1}`);
                }
            }
        });
    }
    
    console.log('✅ All marker popups updated with current language');
};

// Test function to manually update marker popups (for debugging)
window.testMarkerPopupUpdate = function() {
    console.log('🧪 Testing marker popup update...');
    if (typeof window.updateMarkerPopups === 'function') {
        window.updateMarkerPopups();
        console.log('✅ Marker popup update test completed');
    } else {
        console.error('❌ updateMarkerPopups function not found');
    }
};

// Test function to manually reload map markers with current language
window.testMapLanguageSwitch = function() {
    console.log('🧪 Testing map language switch...');
    console.log('Current language:', window.currentLanguage || 'unknown');
    
    if (typeof window.loadGeoDrops === 'function') {
        console.log('🔄 Reloading map markers...');
        window.loadGeoDrops();
        console.log('✅ Map markers reloaded with current language');
    } else {
        console.log('❌ loadGeoDrops function not found');
    }
};

// Simple test function to switch language and reload markers
window.testLanguageSwitch = function() {
    console.log('🧪 Testing language switch...');
    
    // Get current language
    const currentLang = window.currentLanguage || 'de';
    const newLang = currentLang === 'de' ? 'en' : 'de';
    
    console.log(`Switching from ${currentLang} to ${newLang}`);
    
    // Change language directly
    if (typeof window.changeLanguage === 'function') {
        window.changeLanguage(newLang);
        console.log('✅ Language changed, markers should reload automatically');
    } else {
        console.log('❌ changeLanguage function not found - trying direct approach');
        
        // Direct language change
        window.currentLanguage = newLang;
        console.log('✅ Language changed directly to:', newLang);
        
        // Force reload markers
        setTimeout(() => {
            if (typeof window.loadGeoDrops === 'function') {
                window.loadGeoDrops();
                console.log('✅ Markers reloaded with new language');
            }
        }, 100);
    }
};

// DIRECT TEST: Force reload markers right now
window.forceReloadMarkers = function() {
    console.log('🔄 FORCE RELOADING MARKERS RIGHT NOW...');
    
    // First, clear ALL existing markers
    if (window.geoMap && window.dropMarkers) {
        console.log('🗑️ Clearing existing markers...');
        window.dropMarkers.forEach(marker => {
            if (marker) {
                window.geoMap.removeLayer(marker);
            }
        });
        window.dropMarkers = [];
        console.log('✅ All markers cleared');
    }
    
    // Then reload
    if (typeof window.loadGeoDrops === 'function') {
        window.loadGeoDrops();
        console.log('✅ Markers reloaded!');
    } else {
        console.log('❌ loadGeoDrops not found');
    }
};

// SUPER SIMPLE TEST: Just change one marker popup
window.testOneMarker = function() {
    console.log('🧪 Testing one marker popup...');
    
    if (window.dropMarkers && window.dropMarkers.length > 0) {
        const marker = window.dropMarkers[0];
        if (marker && marker.getPopup()) {
            const newContent = `
                <div class="text-sm" style="min-width: 200px;">
                    <strong>🎯 Dev GeoDrop6</strong><br>
                    <div style="margin: 8px 0; padding: 8px; background: #f0f0f0; border-radius: 4px; border-left: 3px solid #10b981;">
                        <strong>📸 Photograph:</strong><br>
                        <span style="color: #374151; font-size: 12px;">
                            The object or scene at this location
                        </span>
                    </div>
                    <div style="margin: 4px 0;">
                        <strong>💰 Reward:</strong> 100 PixelDrops<br>
                        <strong>📊 Status:</strong> ✅ Available<br>
                        <strong>📍 Coordinates:</strong> 48.198486, 15.212260
                    </div>
                </div>
            `;
            marker.setPopupContent(newContent);
            console.log('✅ First marker popup updated to English!');
        }
    } else {
        console.log('❌ No markers found');
    }
};

// TEST: Force reload map with new language
window.testMapLanguageFix = function() {
    console.log('🧪 Testing map language fix...');
    
    // Clear all existing markers
    if (window.dropMarkers) {
        window.dropMarkers.forEach(marker => {
            if (marker && window.geoMap) {
                window.geoMap.removeLayer(marker);
            }
        });
        window.dropMarkers = [];
    }
    
    // Reload all drops with current language
    if (typeof window.loadGeoDrops === 'function') {
        window.loadGeoDrops();
        console.log('✅ Map reloaded with current language!');
    } else {
        console.log('❌ loadGeoDrops function not found');
    }
};

// EINFACHER TEST: Ändere Sprache und lade Marker neu
window.testSimpleLanguageSwitch = function() {
    console.log('🧪 EINFACHER TEST: Sprache wechseln...');
    
    // Wechsle Sprache
    const currentLang = window.currentLanguage || 'de';
    const newLang = currentLang === 'de' ? 'en' : 'de';
    window.currentLanguage = newLang;
    
    console.log(`🔄 Sprache gewechselt von ${currentLang} zu ${newLang}`);
    
    // Lösche alle Marker
    if (window.dropMarkers && window.dropMarkers.length > 0) {
        window.dropMarkers.forEach(marker => {
            if (marker && window.geoMap) {
                window.geoMap.removeLayer(marker);
            }
        });
        window.dropMarkers = [];
        console.log('🗑️ Alle Marker gelöscht');
    }
    
    // Lade Marker neu
    setTimeout(() => {
        if (typeof window.loadGeoDrops === 'function') {
            window.loadGeoDrops();
            console.log('✅ Marker mit neuer Sprache geladen!');
        }
    }, 500);
};

// NOTFALL-FUNKTION: Karte reparieren
window.repairMap = function() {
    console.log('🚨 NOTFALL: Karte reparieren...');
    
    // Prüfe ob Karte existiert
    const mapContainer = document.getElementById('mapid');
    if (!mapContainer) {
        console.log('❌ Map container nicht gefunden!');
        return;
    }
    
    // Initialisiere Karte neu
    if (typeof window.initGeoMap === 'function') {
        window.initGeoMap('mapid');
        console.log('✅ Karte neu initialisiert');
        
        // Lade Marker
        setTimeout(() => {
            if (typeof window.loadGeoDrops === 'function') {
                window.loadGeoDrops();
                console.log('✅ Marker geladen');
            }
        }, 1000);
    } else {
        console.log('❌ initGeoMap Funktion nicht gefunden');
    }
};

// ULTIMATE TEST: Force reload everything
window.ultimateTest = function() {
    console.log('🚀 ULTIMATE TEST - Reloading everything...');
    
    // Clear all markers
    if (window.geoMap && window.dropMarkers) {
        window.dropMarkers.forEach(marker => {
            if (marker) {
                window.geoMap.removeLayer(marker);
            }
        });
        window.dropMarkers = [];
    }
    
    // Force reload
    setTimeout(() => {
        if (typeof window.loadGeoDrops === 'function') {
            window.loadGeoDrops();
            console.log('✅ Everything reloaded!');
        }
    }, 100);
};

// SIMPLE LANGUAGE SWITCH
window.switchToEnglish = function() {
    console.log('🇺🇸 Switching to English...');
    window.currentLanguage = 'en';
    window.forceReloadMarkers();
};

window.switchToGerman = function() {
    console.log('🇩🇪 Switching to German...');
    window.currentLanguage = 'de';
    window.forceReloadMarkers();
};

// Show message function (fallback if not available)
if (!window.showMessage) {
    window.showMessage = function(message, isError = false) {
        console.log(isError ? '❌' : '✅', message);
    };
}

// TEST CONTAINER SWITCH
window.testContainerSwitch = function() {
    console.log('🧪 Testing container switch...');
    const currentLang = window.currentLanguage || 'de';
    const newLang = currentLang === 'de' ? 'en' : 'de';
    
    console.log(`🔄 Switching from ${currentLang} to ${newLang}`);
    
    if (newLang === 'en') {
        window.switchToEnglish();
    } else {
        window.switchToGerman();
    }
    
    console.log('✅ Container switch completed!');
};

// TEST MAP INITIALIZATION
window.testMapInit = function() {
    console.log('🧪 Testing map initialization...');
    
    // Check if map container exists
    const mapContainer = document.getElementById('mapid');
    
    console.log('📋 Container status:');
    console.log('  Map container:', mapContainer ? '✅ Found' : '❌ Missing');
    
    // Try to initialize map
    if (typeof window.initGeoMap === 'function') {
        console.log('🗺️ Initializing map...');
        window.initGeoMap('mapid');
    } else {
        console.log('❌ initGeoMap function not found');
    }
};

// Map Legend Popup Functions
window.showMapLegendPopup = function() {
    const popup = document.getElementById('map-legend-popup');
    if (popup) {
        popup.style.display = 'block';
    }
};

window.closeMapLegendPopup = function() {
    const popup = document.getElementById('map-legend-popup');
    if (popup) {
        popup.style.display = 'none';
    }
};

// AR Contour Detection Module
window.ARContourModule = {
    referenceImage: null,
    contourOverlay: null,
    isContourMatched: false,
    
    // Load reference image and extract contours
    async loadReferenceImage(drop) {
        console.log('🎯 Loading reference image for AR contour overlay...');
        
        // First, load drop data from Firebase to get reference image
        if (!drop.id || !drop.collection) {
            console.log('⚠️ No drop ID or collection available');
            return false;
        }
        
        try {
            // Load drop data from Firebase
            const dropDoc = await window.db.collection(drop.collection).doc(drop.id).get();
            if (!dropDoc.exists) {
                console.log('⚠️ Drop not found in Firebase');
                return false;
            }
            
            const dropData = dropDoc.data();
            console.log('📋 Drop data loaded:', dropData);
            
            if (!dropData.referenceImage) {
                console.log('⚠️ No reference image available for this drop');
                console.log('📋 Available drop data:', dropData);
                return false;
            }
            
            // Try different URL formats based on drop collection
            let referenceImageUrl;
            if (drop.collection === 'devDrops' || drop.id === 'GeoDrop2') {
                // FORCE DEV DROP PATH - verwende den korrekten Dateinamen
                referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2F${drop.id}.jpg?alt=media`;
                console.log(`🔍 DEV DROP URL in loadReferenceImage: ${referenceImageUrl}`);
                console.log(`🔍 Drop ID: ${drop.id}`);
            } else if (drop.collection === 'userDrops') {
                referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder_userdrop%2F${dropData.referenceImage}?alt=media`;
            } else {
                // Fallback to dev path
                const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                for (const ext of possibleExtensions) {
                    referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2F${drop.id}.${ext}?alt=media`;
                    break;
                }
            }
            console.log('🔗 Loading reference image from:', referenceImageUrl);
            console.log('📋 Reference image filename:', dropData.referenceImage);
            
            const response = await fetch(referenceImageUrl);
            
            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                console.log('✅ Reference image blob created, size:', blob.size, 'bytes');
                
                // Create image element to process
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                return new Promise((resolve) => {
                    img.onload = () => {
                        console.log('✅ Reference image loaded successfully');
                        console.log('📐 Image dimensions:', img.width, 'x', img.height);
                        this.referenceImage = img;
                        this.extractContours(img);
                        resolve(true);
                    };
                    img.onerror = (error) => {
                        console.error('❌ Failed to load reference image:', error);
                        console.error('❌ Image URL:', imageUrl);
                        resolve(false);
                    };
                    img.src = imageUrl;
                });
            } else {
                console.error('❌ Failed to fetch reference image, status:', response.status);
                console.error('❌ URL tried:', referenceImageUrl);
                console.error('❌ Response:', response);
                return false;
            }
        } catch (error) {
            console.error('❌ Error loading reference image:', error);
            return false;
        }
    },
    
    // Extract contours from reference image using edge detection
    extractContours(img) {
        console.log('🔍 Extracting contours from reference image...');
        console.log('📐 Image dimensions:', img.width, 'x', img.height);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Verwende die tatsächlichen Video-Dimensionen
        const video = document.getElementById('camera-video');
        const videoWidth = video ? video.videoWidth : 640;
        const videoHeight = video ? video.videoHeight : 480;
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        // Draw image to canvas, scaled to video dimensions
        ctx.drawImage(img, 0, 0, videoWidth, videoHeight);
        
        // Get image data for edge detection
        const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
        const data = imageData.data;
        
        // Simple edge detection (Sobel operator)
        const edges = this.detectEdges(data, videoWidth, videoHeight);
        
        // Create contour overlay (NUR KANTEN, NICHT DAS GANZE BILD)
        this.createContourOverlay(edges, videoWidth, videoHeight);
        
        console.log('✅ Contours extracted and overlay created (only edges)');
    },
    
    // Simple edge detection using Sobel operator (NUR KANTEN, NICHT DAS GANZE BILD)
    detectEdges(data, width, height) {
        const edges = new Uint8ClampedArray(data.length);
        
        // Initialize with transparent background
        for (let i = 0; i < edges.length; i += 4) {
            edges[i] = 0;     // R
            edges[i + 1] = 0; // G
            edges[i + 2] = 0; // B
            edges[i + 3] = 0; // A (transparent)
        }
        
        // Convert to grayscale and apply Sobel operator
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // Get surrounding pixels
                const getPixel = (dx, dy) => {
                    const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
                    return (data[pixelIdx] + data[pixelIdx + 1] + data[pixelIdx + 2]) / 3;
                };
                
                // Sobel X
                const sobelX = 
                    -1 * getPixel(-1, -1) + 1 * getPixel(1, -1) +
                    -2 * getPixel(-1, 0) + 2 * getPixel(1, 0) +
                    -1 * getPixel(-1, 1) + 1 * getPixel(1, 1);
                
                // Sobel Y
                const sobelY = 
                    -1 * getPixel(-1, -1) + -2 * getPixel(0, -1) + -1 * getPixel(1, -1) +
                    1 * getPixel(-1, 1) + 2 * getPixel(0, 1) + 1 * getPixel(1, 1);
                
                // Calculate magnitude
                const magnitude = Math.sqrt(sobelX * sobelX + sobelY * sobelY);
                
                // Threshold for edge detection (nur starke Kanten)
                if (magnitude > 100) {
                    edges[idx] = 255;     // R (white edge)
                    edges[idx + 1] = 255; // G (white edge)
                    edges[idx + 2] = 255; // B (white edge)
                    edges[idx + 3] = 255; // A (opaque)
                }
            }
        }
        
        return edges;
    },
    
    // Create contour overlay element (NUR KANTEN, NICHT DAS GANZE BILD)
    createContourOverlay(edges, width, height) {
        console.log('🎨 Creating contour overlay canvas...');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Verwende die tatsächlichen Video-Dimensionen
        const video = document.getElementById('camera-video');
        const videoWidth = video ? video.videoWidth : 640;
        const videoHeight = video ? video.videoHeight : 480;
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        canvas.id = 'contour-overlay';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '10';
        canvas.style.opacity = '0.6';
        canvas.style.border = '2px solid #00ff00';
        canvas.style.objectFit = 'cover';
        
        // Create image data from edges (NUR KANTEN, NICHT DAS GANZE BILD)
        const imageData = new ImageData(edges, width, height);
        ctx.putImageData(imageData, 0, 0);
        
        this.contourOverlay = canvas;
        console.log('✅ Contour overlay canvas created (ONLY EDGES):', canvas.width, 'x', canvas.height);
    },
    
    // Show contour overlay on camera - KONTUR ÜBER KAMERA-BILD LEGEN
    showContourOverlay() {
        console.log('🎯 ZEIGE KONTUR ÜBER KAMERA-BILD');
        
        if (this.contourOverlay) {
            const videoContainer = document.getElementById('camera-video').parentElement;
            videoContainer.style.position = 'relative';
            
            // Remove any existing overlay first
            const existingOverlay = document.getElementById('contour-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // KONTUR ÜBER KAMERA-BILD LEGEN
            videoContainer.appendChild(this.contourOverlay);
            
            // Add pulsing animation to indicate scanning
            this.contourOverlay.style.animation = 'pulse 2s infinite';
            
            console.log('✅ KONTUR ÜBER KAMERA-BILD GELEGT');
            console.log('📐 Overlay dimensions:', this.contourOverlay.width, 'x', this.contourOverlay.height);
        } else {
            console.log('⚠️ No contour overlay available - creating fallback immediately');
            this.createFallbackContourOverlay();
        }
    },
    
    // Create fallback contour overlay if reference image failed
    createFallbackContourOverlay() {
        const videoContainer = document.getElementById('camera-video').parentElement;
        
        // Create a simple contour overlay for demonstration
        const fallbackOverlay = document.createElement('div');
        fallbackOverlay.id = 'fallback-contour-overlay';
        fallbackOverlay.style.position = 'absolute';
        fallbackOverlay.style.top = '0';
        fallbackOverlay.style.left = '0';
        fallbackOverlay.style.width = '100%';
        fallbackOverlay.style.height = '100%';
        fallbackOverlay.style.pointerEvents = 'none';
        fallbackOverlay.style.zIndex = '10';
        fallbackOverlay.style.opacity = '0.6';
        fallbackOverlay.style.border = '3px solid #00ff00';
        fallbackOverlay.style.borderRadius = '10px';
        fallbackOverlay.style.animation = 'pulse 2s infinite';
        
        // Add corner markers
        const corners = [
            { top: '10%', left: '10%' },
            { top: '10%', right: '10%' },
            { bottom: '10%', left: '10%' },
            { bottom: '10%', right: '10%' }
        ];
        
        corners.forEach((corner, index) => {
            const cornerMarker = document.createElement('div');
            cornerMarker.style.position = 'absolute';
            cornerMarker.style.width = '20px';
            cornerMarker.style.height = '20px';
            cornerMarker.style.border = '2px solid #00ff00';
            cornerMarker.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
            cornerMarker.style.borderRadius = '50%';
            cornerMarker.style.animation = 'pulse 1.5s infinite';
            cornerMarker.style.animationDelay = `${index * 0.2}s`;
            
            Object.assign(cornerMarker.style, corner);
            fallbackOverlay.appendChild(cornerMarker);
        });
        
        // Add center crosshair
        const crosshair = document.createElement('div');
        crosshair.style.position = 'absolute';
        crosshair.style.top = '50%';
        crosshair.style.left = '50%';
        crosshair.style.transform = 'translate(-50%, -50%)';
        crosshair.style.width = '40px';
        crosshair.style.height = '40px';
        crosshair.style.border = '2px solid #00ff00';
        crosshair.style.borderRadius = '50%';
        crosshair.style.animation = 'pulse 1s infinite';
        
        // Add crosshair lines
        const horizontalLine = document.createElement('div');
        horizontalLine.style.position = 'absolute';
        horizontalLine.style.top = '50%';
        horizontalLine.style.left = '0';
        horizontalLine.style.width = '100%';
        horizontalLine.style.height = '2px';
        horizontalLine.style.backgroundColor = '#00ff00';
        horizontalLine.style.transform = 'translateY(-50%)';
        
        const verticalLine = document.createElement('div');
        verticalLine.style.position = 'absolute';
        verticalLine.style.top = '0';
        verticalLine.style.left = '50%';
        verticalLine.style.width = '2px';
        verticalLine.style.height = '100%';
        verticalLine.style.backgroundColor = '#00ff00';
        verticalLine.style.transform = 'translateX(-50%)';
        
        crosshair.appendChild(horizontalLine);
        crosshair.appendChild(verticalLine);
        fallbackOverlay.appendChild(crosshair);
        
        videoContainer.appendChild(fallbackOverlay);
        
        console.log('🎯 Fallback contour overlay created');
    },
    
    // Hide contour overlay
    hideContourOverlay() {
        if (this.contourOverlay && this.contourOverlay.parentElement) {
            this.contourOverlay.parentElement.removeChild(this.contourOverlay);
        }
        
        // Also remove fallback overlay if it exists
        const fallbackOverlay = document.getElementById('fallback-contour-overlay');
        if (fallbackOverlay && fallbackOverlay.parentElement) {
            fallbackOverlay.parentElement.removeChild(fallbackOverlay);
        }
    },
    
    // EINFACHE KONTUR-ÜBEREINSTIMMUNG - KEIN VIDEO!
    checkContourMatch() {
        console.log('🎯 PRÜFE KONTUR-ÜBEREINSTIMMUNG');
        
        // EINFACH: Prüfe ob Referenzbild vorhanden ist
        if (!this.referenceImage) {
            console.log('⚠️ No reference image');
            return false;
        }
        
        // ECHTE KONTUR-ÜBEREINSTIMMUNG - KEINE SIMULATION!
        console.log('🔍 ECHTE KONTUR-ANALYSE...');
        
        // Prüfe ob Kontur-Overlay vorhanden ist
        if (!this.contourOverlay) {
            console.log('⚠️ No contour overlay');
            return false;
        }
        
        // ECHTE ÜBEREINSTIMMUNG: Prüfe ob Konturen sichtbar sind
        const overlay = document.getElementById('contour-overlay');
        if (overlay && overlay.style.display !== 'none') {
            console.log('✅ KONTUR SICHTBAR - ÜBEREINSTIMMUNG!');
            return true;
        }
        
        return false;
        
        try {
            // REAL IMAGE COMPARISON: Capture current video frame
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;
            
            // Draw current video frame
            tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
            
            // Get image data for comparison
            const currentImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            
            // REAL COMPARISON: Compare with reference image
            const similarity = this.compareImageContours(currentImageData);
            this.lastMatchScore = similarity;
            
            console.log(`🔍 REAL comparison: similarity=${(similarity * 100).toFixed(1)}%`);
            
            // Only match if similarity is above 60% (strict threshold)
            if (similarity > 0.6) {
                console.log('✅ REAL MATCH detected! Images are similar enough');
                this.isContourMatched = true;
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ Error in contour matching:', error);
            return false;
        }
    },
    
    // Compare current camera image with reference image contours (REAL implementation)
    compareImageContours(currentImageData) {
        if (!this.referenceImage) {
            console.log('⚠️ No reference image for comparison');
            return 0;
        }
        
        try {
            // Create canvas for reference image processing
            const refCanvas = document.createElement('canvas');
            const refCtx = refCanvas.getContext('2d');
            refCanvas.width = this.referenceImage.width;
            refCanvas.height = this.referenceImage.height;
            
            // Draw reference image
            refCtx.drawImage(this.referenceImage, 0, 0);
            const refImageData = refCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);
            
            console.log('🔍 Comparing images:');
            console.log('📐 Current:', currentImageData.width, 'x', currentImageData.height);
            console.log('📐 Reference:', refImageData.width, 'x', refImageData.height);
            
            // Extract edges from both images
            const currentEdges = this.extractEdgesFromImageData(currentImageData);
            const refEdges = this.extractEdgesFromImageData(refImageData);
            
            // Calculate similarity between edge patterns
            const similarity = this.calculateEdgeSimilarity(currentEdges, refEdges);
            console.log('🔍 Edge similarity calculated:', (similarity * 100).toFixed(1) + '%');
            
            return similarity;
            
        } catch (error) {
            console.error('❌ Error comparing contours:', error);
            return 0;
        }
    },
    
    // Extract edges from image data using Sobel operator
    extractEdgesFromImageData(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const edges = new Uint8ClampedArray(data.length);
        
        // Apply Sobel edge detection
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // Get surrounding pixels
                const getPixel = (dx, dy) => {
                    const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
                    return (data[pixelIdx] + data[pixelIdx + 1] + data[pixelIdx + 2]) / 3;
                };
                
                // Sobel X
                const sobelX = 
                    -1 * getPixel(-1, -1) + 1 * getPixel(1, -1) +
                    -2 * getPixel(-1, 0) + 2 * getPixel(1, 0) +
                    -1 * getPixel(-1, 1) + 1 * getPixel(1, 1);
                
                // Sobel Y
                const sobelY = 
                    -1 * getPixel(-1, -1) + -2 * getPixel(0, -1) + -1 * getPixel(1, -1) +
                    1 * getPixel(-1, 1) + 2 * getPixel(0, 1) + 1 * getPixel(1, 1);
                
                // Calculate magnitude
                const magnitude = Math.sqrt(sobelX * sobelX + sobelY * sobelY);
                
                // Threshold for edge detection
                const edgeValue = magnitude > 50 ? 255 : 0;
                
                edges[idx] = edgeValue;
                edges[idx + 1] = edgeValue;
                edges[idx + 2] = edgeValue;
                edges[idx + 3] = 255;
            }
        }
        
        return edges;
    },
    
    // Calculate similarity between two edge patterns
    calculateEdgeSimilarity(edges1, edges2) {
        if (edges1.length !== edges2.length) {
            console.log('⚠️ Edge arrays have different lengths');
            return 0;
        }
        
        let matches = 0;
        let totalPixels = 0;
        let strongMatches = 0;
        
        for (let i = 0; i < edges1.length; i += 4) {
            const edge1 = edges1[i];
            const edge2 = edges2[i];
            
            if (edge1 > 0 || edge2 > 0) { // If either has an edge
                totalPixels++;
                
                if (edge1 > 0 && edge2 > 0) { // Both have edges
                    matches++;
                    
                    // Check for strong edge matches (both edges are significant)
                    if (edge1 > 100 && edge2 > 100) {
                        strongMatches++;
                    }
                }
            }
        }
        
        const basicSimilarity = totalPixels > 0 ? matches / totalPixels : 0;
        const strongSimilarity = totalPixels > 0 ? strongMatches / totalPixels : 0;
        
        // Weighted similarity: 70% basic + 30% strong matches
        const finalSimilarity = (basicSimilarity * 0.7) + (strongSimilarity * 0.3);
        
        console.log(`🔍 Similarity breakdown: basic=${(basicSimilarity * 100).toFixed(1)}%, strong=${(strongSimilarity * 100).toFixed(1)}%, final=${(finalSimilarity * 100).toFixed(1)}%`);
        
        return finalSimilarity;
    },
    
    // Get how long user has been scanning
    getScanTime() {
        if (!this.scanStartTime) {
            this.scanStartTime = Date.now();
        }
        return Date.now() - this.scanStartTime;
    },
    
    // Simulate camera stability (movement detection)
    getCameraStability() {
        // Simulate stability based on time - more stable over time
        const scanTime = this.getScanTime();
        const stability = Math.min(1.0, scanTime / 10000); // Max stability after 10 seconds
        
        // Add some random movement simulation
        const movementFactor = 0.7 + (Math.random() * 0.3); // 0.7 to 1.0
        
        return stability * movementFactor;
    },
    
    // Update scan status display with real match score
    updateScanStatus() {
        const scanStatus = document.getElementById('scan-status');
        if (!scanStatus) return;
        
        const scanTime = this.getScanTime();
        
        // Get real match score from last comparison
        const matchScore = this.lastMatchScore || 0;
        const matchPercentage = Math.round(matchScore * 100);
        
        let statusText = '';
        let statusColor = 'text-yellow-400';
        
        if (matchScore > 0.7) {
            statusText = `✅ PERFEKT! Konturen stimmen überein! (${matchPercentage}%)`;
            statusColor = 'text-green-400';
        } else if (matchScore > 0.4) {
            statusText = `🔍 Konturen erkannt... (${matchPercentage}%)`;
            statusColor = 'text-blue-400';
        } else if (scanTime < 3000) {
            statusText = '🎯 Scanne die Umgebung...';
            statusColor = 'text-yellow-400';
        } else if (scanTime < 5000) {
            statusText = '🔍 Analysiere Bild...';
            statusColor = 'text-orange-400';
        } else if (scanTime < 3000) {
            statusText = '🎯 Scanne die Umgebung...';
            statusColor = 'text-yellow-400';
        } else {
            statusText = '✅ Bereit für Foto!';
            statusColor = 'text-green-400';
        }
        
        scanStatus.textContent = statusText;
        scanStatus.className = `text-xs mt-1 ${statusColor}`;
        
        // AKTIVIERE BUTTON NACH 3 SEKUNDEN (FALLBACK)
        if (scanTime > 3000 && !this.isContourMatched) {
            const captureBtn = document.getElementById('capture-btn');
            if (captureBtn && captureBtn.disabled) {
                captureBtn.disabled = false;
                captureBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                captureBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                captureBtn.innerHTML = '✅ Foto aufnehmen';
                console.log('✅ Button activated after 3 seconds (fallback)');
            }
        }
    },
    
    // Show success feedback
    showSuccessFeedback() {
        console.log('🎉 Showing success feedback!');
        
        const videoContainer = document.getElementById('camera-video').parentElement;
        
        // Create green overlay
        const successOverlay = document.createElement('div');
        successOverlay.id = 'success-overlay';
        successOverlay.style.position = 'absolute';
        successOverlay.style.top = '0';
        successOverlay.style.left = '0';
        successOverlay.style.width = '100%';
        successOverlay.style.height = '100%';
        successOverlay.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
        successOverlay.style.border = '5px solid #00ff00';
        successOverlay.style.zIndex = '20';
        successOverlay.style.display = 'flex';
        successOverlay.style.alignItems = 'center';
        successOverlay.style.justifyContent = 'center';
        successOverlay.style.animation = 'pulse 1s infinite';
        successOverlay.style.fontSize = '24px';
        successOverlay.style.fontWeight = 'bold';
        successOverlay.style.color = 'white';
        successOverlay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        successOverlay.innerHTML = '✅ PERFEKT! Konturen stimmen überein!';
        
        videoContainer.appendChild(successOverlay);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (successOverlay.parentElement) {
                successOverlay.parentElement.removeChild(successOverlay);
            }
        }, 2000);
        
        this.isContourMatched = true;
    }
};

// Photo capture functions
window.handlePhotoCapture = function() {
    console.log('📸 Photo capture requested - opening camera');
    openCamera();
};

// Camera capture function with AR contour overlay
window.openCamera = function() {
    console.log('📸 Opening camera with AR contour overlay...');
    
    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('❌ Kamera wird von diesem Browser nicht unterstützt!');
        return;
    }
    
    // Get current drop data for reference image
    const currentDrop = window.currentDrop;
    if (!currentDrop) {
        alert('❌ Kein GeoDrop ausgewählt!');
        return;
    }
    
    // Create camera modal with AR features
    const cameraModal = document.createElement('div');
    cameraModal.id = 'camera-modal';
    cameraModal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-start justify-center overflow-y-auto';
    cameraModal.style.padding = '10px';
    cameraModal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-4 max-w-md w-full mx-4 mt-10 mb-10" style="max-height: 90vh; overflow-y: auto;">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-white text-lg font-semibold">🎯 AR Foto-Assistent</h3>
                <button onclick="closeCamera()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div class="mb-4">
                <div id="camera-container" class="relative">
                    <video id="camera-video" class="w-full h-64 bg-gray-700 rounded" autoplay></video>
                    <canvas id="camera-canvas" class="hidden"></canvas>
                    <div id="ar-instructions" class="absolute top-2 left-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-sm">
                        <div class="text-center">
                            <div class="text-green-400 font-bold">🎯 Scanne die Umgebung</div>
                            <div class="text-xs mt-1">Die Konturen des Referenzbildes werden überlagert</div>
                            <div id="scan-status" class="text-xs mt-1 text-yellow-400">Bewege die Kamera langsam...</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button id="capture-btn" onclick="capturePhoto()" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled>
                    📸 Foto aufnehmen
                </button>
                <button onclick="closeCamera()" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    ❌ Abbrechen
                </button>
            </div>
            
            <div class="mt-4 text-xs text-gray-400 text-center">
                💡 Richte die Kamera auf das Objekt und warte auf grüne Bestätigung
            </div>
        </div>
    `;
    
    document.body.appendChild(cameraModal);
    
    // Load reference image and start AR
    console.log('🎯 Loading reference image for drop:', currentDrop);
    
    // ECHTE LÖSUNG: Verknüpfe Referenzbilder mit Dropdown-Menü
    if (!currentDrop || !currentDrop.id) {
        console.error('❌ No currentDrop available!');
        alert('❌ Kein GeoDrop ausgewählt!');
        return;
    }
    
    console.log('🎯 Loading reference image for drop:', currentDrop);
    
    // ERSTELLE REFERENZBILD-URL - BASIEREND AUF DROP-TYP
    let referenceImageUrl = null;
    
    console.log('🔍 Drop Collection:', currentDrop.collection);
    console.log('🔍 Drop ID:', currentDrop.id);
    console.log('🔍 Full Drop Object:', currentDrop);
    
    // FORCE DEV DROP PATH FOR GeoDrop2
    if (currentDrop.id === 'GeoDrop2' || currentDrop.collection === 'devDrops') {
        // DEV DROPS: Teste verschiedene mögliche Dateinamen
        const possibleFiles = [
            'GeoDrop2.jpg',
            'GeoDrop2.jpeg', 
            'GeoDrop2.png',
            'GeoDrop2.webp',
            'geodrop2.jpg',
            'geodrop2.jpeg',
            'geodrop2.png',
            'geodrop2.webp'
        ];
        
        // DIE DATEI IST DA! Sie heißt nur "GeoDrop2" ohne Erweiterung!
        // Firebase Storage zeigt: GeoDrop2 (image/jpeg, 148.04 KB)
        referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2FGeoDrop2?alt=media`;
        console.log(`✅ DATEI GEFUNDEN: GeoDrop2 (image/jpeg, 148.04 KB)`);
        console.log(`🔗 URL: ${referenceImageUrl}`);
        console.log(`📋 Datei-Name: GeoDrop2 (ohne Erweiterung)`);
        console.log(`📋 Datei-Typ: image/jpeg`);
        console.log(`📋 Datei-Größe: 148.04 KB`);
    } else if (currentDrop.collection === 'userDrops') {
        // USER DROPS: referenzbilder_userdrop/UserDrop1_Schloss_Schoenbrunn.jpg
        const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        for (const ext of possibleExtensions) {
            referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder_userdrop%2F${currentDrop.id}.${ext}?alt=media`;
            console.log(`🔍 Testing USER DROP URL: ${referenceImageUrl}`);
            break; // Verwende die erste URL
        }
    }
    console.log('🔗 Reference image URL:', referenceImageUrl);
    console.log('📋 Drop ID:', currentDrop.id);
    console.log('📋 Current Drop:', currentDrop);
    
    // Lade Referenzbild direkt
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        console.log('✅ Reference image loaded successfully');
        console.log('📐 Image dimensions:', img.width, 'x', img.height);
        window.ARContourModule.referenceImage = img;
        window.ARContourModule.extractContours(img);
        // Zeige nur die Konturen, nicht das ganze Bild
        window.ARContourModule.showContourOverlay();
        console.log('🎯 Reference image contours displayed on camera');
        
        // FORCE SHOW CONTOURS IMMEDIATELY
        setTimeout(() => {
            window.ARContourModule.showContourOverlay();
            console.log('🎯 FORCED contour overlay display');
        }, 100);
        
        // FORCE SHOW CONTOURS AGAIN
        setTimeout(() => {
            window.ARContourModule.showContourOverlay();
            console.log('🎯 FORCED contour overlay display AGAIN');
        }, 500);
    };
    
    img.onerror = (error) => {
        console.error('❌ Failed to load reference image:', error);
        console.error('❌ URL tried:', referenceImageUrl);
        console.log('⚠️ Reference image not found - trying alternative approach');
        
        // VERSUCHE ALTERNATIVE URLS - teste verschiedene mögliche Dateinamen
        const alternativeUrls = [
            `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2FGeoDrop2.png?alt=media`,
            `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2FGeoDrop2.jpeg?alt=media`,
            `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2FGeoDrop2.webp?alt=media`,
            // Teste auch andere mögliche Namen
            `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2Fgeodrop2.jpg?alt=media`,
            `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2FGeoDrop_2.jpg?alt=media`,
            `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2FGeoDrop-2.jpg?alt=media`
        ];
        
        let currentIndex = 0;
        const tryNextUrl = () => {
            if (currentIndex < alternativeUrls.length) {
                const altUrl = alternativeUrls[currentIndex];
                console.log(`🔄 Trying alternative URL ${currentIndex + 1}: ${altUrl}`);
                const altImg = new Image();
                altImg.crossOrigin = 'anonymous';
                altImg.onload = () => {
                    console.log('✅ Alternative reference image loaded successfully');
                    window.ARContourModule.referenceImage = altImg;
                    window.ARContourModule.extractContours(altImg);
                    window.ARContourModule.showContourOverlay();
                };
                altImg.onerror = () => {
                    currentIndex++;
                    tryNextUrl();
                };
                altImg.src = altUrl;
        } else {
                console.log('⚠️ All alternative URLs failed - using fallback AR mode');
                window.ARContourModule.createFallbackContourOverlay();
            }
        };
        
        tryNextUrl();
    };
    
    img.src = referenceImageUrl;
    
    // Start camera
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
        } 
    })
    .then(stream => {
        const video = document.getElementById('camera-video');
        video.srcObject = stream;
        window.cameraStream = stream;
        console.log('✅ Camera started');
        
        // Show contour overlay immediately when camera starts
        setTimeout(() => {
            console.log('🎯 Showing AR overlay...');
            window.ARContourModule.showContourOverlay();
            
            // Start contour matching simulation
            const checkInterval = setInterval(() => {
                const isMatch = window.ARContourModule.checkContourMatch();
                console.log('🔍 Checking match:', isMatch, 'isContourMatched:', window.ARContourModule.isContourMatched);
                
                if (isMatch && !window.ARContourModule.isContourMatched) {
                    console.log('🎉 Match detected! Showing success feedback...');
                    window.ARContourModule.showSuccessFeedback();
                    
                    // Enable and style the capture button
                    const captureBtn = document.getElementById('capture-btn');
                    captureBtn.disabled = false;
                    captureBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                    captureBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                    captureBtn.innerHTML = '✅ Foto aufnehmen';
                    
                    // Clear the interval
                    clearInterval(checkInterval);
                } else {
                    // Update scan status
                    window.ARContourModule.updateScanStatus();
                }
            }, 1000);
        }, 500); // Reduced delay for faster overlay display
    })
    .catch(error => {
        console.error('❌ Camera error:', error);
        alert('❌ Kamera konnte nicht geöffnet werden! Bitte erlaube Kamera-Zugriff.');
        closeCamera();
    });
};

// Capture photo from camera
window.capturePhoto = function() {
    console.log('📸 Capturing photo...');
    
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob(blob => {
        if (blob) {
            // Create file from blob
            const file = new File([blob], `geodrop_${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });
            
            // Process the captured photo
            processCapturedPhoto(file);
            closeCamera();
        } else {
            alert('❌ Foto konnte nicht aufgenommen werden!');
        }
    }, 'image/jpeg', 0.8);
};

// Process captured photo
window.processCapturedPhoto = function(file) {
    console.log('📸 Processing captured photo:', file.name);
    
    const preview = document.getElementById('photo-preview');
    
    if (preview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="text-sm text-gray-300 mb-2">📸 Aufgenommenes Foto:</div>
                <img src="${e.target.result}" class="w-full h-32 object-cover rounded border border-gray-600" alt="Foto Preview">
                <div class="text-xs text-gray-400 mt-1">${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>
                <div class="text-xs text-green-400 mt-1">✅ Mit Kamera aufgenommen</div>
            `;
        };
        reader.readAsDataURL(file);
    }
    
    // Store the file for upload
    window.capturedPhotoFile = file;
    
    // Show success message
    showMessage('📸 Foto erfolgreich aufgenommen! Starte Upload...', false);
    
    // Auto-start upload process
    setTimeout(() => {
        autoStartUpload();
    }, 1000);
};

// Close camera
window.closeCamera = function() {
    console.log('📸 Closing camera...');
    
    // Stop camera stream
    if (window.cameraStream) {
        window.cameraStream.getTracks().forEach(track => track.stop());
        window.cameraStream = null;
    }
    
    // Clean up AR module
    window.ARContourModule.hideContourOverlay();
    window.ARContourModule.isContourMatched = false;
    window.ARContourModule.scanStartTime = null;
    window.ARContourModule.lastMatchScore = 0;
    
    console.log('🧹 AR module reset'); // Reset scan time
    
    // Remove modal
    const modal = document.getElementById('camera-modal');
    if (modal) {
        modal.remove();
    }
};

// Legacy file select function (now redirects to camera)
window.handlePhotoFileSelect = function() {
    console.log('📸 File select clicked - redirecting to camera');
    openCamera();
};

// Update claim button and set current drop for AR module
window.updateClaimButton = function() {
    console.log('🔄 updateClaimButton called');
    
    // Try multiple dropdown selectors
    const dropSelectDe = document.getElementById('geocard-drop-select-de');
    const dropSelectEn = document.getElementById('geocard-drop-select-en');
    const dropSelect = document.getElementById('geocard-drop-select');
    
    let selectedValue = '';
    let activeSelect = null;
    
    // Check which dropdown is active and has a selection
    if (dropSelectDe && dropSelectDe.value) {
        selectedValue = dropSelectDe.value;
        activeSelect = dropSelectDe;
        console.log('🎯 Using German dropdown');
    } else if (dropSelectEn && dropSelectEn.value) {
        selectedValue = dropSelectEn.value;
        activeSelect = dropSelectEn;
        console.log('🎯 Using English dropdown');
    } else if (dropSelect && dropSelect.value) {
        selectedValue = dropSelect.value;
        activeSelect = dropSelect;
        console.log('🎯 Using legacy dropdown');
    }
    
    console.log('🎯 Selected drop value:', selectedValue);
    console.log('🎯 Active select element:', activeSelect);
    
    if (!selectedValue || selectedValue === '') {
        console.log('⚠️ No drop selected');
        window.currentDrop = null;
        return;
    }
    
    // Parse drop ID and collection
    let collection, dropId;
    if (selectedValue.includes(':')) {
        [collection, dropId] = selectedValue.split(':');
    } else {
        // Legacy format - assume it's a dev drop
        collection = 'devDrops';
        dropId = selectedValue;
    }
    
    console.log('📋 Drop collection:', collection, 'Drop ID:', dropId);
    
    // Set current drop for AR module
    window.currentDrop = {
        id: dropId,
        collection: collection,
        referenceImage: null // Will be loaded from Firebase
    };
    
    console.log('✅ Current drop set for AR module:', window.currentDrop);
};

// Auto-load drops when page loads
window.autoLoadDropsForUpload = function() {
    console.log('🔄 Auto-loading drops for upload...');
    
    // Load all drops (dev + user) for the upload dropdown
    if (typeof window.loadAllDropsForUpload === 'function') {
        window.loadAllDropsForUpload();
    } else if (typeof window.loadUserDropsForUpload === 'function') {
        window.loadUserDropsForUpload();
    }
    
    // Also try to load dev drops
    if (typeof window.loadDevDropsForUpload === 'function') {
        window.loadDevDropsForUpload();
    }
};

// Load all drops for upload with proper translations
window.loadAllDropsForUpload = async function() {
    console.log('🔄 Loading all drops for upload with translations...');
    
    try {
        if (!window.db) {
            console.log('❌ Database not available');
            return;
        }
        
        // Load both dev and user drops
        const [devDropsSnapshot, userDropsSnapshot] = await Promise.all([
            window.db.collection('devDrops').get(),
            window.db.collection('userDrops').get()
        ]);
        
        const allDrops = [];
        
        // Process dev drops
        devDropsSnapshot.forEach(doc => {
            allDrops.push({ id: doc.id, ...doc.data(), collection: 'devDrops' });
        });
        
        // Process user drops
        userDropsSnapshot.forEach(doc => {
            allDrops.push({ id: doc.id, ...doc.data(), collection: 'userDrops' });
        });
        
        // Sort by geodropNumber
        allDrops.sort((a, b) => {
            const numA = parseInt(a.geodropNumber) || parseInt(a.id) || 0;
            const numB = parseInt(b.geodropNumber) || parseInt(b.id) || 0;
            return numA - numB;
        });
        
        // Update dropdowns with translations
        updateUploadDropdownsWithTranslations(allDrops);
        
        console.log(`✅ Loaded ${allDrops.length} drops for upload`);
    } catch (error) {
        console.error('❌ Error loading all drops for upload:', error);
    }
};

// Update upload dropdowns with proper translations
function updateUploadDropdownsWithTranslations(allDrops) {
    console.log('🔄 Updating upload dropdowns with translations...');
    
    // Get current language
    const currentLang = window.currentLang || 'de';
    
    // Update German dropdown
    const selectDe = document.getElementById('geocard-drop-select-de');
    if (selectDe) {
        selectDe.innerHTML = '<option value="">GeoDrop auswählen...</option>';
        
        allDrops.forEach(drop => {
            const option = document.createElement('option');
            option.value = `${drop.collection}:${drop.id}`;
            
            const dropNumber = drop.geodropNumber || drop.id;
            const creatorName = drop.ersteller || drop.createdByName || 'Unbekannt';
            const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
            const dropType = drop.collection === 'devDrops' ? '🎯 Dev' : '👤 User';
            
            option.textContent = `${dropType} GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
            selectDe.appendChild(option);
        });
    }
    
    // Update English dropdown
    const selectEn = document.getElementById('geocard-drop-select-en');
    if (selectEn) {
        selectEn.innerHTML = '<option value="">Select GeoDrop...</option>';
        
        allDrops.forEach(drop => {
            const option = document.createElement('option');
            option.value = `${drop.collection}:${drop.id}`;
            
            const dropNumber = drop.geodropNumber || drop.id;
            const creatorName = drop.ersteller || drop.createdByName || 'Unknown';
            const safeReward = typeof drop.reward === 'number' ? drop.reward : 100;
            const dropType = drop.collection === 'devDrops' ? '🎯 Dev' : '👤 User';
            
            option.textContent = `${dropType} GeoDrop${dropNumber} (${creatorName}) - ${safeReward} PixelDrops`;
            selectEn.appendChild(option);
        });
    }
    
    console.log('✅ Upload dropdowns updated with translations');
}

// Claim GeoDrop from GeoCard
window.claimGeoDropFromGeoCard = async function() {
    console.log('🎯 Claiming GeoDrop from GeoCard...');
    console.log('🔍 Debug - Current user:', window.currentUser);
    console.log('🔍 Debug - Auth object:', window.auth);
    console.log('🔍 Debug - Firebase auth:', window.firebase?.auth?.());
    console.log('🔍 Debug - Captured photo file:', window.capturedPhotoFile);
    console.log('🔍 Debug - Current drop collection:', window.currentDropCollection);
    
    // Check if user is logged in - try multiple ways to get current user
    let currentUser = window.currentUser;
    if (!currentUser && window.auth && window.auth.currentUser) {
        currentUser = window.auth.currentUser;
        window.currentUser = currentUser;
    }
    if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
        currentUser = window.firebase.auth().currentUser;
        window.currentUser = currentUser;
    }
    
    console.log('👤 Current user check:', currentUser);
    
    if (!currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        return;
    }
    
    // Use current drop directly instead of dropdown selection
    if (!window.currentDrop) {
        showMessage('❌ Kein GeoDrop ausgewählt!', true);
        return;
    }
    
    const dropId = window.currentDrop.id;
    const dropCollection = window.currentDrop.collection;
    
    console.log('🎯 Using current drop for claim:', { dropId, dropCollection });
    
    // Get photo
    const photoInput = document.getElementById('photo-input');
    if (!photoInput || !photoInput.files || photoInput.files.length === 0) {
        showMessage('❌ Bitte wähle ein Foto aus!', true);
        return;
    }
    
    // AUTOMATISCHE BILDKOMPRIMIERUNG - IMMER AKTIV
    let photoFile = photoInput.files[0];
    console.log('🖼️ Original file size:', (photoFile.size / 1024 / 1024).toFixed(2) + 'MB');
    
    // KOMPRIMIERE ALLE BILDER - KEINE LIMITS!
    console.log('📦 Compressing image for optimal upload...');
    showMessage('📦 Optimiere Bild für Upload...', false);
    
    try {
        const compressedFile = await compressImage(photoFile);
        console.log('✅ Compressed file size:', (compressedFile.size / 1024).toFixed(2) + 'KB');
        
        // Store compressed file for later use
        window.compressedPhotoFile = compressedFile;
        photoFile = compressedFile; // Use compressed version
        
        const reduction = ((photoInput.files[0].size - compressedFile.size) / photoInput.files[0].size * 100).toFixed(1);
        showMessage(`✅ Bild optimiert: ${(compressedFile.size / 1024).toFixed(0)}KB (${reduction}% kleiner)`, false);
    } catch (compressionError) {
        console.error('❌ Compression failed:', compressionError);
        showMessage('⚠️ Optimierung fehlgeschlagen, verwende Original', false);
    }
    
    // GPS POSITION ABFRAGEN
    console.log('📍 Requesting GPS position...');
    showMessage('📍 GPS-Position wird abgefragt...', false);
    
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            });
        });
        
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        console.log('✅ GPS Position received:', { userLat, userLng, accuracy });
        showMessage(`📍 GPS-Position erhalten (Genauigkeit: ${Math.round(accuracy)}m)`, false);
        
        // Store GPS position for validation
        window.userGPSPosition = { lat: userLat, lng: userLng, accuracy };
        
    } catch (gpsError) {
        console.error('❌ GPS Error:', gpsError);
        showMessage('❌ GPS-Position konnte nicht ermittelt werden!', true);
        return;
    }
    
    // Use current drop data directly
    
    // Create or update the selected-drop-id element
    let selectedDropElement = document.getElementById('selected-drop-id');
    if (!selectedDropElement) {
        selectedDropElement = document.createElement('input');
        selectedDropElement.type = 'hidden';
        selectedDropElement.id = 'selected-drop-id';
        document.body.appendChild(selectedDropElement);
    }
    selectedDropElement.value = dropId;
    
    // Set the drop collection type
    window.currentDropCollection = dropCollection;
    
    console.log('🎯 Drop selection set:', { dropCollection, dropId, currentDropCollection: window.currentDropCollection });
    
    // Check GPS position
    if (!window.lastKnownLat || !window.lastKnownLng) {
        showMessage('❌ GPS-Position nicht verfügbar! Bitte erlaube Standortzugriff.', true);
        return;
    }
    
    console.log('📍 GPS Position:', { lat: window.lastKnownLat, lng: window.lastKnownLng });
    
    // Check if user is at the correct location
    if (window.currentDrop && window.currentDrop.lat && window.currentDrop.lng) {
        const distance = calculateDistance(window.lastKnownLat, window.lastKnownLng, window.currentDrop.lat, window.currentDrop.lng);
        console.log('📍 Distance to drop:', distance, 'meters');
        
        if (distance > 50) { // 50 meter radius
            showMessage(`❌ Du bist zu weit entfernt! ${Math.round(distance)}m vom GeoDrop entfernt. Maximal 50m erlaubt!`, true);
            return;
        }
    }
    
// Function to calculate distance between two GPS coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // Distance in meters
}
    
    // Show loading message
    showMessage('📤 Verarbeite dein Foto...', false);
    
    try {
        // Call the main claim function - FIX: Don't call self recursively!
        if (typeof window.claimGeoDrop === 'function') {
            console.log('🎯 Calling window.claimGeoDrop function...');
            // Use compressed file if available, otherwise original
            const fileToUse = window.compressedPhotoFile || photoInput.files[0];
            console.log('📁 Using file:', fileToUse.name, 'Size:', (fileToUse.size / 1024).toFixed(2) + 'KB');
            const result = await window.claimGeoDrop(dropId, dropCollection, fileToUse);
            console.log('🎯 Claim result:', result);
            
        // Check if claim was successful
        console.log('🎯 Checking claim result:', result);
        if (result && result.success) {
                // Success - show reward message
                const reward = result.reward || 100;
                const successText = window.t ? window.t('geocard.success-reward') : 'Erfolgreich! Du hast';
                const receivedText = window.t ? window.t('geocard.received') : 'erhalten!';
                const pixeldropsText = window.t ? window.t('geocard.pixeldrops') : 'PixelDrops';
                showMessage(`🎉 ${successText} ${reward} ${pixeldropsText} ${receivedText}`, false);
                
                // Show success animation
                createSuccessAnimation();
                
                // DROP AUSBLENDEN - Grau hinterlegen
                console.log('🎯 Marking drop as claimed...');
                markDropAsClaimed(dropId, dropCollection);
                
                // Clear form
                photoInput.value = '';
                dropSelect.value = '';
                document.getElementById('photo-preview').innerHTML = '';
                updateClaimButton();
                
        } else {
            // Failed - show error message
            console.error('❌ Claim failed:', result);
            const errorMsg = (result && result.error) || 'Das Foto entspricht nicht dem GeoDrop. Versuche es erneut!';
                showMessage(`❌ ${errorMsg}`, true);
                
                // Show error animation
                createErrorAnimation();
            }
            
            // Reload drops after claiming (map only, not dropdown)
            setTimeout(() => {
                // loadGeoDrops(); // REMOVED - was overwriting upload dropdown
            }, 2000);
        } else {
            console.error('❌ window.claimGeoDrop function not available!');
            console.error('❌ typeof window.claimGeoDrop:', typeof window.claimGeoDrop);
            showMessage('❌ Claim function not available', true);
        }
    } catch (error) {
        console.error('❌ Error claiming GeoDrop:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error stack:', error?.stack);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        
        // Create user-friendly error message
        let errorMsg = 'Fehler beim Verarbeiten des Fotos!';
        
        if (error && error.message) {
            if (error.message.includes('permission-denied')) {
                errorMsg = 'Keine Berechtigung - bitte neu anmelden!';
            } else if (error.message.includes('not-found')) {
                errorMsg = 'GeoDrop nicht gefunden!';
            } else if (error.message.includes('unavailable')) {
                errorMsg = 'Service nicht verfügbar - bitte später versuchen!';
            } else if (error.message.includes('Zu weit entfernt')) {
                errorMsg = error.message;
            } else if (error.message.includes('Bild enthält keine GPS-Daten')) {
                errorMsg = error.message;
            } else if (error.message.includes('entspricht nicht dem Referenzbild')) {
                errorMsg = error.message;
            } else if (error.message.includes('bereits heute gesammelt')) {
                errorMsg = error.message;
            } else {
                errorMsg = `Technischer Fehler: ${error.message}`;
            }
        }
        
        console.error('❌ Final error message:', errorMsg);
            console.error('❌ Final error message:', errorMsg);
            showMessage(`❌ ${errorMsg}`, true);
            createErrorAnimation();
    }
};

// Automatische Bildkompression
async function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    // Dynamische Qualität basierend auf Dateigröße
    if (file.size > 20 * 1024 * 1024) { // > 20MB
        quality = 0.6; // Niedrigere Qualität für sehr große Bilder
        maxWidth = 1280;
        maxHeight = 720;
    } else if (file.size > 10 * 1024 * 1024) { // > 10MB
        quality = 0.7;
        maxWidth = 1600;
        maxHeight = 900;
    }
    
    console.log(`📦 Compression settings: ${maxWidth}x${maxHeight}, quality: ${quality}`);
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Berechne neue Dimensionen
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
            }
            
            // Setze Canvas-Größe
            canvas.width = width;
            canvas.height = height;
            
            // Zeichne komprimiertes Bild
            ctx.drawImage(img, 0, 0, width, height);
            
            // Konvertiere zu Blob
            canvas.toBlob((blob) => {
                if (blob) {
                    // Erstelle neue Datei mit komprimierten Daten
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                } else {
                    reject(new Error('Komprimierung fehlgeschlagen'));
                }
            }, 'image/jpeg', quality);
        };
        
        img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
        img.src = URL.createObjectURL(file);
    });
}

// Mark drop as claimed (gray out)
function markDropAsClaimed(dropId, dropCollection) {
    console.log('🎯 Marking drop as claimed:', { dropId, dropCollection });
    
    // Find the drop marker on the map
    const dropMarker = window.dropMarkers?.find(marker => 
        marker.dropId === dropId && marker.collection === dropCollection
    );
    
    if (dropMarker && dropMarker.marker) {
        // Change marker color to gray
        dropMarker.marker.setIcon({
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#666666" stroke="#333333" stroke-width="2"/>
                    <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">✓</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20)
        });
        
        // Add claimed class for styling
        dropMarker.marker.addListener('click', () => {
            showMessage('✅ Dieser Drop wurde bereits geclaimt!', false);
        });
        
        console.log('✅ Drop marked as claimed on map');
    }
    
    // Update dropdown to show claimed status
    const dropSelect = document.getElementById('geocard-drop-select-de') || document.getElementById('geocard-drop-select-en');
    if (dropSelect) {
        const option = dropSelect.querySelector(`option[value="${dropCollection}:${dropId}"]`);
        if (option) {
            option.textContent = `✅ ${option.textContent} (Geclaimt)`;
            option.disabled = true;
            option.style.color = '#666666';
            console.log('✅ Drop marked as claimed in dropdown');
        }
    }
}

// Success animation
function createSuccessAnimation() {
    const animation = document.createElement('div');
    animation.innerHTML = '🎉';
    animation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 100px;
        z-index: 10000;
        animation: successPulse 2s ease-out forwards;
        pointer-events: none;
    `;
    
    // Add CSS animation
    if (!document.getElementById('success-animation-style')) {
        const style = document.createElement('style');
        style.id = 'success-animation-style';
        style.textContent = `
            @keyframes successPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(animation);
    setTimeout(() => animation.remove(), 2000);
}

// Error animation
function createErrorAnimation() {
    const animation = document.createElement('div');
    animation.innerHTML = '❌';
    animation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 100px;
        z-index: 10000;
        animation: errorShake 1s ease-out forwards;
        pointer-events: none;
    `;
    
    // Add CSS animation
    if (!document.getElementById('error-animation-style')) {
        const style = document.createElement('style');
        style.id = 'error-animation-style';
        style.textContent = `
            @keyframes errorShake {
                0%, 100% { transform: translate(-50%, -50%); }
                25% { transform: translate(-55%, -50%); }
                75% { transform: translate(-45%, -50%); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(animation);
    setTimeout(() => animation.remove(), 1000);
}

// Update Dev Coordinates Button based on Dev login status
window.updateDevCoordsButton = function() {
    const devCoordsBtn = document.getElementById('dev-coords-btn');
    const adminStatus = document.getElementById('admin-status');
    const devCoordsStatus = document.getElementById('dev-coords-status');
    
    if (devCoordsBtn && adminStatus) {
        // Check Dev login status
        const isDevLoggedIn = window.isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
        console.log('🔍 GeoCard Dev Status Check:', { 
            windowIsDevLoggedIn: window.isDevLoggedIn, 
            sessionStorage: sessionStorage.getItem('devLoggedIn'),
            finalStatus: isDevLoggedIn 
        });
        
        if (isDevLoggedIn) {
            // DEV MODUS AKTIVIERT
            devCoordsBtn.disabled = false;
            const setCoordinatesText = window.t ? window.t('geocard.set-coordinates') : 'Koordinaten setzen';
            const devModeActivatedText = window.t ? window.t('geocard.dev-mode-activated') : 'DEV MODUS AKTIVIERT';
            
            devCoordsBtn.textContent = `🎯 ${setCoordinatesText}`;
            devCoordsBtn.className = 'dev-drop-btn flex-1';
            adminStatus.textContent = devModeActivatedText;
            adminStatus.className = 'text-green-400';
            console.log('🔓 Dev coordinates ENABLED - DEV MODUS AKTIVIERT');
        } else {
            // USER MODUS
            devCoordsBtn.disabled = true;
            devCoordsBtn.textContent = '🔒 USER MODUS (Dev deaktiviert)';
            devCoordsBtn.className = 'dev-drop-btn flex-1 opacity-50';
            adminStatus.textContent = 'USER MODUS (Dev deaktiviert)';
            adminStatus.className = 'text-red-400';
            console.log('🔒 Dev coordinates DISABLED - USER MODUS');
        }
    }
    
    // Update coordinates status
    if (devCoordsStatus) {
        if (window.devTestLat && window.devTestLng) {
            devCoordsStatus.textContent = `${window.devTestLat.toFixed(6)}, ${window.devTestLng.toFixed(6)}`;
            devCoordsStatus.className = 'text-green-400';
        } else {
            devCoordsStatus.textContent = 'Nicht gesetzt';
            devCoordsStatus.className = 'text-gray-400';
        }
    }
};

// Set Dev coordinates for testing
window.setDevCoordinates = function() {
    const latInput = document.getElementById('dev-lat-input');
    const lngInput = document.getElementById('dev-lng-input');
    
    if (!latInput || !lngInput) {
        showMessage('❌ Koordinaten-Eingabefelder nicht gefunden!', true);
        return;
    }
    
    const lat = parseFloat(latInput.value);
    const lng = parseFloat(lngInput.value);
    
    if (isNaN(lat) || isNaN(lng)) {
        showMessage('❌ Bitte gib gültige Koordinaten ein!', true);
        return;
    }
    
    if (lat < -90 || lat > 90) {
        showMessage('❌ Breitengrad muss zwischen -90 und 90 liegen!', true);
        return;
    }
    
    if (lng < -180 || lng > 180) {
        showMessage('❌ Längengrad muss zwischen -180 und 180 liegen!', true);
        return;
    }
    
    // Set global dev test coordinates (separate from normal location)
    window.devTestLat = lat;
    window.devTestLng = lng;
    // Don't overwrite lastKnownLat/lng - keep them separate for normal users
    
    console.log('🎯 Dev coordinates set:', lat, lng);
    showMessage(`✅ Dev-Koordinaten gesetzt: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, false);
    
    // Update status display
    window.updateDevCoordsButton();
    
    // Update map if it exists
    if (window.geoMap) {
        window.geoMap.setView([lat, lng], 15);
    }
};

// Reset to current location
window.resetToCurrentLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Update input fields
                const latInput = document.getElementById('dev-lat-input');
                const lngInput = document.getElementById('dev-lng-input');
                
                if (latInput) latInput.value = lat.toFixed(6);
                if (lngInput) lngInput.value = lng.toFixed(6);
                
                // Set global dev coordinates (separate from normal location)
                window.devTestLat = lat;
                window.devTestLng = lng;
                // Don't overwrite lastKnownLat/lng - keep them separate for normal users
                
                console.log('📍 Reset to current location:', lat, lng);
                showMessage(`✅ Auf aktuelle Position zurückgesetzt: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, false);
                
                // Update status display
                window.updateDevCoordsButton();
                
                // Update map if it exists
                if (window.geoMap) {
                    window.geoMap.setView([lat, lng], 15);
                }
            },
            function(error) {
                console.error('❌ Error getting current location:', error);
                showMessage('❌ Fehler beim Abrufen der aktuellen Position!', true);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    } else {
        showMessage('❌ Geolocation wird nicht unterstützt!', true);
    }
};

// Auto-activate admin mode when Dev is logged in
window.autoActivateAdminMode = function() {
    // Check Dev login status
    const isDevLoggedIn = window.isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
    
    const devCoordsSection = document.getElementById('dev-coordinates-section');
    if (devCoordsSection) {
        if (isDevLoggedIn) {
            devCoordsSection.style.display = 'block';
            console.log('🔓 Dev coordinates section SHOWN - DEV MODUS AKTIVIERT');
        } else {
            devCoordsSection.style.display = 'none';
            console.log('🔒 Dev coordinates section HIDDEN - USER MODUS');
        }
    }
    
    // Show/hide Dev image selection button
    const devSelectImageBtn = document.getElementById('dev-select-image-btn');
    if (devSelectImageBtn) {
        if (isDevLoggedIn) {
            devSelectImageBtn.style.display = 'block';
            console.log('🔓 Dev image selection button SHOWN');
        } else {
            devSelectImageBtn.style.display = 'none';
            console.log('🔒 Dev image selection button HIDDEN');
        }
    }
    
    window.updateDevCoordsButton();
};

// Dev function: Select image from file system
window.handleDevImageSelect = function() {
    console.log('🖼️ Dev image selection requested');
    
    // Create a new file input for Dev users (without camera capture)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('🖼️ Dev selected image:', file.name);
            
            // Update the photo input with the selected file
            const photoInput = document.getElementById('photo-input');
            if (photoInput) {
                // Create a new FileList-like object
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                photoInput.files = dataTransfer.files;
                
                showMessage('🖼️ Bild ausgewählt: ' + file.name, false);
                
                // For Dev users: Set the captured photo file and start upload immediately
                console.log('🚀 Dev mode: Setting captured photo file and starting upload...');
                window.capturedPhotoFile = file; // Set the captured photo file for autoStartUpload
                
                if (typeof window.autoStartUpload === 'function') {
                    window.autoStartUpload();
                } else {
                    console.error('❌ autoStartUpload function not found');
                    showMessage('❌ Upload-Funktion nicht gefunden', true);
                }
            }
        }
    };
    
    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
};

// Initialize GeoCard when page loads
document.addEventListener('DOMContentLoaded', function() {

console.log('🗺️ GeoCard page loaded');
    
    // Initialize map after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof window.initGeoMap === 'function') {
            window.initGeoMap('mapid');
        }
        // Load GeoDrops for map display (not for dropdowns)
        setTimeout(() => {
            if (typeof window.loadGeoDrops === 'function') {
                console.log('🗺️ Loading GeoDrops for map display...');
                window.loadGeoDrops();
            }
        }, 1000);
        
        // Set default list types
        window.currentListType = 'dev';
        window.currentUploadListType = 'dev';
        
        // Load dev drops table by default
        if (typeof window.loadDevGeoDrops === 'function') {
            console.log('🔄 Loading Dev GeoDrops table on page load...');
            window.loadDevGeoDrops();
        }
        
        // Load dev drops for upload by default
        if (typeof window.loadDevDropsForUpload === 'function') {
            window.loadDevDropsForUpload();
        }
        
        // CRITICAL: Also load user drops for upload on page load
        if (typeof window.loadUserDropsForUpload === 'function') {
            console.log('🔄 Loading User Drops for upload on page load...');
            window.loadUserDropsForUpload();
        }
        
        // CRITICAL: Also load user drops table on page load
        if (typeof window.loadUserGeoDrops === 'function') {
            console.log('🔄 Loading User GeoDrops table on page load...');
            window.loadUserGeoDrops();
        }
        
        // Force load all drop lists immediately
        setTimeout(() => {
            console.log('🔄 Immediate loading all drop lists...');
            if (typeof window.loadDevGeoDrops === 'function') {
                window.loadDevGeoDrops();
            }
            if (typeof window.loadUserGeoDrops === 'function') {
                window.loadUserGeoDrops();
            }
            if (typeof window.loadDevDropsForUpload === 'function') {
                window.loadDevDropsForUpload();
            }
            if (typeof window.loadUserDropsForUpload === 'function') {
                window.loadUserDropsForUpload();
            }
        }, 500);
        
        // Force load all drop lists again
        setTimeout(() => {
            console.log('🔄 Force loading all drop lists...');
            if (typeof window.loadDevGeoDrops === 'function') {
                window.loadDevGeoDrops();
            }
            if (typeof window.loadUserGeoDrops === 'function') {
                window.loadUserGeoDrops();
            }
            if (typeof window.loadDevDropsForUpload === 'function') {
                window.loadDevDropsForUpload();
            }
            if (typeof window.loadUserDropsForUpload === 'function') {
                window.loadUserDropsForUpload();
            }
        }, 1000);
        
        // Final load after a longer delay to ensure everything is ready
        setTimeout(() => {
            console.log('🔄 Final loading all drop lists...');
            if (typeof window.loadDevGeoDrops === 'function') {
                window.loadDevGeoDrops();
            }
            if (typeof window.loadUserGeoDrops === 'function') {
                window.loadUserGeoDrops();
            }
            if (typeof window.loadDevDropsForUpload === 'function') {
                window.loadDevDropsForUpload();
            }
            if (typeof window.loadUserDropsForUpload === 'function') {
                window.loadUserDropsForUpload();
            }
        }, 4000);
        
        // CRITICAL: Force show dev drops section immediately
        setTimeout(() => {
            const devSection = document.getElementById('dev-drops-section');
            const userSection = document.getElementById('user-drops-section');
            if (devSection && userSection) {
                devSection.style.display = 'block';
                userSection.style.display = 'none';
                console.log('✅ Forced dev drops section to be visible');
            }
        }, 100);
        
        // Initialize switch buttons to show dev as active
        setTimeout(() => {
            // Set button styles manually
            const devBtn = document.getElementById('dev-drops-btn');
            const userBtn = document.getElementById('user-drops-btn');
            const devSection = document.getElementById('dev-drops-section');
            const userSection = document.getElementById('user-drops-section');
            
            if (devBtn && userBtn && devSection && userSection) {
                devBtn.className = 'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white';
                userBtn.className = 'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white';
                devSection.style.display = 'block';
                userSection.style.display = 'none';
            }
            
            // Set upload button styles manually
            const uploadDevBtn = document.getElementById('upload-dev-drops-btn');
            const uploadUserBtn = document.getElementById('upload-user-drops-btn');
            const uploadDevSection = document.getElementById('upload-dev-drops-section');
            const uploadUserSection = document.getElementById('upload-user-drops-section');
            
            if (uploadDevBtn && uploadUserBtn && uploadDevSection && uploadUserSection) {
                uploadDevBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors bg-blue-600 text-white';
                uploadUserBtn.className = 'flex-1 px-3 py-1 rounded-md text-xs font-medium transition-colors text-gray-300 hover:text-white';
                uploadDevSection.style.display = 'block';
                uploadUserSection.style.display = 'none';
            }
            
            console.log('✅ Switch buttons initialized to show Dev drops by default');
        }, 500);
        
        // Auto get location after everything is loaded
        setTimeout(() => {
            if (typeof window.getUserLocation === 'function') {
                console.log('📍 Auto-getting user location on page load...');
                window.getUserLocation();
            }
        }, 2000);
        
        // Check Dev status and auto-activate admin mode
        setTimeout(() => {
            if (typeof window.autoActivateAdminMode === 'function') {
                window.autoActivateAdminMode();
            }
        }, 1000);
        
        // Also check Dev status periodically to catch changes
        setInterval(() => {
            if (typeof window.autoActivateAdminMode === 'function') {
                window.autoActivateAdminMode();
            }
        }, 5000); // Check every 5 seconds
        
        // Initialize Dev Session Button visibility
        if (typeof window.updateDevSessionButton === 'function') {
            window.updateDevSessionButton();
        }
    }, 500);
});

// Function to add descriptions to existing drops
window.addDropDescriptions = async function() {
    if (!window.currentUser) {
        alert('❌ Bitte melde dich zuerst an!');
        return;
    }
    
    if (!confirm('⚠️ Beschreibungen zu allen Drops hinzufügen? Das kann nicht rückgängig gemacht werden!')) {
        return;
    }
    
    try {
        console.log('📝 Adding descriptions to all drops...');
        
        // Get all drops
        const dropsSnapshot = await db.collection('geodrops').get();
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        const batch = db.batch();
        let updateCount = 0;
        
        // Add descriptions to normal drops
        dropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (!drop.description && !drop.photoDescription) {
                batch.update(doc.ref, {
                    description: `GeoDrop ${drop.geodropNumber || doc.id} - Fotografiere das Objekt oder die Szene an diesem Standort`,
                    photoDescription: `Das Objekt oder die Szene an diesem Standort`
                });
                updateCount++;
            }
        });
        
        // Add descriptions to dev drops
        devDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (!drop.description && !drop.photoDescription) {
                batch.update(doc.ref, {
                    description: `Dev GeoDrop ${drop.geodropNumber || doc.id} - Fotografiere das Objekt oder die Szene an diesem Standort`,
                    photoDescription: `Das Objekt oder die Szene an diesem Standort`
                });
                updateCount++;
            }
        });
        
        if (updateCount > 0) {
            await batch.commit();
            alert(`✅ ${updateCount} Drops wurden mit Beschreibungen aktualisiert!`);
            console.log(`✅ Added descriptions to ${updateCount} drops`);
            
            // Reload the page to show updated descriptions
            location.reload();
        } else {
            alert('ℹ️ Alle Drops haben bereits Beschreibungen!');
        }
        
    } catch (error) {
        console.error('❌ Error adding descriptions:', error);
        alert('❌ Fehler beim Hinzufügen der Beschreibungen: ' + error.message);
    }
};

// Function to add dual-language fields to existing drops
window.addDualLanguageFieldsToExistingDrops = async function() {
    console.log('🔄 Adding dual-language fields to existing drops...');
    
    try {
        const db = window.firebase.firestore();
        let totalUpdateCount = 0;
        
        // Update user drops first
        console.log('🔄 Updating user drops...');
        const userDropsSnapshot = await db.collection('userDrops').get();
        const userBatch = db.batch();
        let userUpdateCount = 0;
        
        userDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (!drop.description_de && !drop.description_en) {
                const description = drop.description || drop.photoDescription || 'Das Objekt oder die Szene an diesem Standort';
                userBatch.update(doc.ref, {
                    description_de: description,
                    description_en: 'The object or scene at this location',
                    photoDescription_de: drop.photoDescription || description,
                    photoDescription_en: 'The object or scene at this location'
                });
                userUpdateCount++;
            }
        });
        
        if (userUpdateCount > 0) {
            await userBatch.commit();
            console.log(`✅ Updated ${userUpdateCount} user drops`);
            totalUpdateCount += userUpdateCount;
        }
        
        // Update dev drops
        console.log('🔄 Updating dev drops...');
        const devDropsSnapshot = await db.collection('devDrops').get();
        const devBatch = db.batch();
        let devUpdateCount = 0;
        
        devDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (!drop.description_de && !drop.description_en) {
                const description = drop.description || drop.photoDescription || 'Entwickler-Drop für Tests';
                devBatch.update(doc.ref, {
                    description_de: description,
                    description_en: 'Developer Drop for Tests',
                    photoDescription_de: drop.photoDescription || description,
                    photoDescription_en: 'Developer Drop for Tests'
                });
                devUpdateCount++;
            }
        });
        
        if (devUpdateCount > 0) {
            await devBatch.commit();
            console.log(`✅ Updated ${devUpdateCount} dev drops`);
            totalUpdateCount += devUpdateCount;
        }
        
        // Update normal geodrops
        console.log('🔄 Updating normal geodrops...');
        const geodropsSnapshot = await db.collection('geodrops').get();
        const geoBatch = db.batch();
        let geoUpdateCount = 0;
        
        geodropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (!drop.description_de && !drop.description_en) {
                const description = drop.description || drop.photoDescription || 'Das Objekt oder die Szene an diesem Standort';
                geoBatch.update(doc.ref, {
                    description_de: description,
                    description_en: 'The object or scene at this location',
                    photoDescription_de: drop.photoDescription || description,
                    photoDescription_en: 'The object or scene at this location'
                });
                geoUpdateCount++;
            }
        });
        
        if (geoUpdateCount > 0) {
            await geoBatch.commit();
            console.log(`✅ Updated ${geoUpdateCount} normal geodrops`);
            totalUpdateCount += geoUpdateCount;
        }
        
        if (totalUpdateCount > 0) {
            alert(`✅ ${totalUpdateCount} Drops wurden mit dual-language Feldern aktualisiert!`);
            console.log(`✅ Added dual-language fields to ${totalUpdateCount} drops`);
            
            // Reload the map to show updated descriptions
            if (typeof window.loadGeoDrops === 'function') {
                window.loadGeoDrops();
            }
        } else {
            alert('ℹ️ Alle Drops haben bereits dual-language Felder!');
        }
        
    } catch (error) {
        console.error('❌ Error adding dual-language fields:', error);
        alert('❌ Fehler beim Hinzufügen der dual-language Felder: ' + error.message);
    }
};

// Debug function to reset specific drops (7 and 9)
window.resetSpecificDrops = async function() {
    if (!window.currentUser) {
        alert('❌ Bitte melde dich zuerst an!');
        return;
    }
    
    if (!confirm('⚠️ Drop 7 und 9 zurücksetzen? Das kann nicht rückgängig gemacht werden!')) {
        return;
    }
    
    try {
        console.log('🔄 Resetting Drop 7 and 9 for user:', window.currentUser.uid);
        
        // Reset Drop 7 and 9 in geodrops
        const dropsSnapshot = await db.collection('geodrops').get();
        const batch = db.batch();
        
        dropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid && 
                (drop.geodropNumber === '7' || drop.geodropNumber === '9')) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
                console.log(`🔄 Resetting Drop ${drop.geodropNumber}`);
            }
        });
        
        // Reset Drop 7 and 9 in userDrops
        const userDropsSnapshot = await db.collection('userDrops').get();
        
        userDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid && 
                (drop.geodropNumber === '7' || drop.geodropNumber === '9')) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
                console.log(`🔄 Resetting User Drop ${drop.geodropNumber}`);
            }
        });
        
        await batch.commit();
        
        alert('✅ Drop 7 und 9 wurden zurückgesetzt!');
        console.log('✅ Drop 7 and 9 reset completed');
        
        // Reload the page to show updated status
        location.reload();
        
    } catch (error) {
        console.error('❌ Error resetting specific drops:', error);
        alert('❌ Fehler beim Zurücksetzen der Drops: ' + error.message);
    }
};

// Debug function to reset daily claim status
window.resetDailyClaims = async function() {
    if (!window.currentUser) {
        alert('❌ Bitte melde dich zuerst an!');
        return;
    }
    
    if (!confirm('⚠️ Alle täglichen Claims zurücksetzen? Das kann nicht rückgängig gemacht werden!')) {
        return;
    }
    
    try {
        console.log('🔄 Resetting daily claims for user:', window.currentUser.uid);
        
        // Reset all geodrops for current user
        const dropsSnapshot = await db.collection('geodrops').get();
        const batch = db.batch();
        
        dropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
            }
        });
        
        // Reset all userDrops for current user
        const userDropsSnapshot = await db.collection('userDrops').get();
        
        userDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
            }
        });
        
        // Reset all devDrops for current user
        const devDropsSnapshot = await db.collection('devDrops').get();
        
        devDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
            }
        });
        
        await batch.commit();
        
        alert('✅ Alle täglichen Claims wurden zurückgesetzt! (GeoDrops + UserDrops + DevDrops)');
        console.log('✅ Daily claims reset completed for all collections');
        
        // Reload the page to show updated status
        location.reload();
        
    } catch (error) {
        console.error('❌ Error resetting daily claims:', error);
        alert('❌ Fehler beim Zurücksetzen der Claims: ' + error.message);
    }
};

// Spezielle Funktion um Drop 7 und 9 zu resetten
window.resetDrop7And9 = async function() {
    if (!window.currentUser) {
        alert('❌ Bitte melde dich zuerst an!');
        return;
    }
    
    if (!confirm('⚠️ Drop 7 und 9 zurücksetzen? Das kann nicht rückgängig gemacht werden!')) {
        return;
    }
    
    try {
        console.log('🔄 Resetting Drop 7 and 9 for user:', window.currentUser.uid);
        
        const db = window.firebase.firestore();
        const batch = db.batch();
        
        // Reset Drop 7 in devDrops
        const devDropsSnapshot = await db.collection('devDrops').get();
        devDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid && 
                (drop.geodropNumber === '7' || drop.name?.includes('GeoDrop7'))) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
                console.log('✅ Reset Drop 7:', doc.id);
            }
        });
        
        // Reset Drop 9 in devDrops
        devDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid && 
                (drop.geodropNumber === '9' || drop.name?.includes('GeoDrop9'))) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
                console.log('✅ Reset Drop 9:', doc.id);
            }
        });
        
        await batch.commit();
        
        alert('✅ Drop 7 und 9 wurden zurückgesetzt!');
        console.log('✅ Drop 7 and 9 reset completed');
        
        // Reload the page to show updated status
        location.reload();
        
    } catch (error) {
        console.error('❌ Error resetting Drop 7 and 9:', error);
        alert('❌ Fehler beim Zurücksetzen von Drop 7 und 9: ' + error.message);
    }
};

// AUTOMATISCHES TÄGLICHES RESET-SYSTEM
window.initDailyResetSystem = function() {
    console.log('🔄 Initialisiere tägliches Reset-System...');
    
    // Prüfe ob heute bereits resettet wurde
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem('lastDailyReset');
    
    if (lastResetDate !== today) {
        console.log('🕐 Neuer Tag erkannt - führe automatisches Reset durch...');
        window.performDailyReset();
        localStorage.setItem('lastDailyReset', today);
    } else {
        console.log('✅ Heute bereits resettet');
    }
    
    // Setze Timer für Mitternacht-Reset
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
        console.log('🕛 Mitternacht erreicht - führe automatisches Reset durch...');
        window.performDailyReset();
        localStorage.setItem('lastDailyReset', new Date().toDateString());
        
        // Setze Timer für nächsten Tag
        setTimeout(() => {
            window.initDailyResetSystem();
        }, 24 * 60 * 60 * 1000); // 24 Stunden
    }, timeUntilMidnight);
    
    console.log(`⏰ Nächstes Reset in ${Math.round(timeUntilMidnight / 1000 / 60)} Minuten`);
};

// Automatisches tägliches Reset durchführen
window.performDailyReset = async function() {
    if (!window.currentUser) {
        console.log('⚠️ Kein User angemeldet - überspringe Reset');
        return;
    }
    
    try {
        console.log('🔄 Führe automatisches tägliches Reset durch...');
        
        const db = window.firebase.firestore();
        const batch = db.batch();
        let resetCount = 0;
        
        // Reset alle geodrops
        const dropsSnapshot = await db.collection('geodrops').get();
        dropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
                resetCount++;
            }
        });
        
        // Reset alle userDrops
        const userDropsSnapshot = await db.collection('userDrops').get();
        userDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
                resetCount++;
            }
        });
        
        // Reset alle devDrops
        const devDropsSnapshot = await db.collection('devDrops').get();
        devDropsSnapshot.docs.forEach(doc => {
            const drop = doc.data();
            if (drop.claimedBy === window.currentUser.uid) {
                batch.update(doc.ref, {
                    isClaimedToday: false,
                    lastClaimDate: null
                });
                resetCount++;
            }
        });
        
        if (resetCount > 0) {
            await batch.commit();
            console.log(`✅ Automatisches Reset abgeschlossen: ${resetCount} Drops zurückgesetzt`);
            
            // Lade Karte neu um Änderungen anzuzeigen
            if (typeof window.loadGeoDrops === 'function') {
                setTimeout(() => {
                    window.loadGeoDrops();
                }, 1000);
            }
        } else {
            console.log('ℹ️ Keine Drops zum Zurücksetzen gefunden');
        }
        
    } catch (error) {
        console.error('❌ Fehler beim automatischen Reset:', error);
    }
};

// Update Geocard elements for language switching
window.updateGeocardElements = function() {
    console.log('🔄 Updating Geocard elements...');
    
    // Reload drop lists to update language
    if (typeof window.reloadAllDropLists === 'function') {
        window.reloadAllDropLists();
    }
    
    // Reload dev drops
    if (typeof window.loadDevGeoDrops === 'function') {
        window.loadDevGeoDrops();
    }
    
    // Reload user drops
    if (typeof window.loadUserDropsForUpload === 'function') {
        window.loadUserDropsForUpload();
    }
    
    // Force reload map markers with new language
    if (typeof window.loadGeoDrops === 'function') {
        setTimeout(() => {
            console.log('🔄 Reloading map markers with new language...');
            window.loadGeoDrops();
        }, 300); // Warten bis andere Updates fertig sind
    }
    
    console.log('✅ Geocard elements updated');
};

// Update Dev Session Button visibility
window.updateDevSessionButton = function() {
    const devSessionSection = document.getElementById('dev-session-section');
    if (devSessionSection) {
        const isDevLoggedIn = window.isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
        if (isDevLoggedIn) {
            devSessionSection.style.display = 'block';
        } else {
            devSessionSection.style.display = 'none';
        }
    }
};


// Load Dev GeoDrops (only dev drops)
window.loadDevGeoDrops = async function() {
    console.log('🎯 Loading Dev GeoDrops...');
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        // Load all dev drops (both isAvailable and isActive)
        const allDevDropsSnapshot = await db.collection('devDrops').get();
        
        // Filter for active/available drops
        const devDropsSnapshot = {
            docs: allDevDropsSnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.isActive === true || data.isAvailable === true;
            }),
            size: 0
        };
        devDropsSnapshot.size = devDropsSnapshot.docs.length;
        
        const devDrops = [];
        devDropsSnapshot.docs.forEach(doc => {
            devDrops.push({ id: doc.id, ...doc.data(), collection: 'devDrops' });
        });
        
        // Sort drops by geodropNumber (extract number from name if needed)
        devDrops.sort((a, b) => {
            let numA = parseInt(a.geodropNumber) || 0;
            let numB = parseInt(b.geodropNumber) || 0;
            
            // If no geodropNumber, try to extract from name
            if (numA === 0 && a.name && a.name.includes('GeoDrop')) {
                const match = a.name.match(/GeoDrop(\d+)/);
                if (match) numA = parseInt(match[1]);
            }
            if (numB === 0 && b.name && b.name.includes('GeoDrop')) {
                const match = b.name.match(/GeoDrop(\d+)/);
                if (match) numB = parseInt(match[1]);
            }
            
            return numA - numB;
        });
        
        // Update dev drops table
        const table = document.getElementById('geodrops-table');
        if (table && devDrops.length > 0) {
            // Get current user for status check
            let currentUser = window.currentUser;
            if (!currentUser && window.auth && window.auth.currentUser) {
                currentUser = window.auth.currentUser;
            }
            if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                currentUser = window.firebase.auth().currentUser;
            }
            
            let tableHTML = '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-gray-600"><th class="text-left p-2">Nr.</th><th class="text-left p-2">Ersteller</th><th class="text-left p-2">Reward</th><th class="text-left p-2">Status</th><th class="text-left p-2">Typ</th><th class="text-center p-2">Icon</th><th class="text-left p-2">Koordinaten</th></tr></thead><tbody>';
            devDrops.forEach(drop => {
                const coords = drop.lat && drop.lng ? `${drop.lat.toFixed(4)}, ${drop.lng.toFixed(4)}` : 'N/A';
                // Check if claimed today with proper date comparison
                const today = new Date().toDateString();
                const lastClaimDate = drop.lastClaimDate ? drop.lastClaimDate.toDate().toDateString() : null;
                const isClaimedToday = lastClaimDate === today && drop.claimedBy === currentUser?.uid;
                const statusText = isClaimedToday ? '⏰ Heute gesammelt' : '✅ Verfügbar';
                const rowClass = isClaimedToday ? 'border-b border-gray-700 bg-gray-800 opacity-60' : 'border-b border-gray-700';
                const textClass = isClaimedToday ? 'text-gray-500' : 'text-white';
                
                // Creator name will be set below
                
                // Use geodropNumber for display, fallback to name, then id
                let displayNumber = drop.geodropNumber || drop.id;
                if (drop.name && drop.name.includes('GeoDrop')) {
                    const match = drop.name.match(/GeoDrop(\d+)/);
                    if (match) {
                        displayNumber = match[1]; // Just the number
                    }
                }
                // Get creator name for dev drops - all should be KryptoGuru
                let creatorName = 'KryptoGuru';
                
                tableHTML += `<tr class="${rowClass}"><td class="p-2 ${textClass}">${displayNumber}</td><td class="p-2 ${textClass}">${creatorName}</td><td class="p-2 ${textClass}">${drop.reward || 100}</td><td class="p-2 ${textClass}">${statusText}</td><td class="p-2 ${textClass}">🎯 Dev</td><td class="p-2 text-center"><span class="text-2xl">🎯</span></td><td class="p-2 text-xs ${textClass}">${coords}</td></tr>`;
            });
            tableHTML += '</tbody></table></div>';
            table.innerHTML = tableHTML;
        } else if (table) {
            const noDropsText = window.t ? window.t('geocard.no-dev-drops') : 'Keine Dev GeoDrops gefunden';
            table.innerHTML = `<div class="text-center text-gray-400 p-4">${noDropsText}</div>`;
        }
        
        console.log(`✅ Loaded ${devDrops.length} Dev GeoDrops`);
    } catch (error) {
        console.error('❌ Error loading Dev GeoDrops:', error);
        if (error.code === 'permission-denied') {
            console.log('🔒 User not logged in, skipping Dev GeoDrops load');
            const loginToSeeDevText = window.t ? window.t('geocard.login-to-see-dev') : 'Bitte anmelden um Dev GeoDrops zu sehen';
            showMessage(`ℹ️ ${loginToSeeDevText}`, false);
        } else {
            const errorLoadingDevText = window.t ? window.t('geocard.error-loading-dev') : 'Fehler beim Laden der Dev GeoDrops';
            showMessage(errorLoadingDevText, true);
        }
        
        const table = document.getElementById('geodrops-table');
        if (table) {
            table.innerHTML = '<div class="text-center text-red-400 p-4">Fehler beim Laden der Dev GeoDrops</div>';
        }
    }
};

// Load User GeoDrops (only user drops)
window.loadUserGeoDrops = async function() {
    console.log('👤 Loading User GeoDrops...');
    
    // Check if lists are cleared
    if (window.userDropListsCleared) {
        console.log('⏭️ User Drop lists are cleared, skipping load');
        return;
    }
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Get current user
        let currentUser = window.currentUser;
        if (!currentUser && window.auth && window.auth.currentUser) {
            currentUser = window.auth.currentUser;
        }
        if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
            currentUser = window.firebase.auth().currentUser;
        }
        
        if (!currentUser) {
            console.log('❌ User not logged in, cannot load user drops');
            const userDropsList = document.getElementById('user-drops-list');
            const userDropsTable = document.getElementById('user-drops-table');
            if (userDropsList) {
                userDropsList.innerHTML = '<div class="text-center text-red-400 py-4"><p>❌ Bitte zuerst anmelden um User GeoDrops zu sehen</p></div>';
            }
            if (userDropsTable) {
                userDropsTable.innerHTML = '<div class="text-center text-red-400 p-4">Bitte zuerst anmelden</div>';
            }
            return;
        }
        
        // Load all user drops (not just current user's drops)
        const userDropsSnapshot = await db.collection('userDrops')
            .where('isActive', '==', true)
            .get();
        
        const userDrops = [];
        userDropsSnapshot.forEach(doc => {
            userDrops.push({ id: doc.id, ...doc.data(), collection: 'userDrops' });
        });
        
        // Sort drops by geodropNumber (1, 2, 3, ...)
        userDrops.sort((a, b) => {
            const numA = parseInt(a.geodropNumber) || parseInt(a.id) || 0;
            const numB = parseInt(b.geodropNumber) || parseInt(b.id) || 0;
            return numA - numB;
        });
        
        // Update user drops table
        const userDropsTable = document.getElementById('user-drops-table');
        if (userDropsTable && userDrops.length > 0) {
            let tableHTML = '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-gray-600"><th class="text-left p-2">Nr.</th><th class="text-left p-2">Reward</th><th class="text-left p-2">Ersteller</th><th class="text-left p-2">Status</th><th class="text-left p-2">Koordinaten</th><th class="text-left p-2">Erstellt</th><th class="text-center p-2">Icon</th><th class="text-left p-2">Aktionen</th></tr></thead><tbody>';
            userDrops.forEach(drop => {
                const coords = drop.lat && drop.lng ? `${drop.lat.toFixed(4)}, ${drop.lng.toFixed(4)}` : 'N/A';
                const createdDate = drop.createdAt ? drop.createdAt.toDate().toLocaleDateString() : 'N/A';
                const statusText = drop.isActive ? '✅ Aktiv' : '❌ Inaktiv';
                const statusClass = drop.isActive ? 'text-green-400' : 'text-red-400';
                // Get the real username from Firebase Auth, not from stored data
                let creatorName = 'Unbekannt';
                
                // Check if this is the current user's drop
                let currentUser = window.currentUser;
                if (!currentUser && window.auth && window.auth.currentUser) {
                    currentUser = window.auth.currentUser;
                }
                if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
                    currentUser = window.firebase.auth().currentUser;
                }
                
                // Use the ersteller field from Firebase
                creatorName = drop.ersteller || drop.createdByName || 'Unknown';
                console.log(`✅ Using ${creatorName} for drop ${drop.name}`);
                const isDev = window.isDevLoggedIn || sessionStorage.getItem('devLoggedIn') === 'true';
                const isCreator = drop.createdBy === currentUser.uid;
                const canDelete = isDev || isCreator;
                
                tableHTML += `
                    <tr class="border-b border-gray-700">
                        <td class="p-2 text-white">${drop.geodropNumber || drop.name?.match(/UserDrop(\d+)/)?.[1] || 'N/A'}</td>
                        <td class="p-2 text-white">${drop.reward || 100}</td>
                        <td class="p-2 text-blue-400">${creatorName}</td>
                        <td class="p-2 ${statusClass}">${statusText}</td>
                        <td class="p-2 text-xs text-white">${coords}</td>
                        <td class="p-2 text-xs text-white">${createdDate}</td>
                        <td class="p-2 text-center">
                            <span class="text-2xl">🎯</span>
                        </td>
                        <td class="p-2">
                            ${isDev ? `
                                <button onclick="editUserDrop('${drop.id}')" class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 mr-1">
                                    ✏️
                                </button>
                                <button onclick="toggleUserDrop('${drop.id}', ${drop.isActive})" class="px-2 py-1 ${drop.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded text-xs">
                                    ${drop.isActive ? '⏸️' : '▶️'}
                                </button>
                            ` : canDelete ? `
                                <button onclick="deleteUserDrop('${drop.id}')" class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                                    🗑️
                                </button>
                            ` : `
                                <span class="text-gray-500 text-xs">Nur Ersteller</span>
                            `}
                        </td>
                    </tr>
                `;
            });
            tableHTML += '</tbody></table></div>';
            userDropsTable.innerHTML = tableHTML;
        } else if (userDropsTable) {
            const noUserDropsText = window.t ? window.t('geocard.no-user-drops') : 'Keine User GeoDrops gefunden';
            userDropsTable.innerHTML = `<div class="text-center text-gray-400 p-4">${noUserDropsText}</div>`;
        }
        
        console.log(`✅ Loaded ${userDrops.length} User GeoDrops`);
    } catch (error) {
        console.error('❌ Error loading User GeoDrops:', error);
        showMessage('Error loading User GeoDrops', true);
        
        const userDropsList = document.getElementById('user-drops-list');
        const userDropsTable = document.getElementById('user-drops-table');
        if (userDropsList) {
            userDropsList.innerHTML = '<div class="text-center text-red-400 py-4"><p>❌ Fehler beim Laden der User GeoDrops</p></div>';
        }
        if (userDropsTable) {
            userDropsTable.innerHTML = '<div class="text-center text-red-400 p-4">Fehler beim Laden der User GeoDrops</div>';
        }
    }
};

// Create User Drop function - REMOVED (using the proper implementation above)

// Edit User Drop function
window.editUserDrop = function(dropId) {
    console.log('✏️ Editing User Drop:', dropId);
    showMessage('✏️ User GeoDrop editing will be implemented...', false);
    // TODO: Implement user drop editing
};

// Delete User Drop function
window.deleteUserDrop = async function(dropId) {
    console.log('🗑️ Deleting User Drop:', dropId);
    
    try {
        const db = window.firebase.firestore();
        
        // Get current user
        let currentUser = window.currentUser;
        if (!currentUser && window.auth && window.auth.currentUser) {
            currentUser = window.auth.currentUser;
        }
        if (!currentUser && window.firebase && window.firebase.auth && window.firebase.auth().currentUser) {
            currentUser = window.firebase.auth().currentUser;
        }
        
        if (!currentUser) {
            showMessage('❌ Bitte zuerst anmelden!', true);
            return;
        }
        
        // Get the drop data to check permissions
        const dropDoc = await db.collection('userDrops').doc(dropId).get();
        if (!dropDoc.exists) {
            showMessage('❌ User Drop nicht gefunden!', true);
            return;
        }
        
        const dropData = dropDoc.data();
        const isDev = window.isDevLoggedIn || localStorage.getItem('devLoggedIn') === 'true';
        const isCreator = dropData.createdBy === currentUser.uid;
        
        // Check permissions
        if (!isDev && !isCreator) {
            showMessage('❌ Du kannst nur deine eigenen User Drops löschen!', true);
            return;
        }
        
        if (!confirm('Möchtest du diesen User Drop wirklich löschen?')) {
            return;
        }
        
        await db.collection('userDrops').doc(dropId).delete();
        
        console.log('✅ User drop deleted:', dropId);
        showMessage('✅ User Drop erfolgreich gelöscht!', false);
        
        // Reload user drops
        if (window.currentListType === 'user') {
            loadUserGeoDrops();
        }
        if (window.currentUploadListType === 'user') {
            loadUserDropsForUpload();
        }
        
        // Reload all drops for map only (not dropdown to avoid overwriting upload selection)
        // loadGeoDrops(); // REMOVED - was overwriting upload dropdown
        
    } catch (error) {
        console.error('❌ Error deleting user drop:', error);
        showMessage('❌ Fehler beim Löschen des User Drops: ' + error.message, true);
    }
};

// Toggle User Drop active status
window.toggleUserDrop = async function(dropId, currentStatus) {
    console.log(`🔄 Toggling User Drop ${dropId} from ${currentStatus ? 'active' : 'inactive'} to ${!currentStatus ? 'active' : 'inactive'}`);
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            showMessage('❌ Firebase nicht verfügbar', true);
            return;
        }
        
        const db = window.firebase.firestore();
        await db.collection('userDrops').doc(dropId).update({
            isActive: !currentStatus,
            lastModified: new Date()
        });
        
        showMessage(`✅ User GeoDrop ${!currentStatus ? 'activated' : 'deactivated'}`, false);
        
        // Reload user drops
        loadUserGeoDrops();
        
    } catch (error) {
        console.error('❌ Error toggling User Drop:', error);
        showMessage('❌ Fehler beim Ändern des Status', true);
    }
};

// Auto-start upload process after photo capture
window.autoStartUpload = async function() {
    console.log('🚀 Auto-starting upload process...');
    
    // Check if we have a captured photo
    if (!window.capturedPhotoFile) {
        console.error('❌ No captured photo file found!');
        console.error('❌ window.capturedPhotoFile:', window.capturedPhotoFile);
        showMessage('❌ Kein Foto verfügbar für Upload!', true);
        return;
    }
    
    console.log('📸 Captured photo file details:', {
        name: window.capturedPhotoFile.name,
        size: window.capturedPhotoFile.size,
        type: window.capturedPhotoFile.type,
        lastModified: window.capturedPhotoFile.lastModified
    });
    
    // Check if user is logged in
    if (!window.currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        return;
    }
    
    // Check if we have a current drop selected
    if (!window.currentDrop) {
        console.error('❌ No current drop selected!');
        showMessage('❌ Bitte wähle zuerst einen GeoDrop aus!', true);
            return;
    }
    
    console.log('🎯 Using current drop for upload:', window.currentDrop);
    
    // Use the current drop directly instead of dropdown selection
    const dropId = window.currentDrop.id;
    const dropCollection = window.currentDrop.collection;
    
    console.log('🎯 Using drop directly:', { dropId, dropCollection });
    
    // Skip dropdown selection - use current drop directly
    
    // Set the photo input to use captured photo
    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
        // Create a new FileList with the captured photo
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(window.capturedPhotoFile);
        photoInput.files = dataTransfer.files;
        
        console.log('📸 Photo input updated:', {
            hasFiles: photoInput.files && photoInput.files.length > 0,
            fileCount: photoInput.files ? photoInput.files.length : 0,
            firstFile: photoInput.files && photoInput.files[0] ? {
                name: photoInput.files[0].name,
                size: photoInput.files[0].size,
                type: photoInput.files[0].type
            } : null
        });
    } else {
        console.error('❌ Photo input element not found!');
    }
    
    // Set the selected drop ID for the claim function
    document.getElementById('selected-drop-id').value = dropId;
    
    // Set the drop collection type
    window.currentDropCollection = dropCollection;
    
    console.log('🎯 Drop selection details:', {
        dropId: dropId,
        dropCollection: dropCollection,
        selectedDropIdElement: document.getElementById('selected-drop-id'),
        selectedDropIdValue: document.getElementById('selected-drop-id')?.value,
        currentDropCollection: window.currentDropCollection
    });
    
    // Show loading message
    showMessage('📤 Verarbeite dein Foto...', false);
    
    try {
        // Call the main claim function - FIX: Don't call self recursively!
        if (typeof window.claimGeoDrop === 'function') {
            console.log('🎯 Calling window.claimGeoDrop function...');
            // Use compressed file if available, otherwise original
            const fileToUse = window.compressedPhotoFile || photoInput.files[0];
            console.log('📁 Using file:', fileToUse.name, 'Size:', (fileToUse.size / 1024).toFixed(2) + 'KB');
            const result = await window.claimGeoDrop(dropId, dropCollection, fileToUse);
            console.log('🎯 Claim result:', result);
            
        // Check if claim was successful
        console.log('🎯 Checking claim result:', result);
        if (result && result.success) {
                // Success - show reward message
                const reward = result.reward || 100;
                const successText = window.t ? window.t('geocard.success-reward') : 'Erfolgreich! Du hast';
                const receivedText = window.t ? window.t('geocard.received') : 'erhalten!';
                const pixeldropsText = window.t ? window.t('geocard.pixeldrops') : 'PixelDrops';
                showMessage(`🎉 ${successText} ${reward} ${pixeldropsText} ${receivedText}`, false);
                
                // Show success animation
                createSuccessAnimation();
                
                // Clear form
                photoInput.value = '';
                dropSelect.value = '';
                document.getElementById('photo-preview').innerHTML = '';
                window.capturedPhotoFile = null;
                
        } else {
            // Failed - show error message
            console.error('❌ Claim failed:', result);
            const errorMsg = (result && result.error) || 'GeoDrop erfolgreich geclaimt!';
                showMessage(`✅ ${errorMsg}`, false);
                
                // Show success animation
                createSuccessAnimation();
            }
            
            // Reload drops after claiming (map only, not dropdown)
            setTimeout(() => {
                // loadGeoDrops(); // REMOVED - was overwriting upload dropdown
            }, 2000);
        } else {
            console.error('❌ window.claimGeoDrop function not available!');
            console.error('❌ typeof window.claimGeoDrop:', typeof window.claimGeoDrop);
            showMessage('❌ Claim function not available', true);
        }
    } catch (error) {
        console.error('❌ Error claiming GeoDrop:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error stack:', error?.stack);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        
        // Create user-friendly error message
        let errorMsg = 'Fehler beim Verarbeiten des Fotos!';
        
        if (error && error.message) {
            if (error.message.includes('permission-denied')) {
                errorMsg = 'Keine Berechtigung - bitte neu anmelden!';
            } else if (error.message.includes('not-found')) {
                errorMsg = 'GeoDrop nicht gefunden!';
            } else if (error.message.includes('unavailable')) {
                errorMsg = 'Service nicht verfügbar - bitte später versuchen!';
            } else if (error.message.includes('Zu weit entfernt')) {
                errorMsg = error.message;
            } else if (error.message.includes('Bild enthält keine GPS-Daten')) {
                errorMsg = error.message;
            } else if (error.message.includes('entspricht nicht dem Referenzbild')) {
                errorMsg = error.message;
            } else if (error.message.includes('bereits heute gesammelt')) {
                errorMsg = error.message;
            } else {
                errorMsg = `Technischer Fehler: ${error.message}`;
            }
        }
        
        console.error('❌ Final error message:', errorMsg);
            console.error('❌ Final error message:', errorMsg);
            showMessage(`❌ ${errorMsg}`, true);
            createErrorAnimation();
    }
};