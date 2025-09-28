// GeoCard Core Functions - Basic utilities and core functionality

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

// Get drop place based on current language
function getDropPlace(drop, currentLang) {
    // If dual language fields exist, use them
    if (currentLang === 'de' && drop.place_de) {
        return drop.place_de;
    } else if (currentLang === 'en' && drop.place_en) {
        return drop.place_en;
    }
    
    // Fallback to original place
    if (drop.place) {
        return drop.place;
    }
    
    // Final fallback
    return currentLang === 'en' ? 'Location' : 'Standort';
}

// Get drop state based on current language
function getDropState(drop, currentLang) {
    // If dual language fields exist, use them
    if (currentLang === 'de' && drop.state_de) {
        return drop.state_de;
    } else if (currentLang === 'en' && drop.state_en) {
        return drop.state_en;
    }
    
    // Fallback to original state
    if (drop.state) {
        return drop.state;
    }
    
    // Final fallback
    return currentLang === 'en' ? 'State' : 'Bundesland';
}

// Check minimum distance to existing drops
async function checkMinimumDistance(lat, lng, minDistanceMeters) {
    console.log('🔍 Checking minimum distance to existing drops...');
    console.log('📍 Current position:', { lat, lng });
    console.log('📏 Minimum distance required:', minDistanceMeters, 'meters');
    
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return {
                isValid: true,
                distance: 0,
                nearestDrop: null
            };
        }
        
        const db = window.firebase.firestore();
        
        // Check both devDrops and userDrops
        const [devDropsSnapshot, userDropsSnapshot] = await Promise.all([
            db.collection('devDrops').where('isActive', '==', true).get(),
            db.collection('userDrops').where('isActive', '==', true).get()
        ]);
        
        let nearestDistance = Infinity;
        let nearestDrop = null;
        
        // Check dev drops
        devDropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.lat && data.lng) {
                const distance = calculateDistance(lat, lng, data.lat, data.lng);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestDrop = { id: doc.id, ...data, collection: 'devDrops' };
                }
            }
        });
        
        // Check user drops
        userDropsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.lat && data.lng) {
                const distance = calculateDistance(lat, lng, data.lat, data.lng);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestDrop = { id: doc.id, ...data, collection: 'userDrops' };
                }
            }
        });
        
        console.log('📏 Nearest drop distance:', nearestDistance, 'meters');
        console.log('📍 Nearest drop:', nearestDrop);
        
        const isValid = nearestDistance >= minDistanceMeters;
        
        return {
            isValid,
            distance: nearestDistance,
            nearestDrop: nearestDrop
        };
        
    } catch (error) {
        console.error('❌ Error checking minimum distance:', error);
        return {
            isValid: true,
            distance: 0,
            nearestDrop: null
        };
    }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
}

// Create success animation
function createSuccessAnimation() {
    const animation = document.createElement('div');
    animation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #10b981, #059669);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        animation: successPulse 2s ease-in-out;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
    `;
    animation.innerHTML = '🎉 Erfolgreich!';
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPulse {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
        document.body.removeChild(animation);
        document.head.removeChild(style);
    }, 2000);
}

// Create error animation
function createErrorAnimation() {
    const animation = document.createElement('div');
    animation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ef4444, #dc2626);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        animation: errorShake 2s ease-in-out;
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.5);
    `;
    animation.innerHTML = '❌ Fehler!';
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes errorShake {
            0%, 100% { transform: translate(-50%, -50%) translateX(0); }
            25% { transform: translate(-50%, -50%) translateX(-10px); }
            75% { transform: translate(-50%, -50%) translateX(10px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(animation);
    
    setTimeout(() => {
        document.body.removeChild(animation);
        document.head.removeChild(style);
    }, 2000);
}

// Mark drop as claimed (visual feedback)
function markDropAsClaimed(dropId, dropCollection) {
    console.log('🎯 Marking drop as claimed:', dropId, dropCollection);
    
    // Update map marker
    if (window.dropMarkers && window.dropMarkers[dropId]) {
        const marker = window.dropMarkers[dropId];
        marker.setIcon({
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#666666" stroke="#333333" stroke-width="2"/>
                    <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">✓</text>
                </svg>
            `),
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    }
    
    // Update dropdown options
    const dropdowns = [
        document.getElementById('geocard-drop-select-de'),
        document.getElementById('geocard-drop-select-en'),
        document.getElementById('dev-drop-select'),
        document.getElementById('user-drop-select')
    ];
    
    dropdowns.forEach(dropdown => {
        if (dropdown) {
            const option = dropdown.querySelector(`option[value="${dropCollection}:${dropId}"]`);
            if (option) {
                option.style.opacity = '0.5';
                option.style.textDecoration = 'line-through';
                option.disabled = true;
            }
        }
    });
    
    console.log('✅ Drop marked as claimed');
}

// Compress image for upload
function compressImage(file, maxSizeMB = 1, maxWidth = 1920, maxHeight = 1080) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            // Dynamic quality based on file size
            let quality = 0.8;
            if (file.size > 20 * 1024 * 1024) { // > 20MB
                quality = 0.6;
            } else if (file.size > 10 * 1024 * 1024) { // > 10MB
                quality = 0.7;
            }
            
            canvas.toBlob((blob) => {
                const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });
                
                console.log(`📦 Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                resolve(compressedFile);
            }, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}
