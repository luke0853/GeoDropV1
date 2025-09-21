// User Drop Management Functions

// Edit User Drop function
window.editUserDrop = function(dropId) {
    console.log('✏️ Editing User Drop:', dropId);
    
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
    
    // Show edit modal with current drop data
    showEditUserDropModal(dropId);
};

// Show Edit User Drop Modal
window.showEditUserDropModal = async function(dropId) {
    console.log('✏️ Showing edit user drop modal for:', dropId);
    
    try {
        const db = window.firebase.firestore();
        const dropDoc = await db.collection('userDrops').doc(dropId).get();
        
        if (!dropDoc.exists) {
            showMessage('❌ User Drop nicht gefunden!', true);
            return;
        }
        
        const dropData = dropDoc.data();
        
        // Create edit modal
        const editModal = document.createElement('div');
        editModal.id = 'edit-user-drop-modal';
        editModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: block;';
        editModal.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
                <div style="background: #374151; border-radius: 8px; max-width: 600px; width: 100%; padding: 24px;">
                    <h2 style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 16px; text-align: center;">✏️ User GeoDrop bearbeiten</h2>
                    
                    <div style="space-y: 16px;">
                        <!-- Drop Name -->
                        <div>
                            <label style="color: white; font-weight: bold; margin-bottom: 8px; display: block;">🎯 Drop Name:</label>
                            <input type="text" id="edit-user-drop-name" value="${dropData.name || ''}" style="width: 100%; padding: 12px; background: #4B5563; border: 1px solid #6B7280; border-radius: 6px; color: white; font-size: 16px;">
                        </div>
                        
                        <!-- Photo Description -->
                        <div>
                            <label style="color: white; font-weight: bold; margin-bottom: 8px; display: block;">📸 Was soll fotografiert werden:</label>
                            <textarea id="edit-user-drop-description" style="width: 100%; padding: 12px; background: #4B5563; border: 1px solid #6B7280; border-radius: 6px; color: white; font-size: 16px; height: 80px; resize: vertical;">${dropData.description || ''}</textarea>
                        </div>
                        
                        <!-- Reward -->
                        <div>
                            <label style="color: white; font-weight: bold; margin-bottom: 8px; display: block;">💰 Belohnung (PixelDrops):</label>
                            <input type="number" id="edit-user-drop-reward" value="${dropData.reward || 10}" min="1" max="1000" style="width: 100%; padding: 12px; background: #4B5563; border: 1px solid #6B7280; border-radius: 6px; color: white; font-size: 16px;">
                        </div>
                        
                        <!-- Coordinates -->
                        <div>
                            <label style="color: white; font-weight: bold; margin-bottom: 8px; display: block;">📍 Koordinaten:</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="number" id="edit-user-drop-lat" step="0.000001" value="${dropData.lat || ''}" style="flex: 1; padding: 12px; background: #4B5563; border: 1px solid #6B7280; border-radius: 6px; color: white; font-size: 16px;">
                                <input type="number" id="edit-user-drop-lng" step="0.000001" value="${dropData.lng || ''}" style="flex: 1; padding: 12px; background: #4B5563; border: 1px solid #6B7280; border-radius: 6px; color: white; font-size: 16px;">
                            </div>
                        </div>
                        
                        <!-- Status -->
                        <div>
                            <label style="color: white; font-weight: bold; margin-bottom: 8px; display: block;">📊 Status:</label>
                            <select id="edit-user-drop-status" style="width: 100%; padding: 12px; background: #4B5563; border: 1px solid #6B7280; border-radius: 6px; color: white; font-size: 16px;">
                                <option value="true" ${dropData.isActive ? 'selected' : ''}>✅ Aktiv</option>
                                <option value="false" ${!dropData.isActive ? 'selected' : ''}>❌ Inaktiv</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button onclick="saveUserDropEdit('${dropId}')" style="flex: 1; padding: 12px; background: #10B981; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                            ✅ Änderungen speichern
                        </button>
                        <button onclick="closeEditUserDropModal()" style="flex: 1; padding: 12px; background: #6B7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                            ❌ Abbrechen
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(editModal);
        
    } catch (error) {
        console.error('❌ Error loading user drop for edit:', error);
        showMessage('❌ Fehler beim Laden des User Drops', true);
    }
};

// Close Edit User Drop Modal
window.closeEditUserDropModal = function() {
    const modal = document.getElementById('edit-user-drop-modal');
    if (modal) {
        modal.remove();
    }
};

// Save User Drop Edit
window.saveUserDropEdit = async function(dropId) {
    console.log('💾 Saving user drop edit:', dropId);
    
    // Get form data
    const name = document.getElementById('edit-user-drop-name').value.trim();
    const description = document.getElementById('edit-user-drop-description').value.trim();
    const reward = parseInt(document.getElementById('edit-user-drop-reward').value) || 10;
    const lat = parseFloat(document.getElementById('edit-user-drop-lat').value);
    const lng = parseFloat(document.getElementById('edit-user-drop-lng').value);
    const isActive = document.getElementById('edit-user-drop-status').value === 'true';
    
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
        showMessage('❌ Bitte gib gültige Koordinaten ein!', true);
        return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        showMessage('❌ Ungültige Koordinaten!', true);
        return;
    }
    
    try {
        const db = window.firebase.firestore();
        
        // Update user drop document
        await db.collection('userDrops').doc(dropId).update({
            name: name,
            description: description,
            photoDescription: description,
            reward: reward,
            lat: lat,
            lng: lng,
            isActive: isActive,
            lastModified: new Date()
        });
        
        console.log('✅ User drop updated:', dropId);
        showMessage(`✅ User Drop "${name}" erfolgreich aktualisiert!`, false);
        
        // Close modal
        closeEditUserDropModal();
        
        // Reload user drops
        if (window.currentListType === 'user') {
            loadUserGeoDrops();
        }
        if (window.currentUploadListType === 'user') {
            loadUserDropsForUpload();
        }
        
        // Reload all drops for map and dropdown
        loadGeoDrops();
        
    } catch (error) {
        console.error('❌ Error updating user drop:', error);
        showMessage('❌ Fehler beim Aktualisieren des User Drops: ' + error.message, true);
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
        
        showMessage(`✅ User GeoDrop ${!currentStatus ? 'aktiviert' : 'deaktiviert'}`, false);
        
        // Reload user drops
        if (window.currentListType === 'user') {
            loadUserGeoDrops();
        }
        if (window.currentUploadListType === 'user') {
            loadUserDropsForUpload();
        }
        
        // Reload all drops for map and dropdown
        loadGeoDrops();
        
    } catch (error) {
        console.error('❌ Error toggling User Drop:', error);
        showMessage('❌ Fehler beim Ändern des Status', true);
    }
};
