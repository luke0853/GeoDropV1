// GeoCard Upload Functions - Upload, claim, and user drop creation

// Auto-start upload process
window.autoStartUpload = async function() {
    console.log('🚀 Auto-starting upload process...');
    
    // Get current drop data
    const currentDrop = window.currentDrop;
    if (!currentDrop) {
        console.error('❌ No current drop selected');
        showMessage('❌ Kein GeoDrop ausgewählt!', true);
        return;
    }
    
    console.log('🎯 Using current drop for upload:', currentDrop);
    
    // Get captured photo file
    if (!window.capturedPhotoFile) {
        console.error('❌ No captured photo file');
        showMessage('❌ Kein Foto aufgenommen!', true);
        return;
    }
    
    console.log('📸 Captured photo file details:', {
        name: window.capturedPhotoFile.name,
        size: window.capturedPhotoFile.size,
        type: window.capturedPhotoFile.type,
        lastModified: window.capturedPhotoFile.lastModified
    });
    
    try {
        // Set current drop for claim process
        window.currentDrop = currentDrop;
        
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
        }
        
        // Set selected drop ID for claim process
        const selectedDropIdElement = document.getElementById('selected-drop-id');
        if (selectedDropIdElement) {
            selectedDropIdElement.value = currentDrop.id;
            console.log('🎯 Selected drop ID set to:', currentDrop.id);
        }
        
        // Get drop selection details
        const dropId = currentDrop.id;
        const dropCollection = currentDrop.collection;
        
        console.log('🎯 Drop selection details:', {
            dropId: dropId,
            dropCollection: dropCollection,
            selectedDropIdElement: selectedDropIdElement,
            selectedDropIdValue: selectedDropIdElement ? selectedDropIdElement.value : null,
            currentDropCollection: currentDrop.collection
        });
        
        console.log('🎯 Calling window.claimGeoDrop function...');
        
        // Use compressed file if available, otherwise original
        const fileToUse = window.compressedPhotoFile || photoInput.files[0];
        console.log('📁 Using file:', fileToUse.name, 'Size:', (fileToUse.size / 1024).toFixed(2) + 'KB');
        const result = await window.claimGeoDrop(dropId, dropCollection, fileToUse);
        console.log('🎯 Claim result:', result);
        
        // Check if claim was successful
        console.log('🎯 Checking claim result:', result);
        if (result && result.success) {
            try {
                // Success - show reward message
                const reward = result.reward || 100;
                const successText = window.t ? window.t('geocard.success-reward') : 'Erfolgreich! Du hast';
                const receivedText = window.t ? window.t('geocard.received') : 'erhalten!';
                const pixeldropsText = window.t ? window.t('geocard.pixeldrops') : 'PixelDrops';
                showMessage(`🎉 ${successText} ${reward} ${pixeldropsText} ${receivedText}`, false);
                
                // Show success animation
                createSuccessAnimation();
                
                // Clear form - SAFE VERSION
                photoInput.value = '';
                const dropSelect = document.getElementById('geocard-drop-select-de') || document.getElementById('geocard-drop-select-en');
                if (dropSelect) dropSelect.value = '';
                document.getElementById('photo-preview').innerHTML = '';
                window.capturedPhotoFile = null;
            } catch (error) {
                console.error('❌ Error in success handling:', error);
                showMessage('❌ Fehler beim Verarbeiten der Belohnung', true);
            }
                
        } else {
            // Failed - show error message
            console.error('❌ Claim failed:', result);
            const errorMsg = (result && result.error) || 'GeoDrop erfolgreich geclaimt!';
                showMessage(`✅ ${errorMsg}`, false);
                
                // Show success animation
                createSuccessAnimation();
        }
        
    } catch (error) {
        console.error('❌ Error claiming GeoDrop:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Full error object:', error);
        
        let errorMessage = '❌ Technischer Fehler beim Claimen des GeoDrops';
        
        if (error.message) {
            errorMessage += ': ' + error.message;
        }
        
        console.error('❌ Final error message:', errorMessage);
        console.error('❌ Final error message:', errorMessage);
        
        showMessage(errorMessage, true);
        
        // Show error animation
        createErrorAnimation();
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
    
    // GLOBAL DUPLICATE PREVENTION FLAG
    if (window.userDropCreationInProgress) {
        console.log('⚠️ User Drop creation already in progress globally, ignoring duplicate click');
        showMessage('⚠️ User Drop wird bereits erstellt, bitte warten...', true);
        return;
    }
    window.userDropCreationInProgress = true;
    
    // Check if user is logged in
    if (!window.currentUser) {
        showMessage('❌ Bitte zuerst anmelden!', true);
        if (createButton) {
            createButton.disabled = false;
            createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
            createButton.style.opacity = '1';
        }
        window.userDropCreationInProgress = false;
        return;
    }
    
    try {
        // Get form data
        const nameInput = document.getElementById('user-drop-name');
        const descriptionInput = document.getElementById('user-drop-description');
        const latInput = document.getElementById('user-drop-lat');
        const lngInput = document.getElementById('user-drop-lng');
        const referenceImageInput = document.getElementById('user-drop-reference-image');
        
        if (!nameInput || !descriptionInput || !latInput || !lngInput) {
            showMessage('❌ Bitte alle Felder ausfüllen!', true);
            if (createButton) {
                createButton.disabled = false;
                createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
                createButton.style.opacity = '1';
            }
            window.userDropCreationInProgress = false;
            return;
        }
        
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const lat = parseFloat(latInput.value);
        const lng = parseFloat(lngInput.value);
        
        if (!name || !description || isNaN(lat) || isNaN(lng)) {
            showMessage('❌ Bitte alle Felder korrekt ausfüllen!', true);
            if (createButton) {
                createButton.disabled = false;
                createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
                createButton.style.opacity = '1';
            }
            window.userDropCreationInProgress = false;
            return;
        }
        
        // Check minimum distance to existing drops
        const distanceCheck = await checkMinimumDistance(lat, lng, 50); // 50 meters minimum
        if (!distanceCheck.isValid) {
            showMessage(`❌ Zu nah an einem anderen Drop! Mindestabstand: 50m, nächster Drop: ${Math.round(distanceCheck.distance)}m`, true);
            if (createButton) {
                createButton.disabled = false;
                createButton.textContent = window.t ? window.t('geocard.create-user-drop') : '✅ User Drop erstellen';
                createButton.style.opacity = '1';
            }
            window.userDropCreationInProgress = false;
            return;
        }
        
        // Upload reference image if provided
        let referenceImageUrl = null;
        if (referenceImageInput && referenceImageInput.files && referenceImageInput.files.length > 0) {
            console.log('📸 Uploading reference image...');
            const referenceImageFile = referenceImageInput.files[0];
            
            // Compress image if needed
            const compressedFile = await compressImage(referenceImageFile);
            
            const referenceImageRef = window.firebase.storage().ref(`referenzbilder_userdrop/${name.replace(/\s+/g, '_')}.jpg`);
            const referenceImageSnapshot = await referenceImageRef.put(compressedFile);
            referenceImageUrl = await referenceImageSnapshot.ref.getDownloadURL();
            console.log('✅ Reference image uploaded:', referenceImageUrl);
        }
        
        // Get current language
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
        
        // Create user drop data
        const userDropData = {
            name: name,
            description: description,
            photoDescription: description,
            lat: lat,
            lng: lng,
            coordinates: new window.firebase.firestore.GeoPoint(lat, lng),
            reward: 10, // Fixed reward for user drops
            createdBy: window.currentUser.uid,
            createdByName: window.currentUser.displayName || window.currentUser.email,
            createdByEmail: window.currentUser.email,
            ersteller: window.userProfile?.username || window.currentUser.displayName || 'User',
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            dropType: 'user',
            referenceImage: referenceImageUrl,
            // Dual language fields
            language: currentLang,
            description_de: currentLang === 'de' ? description : null,
            description_en: currentLang === 'en' ? description : null,
            photoDescription_de: currentLang === 'de' ? description : null,
            photoDescription_en: currentLang === 'en' ? description : null,
            claimedBy: null,
            lastClaimDate: null
        };
        
        console.log('💾 Saving user drop data:', userDropData);
        
        const docRef = await window.firebase.firestore().collection('userDrops').add(userDropData);
        
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
        
        // RESET GLOBAL DUPLICATE PREVENTION FLAG
        window.userDropCreationInProgress = false;
    }
};

// Show create user drop modal
window.showCreateUserDropModal = async function() {
    console.log('➕ Showing create user drop modal');
    const modal = document.getElementById('create-user-drop-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Get current location if available
        if (window.currentLocation) {
            const latInput = document.getElementById('user-drop-lat');
            const lngInput = document.getElementById('user-drop-lng');
            if (latInput && lngInput) {
                latInput.value = window.currentLocation.lat.toFixed(6);
                lngInput.value = window.currentLocation.lng.toFixed(6);
                console.log('📍 Current location set in form:', window.currentLocation);
            }
        }
    }
};

// Close create user drop modal
window.closeCreateUserDropModal = function() {
    console.log('❌ Closing create user drop modal');
    const modal = document.getElementById('create-user-drop-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// Update claim button based on dropdown selection
window.updateClaimButton = function() {
    console.log('🔄 updateClaimButton called');
    
    // Get current language
    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
    console.log('🎯 Using', currentLang === 'de' ? 'German' : 'English', 'dropdown');
    
    // Get the active dropdown
    const germanSelect = document.getElementById('geocard-drop-select-de');
    const englishSelect = document.getElementById('geocard-drop-select-en');
    
    let activeSelect = null;
    if (currentLang === 'de' && germanSelect && germanSelect.style.display !== 'none') {
        activeSelect = germanSelect;
    } else if (currentLang === 'en' && englishSelect && englishSelect.style.display !== 'none') {
        activeSelect = englishSelect;
    }
    
    if (!activeSelect) {
        console.log('❌ No active dropdown found');
        return;
    }
    
    console.log('🎯 Active select element:', activeSelect);
    
    const selectedValue = activeSelect.value;
    console.log('🎯 Selected drop value:', selectedValue);
    
    if (!selectedValue || selectedValue === '') {
        console.log('❌ No drop selected');
        return;
    }
    
    // Parse selected value (format: "collection:id")
    const [collection, id] = selectedValue.split(':');
    console.log('📋 Drop collection:', collection);
    console.log('📋 Drop ID:', id);
    
    // Set current drop
    window.currentDrop = { id: id, collection: collection };
    console.log('✅ Current drop set for AR module:', window.currentDrop);
    
    // Update claim button
    const claimButton = document.getElementById('claim-geodrop-btn');
    if (claimButton) {
        claimButton.disabled = false;
        claimButton.textContent = '📸 GeoDrop Claimen';
        claimButton.style.opacity = '1';
    }
};

// Handle photo capture request
window.handlePhotoCapture = function() {
    console.log('📸 Photo capture requested - opening camera');
    
    if (!window.currentDrop) {
        showMessage('❌ Bitte wähle zuerst einen GeoDrop aus!', true);
        return;
    }
    
    console.log('📸 Opening camera with AR contour overlay...');
    openCamera();
};
