// GeoCard Map Functions - Map initialization, markers, and map interactions

// Initialize map
window.initializeMap = function() {
    console.log('🗺️ Initializing map...');
    
    // Check if map already exists
    if (window.geoMap) {
        console.log('🗺️ Map already exists, removing...');
        window.geoMap.remove();
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
    
    // Create map centered on Austria
    window.geoMap = L.map('map', mapOptions).setView([47.5162, 14.5501], 7);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
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
    
    // Load GeoDrops after map is ready
    setTimeout(() => {
        loadGeoDrops();
    }, 1000);
};

// Get current location
window.getCurrentLocation = function() {
    console.log('📍 Getting current location...');
    
    if (!navigator.geolocation) {
        showMessage('❌ Geolocation wird von diesem Browser nicht unterstützt!', true);
        return;
    }
    
    showMessage('📍 Standort wird ermittelt...', false);
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            console.log('📍 Location obtained:', { lat, lng, accuracy });
            
            // Update current location
            window.currentLocation = { lat, lng, accuracy };
            
            // Center map on user location
            if (window.geoMap) {
                window.geoMap.setView([lat, lng], 15);
                
                // Add/update location marker
                if (window.locationMarker) {
                    window.geoMap.removeLayer(window.locationMarker);
                }
                
                window.locationMarker = L.marker([lat, lng], {
                    icon: L.divIcon({
                        className: 'location-marker',
                        html: '<div style="background: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(window.geoMap);
                
                // Add popup
                window.locationMarker.bindPopup(`
                    <div class="text-center">
                        <h3 class="font-bold text-green-600">📍 Dein Standort</h3>
                        <p class="text-sm text-gray-600">Genauigkeit: ${Math.round(accuracy)}m</p>
                        <p class="text-xs text-gray-500">${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                    </div>
                `);
            }
            
            showMessage(`✅ Standort ermittelt! Genauigkeit: ${Math.round(accuracy)}m`, false);
        },
        function(error) {
            console.error('❌ Geolocation error:', error);
            let errorMessage = '❌ Standort konnte nicht ermittelt werden!';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '❌ Standortzugriff verweigert! Bitte erlaube den Zugriff in den Browser-Einstellungen.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '❌ Standort nicht verfügbar!';
                    break;
                case error.TIMEOUT:
                    errorMessage = '❌ Zeitüberschreitung beim Ermitteln des Standorts!';
                    break;
            }
            
            showMessage(errorMessage, true);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
};

// Load GeoDrops from Firebase
window.loadGeoDrops = async function() {
    console.log('🗺️ Loading GeoDrops...');
    try {
        if (!window.firebase || !window.firebase.firestore()) {
            console.log('❌ Firebase not available');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Load only devDrops and userDrops (no more "geodrops" collection)
        const devDropsSnapshot = await db.collection('devDrops').where('isAvailable', '==', true).get();
        const userDropsSnapshot = await db.collection('userDrops').where('isActive', '==', true).get();
        
        const allDrops = [];
        devDropsSnapshot.forEach(doc => {
            allDrops.push({ id: doc.id, ...doc.data(), collection: 'devDrops', isDevDrop: true });
        });
        userDropsSnapshot.forEach(doc => {
            allDrops.push({ id: doc.id, ...doc.data(), collection: 'userDrops', isDevDrop: false });
        });
        
        // NOTE: Dropdown update removed - it was overwriting the upload dropdown
        // The upload dropdown is managed by loadDevDropsForUpload() and loadUserDropsForUpload()
        
        // Add drop markers to map
        addDropMarkersToMap(allDrops);
        
        console.log(`✅ Loaded ${allDrops.length} GeoDrops for map and dropdown`);
    } catch (error) {
        console.error('❌ Error loading GeoDrops:', error);
        showMessage('❌ Fehler beim Laden der GeoDrops', true);
    }
};

// Add drop markers to map
function addDropMarkersToMap(drops) {
    console.log('🗺️ Adding drop markers to map');
    
    // Clear existing markers
    if (window.dropMarkers) {
        Object.values(window.dropMarkers).forEach(marker => {
            if (window.geoMap) {
                window.geoMap.removeLayer(marker);
            }
        });
    }
    window.dropMarkers = {};
    
    console.log(`🗺️ Processing ${drops.length} drops for markers...`);
    
    drops.forEach((drop, index) => {
        if (!drop.lat || !drop.lng) {
            console.log(`⚠️ Drop ${drop.id} missing coordinates:`, drop);
            return;
        }
        
        console.log(`🔍 ${drop.collection} drop: ${drop.id} lat: ${drop.lat} lng: ${drop.lng}`);
        
        // Create marker based on drop type
        let markerIcon;
        if (drop.collection === 'devDrops') {
            // Dev drops - larger marker
            markerIcon = L.divIcon({
                className: 'dev-drop-marker',
                html: `
                    <div style="
                        background: linear-gradient(45deg, #3b82f6, #1d4ed8);
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        color: white;
                        font-size: 16px;
                    ">
                        🎯
                    </div>
                `,
                iconSize: [50, 50],
                iconAnchor: [25, 25]
            });
        } else if (drop.collection === 'userDrops') {
            // User drops - medium marker
            markerIcon = L.divIcon({
                className: 'user-drop-marker',
                html: `
                    <div style="
                        background: linear-gradient(45deg, #10b981, #059669);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        color: white;
                        font-size: 14px;
                    ">
                        📍
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
        } else {
            // Default marker
            markerIcon = L.divIcon({
                className: 'default-drop-marker',
                html: `
                    <div style="
                        background: linear-gradient(45deg, #6b7280, #4b5563);
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        color: white;
                        font-size: 12px;
                    ">
                        📍
                    </div>
                `,
                iconSize: [35, 35],
                iconAnchor: [17.5, 17.5]
            });
        }
        
        // Create marker
        const marker = L.marker([drop.lat, drop.lng], { icon: markerIcon });
        
        // Add popup with drop information
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'de';
        const description = getDropDescription(drop, currentLang);
        const place = getDropPlace(drop, currentLang);
        const state = getDropState(drop, currentLang);
        
        const popupContent = `
            <div class="drop-popup" style="min-width: 200px;">
                <div class="flex items-center mb-2">
                    <span class="text-lg mr-2">${drop.collection === 'devDrops' ? '🎯' : '📍'}</span>
                    <h3 class="font-bold text-gray-800">${drop.name || drop.id}</h3>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    <p><strong>📍 Ort:</strong> ${place}</p>
                    <p><strong>🏛️ Bundesland:</strong> ${state}</p>
                    <p><strong>💰 Belohnung:</strong> ${drop.reward || 10} PixelDrops</p>
                </div>
                <div class="text-xs text-gray-500 mb-3">
                    <p><strong>📝 Aufgabe:</strong> ${description}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="claimDropFromMap('${drop.id}', '${drop.collection}')" 
                            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        📸 Claimen
                    </button>
                    <button onclick="navigateToDrop('${drop.lat}', '${drop.lng}')" 
                            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                        🧭 Navigieren
                    </button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Add to map
        marker.addTo(window.geoMap);
        
        // Store marker reference
        window.dropMarkers[drop.id] = marker;
    });
    
    // Fit map to show all markers
    if (drops.length > 0 && window.geoMap) {
        const group = new L.featureGroup(Object.values(window.dropMarkers));
        window.geoMap.fitBounds(group.getBounds().pad(0.1));
    }
    
    console.log(`✅ Added ${Object.keys(window.dropMarkers).length} markers to map`);
    console.log('🗺️ Map bounds:', window.geoMap.getBounds());
    console.log('🗺️ Map center:', window.geoMap.getCenter());
    console.log('🗺️ Map zoom:', window.geoMap.getZoom());
}

// Claim drop from map popup
window.claimDropFromMap = function(dropId, dropCollection) {
    console.log('🎯 Claiming drop from map:', dropId, dropCollection);
    
    // Set current drop
    window.currentDrop = { id: dropId, collection: dropCollection };
    
    // Open camera for photo capture
    openCamera();
};

// Navigate to drop location
window.navigateToDrop = function(lat, lng) {
    console.log('🧭 Navigating to drop:', lat, lng);
    
    if (window.geoMap) {
        window.geoMap.setView([lat, lng], 18);
        
        // Add temporary navigation marker
        if (window.navigationMarker) {
            window.geoMap.removeLayer(window.navigationMarker);
        }
        
        window.navigationMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'navigation-marker',
                html: '<div style="background: #f59e0b; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);"></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(window.geoMap);
        
        // Remove navigation marker after 5 seconds
        setTimeout(() => {
            if (window.navigationMarker) {
                window.geoMap.removeLayer(window.navigationMarker);
                window.navigationMarker = null;
            }
        }, 5000);
    }
    
    showMessage('🧭 Navigation gestartet! Folge der Karte zum GeoDrop.', false);
};
