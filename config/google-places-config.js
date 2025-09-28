/**
 * Google Places API Configuration
 * Konfiguration für die Google Places API zur Standortvalidierung
 */

// Google Places API Konfiguration
window.GOOGLE_PLACES_CONFIG = {
    // API Key - wird aus Umgebungsvariablen oder config geladen
    apiKey: null, // Wird zur Laufzeit gesetzt
    
    // API Einstellungen
    settings: {
        // Suchradius in Metern
        searchRadius: 50,
        
        // Maximale Anzahl Ergebnisse
        maxResults: 5,
        
        // Minimale Konfidenz für öffentliche Orte
        minConfidence: 0.7,
        
        // Cache-Dauer in Millisekunden (1 Stunde)
        cacheDuration: 60 * 60 * 1000,
        
        // Fallback-Validierung aktivieren
        enableFallback: true
    },
    
    // Öffentliche Ortstypen (Google Places API Types)
    publicPlaceTypes: [
        'park', 'tourist_attraction', 'museum', 'shopping_mall', 
        'restaurant', 'cafe', 'store', 'gas_station', 'hospital',
        'school', 'university', 'library', 'church', 'mosque',
        'synagogue', 'hindu_temple', 'city_hall', 'courthouse',
        'post_office', 'bank', 'atm', 'pharmacy', 'gym',
        'stadium', 'amusement_park', 'zoo', 'aquarium',
        'airport', 'train_station', 'bus_station', 'subway_station',
        'beach', 'marina', 'campground', 'rv_park'
    ],
    
    // Private Ortstypen (werden abgelehnt)
    privatePlaceTypes: [
        'residential', 'home', 'apartment', 'house'
    ],
    
    // Fehlermeldungen
    messages: {
        noApiKey: 'Google Places API Key nicht konfiguriert',
        apiError: 'Fehler bei der Standortvalidierung',
        notPublic: 'Standort ist nicht öffentlich zugänglich',
        validationFailed: 'Standortvalidierung fehlgeschlagen',
        success: 'Standort erfolgreich validiert'
    }
};

// Initialisierung der Google Places API
document.addEventListener('DOMContentLoaded', function() {
    // Lade API Key aus verschiedenen Quellen
    loadGooglePlacesApiKey();
});

/**
 * Lädt den Google Places API Key aus verschiedenen Quellen
 */
function loadGooglePlacesApiKey() {
    try {
        // 1. Versuche aus Umgebungsvariablen (falls verfügbar)
        if (typeof process !== 'undefined' && process.env && process.env.GOOGLE_PLACES_API_KEY) {
            window.GOOGLE_PLACES_CONFIG.apiKey = process.env.GOOGLE_PLACES_API_KEY;
            console.log('✅ Google Places API Key aus Umgebungsvariablen geladen');
            return;
        }
        
        // 2. Versuche aus config-secrets.js
        if (window.config && window.config.googlePlacesApiKey) {
            window.GOOGLE_PLACES_CONFIG.apiKey = window.config.googlePlacesApiKey;
            console.log('✅ Google Places API Key aus config geladen');
            return;
        }
        
        // 3. Versuche aus localStorage (für Entwicklung)
        const storedKey = localStorage.getItem('googlePlacesApiKey');
        if (storedKey) {
            window.GOOGLE_PLACES_CONFIG.apiKey = storedKey;
            console.log('✅ Google Places API Key aus localStorage geladen');
            return;
        }
        
        console.warn('⚠️ Google Places API Key nicht gefunden. Standortvalidierung wird eingeschränkt funktionieren.');
        
    } catch (error) {
        console.error('❌ Fehler beim Laden des Google Places API Keys:', error);
    }
}

/**
 * Setzt den Google Places API Key manuell
 * @param {string} apiKey - Der API Key
 */
function setGooglePlacesApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
        throw new Error('Ungültiger API Key');
    }
    
    window.GOOGLE_PLACES_CONFIG.apiKey = apiKey;
    console.log('✅ Google Places API Key manuell gesetzt');
}

/**
 * Prüft ob Google Places API verfügbar ist
 * @returns {boolean}
 */
function isGooglePlacesApiAvailable() {
    return !!(window.GOOGLE_PLACES_CONFIG.apiKey);
}

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GOOGLE_PLACES_CONFIG,
        loadGooglePlacesApiKey,
        setGooglePlacesApiKey,
        isGooglePlacesApiAvailable
    };
}

