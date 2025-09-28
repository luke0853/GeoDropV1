/**
 * Public Place Validator
 * Validiert ob ein Drop an einem öffentlichen Ort erstellt werden kann
 */

class PublicPlaceValidator {
    constructor() {
        this.googlePlacesApiKey = null; // Wird aus config geladen
        this.validationCache = new Map(); // Cache für wiederholte Anfragen
    }

    /**
     * Initialisiert den Validator mit API-Keys
     */
    async initialize() {
        try {
            // Lade Google Places API Key aus config
            if (window.config && window.config.googlePlacesApiKey) {
                this.googlePlacesApiKey = window.config.googlePlacesApiKey;
            } else {
                console.warn('⚠️ Google Places API Key nicht gefunden');
            }
        } catch (error) {
            console.error('❌ Fehler beim Initialisieren des Public Place Validators:', error);
        }
    }

    /**
     * Validiert ob ein Standort öffentlich ist
     * @param {number} lat - Breitengrad
     * @param {number} lng - Längengrad
     * @param {File} photoFile - Optional: Foto zur zusätzlichen Validierung
     * @returns {Promise<Object>} - Validierungsergebnis
     */
    async validatePublicPlace(lat, lng, photoFile = null) {
        const cacheKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        
        // Prüfe Cache zuerst
        if (this.validationCache.has(cacheKey)) {
            console.log('📋 Verwende gecachte Validierung:', cacheKey);
            return this.validationCache.get(cacheKey);
        }

        const result = {
            isValid: false,
            isPublic: false,
            placeType: 'unknown',
            placeName: '',
            confidence: 0,
            methods: [],
            errors: []
        };

        try {
            // Methode 1: Google Places API (falls verfügbar)
            if (this.googlePlacesApiKey) {
                const googleResult = await this.validateWithGooglePlaces(lat, lng);
                if (googleResult.isValid) {
                    result.isPublic = googleResult.isPublic;
                    result.placeType = googleResult.placeType;
                    result.placeName = googleResult.placeName;
                    result.confidence = googleResult.confidence;
                    result.methods.push('google_places');
                }
            }

            // Methode 2: Foto-Validierung (falls Foto vorhanden)
            if (photoFile && window.awsRekognitionService) {
                const photoResult = await this.validateWithPhoto(photoFile);
                if (photoResult.isValid) {
                    result.isPublic = result.isPublic || photoResult.isPublic;
                    result.confidence = Math.max(result.confidence, photoResult.confidence);
                    result.methods.push('photo_analysis');
                }
            }

            // Methode 3: Fallback - Basis-Validierung
            if (result.methods.length === 0) {
                const fallbackResult = await this.validateWithFallback(lat, lng);
                result.isPublic = fallbackResult.isPublic;
                result.placeType = fallbackResult.placeType;
                result.confidence = fallbackResult.confidence;
                result.methods.push('fallback');
            }

            // Finale Entscheidung
            result.isValid = result.isPublic && result.confidence > 0.5;

            // Cache das Ergebnis
            this.validationCache.set(cacheKey, result);
            
            console.log('✅ Public Place Validierung abgeschlossen:', result);
            return result;

        } catch (error) {
            console.error('❌ Fehler bei Public Place Validierung:', error);
            result.errors.push(error.message);
            return result;
        }
    }

    /**
     * Validiert mit Google Places API
     */
    async validateWithGooglePlaces(lat, lng) {
        if (!this.googlePlacesApiKey) {
            throw new Error('Google Places API Key nicht verfügbar');
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
                `location=${lat},${lng}&radius=50&key=${this.googlePlacesApiKey}`
            );
            
            const data = await response.json();
            
            if (data.status !== 'OK') {
                throw new Error(`Google Places API Error: ${data.status}`);
            }

            const places = data.results || [];
            const publicPlaceTypes = [
                'park', 'tourist_attraction', 'museum', 'shopping_mall', 
                'restaurant', 'cafe', 'store', 'gas_station', 'hospital',
                'school', 'university', 'library', 'church', 'mosque',
                'synagogue', 'hindu_temple', 'city_hall', 'courthouse',
                'post_office', 'bank', 'atm', 'pharmacy', 'gym',
                'stadium', 'amusement_park', 'zoo', 'aquarium'
            ];

            let isPublic = false;
            let placeType = 'unknown';
            let placeName = '';
            let confidence = 0;

            for (const place of places) {
                const types = place.types || [];
                const hasPublicType = types.some(type => publicPlaceTypes.includes(type));
                
                if (hasPublicType) {
                    isPublic = true;
                    placeType = types.find(type => publicPlaceTypes.includes(type));
                    placeName = place.name || '';
                    confidence = 0.8; // Google Places ist sehr zuverlässig
                    break;
                }
            }

            return {
                isValid: true,
                isPublic,
                placeType,
                placeName,
                confidence
            };

        } catch (error) {
            console.error('❌ Google Places API Fehler:', error);
            throw error;
        }
    }

    /**
     * Validiert mit Foto-Analyse
     */
    async validateWithPhoto(photoFile) {
        if (!window.awsRekognitionService) {
            throw new Error('AWS Rekognition Service nicht verfügbar');
        }

        try {
            // Analysiere das Foto auf öffentliche Orte
            const analysis = await window.awsRekognitionService.analyzeImageForPublicPlaces(photoFile);
            
            return {
                isValid: true,
                isPublic: analysis.isPublic,
                confidence: analysis.confidence
            };

        } catch (error) {
            console.error('❌ Foto-Validierung Fehler:', error);
            throw error;
        }
    }

    /**
     * Fallback-Validierung basierend auf Koordinaten
     */
    async validateWithFallback(lat, lng) {
        // Einfache Heuristik: Prüfe ob Koordinaten in städtischen Gebieten liegen
        // Dies ist eine sehr grundlegende Validierung
        
        const isUrbanArea = this.isInUrbanArea(lat, lng);
        const isNotResidential = !this.isInResidentialArea(lat, lng);
        
        return {
            isValid: true,
            isPublic: isUrbanArea && isNotResidential,
            placeType: isUrbanArea ? 'urban_area' : 'unknown',
            confidence: 0.3 // Niedrige Konfidenz für Fallback
        };
    }

    /**
     * Prüft ob Koordinaten in städtischem Gebiet liegen
     */
    isInUrbanArea(lat, lng) {
        // Vereinfachte Heuristik - in echter Implementierung würde man
        // eine Datenbank mit städtischen Gebieten verwenden
        return true; // Für jetzt akzeptieren wir alle Koordinaten
    }

    /**
     * Prüft ob Koordinaten in Wohngebiet liegen
     */
    isInResidentialArea(lat, lng) {
        // Vereinfachte Heuristik - in echter Implementierung würde man
        // eine Datenbank mit Wohngebieten verwenden
        return false; // Für jetzt nehmen wir an, dass es nicht in Wohngebiet liegt
    }

    /**
     * Zeigt Validierungsergebnis als Benutzerfreundliche Nachricht
     */
    getValidationMessage(result) {
        if (result.isValid && result.isPublic) {
            return `✅ Standort validiert: ${result.placeName || 'Öffentlicher Ort'} (${result.placeType})`;
        } else if (!result.isPublic) {
            return `❌ Standort ist nicht öffentlich zugänglich. Bitte wähle einen öffentlichen Platz wie Park, Einkaufszentrum oder Sehenswürdigkeit.`;
        } else {
            return `⚠️ Standort konnte nicht validiert werden. Bitte wähle einen eindeutig öffentlichen Platz.`;
        }
    }

    /**
     * Löscht Cache
     */
    clearCache() {
        this.validationCache.clear();
        console.log('🗑️ Public Place Validator Cache geleert');
    }
}

// Globale Instanz erstellen
window.publicPlaceValidator = new PublicPlaceValidator();

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
    if (window.publicPlaceValidator) {
        window.publicPlaceValidator.initialize();
    }
});

